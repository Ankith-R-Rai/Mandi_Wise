package com.mandiwise.market.controller;

import com.mandiwise.common.dto.ApiResponse;
import com.mandiwise.market.dto.MarketTrendSeriesDto;
import com.mandiwise.market.dto.PriceTrendResponseDto;
import com.mandiwise.market.dto.PriceTrendStatsDto;
import com.mandiwise.market.service.PriceTrendsService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseEntity;

import java.lang.reflect.Proxy;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

class PriceTrendsControllerTest {

    private PriceTrendsService priceTrendsService;
    private PriceTrendsController controller;

    @BeforeEach
    void setUp() {
        PriceTrendResponseDto mockDto = new PriceTrendResponseDto();
        mockDto.setCommodityId(UUID.randomUUID());
        mockDto.setCommodityName("Tomato");
        mockDto.setStartDate(LocalDate.of(2026, 10, 15));
        mockDto.setEndDate(LocalDate.of(2026, 11, 14));

        MarketTrendSeriesDto series = new MarketTrendSeriesDto(
                UUID.randomUUID(),
                "Kolar",
                "Kolar",
                List.of()
        );
        mockDto.setSeries(List.of(series));

        PriceTrendStatsDto stats = new PriceTrendStatsDto(
                BigDecimal.valueOf(2550),
                BigDecimal.valueOf(2600),
                BigDecimal.valueOf(2000),
                BigDecimal.valueOf(2300),
                BigDecimal.valueOf(15.5),
                10
        );
        mockDto.setStats(Map.of("Kolar", stats));

        PriceTrendsService directService = new PriceTrendsService(null, null, null) {
            @Override
            public PriceTrendResponseDto getHistoricalTrends(String c, List<String> m, String r, LocalDate s, LocalDate e) {
                return mockDto;
            }
        };

        controller = new PriceTrendsController(directService);
    }

    @Test
    @DisplayName("getHistoricalTrends returns success with trend series data")
    void testGetHistoricalTrends() {
        ResponseEntity<ApiResponse<PriceTrendResponseDto>> response = controller.getHistoricalTrends(
                "Tomato",
                List.of("Kolar"),
                "30d",
                null,
                null
        );

        assertThat(response.getStatusCode().is2xxSuccessful()).isTrue();
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().isSuccess()).isTrue();
        assertThat(response.getBody().getData().getCommodityName()).isEqualTo("Tomato");
        assertThat(response.getBody().getData().getSeries()).hasSize(1);
    }

    @Test
    @DisplayName("getTrendStats returns success with stats map")
    void testGetTrendStats() {
        ResponseEntity<ApiResponse<Map<String, PriceTrendStatsDto>>> response = controller.getTrendStats(
                "Tomato",
                List.of("Kolar"),
                "30d",
                null,
                null
        );

        assertThat(response.getStatusCode().is2xxSuccessful()).isTrue();
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().isSuccess()).isTrue();
        assertThat(response.getBody().getData()).containsKey("Kolar");
        assertThat(response.getBody().getData().get("Kolar").getLatestModalPrice())
                .isEqualByComparingTo(BigDecimal.valueOf(2550));
    }
}
