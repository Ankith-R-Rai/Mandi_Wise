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
    @DisplayName("Calculates net earnings correctly for local mandi transit (<= 40 km)")
    void testLocalNetEarningsCalculation() {
        // 1,000 kg = 10 quintals, local 20 km trip
        BigDecimal qty = BigDecimal.valueOf(1000);
        BigDecimal modalPrice = BigDecimal.valueOf(2200); // 2,200 Rs/quintal
        BigDecimal roadDistance = BigDecimal.valueOf(20.0); // 20 km local
        VehicleType vehicle = VehicleType.MINI_TRUCK; // 18 Rs/km, min 400

        CalculationBreakdown result = calculator.calculate(qty, modalPrice, roadDistance, vehicle, null, true);

        // Gross: 10 quintals * 2200 = 22,000 Rs
        assertThat(result.getGrossRevenue()).isEqualByComparingTo(BigDecimal.valueOf(22000.00));
        // Transport: 20 km * 18 = 360 Rs < min 400 => 400 Rs
        assertThat(result.getTransportCost()).isEqualByComparingTo(BigDecimal.valueOf(400.00));
        // Cess: 1.5% of 22,000 = 330 Rs
        assertThat(result.getMandiCess()).isEqualByComparingTo(BigDecimal.valueOf(330.00));
        // Handling: 10 quintals * 15 = 150 Rs
        assertThat(result.getHandlingCharge()).isEqualByComparingTo(BigDecimal.valueOf(150.00));
        // Spoilage: distance <= 75km, so 0 Rs
        assertThat(result.getSpoilageAllowance()).isEqualByComparingTo(BigDecimal.valueOf(0.00));
        // Total Deductions: 400 + 330 + 150 = 880 Rs
        assertThat(result.getTotalDeductions()).isEqualByComparingTo(BigDecimal.valueOf(880.00));
        // Net: 22000 - 880 = 21,120 Rs
        assertThat(result.getNetEarnings()).isEqualByComparingTo(BigDecimal.valueOf(21120.00));
    }

    @Test
    @DisplayName("Applies dedicated return factor and toll charges for inter-district trips (> 40 km)")
    void testInterDistrictTransportWithTolls() {
        BigDecimal qty = BigDecimal.valueOf(1000);
        BigDecimal modalPrice = BigDecimal.valueOf(2500); // Gross = 25,000
        BigDecimal roadDistance = BigDecimal.valueOf(100.0); // 100 km > 40 km
        VehicleType vehicle = VehicleType.MINI_TRUCK; // 18 Rs/km

        CalculationBreakdown result = calculator.calculate(qty, modalPrice, roadDistance, vehicle, null, true);

        // Freight: 100km * 1.5 * 18 = 2,700 Rs
        // Tolls: 100km * 1.8 = 180 Rs
        // Total transport: 2,700 + 180 = 2,880 Rs
        assertThat(result.getTransportCost()).isEqualByComparingTo(BigDecimal.valueOf(2880.00));
        // Spoilage for 100km perishable: 1.5% of 25,000 = 375 Rs
        assertThat(result.getSpoilageAllowance()).isEqualByComparingTo(BigDecimal.valueOf(375.00));
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
