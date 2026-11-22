package com.mandiwise.market.service;

import com.mandiwise.MandiWiseApplication;
import com.mandiwise.market.entity.Commodity;
import com.mandiwise.market.entity.Market;
import com.mandiwise.market.entity.MarketPrice;
import com.mandiwise.market.repository.CommodityRepository;
import com.mandiwise.market.repository.MarketPriceRepository;
import com.mandiwise.market.repository.MarketRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(classes = MandiWiseApplication.class)
@ActiveProfiles("test")
@Transactional
class CanonicalDataSeederTest {

    @Autowired
    private CanonicalDataSeeder seeder;

    @Autowired
    private CommodityRepository commodityRepository;

    @Autowired
    private MarketRepository marketRepository;

    @Autowired
    private MarketPriceRepository marketPriceRepository;

    @Test
    @DisplayName("Canonical Data Seeder loads and creates canonical commodities, markets, and prices idempotently")
    void testSeedCanonicalData() {
        // 1. Initial records seeded on startup via ApplicationReadyEvent
        List<MarketPrice> initialPrices = marketPriceRepository.findAll();
        assertThat(initialPrices).isNotEmpty();

        List<Commodity> commodities = commodityRepository.findAll();
        assertThat(commodities).isNotEmpty();

        List<Market> markets = marketRepository.findAll();
        assertThat(markets).isNotEmpty();
        for (Market m : markets) {
            assertThat(m.getLatitude()).as("Market " + m.getName() + " latitude must not be null").isNotNull();
            assertThat(m.getLongitude()).as("Market " + m.getName() + " longitude must not be null").isNotNull();
        }

        // 2. Re-running seeder proves idempotency (0 newly inserted, no duplicate errors)
        int secondRunInserted = seeder.seedCanonicalData();
        assertThat(secondRunInserted).isEqualTo(0);

        List<MarketPrice> pricesAfterSecondRun = marketPriceRepository.findAll();
        assertThat(pricesAfterSecondRun).hasSize(initialPrices.size());
    }
}
