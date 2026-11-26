export interface IdentificationData {
  predicted_vegetable: string;
  is_supported: boolean;
  confidence?: number;
  model_version: string;
  model_status: string;
}

export interface QualityDetails {
  freshness_classification: string;
  maturity_stage: string;
  cv_metrics: {
    color_uniformity?: number;
    blemish_ratio?: number;
    wrinkling_energy?: number;
    decay_indicator?: number;
    shape_regularity?: number;
    sharpness?: number;
    dominant_hue?: number;
    mean_saturation?: number;
    mean_lightness?: number;
    estimated_firmness?: number;
    [key: string]: any;
  };
  model_status: string;
}

export interface DefectItem {
  defect_type: string;
  severity: 'minor' | 'moderate' | 'severe' | string;
  confidence?: number;
  bbox_xyxy: number[];
  detector_source: string;
}

export interface GradingReport {
  grade: 'Grade A' | 'Grade B' | 'Grade C' | string;
  grade_basis: string;
  confidence?: number;
  explanation: string;
  agmark_disclaimer: string;
}

export interface QualityAnalysisResponse {
  identification: IdentificationData;
  quality: QualityDetails;
  defects: DefectItem[];
  grading: GradingReport;
}

export interface SupportedCrop {
  name: string;
  agmarknet_aliases: string[];
  agmark_visual_note: string;
}

export interface SupportedCropsResponse {
  supported_vegetables: SupportedCrop[];
  count: number;
}

export interface VisionServiceStatus {
  status: string;
  service?: string;
  error?: string;
  [key: string]: any;
}
