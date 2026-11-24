from pathlib import Path
import inspect
import pandas as pd

from database.session import SessionLocal
from database.models import HistoricalMandiPrice

ROOT = Path(__file__).resolve().parents[1]
CSV = ROOT / "data" / "processed" / "mandi_prices_combined.csv"

SOURCE = "CEDA_AGGREGATED_KARNATAKA"
MARKET = "Karnataka (aggregated)"

COMMODITIES = {
    "brinjal": ("Brinjal", "Brinjal"),
    "green chilli": ("Green Chilli", "Green Chilli"),
    "onion": ("Onion", "Onion"),
    "potato": ("Potato", "Potato"),
    "tomato": ("Tomato", "Tomato"),
}

def main():
    if not CSV.exists():
        raise FileNotFoundError(f"Combined dataset not found: {CSV}")

    df = pd.read_csv(CSV)
    required = {
        "date", "modal_price", "min_price",
        "max_price", "commodity"
    }
    missing = required - set(df.columns)
    if missing:
        raise ValueError(f"Missing CSV columns: {sorted(missing)}")

    df["date"] = pd.to_datetime(df["date"], errors="coerce", dayfirst=False)
    for col in ["modal_price", "min_price", "max_price"]:
        df[col] = pd.to_numeric(df[col], errors="coerce")

    df["commodity"] = df["commodity"].astype(str).str.strip().str.lower()
    df = df.dropna(subset=[
        "date", "modal_price", "min_price", "max_price"
    ])

    df = df[
        (df["min_price"] > 0) &
        (df["modal_price"] > 0) &
        (df["max_price"] > 0) &
        (df["min_price"] <= df["modal_price"]) &
        (df["modal_price"] <= df["max_price"]) &
        (df["commodity"].isin(COMMODITIES))
    ].copy()

    db = SessionLocal()
    inserted = 0
    updated = 0

    try:
        for row in df.to_dict("records"):
            raw = COMMODITIES[row["commodity"]][1]
            arrival = row["date"].date()

            existing = db.query(HistoricalMandiPrice).filter_by(
                raw_commodity_name=raw,
                state="Karnataka",
                mandi_name=MARKET,
                arrival_date=arrival,
                variety="Aggregated",
                source=SOURCE
            ).first()

            values = {
                "vegetable_name": COMMODITIES[row["commodity"]][0],
                "raw_commodity_name": raw,
                "variety": "Aggregated",
                "reported_grade": None,
                "state": "Karnataka",
                "district": "All districts (aggregated)",
                "mandi_name": MARKET,
                "arrival_date": arrival,
                "min_price": float(row["min_price"]),
                "max_price": float(row["max_price"]),
                "modal_price": float(row["modal_price"]),
                "unit": "INR/Quintal",
                "source": SOURCE,
                "is_demo": False,
            }

            if existing:
                for key, value in values.items():
                    setattr(existing, key, value)
                updated += 1
            else:
                db.add(HistoricalMandiPrice(**values))
                inserted += 1

        db.commit()
        print("\nDATASET IMPORT COMPLETED")
        print(f"Valid records: {len(df)}")
        print(f"New records: {inserted}")
        print(f"Updated records: {updated}")

        print("\nStarting price-model training...")
        from price_prediction.train_price_model import (
            train_and_evaluate_price_models
        )

        parameters = inspect.signature(
            train_and_evaluate_price_models
        ).parameters

        if len(parameters) == 0:
            train_and_evaluate_price_models()
        else:
            train_and_evaluate_price_models(db)

        print("\nPRICE MODEL TRAINING COMPLETED")

    except Exception:
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    main()
