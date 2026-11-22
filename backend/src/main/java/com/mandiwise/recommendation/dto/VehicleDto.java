package com.mandiwise.recommendation.dto;

import com.mandiwise.recommendation.model.VehicleType;

import java.math.BigDecimal;

public class VehicleDto {

    private VehicleType type;
    private String name;
    private BigDecimal maxCapacityKg;
    private BigDecimal defaultCostPerKm;
    private BigDecimal baseMinimumCharge;

    public VehicleDto() {}

    public VehicleDto(VehicleType type) {
        this.type = type;
        this.name = type.getDisplayName();
        this.maxCapacityKg = type.getMaxCapacityKg();
        this.defaultCostPerKm = type.getDefaultCostPerKm();
        this.baseMinimumCharge = type.getBaseMinimumCharge();
    }

    public VehicleType getType() {
        return type;
    }

    public void setType(VehicleType type) {
        this.type = type;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public BigDecimal getMaxCapacityKg() {
        return maxCapacityKg;
    }

    public void setMaxCapacityKg(BigDecimal maxCapacityKg) {
        this.maxCapacityKg = maxCapacityKg;
    }

    public BigDecimal getDefaultCostPerKm() {
        return defaultCostPerKm;
    }

    public void setDefaultCostPerKm(BigDecimal defaultCostPerKm) {
        this.defaultCostPerKm = defaultCostPerKm;
    }

    public BigDecimal getBaseMinimumCharge() {
        return baseMinimumCharge;
    }

    public void setBaseMinimumCharge(BigDecimal baseMinimumCharge) {
        this.baseMinimumCharge = baseMinimumCharge;
    }
}
