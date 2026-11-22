package com.mandiwise.market.service;

import com.mandiwise.market.dto.PriceTrendResponseDto;
import com.mandiwise.market.dto.PriceTrendStatsDto;
import com.mandiwise.market.entity.Commodity;
import com.mandiwise.market.entity.Market;
import com.mandiwise.market.entity.MarketPrice;
import com.mandiwise.market.repository.CommodityRepository;
import com.mandiwise.market.repository.MarketPriceRepository;
import com.mandiwise.market.repository.MarketRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.lang.reflect.Proxy;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

import static org.assertj.core.api.Assertions.assertThat;

class PriceTrendsServiceTest {

    private CommodityRepository commodityRepository;
    private MarketRepository marketRepository;
    private MarketPriceRepository marketPriceRepository;
    private PriceTrendsService priceTrendsService;

    private Commodity tomato;
    private Market kolarMarket;
    private Market bangaloreMarket;
    private List<MarketPrice> testPrices;

    @BeforeEach
    void setUp() {
        tomato = new Commodity();
        tomato.setId(UUID.randomUUID());
        tomato.setName("Tomato");
        tomato.setNormalizedName("tomato");

        kolarMarket = new Market();
        kolarMarket.setId(UUID.randomUUID());
        kolarMarket.setName("Kolar");
        kolarMarket.setNormalizedName("kolar");
        kolarMarket.setDistrict("Kolar");

        bangaloreMarket = new Market();
        bangaloreMarket.setId(UUID.randomUUID());
        bangaloreMarket.setName("Bengaluru (Yeshwanthpur)");
        bangaloreMarket.setNormalizedName("bengaluru (yeshwanthpur)");
        bangaloreMarket.setDistrict("Bengaluru Urban");

        testPrices = new ArrayList<>();

        LocalDate baseDate = LocalDate.of(2026, 11, 14);

        // Kolar: 3 points (Rs. 2000 -> Rs. 2300 -> Rs. 2550)
        MarketPrice p1 = createPrice(tomato, kolarMarket, baseDate.minusDays(20), BigDecimal.valueOf(2000));
        MarketPrice p2 = createPrice(tomato, kolarMarket, baseDate.minusDays(10), BigDecimal.valueOf(2300));
        MarketPrice p3 = createPrice(tomato, kolarMarket, baseDate, BigDecimal.valueOf(2550));

        // Bengaluru: 3 points (Rs. 2100 -> Rs. 2250 -> Rs. 2400)
        MarketPrice p4 = createPrice(tomato, bangaloreMarket, baseDate.minusDays(20), BigDecimal.valueOf(2100));
        MarketPrice p5 = createPrice(tomato, bangaloreMarket, baseDate.minusDays(10), BigDecimal.valueOf(2250));
        MarketPrice p6 = createPrice(tomato, bangaloreMarket, baseDate, BigDecimal.valueOf(2400));

        testPrices.addAll(List.of(p1, p2, p3, p4, p5, p6));

        commodityRepository = (CommodityRepository) Proxy.newProxyInstance(
                CommodityRepository.class.getClassLoader(),
                new Class<?>[]{CommodityRepository.class},
                (proxy, method, args) -> {
                    if (method.getName().equals("findByNormalizedName") || method.getName().equals("findById")) {
                        return Optional.of(tomato);
                    }
                    return null;
                }
        );

        marketRepository = (MarketRepository) Proxy.newProxyInstance(
                MarketRepository.class.getClassLoader(),
                new Class<?>[]{MarketRepository.class},
                (proxy, method, args) -> {
                    if (method.getName().equals("findAll")) {
                        return List.of(kolarMarket, bangaloreMarket);
                    }
                    if (method.getName().equals("findByNormalizedName")) {
                        String query = ((String) args[0]).toLowerCase();
                        if (query.contains("kolar")) return Optional.of(kolarMarket);
                        if (query.contains("bengaluru")) return Optional.of(bangaloreMarket);
                    }
                    return Optional.empty();
                }
        );

        marketPriceRepository = (MarketPriceRepository) Proxy.newProxyInstance(
                MarketPriceRepository.class.getClassLoader(),
                new Class<?>[]{MarketPriceRepository.class},
                (proxy, method, args) -> {
                    if (method.getName().equals("findLatestObservationDate")) {
                        return baseDate;
                    }
                    if (method.getName().contains("findHistoricalSeries")) {
                        return testPrices;
                    }
                    return null;
                }
        );

        priceTrendsService = new PriceTrendsService(commodityRepository, marketRepository, marketPriceRepository);
    }

    private MarketPrice createPrice(Commodity c, Market m, LocalDate date, BigDecimal modal) {
        MarketPrice mp = new MarketPrice();
        mp.setId(UUID.randomUUID());
        mp.setCommodity(c);
        mp.setMarket(m);
        mp.setObservationDate(date);
        mp.setModalPrice(modal);
        mp.setMinPrice(modal.subtract(BigDecimal.valueOf(200)));
        mp.setMaxPrice(modal.add(BigDecimal.valueOf(200)));
        return mp;
    }

    @Test
    @DisplayName("getHistoricalTrends retrieves and groups multi-mandi series with statistics")
    void testGetHistoricalTrendsMultiMandi() {
        PriceTrendResponseDto response = priceTrendsService.getHistoricalTrends(
                "Tomato",
                List.of("Kolar", "Bengaluru (Yeshwanthpur)"),
                "30d",
                null,
                null
        );

        assertThat(response).isNotNull();
        assertThat(response.getCommodityName()).isEqualTo("Tomato");
        assertThat(response.getSeries()).hasSize(2);

        // Verify Kolar series
        var kolarSeries = response.getSeries().stream()
                .filter(s -> s.getMarketName().equals("Kolar"))
                .findFirst().orElseThrow();
        assertThat(kolarSeries.getDataPoints()).hasSize(3);

        // Verify Kolar stats
        PriceTrendStatsDto kolarStats = response.getStats().get("Kolar");
        assertThat(kolarStats).isNotNull();
        assertThat(kolarStats.getLatestModalPrice()).isEqualByComparingTo(BigDecimal.valueOf(2550));
        assertThat(kolarStats.getPeriodHigh()).isEqualByComparingTo(BigDecimal.valueOf(2550));
        assertThat(kolarStats.getPeriodLow()).isEqualByComparingTo(BigDecimal.valueOf(2000));
        // Average: (2000 + 2300 + 2550) / 3 = 2283.33
        assertThat(kolarStats.getPeriodAverage()).isEqualByComparingTo(BigDecimal.valueOf(2283.33));
        // Change: (2550 - 2000) / 2000 * 100 = 27.50%
        assertThat(kolarStats.getPercentageChange()).isEqualByComparingTo(BigDecimal.valueOf(27.50));
    }
}
