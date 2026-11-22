package com.mandiwise.recommendation.service;

import com.mandiwise.market.entity.Commodity;
import com.mandiwise.market.entity.Market;
import com.mandiwise.market.entity.MarketPrice;
import com.mandiwise.market.repository.CommodityRepository;
import com.mandiwise.market.repository.MarketPriceRepository;
import com.mandiwise.recommendation.dto.DistrictDto;
import com.mandiwise.recommendation.dto.RecommendationRequest;
import com.mandiwise.recommendation.dto.RecommendationResponse;
import com.mandiwise.recommendation.dto.VehicleDto;
import com.mandiwise.recommendation.model.VehicleType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.lang.reflect.Proxy;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

class RecommendationServiceTest {

    private CommodityRepository commodityRepository;
    private MarketPriceRepository marketPriceRepository;
    private RecommendationService recommendationService;

    private Commodity tomato;
    private Market kolarMarket;
    private Market bangaloreMarket;

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
        kolarMarket.setLatitude(BigDecimal.valueOf(13.1367));
        kolarMarket.setLongitude(BigDecimal.valueOf(78.1291));

        bangaloreMarket = new Market();
        bangaloreMarket.setId(UUID.randomUUID());
        bangaloreMarket.setName("Bengaluru (Yeshwanthpur)");
        bangaloreMarket.setNormalizedName("bengaluru (yeshwanthpur)");
        bangaloreMarket.setDistrict("Bengaluru Urban");
        bangaloreMarket.setLatitude(BigDecimal.valueOf(13.0238));
        bangaloreMarket.setLongitude(BigDecimal.valueOf(77.5529));

        MarketPrice kolarPrice = new MarketPrice();
        kolarPrice.setId(UUID.randomUUID());
        kolarPrice.setCommodity(tomato);
        kolarPrice.setMarket(kolarMarket);
        kolarPrice.setModalPrice(BigDecimal.valueOf(2200));
        kolarPrice.setObservationDate(LocalDate.now());

        MarketPrice bangalorePrice = new MarketPrice();
        bangalorePrice.setId(UUID.randomUUID());
        bangalorePrice.setCommodity(tomato);
        bangalorePrice.setMarket(bangaloreMarket);
        bangalorePrice.setModalPrice(BigDecimal.valueOf(2600));
        bangalorePrice.setObservationDate(LocalDate.now());

        // Fast zero-dependency JDK reflection proxy
        commodityRepository = (CommodityRepository) Proxy.newProxyInstance(
                CommodityRepository.class.getClassLoader(),
                new Class<?>[]{CommodityRepository.class},
                (proxy, method, args) -> {
                    if (method.getName().equals("findByNormalizedName")) {
                        return Optional.of(tomato);
                    }
                    return null;
                }
        );

        marketPriceRepository = (MarketPriceRepository) Proxy.newProxyInstance(
                MarketPriceRepository.class.getClassLoader(),
                new Class<?>[]{MarketPriceRepository.class},
                (proxy, method, args) -> {
                    if (method.getName().contains("Commodity")) {
                        return List.of(bangalorePrice, kolarPrice);
                    }
                    return null;
                }
        );

        DistanceCalculator distanceCalculator = new DistanceCalculator();
        NetEarningsCalculator netEarningsCalculator = new NetEarningsCalculator();

        recommendationService = new RecommendationService(
                commodityRepository,
                marketPriceRepository,
                distanceCalculator,
                netEarningsCalculator
        );
    }

    @Test
    @DisplayName("getSupportedDistricts returns all 31 Karnataka districts")
    void testGetSupportedDistricts() {
        List<DistrictDto> districts = recommendationService.getSupportedDistricts();
        assertThat(districts).hasSizeGreaterThan(30);
        assertThat(districts).anyMatch(d -> d.getName().equalsIgnoreCase("Bengaluru Urban"));
        assertThat(districts).anyMatch(d -> d.getName().equalsIgnoreCase("Kolar"));
    }

    @Test
    @DisplayName("getSupportedVehicles returns available transport vehicle tiers")
    void testGetSupportedVehicles() {
        List<VehicleDto> vehicles = recommendationService.getSupportedVehicles();
        assertThat(vehicles).hasSize(3);
        assertThat(vehicles.get(0).getType()).isEqualTo(VehicleType.MINI_TRUCK);
        assertThat(vehicles.get(0).getDefaultCostPerKm()).isEqualByComparingTo(BigDecimal.valueOf(18.0));
    }

    @Test
    @DisplayName("compareAndRecommend evaluates and ranks candidate mandis by estimated net take-home")
    void testCompareAndRecommendSuccess() {
        RecommendationRequest request = new RecommendationRequest();
        request.setCommodityName("Tomato");
        request.setQuantityKg(BigDecimal.valueOf(1000));
        request.setOriginDistrict("Bengaluru Urban");
        request.setVehicleType(VehicleType.MINI_TRUCK);

        RecommendationResponse response = recommendationService.compareAndRecommend(request);

        assertThat(response).isNotNull();
        assertThat(response.getCommodityName()).isEqualTo("Tomato");
        assertThat(response.getQuantityKg()).isEqualByComparingTo(BigDecimal.valueOf(1000));
        assertThat(response.getTopRecommendation()).isNotNull();
        assertThat(response.getCandidateRankings()).hasSize(2);
        assertThat(response.getRecommendationRationale()).isNotEmpty();

        assertThat(response.getTopRecommendation().getRank()).isEqualTo(1);
        assertThat(response.getTopRecommendation().getBreakdown().getNetEarnings())
                .isGreaterThan(BigDecimal.ZERO);
    }
}
