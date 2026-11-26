package com.mandiwise.recommendation.service;

import com.mandiwise.market.entity.Commodity;
import com.mandiwise.market.entity.Market;
import com.mandiwise.market.entity.MarketPrice;
import com.mandiwise.market.repository.CommodityRepository;
import com.mandiwise.market.repository.MarketPriceRepository;
import com.mandiwise.recommendation.dto.DistrictDto;
import com.mandiwise.recommendation.dto.MandiCandidateDto;
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
        kolarPrice.setModalPrice(BigDecimal.valueOf(2550));
        kolarPrice.setObservationDate(LocalDate.now());

        MarketPrice bangalorePrice = new MarketPrice();
        bangalorePrice.setId(UUID.randomUUID());
        bangalorePrice.setCommodity(tomato);
        bangalorePrice.setMarket(bangaloreMarket);
        bangalorePrice.setModalPrice(BigDecimal.valueOf(2400));
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

    @Test
    @DisplayName("Scenario 1: Local mandi wins when near and competitive (Kolar farmer with Tomato)")
    void testScenario1_LocalWinsWhenNear() {
        RecommendationRequest request = new RecommendationRequest();
        request.setCommodityName("Tomato");
        request.setOriginDistrict("Kolar");
        request.setQuantityKg(BigDecimal.valueOf(1500)); // 15 quintals
        request.setVehicleType(VehicleType.MINI_TRUCK);

        RecommendationResponse response = recommendationService.compareAndRecommend(request);

        assertThat(response.getTopRecommendation()).isNotNull();
        assertThat(response.getTopRecommendation().getMarketName()).isEqualTo("Kolar");
        assertThat(response.getTopRecommendation().isTopRecommendation()).isTrue();
        // Bengaluru is further and has lower net take-home
        assertThat(response.getCandidateRankings().get(1).getMarketName()).isEqualTo("Bengaluru (Yeshwanthpur)");
        assertThat(response.getTopRecommendation().getBreakdown().getNetEarnings())
                .isGreaterThan(response.getCandidateRankings().get(1).getBreakdown().getNetEarnings());
    }

    @Test
    @DisplayName("Scenario 2: Distant mandi wins when high price premium overcomes freight on bulk volume (Mysuru farmer with Onion)")
    void testScenario2_DistantWinsWhenPricePremiumExceedsTransport() {
        Commodity onion = new Commodity();
        onion.setId(UUID.randomUUID());
        onion.setName("Onion");
        onion.setNormalizedName("onion");

        Market mysuruMarket = new Market();
        mysuruMarket.setId(UUID.randomUUID());
        mysuruMarket.setName("Mysuru (Bandipalya)");
        mysuruMarket.setNormalizedName("mysuru (bandipalya)");
        mysuruMarket.setDistrict("Mysuru");
        mysuruMarket.setLatitude(BigDecimal.valueOf(12.2814));
        mysuruMarket.setLongitude(BigDecimal.valueOf(76.6780));

        MarketPrice mysuruPrice = new MarketPrice();
        mysuruPrice.setId(UUID.randomUUID());
        mysuruPrice.setCommodity(onion);
        mysuruPrice.setMarket(mysuruMarket);
        mysuruPrice.setModalPrice(BigDecimal.valueOf(2600)); // Local price: Rs. 2,600
        mysuruPrice.setObservationDate(LocalDate.now());

        MarketPrice bangalorePrice = new MarketPrice();
        bangalorePrice.setId(UUID.randomUUID());
        bangalorePrice.setCommodity(onion);
        bangalorePrice.setMarket(bangaloreMarket);
        bangalorePrice.setModalPrice(BigDecimal.valueOf(2800)); // Distant price: Rs. 2,800 (+200/q premium)
        bangalorePrice.setObservationDate(LocalDate.now());

        RecommendationService onionService = buildCustomService(onion, List.of(mysuruPrice, bangalorePrice));

        // Farmer with bulk load of 6,000 kg (60 quintals) in a Medium Truck
        RecommendationRequest bulkRequest = new RecommendationRequest();
        bulkRequest.setCommodityName("Onion");
        bulkRequest.setOriginDistrict("Mysuru");
        bulkRequest.setQuantityKg(BigDecimal.valueOf(6000));
        bulkRequest.setVehicleType(VehicleType.MEDIUM_TRUCK);

        RecommendationResponse bulkResponse = onionService.compareAndRecommend(bulkRequest);

        // Distant Bengaluru wins because 60 quintals * Rs. 200 = Rs. 12,000 gross gain, easily exceeding Rs. ~5,900 freight!
        assertThat(bulkResponse.getTopRecommendation().getMarketName()).isEqualTo("Bengaluru (Yeshwanthpur)");
        assertThat(bulkResponse.getTopRecommendation().getNetAdvantageVsNearest()).isGreaterThan(BigDecimal.valueOf(5000));
    }

    @Test
    @DisplayName("Scenario 3: Dynamic Volume Threshold (Same markets, but small load favors Local, bulk load favors Distant)")
    void testScenario3_VolumeThreshold_SmallLoadFavorsLocal_BulkLoadFavorsDistant() {
        Commodity onion = new Commodity();
        onion.setId(UUID.randomUUID());
        onion.setName("Onion");
        onion.setNormalizedName("onion");

        Market mysuruMarket = new Market();
        mysuruMarket.setId(UUID.randomUUID());
        mysuruMarket.setName("Mysuru (Bandipalya)");
        mysuruMarket.setNormalizedName("mysuru (bandipalya)");
        mysuruMarket.setDistrict("Mysuru");
        mysuruMarket.setLatitude(BigDecimal.valueOf(12.2814));
        mysuruMarket.setLongitude(BigDecimal.valueOf(76.6780));

        MarketPrice mysuruPrice = new MarketPrice();
        mysuruPrice.setId(UUID.randomUUID());
        mysuruPrice.setCommodity(onion);
        mysuruPrice.setMarket(mysuruMarket);
        mysuruPrice.setModalPrice(BigDecimal.valueOf(2600)); // Rs. 2,600
        mysuruPrice.setObservationDate(LocalDate.now());

        MarketPrice bangalorePrice = new MarketPrice();
        bangalorePrice.setId(UUID.randomUUID());
        bangalorePrice.setCommodity(onion);
        bangalorePrice.setMarket(bangaloreMarket);
        bangalorePrice.setModalPrice(BigDecimal.valueOf(2800)); // Rs. 2,800
        bangalorePrice.setObservationDate(LocalDate.now());

        RecommendationService onionService = buildCustomService(onion, List.of(mysuruPrice, bangalorePrice));

        // Part A: Small load (10 quintals / 1,000 kg) -> Transport to Bengaluru wipes out the Rs. 2,000 gross premium -> LOCAL WINS
        RecommendationRequest smallRequest = new RecommendationRequest();
        smallRequest.setCommodityName("Onion");
        smallRequest.setOriginDistrict("Mysuru");
        smallRequest.setQuantityKg(BigDecimal.valueOf(1000));
        smallRequest.setVehicleType(VehicleType.MINI_TRUCK);

        RecommendationResponse smallResponse = onionService.compareAndRecommend(smallRequest);
        assertThat(smallResponse.getTopRecommendation().getMarketName()).isEqualTo("Mysuru (Bandipalya)");

        // Part B: Bulk load (60 quintals / 6,000 kg) -> Rs. 12,000 gross premium exceeds truck freight -> DISTANT WINS
        RecommendationRequest bulkRequest = new RecommendationRequest();
        bulkRequest.setCommodityName("Onion");
        bulkRequest.setOriginDistrict("Mysuru");
        bulkRequest.setQuantityKg(BigDecimal.valueOf(6000));
        bulkRequest.setVehicleType(VehicleType.MEDIUM_TRUCK);

        RecommendationResponse bulkResponse = onionService.compareAndRecommend(bulkRequest);
        assertThat(bulkResponse.getTopRecommendation().getMarketName()).isEqualTo("Bengaluru (Yeshwanthpur)");
    }

    @Test
    void calculateRecommendation_withGradeA_usesMaxPriceForRevenue() {
        MarketPrice priceWithBand = new MarketPrice();
        priceWithBand.setId(UUID.randomUUID());
        priceWithBand.setCommodity(tomato);
        priceWithBand.setMarket(kolarMarket);
        priceWithBand.setMinPrice(BigDecimal.valueOf(1800));
        priceWithBand.setModalPrice(BigDecimal.valueOf(2200));
        priceWithBand.setMaxPrice(BigDecimal.valueOf(2600));
        priceWithBand.setObservationDate(LocalDate.now());

        RecommendationService service = buildCustomService(tomato, List.of(priceWithBand));

        RecommendationRequest request = new RecommendationRequest("Tomato", BigDecimal.valueOf(1000), "Kolar");
        request.setGrade("Grade A");

        RecommendationResponse response = service.compareAndRecommend(request);
        assertThat(response).isNotNull();
        MandiCandidateDto candidate = response.getCandidateRankings().get(0);
        // 1000 kg = 10 quintals. At Grade A max price 2600/q -> gross revenue = 26,000
        assertThat(candidate.getBreakdown().getGrossRevenue().intValue()).isEqualTo(26000);
    }

    @Test
    void calculateRecommendation_withGradeC_usesMinPriceForRevenue() {
        MarketPrice priceWithBand = new MarketPrice();
        priceWithBand.setId(UUID.randomUUID());
        priceWithBand.setCommodity(tomato);
        priceWithBand.setMarket(kolarMarket);
        priceWithBand.setMinPrice(BigDecimal.valueOf(1800));
        priceWithBand.setModalPrice(BigDecimal.valueOf(2200));
        priceWithBand.setMaxPrice(BigDecimal.valueOf(2600));
        priceWithBand.setObservationDate(LocalDate.now());

        RecommendationService service = buildCustomService(tomato, List.of(priceWithBand));

        RecommendationRequest request = new RecommendationRequest("Tomato", BigDecimal.valueOf(1000), "Kolar");
        request.setGrade("Grade C");

        RecommendationResponse response = service.compareAndRecommend(request);
        assertThat(response).isNotNull();
        MandiCandidateDto candidate = response.getCandidateRankings().get(0);
        // 1000 kg = 10 quintals. At Grade C min price 1800/q -> gross revenue = 18,000
        assertThat(candidate.getBreakdown().getGrossRevenue().intValue()).isEqualTo(18000);
    }

    @Test
    void calculateRecommendation_withNullGrade_maintainsBackwardCompatibility() {
        MarketPrice priceWithBand = new MarketPrice();
        priceWithBand.setId(UUID.randomUUID());
        priceWithBand.setCommodity(tomato);
        priceWithBand.setMarket(kolarMarket);
        priceWithBand.setMinPrice(BigDecimal.valueOf(1800));
        priceWithBand.setModalPrice(BigDecimal.valueOf(2200));
        priceWithBand.setMaxPrice(BigDecimal.valueOf(2600));
        priceWithBand.setObservationDate(LocalDate.now());

        RecommendationService service = buildCustomService(tomato, List.of(priceWithBand));

        RecommendationRequest request = new RecommendationRequest("Tomato", BigDecimal.valueOf(1000), "Kolar");
        // Grade is null -> default to modal price 2200/q -> gross revenue = 22,000
        RecommendationResponse response = service.compareAndRecommend(request);
        assertThat(response).isNotNull();
        MandiCandidateDto candidate = response.getCandidateRankings().get(0);
        assertThat(candidate.getBreakdown().getGrossRevenue().intValue()).isEqualTo(22000);
    }

    private RecommendationService buildCustomService(Commodity commodity, List<MarketPrice> prices) {
        CommodityRepository cRepo = (CommodityRepository) Proxy.newProxyInstance(
                CommodityRepository.class.getClassLoader(),
                new Class<?>[]{CommodityRepository.class},
                (proxy, method, args) -> {
                    if (method.getName().equals("findByNormalizedName")) {
                        return Optional.of(commodity);
                    }
                    return null;
                }
        );

        MarketPriceRepository pRepo = (MarketPriceRepository) Proxy.newProxyInstance(
                MarketPriceRepository.class.getClassLoader(),
                new Class<?>[]{MarketPriceRepository.class},
                (proxy, method, args) -> {
                    if (method.getName().contains("Commodity")) {
                        return prices;
                    }
                    return null;
                }
        );

        return new RecommendationService(cRepo, pRepo, new DistanceCalculator(), new NetEarningsCalculator());
    }
}
