import cv2
import numpy as np
from typing import Dict, Any, List, Tuple


def analyze_surface_opencv(image_bgr: np.ndarray) -> Tuple[np.ndarray, Dict[str, Any], List[Dict[str, Any]]]:
    """
    OpenCV preprocessing, LAB chroma segmentation & deterministic surface inspection:
    - Normalizes lighting via CLAHE on L-channel (LAB) to handle field/mandi variations.
    - Accurately segments crop foreground from neutral cutting boards/tiles via LAB chroma distance.
    - Extracts circular hue statistics, color bin ratios (Red, Green, Yellow-Brown, Purple),
      and multi-spectral feature vectors for trained ML classification.
    - Detects localized surface lesions strictly inside the crop (eroded boundary to avoid edge shadow false positives).
    - Generates honest, correlated heuristic quality metrics (cleanliness, firmness, uniformity, smoothness).
    """
    h_orig, w_orig = image_bgr.shape[:2]
    resized = cv2.resize(image_bgr, (512, 512), interpolation=cv2.INTER_AREA)

    # 1. Lighting normalization via CLAHE on L channel
    lab = cv2.cvtColor(resized, cv2.COLOR_BGR2LAB)
    l_ch, a_ch, b_ch = cv2.split(lab)
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    l_norm = clahe.apply(l_ch)
    norm_bgr = cv2.cvtColor(cv2.merge((l_norm, a_ch, b_ch)), cv2.COLOR_LAB2BGR)

    hsv = cv2.cvtColor(norm_bgr, cv2.COLOR_BGR2HSV)
    hue, sat, val = cv2.split(hsv)

    # 2. Robust Crop Foreground Segmentation
    # Neutral backgrounds (cutting boards, tiles, steel tables) have a ~ 128, b ~ 128 (chroma ~ 0).
    # Organic produce skins have strong color deviation from neutral gray/white.
    chroma = np.sqrt((a_ch.astype(float) - 128.0) ** 2 + (b_ch.astype(float) - 128.0) ** 2)
    raw_fg = ((chroma > 13.0) & (val > 38) & (val < 252)).astype(np.uint8) * 255

    # Morphological cleanup
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
    clean_fg = cv2.morphologyEx(raw_fg, cv2.MORPH_OPEN, kernel)
    clean_fg = cv2.morphologyEx(clean_fg, cv2.MORPH_CLOSE, kernel)

    # Connected component filtering to remove small background noise specks
    num_labels, labels, stats, _ = cv2.connectedComponentsWithStats(clean_fg)
    fg_mask = np.zeros_like(clean_fg)
    for lbl in range(1, num_labels):
        if stats[lbl, cv2.CC_STAT_AREA] >= 300:
            fg_mask[labels == lbl] = 255

    # Fill internal holes (e.g. dark decay, rot, blemish spots inside the produce contour)
    contours_fill, _ = cv2.findContours(fg_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    if contours_fill:
        cv2.drawContours(fg_mask, contours_fill, -1, 255, -1)

    fg_bool = fg_mask > 0
    fg_area = int(np.count_nonzero(fg_mask))
    if fg_area < 800:
        # Graceful fallback to central area if image was entirely desaturated/flat
        fg_mask[64:448, 64:448] = 255
        fg_bool = fg_mask > 0
        fg_area = int(np.count_nonzero(fg_mask))

    # 3. Multi-spectral Color & Geometry Feature Extraction
    v_hue = hue[fg_bool]
    v_sat = sat[fg_bool]
    v_val = val[fg_bool]
    v_l = l_norm[fg_bool]
    v_a = a_ch[fg_bool]
    v_b = b_ch[fg_bool]
    n_px = float(len(v_hue))

    red_ratio = float(np.count_nonzero(((v_hue < 14) | (v_hue >= 166)) & (v_sat > 40)) / n_px)
    green_ratio = float(np.count_nonzero((v_hue >= 35) & (v_hue <= 85) & (v_sat > 30)) / n_px)
    yb_ratio = float(np.count_nonzero((v_hue >= 14) & (v_hue < 35) & (v_sat > 25)) / n_px)
    purp_ratio = float(np.count_nonzero((v_hue >= 125) & (v_hue < 165) & (v_sat > 25)) / n_px)

    # Circular mean hue (handles trigonometric wrap-around at 0 and 180)
    theta = v_hue.astype(float) * (2.0 * np.pi / 180.0)
    sin_sum = float(np.sum(np.sin(theta)))
    cos_sum = float(np.sum(np.cos(theta)))
    norm_c = max(np.sqrt(sin_sum**2 + cos_sum**2), 1e-6)
    circ_sin = sin_sum / norm_c
    circ_cos = cos_sum / norm_c
    circ_rad = np.arctan2(sin_sum, cos_sum)
    if circ_rad < 0:
        circ_rad += 2.0 * np.pi
    circ_mean_hue = float(circ_rad * 180.0 / (2.0 * np.pi))

    # Contour shape features
    contours, _ = cv2.findContours(fg_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    aspect_ratio, solidity = 1.0, 0.88
    if contours:
        largest = max(contours, key=cv2.contourArea)
        rx, ry, rw, rh = cv2.boundingRect(largest)
        aspect_ratio = float(max(rw, rh) / max(min(rw, rh), 1))
        hull = cv2.convexHull(largest)
        h_area = cv2.contourArea(hull)
        if h_area > 0:
            solidity = float(min(1.0, cv2.contourArea(largest) / h_area))

    # Surface texture / wrinkling energy via Sobel gradients
    gray = cv2.cvtColor(norm_bgr, cv2.COLOR_BGR2GRAY)
    sobelx = cv2.Sobel(gray, cv2.CV_64F, 1, 0, ksize=3)
    sobely = cv2.Sobel(gray, cv2.CV_64F, 0, 1, ksize=3)
    grad_mag = np.sqrt(sobelx**2 + sobely**2)
    wrinkle_energy = float(np.mean(grad_mag[fg_bool])) if np.any(fg_bool) else 20.0
    wrinkle_score = max(0.0, min(1.0, wrinkle_energy / 80.0))

    # Sharpness check
    lap_var = float(cv2.Laplacian(gray, cv2.CV_64F).var())

    # 4. Localized Defect Detection Strictly Inside Vegetable
    # Erode fg_mask by 7px so outer perimeter edge shadows are never flagged as defects
    inner_veg = cv2.erode(fg_mask, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (7, 7)))
    inner_bool = inner_veg > 0

    mean_val = float(np.mean(v_val))
    val_thresh = min(68.0, mean_val * 0.65)
    dark_spots = ((val < val_thresh) & inner_bool).astype(np.uint8) * 255
    dark_spots = cv2.morphologyEx(dark_spots, cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))
    spot_ratio = float(np.count_nonzero(dark_spots)) / fg_area

    # Decay / mold discoloration mask
    decay_mask = (((val < 80) & (sat < 55)) | ((hue >= 10) & (hue <= 28) & (val < 90))) & inner_bool
    decay_ratio = float(np.count_nonzero(decay_mask)) / fg_area
    decay_score = min(1.0, decay_ratio * 2.5)

    # Extract localized defect bounding boxes from spot contours (filter small specks, keep top 6)
    defect_contours, _ = cv2.findContours(dark_spots, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    significant_defects = []
    for cnt in defect_contours:
        c_area = cv2.contourArea(cnt)
        if c_area < 55:
            continue
        x, y, bw, bh = cv2.boundingRect(cnt)
        rel_area = c_area / fg_area
        severity = "severe" if rel_area > 0.05 else ("moderate" if rel_area > 0.015 else "minor")
        significant_defects.append((c_area, {
            "defect_type": "Surface blemish / spot",
            "severity": severity,
            "confidence": round(min(0.95, 0.75 + (rel_area * 3.0)), 2),
            "bbox_xyxy": [
                round(x / 512.0, 4),
                round(y / 512.0, 4),
                round((x + bw) / 512.0, 4),
                round((y + bh) / 512.0, 4),
            ],
            "detector_source": "opencv_chroma_contour",
        }))

    # Sort descending by defect area and keep up to top 6 to prevent visual clutter
    significant_defects.sort(key=lambda item: item[0], reverse=True)
    cv_defects = [item[1] for item in significant_defects[:6]]

    # 5. Harmonized Honest Quality Metrics
    # Color uniformity: inverse of hue dispersion on crop
    hue_std = float(np.std(v_hue))
    color_uniformity = round(max(0.20, min(1.0, 1.0 - (hue_std / 55.0))), 3)

    # Surface Cleanliness: drops significantly with blemishes and decay
    cleanliness = round(max(0.15, min(1.0, 1.0 - (spot_ratio * 3.2) - (decay_ratio * 1.5))), 3)

    # Estimated Firmness: drops with wrinkling and decay
    firmness = round(max(0.20, min(1.0, 1.0 - (wrinkle_score * 0.50) - (decay_ratio * 1.2))), 3)

    # Texture Smoothness: inversely correlated with high-frequency Sobel energy
    smoothness = round(max(0.15, min(1.0, 1.0 - (wrinkle_score * 0.85))), 3)

    # Multi-dimensional ML feature vector (13 features)
    feature_vector = [
        red_ratio, green_ratio, yb_ratio, purp_ratio,
        float(np.mean(v_l)), float(np.mean(v_a)), float(np.mean(v_b)),
        circ_sin, circ_cos,
        float(np.mean(v_sat)), aspect_ratio, solidity, wrinkle_energy
    ]

    metrics = {
        "original_resolution": [w_orig, h_orig],
        "laplacian_sharpness": round(lap_var, 2),
        "blur_warning": lap_var < 50.0,
        "mean_hue": round(circ_mean_hue, 2),
        "circ_mean_hue": round(circ_mean_hue, 2),
        "mean_saturation": round(float(np.mean(v_sat)), 2),
        "mean_lightness": round(float(np.mean(v_l)), 2),
        "mean_lab_a": round(float(np.mean(v_a)), 2),
        "mean_lab_b": round(float(np.mean(v_b)), 2),
        # Color distribution ratios
        "red_ratio": round(red_ratio, 4),
        "green_ratio": round(green_ratio, 4),
        "yellow_brown_ratio": round(yb_ratio, 4),
        "purple_ratio": round(purp_ratio, 4),
        # Quality metrics (harmonized across frontend and backend key conventions)
        "color_uniformity": color_uniformity,
        "color_uniformity_score": color_uniformity,
        "surface_cleanliness": cleanliness,
        "blemish_ratio": round(spot_ratio, 4),
        "surface_defect_ratio": round(spot_ratio, 4),
        "estimated_firmness": firmness,
        "texture_smoothness": smoothness,
        "wrinkle_texture_score": round(wrinkle_score, 3),
        "wrinkling_energy": round(wrinkle_score, 3),
        "decay_indicator": round(decay_score, 3),
        "decay_indicator_score": round(decay_score, 3),
        "shape_regularity": round(solidity, 3),
        "shape_regularity_score": round(solidity, 3),
        "feature_vector": feature_vector,
    }

    cnn_input = cv2.resize(norm_bgr, (224, 224), interpolation=cv2.INTER_AREA)
    return cnn_input, metrics, cv_defects
