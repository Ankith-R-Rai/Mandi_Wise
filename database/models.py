from datetime import datetime, date
from sqlalchemy import (
    Column, Integer, String, Float, Boolean, DateTime, Date, Text, ForeignKey, JSON, UniqueConstraint
)
from sqlalchemy.orm import relationship
from database.session import Base


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), nullable=False)
    role = Column(String(32), default="farmer")  # farmer | admin
    district = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class CropImage(Base):
    __tablename__ = "crop_images"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    filename = Column(String(255), nullable=False)
    stored_path = Column(String(500), nullable=False)
    sha256_hash = Column(String(64), index=True, nullable=False)
    mime_type = Column(String(50), nullable=False)
    file_size_bytes = Column(Integer, nullable=False)
    width = Column(Integer, nullable=False)
    height = Column(Integer, nullable=False)
    is_demo = Column(Boolean, default=False)
    uploaded_at = Column(DateTime, default=datetime.utcnow)

    classification = relationship("VegetableClassification", back_populates="image", uselist=False)
    quality = relationship("QualityAssessment", back_populates="image", uselist=False)
    defects = relationship("DefectDetection", back_populates="image")
    grade = relationship("CropGrade", back_populates="image", uselist=False)


class VegetableClassification(Base):
    __tablename__ = "vegetable_classifications"
    id = Column(Integer, primary_key=True, index=True)
    image_id = Column(Integer, ForeignKey("crop_images.id"), unique=True, nullable=False)
    predicted_vegetable = Column(String(100), nullable=False)
    is_supported = Column(Boolean, nullable=False)
    confidence = Column(Float, nullable=True)
    top_k_probabilities = Column(JSON, nullable=True)
    model_version = Column(String(64), nullable=False)
    model_status = Column(String(32), nullable=False)  # TRAINED | UNTRAINED_PENDING
    created_at = Column(DateTime, default=datetime.utcnow)

    image = relationship("CropImage", back_populates="classification")


class QualityAssessment(Base):
    __tablename__ = "quality_assessments"
    id = Column(Integer, primary_key=True, index=True)
    image_id = Column(Integer, ForeignKey("crop_images.id"), unique=True, nullable=False)
    freshness_label = Column(String(64), nullable=False)
    maturity_stage = Column(String(64), nullable=False)
    color_uniformity_score = Column(Float, nullable=False)
    surface_defect_ratio = Column(Float, nullable=False)
    wrinkle_texture_score = Column(Float, nullable=False)
    decay_indicator_score = Column(Float, nullable=False)
    shape_regularity_score = Column(Float, nullable=False)
    cv_metrics_json = Column(JSON, nullable=False)
    model_status = Column(String(32), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    image = relationship("CropImage", back_populates="quality")


class DefectDetection(Base):
    __tablename__ = "defect_detections"
    id = Column(Integer, primary_key=True, index=True)
    image_id = Column(Integer, ForeignKey("crop_images.id"), nullable=False)
    defect_type = Column(String(100), nullable=False)
    severity = Column(String(32), nullable=False)  # low | moderate | high
    confidence = Column(Float, nullable=True)
    bbox_xyxy = Column(JSON, nullable=True)  # [x1, y1, x2, y2] normalized
    detector_source = Column(String(64), nullable=False)  # yolov8 | opencv_contour

    image = relationship("CropImage", back_populates="defects")


class CropGrade(Base):
    __tablename__ = "crop_grades"
    id = Column(Integer, primary_key=True, index=True)
    image_id = Column(Integer, ForeignKey("crop_images.id"), unique=True, nullable=False)
    grade = Column(String(16), nullable=False)  # Grade A | Grade B | Grade C | Unknown
    grade_basis = Column(String(64), nullable=False)  # ESTIMATED_VISUAL_GRADE | VERIFIED_MODEL_GRADE
    confidence = Column(Float, nullable=True)
    explanation = Column(Text, nullable=False)
    agmark_disclaimer = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    image = relationship("CropImage", back_populates="grade")


class HistoricalMandiPrice(Base):
    __tablename__ = "historical_mandi_prices"
    id = Column(Integer, primary_key=True, index=True)
    vegetable_name = Column(String(100), index=True, nullable=False)
    raw_commodity_name = Column(String(120), nullable=False)
    variety = Column(String(100), nullable=True)
    reported_grade = Column(String(64), nullable=True)
    state = Column(String(80), index=True, nullable=False)
    district = Column(String(100), index=True, nullable=False)
    mandi_name = Column(String(120), index=True, nullable=False)
    arrival_date = Column(Date, index=True, nullable=False)
    min_price = Column(Float, nullable=False)
    max_price = Column(Float, nullable=False)
    modal_price = Column(Float, nullable=False)
    unit = Column(String(32), default="INR/Quintal")
    source = Column(String(80), nullable=False)  # AGMARKNET_DATA_GOV_IN | CSV_GOV_EXPORT | DEMO_SAMPLE_ONLY
    is_demo = Column(Boolean, default=False, index=True)
    ingested_at = Column(DateTime, default=datetime.utcnow)

    __table_args__ = (
        UniqueConstraint(
            "raw_commodity_name", "state", "mandi_name", "arrival_date", "variety", "source",
            name="uq_mandi_price_record"
        ),
    )


class PricePrediction(Base):
    __tablename__ = "price_predictions"
    id = Column(Integer, primary_key=True, index=True)
    image_id = Column(Integer, ForeignKey("crop_images.id"), nullable=True)
    vegetable_name = Column(String(100), nullable=False)
    grade = Column(String(32), nullable=True)
    state = Column(String(80), default="Karnataka")
    mandi_name = Column(String(120), nullable=False)
    target_date = Column(Date, nullable=False)
    predicted_modal_price = Column(Float, nullable=True)
    predicted_min_price = Column(Float, nullable=True)
    predicted_max_price = Column(Float, nullable=True)
    is_grade_specific = Column(Boolean, default=False)
    model_type = Column(String(64), nullable=False)  # baseline_xgboost | grade_aware_xgboost | insufficient_data
    model_version = Column(String(64), nullable=False)
    reliability_note = Column(Text, nullable=False)
    is_demo_based = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class DatasetMetadata(Base):
    __tablename__ = "dataset_metadata"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), nullable=False)
    source_url = Column(String(300), nullable=True)
    license_name = Column(String(100), nullable=False)
    vegetable_scope = Column(String(300), nullable=False)
    total_images = Column(Integer, default=0)
    train_count = Column(Integer, default=0)
    val_count = Column(Integer, default=0)
    test_count = Column(Integer, default=0)
    duplicates_removed = Column(Integer, default=0)
    storage_path = Column(String(400), nullable=False)
    uploaded_at = Column(DateTime, default=datetime.utcnow)


class ModelEvaluationResult(Base):
    __tablename__ = "model_evaluation_results"
    id = Column(Integer, primary_key=True, index=True)
    model_name = Column(String(100), nullable=False)  # veg_classifier | quality_classifier | yolo_defect | price_baseline | price_grade_aware
    model_version = Column(String(64), nullable=False)
    status = Column(String(32), nullable=False)  # TRAINED | UNTRAINED_PENDING
    dataset_name = Column(String(120), nullable=True)
    metrics_json = Column(JSON, nullable=False)
    confusion_matrix_json = Column(JSON, nullable=True)
    evaluated_at = Column(DateTime, default=datetime.utcnow)
