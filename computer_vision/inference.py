import json
import os
from typing import Dict, Any, List
import cv2
import numpy as np
import torch
import torch.nn as nn
from torchvision import models, transforms
from backend.config import settings, CLASS_LABELS, SUPPORTED_VEGETABLES
from computer_vision.preprocessor import analyze_surface_opencv
from computer_vision.grading_rules import compute_estimated_visual_grade

IMAGENET_TRANSFORM = transforms.Compose([
    transforms.ToPILImage(),
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])


def build_mobilenetv2(num_classes: int) -> nn.Module:
    model = models.mobilenet_v2(weights=None)
    model.classifier[1] = nn.Linear(model.last_channel, num_classes)
    return model


class VisionInferenceService:
    """
    Manages MobileNetV2 vegetable classification, MobileNetV2 quality assessment,
    and optional YOLOv8 defect/object detection.
    STRICT INTEGRITY: Never fakes trained predictions when model weights are missing.
    """

    def __init__(self):
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.clf_path = os.path.join(settings.MODEL_ARTIFACTS_DIR, "mobilenetv2_veg_classifier.pt")
        self.qual_path = os.path.join(settings.MODEL_ARTIFACTS_DIR, "mobilenetv2_quality_classifier.pt")
        self.yolo_path = os.path.join(settings.MODEL_ARTIFACTS_DIR, "yolov8_veg_defect.pt")

        self.clf_model = None
        self.clf_labels = CLASS_LABELS
        self.clf_version = "pending-training"

        self.qual_model = None
        self.qual_labels = ["Fresh", "Unripe", "Over-Mature", "Damaged/Defective"]
        self.qual_version = "pending-training"

        self.yolo_model = None
        self._load_available_weights()

    def _load_available_weights(self):
        if os.path.exists(self.clf_path):
            ckpt = torch.load(self.clf_path, map_location=self.device)
            self.clf_labels = ckpt.get("classes", CLASS_LABELS)
            self.clf_version = ckpt.get("version", "v1.0")
            model = build_mobilenetv2(len(self.clf_labels))
            model.load_state_dict(ckpt["state_dict"])
            model.to(self.device).eval()
            self.clf_model = model

        if os.path.exists(self.qual_path):
            ckpt = torch.load(self.qual_path, map_location=self.device)
            self.qual_labels = ckpt.get("classes", self.qual_labels)
            self.qual_version = ckpt.get("version", "v1.0")
            model = build_mobilenetv2(len(self.qual_labels))
            model.load_state_dict(ckpt["state_dict"])
            model.to(self.device).eval()
            self.qual_model = model

        if os.path.exists(self.yolo_path):
            try:
                from ultralytics import YOLO
                self.yolo_model = YOLO(self.yolo_path)
            except Exception:
                self.yolo_model = None

    def get_status(self) -> Dict[str, Any]:
        return {
            "vegetable_classifier": {
                "architecture": "MobileNetV2",
                "status": "TRAINED" if self.clf_model is not None else "UNTRAINED_PENDING",
                "version": self.clf_version,
                "weights_present": os.path.exists(self.clf_path),
            },
            "quality_classifier": {
                "architecture": "MobileNetV2",
                "status": "TRAINED" if self.qual_model is not None else "UNTRAINED_PENDING",
                "version": self.qual_version,
                "weights_present": os.path.exists(self.qual_path),
            },
            "defect_detector": {
                "architecture": "YOLOv8 + OpenCV Surface Analyzer",
                "status": "TRAINED" if self.yolo_model is not None else "OPENCV_FALLBACK_PENDING_YOLO_WEIGHTS",
                "weights_present": os.path.exists(self.yolo_path),
            },
        }

    def analyze(self, image_bgr: np.ndarray, confidence_threshold: float = 0.60, hint_vegetable: str | None = None) -> Dict[str, Any]:
        cnn_bgr, cv_metrics, cv_defects = analyze_surface_opencv(image_bgr)
        cnn_rgb = cv2.cvtColor(cnn_bgr, cv2.COLOR_BGR2RGB)
        tensor = IMAGENET_TRANSFORM(cnn_rgb).unsqueeze(0).to(self.device)

        # 1. Vegetable Identification
        if self.clf_model is not None:
            with torch.no_grad():
                logits = self.clf_model(tensor)
                probs = torch.softmax(logits, dim=1).squeeze(0).cpu().numpy()
            top_idx = int(np.argmax(probs))
            top_conf = float(probs[top_idx])
            raw_label = self.clf_labels[top_idx]
            # Out-of-distribution / low-confidence rejection -> Unknown/Unsupported
            if raw_label == "Unknown/Unsupported" or top_conf < confidence_threshold:
                predicted_veg = "Unknown/Unsupported"
                is_supported = False
            else:
                predicted_veg = raw_label
                is_supported = predicted_veg in SUPPORTED_VEGETABLES

            top_k = {self.clf_labels[i]: round(float(probs[i]), 4) for i in np.argsort(-probs)[:4]}
            clf_status = "TRAINED"
        else:
            # Never pretend an untrained MobileNetV2 identified the crop
            predicted_veg = hint_vegetable if hint_vegetable in SUPPORTED_VEGETABLES else "Unknown/Unsupported (Model Training Pending)"
            is_supported = predicted_veg in SUPPORTED_VEGETABLES
            top_conf = None
            top_k = None
            clf_status = "UNTRAINED_PENDING"

        # 2. Quality Classification
        qual_label = None
        qual_conf = None
        qual_status = "UNTRAINED_PENDING"
        if self.qual_model is not None and is_supported:
            with torch.no_grad():
                q_logits = self.qual_model(tensor)
                q_probs = torch.softmax(q_logits, dim=1).squeeze(0).cpu().numpy()
            q_idx = int(np.argmax(q_probs))
            qual_label = self.qual_labels[q_idx]
            qual_conf = round(float(q_probs[q_idx]), 4)
            qual_status = "TRAINED"

        # 3. YOLO Defect / Object Detection (if weights exist) + OpenCV surface contours
        defects: List[Dict[str, Any]] = list(cv_defects)
        if self.yolo_model is not None:
            results = self.yolo_model.predict(image_bgr, conf=0.35, verbose=False)
            h, w = image_bgr.shape[:2]
            for r in results:
                for box in r.boxes:
                    cls_name = r.names[int(box.cls[0])]
                    x1, y1, x2, y2 = [float(v) for v in box.xyxy[0].tolist()]
                    defects.append({
                        "defect_type": cls_name,
                        "severity": "moderate",
                        "confidence": round(float(box.conf[0]), 4),
                        "bbox_xyxy": [round(x1 / w, 4), round(y1 / h, 4), round(x2 / w, 4), round(y2 / h, 4)],
                        "detector_source": "yolov8",
                    })

        # 4. Crop-specific visual grading
        grade_info = compute_estimated_visual_grade(
            vegetable_name=predicted_veg,
            cv_metrics=cv_metrics,
            defects=defects,
            quality_model_label=qual_label,
            quality_model_conf=qual_conf,
        )

        return {
            "identification": {
                "predicted_vegetable": predicted_veg,
                "is_supported": is_supported,
                "confidence": round(top_conf, 4) if top_conf is not None else None,
                "top_k_probabilities": top_k,
                "model_version": self.clf_version,
                "model_status": clf_status,
            },
            "quality": {
                "freshness_classification": grade_info["freshness_classification"],
                "maturity_stage": grade_info["maturity_stage"],
                "cv_metrics": cv_metrics,
                "model_status": qual_status,
            },
            "defects": defects,
            "grading": {
                "grade": grade_info["grade"],
                "grade_basis": grade_info["grade_basis"],
                "confidence": grade_info["confidence"],
                "explanation": grade_info["explanation"],
                "agmark_disclaimer": grade_info["agmark_disclaimer"],
            },
        }


vision_service = VisionInferenceService()
