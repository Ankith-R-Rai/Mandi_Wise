package com.mandiwise.market.service;

import com.mandiwise.market.dto.*;
import com.mandiwise.market.entity.Commodity;
import com.mandiwise.market.entity.Market;
import com.mandiwise.market.entity.MarketPrice;
import com.mandiwise.market.repository.CommodityRepository;
import com.mandiwise.market.repository.MarketPriceRepository;
import com.mandiwise.market.repository.MarketRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class PriceTrendsService {

    private static final Logger log = LoggerFactory.getLogger(PriceTrendsService.class);

    private final CommodityRepository commodityRepository;
    private final MarketRepository marketRepository;
    private final MarketPriceRepository marketPriceRepository;

    public PriceTrendsService(
            CommodityRepository commodityRepository,
            MarketRepository marketRepository,
            MarketPriceRepository marketPriceRepository) {
        this.commodityRepository = commodityRepository;
        this.marketRepository = marketRepository;
        this.marketPriceRepository = marketPriceRepository;
    }

    public PriceTrendResponseDto getHistoricalTrends(
            String commodityIdentifier,
            List<String> marketIdentifiers,
            String rangePreset,
            LocalDate customStartDate,
            LocalDate customEndDate) {

        Commodity commodity = resolveCommodity(commodityIdentifier);

        LocalDate endDate = customEndDate != null ? customEndDate : resolveLatestObservationDate();
        LocalDate startDate = customStartDate != null ? customStartDate : calculateStartDate(endDate, rangePreset);

        List<UUID> resolvedMarketIds = resolveMarketIds(marketIdentifiers);

        List<MarketPrice> observations;
        if (resolvedMarketIds != null && !resolvedMarketIds.isEmpty()) {
            observations = marketPriceRepository.findHistoricalSeriesForMarkets(
                    commodity.getId(),
                    resolvedMarketIds,
                    startDate,
                    endDate
            );
        } else {
            observations = marketPriceRepository.findHistoricalSeriesForAllMarkets(
                    commodity.getId(),
                    startDate,
                    endDate
            );
        }

        // Group observations by market
        Map<UUID, List<MarketPrice>> byMarket = observations.stream()
                .filter(p -> p.getMarket() != null)
                .collect(Collectors.groupingBy(p -> p.getMarket().getId(), LinkedHashMap::new, Collectors.toList()));

        List<MarketTrendSeriesDto> seriesList = new ArrayList<>();
        Map<String, PriceTrendStatsDto> statsMap = new LinkedHashMap<>();

        for (Map.Entry<UUID, List<MarketPrice>> entry : byMarket.entrySet()) {
            List<MarketPrice> marketPrices = entry.getValue();
            marketPrices.sort(Comparator.comparing(MarketPrice::getObservationDate));

            Market market = marketPrices.get(0).getMarket();

            List<HistoricalPricePointDto> points = marketPrices.stream()
                    .map(p -> new HistoricalPricePointDto(
                            p.getObservationDate(),
                            p.getModalPrice(),
                            p.getMinPrice(),
                            p.getMaxPrice(),
                            p.getFreshnessStatus() != null ? p.getFreshnessStatus().name() : "FRESH"
                    ))
                    .collect(Collectors.toList());

            MarketTrendSeriesDto seriesDto = new MarketTrendSeriesDto(
                    market.getId(),
                    market.getName(),
                    market.getDistrict(),
                    points
            );
            seriesList.add(seriesDto);

            PriceTrendStatsDto statsDto = calculateStats(marketPrices);
            statsMap.put(market.getName(), statsDto);
        }

        PriceTrendResponseDto response = new PriceTrendResponseDto();
        response.setCommodityId(commodity.getId());
        response.setCommodityName(commodity.getName());
        response.setCommodityKannadaName(commodity.getKannadaName());
        response.setStartDate(startDate);
        response.setEndDate(endDate);
        response.setSeries(seriesList);
        response.setStats(statsMap);

        return response;
    }

    private Commodity resolveCommodity(String identifier) {
        String finalIdentifier = (identifier == null || identifier.isBlank()) ? "Tomato" : identifier.trim();
        try {
            UUID uuid = UUID.fromString(finalIdentifier);
            return commodityRepository.findById(uuid)
                    .orElseThrow(() -> new IllegalArgumentException("Commodity not found with ID: " + finalIdentifier));
        } catch (IllegalArgumentException ex) {
            String normalized = finalIdentifier.toLowerCase();
            return commodityRepository.findByNormalizedName(normalized)
                    .orElseThrow(() -> new IllegalArgumentException("Commodity not found with name: " + finalIdentifier));
        }
    }

    private List<UUID> resolveMarketIds(List<String> marketIdentifiers) {
        if (marketIdentifiers == null || marketIdentifiers.isEmpty()) {
            return Collections.emptyList();
        }

        List<UUID> resolved = new ArrayList<>();
        List<Market> allMarkets = marketRepository.findAll();

        for (String idOrName : marketIdentifiers) {
            if (idOrName == null || idOrName.isBlank()) continue;
            try {
                resolved.add(UUID.fromString(idOrName.trim()));
            } catch (IllegalArgumentException e) {
                String target = idOrName.toLowerCase().trim();
                allMarkets.stream()
                        .filter(m -> m.getName().equalsIgnoreCase(target) ||
                                     m.getNormalizedName().equalsIgnoreCase(target) ||
                                     m.getNormalizedName().contains(target) ||
                                     target.contains(m.getNormalizedName()))
                        .findFirst()
                        .ifPresent(m -> resolved.add(m.getId()));
            }
        }
        return resolved;
    }

    private LocalDate resolveLatestObservationDate() {
        LocalDate latest = marketPriceRepository.findLatestObservationDate();
        return latest != null ? latest : LocalDate.now();
    }

    private LocalDate calculateStartDate(LocalDate endDate, String rangePreset) {
        if (rangePreset == null || rangePreset.isBlank()) {
            rangePreset = "30d";
        }
        return switch (rangePreset.toLowerCase().trim()) {
            case "7d" -> endDate.minusDays(7);
            case "30d", "1m" -> endDate.minusDays(30);
            case "90d", "3m" -> endDate.minusDays(90);
            case "1y" -> endDate.minusYears(1);
            case "all" -> LocalDate.of(2026, 1, 1);
            default -> endDate.minusDays(30);
        };
    }

    private PriceTrendStatsDto calculateStats(List<MarketPrice> prices) {
        if (prices.isEmpty()) {
            return new PriceTrendStatsDto(BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO, 0);
        }

        BigDecimal latestModal = prices.get(prices.size() - 1).getModalPrice();
        BigDecimal earliestModal = prices.get(0).getModalPrice();

        BigDecimal periodHigh = prices.stream()
                .map(MarketPrice::getModalPrice)
                .max(BigDecimal::compareTo)
                .orElse(latestModal);

        BigDecimal periodLow = prices.stream()
                .map(MarketPrice::getModalPrice)
                .min(BigDecimal::compareTo)
                .orElse(latestModal);

        BigDecimal sum = prices.stream()
                .map(MarketPrice::getModalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal periodAvg = sum.divide(BigDecimal.valueOf(prices.size()), 2, RoundingMode.HALF_UP);

        BigDecimal pctChange = BigDecimal.ZERO;
        if (earliestModal != null && earliestModal.compareTo(BigDecimal.ZERO) > 0) {
            pctChange = latestModal.subtract(earliestModal)
                    .multiply(BigDecimal.valueOf(100))
                    .divide(earliestModal, 2, RoundingMode.HALF_UP);
        }

        return new PriceTrendStatsDto(
                latestModal,
                periodHigh,
                periodLow,
                periodAvg,
                pctChange,
                prices.size()
        );
    }
}
