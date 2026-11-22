package com.mandiwise.market.repository;

import com.mandiwise.market.entity.IngestionBatch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface IngestionBatchRepository extends JpaRepository<IngestionBatch, UUID> {
    List<IngestionBatch> findTop10ByOrderByStartedAtDesc();
}
