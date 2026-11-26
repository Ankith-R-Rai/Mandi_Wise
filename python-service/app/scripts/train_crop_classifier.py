import os
import joblib
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report

CROPS = ['Tomato', 'Potato', 'Onion', 'Brinjal', 'Green Chilli']

def generate_crop_samples(crop_name: str, n: int = 1200):
    """
    Generates realistic feature vectors representing diverse lighting, ripeness,
    and mandi conditions for the 5 target Indian vegetables.
    Feature vector schema (13 features):
    [0] red_ratio: fraction of crop pixels in red hue ([0, 14] U [166, 180]) with sat > 40
    [1] green_ratio: fraction of crop pixels in green hue ([35, 85]) with sat > 30
    [2] yellow_brown_ratio: fraction of crop pixels in yellow-brown hue ([14, 34]) with sat > 25
    [3] purple_ratio: fraction of crop pixels in purple hue ([125, 165]) with sat > 25
    [4] mean_lab_l: average L* (lightness 0..255)
    [5] mean_lab_a: average a* (greenness < 128 < redness)
    [6] mean_lab_b: average b* (blueness < 128 < yellowness)
    [7] circ_sin: circular mean hue sin component
    [8] circ_cos: circular mean hue cos component
    [9] mean_sat: average HSV saturation (0..255)
    [10] aspect_ratio: bounding box aspect ratio max(w,h)/min(w,h)
    [11] solidity: contour area / convex hull area
    [12] texture_energy: Sobel edge gradient magnitude
    """
    np.random.seed(hash(crop_name) % 10000)

    if crop_name == 'Tomato':
        # Ripe red, deep red, orange-red turning (breaker), and glossy or soft-lit skin
        red_r = np.random.uniform(0.40, 0.99, n)
        green_r = np.random.uniform(0.0, 0.04, n)
        yb_r = np.random.uniform(0.0, 0.12, n)
        purp_r = np.random.uniform(0.0, 0.012, n)
        lab_l = np.random.uniform(85, 175, n)
        lab_a = np.random.uniform(143, 185, n)  # Positive red a*
        lab_b = np.random.uniform(130, 175, n)
        circ_sin = np.random.uniform(-0.35, 0.28, n)
        circ_cos = np.random.uniform(0.85, 1.0, n)
        sat = np.random.uniform(75, 240, n)  # Supports both soft-lit and vibrant specimens
        aspect = np.random.uniform(0.95, 1.45, n)
        solidity = np.random.uniform(0.82, 0.98, n)
        texture = np.random.uniform(10, 60, n)

    elif crop_name == 'Potato':
        # Tan, buff, earthy yellow-brown, dusty tubers
        red_r = np.random.uniform(0.0, 0.06, n)
        green_r = np.random.uniform(0.0, 0.05, n)
        yb_r = np.random.uniform(0.38, 0.88, n)
        purp_r = np.random.uniform(0.0, 0.01, n)
        lab_l = np.random.uniform(105, 185, n)
        lab_a = np.random.uniform(124, 134, n)  # Neutral a* (not red)
        lab_b = np.random.uniform(136, 162, n)  # Warm yellow b*
        circ_sin = np.random.uniform(0.18, 0.65, n)
        circ_cos = np.random.uniform(0.68, 0.96, n)
        sat = np.random.uniform(35, 125, n)
        aspect = np.random.uniform(1.0, 1.7, n)
        solidity = np.random.uniform(0.87, 0.98, n)
        texture = np.random.uniform(10, 48, n)

    elif crop_name == 'Onion':
        # Indian Red Onion & Yellow Onion: papery dry outer scales, copper/purplish-red skin
        red_r = np.random.uniform(0.10, 0.80, n)
        green_r = np.random.uniform(0.0, 0.03, n)
        yb_r = np.random.uniform(0.06, 0.65, n)  # Onions always have papery copper scales
        purp_r = np.random.uniform(0.015, 0.25, n)  # Anthocyanin overtone
        lab_l = np.random.uniform(75, 165, n)
        lab_a = np.random.uniform(133, 149, n)  # Muted warm red-purple
        lab_b = np.random.uniform(132, 160, n)
        circ_sin = np.random.uniform(-0.30, 0.45, n)
        circ_cos = np.random.uniform(0.75, 1.0, n)
        sat = np.random.uniform(50, 120, n)  # Matte/papery lower saturation
        aspect = np.random.uniform(1.0, 2.3, n)
        solidity = np.random.uniform(0.75, 0.96, n)
        texture = np.random.uniform(20, 80, n)  # Higher texture from papery layers

    elif crop_name == 'Brinjal':
        # Glossy deep purple, dark eggplant, violet cultivars
        red_r = np.random.uniform(0.0, 0.08, n)
        green_r = np.random.uniform(0.0, 0.06, n)
        yb_r = np.random.uniform(0.0, 0.06, n)
        purp_r = np.random.uniform(0.28, 0.88, n)
        lab_l = np.random.uniform(35, 115, n)
        lab_a = np.random.uniform(131, 162, n)
        lab_b = np.random.uniform(102, 126, n)  # Blue/purple tint (b* < 128)
        circ_sin = np.random.uniform(-0.98, -0.55, n)
        circ_cos = np.random.uniform(-0.65, 0.45, n)
        sat = np.random.uniform(45, 185, n)
        aspect = np.random.uniform(1.1, 2.5, n)
        solidity = np.random.uniform(0.80, 0.97, n)
        texture = np.random.uniform(12, 52, n)

    elif crop_name == 'Green Chilli':
        # Vivid to dark green pods, slender elongated shape
        red_r = np.random.uniform(0.0, 0.04, n)
        green_r = np.random.uniform(0.32, 0.92, n)
        yb_r = np.random.uniform(0.01, 0.16, n)
        purp_r = np.random.uniform(0.0, 0.01, n)
        lab_l = np.random.uniform(75, 165, n)
        lab_a = np.random.uniform(98, 124, n)  # Strongly negative a* (green)
        lab_b = np.random.uniform(128, 166, n)
        circ_sin = np.random.uniform(0.62, 0.99, n)
        circ_cos = np.random.uniform(-0.55, 0.55, n)
        sat = np.random.uniform(75, 225, n)
        aspect = np.random.uniform(1.8, 5.5, n)  # Elongated pod
        solidity = np.random.uniform(0.62, 0.91, n)
        texture = np.random.uniform(14, 58, n)

    else:
        raise ValueError(f"Unknown crop: {crop_name}")

    X = np.column_stack([
        red_r, green_r, yb_r, purp_r,
        lab_l, lab_a, lab_b,
        circ_sin, circ_cos,
        sat, aspect, solidity, texture
    ])
    y = [crop_name] * n
    return X, y

def main():
    print("Generating comprehensive multi-crop training dataset...")
    X_list, y_list = [], []
    for crop in CROPS:
        x_c, y_c = generate_crop_samples(crop, n=1500)
        X_list.append(x_c)
        y_list.extend(y_c)

    X = np.vstack(X_list)
    y = np.array(y_list)
    print(f"Dataset generated: {X.shape[0]} samples across {len(CROPS)} crop classes.")

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )

    pipeline = Pipeline([
        ('scaler', StandardScaler()),
        ('rf', RandomForestClassifier(
            n_estimators=150,
            max_depth=14,
            min_samples_split=4,
            random_state=42,
            n_jobs=-1
        ))
    ])

    print("Fitting RandomForest classifier pipeline...")
    pipeline.fit(X_train, y_train)

    y_pred = pipeline.predict(X_test)
    print("\n--- Test Set Evaluation Report ---")
    print(classification_report(y_test, y_pred))

    model_dir = os.path.join(os.path.dirname(__file__), "..", "models")
    os.makedirs(model_dir, exist_ok=True)
    model_path = os.path.join(model_dir, "crop_classifier.joblib")
    joblib.dump(pipeline, model_path)
    print(f"Saved trained crop classifier model to: {os.path.abspath(model_path)}")

if __name__ == "__main__":
    main()
