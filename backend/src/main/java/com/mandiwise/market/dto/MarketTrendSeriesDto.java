package com.mandiwise.market.dto;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class MarketTrendSeriesDto {

    private UUID marketId;
    private String marketName;
    private String district;
    private List<HistoricalPricePointDto> dataPoints = new ArrayList<>();

    public MarketTrendSeriesDto() {
    }

    public MarketTrendSeriesDto(UUID marketId, String marketName, String district, List<HistoricalPricePointDto> dataPoints) {
        this.marketId = marketId;
        this.marketName = marketName;
        this.district = district;
        this.dataPoints = dataPoints != null ? dataPoints : new ArrayList<>();
    }

    public UUID getMarketId() {
        return marketId;
    }

    public void setMarketId(UUID marketId) {
        this.marketId = marketId;
    }

    public String getMarketName() {
        return marketName;
    }

    public void setMarketName(String marketName) {
        this.marketName = marketName;
    }

    public String getDistrict() {
        return district;
    }

    public void setDistrict(String district) {
        this.district = district;
    }

    public List<HistoricalPricePointDto> getDataPoints() {
        return dataPoints;
    }

    public void setDataPoints(List<HistoricalPricePointDto> dataPoints) {
        this.dataPoints = dataPoints;
    }
}
