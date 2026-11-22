package com.mandiwise.recommendation.service;

import com.mandiwise.market.entity.Commodity;
import com.mandiwise.market.entity.Market;
import com.mandiwise.market.entity.MarketPrice;
import com.mandiwise.market.repository.CommodityRepository;
import com.mandiwise.market.repository.MarketPriceRepository;
import com.mandiwise.recommendation.dto.*;
import com.mandiwise.recommendation.model.DistrictLocation;
import com.mandiwise.recommendation.model.VehicleType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class RecommendationService {

    private static final Logger log = LoggerFactory.getLogger(RecommendationService.class);

    private final CommodityRepository commodityRepository;
    private final MarketPriceRepository marketPriceRepository;
    private final DistanceCalculator distanceCalculator;
    private final NetEarningsCalculator netEarningsCalculator;

    public RecommendationService(
            CommodityRepository commodityRepository,
            MarketPriceRepository marketPriceRepository,
            DistanceCalculator distanceCalculator,
            NetEarningsCalculator netEarningsCalculator
    ) {
        this.commodityRepository = commodityRepository;
        this.marketPriceRepository = marketPriceRepository;
        this.distanceCalculator = distanceCalculator;
        this.netEarningsCalculator = netEarningsCalculator;
    }

    public List<DistrictDto> getSupportedDistricts() {
        return DistrictLocation.getAllDistricts().stream()
                .map(d -> new DistrictDto(d.getDistrictName(), d.getLatitude(), d.getLongitude()))
                .collect(Collectors.toList());
    }

    public List<VehicleDto> getSupportedVehicles() {
        return Arrays.stream(VehicleType.values())
                .map(VehicleDto::new)
                .collect(Collectors.toList());
    }

    public RecommendationResponse compareAndRecommend(RecommendationRequest request) {
        BigDecimal quantityKg = (request.getQuantityKg() != null && request.getQuantityKg().compareTo(BigDecimal.ZERO) > 0)
                ? request.getQuantityKg()
                : BigDecimal.valueOf(1000.0);

        BigDecimal quantityQuintals = quantityKg.divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);

        VehicleType vehicleType = request.getVehicleType() != null
                ? request.getVehicleType()
                : VehicleType.recommendForWeight(quantityKg);

        Commodity commodity = resolveCommodity(request.getCommodityId(), request.getCommodityName());
        boolean isPerishable = commodity.getName().toLowerCase().contains("tomato");

        DistrictLocation origin = DistrictLocation.findByName(request.getOriginDistrict())
                .orElse(new DistrictLocation(request.getOriginDistrict() != null ? request.getOriginDistrict() : "Bengaluru Urban", 12.9716, 77.5946));

        List<MarketPrice> priceObservations = new ArrayList<>(marketPriceRepository.findByCommodityId(commodity.getId()));
        priceObservations.sort(Comparator.comparing(MarketPrice::getObservationDate, Comparator.nullsLast(Comparator.reverseOrder())));

        // Deduplicate: take latest observation per distinct APMC market
        Map<UUID, MarketPrice> latestByMarket = new LinkedHashMap<>();
        for (MarketPrice p : priceObservations) {
            if (p.getMarket() != null && !latestByMarket.containsKey(p.getMarket().getId())) {
                latestByMarket.put(p.getMarket().getId(), p);
            }
        }

        List<MandiCandidateDto> candidates = new ArrayList<>();
        for (MarketPrice price : latestByMarket.values()) {
            Market market = price.getMarket();

            BigDecimal marketLat = market.getLatitude();
            BigDecimal marketLon = market.getLongitude();
            if (marketLat == null || marketLon == null) {
                // fallback to market district centroid
                DistrictLocation distLoc = DistrictLocation.findByName(market.getDistrict())
                        .orElse(origin);
                marketLat = distLoc.getLatitude();
                marketLon = distLoc.getLongitude();
            }

            BigDecimal roadDistanceKm = distanceCalculator.calculateEstimatedRoadDistanceKm(
                    origin.getLatitude(),
                    origin.getLongitude(),
                    marketLat,
                    marketLon
            );

            CalculationBreakdown breakdown = netEarningsCalculator.calculate(
                    quantityKg,
                    price.getModalPrice(),
                    roadDistanceKm,
                    vehicleType,
                    request.getCustomCostPerKm(),
                    isPerishable
            );

            MandiCandidateDto candidate = new MandiCandidateDto();
            candidate.setMarketId(market.getId());
            candidate.setMarketName(market.getName());
            candidate.setDistrict(market.getDistrict());
            candidate.setState(market.getState());
            candidate.setLatitude(marketLat);
            candidate.setLongitude(marketLon);
            candidate.setModalPrice(price.getModalPrice());
            candidate.setMinPrice(price.getMinPrice());
            candidate.setMaxPrice(price.getMaxPrice());
            candidate.setPriceUnit(price.getPriceUnit());
            candidate.setObservationDate(price.getObservationDate());
            candidate.setFreshnessStatus(price.getFreshnessStatus() != null ? price.getFreshnessStatus().name() : "FRESH");
            candidate.setBreakdown(breakdown);

            candidates.add(candidate);
        }

        // Rank by estimated net earnings descending
        candidates.sort((a, b) -> {
            int cmp = b.getBreakdown().getNetEarnings().compareTo(a.getBreakdown().getNetEarnings());
            if (cmp != 0) {
                return cmp;
            }
            return a.getBreakdown().getRoadDistanceKm().compareTo(b.getBreakdown().getRoadDistanceKm());
        });

        // Find nearest market by road distance
        MandiCandidateDto nearest = candidates.stream()
                .min(Comparator.comparing(c -> c.getBreakdown().getRoadDistanceKm()))
                .orElse(null);

        if (nearest != null) {
            nearest.setNearestMarket(true);
        }

        MandiCandidateDto top = candidates.isEmpty() ? null : candidates.get(0);
        if (top != null) {
            top.setTopRecommendation(true);
        }

        for (int i = 0; i < candidates.size(); i++) {
            MandiCandidateDto c = candidates.get(i);
            c.setRank(i + 1);
            if (nearest != null) {
                BigDecimal diff = c.getBreakdown().getNetEarnings().subtract(nearest.getBreakdown().getNetEarnings());
                c.setNetAdvantageVsNearest(diff);
            } else {
                c.setNetAdvantageVsNearest(BigDecimal.ZERO);
            }
        }

        String rationale = buildRecommendationRationale(top, nearest, origin.getDistrictName(), commodity.getName());

        RecommendationResponse response = new RecommendationResponse();
        response.setCommodityName(commodity.getName());
        response.setQuantityKg(quantityKg);
        response.setQuantityQuintals(quantityQuintals);
        response.setOriginDistrict(origin.getDistrictName());
        response.setVehicleType(vehicleType);
        response.setVehicleDisplayName(vehicleType.getDisplayName());
        response.setTotalCandidatesEvaluated(candidates.size());
        response.setTopRecommendation(top);
        response.setNearestMarket(nearest);
        response.setCandidateRankings(candidates);
        response.setRecommendationRationale(rationale);

        return response;
    }

    private String buildRecommendationRationale(MandiCandidateDto top, MandiCandidateDto nearest, String originDistrict, String commodityName) {
        if (top == null) {
            return "No eligible mandi price observations found for " + commodityName + ".";
        }
        if (nearest == null || top.getMarketId().equals(nearest.getMarketId())) {
            return String.format(
                    "%s APMC is both your closest mandi (approx. %s km) and provides the optimal net take-home return of Rs. %s for your %s produce.",
                    top.getMarketName(),
                    top.getBreakdown().getRoadDistanceKm(),
                    top.getBreakdown().getNetEarnings(),
                    commodityName
            );
        }

        BigDecimal advantage = top.getBreakdown().getNetEarnings().subtract(nearest.getBreakdown().getNetEarnings());
        if (advantage.compareTo(BigDecimal.ZERO) > 0) {
            return String.format(
                    "%s APMC is recommended over your closest mandi (%s APMC, %s km) because its higher modal price of Rs. %s/quintal delivers Rs. %s more in net take-home earnings, even after deducting Rs. %s in additional transport costs.",
                    top.getMarketName(),
                    nearest.getMarketName(),
                    nearest.getBreakdown().getRoadDistanceKm(),
                    top.getModalPrice(),
                    advantage,
                    top.getBreakdown().getTransportCost().subtract(nearest.getBreakdown().getTransportCost())
            );
        } else {
            return String.format(
                    "%s APMC yields the maximum net take-home earnings of Rs. %s from %s.",
                    top.getMarketName(),
                    top.getBreakdown().getNetEarnings(),
                    originDistrict
            );
        }
    }

    private Commodity resolveCommodity(String commodityId, String commodityName) {
        if (commodityId != null && !commodityId.isBlank()) {
            try {
                Optional<Commodity> opt = commodityRepository.findById(UUID.fromString(commodityId));
                if (opt.isPresent()) return opt.get();
            } catch (Exception ignored) {}
        }
        if (commodityName != null && !commodityName.isBlank()) {
            Optional<Commodity> opt = commodityRepository.findByNormalizedName(commodityName.toLowerCase().trim());
            if (opt.isPresent()) return opt.get();
        }
        return commodityRepository.findByNormalizedName("tomato")
                .orElseGet(() -> commodityRepository.findAll().stream().findFirst()
                        .orElseThrow(() -> new IllegalStateException("No commodities found in database.")));
    }
}
