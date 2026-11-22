package com.mandiwise.market.dto;

import java.math.BigDecimal;

public class PriceTrendStatsDto {

    private BigDecimal latestModalPrice;
    private BigDecimal periodHigh;
    private BigDecimal periodLow;
    private BigDecimal periodAverage;
    private BigDecimal percentageChange;
    private int observationCount;

    public PriceTrendStatsDto() {
    }

    public PriceTrendStatsDto(BigDecimal latestModalPrice, BigDecimal periodHigh, BigDecimal periodLow, BigDecimal periodAverage, BigDecimal percentageChange, int observationCount) {
        this.latestModalPrice = latestModalPrice;
        this.periodHigh = periodHigh;
        this.periodLow = periodLow;
        this.periodAverage = periodAverage;
        this.percentageChange = percentageChange;
        this.observationCount = observationCount;
    }

    public BigDecimal getLatestModalPrice() {
        return latestModalPrice;
    }

    public void setLatestModalPrice(BigDecimal latestModalPrice) {
        this.latestModalPrice = latestModalPrice;
    }

    public BigDecimal getPeriodHigh() {
        return periodHigh;
    }

    public void setPeriodHigh(BigDecimal periodHigh) {
        this.periodHigh = periodHigh;
    }

    public BigDecimal getPeriodLow() {
        return periodLow;
    }

    public void setPeriodLow(BigDecimal periodLow) {
        this.periodLow = periodLow;
    }

    public BigDecimal getPeriodAverage() {
        return periodAverage;
    }

    public void setPeriodAverage(BigDecimal periodAverage) {
        this.periodAverage = periodAverage;
    }

    public BigDecimal getPercentageChange() {
        return percentageChange;
    }

    public void setPercentageChange(BigDecimal percentageChange) {
        this.percentageChange = percentageChange;
    }

    public int getObservationCount() {
        return observationCount;
    }

    public void setObservationCount(int observationCount) {
        this.observationCount = observationCount;
    }
}
