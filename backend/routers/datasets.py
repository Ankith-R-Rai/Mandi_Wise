import os
import shutil
import zipfile
from fastapi import APIRouter, Depends, File, Form, Header, HTTPException, UploadFile
from sqlalchemy.orm import Session

from backend.config import settings
from database.models import DatasetMetadata
from database.session import get_db
from datasets.prepare_dataset import prepare_classification_dataset

router = APIRouter(prefix="/api/datasets", tags=["Dataset Management"])


def _verify_admin(x_admin_token: str | None = Header(default=None)):
    if settings.ADMIN_API_TOKEN != "change-this-secure-admin-token" and x_admin_token != settings.ADMIN_API_TOKEN:
        raise HTTPException(status_code=403, detail="Invalid admin token.")


@router.get("")
def list_datasets(db: Session = Depends(get_db)):
    rows = db.query(DatasetMetadata).order_by(DatasetMetadata.uploaded_at.desc()).all()
    return {"datasets": rows}


@router.post("/upload")
async def upload_dataset_zip(
    file: UploadFile = File(...),
    name: str = Form(...),
    source_url: str = Form(default=""),
    license_name: str = Form(...),
    vegetable_scope: str = Form(...),
    db: Session = Depends(get_db),
    _: None = Depends(_verify_admin),
):
    if not (file.filename or "").lower().endswith(".zip"):
        raise HTTPException(status_code=400, detail="Upload dataset archive as .zip")

    safe_name = "".join(c for c in name if c.isalnum() or c in ("-", "_")) or "dataset"
    raw_dir = os.path.join(settings.DATASET_DIR, safe_name, "raw")
    prep_dir = os.path.join(settings.DATASET_DIR, safe_name, "prepared")
    os.makedirs(raw_dir, exist_ok=True)
    zip_path = os.path.join(settings.DATASET_DIR, f"{safe_name}.zip")

    with open(zip_path, "wb") as f:
        shutil.copyfileobj(file.file, f)

    with zipfile.ZipFile(zip_path, "r") as zf:
        zf.extractall(raw_dir)

    manifest = prepare_classification_dataset(raw_dir, prep_dir)
    meta = DatasetMetadata(
        name=name,
        source_url=source_url,
        license_name=license_name,
        vegetable_scope=vegetable_scope,
        total_images=manifest["total_images"],
        train_count=manifest["counts"]["train"],
        val_count=manifest["counts"]["val"],
        test_count=manifest["counts"]["test"],
        duplicates_removed=manifest["duplicates_removed"],
        storage_path=prep_dir,
    )
    db.add(meta)
    db.commit()
    db.refresh(meta)
    return {"dataset": meta, "manifest": manifest}
