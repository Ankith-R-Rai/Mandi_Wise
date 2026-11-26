import cv2
import numpy as np
from typing import Dict, Any, List, Tuple


def analyze_surface_opencv(image_bgr: np.ndarray) -> Tuple[np.ndarray, Dict[str, Any], List[Dict[str, Any]]]:
    """
    OpenCV preprocessing & deterministic surface inspection:
    - Resizes image to 512x512 preserving context for analysis and 224x224 for MobileNetV2.
    - Applies CLAHE on L-channel (LAB) to normalize uneven field/mandi lighting.
    - Computes HSV hue/saturation distribution, dark-spot/lesion masks, edge/wrinkle variance,
      decay discoloration ratio, and primary contour shape regularity.
    """
    h, w = image_bgr.shape[:2]
    resized = cv2.resize(image_bgr, (512, 512), interpolation=cv2.INTER_AREA)

    # Lighting normalization via CLAHE on L channel
    lab = cv2.cvtColor(resized, cv2.COLOR_BGR2LAB)
    l_ch, a_ch, b_ch = cv2.split(lab)
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    l_norm = clahe.apply(l_ch)
    norm_bgr = cv2.cvtColor(cv2.merge((l_norm, a_ch, b_ch)), cv2.COLOR_LAB2BGR)

    hsv = cv2.cvtColor(norm_bgr, cv2.COLOR_BGR2HSV)
    hue, sat, val = cv2.split(hsv)

    # Foreground crop mask (exclude near-white or neutral flat background where possible)
    fg_mask = ((sat > 25) | (val < 235)).astype(np.uint8) * 255
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (7, 7))
    fg_mask = cv2.morphologyEx(fg_mask, cv2.MORPH_CLOSE, kernel)
    fg_area = int(np.count_nonzero(fg_mask)) or (512 * 512)

    # Color uniformity (inverse normalized std of Hue/Saturation on foreground)
    fg_bool = fg_mask > 0
    hue_std = float(np.std(hue[fg_bool])) if np.any(fg_bool) else 0.0
    sat_mean = float(np.mean(sat[fg_bool])) if np.any(fg_bool) else 0.0
    color_uniformity = max(0.0, min(1.0, 1.0 - (hue_std / 60.0)))

    # Dark spots / necrotic lesions: low value + high local contrast
    dark_spots = ((val < 65) & fg_bool).astype(np.uint8) * 255
    dark_spots = cv2.morphologyEx(dark_spots, cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))
    spot_ratio = float(np.count_nonzero(dark_spots)) / fg_area

    # Decay / mold discoloration: low saturation + dull/brownish-gray luminance inside foreground
    decay_mask = (((val < 85) & (sat < 60)) | ((hue >= 10) & (hue <= 28) & (val < 95))) & fg_bool
    decay_ratio = float(np.count_nonzero(decay_mask)) / fg_area

    # Wrinkle / shrivelling indicator via high-frequency Sobel gradient energy inside foreground
    gray = cv2.cvtColor(norm_bgr, cv2.COLOR_BGR2GRAY)
    sobelx = cv2.Sobel(gray, cv2.CV_64F, 1, 0, ksize=3)
    sobely = cv2.Sobel(gray, cv2.CV_64F, 0, 1, ksize=3)
    grad_mag = np.sqrt(sobelx**2 + sobely**2)
    wrinkle_energy = float(np.mean(grad_mag[fg_bool])) if np.any(fg_bool) else 0.0
    wrinkle_score = max(0.0, min(1.0, wrinkle_energy / 95.0))

    # Sharpness check (Laplacian variance) for image quality warning
    lap_var = float(cv2.Laplacian(gray, cv2.CV_64F).var())

    # Shape regularity via primary foreground contour solidity
    contours, _ = cv2.findContours(fg_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    shape_regularity = 0.85
    if contours:
        largest = max(contours, key=cv2.contourArea)
        area = cv2.contourArea(largest)
        hull = cv2.convexHull(largest)
        hull_area = cv2.contourArea(hull)
        if hull_area > 0:
            shape_regularity = float(min(1.0, area / hull_area))

    # Extract localized defect bounding boxes from spot contours
    defect_contours, _ = cv2.findContours(dark_spots, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    cv_defects: List[Dict[str, Any]] = []
    for cnt in defect_contours:
        c_area = cv2.contourArea(cnt)
        if c_area < 45:
            continue
        x, y, bw, bh = cv2.boundingRect(cnt)
        rel_area = c_area / fg_area
        severity = "high" if rel_area > 0.04 else ("moderate" if rel_area > 0.01 else "low")
        cv_defects.append({
            "defect_type": "Surface blemish / spot",
            "severity": severity,
            "confidence": None,
            "bbox_xyxy": [round(x / 512, 4), round(y / 512, 4), round((x + bw) / 512, 4), round((y + bh) / 512, 4)],
            "detector_source": "opencv_contour",
        })

    metrics = {
        "original_resolution": [w, h],
        "laplacian_sharpness": round(lap_var, 2),
        "blur_warning": lap_var < 50.0,
        "mean_hue": round(float(np.mean(hue[fg_bool])) if np.any(fg_bool) else 0.0, 2),
        "mean_saturation": round(sat_mean, 2),
        "color_uniformity_score": round(color_uniformity, 3),
        "surface_defect_ratio": round(spot_ratio, 4),
        "decay_indicator_score": round(min(1.0, decay_ratio * 2.5), 3),
        "wrinkle_texture_score": round(wrinkle_score, 3),
        "shape_regularity_score": round(shape_regularity, 3),
    }

    cnn_input = cv2.resize(norm_bgr, (224, 224), interpolation=cv2.INTER_AREA)
    return cnn_input, metrics, cv_defects
