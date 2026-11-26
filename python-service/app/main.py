from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timezone

from app.api.data_routes import router as data_router
from app.api.vision_routes import router as vision_router

app = FastAPI(
    title="MandiWise Python Processing Service",
    description="Dedicated microservice for agricultural data cleaning, preprocessing, and Tomato quality assessment.",
    version="0.1.0",
)

# CORS Middleware allowing communication from Spring Boot / Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(data_router)
app.include_router(vision_router)

@app.get("/", tags=["Root"])
def root():
    return {
        "service": "mandiwise-python-service",
        "status": "UP",
        "docs": "/docs",
        "health": "/health",
        "vision_endpoints": {
            "status": "/api/status",
            "crops": "/api/crops",
            "analyze": "/api/analyze"
        }
    }


@app.get("/health", tags=["Health"])
def health_check():
    return {
        "application": "mandiwise-python-service",
        "status": "UP",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "version": "0.1.0",
        "phase": "Phase 1 - Environment & Supabase Setup",
        "capabilities": [
            "data_cleaning",
            "market_preprocessing",
            "tomato_cv_quality_assessment"
        ]
    }
