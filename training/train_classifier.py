"""
Trains MobileNetV2 on prepared train/val/test vegetable directories and computes
REAL Precision, Recall, F1-score, Accuracy, and Confusion Matrix on the held-out test set.
"""
import argparse
import json
import os
from datetime import datetime
import torch
import torch.nn as nn
from torch.utils.data import DataLoader
from torchvision import datasets, models, transforms
from sklearn.metrics import accuracy_score, precision_recall_fscore_support, confusion_matrix

from backend.config import settings


def train_mobilenetv2(data_dir: str, output_filename: str, epochs: int = 10, batch_size: int = 32, lr: float = 3e-4):
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    train_tf = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.RandomHorizontalFlip(),
        transforms.ColorJitter(brightness=0.15, contrast=0.15),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]),
    ])
    eval_tf = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]),
    ])

    train_ds = datasets.ImageFolder(os.path.join(data_dir, "train"), transform=train_tf)
    val_ds = datasets.ImageFolder(os.path.join(data_dir, "val"), transform=eval_tf)
    test_ds = datasets.ImageFolder(os.path.join(data_dir, "test"), transform=eval_tf)

    train_loader = DataLoader(train_ds, batch_size=batch_size, shuffle=True, num_workers=2)
    val_loader = DataLoader(val_ds, batch_size=batch_size, shuffle=False, num_workers=2)
    test_loader = DataLoader(test_ds, batch_size=batch_size, shuffle=False, num_workers=2)

    model = models.mobilenet_v2(weights=models.MobileNet_V2_Weights.IMAGENET1K_V1)
    model.classifier[1] = nn.Linear(model.last_channel, len(train_ds.classes))
    model = model.to(device)

    criterion = nn.CrossEntropyLoss()
    optimizer = torch.optim.AdamW(model.parameters(), lr=lr)

    best_val_acc = -1.0
    best_state = None
    for epoch in range(epochs):
        model.train()
        for imgs, labels in train_loader:
            imgs, labels = imgs.to(device), labels.to(device)
            optimizer.zero_grad()
            loss = criterion(model(imgs), labels)
            loss.backward()
            optimizer.step()

        model.eval()
        val_preds, val_true = [], []
        with torch.no_grad():
            for imgs, labels in val_loader:
                preds = model(imgs.to(device)).argmax(dim=1).cpu().tolist()
                val_preds.extend(preds)
                val_true.extend(labels.tolist())
        val_acc = accuracy_score(val_true, val_preds) if val_true else 0.0
        print(f"Epoch {epoch+1}/{epochs} - val_acc={val_acc:.4f}")
        if val_acc >= best_val_acc:
            best_val_acc = val_acc
            best_state = {k: v.cpu() for k, v in model.state_dict().items()}

    model.load_state_dict(best_state)
    model.eval()
    y_true, y_pred = [], []
    with torch.no_grad():
        for imgs, labels in test_loader:
            y_pred.extend(model(imgs.to(device)).argmax(dim=1).cpu().tolist())
            y_true.extend(labels.tolist())

    acc = float(accuracy_score(y_true, y_pred))
    p, r, f1, _ = precision_recall_fscore_support(y_true, y_pred, average="weighted", zero_division=0)
    per_p, per_r, per_f1, _ = precision_recall_fscore_support(y_true, y_pred, average=None, zero_division=0)
    cm = confusion_matrix(y_true, y_pred).tolist()

    version = datetime.utcnow().strftime("v%Y%m%d%H%M")
    os.makedirs(settings.MODEL_ARTIFACTS_DIR, exist_ok=True)
    out_path = os.path.join(settings.MODEL_ARTIFACTS_DIR, output_filename)
    torch.save({
        "state_dict": best_state,
        "classes": train_ds.classes,
        "version": version,
        "trained_at": datetime.utcnow().isoformat(),
    }, out_path)

    eval_report = {
        "version": version,
        "classes": train_ds.classes,
        "accuracy": round(acc, 4),
        "precision_weighted": round(float(p), 4),
        "recall_weighted": round(float(r), 4),
        "f1_weighted": round(float(f1), 4),
        "per_class": {
            cls: {"precision": round(float(per_p[i]), 4), "recall": round(float(per_r[i]), 4), "f1": round(float(per_f1[i]), 4)}
            for i, cls in enumerate(train_ds.classes)
        },
        "confusion_matrix": cm,
    }
    with open(out_path + ".eval.json", "w") as f:
        json.dump(eval_report, f, indent=2)
    return eval_report


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--data-dir", required=True)
    parser.add_argument("--output", default="mobilenetv2_veg_classifier.pt")
    parser.add_argument("--epochs", type=int, default=10)
    args = parser.parse_args()
    print(json.dumps(train_mobilenetv2(args.data_dir, args.output, args.epochs), indent=2))
