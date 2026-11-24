from typing import Dict, Any, List
from backend.config import VEGETABLE_REGISTRY


def compute_estimated_visual_grade(
    vegetable_name: str,
    cv_metrics: Dict[str, Any],
    defects: List[Dict[str, Any]],
    quality_model_label: str | None = None,
    quality_model_conf: float | None = None,
) -> Dict[str, Any]:
    """
    Assigns Grade A / Grade B / Grade C clearly labeled as an ESTIMATED VISUAL GRADE
    aligned with DMI AGMARK inspection criteria unless verified grade-labeled weights exist.
    Never equates binary fresh/rotten labels directly to official statutory AGMARK certification.
    """
    defect_ratio = cv_metrics["surface_defect_ratio"]
    decay_score = cv_metrics["decay_indicator_score"]
    wrinkle_score = cv_metrics["wrinkle_texture_score"]
    color_uni = cv_metrics["color_uniformity_score"]

    # Penalty scoring from visible characteristics
    penalty = (defect_ratio * 4.5) + (decay_score * 0.55) + (max(0.0, wrinkle_score - 0.35) * 0.4)
    if quality_model_label and quality_model_label.lower() in {"damaged", "rotten", "defective", "dried"}:
        penalty += 0.45

    if penalty < 0.18 and color_uni >= 0.45 and len(defects) <= 1:
        grade = "Grade A"
        freshness = quality_model_label or "Visually Fresh"
        summary = "High visual quality: uniform surface colour with minimal blemishes or shrivelling."
    elif penalty < 0.42 and decay_score < 0.45:
        grade = "Grade B"
        freshness = quality_model_label or "Moderate / Commercial Quality"
        summary = "Medium visual quality: minor surface spots, mild wrinkling, or uneven maturity detected."
    else:
        grade = "Grade C"
        freshness = quality_model_label or "Low Quality / Visible Defect or Decay"
        summary = "Low visual quality: noticeable discoloration, surface lesions, shrivelling, or decay indicators."

    crop_note = VEGETABLE_REGISTRY.get(vegetable_name, {}).get(
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
