package com.mandiwise.market.repository;

import com.mandiwise.MandiWiseApplication;
import com.mandiwise.market.entity.*;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(classes = MandiWiseApplication.class)
@ActiveProfiles("test")
@Transactional
class MarketPriceRepositoryTest {

    @Autowired
    private CommodityRepository commodityRepository;

    @Autowired
    private MarketRepository marketRepository;

    @Autowired
    private DataSourceRepository dataSourceRepository;

    @Autowired
    private MarketPriceRepository marketPriceRepository;

    @Test
    @DisplayName("Persist and query commodity, market, and market prices by filters")
    void testPersistAndQueryMarketPrices() {
        // Given
        Commodity tomato = commodityRepository.findByNormalizedName("test-tomato")
                .orElseGet(() -> {
                    Commodity c = new Commodity();
                    c.setName("Test Tomato");
                    c.setNormalizedName("test-tomato");
                    c.setKannadaName("ಟೊಮೆಟೊ");
                    c.setCategory("Vegetable");
                    c.setStandardUnit("QUINTAL");
                    c.setActive(true);
                    return commodityRepository.save(c);
                });

        Market kolar = marketRepository.findByNormalizedNameAndDistrictAndState("test-kolar", "Kolar", "Karnataka")
                .orElseGet(() -> {
                    Market m = new Market();
                    m.setName("Test Kolar");
                    m.setNormalizedName("test-kolar");
                    m.setDistrict("Kolar");
                    m.setState("Karnataka");
                    m.setStateCode("KA");
                    m.setLatitude(new BigDecimal("13.1367000"));
                    m.setLongitude(new BigDecimal("78.1291000"));
                    m.setActive(true);
                    return marketRepository.save(m);
                });

        DataSource source = dataSourceRepository.findByName("TEST_AGMARKNET")
                .orElseGet(() -> {
                    DataSource ds = new DataSource();
                    ds.setName("TEST_AGMARKNET");
                    ds.setSourceType("API");
                    ds.setBaseUrl("https://agmarknet.gov.in");
                    ds.setActive(true);
                    return dataSourceRepository.save(ds);
                });

        MarketPrice price = new MarketPrice();
        price.setCommodity(tomato);
        price.setMarket(kolar);
        price.setDataSource(source);
        price.setObservationDate(LocalDate.now());
        price.setVariety("Hybrid");
        price.setMinPrice(new BigDecimal("1800.00"));
        price.setMaxPrice(new BigDecimal("2400.00"));
        price.setModalPrice(new BigDecimal("2100.00"));
        price.setPriceUnit("INR_PER_QUINTAL");
        price.setArrivalsTonnes(new BigDecimal("45.50"));
        price.setValidationStatus(ValidationStatus.VALIDATED);
        price.setFreshnessStatus(FreshnessStatus.FRESH);
        marketPriceRepository.save(price);

        // When
        Optional<Commodity> foundCommodity = commodityRepository.findByNormalizedName("tomato");
        List<Market> kolarMarkets = marketRepository.findByDistrictIgnoreCase("Kolar");
        List<MarketPrice> prices = marketPriceRepository.findByCommodityIdAndMarketId(tomato.getId(), kolar.getId());

        // Then
        assertThat(foundCommodity).isPresent();
        assertThat(foundCommodity.get().getName()).isEqualTo("Tomato");

        assertThat(kolarMarkets).isNotEmpty();
        assertThat(prices).hasSize(1);
        assertThat(prices.get(0).getModalPrice()).isEqualByComparingTo("2100.00");
        assertThat(prices.get(0).getFreshnessStatus()).isEqualTo(FreshnessStatus.FRESH);
    }
}
