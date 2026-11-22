package com.mandiwise.market.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class HistoricalPricePointDto {

    private LocalDate observationDate;
    private BigDecimal modalPrice;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private String freshnessStatus;

    public HistoricalPricePointDto() {
    }

    public HistoricalPricePointDto(LocalDate observationDate, BigDecimal modalPrice, BigDecimal minPrice, BigDecimal maxPrice, String freshnessStatus) {
        this.observationDate = observationDate;
        this.modalPrice = modalPrice;
        this.minPrice = minPrice;
        this.maxPrice = maxPrice;
        this.freshnessStatus = freshnessStatus;
    }

    public LocalDate getObservationDate() {
        return observationDate;
    }

    public void setObservationDate(LocalDate observationDate) {
        this.observationDate = observationDate;
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

    public String getFreshnessStatus() {
        return freshnessStatus;
    }

    public void setFreshnessStatus(String freshnessStatus) {
        this.freshnessStatus = freshnessStatus;
    }
}
