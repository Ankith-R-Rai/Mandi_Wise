package com.mandiwise.recommendation.service;

import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Component
public class DistanceCalculator {

    private static final double EARTH_RADIUS_KM = 6371.0;
    public static final double ROAD_TORTUOSITY_FACTOR = 1.25;
    public static final double MINIMUM_LOCAL_ROAD_KM = 5.0;

    /**
     * Calculates the great-circle distance between two points on the earth surface (in kilometers)
     * using the Haversine formula.
     */
    public double calculateStraightLineDistanceKm(double lat1, double lon1, double lat2, double lon2) {
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);

        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon / 2) * Math.sin(dLon / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return EARTH_RADIUS_KM * c;
    }

    /**
     * Estimates practical road distance applying the Karnataka highway tortuosity factor (1.25x).
     */
    public BigDecimal calculateEstimatedRoadDistanceKm(BigDecimal originLat, BigDecimal originLon, BigDecimal destLat, BigDecimal destLon) {
        if (originLat == null || originLon == null || destLat == null || destLon == null) {
            return BigDecimal.valueOf(MINIMUM_LOCAL_ROAD_KM).setScale(1, RoundingMode.HALF_UP);
        }

        double straightLine = calculateStraightLineDistanceKm(
                originLat.doubleValue(),
                originLon.doubleValue(),
                destLat.doubleValue(),
                destLon.doubleValue()
        );

        double roadDistance = straightLine * ROAD_TORTUOSITY_FACTOR;
        if (roadDistance < MINIMUM_LOCAL_ROAD_KM) {
            roadDistance = MINIMUM_LOCAL_ROAD_KM;
        }

        return BigDecimal.valueOf(roadDistance).setScale(1, RoundingMode.HALF_UP);
    }
}
