package com.mandiwise.recommendation.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public class MandiCandidateDto {

    private UUID marketId;
    private String marketName;
    private String district;
    private String state;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private BigDecimal modalPrice;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private String priceUnit;
    private LocalDate observationDate;
    private String freshnessStatus;
    private CalculationBreakdown breakdown;
    private int rank;
    private boolean isTopRecommendation;
    private boolean isNearestMarket;
    private BigDecimal netAdvantageVsNearest;

    public MandiCandidateDto() {}

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

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public BigDecimal getLatitude() {
        return latitude;
    }

    public void setLatitude(BigDecimal latitude) {
        this.latitude = latitude;
    }

    public BigDecimal getLongitude() {
        return longitude;
    }

    public void setLongitude(BigDecimal longitude) {
        this.longitude = longitude;
    }

    public BigDecimal getModalPrice() {
        return modalPrice;
    }

    public void setModalPrice(BigDecimal modalPrice) {
        this.modalPrice = modalPrice;
    }

    public BigDecimal getMinPrice() {
        return minPrice;
    }

    public void setMinPrice(BigDecimal minPrice) {
        this.minPrice = minPrice;
    }

    public BigDecimal getMaxPrice() {
        return maxPrice;
    }

    public void setMaxPrice(BigDecimal maxPrice) {
        this.maxPrice = maxPrice;
    }

    public String getPriceUnit() {
        return priceUnit;
    }

    public void setPriceUnit(String priceUnit) {
        this.priceUnit = priceUnit;
    }

    public LocalDate getObservationDate() {
        return observationDate;
    }

    public void setObservationDate(LocalDate observationDate) {
        this.observationDate = observationDate;
    }

    public String getFreshnessStatus() {
        return freshnessStatus;
    }

    public void setFreshnessStatus(String freshnessStatus) {
        this.freshnessStatus = freshnessStatus;
    }

    public CalculationBreakdown getBreakdown() {
        return breakdown;
    }

    public void setBreakdown(CalculationBreakdown breakdown) {
        this.breakdown = breakdown;
    }

    public int getRank() {
        return rank;
    }

    public void setRank(int rank) {
        this.rank = rank;
    }

    public boolean isTopRecommendation() {
        return isTopRecommendation;
    }

    public void setTopRecommendation(boolean topRecommendation) {
        isTopRecommendation = topRecommendation;
    }

    public boolean isNearestMarket() {
        return isNearestMarket;
    }

    public void setNearestMarket(boolean nearestMarket) {
        isNearestMarket = nearestMarket;
    }

    public BigDecimal getNetAdvantageVsNearest() {
        return netAdvantageVsNearest;
    }

    public void setNetAdvantageVsNearest(BigDecimal netAdvantageVsNearest) {
        this.netAdvantageVsNearest = netAdvantageVsNearest;
    }
}
