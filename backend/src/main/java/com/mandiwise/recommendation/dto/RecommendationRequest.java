package com.mandiwise.recommendation.dto;

import com.mandiwise.recommendation.model.VehicleType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public class RecommendationRequest {

    private String commodityId;

    private String commodityName;

    @NotNull(message = "Produce quantity is required")
    @DecimalMin(value = "1.0", message = "Quantity must be at least 1.0 kg")
    private BigDecimal quantityKg;

    @NotBlank(message = "Origin location/district is required")
    private String originDistrict;

    private VehicleType vehicleType;

    @DecimalMin(value = "0.0", message = "Custom cost per km must be positive")
    private BigDecimal customCostPerKm;

    private String grade;

    public RecommendationRequest() {}

    public RecommendationRequest(String commodityName, BigDecimal quantityKg, String originDistrict) {
        this.commodityName = commodityName;
        this.quantityKg = quantityKg;
        this.originDistrict = originDistrict;
    }

    public String getCommodityId() {
        return commodityId;
    }

    public void setCommodityId(String commodityId) {
        this.commodityId = commodityId;
    }

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

    public BigDecimal getCustomCostPerKm() {
        return customCostPerKm;
    }

    public void setCustomCostPerKm(BigDecimal customCostPerKm) {
        this.customCostPerKm = customCostPerKm;
    }

    public String getGrade() {
        return grade;
    }

    public void setGrade(String grade) {
        this.grade = grade;
    }
}
