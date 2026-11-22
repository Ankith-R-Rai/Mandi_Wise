package com.mandiwise.market.dto;

import com.mandiwise.market.entity.MarketPrice;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public class MarketPriceResponse {
    private UUID id;
    private UUID commodityId;
    private String commodityName;
    private String kannadaCommodityName;
    private UUID marketId;
    private String marketName;
    private String district;
    private String state;
    private String variety;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private BigDecimal modalPrice;
    private String priceUnit;
    private BigDecimal arrivalsTonnes;
    private LocalDate observationDate;
    private String source;
    private String freshnessStatus;
    private String validationStatus;

    public MarketPriceResponse() {}

    public static MarketPriceResponse fromEntity(MarketPrice entity) {
        MarketPriceResponse dto = new MarketPriceResponse();
        dto.id = entity.getId();
        if (entity.getCommodity() != null) {
            dto.commodityId = entity.getCommodity().getId();
            dto.commodityName = entity.getCommodity().getName();
            dto.kannadaCommodityName = entity.getCommodity().getKannadaName();
        }
        if (entity.getMarket() != null) {
            dto.marketId = entity.getMarket().getId();
            dto.marketName = entity.getMarket().getName();
            dto.district = entity.getMarket().getDistrict();
            dto.state = entity.getMarket().getState();
        }
        dto.variety = entity.getVariety();
        dto.minPrice = entity.getMinPrice();
        dto.maxPrice = entity.getMaxPrice();
        dto.modalPrice = entity.getModalPrice();
        dto.priceUnit = entity.getPriceUnit();
        dto.arrivalsTonnes = entity.getArrivalsTonnes();
        dto.observationDate = entity.getObservationDate();
        if (entity.getDataSource() != null) {
            dto.source = entity.getDataSource().getName();
        }
        if (entity.getFreshnessStatus() != null) {
            dto.freshnessStatus = entity.getFreshnessStatus().name();
        }
        if (entity.getValidationStatus() != null) {
            dto.validationStatus = entity.getValidationStatus().name();
        }
        return dto;
    }

    public UUID getId() { return id; }
    public UUID getCommodityId() { return commodityId; }
    public String getCommodityName() { return commodityName; }
    public String getKannadaCommodityName() { return kannadaCommodityName; }
    public UUID getMarketId() { return marketId; }
    public String getMarketName() { return marketName; }
    public String getDistrict() { return district; }
    public String getState() { return state; }
    public String getVariety() { return variety; }
    public BigDecimal getMinPrice() { return minPrice; }
    public BigDecimal getMaxPrice() { return maxPrice; }
    public BigDecimal getModalPrice() { return modalPrice; }
    public String getPriceUnit() { return priceUnit; }
    public BigDecimal getArrivalsTonnes() { return arrivalsTonnes; }
    public LocalDate getObservationDate() { return observationDate; }
    public String getSource() { return source; }
    public String getFreshnessStatus() { return freshnessStatus; }
    public String getValidationStatus() { return validationStatus; }
}
