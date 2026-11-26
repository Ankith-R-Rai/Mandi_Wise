import os
import logging
from typing import Dict, Any, List, Optional, Tuple
import cv2
import numpy as np

from app.computer_vision.preprocessor import analyze_surface_opencv
from app.computer_vision.grading_rules import (
    compute_estimated_visual_grade,
    CLASS_LABELS,
    SUPPORTED_VEGETABLES,
    VEGETABLE_REGISTRY,
)

logger = logging.getLogger("agrivision.inference")


class VisionInferenceService:
    """
    Manages crop identification and visual AGMARK grading.
    - Uses a trained RandomForest ensemble model (trained on multi-spectral LAB/HSV features)
      for fast, accurate crop auto-detection.
    - Deterministic OpenCV surface inspection runs genuinely on every uploaded image
      to detect lesions, decay indicators, wrinkling, and color uniformity.
    """

    def __init__(self):
        self.clf_labels = CLASS_LABELS
        self.qual_labels = ["Grade A", "Grade B", "Grade C"]
        self.qual_version = "v1.1-agmark-rules"
        self.ml_model = None
        self.clf_version = "v1.1-randomforest-ensemble"
        self.clf_status = "INITIALIZING"

        self._load_model()

    def _load_model(self):
        model_path = os.path.join(os.path.dirname(__file__), "..", "models", "crop_classifier.joblib")
        if os.path.exists(model_path):
            try:
                import joblib
                self.ml_model = joblib.load(model_path)
                self.clf_status = "TRAINED_ACTIVE"
                logger.info(f"Loaded crop classifier ML model from {model_path}")
            except Exception as e:
                logger.warning(f"Failed to load ML model from {model_path}: {e}")
                self.clf_status = "HEURISTIC_COLOR"
        else:
            logger.info("crop_classifier.joblib not found; using calibrated multi-spectral rule engine.")
            self.clf_status = "HEURISTIC_COLOR"

    def get_status(self) -> Dict[str, Any]:
        return {
            "surface_inspector": {
                "engine": "OpenCV-CLAHE-LAB-Chroma",
                "status": "ACTIVE",
            },
            "vegetable_classifier": {
                "architecture": "RandomForest-StandardScaler-Ensemble",
                "status": self.clf_status,
                "version": self.clf_version,
            },
            "quality_classifier": {
                "architecture": "AGMARK Multi-Parametric Visual Matrix",
                "status": "ACTIVE_HEURISTIC",
                "version": self.qual_version,
            },
        }

    def _classify_by_rules(self, cv_metrics: Dict[str, Any]) -> Tuple[str, float]:
        """Calibrated fallback decision rule engine based on multi-spectral features."""
        red_r = cv_metrics.get("red_ratio", 0.0)
        green_r = cv_metrics.get("green_ratio", 0.0)
        yb_r = cv_metrics.get("yellow_brown_ratio", 0.0)
        purp_r = cv_metrics.get("purple_ratio", 0.0)
        lab_a = cv_metrics.get("mean_lab_a", 128.0)
        lab_b = cv_metrics.get("mean_lab_b", 128.0)
        circ_hue = cv_metrics.get("circ_mean_hue", 0.0)
        mean_sat = cv_metrics.get("mean_saturation", 100.0)

        # 1. Green Chilli: dominant green or negative LAB a*
        if green_r >= 0.28 or (green_r >= 0.16 and lab_a < 125.0):
            return "Green Chilli", min(0.96, 0.72 + green_r * 0.35)

        # 2. Brinjal: dominant purple or deep violet
        if purp_r >= 0.20 or (120.0 <= circ_hue <= 165.0 and lab_b < 124.0):
            return "Brinjal", min(0.96, 0.72 + purp_r * 0.35)

        # 3. Potato: earthy buff/tan/yellow-brown without red tone (lab_a < 134)
        if yb_r >= 0.25 and lab_a < 134.5:
            return "Potato", min(0.96, 0.72 + yb_r * 0.35)

        # 4. Tomato vs Onion:
        # Tomatoes have intense, high-saturation red flesh (mean_sat >= 125, lab_a >= 150)
        # Indian Red Onions & Yellow Onions have papery matte skin (mean_sat < 120, lab_a < 150)
        if lab_a >= 150.0 or (red_r >= 0.40 and mean_sat >= 125.0):
            return "Tomato", min(0.98, 0.75 + red_r * 0.30)
        elif purp_r >= 0.02 or mean_sat < 125.0 or yb_r >= 0.15:
            return "Onion", min(0.96, 0.72 + max(red_r, yb_r) * 0.30)

        # Secondary tie-breakers
        if lab_a >= 137.0:
            return ("Tomato", 0.75) if mean_sat >= 125.0 else ("Onion", 0.72)
        elif lab_b >= 136.0:
            return "Potato", 0.70
        elif green_r > red_r:
            return "Green Chilli", 0.70

        return "Tomato", 0.65

    def analyze(
        self,
        image_bgr: np.ndarray,
        confidence_threshold: float = 0.60,
        hint_vegetable: Optional[str] = None,
    ) -> Dict[str, Any]:
        cnn_bgr, cv_metrics, cv_defects = analyze_surface_opencv(image_bgr)

        # 1. Vegetable Auto-Detection or User Hint Override
        if hint_vegetable and hint_vegetable in SUPPORTED_VEGETABLES:
            predicted_veg = hint_vegetable
            is_supported = True
            top_conf = 0.98
            clf_status = "USER_HINT"
        else:
            predicted_veg = None
            top_conf = 0.60
            clf_status = self.clf_status

            # Attempt prediction with trained ML ensemble model
            if self.ml_model is not None:
                try:
                    feat = np.array(cv_metrics["feature_vector"]).reshape(1, -1)
                    probs = self.ml_model.predict_proba(feat)[0]
                    classes = self.ml_model.classes_
                    best_idx = int(np.argmax(probs))
                    predicted_veg = str(classes[best_idx])
                    top_conf = float(probs[best_idx])
                    clf_status = "TRAINED_ACTIVE"
                except Exception as ex:
                    logger.warning(f"ML model prediction error: {ex}, falling back to calibrated rules")
                    predicted_veg = None

            # Calibrated rules verification/fallback
            if not predicted_veg or top_conf < 0.60:
                predicted_veg, top_conf = self._classify_by_rules(cv_metrics)
                clf_status = "CALIBRATED_RULES"

            is_supported = predicted_veg in SUPPORTED_VEGETABLES

        # 2. Crop-specific visual grading adhering to DMI AGMARK standards
        grade_info = compute_estimated_visual_grade(
            vegetable_name=predicted_veg,
            cv_metrics=cv_metrics,
            defects=cv_defects,
            quality_model_label=None,
            quality_model_conf=top_conf,
        )

        return {
            "identification": {
                "predicted_vegetable": predicted_veg,
                "is_supported": is_supported,
                "confidence": round(top_conf, 2),
                "model_version": self.clf_version,
                "model_status": clf_status,
            },
            "quality": {
                "freshness_classification": grade_info["freshness_classification"],
                "maturity_stage": grade_info["maturity_stage"],
                "cv_metrics": cv_metrics,
                "model_status": "ACTIVE_HEURISTIC",
            },
            "defects": cv_defects,
            "grading": {
                "grade": grade_info["grade"],
                "grade_basis": grade_info["grade_basis"],
                "confidence": grade_info["confidence"],
                "explanation": grade_info["explanation"],
                "agmark_disclaimer": grade_info["agmark_disclaimer"],
            },
        }


vision_service = VisionInferenceService()
