package com.mandiwise.market.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(
    name = "market_prices",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uk_market_price_obs",
            columnNames = {"commodity_id", "market_id", "observation_date", "variety"}
        )
    }
)
public class MarketPrice {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "commodity_id", nullable = false)
    private Commodity commodity;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "market_id", nullable = false)
    private Market market;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "source_id", nullable = false)
    private DataSource dataSource;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "batch_id")
    private IngestionBatch batch;

    @Column(name = "observation_date", nullable = false)
    private LocalDate observationDate;

    @Column(length = 80)
    private String variety;

    @Column(name = "min_price", precision = 12, scale = 2)
    private BigDecimal minPrice;

    @Column(name = "max_price", precision = 12, scale = 2)
    private BigDecimal maxPrice;

    @Column(name = "modal_price", nullable = false, precision = 12, scale = 2)
    private BigDecimal modalPrice;

    @Column(name = "price_unit", nullable = false, length = 30)
    private String priceUnit = "INR_PER_QUINTAL";

    @Column(name = "arrivals_tonnes", precision = 10, scale = 2)
    private BigDecimal arrivalsTonnes;

    @Column(name = "source_record_id", length = 180)
    private String sourceRecordId;

    @Enumerated(EnumType.STRING)
    @Column(name = "validation_status", nullable = false, length = 30)
    private ValidationStatus validationStatus = ValidationStatus.VALIDATED;

    @Enumerated(EnumType.STRING)
    @Column(name = "freshness_status", nullable = false, length = 30)
    private FreshnessStatus freshnessStatus = FreshnessStatus.FRESH;

    @Column(name = "retrieved_at", nullable = false)
    private OffsetDateTime retrievedAt = OffsetDateTime.now();

    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt = OffsetDateTime.now();

    public MarketPrice() {}

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public Commodity getCommodity() {
        return commodity;
    }

    public void setCommodity(Commodity commodity) {
        this.commodity = commodity;
    }

    public Market getMarket() {
        return market;
    }

    public void setMarket(Market market) {
        this.market = market;
    }

    public DataSource getDataSource() {
        return dataSource;
    }

    public void setDataSource(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    public IngestionBatch getBatch() {
        return batch;
    }

    public void setBatch(IngestionBatch batch) {
        this.batch = batch;
    }

    public LocalDate getObservationDate() {
        return observationDate;
    }

    public void setObservationDate(LocalDate observationDate) {
        this.observationDate = observationDate;
    }

    public String getVariety() {
        return variety;
    }

    public void setVariety(String variety) {
        this.variety = variety;
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

    public BigDecimal getModalPrice() {
        return modalPrice;
    }

    public void setModalPrice(BigDecimal modalPrice) {
        this.modalPrice = modalPrice;
    }

    public String getPriceUnit() {
        return priceUnit;
    }

    public void setPriceUnit(String priceUnit) {
        this.priceUnit = priceUnit;
    }

    public BigDecimal getArrivalsTonnes() {
        return arrivalsTonnes;
    }

    public void setArrivalsTonnes(BigDecimal arrivalsTonnes) {
        this.arrivalsTonnes = arrivalsTonnes;
    }

    public String getSourceRecordId() {
        return sourceRecordId;
    }

    public void setSourceRecordId(String sourceRecordId) {
        this.sourceRecordId = sourceRecordId;
    }

    public ValidationStatus getValidationStatus() {
        return validationStatus;
    }

    public void setValidationStatus(ValidationStatus validationStatus) {
        this.validationStatus = validationStatus;
    }

    public FreshnessStatus getFreshnessStatus() {
        return freshnessStatus;
    }

    public void setFreshnessStatus(FreshnessStatus freshnessStatus) {
        this.freshnessStatus = freshnessStatus;
    }

    public OffsetDateTime getRetrievedAt() {
        return retrievedAt;
    }

    public void setRetrievedAt(OffsetDateTime retrievedAt) {
        this.retrievedAt = retrievedAt;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
