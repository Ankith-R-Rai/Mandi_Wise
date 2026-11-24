import hashlib
import os
from typing import Optional
import cv2
import numpy as np
from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from sqlalchemy.orm import Session

from backend.config import settings, SUPPORTED_VEGETABLES, VEGETABLE_REGISTRY
from computer_vision.inference import vision_service
from database.models import (
    CropImage, VegetableClassification, QualityAssessment, DefectDetection, CropGrade
)
from database.session import get_db

router = APIRouter(prefix="/api", tags=["Computer Vision Analysis"])

ALLOWED_MIME = {"image/jpeg", "image/jpg", "image/png"}


def _decode_and_validate_image(raw_bytes: bytes, content_type: str):
    if content_type.lower() not in ALLOWED_MIME:
        raise HTTPException(status_code=400, detail="Only JPG, JPEG, and PNG images are allowed.")
    max_bytes = settings.MAX_IMAGE_SIZE_MB * 1024 * 1024
    if len(raw_bytes) > max_bytes or len(raw_bytes) == 0:
        raise HTTPException(status_code=400, detail=f"Image size must be between 1 byte and {settings.MAX_IMAGE_SIZE_MB} MB.")
    arr = np.frombuffer(raw_bytes, np.uint8)
    img = cv2.imdecode(arr, cv2.IMREAD_COLOR)
    if img is None:
        raise HTTPException(status_code=400, detail="Corrupted or unreadable image file.")
    return img


@router.get("/vegetables")
def list_supported_vegetables():
    return {
        "supported_vegetables": [
            {"name": name, **meta} for name, meta in VEGETABLE_REGISTRY.items()
        ],
        "count": len(SUPPORTED_VEGETABLES),
    }


@router.post("/identify-vegetable")
async def identify_vegetable(file: UploadFile = File(...)):
    raw = await file.read()
    img = _decode_and_validate_image(raw, file.content_type or "")
    res = vision_service.analyze(img)
    return res["identification"]


@router.post("/grade-quality")
async def grade_quality(
    file: UploadFile = File(...),
    vegetable_hint: Optional[str] = Form(default=None),
):
    raw = await file.read()
    img = _decode_and_validate_image(raw, file.content_type or "")
    res = vision_service.analyze(img, hint_vegetable=vegetable_hint)
    return {
        "quality": res["quality"],
        "defects": res["defects"],
        "grading": res["grading"],
    }


@router.post("/analyze-image")
async def analyze_image(
    file: UploadFile = File(...),
    vegetable_hint: Optional[str] = Form(default=None),
    is_demo: bool = Form(default=False),
    db: Session = Depends(get_db),
):
    raw = await file.read()
    img = _decode_and_validate_image(raw, file.content_type or "")
    h, w = img.shape[:2]
    sha256 = hashlib.sha256(raw).hexdigest()

    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    ext = ".png" if (file.content_type or "").endswith("png") else ".jpg"
    stored_name = f"{sha256[:16]}_{os.path.basename(file.filename or 'crop')}{ext}"
    stored_path = os.path.join(settings.UPLOAD_DIR, stored_name)
    with open(stored_path, "wb") as f:
        f.write(raw)

    result = vision_service.analyze(img, hint_vegetable=vegetable_hint)

    crop_img = CropImage(
        filename=file.filename or stored_name,
        stored_path=f"/uploads/{stored_name}",
        sha256_hash=sha256,
        mime_type=file.content_type or "image/jpeg",
        file_size_bytes=len(raw),
        width=w,
        height=h,
        is_demo=is_demo,
    )
    db.add(crop_img)
    db.flush()

    ident = result["identification"]
    db.add(VegetableClassification(
        image_id=crop_img.id,
        predicted_vegetable=ident["predicted_vegetable"],
        is_supported=ident["is_supported"],
        confidence=ident["confidence"],
        top_k_probabilities=ident["top_k_probabilities"],
        model_version=ident["model_version"],
        model_status=ident["model_status"],
    ))

    qual = result["quality"]
    cvm = qual["cv_metrics"]
    db.add(QualityAssessment(
        image_id=crop_img.id,
        freshness_label=qual["freshness_classification"],
        maturity_stage=qual["maturity_stage"],
        color_uniformity_score=cvm["color_uniformity_score"],
        surface_defect_ratio=cvm["surface_defect_ratio"],
        wrinkle_texture_score=cvm["wrinkle_texture_score"],
        decay_indicator_score=cvm["decay_indicator_score"],
        shape_regularity_score=cvm["shape_regularity_score"],
        cv_metrics_json=cvm,
        model_status=qual["model_status"],
    ))

    for d in result["defects"]:
        db.add(DefectDetection(
            image_id=crop_img.id,
            defect_type=d["defect_type"],
            severity=d["severity"],
            confidence=d["confidence"],
            bbox_xyxy=d["bbox_xyxy"],
            detector_source=d["detector_source"],
        ))

    gr = result["grading"]
    db.add(CropGrade(
        image_id=crop_img.id,
        grade=gr["grade"],
        grade_basis=gr["grade_basis"],
        confidence=gr["confidence"],
        explanation=gr["explanation"],
        agmark_disclaimer=gr["agmark_disclaimer"],
    ))
    db.commit()

    return {
        "image_id": crop_img.id,
        "image_url": crop_img.stored_path,
        "is_demo": is_demo,
        **result,
    }


@router.get("/analysis-history")
def get_analysis_history(limit: int = 30, db: Session = Depends(get_db)):
    images = db.query(CropImage).order_by(CropImage.uploaded_at.desc()).limit(limit).all()
    items = []
    for img in images:
        items.append({
            "image_id": img.id,
            "filename": img.filename,
            "image_url": img.stored_path,
            "uploaded_at": img.uploaded_at.isoformat(),
            "is_demo": img.is_demo,
            "vegetable": img.classification.predicted_vegetable if img.classification else None,
            "identification_status": img.classification.model_status if img.classification else None,
            "grade": img.grade.grade if img.grade else None,
            "grade_basis": img.grade.grade_basis if img.grade else None,
            "freshness": img.quality.freshness_label if img.quality else None,
            "defect_count": len(img.defects),
        })
    return {"history": items}
