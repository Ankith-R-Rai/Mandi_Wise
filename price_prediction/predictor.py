import os
from datetime import date
from typing import Dict, Any, Optional
import joblib
import pandas as pd
from sqlalchemy.orm import Session

from backend.config import settings
from database.models import HistoricalMandiPrice
from price_prediction.features import engineer_price_features


def predict_mandi_price(
    db: Session,
    vegetable_name: str,
    mandi_name: str,
    target_date: date,
    grade: Optional[str] = None,
    allow_demo_fallback: bool = False,
) -> Dict[str, Any]:
    """
    Predicts expected modal price using trained XGBoost/RandomForest artifact and recent
    observed market history. Clearly reports if prediction is market-baseline (not grade-specific)
    or if insufficient verified data exists.
    """
    baseline_path = os.path.join(settings.MODEL_ARTIFACTS_DIR, "price_baseline_model.joblib")
    grade_path = os.path.join(settings.MODEL_ARTIFACTS_DIR, "price_grade_aware_model.joblib")

    q = db.query(HistoricalMandiPrice).filter(
        HistoricalMandiPrice.vegetable_name == vegetable_name,
        HistoricalMandiPrice.mandi_name == mandi_name,
    )
    if not allow_demo_fallback:
        q = q.filter(HistoricalMandiPrice.is_demo == False)  # noqa: E712

    history = q.order_by(HistoricalMandiPrice.arrival_date.asc()).all()
    if not history and allow_demo_fallback:
        history = (
            db.query(HistoricalMandiPrice)
            .filter(
                HistoricalMandiPrice.vegetable_name == vegetable_name,
                HistoricalMandiPrice.mandi_name == mandi_name,
            )
            .order_by(HistoricalMandiPrice.arrival_date.asc())
            .all()
        )

    if not history:
        return {
            "predicted_modal_price": None,
            "predicted_min_price": None,
            "predicted_max_price": None,
            "is_grade_specific": False,
            "model_type": "insufficient_data",
            "model_version": "none",
            "is_demo_based": False,
            "latest_observed": None,
            "reliability_note": (
                f"No historical price records found for {vegetable_name} at {mandi_name}. "
                "Sync AGMARKNET data via data.gov.in or upload a historical CSV."
            ),
        }

    is_demo_based = any(r.is_demo for r in history)
    latest = history[-1]
    latest_obs = {
        "arrival_date": latest.arrival_date.isoformat(),
        "min_price": latest.min_price,
        "max_price": latest.max_price,
        "modal_price": latest.modal_price,
        "unit": latest.unit,
        "source": latest.source,
    }

    use_grade_model = os.path.exists(grade_path) and grade in {"Grade A", "Grade B", "Grade C"}
    artifact_path = grade_path if use_grade_model else baseline_path

    if not os.path.exists(artifact_path):
        return {
            "predicted_modal_price": None,
            "predicted_min_price": None,
            "predicted_max_price": None,
            "is_grade_specific": False,
            "model_type": "model_untrained",
            "model_version": "pending-training",
            "is_demo_based": is_demo_based,
            "latest_observed": latest_obs,
            "reliability_note": (
                "Historical records exist, but the price ML model has not been trained yet. "
                "Trigger POST /api/models/train-price from Dataset & Model Management."
            ),
        }

    artifact = joblib.load(artifact_path)
    df = pd.DataFrame([{
        "vegetable_name": r.vegetable_name,
        "mandi_name": r.mandi_name,
        "arrival_date": r.arrival_date,
        "min_price": r.min_price,
        "max_price": r.max_price,
        "modal_price": r.modal_price,
        "reported_grade": r.reported_grade,
    } for r in history])

    # Append target prediction row so engineer_price_features computes true past-only lags
    target_row = pd.DataFrame([{
        "vegetable_name": vegetable_name,
        "mandi_name": mandi_name,
        "arrival_date": target_date,
        "min_price": latest.min_price,
        "max_price": latest.max_price,
        "modal_price": latest.modal_price,
        "reported_grade": grade or "FAQ",
    }])
    combined = pd.concat([df, target_row], ignore_index=True)
    feat = engineer_price_features(combined, include_grade=use_grade_model)
    pred_row = feat.iloc[[-1]]

    cols = artifact["cat_cols"] + artifact["num_cols"]
    pred_modal = float(artifact["pipeline"].predict(pred_row[cols])[0])
    rmse = artifact["metrics"].get("rmse", 0.0)

    note = (
        f"Grade-aware ML estimate ({artifact['algorithm']}) incorporating verified grade labels."
        if use_grade_model
        else (
            f"Baseline ML estimate ({artifact['algorithm']}) trained on AGMARKNET historical prices. "
            "AGMARKNET records do not carry standardized Grade A/B/C labels, so this estimate is "
            "NOT grade-specific; high/low visual grades typically trade closer to the observed mandi max/min band."
        )
    )
    if is_demo_based:
        note = "[DEMO DATA WARNING] Computed using demonstration sample records, not live mandi feeds. " + note

    return {
        "predicted_modal_price": round(max(0.0, pred_modal), 2),
        "predicted_min_price": round(max(0.0, pred_modal - rmse), 2),
        "predicted_max_price": round(max(0.0, pred_modal + rmse), 2),
        "is_grade_specific": use_grade_model,
        "model_type": artifact["algorithm"],
        "model_version": artifact["version"],
        "model_metrics": artifact["metrics"],
        "is_demo_based": is_demo_based,
        "latest_observed": latest_obs,
        "reliability_note": note,
    }
