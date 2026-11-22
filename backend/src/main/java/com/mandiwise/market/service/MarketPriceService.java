package com.mandiwise.market.service;

import com.mandiwise.market.dto.CommodityResponse;
import com.mandiwise.market.dto.MarketPriceResponse;
import com.mandiwise.market.dto.MarketResponse;
import com.mandiwise.market.dto.MarketSummaryResponse;
import com.mandiwise.market.entity.FreshnessStatus;
import com.mandiwise.market.entity.Market;
import com.mandiwise.market.entity.MarketPrice;
import com.mandiwise.market.repository.CommodityRepository;
import com.mandiwise.market.repository.MarketPriceRepository;
import com.mandiwise.market.repository.MarketRepository;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class MarketPriceService {

    private final CommodityRepository commodityRepository;
    private final MarketRepository marketRepository;
    private final MarketPriceRepository marketPriceRepository;

    public MarketPriceService(
            CommodityRepository commodityRepository,
            MarketRepository marketRepository,
            MarketPriceRepository marketPriceRepository) {
        this.commodityRepository = commodityRepository;
        this.marketRepository = marketRepository;
        this.marketPriceRepository = marketPriceRepository;
    }

    public List<CommodityResponse> getActiveCommodities() {
        return commodityRepository.findByIsActiveTrueOrderByNameAsc()
                .stream()
                .map(CommodityResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public List<MarketResponse> getMarkets(String district) {
        List<Market> markets;
        if (StringUtils.hasText(district)) {
            markets = marketRepository.findByDistrictIgnoreCase(district.trim());
        } else {
            markets = marketRepository.findByIsActiveTrueOrderByNameAsc();
        }
        return markets.stream()
                .map(MarketResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public List<String> getDistricts() {
        return marketRepository.findDistinctDistricts();
    }

    public List<MarketPriceResponse> getMarketPrices(
            String commodity,
            String district,
            String mandi,
            LocalDate date,
            String freshness) {

        Specification<MarketPrice> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (StringUtils.hasText(commodity)) {
                String commTerm = commodity.trim().toLowerCase();
                try {
                    UUID commUuid = UUID.fromString(commodity.trim());
                    predicates.add(cb.equal(root.get("commodity").get("id"), commUuid));
                } catch (IllegalArgumentException e) {
                    predicates.add(cb.or(
                            cb.equal(cb.lower(root.get("commodity").get("normalizedName")), commTerm),
                            cb.like(cb.lower(root.get("commodity").get("name")), "%" + commTerm + "%")
                    ));
                }
            }

            if (StringUtils.hasText(district)) {
                predicates.add(cb.equal(
                        cb.lower(root.get("market").get("district")),
                        district.trim().toLowerCase()
                ));
            }

            if (StringUtils.hasText(mandi)) {
                String mandiTerm = mandi.trim().toLowerCase();
                try {
                    UUID mandiUuid = UUID.fromString(mandi.trim());
                    predicates.add(cb.equal(root.get("market").get("id"), mandiUuid));
                } catch (IllegalArgumentException e) {
                    predicates.add(cb.or(
                            cb.equal(cb.lower(root.get("market").get("normalizedName")), mandiTerm),
                            cb.like(cb.lower(root.get("market").get("name")), "%" + mandiTerm + "%")
                    ));
                }
            }

            if (date != null) {
                predicates.add(cb.equal(root.get("observationDate"), date));
            }

            if (StringUtils.hasText(freshness)) {
                try {
                    FreshnessStatus status = FreshnessStatus.valueOf(freshness.trim().toUpperCase());
                    predicates.add(cb.equal(root.get("freshnessStatus"), status));
                } catch (IllegalArgumentException ignored) {}
            }

            query.orderBy(
                    cb.desc(root.get("observationDate")),
                    cb.asc(root.get("market").get("name"))
            );

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return marketPriceRepository.findAll(spec)
                .stream()
                .map(MarketPriceResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public MarketSummaryResponse getSummary() {
        long totalCommodities = commodityRepository.count();
        long totalMarkets = marketPriceRepository.countDistinctMarketsWithPrices();
        long totalObservations = marketPriceRepository.count();
        LocalDate latest = marketPriceRepository.findLatestObservationDate();
        LocalDate oldest = marketPriceRepository.findOldestObservationDate();

        return new MarketSummaryResponse(
                totalCommodities,
                totalMarkets,
                totalObservations,
                latest,
                oldest
        );
    }
}
