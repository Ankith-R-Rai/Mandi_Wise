package com.mandiwise.quality.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@JsonIgnoreProperties(ignoreUnknown = true)
public class QualityAnalysisResponseDto {

    private IdentificationDto identification;
    private QualityDetailsDto quality;
    private List<DefectDto> defects = Collections.emptyList();
    private GradingDto grading;

    public QualityAnalysisResponseDto() {}

    public IdentificationDto getIdentification() {
        return identification;
    }

    public void setIdentification(IdentificationDto identification) {
        this.identification = identification;
    }

    public QualityDetailsDto getQuality() {
        return quality;
    }

    public void setQuality(QualityDetailsDto quality) {
        this.quality = quality;
    }

    public List<DefectDto> getDefects() {
        return defects;
    }

    public void setDefects(List<DefectDto> defects) {
        this.defects = defects != null ? defects : Collections.emptyList();
    }

    public GradingDto getGrading() {
        return grading;
    }

    public void setGrading(GradingDto grading) {
        this.grading = grading;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class IdentificationDto {
        @JsonProperty("predicted_vegetable")
        private String predictedVegetable;

        @JsonProperty("is_supported")
        private boolean isSupported;

        private Double confidence;

        @JsonProperty("model_version")
        private String modelVersion;

        @JsonProperty("model_status")
        private String modelStatus;

        public IdentificationDto() {}

        public String getPredictedVegetable() {
            return predictedVegetable;
        }

        public void setPredictedVegetable(String predictedVegetable) {
            this.predictedVegetable = predictedVegetable;
        }

        public boolean isSupported() {
            return isSupported;
        }

        public void setSupported(boolean supported) {
            isSupported = supported;
        }

        public Double getConfidence() {
            return confidence;
        }

        public void setConfidence(Double confidence) {
            this.confidence = confidence;
        }

        public String getModelVersion() {
            return modelVersion;
        }

        public void setModelVersion(String modelVersion) {
            this.modelVersion = modelVersion;
        }

        public String getModelStatus() {
            return modelStatus;
        }

        public void setModelStatus(String modelStatus) {
            this.modelStatus = modelStatus;
        }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class QualityDetailsDto {
        @JsonProperty("freshness_classification")
        private String freshnessClassification;

        @JsonProperty("maturity_stage")
        private String maturityStage;

        @JsonProperty("cv_metrics")
        private Map<String, Object> cvMetrics = Collections.emptyMap();

        @JsonProperty("model_status")
        private String modelStatus;

        public QualityDetailsDto() {}

        public String getFreshnessClassification() {
            return freshnessClassification;
        }

        public void setFreshnessClassification(String freshnessClassification) {
            this.freshnessClassification = freshnessClassification;
        }

        public String getMaturityStage() {
            return maturityStage;
        }

        public void setMaturityStage(String maturityStage) {
            this.maturityStage = maturityStage;
        }

        public Map<String, Object> getCvMetrics() {
            return cvMetrics;
        }

        public void setCvMetrics(Map<String, Object> cvMetrics) {
            this.cvMetrics = cvMetrics != null ? cvMetrics : Collections.emptyMap();
        }

        public String getModelStatus() {
            return modelStatus;
        }

        public void setModelStatus(String modelStatus) {
            this.modelStatus = modelStatus;
        }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class DefectDto {
        @JsonProperty("defect_type")
        private String defectType;

        private String severity;
        private Double confidence;

        @JsonProperty("bbox_xyxy")
        private List<Double> bboxXyxy = Collections.emptyList();

        @JsonProperty("detector_source")
        private String detectorSource;

        public DefectDto() {}

        public String getDefectType() {
            return defectType;
        }

        public void setDefectType(String defectType) {
            this.defectType = defectType;
        }

        public String getSeverity() {
            return severity;
        }

        public void setSeverity(String severity) {
            this.severity = severity;
        }

        public Double getConfidence() {
            return confidence;
        }

        public void setConfidence(Double confidence) {
            this.confidence = confidence;
        }

        public List<Double> getBboxXyxy() {
            return bboxXyxy;
        }

        public void setBboxXyxy(List<Double> bboxXyxy) {
            this.bboxXyxy = bboxXyxy != null ? bboxXyxy : Collections.emptyList();
        }

        public String getDetectorSource() {
            return detectorSource;
        }

        public void setDetectorSource(String detectorSource) {
            this.detectorSource = detectorSource;
        }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class GradingDto {
        private String grade;

        @JsonProperty("grade_basis")
        private String gradeBasis;

        private Double confidence;
        private String explanation;

        @JsonProperty("agmark_disclaimer")
        private String agmarkDisclaimer;

        public GradingDto() {}

        public String getGrade() {
            return grade;
        }

        public void setGrade(String grade) {
            this.grade = grade;
        }

        public String getGradeBasis() {
            return gradeBasis;
        }

        public void setGradeBasis(String gradeBasis) {
            this.gradeBasis = gradeBasis;
        }

        public Double getConfidence() {
            return confidence;
        }

        public void setConfidence(Double confidence) {
            this.confidence = confidence;
        }

        public String getExplanation() {
            return explanation;
        }

        public void setExplanation(String explanation) {
            this.explanation = explanation;
        }

        public String getAgmarkDisclaimer() {
            return agmarkDisclaimer;
        }

        public void setAgmarkDisclaimer(String agmarkDisclaimer) {
            this.agmarkDisclaimer = agmarkDisclaimer;
        }
    }
}
