package com.mandiwise.market.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mandiwise.market.entity.*;
import com.mandiwise.market.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.io.InputStream;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
public class CanonicalDataSeeder {

    private static final Logger log = LoggerFactory.getLogger(CanonicalDataSeeder.class);

    private static final Map<String, double[]> MANDI_COORDINATES = Map.of(
            "kolar", new double[]{13.1367, 78.1291},
            "bengaluru (yeshwanthpur)", new double[]{13.0238, 77.5529},
            "hubli (amaragol)", new double[]{15.3976, 75.1011},
            "belagavi", new double[]{15.8617, 74.5089},
            "mysuru (bandipalya)", new double[]{12.2814, 76.6780},
            "davanagere", new double[]{14.4644, 75.9218}
    );

    private final CommodityRepository commodityRepository;
    private final MarketRepository marketRepository;
    private final DataSourceRepository dataSourceRepository;
    private final IngestionBatchRepository ingestionBatchRepository;
    private final MarketPriceRepository marketPriceRepository;
    private final ObjectMapper objectMapper;

    public CanonicalDataSeeder(
            CommodityRepository commodityRepository,
            MarketRepository marketRepository,
            DataSourceRepository dataSourceRepository,
            IngestionBatchRepository ingestionBatchRepository,
            MarketPriceRepository marketPriceRepository,
            ObjectMapper objectMapper) {
        this.commodityRepository = commodityRepository;
        this.marketRepository = marketRepository;
        this.dataSourceRepository = dataSourceRepository;
        this.ingestionBatchRepository = ingestionBatchRepository;
        this.marketPriceRepository = marketPriceRepository;
        this.objectMapper = objectMapper;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void onApplicationReady() {
        if (marketPriceRepository.count() == 0) {
            log.info("No market prices found in database. Initiating canonical data seeding...");
            int inserted = seedCanonicalData();
            log.info("Canonical data seeding completed. {} market price records ingested.", inserted);
        } else {
            ensureMarketCoordinates();
        }
    }

    @Transactional
    public void ensureMarketCoordinates() {
        List<Market> markets = marketRepository.findAll();
        boolean updatedAny = false;
        for (Market m : markets) {
            if (m.getLatitude() == null || m.getLongitude() == null) {
                double[] coords = MANDI_COORDINATES.get(m.getNormalizedName());
                if (coords != null) {
                    m.setLatitude(BigDecimal.valueOf(coords[0]));
                    m.setLongitude(BigDecimal.valueOf(coords[1]));
                    marketRepository.save(m);
                    updatedAny = true;
                    log.info("Updated coordinates for market '{}': {}, {}", m.getName(), coords[0], coords[1]);
                }
            }
        }
        if (updatedAny) {
            log.info("APMC market coordinates verification completed.");
        }
    }

    @Transactional
    public int seedCanonicalData() {
        JsonNode rootNode = loadCanonicalJson();
        if (rootNode == null || !rootNode.isArray()) {
            log.warn("Canonical mandi data file not found or empty.");
            return 0;
        }

        DataSource agmarknet = resolveDataSource("AGMARKNET", "API", "https://agmarknet.gov.in");
        DataSource dataGov = resolveDataSource("data.gov.in", "PORTAL", "https://data.gov.in");

        IngestionBatch batch = new IngestionBatch(agmarknet);
        batch.setBatchStatus("PROCESSING");
        batch = ingestionBatchRepository.save(batch);

        int processed = 0;
        int accepted = 0;
        int newlyInserted = 0;

        for (JsonNode record : rootNode) {
            processed++;
            try {
                String commodityName = record.path("commodity").asText().trim();
                String marketName = record.path("market").asText().trim();
                String district = record.path("district").asText().trim();
                String state = record.hasNonNull("state") ? record.path("state").asText().trim() : "Karnataka";
                String variety = record.hasNonNull("variety") ? record.path("variety").asText().trim() : null;
                String dateStr = record.path("observation_date").asText().trim();
                String sourceName = record.hasNonNull("source") ? record.path("source").asText().trim() : "AGMARKNET";
                String unit = record.hasNonNull("unit") ? record.path("unit").asText().trim() : "INR_PER_QUINTAL";

                double modalDouble = record.path("modal_price").asDouble();
                double minDouble = record.hasNonNull("min_price") ? record.path("min_price").asDouble() : modalDouble;
                double maxDouble = record.hasNonNull("max_price") ? record.path("max_price").asDouble() : modalDouble;

                LocalDate observationDate = LocalDate.parse(dateStr);
                Commodity commodity = resolveCommodity(commodityName);
                Market market = resolveMarket(marketName, district, state);
                DataSource source = sourceName.equalsIgnoreCase("data.gov.in") ? dataGov : agmarknet;

                FreshnessStatus freshness = calculateFreshness(observationDate);

                Optional<MarketPrice> existing = marketPriceRepository.findObservation(
                        commodity.getId(),
                        market.getId(),
                        observationDate,
                        variety
                );

                if (existing.isPresent()) {
                    MarketPrice p = existing.get();
                    p.setMinPrice(BigDecimal.valueOf(minDouble));
                    p.setMaxPrice(BigDecimal.valueOf(maxDouble));
                    p.setModalPrice(BigDecimal.valueOf(modalDouble));
                    p.setPriceUnit(unit);
                    p.setFreshnessStatus(freshness);
                    p.setValidationStatus(ValidationStatus.VALIDATED);
                    marketPriceRepository.save(p);
                    accepted++;
                } else {
                    MarketPrice p = new MarketPrice();
                    p.setCommodity(commodity);
                    p.setMarket(market);
                    p.setDataSource(source);
                    p.setBatch(batch);
                    p.setObservationDate(observationDate);
                    p.setVariety(variety);
                    p.setMinPrice(BigDecimal.valueOf(minDouble));
                    p.setMaxPrice(BigDecimal.valueOf(maxDouble));
                    p.setModalPrice(BigDecimal.valueOf(modalDouble));
                    p.setPriceUnit(unit);
                    p.setFreshnessStatus(freshness);
                    p.setValidationStatus(ValidationStatus.VALIDATED);
                    marketPriceRepository.save(p);
                    accepted++;
                    newlyInserted++;
                }
            } catch (Exception ex) {
                log.error("Error ingesting record index {}: {}", processed, ex.getMessage());
            }
        }

        batch.setRecordsProcessed(processed);
        batch.setRecordsAccepted(accepted);
        batch.setRecordsRejected(processed - accepted);
        batch.setBatchStatus("COMPLETED");
        batch.setCompletedAt(OffsetDateTime.now());
        ingestionBatchRepository.save(batch);

        return newlyInserted;
    }

    public FreshnessStatus calculateFreshness(LocalDate observationDate) {
        if (observationDate == null) {
            return FreshnessStatus.STALE;
        }
        long days = Math.abs(ChronoUnit.DAYS.between(observationDate, LocalDate.now()));
        if (days <= 7) {
            return FreshnessStatus.FRESH;
        } else if (days <= 30) {
            return FreshnessStatus.ACCEPTABLE;
        } else {
            return FreshnessStatus.STALE;
        }
    }

    private JsonNode loadCanonicalJson() {
        try {
            ClassPathResource resource = new ClassPathResource("data/canonical_karnataka_mandi_data.json");
            if (resource.exists()) {
                try (InputStream is = resource.getInputStream()) {
                    return objectMapper.readTree(is);
                }
            }
            File fallbackFile = new File("data/canonical_karnataka_mandi_data.json");
            if (fallbackFile.exists()) {
                return objectMapper.readTree(fallbackFile);
            }
        } catch (Exception e) {
            log.error("Failed to parse canonical_karnataka_mandi_data.json: {}", e.getMessage());
        }
        return null;
    }

    private Commodity resolveCommodity(String name) {
        String normalized = name.toLowerCase().trim();
        return commodityRepository.findByNormalizedName(normalized)
                .orElseGet(() -> {
                    Commodity c = new Commodity();
                    c.setName(name);
                    c.setNormalizedName(normalized);
                    c.setCategory("Agricultural Produce");
                    c.setStandardUnit("QUINTAL");
                    if (normalized.contains("tomato")) c.setKannadaName("ಟೊಮೆಟೊ");
                    else if (normalized.contains("onion")) c.setKannadaName("ಈರುಳ್ಳಿ");
                    else if (normalized.contains("potato")) c.setKannadaName("ಆಲೂಗಡ್ಡೆ");
                    return commodityRepository.save(c);
                });
    }

    private Market resolveMarket(String name, String district, String state) {
        String normalized = name.toLowerCase().trim();
        Market market = marketRepository.findByNormalizedNameAndDistrictAndState(normalized, district, state)
                .orElseGet(() -> {
                    Market m = new Market();
                    m.setName(name);
                    m.setNormalizedName(normalized);
                    m.setDistrict(district);
                    m.setState(state);
                    m.setStateCode("KA");
                    return m;
                });

        if (market.getLatitude() == null || market.getLongitude() == null) {
            double[] coords = MANDI_COORDINATES.get(normalized);
            if (coords != null) {
                market.setLatitude(BigDecimal.valueOf(coords[0]));
                market.setLongitude(BigDecimal.valueOf(coords[1]));
            }
        }
        return marketRepository.save(market);
    }

    private DataSource resolveDataSource(String name, String type, String url) {
        return dataSourceRepository.findByName(name)
                .orElseGet(() -> {
                    DataSource ds = new DataSource();
                    ds.setName(name);
                    ds.setSourceType(type);
                    ds.setBaseUrl(url);
                    return dataSourceRepository.save(ds);
                });
    }
}
