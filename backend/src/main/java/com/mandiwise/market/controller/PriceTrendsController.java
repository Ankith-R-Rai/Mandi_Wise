package com.mandiwise.market.controller;

import com.mandiwise.common.dto.ApiResponse;
import com.mandiwise.market.dto.PriceTrendResponseDto;
import com.mandiwise.market.dto.PriceTrendStatsDto;
import com.mandiwise.market.service.PriceTrendsService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/market/trends")
public class PriceTrendsController {

    private final PriceTrendsService priceTrendsService;

    public PriceTrendsController(PriceTrendsService priceTrendsService) {
        this.priceTrendsService = priceTrendsService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PriceTrendResponseDto>> getHistoricalTrends(
            @RequestParam(required = false, defaultValue = "Tomato") String commodity,
            @RequestParam(required = false) List<String> markets,
            @RequestParam(required = false, defaultValue = "30d") String range,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        PriceTrendResponseDto response = priceTrendsService.getHistoricalTrends(commodity, markets, range, startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success("Historical price trends retrieved successfully", response));
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<Map<String, PriceTrendStatsDto>>> getTrendStats(
            @RequestParam(required = false, defaultValue = "Tomato") String commodity,
            @RequestParam(required = false) List<String> markets,
            @RequestParam(required = false, defaultValue = "30d") String range,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        PriceTrendResponseDto response = priceTrendsService.getHistoricalTrends(commodity, markets, range, startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success("Price trend statistics retrieved successfully", response.getStats()));
    }
}
