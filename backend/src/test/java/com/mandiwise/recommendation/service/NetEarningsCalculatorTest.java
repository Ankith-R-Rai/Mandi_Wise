package com.mandiwise.recommendation.service;

import com.mandiwise.recommendation.dto.CalculationBreakdown;
import com.mandiwise.recommendation.model.VehicleType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;

class NetEarningsCalculatorTest {

    private NetEarningsCalculator calculator;

    @BeforeEach
    void setUp() {
        calculator = new NetEarningsCalculator();
    }

    @Test
    @DisplayName("Calculates net earnings correctly for 1,000 kg tomato produce")
    void testNetEarningsCalculation() {
        // 1,000 kg = 10 quintals
        BigDecimal qty = BigDecimal.valueOf(1000);
        BigDecimal modalPrice = BigDecimal.valueOf(2200); // 2,200 Rs/quintal
        BigDecimal roadDistance = BigDecimal.valueOf(60.0); // 60 km
        VehicleType vehicle = VehicleType.MINI_TRUCK; // 18 Rs/km, min 400

        CalculationBreakdown result = calculator.calculate(qty, modalPrice, roadDistance, vehicle, null, true);

        // Gross: 10 quintals * 2200 = 22,000 Rs
        assertThat(result.getGrossRevenue()).isEqualByComparingTo(BigDecimal.valueOf(22000.00));
        // Transport: 60 km * 18 = 1,080 Rs (> min 400)
        assertThat(result.getTransportCost()).isEqualByComparingTo(BigDecimal.valueOf(1080.00));
        // Cess: 1.5% of 22,000 = 330 Rs
        assertThat(result.getMandiCess()).isEqualByComparingTo(BigDecimal.valueOf(330.00));
        // Handling: 10 quintals * 15 = 150 Rs
        assertThat(result.getHandlingCharge()).isEqualByComparingTo(BigDecimal.valueOf(150.00));
        // Spoilage: distance <= 100km, so 0 Rs
        assertThat(result.getSpoilageAllowance()).isEqualByComparingTo(BigDecimal.valueOf(0.00));
        // Total Deductions: 1080 + 330 + 150 = 1560 Rs
        assertThat(result.getTotalDeductions()).isEqualByComparingTo(BigDecimal.valueOf(1560.00));
        // Net: 22000 - 1560 = 20,440 Rs
        assertThat(result.getNetEarnings()).isEqualByComparingTo(BigDecimal.valueOf(20440.00));
    }

    @Test
    @DisplayName("Applies spoilage deduction for perishable produce over 100 km transit")
    void testSpoilageDeductionLongDistance() {
        BigDecimal qty = BigDecimal.valueOf(2000); // 20 quintals
        BigDecimal modalPrice = BigDecimal.valueOf(2500); // Gross = 50,000
        BigDecimal roadDistance = BigDecimal.valueOf(150.0); // 150 km > 100 km
        VehicleType vehicle = VehicleType.MEDIUM_TRUCK;

        CalculationBreakdown result = calculator.calculate(qty, modalPrice, roadDistance, vehicle, null, true);

        // 1.5% of 50,000 = 750 Rs spoilage
        assertThat(result.getSpoilageAllowance()).isEqualByComparingTo(BigDecimal.valueOf(750.00));
    }

    @Test
    @DisplayName("Applies base minimum charge if distance times rate is below minimum")
    void testBaseMinimumCharge() {
        BigDecimal qty = BigDecimal.valueOf(500);
        BigDecimal modalPrice = BigDecimal.valueOf(2000);
        BigDecimal roadDistance = BigDecimal.valueOf(5.0); // 5km * 18 = 90 Rs < 400 min
        VehicleType vehicle = VehicleType.MINI_TRUCK;

        CalculationBreakdown result = calculator.calculate(qty, modalPrice, roadDistance, vehicle, null, false);

        assertThat(result.getTransportCost()).isEqualByComparingTo(BigDecimal.valueOf(400.00));
    }
}
