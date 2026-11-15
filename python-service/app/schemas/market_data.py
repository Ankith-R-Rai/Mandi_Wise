"""
Pydantic schemas for agricultural market price records and dataset cleaning results.
Canonical standard unit is INR_PER_QUINTAL (1 Quintal = 100 kg).
"""

from typing import List, Literal, Optional
from pydantic import BaseModel, Field

FreshnessStatus = Literal["FRESH", "ACCEPTABLE", "STALE"]


class PriceRecord(BaseModel):
    """
    Standardized, verified agricultural mandi price record.
    All monetary prices are in Indian Rupees (INR) per Quintal.
    """
    commodity: str = Field(..., description="Canonical commodity name (e.g. Tomato, Onion, Potato)")
    variety: Optional[str] = Field(default="Local", description="Commodity variety (e.g. Hybrid, Local, Jyoti)")
    market: str = Field(..., description="Canonical APMC market name")
    district: str = Field(..., description="Karnataka district name")
    state: str = Field(default="Karnataka", description="State name (must be Karnataka for scope)")
    min_price: float = Field(..., description="Minimum price in INR per quintal")
    max_price: float = Field(..., description="Maximum price in INR per quintal")
    modal_price: float = Field(..., description="Modal (most frequent) price in INR per quintal")
    unit: str = Field(default="INR_PER_QUINTAL", description="Standard price unit")
    observation_date: str = Field(..., description="Observation / arrival date in ISO-8601 (YYYY-MM-DD)")
    freshness_status: FreshnessStatus = Field(..., description="FRESH (<=7d), ACCEPTABLE (8-30d), STALE (>30d)")
    source: str = Field(default="AGMARKNET", description="Data source (e.g. AGMARKNET, data.gov.in)")
    is_valid: bool = Field(default=True, description="Whether the record satisfies all validity rules")
    validation_notes: List[str] = Field(default_factory=list, description="List of validation errors or warnings")


class CleanedDatasetResult(BaseModel):
    """
    Batch processing result summary from the Market Data Cleaner.
    """
    total_input_records: int
    valid_count: int
    rejected_count: int
    fresh_count: int
    acceptable_count: int
    stale_count: int
    valid_records: List[PriceRecord]
    rejected_records: List[PriceRecord]
