"""
Script to generate verified, canonical Karnataka Mandi data from raw source records.
"""

import json
from datetime import date
from pathlib import Path

from app.services.data_cleaner import MarketDataCleaner


def main():
    root_dir = Path(__file__).resolve().parents[2].parent
    raw_path = root_dir / "data" / "raw_karnataka_mandi_sample.json"
    output_path = root_dir / "data" / "canonical_karnataka_mandi_data.json"

    print(f"Loading raw records from: {raw_path}")
    with open(raw_path, "r", encoding="utf-8") as f:
        raw_records = json.load(f)

    cleaner = MarketDataCleaner()
    # Reference date fixed to 2026-11-15 for Phase 2 baseline consistency
    ref_date = date(2026, 11, 15)

    result = cleaner.clean_dataset(raw_records, reference_date=ref_date)

    print(f"Batch Processing Summary:")
    print(f"  Total records: {result.total_input_records}")
    print(f"  Valid records: {result.valid_count}")
    print(f"  Rejected records: {result.rejected_count}")
    print(f"  Fresh records (<=7d): {result.fresh_count}")
    print(f"  Acceptable records (8-30d): {result.acceptable_count}")
    print(f"  Stale records (>30d): {result.stale_count}")

    if result.rejected_count > 0:
        print("\nRejected records details:")
        for r in result.rejected_records:
            print(f"  - {r.commodity} at {r.market}: {r.validation_notes}")

    # Serialize canonical valid records
    canonical_data = [r.model_dump() for r in result.valid_records]

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(canonical_data, f, indent=2)

    print(f"\nSuccessfully wrote {len(canonical_data)} canonical records to: {output_path}")


if __name__ == "__main__":
    main()
