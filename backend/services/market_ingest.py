from datetime import datetime, date
from typing import List, Dict, Any, Optional
import io
import httpx
import pandas as pd
from sqlalchemy.orm import Session
from sqlalchemy.dialects.sqlite import insert as sqlite_insert
from backend.config import settings, VEGETABLE_REGISTRY
from database.models import HistoricalMandiPrice


def build_alias_lookup() -> Dict[str, str]:
    lookup = {}
    for canonical, cfg in VEGETABLE_REGISTRY.items():
        lookup[canonical.lower()] = canonical
        for alias in cfg["agmarknet_aliases"]:
            lookup[alias.lower()] = canonical
    return lookup


ALIAS_LOOKUP = build_alias_lookup()


def canonicalize_commodity(raw_name: str) -> Optional[str]:
    if not raw_name:
        return None
    cleaned = raw_name.strip().lower()
    if cleaned in ALIAS_LOOKUP:
        return ALIAS_LOOKUP[cleaned]
    for alias, canonical in ALIAS_LOOKUP.items():
        if alias in cleaned:
            return canonical
    return None


def parse_agmarknet_date(date_str: str) -> date:
    for fmt in ("%d/%m/%Y", "%Y-%m-%d", "%d-%m-%Y", "%d %b %Y"):
        try:
            return datetime.strptime(str(date_str).strip(), fmt).date()
        except ValueError:
            continue
    raise ValueError(f"Unrecognized arrival_date format: {date_str}")


def upsert_price_records(db: Session, rows: List[Dict[str, Any]]) -> int:
    inserted = 0
    for row in rows:
        exists = (
            db.query(HistoricalMandiPrice)
            .filter_by(
                raw_commodity_name=row["raw_commodity_name"],
                state=row["state"],
                mandi_name=row["mandi_name"],
                arrival_date=row["arrival_date"],
                variety=row["variety"],
                source=row["source"],
            )
            .first()
        )
        if not exists:
            db.add(HistoricalMandiPrice(**row))
            inserted += 1
    db.commit()
    return inserted


async def fetch_data_gov_agmarknet(
    db: Session,
    state: str = "Karnataka",
    commodity: Optional[str] = None,
    resource_id: Optional[str] = None,
    limit: int = 500,
) -> Dict[str, Any]:
    """
    Fetches live / historical APMC mandi prices from Government of India data.gov.in API.
    Requires DATA_GOV_IN_API_KEY in environment variables.
    """
    api_key = settings.DATA_GOV_IN_API_KEY
    if not api_key:
        return {
            "status": "NO_API_KEY",
            "message": "DATA_GOV_IN_API_KEY not configured. Register at https://data.gov.in or upload an AGMARKNET CSV.",
            "records_fetched": 0,
            "records_inserted": 0,
        }

    res_id = resource_id or settings.DATA_GOV_DAILY_RESOURCE_ID
    url = f"https://api.data.gov.in/resource/{res_id}"
    params = {
        "api-key": api_key,
        "format": "json",
        "limit": limit,
        "filters[state]": state,
    }
    if commodity:
        params["filters[commodity]"] = commodity

    async with httpx.AsyncClient(timeout=20.0) as client:
        resp = await client.get(url, params=params)
        resp.raise_for_status()
        payload = resp.json()

    raw_records = payload.get("records", [])
    normalized_rows = []
    for rec in raw_records:
        raw_comm = rec.get("commodity") or rec.get("Commodity") or ""
        canonical = canonicalize_commodity(raw_comm)
        if not canonical:
            continue
        try:
            arr_dt = parse_agmarknet_date(rec.get("arrival_date") or rec.get("Arrival_Date"))
            min_p = float(rec.get("min_price") or rec.get("Min_Price"))
            max_p = float(rec.get("max_price") or rec.get("Max_Price"))
            mod_p = float(rec.get("modal_price") or rec.get("Modal_Price"))
        except (TypeError, ValueError):
            continue

        normalized_rows.append({
            "vegetable_name": canonical,
            "raw_commodity_name": raw_comm,
            "variety": (rec.get("variety") or rec.get("Variety") or "Other").strip(),
            "reported_grade": (rec.get("grade") or rec.get("Grade") or "FAQ").strip(),
            "state": (rec.get("state") or rec.get("State") or state).strip(),
            "district": (rec.get("district") or rec.get("District") or "Unknown").strip(),
            "mandi_name": (rec.get("market") or rec.get("Market") or "Unknown").strip(),
            "arrival_date": arr_dt,
            "min_price": min_p,
            "max_price": max_p,
            "modal_price": mod_p,
            "unit": "INR/Quintal",
            "source": "AGMARKNET_DATA_GOV_IN",
            "is_demo": False,
        })

    inserted = upsert_price_records(db, normalized_rows)
    return {
        "status": "SUCCESS",
        "resource_id": res_id,
        "records_fetched": len(raw_records),
        "supported_veg_matched": len(normalized_rows),
        "records_inserted": inserted,
    }


def ingest_agmarknet_csv(db: Session, csv_bytes: bytes, source_label: str = "CSV_GOV_EXPORT", is_demo: bool = False) -> Dict[str, Any]:
    """
    Parses AGMARKNET / data.gov.in exported CSV files into HistoricalMandiPrice.
    Handles common column casing variants across AGMARKNET portal & data.gov.in downloads.
    """
    df = pd.read_csv(io.BytesIO(csv_bytes))
    df.columns = [c.strip().lower().replace(" ", "_") for c in df.columns]

    col_map = {
        "state": next((c for c in ["state", "state_name"] if c in df.columns), None),
        "district": next((c for c in ["district", "district_name"] if c in df.columns), None),
        "market": next((c for c in ["market", "mandi_name", "mandi", "market_name"] if c in df.columns), None),
        "commodity": next((c for c in ["commodity", "vegetable_name"] if c in df.columns), None),
        "variety": next((c for c in ["variety"] if c in df.columns), None),
        "grade": next((c for c in ["grade", "reported_grade"] if c in df.columns), None),
        "arrival_date": next((c for c in ["arrival_date", "price_date", "date"] if c in df.columns), None),
        "min_price": next((c for c in ["min_price", "min_x0020_price"] if c in df.columns), None),
        "max_price": next((c for c in ["max_price", "max_x0020_price"] if c in df.columns), None),
        "modal_price": next((c for c in ["modal_price", "modal_x0020_price"] if c in df.columns), None),
    }

    required = ["state", "district", "market", "commodity", "arrival_date", "min_price", "max_price", "modal_price"]
    missing = [k for k in required if col_map[k] is None]
    if missing:
        raise ValueError(f"CSV missing required AGMARKNET columns: {missing}")

    rows = []
    skipped = 0
    for _, r in df.iterrows():
        raw_comm = str(r[col_map["commodity"]])
        canonical = canonicalize_commodity(raw_comm)
        if not canonical:
            skipped += 1
            continue
        try:
            arr_dt = parse_agmarknet_date(str(r[col_map["arrival_date"]]))
            min_p = float(r[col_map["min_price"]])
            max_p = float(r[col_map["max_price"]])
            mod_p = float(r[col_map["modal_price"]])
        except (ValueError, TypeError):
            skipped += 1
            continue

        rows.append({
            "vegetable_name": canonical,
            "raw_commodity_name": raw_comm,
            "variety": str(r[col_map["variety"]]) if col_map["variety"] and pd.notna(r[col_map["variety"]]) else "Other",
            "reported_grade": str(r[col_map["grade"]]) if col_map["grade"] and pd.notna(r[col_map["grade"]]) else "FAQ",
            "state": str(r[col_map["state"]]).strip(),
            "district": str(r[col_map["district"]]).strip(),
            "mandi_name": str(r[col_map["market"]]).strip(),
            "arrival_date": arr_dt,
            "min_price": min_p,
            "max_price": max_p,
            "modal_price": mod_p,
            "unit": "INR/Quintal",
            "source": source_label,
            "is_demo": is_demo,
        })

    inserted = upsert_price_records(db, rows)
    return {
        "status": "SUCCESS",
        "rows_parsed": len(df),
        "rows_matched_supported_vegetables": len(rows),
        "rows_inserted": inserted,
        "rows_skipped": skipped,
        "source": source_label,
    }
