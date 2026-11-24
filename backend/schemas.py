from datetime import date
from typing import Optional
from pydantic import BaseModel, Field


class PricePredictRequest(BaseModel):
    vegetable_name: str
    mandi_name: str
    grade: Optional[str] = None
    target_date: date = Field(default_factory=date.today)
    image_id: Optional[int] = None
    allow_demo_fallback: bool = True
