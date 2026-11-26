from typing import Dict, Any, List

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
    "Onion": {
        "agmarknet_aliases": ["Onion", "Onion Green"],
        "dominant_hue_ranges": [(155, 180), (0, 22)],
        "agmark_visual_note": "AGMARK Onion rules assess dry outer scales, closed neck, and absence of black mold or sprouting.",
    },
    "Brinjal": {
        "agmarknet_aliases": ["Brinjal"],
        "dominant_hue_ranges": [(125, 165), (35, 85)],  # Purple & green cultivars
        "agmark_visual_note": "AGMARK Aubergine/Brinjal rules assess glossy skin, intact calyx, and absence of borer holes or bruising.",
    },
    "Green Chilli": {
        "agmarknet_aliases": ["Green Chilli", "Chili Red"],
        "dominant_hue_ranges": [(35, 85)],
        "agmark_visual_note": "AGMARK Chillies rules assess firm glossy pods, intact pedicel, and absence of wilting or anthracnose spots.",
    },
}

SUPPORTED_VEGETABLES = list(VEGETABLE_REGISTRY.keys())
CLASS_LABELS = SUPPORTED_VEGETABLES + ["Unknown/Unsupported"]


def compute_estimated_visual_grade(
    vegetable_name: str,
    cv_metrics: Dict[str, Any],
    defects: List[Dict[str, Any]],
    quality_model_label: str | None = None,
    quality_model_conf: float | None = None,
) -> Dict[str, Any]:
    """
    Assigns Grade A / Grade B / Grade C clearly labeled as an ESTIMATED VISUAL GRADE
    aligned with DMI AGMARK inspection criteria.
    Never equates binary fresh/rotten labels directly to official statutory AGMARK certification.
    """
    defect_ratio = cv_metrics.get("surface_defect_ratio", 0.0)
    decay_score = cv_metrics.get("decay_indicator_score", 0.0)
    wrinkle_score = cv_metrics.get("wrinkle_texture_score", 0.0)
    color_uni = cv_metrics.get("color_uniformity_score", 0.5)

    # Penalty scoring from visible characteristics
    penalty = (defect_ratio * 4.5) + (decay_score * 0.55) + (max(0.0, wrinkle_score - 0.35) * 0.4)
    if quality_model_label and quality_model_label.lower() in {"damaged", "rotten", "defective", "decayed", "cull"}:
        penalty += 0.45

    if penalty < 0.18 and color_uni >= 0.45 and len(defects) <= 1:
        grade = "Grade A"
        freshness = quality_model_label or "Visually Fresh (Premium)"
        summary = "High visual quality: uniform surface colour with minimal blemishes or shrivelling."
    elif penalty < 0.42 and decay_score < 0.45:
        grade = "Grade B"
        freshness = quality_model_label or "Moderate / Commercial Quality"
        summary = "Medium visual quality: minor surface spots, mild wrinkling, or uneven maturity detected."
    else:
        grade = "Grade C"
        freshness = quality_model_label or "Low Quality / Visible Defect or Decay"
        summary = "Low visual quality: noticeable discoloration, surface lesions, shrivelling, or decay indicators."

    crop_meta = VEGETABLE_REGISTRY.get(vegetable_name, {})
    crop_note = crop_meta.get(
        "agmark_visual_note",
        "Visual assessment based on colour uniformity, surface defects, firmness cues, and decay indicators."
    )

    basis = "VERIFIED_MODEL_GRADE" if quality_model_label and quality_model_conf else "ESTIMATED_VISUAL_GRADE"
    disclaimer = (
        "Estimated visual grade from surface image features. Official AGMARK grades (Extra / Class I / Class II) "
        "under the Agricultural Produce (Grading and Marking) Act require physical inspection of size, weight, "
        "moisture, and internal defects."
    )

    return {
        "grade": grade,
        "grade_basis": basis,
        "freshness_classification": freshness,
        "maturity_stage": "Ripe / Market-Ready" if color_uni > 0.5 else "Mixed / Needs Inspection",
        "confidence": quality_model_conf,
        "explanation": f"{summary} {crop_note}",
        "agmark_disclaimer": disclaimer,
    }
