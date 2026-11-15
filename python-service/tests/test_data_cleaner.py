"""
Unit tests for MandiWise Market Data Cleaner and Normalizer.
Following strict Test-Driven Development (TDD).
"""

from datetime import date
import pytest

from app.schemas.market_data import PriceRecord, CleanedDatasetResult
from app.services.data_cleaner import MarketDataCleaner


@pytest.fixture
def cleaner() -> MarketDataCleaner:
    return MarketDataCleaner()


@pytest.fixture
def ref_date() -> date:
    # Fixed reference date for deterministic freshness assertions
    return date(2026, 11, 15)


def test_clean_valid_agmarknet_record(cleaner: MarketDataCleaner, ref_date: date):
    raw = {
        "State": "Karnataka",
        "District": "Kolar",
        "Market": "Kolar",
        "Commodity": "Tomato",
        "Variety": "Hybrid",
        "Arrival_Date": "12/11/2026",
        "Min_x0020_Price": 1800,
        "Max_x0020_Price": 2400,
        "Modal_x0020_Price": 2100,
        "Source": "AGMARKNET",
    }

    record = cleaner.clean_record(raw, reference_date=ref_date)

    assert record is not None
    assert record.is_valid is True
    assert record.state == "Karnataka"
    assert record.district == "Kolar"
    assert record.market == "Kolar"
    assert record.commodity == "Tomato"
    assert record.variety == "Hybrid"
    assert record.min_price == 1800.0
    assert record.max_price == 2400.0
    assert record.modal_price == 2100.0
    assert record.unit == "INR_PER_QUINTAL"
    assert record.observation_date == "2026-11-12"
    assert record.freshness_status == "FRESH"  # 3 days old <= 7 days
    assert record.source == "AGMARKNET"
    assert len(record.validation_notes) == 0


def test_filter_non_karnataka_record(cleaner: MarketDataCleaner, ref_date: date):
    raw = {
        "State": "Maharashtra",
        "District": "Nashik",
        "Market": "Lasalgaon",
        "Commodity": "Onion",
        "Arrival_Date": "14/11/2026",
        "Min_x0020_Price": 1200,
        "Max_x0020_Price": 2200,
        "Modal_x0020_Price": 1700,
    }

    record = cleaner.clean_record(raw, reference_date=ref_date)

    assert record is not None
    assert record.is_valid is False
    assert any("Karnataka" in note for note in record.validation_notes)


def test_normalize_market_aliases(cleaner: MarketDataCleaner, ref_date: date):
    cases = [
        ("Bangalore", "Bengaluru (Yeshwanthpur)"),
        ("Bangalore (Yeshvantpur)", "Bengaluru (Yeshwanthpur)"),
        ("Hubli", "Hubli (Amaragol)"),
        ("Hubballi", "Hubli (Amaragol)"),
        ("Belgaum", "Belagavi"),
        ("Mysore", "Mysuru (Bandipalya)"),
        ("Mysore (Bandipalya)", "Mysuru (Bandipalya)"),
        ("Davangere", "Davanagere"),
        ("Kolar", "Kolar"),
    ]

    for raw_name, canonical_name in cases:
        raw = {
            "State": "Karnataka",
            "District": "Kolar",
            "Market": raw_name,
            "Commodity": "Tomato",
            "Arrival_Date": "14/11/2026",
            "Min_x0020_Price": 1500,
            "Max_x0020_Price": 2000,
            "Modal_x0020_Price": 1800,
        }
        record = cleaner.clean_record(raw, reference_date=ref_date)
        assert record is not None
        assert record.market == canonical_name, f"Failed for raw market: {raw_name}"


def test_normalize_commodity_names(cleaner: MarketDataCleaner, ref_date: date):
    cases = [
        ("TOMATO", "Tomato"),
        ("tomato", "Tomato"),
        ("Tomato (Local)", "Tomato"),
        ("ONION", "Onion"),
        ("Onion (Red)", "Onion"),
        ("Potato", "Potato"),
        ("POTATO (JYOTI)", "Potato"),
    ]

    for raw_commodity, canonical_commodity in cases:
        raw = {
            "State": "Karnataka",
            "District": "Bengaluru Urban",
            "Market": "Bengaluru (Yeshwanthpur)",
            "Commodity": raw_commodity,
            "Arrival_Date": "14/11/2026",
            "Min_x0020_Price": 1000,
            "Max_x0020_Price": 1500,
            "Modal_x0020_Price": 1200,
        }
        record = cleaner.clean_record(raw, reference_date=ref_date)
        assert record is not None
        assert record.commodity == canonical_commodity


def test_unsupported_commodity_rejected(cleaner: MarketDataCleaner, ref_date: date):
    raw = {
        "State": "Karnataka",
        "District": "Dharwad",
        "Market": "Hubli (Amaragol)",
        "Commodity": "Wheat",
        "Arrival_Date": "14/11/2026",
        "Min_x0020_Price": 2200,
        "Max_x0020_Price": 2600,
        "Modal_x0020_Price": 2400,
    }

    record = cleaner.clean_record(raw, reference_date=ref_date)
    assert record is not None
    assert record.is_valid is False
    assert any("unsupported commodity" in note.lower() for note in record.validation_notes)


def test_unit_conversion_rs_per_kg_to_quintal(cleaner: MarketDataCleaner, ref_date: date):
    raw = {
        "State": "Karnataka",
        "District": "Kolar",
        "Market": "Kolar",
        "Commodity": "Tomato",
        "Arrival_Date": "14/11/2026",
        "Min_x0020_Price": 15.0,  # 15 Rs/Kg = 1500 Rs/Quintal
        "Max_x0020_Price": 25.0,  # 25 Rs/Kg = 2500 Rs/Quintal
        "Modal_x0020_Price": 20.0, # 20 Rs/Kg = 2000 Rs/Quintal
        "Unit": "Rs/Kg",
    }

    record = cleaner.clean_record(raw, reference_date=ref_date)
    assert record is not None
    assert record.is_valid is True
    assert record.unit == "INR_PER_QUINTAL"
    assert record.min_price == 1500.0
    assert record.max_price == 2500.0
    assert record.modal_price == 2000.0


def test_price_order_anomaly_detection(cleaner: MarketDataCleaner, ref_date: date):
    # Case 1: MinPrice > ModalPrice
    raw_inverted_min = {
        "State": "Karnataka",
        "District": "Kolar",
        "Market": "Kolar",
        "Commodity": "Tomato",
        "Arrival_Date": "14/11/2026",
        "Min_x0020_Price": 2500,
        "Max_x0020_Price": 3000,
        "Modal_x0020_Price": 2000,
    }
    rec1 = cleaner.clean_record(raw_inverted_min, reference_date=ref_date)
    assert rec1 is not None
    assert rec1.is_valid is False
    assert any("order" in n.lower() or "modal" in n.lower() for n in rec1.validation_notes)

    # Case 2: ModalPrice > MaxPrice
    raw_inverted_max = {
        "State": "Karnataka",
        "District": "Kolar",
        "Market": "Kolar",
        "Commodity": "Tomato",
        "Arrival_Date": "14/11/2026",
        "Min_x0020_Price": 1500,
        "Max_x0020_Price": 2000,
        "Modal_x0020_Price": 2200,
    }
    rec2 = cleaner.clean_record(raw_inverted_max, reference_date=ref_date)
    assert rec2 is not None
    assert rec2.is_valid is False


def test_negative_or_zero_price_rejection(cleaner: MarketDataCleaner, ref_date: date):
    raw_zero = {
        "State": "Karnataka",
        "District": "Kolar",
        "Market": "Kolar",
        "Commodity": "Tomato",
        "Arrival_Date": "14/11/2026",
        "Min_x0020_Price": 0,
        "Max_x0020_Price": 1000,
        "Modal_x0020_Price": 500,
    }
    record = cleaner.clean_record(raw_zero, reference_date=ref_date)
    assert record is not None
    assert record.is_valid is False
    assert any("positive" in n.lower() or "zero" in n.lower() or "price" in n.lower() for n in record.validation_notes)


def test_date_parsing_variations(cleaner: MarketDataCleaner, ref_date: date):
    formats = [
        ("14/11/2026", "2026-11-14"),
        ("2026-11-14", "2026-11-14"),
        ("14-Nov-2026", "2026-11-14"),
    ]

    for date_str, expected_iso in formats:
        raw = {
            "State": "Karnataka",
            "District": "Kolar",
            "Market": "Kolar",
            "Commodity": "Tomato",
            "Arrival_Date": date_str,
            "Min_x0020_Price": 1500,
            "Max_x0020_Price": 2500,
            "Modal_x0020_Price": 2000,
        }
        rec = cleaner.clean_record(raw, reference_date=ref_date)
        assert rec is not None
        assert rec.observation_date == expected_iso


def test_freshness_classification_policy(cleaner: MarketDataCleaner, ref_date: date):
    # Reference date is 2026-11-15
    # Fresh: <= 7 days (e.g. 2026-11-10 -> 5 days)
    # Acceptable: 8-30 days (e.g. 2026-10-25 -> 21 days)
    # Stale: > 30 days (e.g. 2026-09-15 -> 61 days)
    
    # 1. Fresh
    rec_fresh = cleaner.clean_record({
        "State": "Karnataka", "District": "Kolar", "Market": "Kolar",
        "Commodity": "Tomato", "Arrival_Date": "10/11/2026",
        "Min_x0020_Price": 1500, "Max_x0020_Price": 2500, "Modal_x0020_Price": 2000,
    }, reference_date=ref_date)
    assert rec_fresh.freshness_status == "FRESH"

    # 2. Acceptable
    rec_acceptable = cleaner.clean_record({
        "State": "Karnataka", "District": "Kolar", "Market": "Kolar",
        "Commodity": "Tomato", "Arrival_Date": "25/10/2026",
        "Min_x0020_Price": 1500, "Max_x0020_Price": 2500, "Modal_x0020_Price": 2000,
    }, reference_date=ref_date)
    assert rec_acceptable.freshness_status == "ACCEPTABLE"

    # 3. Stale
    rec_stale = cleaner.clean_record({
        "State": "Karnataka", "District": "Kolar", "Market": "Kolar",
        "Commodity": "Tomato", "Arrival_Date": "15/09/2026",
        "Min_x0020_Price": 1500, "Max_x0020_Price": 2500, "Modal_x0020_Price": 2000,
    }, reference_date=ref_date)
    assert rec_stale.freshness_status == "STALE"


def test_clean_dataset_batch(cleaner: MarketDataCleaner, ref_date: date):
    batch = [
        # Valid fresh record
        {
            "State": "Karnataka", "District": "Kolar", "Market": "Kolar",
            "Commodity": "Tomato", "Arrival_Date": "14/11/2026",
            "Min_x0020_Price": 1800, "Max_x0020_Price": 2400, "Modal_x0020_Price": 2100,
        },
        # Non-Karnataka (rejected)
        {
            "State": "Andhra Pradesh", "District": "Madanapalle", "Market": "Madanapalle",
            "Commodity": "Tomato", "Arrival_Date": "14/11/2026",
            "Min_x0020_Price": 1600, "Max_x0020_Price": 2200, "Modal_x0020_Price": 1900,
        },
        # Invalid price order (rejected)
        {
            "State": "Karnataka", "District": "Belagavi", "Market": "Belagavi",
            "Commodity": "Onion", "Arrival_Date": "14/11/2026",
            "Min_x0020_Price": 3000, "Max_x0020_Price": 2000, "Modal_x0020_Price": 2500,
        },
        # Valid acceptable record
        {
            "State": "Karnataka", "District": "Dharwad", "Market": "Hubli",
            "Commodity": "Potato", "Arrival_Date": "28/10/2026",
            "Min_x0020_Price": 1400, "Max_x0020_Price": 1800, "Modal_x0020_Price": 1600,
        },
    ]

    result: CleanedDatasetResult = cleaner.clean_dataset(batch, reference_date=ref_date)

    assert result.total_input_records == 4
    assert result.valid_count == 2
    assert result.rejected_count == 2
    assert len(result.valid_records) == 2
    assert len(result.rejected_records) == 2
    assert result.fresh_count == 1
    assert result.acceptable_count == 1
    assert result.stale_count == 0


def test_corrupted_price_strings_and_empty_payload(cleaner: MarketDataCleaner, ref_date: date):
    # Empty payload
    rec_empty = cleaner.clean_record({}, reference_date=ref_date)
    assert rec_empty.is_valid is False
    assert len(rec_empty.validation_notes) > 0

    # Corrupted price strings like "N/A"
    raw_corrupt = {
        "State": "Karnataka",
        "District": "Kolar",
        "Market": "Kolar",
        "Commodity": "Tomato",
        "Arrival_Date": "14/11/2026",
        "Min_x0020_Price": "N/A",
        "Max_x0020_Price": "invalid",
        "Modal_x0020_Price": "null",
    }
    rec_corrupt = cleaner.clean_record(raw_corrupt, reference_date=ref_date)
    assert rec_corrupt.is_valid is False
    assert any("price" in n.lower() for n in rec_corrupt.validation_notes)


def test_unparseable_date_handling(cleaner: MarketDataCleaner, ref_date: date):
    raw_bad_date = {
        "State": "Karnataka",
        "District": "Kolar",
        "Market": "Kolar",
        "Commodity": "Tomato",
        "Arrival_Date": "invalid-date-string",
        "Min_x0020_Price": 1500,
        "Max_x0020_Price": 2500,
        "Modal_x0020_Price": 2000,
    }
    rec = cleaner.clean_record(raw_bad_date, reference_date=ref_date)
    assert rec.is_valid is False
    assert rec.freshness_status == "STALE"
    assert any("date" in n.lower() for n in rec.validation_notes)

