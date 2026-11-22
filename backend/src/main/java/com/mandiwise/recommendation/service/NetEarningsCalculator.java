package com.mandiwise.recommendation.service;

import com.mandiwise.recommendation.dto.CalculationBreakdown;
import com.mandiwise.recommendation.model.VehicleType;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Component
public class NetEarningsCalculator {

    public static final BigDecimal CESS_PERCENTAGE = BigDecimal.valueOf(0.015); // 1.5% APMC market cess
    public static final BigDecimal HANDLING_PER_QUINTAL = BigDecimal.valueOf(15.00); // Rs. 15 per quintal
    public static final BigDecimal SPOILAGE_PERCENTAGE = BigDecimal.valueOf(0.015); // 1.5% for perishables over 100km
    public static final BigDecimal LONG_DISTANCE_KM_THRESHOLD = BigDecimal.valueOf(100.0);

    public CalculationBreakdown calculate(
            BigDecimal quantityKg,
            BigDecimal modalPricePerQuintal,
            BigDecimal roadDistanceKm,
            VehicleType vehicleType,
            BigDecimal customCostPerKm,
            boolean isPerishable
    ) {
        if (quantityKg == null || quantityKg.compareTo(BigDecimal.ZERO) <= 0) {
            quantityKg = BigDecimal.ZERO;
        }
        if (modalPricePerQuintal == null || modalPricePerQuintal.compareTo(BigDecimal.ZERO) <= 0) {
            modalPricePerQuintal = BigDecimal.ZERO;
        }
        if (roadDistanceKm == null || roadDistanceKm.compareTo(BigDecimal.ZERO) <= 0) {
            roadDistanceKm = BigDecimal.ZERO;
        }
        if (vehicleType == null) {
            vehicleType = VehicleType.recommendForWeight(quantityKg);
        }

        // 1. Quantity conversion: 100 kg = 1 Quintal
        BigDecimal quantityQuintals = quantityKg.divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP);

        // 2. Gross revenue = quantityQuintals * modalPricePerQuintal
        BigDecimal grossRevenue = quantityQuintals.multiply(modalPricePerQuintal).setScale(2, RoundingMode.HALF_UP);

        // 3. Transportation cost
        BigDecimal costPerKm = (customCostPerKm != null && customCostPerKm.compareTo(BigDecimal.ZERO) > 0)
                ? customCostPerKm
                : vehicleType.getDefaultCostPerKm();

        BigDecimal rawTransport = roadDistanceKm.multiply(costPerKm).setScale(2, RoundingMode.HALF_UP);
        BigDecimal transportCost = rawTransport.max(vehicleType.getBaseMinimumCharge()).setScale(2, RoundingMode.HALF_UP);

        // 4. APMC Market Cess = 1.5% of Gross Revenue
        BigDecimal mandiCess = grossRevenue.multiply(CESS_PERCENTAGE).setScale(2, RoundingMode.HALF_UP);

        // 5. Handling & Loading/Unloading = Rs. 15 per quintal
        BigDecimal handlingCharge = quantityQuintals.multiply(HANDLING_PER_QUINTAL).setScale(2, RoundingMode.HALF_UP);

        // 6. Spoilage allowance: if perishable and road distance > 100 km, deduct 1.5%
        BigDecimal spoilageAllowance = BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);
        if (isPerishable && roadDistanceKm.compareTo(LONG_DISTANCE_KM_THRESHOLD) > 0) {
            spoilageAllowance = grossRevenue.multiply(SPOILAGE_PERCENTAGE).setScale(2, RoundingMode.HALF_UP);
        }

        // 7. Total Deductions
        BigDecimal totalDeductions = transportCost
                .add(mandiCess)
                .add(handlingCharge)
                .add(spoilageAllowance)
                .setScale(2, RoundingMode.HALF_UP);

        // 8. Net Take-Home Earnings
        BigDecimal netEarnings = grossRevenue.subtract(totalDeductions).setScale(2, RoundingMode.HALF_UP);

        // 9. Margin & Net Rate per kg
        BigDecimal profitMarginPercent = BigDecimal.ZERO;
        if (grossRevenue.compareTo(BigDecimal.ZERO) > 0) {
            profitMarginPercent = netEarnings.divide(grossRevenue, 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100))
                    .setScale(1, RoundingMode.HALF_UP);
        }

        BigDecimal netRatePerKg = BigDecimal.ZERO;
        if (quantityKg.compareTo(BigDecimal.ZERO) > 0) {
            netRatePerKg = netEarnings.divide(quantityKg, 2, RoundingMode.HALF_UP);
        }

        CalculationBreakdown breakdown = new CalculationBreakdown();
        breakdown.setQuantityKg(quantityKg);
        breakdown.setQuantityQuintals(quantityQuintals);
        breakdown.setModalPricePerQuintal(modalPricePerQuintal);
        breakdown.setGrossRevenue(grossRevenue);
        breakdown.setRoadDistanceKm(roadDistanceKm);
        breakdown.setCostPerKm(costPerKm);
        breakdown.setTransportCost(transportCost);
        breakdown.setMandiCess(mandiCess);
        breakdown.setHandlingCharge(handlingCharge);
        breakdown.setSpoilageAllowance(spoilageAllowance);
        breakdown.setTotalDeductions(totalDeductions);
        breakdown.setNetEarnings(netEarnings);
        breakdown.setProfitMarginPercent(profitMarginPercent);
        breakdown.setNetRatePerKg(netRatePerKg);

        return breakdown;
    }
}
