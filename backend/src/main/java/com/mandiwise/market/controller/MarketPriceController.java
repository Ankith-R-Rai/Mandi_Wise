package com.mandiwise.market.controller;

import com.mandiwise.common.dto.ApiResponse;
import com.mandiwise.market.dto.CommodityResponse;
import com.mandiwise.market.dto.MarketPriceResponse;
import com.mandiwise.market.dto.MarketResponse;
import com.mandiwise.market.dto.MarketSummaryResponse;
import com.mandiwise.market.service.MarketPriceService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/market")
public class MarketPriceController {

    private final MarketPriceService marketPriceService;

    public MarketPriceController(MarketPriceService marketPriceService) {
        this.marketPriceService = marketPriceService;
    }

    @GetMapping("/commodities")
    public ResponseEntity<ApiResponse<List<CommodityResponse>>> getCommodities() {
        List<CommodityResponse> commodities = marketPriceService.getActiveCommodities();
        return ResponseEntity.ok(ApiResponse.success("Commodities retrieved successfully", commodities));
    }

    @GetMapping("/mandis")
    public ResponseEntity<ApiResponse<List<MarketResponse>>> getMandis(
            @RequestParam(required = false) String district) {
        List<MarketResponse> mandis = marketPriceService.getMarkets(district);
        return ResponseEntity.ok(ApiResponse.success("Mandis retrieved successfully", mandis));
    }

    @GetMapping("/districts")
    public ResponseEntity<ApiResponse<List<String>>> getDistricts() {
        List<String> districts = marketPriceService.getDistricts();
        return ResponseEntity.ok(ApiResponse.success("Districts retrieved successfully", districts));
    }

    @GetMapping("/prices")
    public ResponseEntity<ApiResponse<List<MarketPriceResponse>>> getPrices(
            @RequestParam(required = false) String commodity,
            @RequestParam(required = false) String district,
            @RequestParam(required = false) String mandi,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) String freshness) {
        List<MarketPriceResponse> prices = marketPriceService.getMarketPrices(commodity, district, mandi, date, freshness);
        return ResponseEntity.ok(ApiResponse.success("Market prices retrieved successfully", prices));
    }

    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<MarketSummaryResponse>> getSummary() {
        MarketSummaryResponse summary = marketPriceService.getSummary();
        return ResponseEntity.ok(ApiResponse.success("Market summary retrieved successfully", summary));
    }
}
