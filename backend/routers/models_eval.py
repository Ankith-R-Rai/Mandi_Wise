import json
import os
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.config import settings
from computer_vision.inference import vision_service
from database.models import ModelEvaluationResult
from database.session import get_db

router = APIRouter(prefix="/api/models", tags=["Model Status & Evaluation"])


@router.get("/status")
def get_models_status():
    cv_status = vision_service.get_status()
    baseline_price_exists = os.path.exists(os.path.join(settings.MODEL_ARTIFACTS_DIR, "price_baseline_model.joblib"))
    grade_price_exists = os.path.exists(os.path.join(settings.MODEL_ARTIFACTS_DIR, "price_grade_aware_model.joblib"))
    return {
        **cv_status,
        "price_baseline": {
            "architecture": "XGBoost / RandomForest Regressor",
            "status": "TRAINED" if baseline_price_exists else "UNTRAINED_PENDING",
        },
        "price_grade_aware": {
            "architecture": "XGBoost Grade-Aware Experiment",
            "status": "TRAINED" if grade_price_exists else "UNTRAINED_PENDING",
        },
    }


@router.get("/evaluation")
def get_model_evaluations(db: Session = Depends(get_db)):
    db_evals = db.query(ModelEvaluationResult).order_by(ModelEvaluationResult.evaluated_at.desc()).all()
    cv_reports = {}
    for key, fname in [
        ("vegetable_classifier", "mobilenetv2_veg_classifier.pt.eval.json"),
        ("quality_classifier", "mobilenetv2_quality_classifier.pt.eval.json"),
    ]:
        fpath = os.path.join(settings.MODEL_ARTIFACTS_DIR, fname)
        if os.path.exists(fpath):
            with open(fpath) as f:
                cv_reports[key] = json.load(f)
        else:
            cv_reports[key] = {"status": "UNTRAINED_PENDING", "message": "No real training evaluation run yet."}

    return {
        "computer_vision_evaluations": cv_reports,
        "database_evaluation_history": [
            {
                "id": r.id,
                "model_name": r.model_name,
                "model_version": r.model_version,
                "status": r.status,
                "dataset_name": r.dataset_name,
                "metrics": r.metrics_json,
                "evaluated_at": r.evaluated_at.isoformat(),
            }
            for r in db_evals
        ],
    }
