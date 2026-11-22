package com.mandiwise.recommendation.model;

import java.math.BigDecimal;
import java.util.*;

public class DistrictLocation {

    private final String districtName;
    private final BigDecimal latitude;
    private final BigDecimal longitude;

    public DistrictLocation(String districtName, double latitude, double longitude) {
        this.districtName = districtName;
        this.latitude = BigDecimal.valueOf(latitude);
        this.longitude = BigDecimal.valueOf(longitude);
    }

    public String getDistrictName() {
        return districtName;
    }

    public BigDecimal getLatitude() {
        return latitude;
    }

    public BigDecimal getLongitude() {
        return longitude;
    }

    private static final Map<String, DistrictLocation> KARNATAKA_DISTRICTS = new LinkedHashMap<>();

    static {
        register("Bagalkot", 16.1875, 75.6983);
        register("Ballari", 15.1394, 76.9214);
        register("Belagavi", 15.8497, 74.4977);
        register("Bengaluru Rural", 13.2323, 77.5644);
        register("Bengaluru Urban", 12.9716, 77.5946);
        register("Bidar", 17.9104, 77.5199);
        register("Chamarajanagar", 11.9261, 76.9437);
        register("Chikkaballapura", 13.4325, 77.7275);
        register("Chikkamagaluru", 13.3161, 75.7720);
        register("Chitradurga", 14.2251, 76.3980);
        register("Dakshina Kannada", 12.8703, 74.8806);
        register("Davanagere", 14.4644, 75.9218);
        register("Dharwad", 15.4589, 75.0078);
        register("Gadag", 15.4313, 75.6358);
        register("Hassan", 13.0072, 76.1030);
        register("Haveri", 14.7958, 75.4011);
        register("Kalaburagi", 17.3297, 76.8343);
        register("Kodagu", 12.4244, 75.7382);
        register("Kolar", 13.1367, 78.1291);
        register("Koppal", 15.3486, 76.1554);
        register("Mandya", 12.5218, 76.8951);
        register("Mysuru", 12.2958, 76.6394);
        register("Raichur", 16.2076, 77.3463);
        register("Ramanagara", 12.7159, 77.2814);
        register("Shivamogga", 13.9299, 75.5681);
        register("Tumakuru", 13.3409, 77.1010);
        register("Udupi", 13.3409, 74.7421);
        register("Uttara Kannada", 14.8185, 74.1306);
        register("Vijayapura", 16.8302, 75.7100);
        register("Yadgir", 16.7702, 77.1376);
        register("Vijayanagara", 15.2750, 76.3880);
    }

    private static void register(String name, double lat, double lon) {
        KARNATAKA_DISTRICTS.put(name.toLowerCase(), new DistrictLocation(name, lat, lon));
    }

    public static Optional<DistrictLocation> findByName(String name) {
        if (name == null || name.isBlank()) {
            return Optional.empty();
        }
        String normalized = name.toLowerCase().trim();
        DistrictLocation match = KARNATAKA_DISTRICTS.get(normalized);
        if (match != null) {
            return Optional.of(match);
        }
        for (Map.Entry<String, DistrictLocation> entry : KARNATAKA_DISTRICTS.entrySet()) {
            if (normalized.contains(entry.getKey()) || entry.getKey().contains(normalized)) {
                return Optional.of(entry.getValue());
            }
        }
        return Optional.empty();
    }

    public static List<DistrictLocation> getAllDistricts() {
        return new ArrayList<>(KARNATAKA_DISTRICTS.values());
    }
}
