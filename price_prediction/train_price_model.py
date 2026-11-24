import os
from datetime import datetime
import joblib
import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, root_mean_squared_error, r2_score
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder
from sqlalchemy.orm import Session
from xgboost import XGBRegressor

from backend.config import settings
from database.models import HistoricalMandiPrice, ModelEvaluationResult
from price_prediction.features import engineer_price_features


def train_and_evaluate_price_models(db: Session, exclude_demo: bool = True) -> dict:
    """
    Trains baseline XGBoost/RandomForest model on verified AGMARKNET historical records.
    If verified grade-specific records (Grade A/B/C) exist, trains and compares a grade-aware model.
    """
    q = db.query(HistoricalMandiPrice)
    if exclude_demo:
        q = q.filter(HistoricalMandiPrice.is_demo == False)  # noqa: E712
    records = q.all()

    if len(records) < 30:
        return {
            "status": "INSUFFICIENT_VERIFIED_DATA",
            "records_available": len(records),
            "message": "Need at least 30 verified historical price records to train and evaluate a temporal price model.",
        }

    df = pd.DataFrame([{
        "vegetable_name": r.vegetable_name,
        "mandi_name": r.mandi_name,
        "state": r.state,
        "arrival_date": r.arrival_date,
        "min_price": r.min_price,
        "max_price": r.max_price,
        "modal_price": r.modal_price,
        "reported_grade": r.reported_grade,
    } for r in records])

    feat_df = engineer_price_features(df, include_grade=False)
    if len(feat_df) < 20:
        return {"status": "INSUFFICIENT_HISTORY_FOR_LAGS", "records_available": len(feat_df)}

    # Chronological 80/20 split (never random split on time series)
    cutoff_date = feat_df["arrival_date"].quantile(0.8)
    train_df = feat_df[feat_df["arrival_date"] <= cutoff_date]
    test_df = feat_df[feat_df["arrival_date"] > cutoff_date]
    if len(test_df) < 5:
        split_idx = int(len(feat_df) * 0.8)
        train_df, test_df = feat_df.iloc[:split_idx], feat_df.iloc[split_idx:]

    cat_cols = ["vegetable_name", "mandi_name"]
    num_cols = [
        "lag_1_modal", "lag_3_modal", "lag_7_modal",
        "rolling_7_mean", "rolling_7_std", "prev_spread",
        "sin_doy", "cos_doy", "day_of_week", "month"
    ]

    preprocessor = ColumnTransformer([
        ("cat", OneHotEncoder(handle_unknown="ignore"), cat_cols),
        ("num", "passthrough", num_cols),
    ])

    candidates = {
        "xgboost": XGBRegressor(n_estimators=200, max_depth=5, learning_rate=0.06, random_state=42),
        "random_forest": RandomForestRegressor(n_estimators=200, random_state=42, n_jobs=-1),
    }

    best_name, best_pipe, best_metrics = None, None, None
    for name, reg in candidates.items():
        pipe = Pipeline([("prep", preprocessor), ("reg", reg)])
        pipe.fit(train_df[cat_cols + num_cols], train_df["modal_price"])
        preds = pipe.predict(test_df[cat_cols + num_cols])
        metrics = {
            "mae": round(float(mean_absolute_error(test_df["modal_price"], preds)), 2),
            "rmse": round(float(root_mean_squared_error(test_df["modal_price"], preds)), 2),
            "r2": round(float(r2_score(test_df["modal_price"], preds)), 4),
            "train_rows": int(len(train_df)),
            "test_rows": int(len(test_df)),
            "is_grade_specific": False,
        }
        if best_metrics is None or metrics["rmse"] < best_metrics["rmse"]:
            best_name, best_pipe, best_metrics = name, pipe, metrics

    os.makedirs(settings.MODEL_ARTIFACTS_DIR, exist_ok=True)
    version = datetime.utcnow().strftime("v%Y%m%d%H%M")
    artifact_path = os.path.join(settings.MODEL_ARTIFACTS_DIR, "price_baseline_model.joblib")
    joblib.dump({
        "pipeline": best_pipe,
        "algorithm": best_name,
        "version": version,
        "cat_cols": cat_cols,
        "num_cols": num_cols,
        "metrics": best_metrics,
        "is_grade_specific": False,
    }, artifact_path)

    db.add(ModelEvaluationResult(
        model_name="price_baseline",
        model_version=version,
        status="TRAINED",
        dataset_name="AGMARKNET_VERIFIED_HISTORY",
        metrics_json=best_metrics,
    ))

    # Grade-aware experiment ONLY if genuine A/B/C grade labels exist in historical records
    grade_rows = df[df["reported_grade"].isin(["Grade A", "Grade B", "Grade C"])]
    grade_exp_summary = None
    if len(grade_rows) >= 30:
        g_feat = engineer_price_features(grade_rows, include_grade=True)
        g_cut = g_feat["arrival_date"].quantile(0.8)
        g_train, g_test = g_feat[g_feat["arrival_date"] <= g_cut], g_feat[g_feat["arrival_date"] > g_cut]
        if len(g_test) >= 5:
            g_cat = ["vegetable_name", "mandi_name", "grade_feature"]
            g_prep = ColumnTransformer([
                ("cat", OneHotEncoder(handle_unknown="ignore"), g_cat),
                ("num", "passthrough", num_cols),
            ])
            g_pipe = Pipeline([
                ("prep", g_prep),
                ("reg", XGBRegressor(n_estimators=200, max_depth=5, learning_rate=0.06, random_state=42)),
            ])
            g_pipe.fit(g_train[g_cat + num_cols], g_train["modal_price"])
            g_preds = g_pipe.predict(g_test[g_cat + num_cols])
            g_metrics = {
                "mae": round(float(mean_absolute_error(g_test["modal_price"], g_preds)), 2),
                "rmse": round(float(root_mean_squared_error(g_test["modal_price"], g_preds)), 2),
                "r2": round(float(r2_score(g_test["modal_price"], g_preds)), 4),
                "train_rows": int(len(g_train)),
                "test_rows": int(len(g_test)),
                "is_grade_specific": True,
                "improved_over_baseline_rmse": bool(
                    float(root_mean_squared_error(g_test["modal_price"], g_preds)) < best_metrics["rmse"]
                ),
            }
            joblib.dump({
                "pipeline": g_pipe,
                "algorithm": "xgboost_grade_aware",
                "version": version,
                "cat_cols": g_cat,
                "num_cols": num_cols,
                "metrics": g_metrics,
                "is_grade_specific": True,
            }, os.path.join(settings.MODEL_ARTIFACTS_DIR, "price_grade_aware_model.joblib"))

            db.add(ModelEvaluationResult(
                model_name="price_grade_aware",
                model_version=version,
                status="TRAINED",
                dataset_name="VERIFIED_GRADE_LABELED_PRICES",
                metrics_json=g_metrics,
            ))
            grade_exp_summary = g_metrics

    db.commit()
    return {
        "status": "TRAINED",
        "baseline_algorithm": best_name,
        "baseline_metrics": best_metrics,
        "grade_aware_experiment": grade_exp_summary or "Skipped (no verified Grade A/B/C price records available).",
    }
