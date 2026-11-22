package com.mandiwise.market.entity;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "ingestion_batches")
public class IngestionBatch {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "source_id", nullable = false)
    private DataSource dataSource;

    @Column(name = "batch_status", nullable = false, length = 30)
    private String batchStatus = "COMPLETED";

    @Column(name = "records_processed", nullable = false)
    private int recordsProcessed = 0;

    @Column(name = "records_accepted", nullable = false)
    private int recordsAccepted = 0;

    @Column(name = "records_rejected", nullable = false)
    private int recordsRejected = 0;

    @Column(name = "started_at", nullable = false, updatable = false)
    private OffsetDateTime startedAt = OffsetDateTime.now();

    @Column(name = "completed_at")
    private OffsetDateTime completedAt;

    @Column(name = "error_log", columnDefinition = "TEXT")
    private String errorLog;

    public IngestionBatch() {}

    public IngestionBatch(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public DataSource getDataSource() {
        return dataSource;
    }

    public void setDataSource(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    public String getBatchStatus() {
        return batchStatus;
    }

    public void setBatchStatus(String batchStatus) {
        this.batchStatus = batchStatus;
    }

    public int getRecordsProcessed() {
        return recordsProcessed;
    }

    public void setRecordsProcessed(int recordsProcessed) {
        this.recordsProcessed = recordsProcessed;
    }

    public int getRecordsAccepted() {
        return recordsAccepted;
    }

    public void setRecordsAccepted(int recordsAccepted) {
        this.recordsAccepted = recordsAccepted;
    }

    public int getRecordsRejected() {
        return recordsRejected;
    }

    public void setRecordsRejected(int recordsRejected) {
        this.recordsRejected = recordsRejected;
    }

    public OffsetDateTime getStartedAt() {
        return startedAt;
    }

    public void setStartedAt(OffsetDateTime startedAt) {
        this.startedAt = startedAt;
    }

    public OffsetDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(OffsetDateTime completedAt) {
        this.completedAt = completedAt;
    }

    public String getErrorLog() {
        return errorLog;
    }

    public void setErrorLog(String errorLog) {
        this.errorLog = errorLog;
    }
}
