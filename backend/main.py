import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from backend.config import settings
from backend.routers import analysis, market, datasets, models_eval
from database.session import Base, engine

Base.metadata.create_all(bind=engine)
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
os.makedirs(settings.DATASET_DIR, exist_ok=True)
os.makedirs(settings.MODEL_ARTIFACTS_DIR, exist_ok=True)

app = FastAPI(
    title="AgriVision AI API",
    description="Multi-Vegetable Quality Grading & Market Price Prediction (MandiWise-ready)",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analysis.router)
app.include_router(market.router)
app.include_router(datasets.router)
app.include_router(models_eval.router)

app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

# Serve built React frontend in production (Replit / Docker single-origin deployment)
FRONTEND_DIST = os.path.join(os.path.dirname(__file__), "..", "frontend", "dist")
if os.path.isdir(FRONTEND_DIST):
    app.mount("/assets", StaticFiles(directory=os.path.join(FRONTEND_DIST, "assets")), name="assets")

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        if full_path.startswith("api/"):
            return {"detail": "Not found"}
        index_file = os.path.join(FRONTEND_DIST, "index.html")
        return FileResponse(index_file)
