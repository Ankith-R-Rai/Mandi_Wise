package com.mandiwise.market.dto;

import com.mandiwise.market.entity.Market;
import java.math.BigDecimal;
import java.util.UUID;

public class MarketResponse {
    private UUID id;
    private String name;
    private String normalizedName;
    private String district;
    private String state;
    private String stateCode;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private String address;
    private boolean active;

    public MarketResponse() {}

    public static MarketResponse fromEntity(Market entity) {
        MarketResponse dto = new MarketResponse();
        dto.id = entity.getId();
        dto.name = entity.getName();
        dto.normalizedName = entity.getNormalizedName();
        dto.district = entity.getDistrict();
        dto.state = entity.getState();
        dto.stateCode = entity.getStateCode();
        dto.latitude = entity.getLatitude();
        dto.longitude = entity.getLongitude();
        dto.address = entity.getAddress();
        dto.active = entity.isActive();
        return dto;
    }

    public UUID getId() { return id; }
    public String getName() { return name; }
    public String getNormalizedName() { return normalizedName; }
    public String getDistrict() { return district; }
    public String getState() { return state; }
    public String getStateCode() { return stateCode; }
    public BigDecimal getLatitude() { return latitude; }
    public BigDecimal getLongitude() { return longitude; }
    public String getAddress() { return address; }
    public boolean isActive() { return active; }
}
