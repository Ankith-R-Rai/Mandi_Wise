from typing import Optional
import cv2
import numpy as np
from fastapi import APIRouter, File, Form, HTTPException, UploadFile

from app.computer_vision.grading_rules import VEGETABLE_REGISTRY, SUPPORTED_VEGETABLES
from app.computer_vision.inference import vision_service
from app.schemas.vision_schemas import (
    SupportedVegetablesResponse,
    SupportedVegetableInfo,
    QualityAnalysisResponse,
)

router = APIRouter(prefix="/api", tags=["AgriVision Quality Assessment"])

ALLOWED_MIME = {"image/jpeg", "image/jpg", "image/png"}
MAX_FILE_BYTES = 10 * 1024 * 1024  # 10 MB


def _decode_and_validate_image(raw_bytes: bytes, content_type: str) -> np.ndarray:
    if content_type.lower() not in ALLOWED_MIME:
        raise HTTPException(
            status_code=400,
            detail="Only JPG, JPEG, and PNG images are allowed.",
        )
    if len(raw_bytes) > MAX_FILE_BYTES or len(raw_bytes) == 0:
        raise HTTPException(
            status_code=400,
            detail=f"Image size must be between 1 byte and 10 MB.",
        )
    arr = np.frombuffer(raw_bytes, np.uint8)
    img = cv2.imdecode(arr, cv2.IMREAD_COLOR)
    if img is None:
        raise HTTPException(
            status_code=400,
            detail="Corrupted or unreadable image file.",
        )
    return img


@router.get("/crops", response_model=SupportedVegetablesResponse)
def get_supported_crops():
    """
    Returns list of crops supported by the AgriVision grading engine.
    """
    crops = [
        SupportedVegetableInfo(
            name=name,
            agmarknet_aliases=meta.get("agmarknet_aliases", [name]),
            agmark_visual_note=meta.get("agmark_visual_note", ""),
        )
        for name, meta in VEGETABLE_REGISTRY.items()
    ]
    return SupportedVegetablesResponse(
        supported_vegetables=crops,
        count=len(crops),
    )


@router.get("/status")
def get_vision_status():
    """
    Returns status of the vision engine and loaded weights.
    """
    return vision_service.get_status()


@router.post("/analyze", response_model=QualityAnalysisResponse)
async def analyze_crop_image(
    file: UploadFile = File(...),
    vegetable_hint: Optional[str] = Form(default=None),
):
    """
    Analyzes an uploaded crop image, executing OpenCV CLAHE normalization,
    HSV color profiling, blemish contour detection, and AGMARK visual grading.
    """
    raw_bytes = await file.read()
    img = _decode_and_validate_image(raw_bytes, file.content_type or "image/jpeg")

    result = vision_service.analyze(img, hint_vegetable=vegetable_hint)
    return result
