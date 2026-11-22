package com.mandiwise.recommendation.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;

class DistanceCalculatorTest {

    private DistanceCalculator calculator;

    @BeforeEach
    void setUp() {
        calculator = new DistanceCalculator();
    }

    @Test
    @DisplayName("Calculates Haversine straight line distance between Bengaluru and Kolar accurately")
    void testStraightLineDistance() {
        // Bengaluru Urban (12.9716, 77.5946) to Kolar (13.1367, 78.1291)
        double distance = calculator.calculateStraightLineDistanceKm(12.9716, 77.5946, 13.1367, 78.1291);
        // Approx 60 - 65 km straight line
        assertThat(distance).isBetween(58.0, 65.0);
    }

    @Test
    @DisplayName("Estimates road distance applying 1.25x tortuosity factor")
    void testEstimatedRoadDistance() {
        BigDecimal originLat = BigDecimal.valueOf(12.9716);
        BigDecimal originLon = BigDecimal.valueOf(77.5946);
        BigDecimal destLat = BigDecimal.valueOf(13.1367);
        BigDecimal destLon = BigDecimal.valueOf(78.1291);

        BigDecimal roadDistance = calculator.calculateEstimatedRoadDistanceKm(originLat, originLon, destLat, destLon);
        // Straight line ~60km * 1.25 = ~75km
        assertThat(roadDistance.doubleValue()).isBetween(72.0, 82.0);
    }

    @Test
    @DisplayName("Enforces minimum local road distance of 5.0 km for co-located points")
    void testMinimumRoadDistance() {
        BigDecimal lat = BigDecimal.valueOf(13.0);
        BigDecimal lon = BigDecimal.valueOf(77.0);

        BigDecimal roadDistance = calculator.calculateEstimatedRoadDistanceKm(lat, lon, lat, lon);
        assertThat(roadDistance.doubleValue()).isEqualTo(5.0);
    }
}
