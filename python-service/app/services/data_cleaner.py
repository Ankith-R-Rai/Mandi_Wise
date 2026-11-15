"""
MandiWise Agricultural Market Data Cleaner & Normalization Engine.
Processes raw market records from AGMARKNET and data.gov.in into canonical,
validated representations for agricultural decision support in Karnataka.
"""

from datetime import date, datetime
from typing import Any, Dict, List, Optional
import logging

from app.schemas.market_data import PriceRecord, CleanedDatasetResult, FreshnessStatus

logger = logging.getLogger(__name__)


class MarketDataCleaner:
    """
    Cleaner and normalizer for Karnataka agricultural market data.
    Standardizes units to INR_PER_QUINTAL, parses multiple date formats,
    normalizes market/commodity aliases, and strictly enforces validation rules.
    """

    SUPPORTED_COMMODITIES = {"Tomato", "Onion", "Potato"}

    MARKET_ALIASES: Dict[str, str] = {
        "kolar": "Kolar",
        "bangalore": "Bengaluru (Yeshwanthpur)",
        "bengaluru": "Bengaluru (Yeshwanthpur)",
        "bangalore (yeshvantpur)": "Bengaluru (Yeshwanthpur)",
        "bangalore (yeshwanthpur)": "Bengaluru (Yeshwanthpur)",
        "yeshwanthpur": "Bengaluru (Yeshwanthpur)",
        "bengaluru (yeshwanthpur)": "Bengaluru (Yeshwanthpur)",
        "hubli": "Hubli (Amaragol)",
        "hubballi": "Hubli (Amaragol)",
        "amaragol": "Hubli (Amaragol)",
        "hubli (amaragol)": "Hubli (Amaragol)",
        "belgaum": "Belagavi",
        "belagavi": "Belagavi",
        "mysore": "Mysuru (Bandipalya)",
        "mysuru": "Mysuru (Bandipalya)",
        "mysore (bandipalya)": "Mysuru (Bandipalya)",
        "bandipalya": "Mysuru (Bandipalya)",
        "mysuru (bandipalya)": "Mysuru (Bandipalya)",
        "davangere": "Davanagere",
        "davanagere": "Davanagere",
    }

    DISTRICT_MAP: Dict[str, str] = {
        "Kolar": "Kolar",
        "Bengaluru (Yeshwanthpur)": "Bengaluru Urban",
        "Hubli (Amaragol)": "Dharwad",
        "Belagavi": "Belagavi",
        "Mysuru (Bandipalya)": "Mysuru",
        "Davanagere": "Davanagere",
    }

    DATE_FORMATS = [
        "%d/%m/%Y",
        "%Y-%m-%d",
        "%d-%b-%Y",
        "%d-%m-%Y",
        "%Y/%m/%d",
    ]

    def clean_record(self, raw: Dict[str, Any], reference_date: Optional[date] = None) -> PriceRecord:
        """
        Cleans and normalizes a single raw record.
        Never throws unhandled exceptions; invalid records are flagged with validation_notes.
        """
        if reference_date is None:
            reference_date = date.today()

        notes: List[str] = []
        is_valid = True

        # 1. State validation
        raw_state = str(raw.get("State") or raw.get("state") or "").strip()
        if raw_state.lower() != "karnataka":
            is_valid = False
            notes.append(f"Non-Karnataka state filtered: '{raw_state}'")
            canonical_state = raw_state or "Unknown"
        else:
            canonical_state = "Karnataka"

        # 2. Market normalization
        raw_market = str(raw.get("Market") or raw.get("market") or "").strip()
        market_key = raw_market.lower()
        canonical_market = self.MARKET_ALIASES.get(market_key, raw_market)

        # 3. District normalization
        raw_district = str(raw.get("District") or raw.get("district") or "").strip()
        canonical_district = self.DISTRICT_MAP.get(canonical_market, raw_district)
        if not canonical_district and canonical_market in self.DISTRICT_MAP:
            canonical_district = self.DISTRICT_MAP[canonical_market]

        # 4. Commodity normalization
        raw_commodity = str(raw.get("Commodity") or raw.get("commodity") or "").strip()
        canonical_commodity = self._normalize_commodity(raw_commodity)
        if canonical_commodity not in self.SUPPORTED_COMMODITIES:
            is_valid = False
            notes.append(f"Unsupported commodity: '{raw_commodity}'")

        # 5. Variety
        variety = str(raw.get("Variety") or raw.get("variety") or "Local").strip()

        # 6. Prices and Unit Conversion
        raw_unit = str(raw.get("Unit") or raw.get("unit") or "Quintal").strip()
        multiplier = 100.0 if "kg" in raw_unit.lower() else 1.0

        min_price = self._parse_float(raw.get("Min_x0020_Price") or raw.get("Min Price") or raw.get("min_price") or raw.get("MinPrice"))
        max_price = self._parse_float(raw.get("Max_x0020_Price") or raw.get("Max Price") or raw.get("max_price") or raw.get("MaxPrice"))
        modal_price = self._parse_float(raw.get("Modal_x0020_Price") or raw.get("Modal Price") or raw.get("modal_price") or raw.get("ModalPrice"))

        if min_price is None or max_price is None or modal_price is None:
            is_valid = False
            notes.append("Missing or unparseable price values")
            min_price = min_price or 0.0
            max_price = max_price or 0.0
            modal_price = modal_price or 0.0
        else:
            min_price *= multiplier
            max_price *= multiplier
            modal_price *= multiplier

            if min_price <= 0 or max_price <= 0 or modal_price <= 0:
                is_valid = False
                notes.append(f"Non-positive price values: min={min_price}, max={max_price}, modal={modal_price}")

            if not (min_price <= modal_price <= max_price):
                is_valid = False
                notes.append(f"Invalid price order: min ({min_price}) <= modal ({modal_price}) <= max ({max_price}) violated")

        # 7. Date parsing & Freshness calculation
        raw_date = str(raw.get("Arrival_Date") or raw.get("arrival_date") or raw.get("Observation_Date") or raw.get("observation_date") or "").strip()
        parsed_date = self._parse_date(raw_date)

        if parsed_date is None:
            is_valid = False
            notes.append(f"Unable to parse arrival date: '{raw_date}'")
            iso_date = "1970-01-01"
            freshness: FreshnessStatus = "STALE"
        else:
            iso_date = parsed_date.strftime("%Y-%m-%d")
            delta_days = (reference_date - parsed_date).days
            if delta_days <= 7:
                freshness = "FRESH"
            elif delta_days <= 30:
                freshness = "ACCEPTABLE"
            else:
                freshness = "STALE"

        source = str(raw.get("Source") or raw.get("source") or "AGMARKNET").strip()

        return PriceRecord(
            commodity=canonical_commodity,
            variety=variety,
            market=canonical_market,
            district=canonical_district,
            state=canonical_state,
            min_price=min_price,
            max_price=max_price,
            modal_price=modal_price,
            unit="INR_PER_QUINTAL",
            observation_date=iso_date,
            freshness_status=freshness,
            source=source,
            is_valid=is_valid,
            validation_notes=notes,
        )

    def clean_dataset(self, records: List[Dict[str, Any]], reference_date: Optional[date] = None) -> CleanedDatasetResult:
        """
        Batch cleans a list of raw records and returns an aggregated result summary.
        """
        valid_records: List[PriceRecord] = []
        rejected_records: List[PriceRecord] = []

        fresh_count = 0
        acceptable_count = 0
        stale_count = 0

        for r in records:
            cleaned = self.clean_record(r, reference_date=reference_date)
            if cleaned.is_valid:
                valid_records.append(cleaned)
                if cleaned.freshness_status == "FRESH":
                    fresh_count += 1
                elif cleaned.freshness_status == "ACCEPTABLE":
                    acceptable_count += 1
                else:
                    stale_count += 1
            else:
                rejected_records.append(cleaned)

        return CleanedDatasetResult(
            total_input_records=len(records),
            valid_count=len(valid_records),
            rejected_count=len(rejected_records),
            fresh_count=fresh_count,
            acceptable_count=acceptable_count,
            stale_count=stale_count,
            valid_records=valid_records,
            rejected_records=rejected_records,
        )

    def _normalize_commodity(self, raw_commodity: str) -> str:
        s = raw_commodity.strip().lower()
        if "tomato" in s:
            return "Tomato"
        if "onion" in s:
            return "Onion"
        if "potato" in s:
            return "Potato"
        return raw_commodity.strip()

    def _parse_float(self, value: Any) -> Optional[float]:
        if value is None:
            return None
        try:
            val_str = str(value).replace(",", "").strip()
            return float(val_str)
        except (ValueError, TypeError):
            return None

    def _parse_date(self, date_str: str) -> Optional[date]:
        if not date_str:
            return None
        clean_str = date_str.strip()
        for fmt in self.DATE_FORMATS:
            try:
                return datetime.strptime(clean_str, fmt).date()
            except ValueError:
                continue
        return None
