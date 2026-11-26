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

def test_analyze_image_synthetic_tomato_with_hint():
    # Create synthetic red tomato image in memory on neutral background
    img = np.full((300, 300, 3), 220, dtype=np.uint8)  # White/gray table
    cv2.circle(img, (150, 150), 90, (30, 30, 220), -1)  # BGR Red
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
    assert res["identification"]["model_status"] == "USER_HINT"

    # Verify metrics harmonization
    metrics = res["quality"]["cv_metrics"]
    for key in ["color_uniformity", "surface_cleanliness", "estimated_firmness", "texture_smoothness"]:
        assert key in metrics
        assert 0.0 <= metrics[key] <= 1.0

def test_analyze_image_auto_detect_tomato():
    # Synthetic red tomato without any hint
    img = np.full((350, 350, 3), 230, dtype=np.uint8)  # White tile background
    cv2.circle(img, (175, 175), 110, (25, 25, 215), -1)  # Ripe red tomato
    _, buf = cv2.imencode(".png", img)

    response = client.post(
        "/api/analyze",
        files={"file": ("auto_tomato.png", io.BytesIO(buf.tobytes()), "image/png")},
    )
    assert response.status_code == 200
    res = response.json()
    assert res["identification"]["predicted_vegetable"] == "Tomato"
    assert res["identification"]["confidence"] >= 0.70
    assert res["identification"]["model_status"] in ["TRAINED_ACTIVE", "CALIBRATED_RULES"]

def test_analyze_image_auto_detect_green_chilli():
    # Synthetic elongated green chilli on neutral background
    img = np.full((400, 200, 3), 225, dtype=np.uint8)
    cv2.ellipse(img, (100, 200), (35, 150), 0, 0, 360, (20, 180, 40), -1)  # Green chilli pod
    _, buf = cv2.imencode(".png", img)

    response = client.post(
        "/api/analyze",
        files={"file": ("auto_chilli.png", io.BytesIO(buf.tobytes()), "image/png")},
    )
    assert response.status_code == 200
    res = response.json()
    assert res["identification"]["predicted_vegetable"] == "Green Chilli"
    assert res["identification"]["confidence"] >= 0.70

def test_defect_bounding_boxes_within_normalized_bounds():
    # Synthetic tomato with a dark blemish spot in center
    img = np.full((300, 300, 3), 220, dtype=np.uint8)
    cv2.circle(img, (150, 150), 90, (30, 30, 220), -1)  # Red tomato
    cv2.circle(img, (150, 150), 20, (20, 20, 25), -1)   # Dark blemish spot inside tomato
    _, buf = cv2.imencode(".png", img)

    response = client.post(
        "/api/analyze",
        files={"file": ("blemished_tomato.png", io.BytesIO(buf.tobytes()), "image/png")},
    )
    assert response.status_code == 200
    res = response.json()
    defects = res["defects"]
    assert len(defects) >= 1
    for d in defects:
        bbox = d["bbox_xyxy"]
        assert len(bbox) == 4
        assert 0.0 <= bbox[0] <= 1.0
        assert 0.0 <= bbox[1] <= 1.0
        assert 0.0 <= bbox[2] <= 1.0
        assert 0.0 <= bbox[3] <= 1.0
        assert bbox[2] >= bbox[0]
        assert bbox[3] >= bbox[1]
