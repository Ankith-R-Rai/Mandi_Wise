package com.mandiwise.market.dto;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public class PriceTrendResponseDto {

    private UUID commodityId;
    private String commodityName;
    private String commodityKannadaName;
    private LocalDate startDate;
    private LocalDate endDate;
    private String priceUnit = "INR_PER_QUINTAL";
    private List<MarketTrendSeriesDto> series = new ArrayList<>();
    private Map<String, PriceTrendStatsDto> stats = new LinkedHashMap<>();

    public PriceTrendResponseDto() {
    }

    public UUID getCommodityId() {
        return commodityId;
    }

    public void setCommodityId(UUID commodityId) {
        this.commodityId = commodityId;
    }

    public String getCommodityName() {
        return commodityName;
    }

    public void setCommodityName(String commodityName) {
        this.commodityName = commodityName;
    }

    public String getCommodityKannadaName() {
        return commodityKannadaName;
    }

    public void setCommodityKannadaName(String commodityKannadaName) {
        this.commodityKannadaName = commodityKannadaName;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public String getPriceUnit() {
        return priceUnit;
    }

    public void setPriceUnit(String priceUnit) {
        this.priceUnit = priceUnit;
    }

    public List<MarketTrendSeriesDto> getSeries() {
        return series;
    }

    public void setSeries(List<MarketTrendSeriesDto> series) {
        this.series = series;
    }

    public Map<String, PriceTrendStatsDto> getStats() {
        return stats;
    }

    public void setStats(Map<String, PriceTrendStatsDto> stats) {
        this.stats = stats;
    }
}
