package com.mandiwise.market.repository;

import com.mandiwise.market.entity.MarketPrice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface MarketPriceRepository extends JpaRepository<MarketPrice, UUID>, JpaSpecificationExecutor<MarketPrice> {

    List<MarketPrice> findByCommodityIdAndMarketId(UUID commodityId, UUID marketId);

    @Query("SELECT mp FROM MarketPrice mp WHERE mp.commodity.id = :commodityId AND mp.market.id = :marketId AND mp.observationDate = :date AND (:variety IS NULL OR mp.variety = :variety)")
    Optional<MarketPrice> findObservation(
            @Param("commodityId") UUID commodityId,
            @Param("marketId") UUID marketId,
            @Param("date") LocalDate date,
            @Param("variety") String variety
    );

    @Query("SELECT mp FROM MarketPrice mp JOIN FETCH mp.commodity c JOIN FETCH mp.market m JOIN FETCH mp.dataSource ds ORDER BY mp.observationDate DESC")
    List<MarketPrice> findTop50WithDetails();

    @Query("SELECT COUNT(DISTINCT mp.market.id) FROM MarketPrice mp")
    long countDistinctMarketsWithPrices();

    List<MarketPrice> findByCommodityId(UUID commodityId);

    @Query("SELECT MAX(mp.observationDate) FROM MarketPrice mp")
    LocalDate findLatestObservationDate();

    @Query("SELECT MIN(mp.observationDate) FROM MarketPrice mp")
    LocalDate findOldestObservationDate();
}
