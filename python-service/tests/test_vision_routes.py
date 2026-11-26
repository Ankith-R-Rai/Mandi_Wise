from fastapi.testclient import TestClient
import numpy as np
import cv2
import io
from app.main import app

client = TestClient(app)

def test_get_supported_crops():
    response = client.get("/api/crops")
    assert response.status_code == 200
    data = response.json()
    assert "supported_vegetables" in data
    crop_names = [c["name"] for c in data["supported_vegetables"]]
    assert "Tomato" in crop_names
    assert "Potato" in crop_names
    assert "Onion" in crop_names
    assert "Brinjal" in crop_names
    assert "Green Chilli" in crop_names

def test_analyze_image_synthetic_tomato():
    # Create synthetic red tomato image in memory
    img = np.zeros((300, 300, 3), dtype=np.uint8)
    cv2.circle(img, (150, 150), 100, (30, 30, 220), -1)  # BGR Red
    _, buf = cv2.imencode(".png", img)

    response = client.post(
        "/api/analyze",
        files={"file": ("test_tomato.png", io.BytesIO(buf.tobytes()), "image/png")},
        data={"vegetable_hint": "Tomato"}
    )
    assert response.status_code == 200
    res = response.json()
    assert "identification" in res
    assert "quality" in res
    assert "grading" in res
    assert res["grading"]["grade"] in ["Grade A", "Grade B", "Grade C"]
    assert res["identification"]["predicted_vegetable"] == "Tomato"
