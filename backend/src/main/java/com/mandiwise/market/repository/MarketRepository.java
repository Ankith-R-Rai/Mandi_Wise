package com.mandiwise.market.repository;

import com.mandiwise.market.entity.Market;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface MarketRepository extends JpaRepository<Market, UUID> {
    Optional<Market> findByNormalizedNameAndDistrictAndState(String normalizedName, String district, String state);
    Optional<Market> findByNameIgnoreCaseAndDistrictIgnoreCase(String name, String district);
    List<Market> findByDistrictIgnoreCase(String district);
    List<Market> findByIsActiveTrueOrderByNameAsc();

    @Query("SELECT DISTINCT m.district FROM Market m WHERE m.isActive = true ORDER BY m.district ASC")
    List<String> findDistinctDistricts();
}
