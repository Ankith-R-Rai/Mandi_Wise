package com.mandiwise.recommendation.model;

import java.math.BigDecimal;

public enum VehicleType {
    MINI_TRUCK(
            "Mini Commercial Vehicle (Up to 1.5 MT)",
            BigDecimal.valueOf(1500),
            BigDecimal.valueOf(18.0),
            BigDecimal.valueOf(400.0)
    ),
    MEDIUM_TRUCK(
            "Medium Commercial Vehicle (Up to 4.5 MT)",
            BigDecimal.valueOf(4500),
            BigDecimal.valueOf(28.0),
            BigDecimal.valueOf(800.0)
    ),
    HEAVY_TRUCK(
            "Heavy Commercial Truck (Over 4.5 MT)",
            BigDecimal.valueOf(15000),
            BigDecimal.valueOf(40.0),
            BigDecimal.valueOf(1500.0)
    );

    private final String displayName;
    private final BigDecimal maxCapacityKg;
    private final BigDecimal defaultCostPerKm;
    private final BigDecimal baseMinimumCharge;

    VehicleType(String displayName, BigDecimal maxCapacityKg, BigDecimal defaultCostPerKm, BigDecimal baseMinimumCharge) {
        this.displayName = displayName;
        this.maxCapacityKg = maxCapacityKg;
        this.defaultCostPerKm = defaultCostPerKm;
        this.baseMinimumCharge = baseMinimumCharge;
    }

    public String getDisplayName() {
        return displayName;
    }

    public BigDecimal getMaxCapacityKg() {
        return maxCapacityKg;
    }

    public BigDecimal getDefaultCostPerKm() {
        return defaultCostPerKm;
    }

    public BigDecimal getBaseMinimumCharge() {
        return baseMinimumCharge;
    }

    public static VehicleType recommendForWeight(BigDecimal weightKg) {
        if (weightKg == null || weightKg.compareTo(BigDecimal.valueOf(1500)) <= 0) {
            return MINI_TRUCK;
        } else if (weightKg.compareTo(BigDecimal.valueOf(4500)) <= 0) {
            return MEDIUM_TRUCK;
        } else {
            return HEAVY_TRUCK;
        }
    }
}
