"""
Tests for Data Cleaning and Canonical Market Data API endpoints.
Following strict TDD.
"""

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_api_clean_dataset_endpoint():
    payload = {
        "records": [
            {
                "State": "Karnataka",
                "District": "Kolar",
                "Market": "Kolar",
                "Commodity": "Tomato",
                "Variety": "Hybrid",
                "Arrival_Date": "14/11/2026",
                "Min_x0020_Price": 1800,
                "Max_x0020_Price": 2500,
                "Modal_x0020_Price": 2200,
                "Unit": "Rs/Quintal",
                "Source": "AGMARKNET"
            },
            {
                "State": "Maharashtra",
                "District": "Pune",
                "Market": "Pune",
                "Commodity": "Tomato",
                "Arrival_Date": "14/11/2026",
                "Min_x0020_Price": 1500,
                "Max_x0020_Price": 2000,
                "Modal_x0020_Price": 1800,
            }
        ],
        "reference_date": "2026-11-15"
    }

    response = client.post("/api/v1/data/clean", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["total_input_records"] == 2
    assert data["valid_count"] == 1
    assert data["rejected_count"] == 1
    assert data["fresh_count"] == 1
    assert len(data["valid_records"]) == 1
    assert data["valid_records"][0]["market"] == "Kolar"
    assert data["valid_records"][0]["freshness_status"] == "FRESH"


def test_api_canonical_data_summary():
    response = client.get("/api/v1/data/canonical/summary")
    assert response.status_code == 200
    data = response.json()
    assert data["total_records"] >= 18
    assert "Tomato" in data["supported_commodities"]
    assert "Onion" in data["supported_commodities"]
    assert "Potato" in data["supported_commodities"]
    assert len(data["supported_markets"]) >= 6
