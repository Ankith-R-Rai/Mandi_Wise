import argparse, json
from training.train_classifier import train_mobilenetv2

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--data-dir", required=True, help="Directory with train/val/test/{Fresh,Unripe,Over-Mature,Damaged}")
    parser.add_argument("--epochs", type=int, default=12)
    args = parser.parse_args()
    print(json.dumps(train_mobilenetv2(args.data_dir, "mobilenetv2_quality_classifier.pt", args.epochs), indent=2))

# training/train_yolo.py
import argparse, os, shutil
from ultralytics import YOLO
from backend.config import settings

def train_yolo_detector(data_yaml: str, epochs: int = 50, imgsz: int = 640):
    model = YOLO("yolov8n.pt")
    results = model.train(data=data_yaml, epochs=epochs, imgsz=imgsz, project="runs/agrivision_yolo", name="vegqual")
    best_weights = os.path.join(results.save_dir, "weights", "best.pt")
    os.makedirs(settings.MODEL_ARTIFACTS_DIR, exist_ok=True)
    dst = os.path.join(settings.MODEL_ARTIFACTS_DIR, "yolov8_veg_defect.pt")
    if os.path.exists(best_weights):
        shutil.copy2(best_weights, dst)
    return dst

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--data-yaml", required=True, help="Path to VegQual YOLO data.yaml")
    parser.add_argument("--epochs", type=int, default=50)
    args = parser.parse_args()
    print("Saved YOLO weights to:", train_yolo_detector(args.data_yaml, args.epochs))
