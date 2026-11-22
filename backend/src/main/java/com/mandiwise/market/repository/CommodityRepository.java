package com.mandiwise.market.repository;

import com.mandiwise.market.entity.Commodity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CommodityRepository extends JpaRepository<Commodity, UUID> {
    Optional<Commodity> findByNormalizedName(String normalizedName);
    Optional<Commodity> findByNameIgnoreCase(String name);
    List<Commodity> findByIsActiveTrueOrderByNameAsc();
}
