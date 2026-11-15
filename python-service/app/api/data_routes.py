"""
Data cleaning and canonical market data API endpoints.
"""

from datetime import date, datetime
import json
from pathlib import Path
from typing import Any, Dict, List, Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.schemas.market_data import CleanedDatasetResult, PriceRecord
from app.services.data_cleaner import MarketDataCleaner

router = APIRouter(prefix="/api/v1/data", tags=["Market Data Ingestion & Cleaning"])

cleaner = MarketDataCleaner()


class CleanRequest(BaseModel):
    records: List[Dict[str, Any]] = Field(..., description="List of raw market records from AGMARKNET or data.gov.in")
    reference_date: Optional[str] = Field(default=None, description="ISO evaluation date (YYYY-MM-DD). Defaults to today.")


class CanonicalSummaryResponse(BaseModel):
    total_records: int
    supported_commodities: List[str]
    supported_markets: List[str]
    fresh_count: int
    acceptable_count: int
    stale_count: int


def _get_canonical_file_path() -> Path:
    # Resolves to repo_root/data/canonical_karnataka_mandi_data.json
    return Path(__file__).resolve().parents[3] / "data" / "canonical_karnataka_mandi_data.json"


@router.post("/clean", response_model=CleanedDatasetResult)
def clean_records(req: CleanRequest):
    """
    Cleans, standardizes, and validates a batch of raw mandi records.
    Filters out non-Karnataka rows, normalizes market aliases, enforces INR_PER_QUINTAL units,
    detects inverted price anomalies, and applies the freshness policy.
    """
    ref_d = None
    if req.reference_date:
        try:
            ref_d = datetime.strptime(req.reference_date, "%Y-%m-%d").date()
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid reference_date format. Must be YYYY-MM-DD.")

    return cleaner.clean_dataset(req.records, reference_date=ref_d)


@router.get("/canonical", response_model=List[PriceRecord])
def get_canonical_dataset():
    """
    Returns the verified canonical Karnataka market dataset.
    """
    file_path = _get_canonical_file_path()
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Canonical market dataset not found on disk.")

    with open(file_path, "r", encoding="utf-8") as f:
        records = json.load(f)
    return records


@router.get("/canonical/summary", response_model=CanonicalSummaryResponse)
def get_canonical_summary():
    """
    Returns high-level statistics and metadata about the canonical dataset.
    """
    file_path = _get_canonical_file_path()
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Canonical market dataset not found on disk.")

    with open(file_path, "r", encoding="utf-8") as f:
        records = json.load(f)

    commodities = sorted(list({r["commodity"] for r in records}))
    markets = sorted(list({r["market"] for r in records}))
    fresh = sum(1 for r in records if r.get("freshness_status") == "FRESH")
    acceptable = sum(1 for r in records if r.get("freshness_status") == "ACCEPTABLE")
    stale = sum(1 for r in records if r.get("freshness_status") == "STALE")

    return CanonicalSummaryResponse(
        total_records=len(records),
        supported_commodities=commodities,
        supported_markets=markets,
        fresh_count=fresh,
        acceptable_count=acceptable,
        stale_count=stale,
    )
