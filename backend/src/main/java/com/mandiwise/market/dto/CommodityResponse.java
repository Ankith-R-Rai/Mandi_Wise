package com.mandiwise.market.dto;

import com.mandiwise.market.entity.Commodity;
import java.util.UUID;

public class CommodityResponse {
    private UUID id;
    private String name;
    private String normalizedName;
    private String kannadaName;
    private String category;
    private String standardUnit;
    private boolean active;

    public CommodityResponse() {}

    public static CommodityResponse fromEntity(Commodity entity) {
        CommodityResponse dto = new CommodityResponse();
        dto.id = entity.getId();
        dto.name = entity.getName();
        dto.normalizedName = entity.getNormalizedName();
        dto.kannadaName = entity.getKannadaName();
        dto.category = entity.getCategory();
        dto.standardUnit = entity.getStandardUnit();
        dto.active = entity.isActive();
        return dto;
    }

    public UUID getId() { return id; }
    public String getName() { return name; }
    public String getNormalizedName() { return normalizedName; }
    public String getKannadaName() { return kannadaName; }
    public String getCategory() { return category; }
    public String getStandardUnit() { return standardUnit; }
    public boolean isActive() { return active; }
}
