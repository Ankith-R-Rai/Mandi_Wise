package com.mandiwise.recommendation.dto;

import com.mandiwise.recommendation.model.VehicleType;

import java.math.BigDecimal;
import java.util.List;

public class RecommendationResponse {

    private String commodityName;
    private BigDecimal quantityKg;
    private BigDecimal quantityQuintals;
    private String originDistrict;
    private VehicleType vehicleType;
    private String vehicleDisplayName;
    private int totalCandidatesEvaluated;
    private MandiCandidateDto topRecommendation;
    private MandiCandidateDto nearestMarket;
    private List<MandiCandidateDto> candidateRankings;
    private String recommendationRationale;
    private String disclaimer = "Calculations are advisory estimates based on official AGMARKNET modal prices and estimated highway road distances. Actual APMC weighment, spot auction bids, and transporter charges may vary.";

    public RecommendationResponse() {}

    public String getCommodityName() {
        return commodityName;
    }

    public void setCommodityName(String commodityName) {
        this.commodityName = commodityName;
    }

    public BigDecimal getQuantityKg() {
        return quantityKg;
    }

    public void setQuantityKg(BigDecimal quantityKg) {
        this.quantityKg = quantityKg;
    }

    public BigDecimal getQuantityQuintals() {
        return quantityQuintals;
    }

    public void setQuantityQuintals(BigDecimal quantityQuintals) {
        this.quantityQuintals = quantityQuintals;
    }

    public String getOriginDistrict() {
        return originDistrict;
    }

    public void setOriginDistrict(String originDistrict) {
        this.originDistrict = originDistrict;
    }

    public VehicleType getVehicleType() {
        return vehicleType;
    }

    public void setVehicleType(VehicleType vehicleType) {
        this.vehicleType = vehicleType;
    }

    public String getVehicleDisplayName() {
        return vehicleDisplayName;
    }

    public void setVehicleDisplayName(String vehicleDisplayName) {
        this.vehicleDisplayName = vehicleDisplayName;
    }

    public int getTotalCandidatesEvaluated() {
        return totalCandidatesEvaluated;
    }

    public void setTotalCandidatesEvaluated(int totalCandidatesEvaluated) {
        this.totalCandidatesEvaluated = totalCandidatesEvaluated;
    }

    public MandiCandidateDto getTopRecommendation() {
        return topRecommendation;
    }

    public void setTopRecommendation(MandiCandidateDto topRecommendation) {
        this.topRecommendation = topRecommendation;
    }

    public MandiCandidateDto getNearestMarket() {
        return nearestMarket;
    }

    public void setNearestMarket(MandiCandidateDto nearestMarket) {
        this.nearestMarket = nearestMarket;
    }

    public List<MandiCandidateDto> getCandidateRankings() {
        return candidateRankings;
    }

    public void setCandidateRankings(List<MandiCandidateDto> candidateRankings) {
        this.candidateRankings = candidateRankings;
    }

    public String getRecommendationRationale() {
        return recommendationRationale;
    }

    public void setRecommendationRationale(String recommendationRationale) {
        this.recommendationRationale = recommendationRationale;
    }

    public String getDisclaimer() {
        return disclaimer;
    }

    public void setDisclaimer(String disclaimer) {
        this.disclaimer = disclaimer;
    }
}
