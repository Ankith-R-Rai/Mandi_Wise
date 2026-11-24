from typing import List, Optional
from fastapi import APIRouter, Depends, File, HTTPException, Query, UploadFile
from sqlalchemy import func
from sqlalchemy.orm import Session

from backend.schemas import PricePredictRequest
from backend.services.market_ingest import fetch_data_gov_agmarknet, ingest_agmarknet_csv
from database.models import HistoricalMandiPrice, PricePrediction
from database.session import get_db
from price_prediction.predictor import predict_mandi_price
from price_prediction.train_price_model import train_and_evaluate_price_models

router = APIRouter(prefix="/api", tags=["Agricultural Market & Price Prediction"])


@router.get("/mandis")
def list_mandis(state: str = "Karnataka", db: Session = Depends(get_db)):
    rows = (
        db.query(HistoricalMandiPrice.mandi_name, HistoricalMandiPrice.district, HistoricalMandiPrice.is_demo)
        .filter(HistoricalMandiPrice.state.ilike(state))
        .distinct()
        .order_by(HistoricalMandiPrice.district, HistoricalMandiPrice.mandi_name)
        .all()
    )
    return {
        "state": state,
        "mandis": [{"mandi_name": r[0], "district": r[1], "is_demo": r[2]} for r in rows],
    }


@router.get("/historical-prices")
def get_historical_prices(
    vegetable_name: str,
    mandi_name: Optional[str] = None,
    state: str = "Karnataka",
    limit: int = 90,
    db: Session = Depends(get_db),
):
    q = db.query(HistoricalMandiPrice).filter(
        HistoricalMandiPrice.vegetable_name == vegetable_name,
        HistoricalMandiPrice.state.ilike(state),
    )
    if mandi_name:
        q = q.filter(HistoricalMandiPrice.mandi_name == mandi_name)
    rows = q.order_by(HistoricalMandiPrice.arrival_date.desc()).limit(limit).all()
    rows = list(reversed(rows))
    return {
        "vegetable_name": vegetable_name,
        "state": state,
        "mandi_name": mandi_name,
        "records": [{
            "arrival_date": r.arrival_date.isoformat(),
            "mandi_name": r.mandi_name,
            "district": r.district,
            "variety": r.variety,
            "min_price": r.min_price,
            "max_price": r.max_price,
            "modal_price": r.modal_price,
            "unit": r.unit,
            "source": r.source,
            "is_demo": r.is_demo,
        } for r in rows],
    }


@router.get("/market-comparison")
def compare_mandis(
    vegetable_name: str,
    mandis: List[str] = Query(...),
    state: str = "Karnataka",
    db: Session = Depends(get_db),
):
    rows = (
        db.query(HistoricalMandiPrice)
        .filter(
            HistoricalMandiPrice.vegetable_name == vegetable_name,
            HistoricalMandiPrice.state.ilike(state),
            HistoricalMandiPrice.mandi_name.in_(mandis),
        )
        .order_by(HistoricalMandiPrice.arrival_date.asc())
        .all()
    )
    summary = {}
    for r in rows:
        summary.setdefault(r.mandi_name, []).append(r)

    comparison = []
    for m_name, m_rows in summary.items():
        latest = m_rows[-1]
        avg_modal = sum(x.modal_price for x in m_rows) / len(m_rows)
        comparison.append({
            "mandi_name": m_name,
            "district": latest.district,
            "latest_date": latest.arrival_date.isoformat(),
            "latest_modal_price": latest.modal_price,
            "latest_min_price": latest.min_price,
            "latest_max_price": latest.max_price,
            "period_avg_modal": round(avg_modal, 2),
            "source": latest.source,
            "is_demo": latest.is_demo,
        })
    comparison.sort(key=lambda x: x["latest_modal_price"], reverse=True)
    return {
        "vegetable_name": vegetable_name,
        "state": state,
        "highest_observed_mandi": comparison[0]["mandi_name"] if comparison else None,
        "comparison": comparison,
        "trend_series": [{
            "arrival_date": r.arrival_date.isoformat(),
            "mandi_name": r.mandi_name,
            "modal_price": r.modal_price,
            "is_demo": r.is_demo,
        } for r in rows],
    }


@router.post("/predict-price")
def predict_price(req: PricePredictRequest, db: Session = Depends(get_db)):
    res = predict_mandi_price(
        db=db,
        vegetable_name=req.vegetable_name,
        mandi_name=req.mandi_name,
        target_date=req.target_date,
        grade=req.grade,
        allow_demo_fallback=req.allow_demo_fallback,
    )
    db.add(PricePrediction(
        image_id=req.image_id,
        vegetable_name=req.vegetable_name,
        grade=req.grade,
        mandi_name=req.mandi_name,
        target_date=req.target_date,
        predicted_modal_price=res["predicted_modal_price"],
        predicted_min_price=res["predicted_min_price"],
        predicted_max_price=res["predicted_max_price"],
        is_grade_specific=res["is_grade_specific"],
        model_type=res["model_type"],
        model_version=res["model_version"],
        reliability_note=res["reliability_note"],
        is_demo_based=res["is_demo_based"],
    ))
    db.commit()
    return res


@router.post("/market-data/sync")
async def sync_agmarknet_data(state: str = "Karnataka", commodity: Optional[str] = None, db: Session = Depends(get_db)):
    return await fetch_data_gov_agmarknet(db, state=state, commodity=commodity)


@router.post("/market-data/upload-csv")
async def upload_agmarknet_csv(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if not (file.filename or "").lower().endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are accepted.")
    content = await file.read()
    try:
        return ingest_agmarknet_csv(db, content, source_label="CSV_GOV_EXPORT", is_demo=False)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))


@router.post("/models/train-price")
def trigger_price_training(exclude_demo: bool = True, db: Session = Depends(get_db)):
    return train_and_evaluate_price_models(db, exclude_demo=exclude_demo)
