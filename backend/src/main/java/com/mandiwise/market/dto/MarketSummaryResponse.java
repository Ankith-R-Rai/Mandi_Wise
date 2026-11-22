package com.mandiwise.market.dto;

import java.time.LocalDate;

public class MarketSummaryResponse {
    private long totalCommodities;
    private long totalMarkets;
    private long totalObservations;
    private LocalDate latestObservationDate;
    private LocalDate oldestObservationDate;

    public MarketSummaryResponse() {}

    public MarketSummaryResponse(long totalCommodities, long totalMarkets, long totalObservations, LocalDate latestObservationDate, LocalDate oldestObservationDate) {
        this.totalCommodities = totalCommodities;
        this.totalMarkets = totalMarkets;
        this.totalObservations = totalObservations;
        this.latestObservationDate = latestObservationDate;
        this.oldestObservationDate = oldestObservationDate;
    }

    public long getTotalCommodities() { return totalCommodities; }
    public long getTotalMarkets() { return totalMarkets; }
    public long getTotalObservations() { return totalObservations; }
    public LocalDate getLatestObservationDate() { return latestObservationDate; }
    public LocalDate getOldestObservationDate() { return oldestObservationDate; }
}
