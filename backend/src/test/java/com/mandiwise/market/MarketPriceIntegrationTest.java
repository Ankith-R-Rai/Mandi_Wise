package com.mandiwise.market;

import com.mandiwise.MandiWiseApplication;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(classes = MandiWiseApplication.class)
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class MarketPriceIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @DisplayName("GET /api/v1/market/commodities returns active commodities")
    void testGetCommodities() throws Exception {
        mockMvc.perform(get("/api/v1/market/commodities")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data", hasSize(greaterThanOrEqualTo(1))))
                .andExpect(jsonPath("$.data[0].name", notNullValue()));
    }

    @Test
    @DisplayName("GET /api/v1/market/mandis returns APMC markets")
    void testGetMandis() throws Exception {
        mockMvc.perform(get("/api/v1/market/mandis")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data", hasSize(greaterThanOrEqualTo(1))))
                .andExpect(jsonPath("$.data[0].district", notNullValue()));
    }

    @Test
    @DisplayName("GET /api/v1/market/districts returns list of Karnataka districts")
    void testGetDistricts() throws Exception {
        mockMvc.perform(get("/api/v1/market/districts")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data", hasSize(greaterThanOrEqualTo(1))));
    }

    @Test
    @DisplayName("GET /api/v1/market/prices with filters returns matched prices")
    void testGetPricesWithFilter() throws Exception {
        mockMvc.perform(get("/api/v1/market/prices")
                        .param("commodity", "Tomato")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data", hasSize(greaterThanOrEqualTo(1))))
                .andExpect(jsonPath("$.data[0].modalPrice", notNullValue()))
                .andExpect(jsonPath("$.data[0].priceUnit", is("INR_PER_QUINTAL")));
    }

    @Test
    @DisplayName("GET /api/v1/market/summary returns aggregate market statistics")
    void testGetSummary() throws Exception {
        mockMvc.perform(get("/api/v1/market/summary")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.totalCommodities", greaterThanOrEqualTo(1)))
                .andExpect(jsonPath("$.data.totalMarkets", greaterThanOrEqualTo(1)))
                .andExpect(jsonPath("$.data.totalObservations", greaterThanOrEqualTo(1)));
    }
}
