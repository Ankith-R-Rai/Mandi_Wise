import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./data/agrivision.db")
    DATA_GOV_IN_API_KEY: str = os.getenv("DATA_GOV_IN_API_KEY", "")
    DATA_GOV_DAILY_RESOURCE_ID: str = os.getenv("DATA_GOV_DAILY_RESOURCE_ID", "9ef84268-d588-465a-a308-a864a43d0070")
    DATA_GOV_HIST_RESOURCE_ID: str = os.getenv("DATA_GOV_HIST_RESOURCE_ID", "35985678-0d79-46b4-9ed6-6f13308a1d24")
    UPLOAD_DIR: str = os.getenv("UPLOAD_DIR", "./data/uploads")
    DATASET_DIR: str = os.getenv("DATASET_DIR", "./data/datasets")
    MODEL_ARTIFACTS_DIR: str = os.getenv("MODEL_ARTIFACTS_DIR", "./models/artifacts")
    ADMIN_API_TOKEN: str = os.getenv("ADMIN_API_TOKEN", "change-this-secure-admin-token")
    MAX_IMAGE_SIZE_MB: int = int(os.getenv("MAX_IMAGE_SIZE_MB", "10"))

settings = Settings()

# Extensible registry: add new vegetables here without changing API/UI logic
VEGETABLE_REGISTRY = {
    "Tomato": {
        "agmarknet_aliases": ["Tomato"],
        "dominant_hue_ranges": [(0, 14), (165, 180), (15, 32)],  # Red/ripe & breaker/green
        "agmark_visual_note": "AGMARK Tomato rules assess firmness, freedom from sunscald, cracks, decay, and uniform maturity.",
    },
    "Potato": {
        "agmarknet_aliases": ["Potato"],
        "dominant_hue_ranges": [(12, 32)],
        "agmark_visual_note": "AGMARK Ware Potato rules check tuber firmness, absence of greening, cuts, rot, and sprout damage.",
    },
    "Brinjal": {
        "agmarknet_aliases": ["Brinjal"],
        "dominant_hue_ranges": [(125, 165), (35, 85)],  # Purple & green cultivars
        "agmark_visual_note": "AGMARK Aubergine/Brinjal rules assess glossy skin, intact calyx, and absence of borer holes or bruising.",
    },
    "Capsicum": {
        "agmarknet_aliases": ["Capsicum", "Chilly Capsicum"],
        "dominant_hue_ranges": [(35, 85), (0, 15), (15, 32)],
        "agmark_visual_note": "AGMARK Capsicum rules check wall firmness, uniform color, and freedom from blossom-end rot or sunburn.",
    },
    "Onion": {
        "agmarknet_aliases": ["Onion", "Onion Green"],
        "dominant_hue_ranges": [(155, 180), (0, 22)],
        "agmark_visual_note": "AGMARK Onion rules assess dry outer scales, closed neck, and absence of black mold or sprouting.",
    },
    "Cucumber": {
        "agmarknet_aliases": ["Cucumbar(Kheera)", "Cucumber"],
        "dominant_hue_ranges": [(35, 85)],
        "agmark_visual_note": "AGMARK Cucumber rules assess straightness, crisp green skin, and absence of yellowing/shriveling.",
    },
    "Ladies' Finger": {
        "agmarknet_aliases": ["Bhindi(Ladies Finger)", "Ladies Finger", "Okra"],
        "dominant_hue_ranges": [(35, 85)],
        "agmark_visual_note": "AGMARK Okra rules check pod tenderness, bright green color, and absence of fibrous browning or insect punctures.",
    },
    "Bitter Gourd": {
        "agmarknet_aliases": ["Bitter gourd", "Bitter Gourd"],
        "dominant_hue_ranges": [(35, 85)],
        "agmark_visual_note": "AGMARK Bitter Gourd rules assess firm ridges, green color, and absence of orange over-ripening or rot.",
    },
    "Green Chilli": {
        "agmarknet_aliases": ["Green Chilli", "Chili Red"],
        "dominant_hue_ranges": [(35, 85)],
        "agmark_visual_note": "AGMARK Chillies rules assess firm glossy pods, intact pedicel, and absence of wilting or anthracnose spots.",
    },
    "Pointed Gourd": {
        "agmarknet_aliases": ["Pointed gourd(Parval)", "Pointed gourd (Parval)", "Pointed gourd"],
        "dominant_hue_ranges": [(35, 85)],
        "agmark_visual_note": "AGMARK Pointed Gourd rules assess uniform green stripes, tender skin, and absence of yellowing or decay.",
    },
}

SUPPORTED_VEGETABLES = list(VEGETABLE_REGISTRY.keys())
CLASS_LABELS = SUPPORTED_VEGETABLES + ["Unknown/Unsupported"]
