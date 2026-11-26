from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field


class SupportedVegetableInfo(BaseModel):
    name: str
    agmarknet_aliases: List[str]
    agmark_visual_note: str


class SupportedVegetablesResponse(BaseModel):
    supported_vegetables: List[SupportedVegetableInfo]
    count: int


class IdentificationDto(BaseModel):
    predicted_vegetable: str
    is_supported: bool
    confidence: Optional[float] = None
    model_version: str
    model_status: str


class QualityDetailsDto(BaseModel):
    freshness_classification: str
    maturity_stage: str
    cv_metrics: Dict[str, Any]
    model_status: str


class DefectDto(BaseModel):
    defect_type: str
    severity: str
    confidence: Optional[float] = None
    bbox_xyxy: List[float]
    detector_source: str


class GradingDto(BaseModel):
    grade: str
    grade_basis: str
    confidence: Optional[float] = None
    explanation: str
    agmark_disclaimer: str


class QualityAnalysisResponse(BaseModel):
    identification: IdentificationDto
    quality: QualityDetailsDto
    defects: List[DefectDto]
    grading: GradingDto
