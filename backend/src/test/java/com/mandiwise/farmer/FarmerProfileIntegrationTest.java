package com.mandiwise.farmer;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mandiwise.MandiWiseApplication;
import com.mandiwise.auth.dto.RegisterRequest;
import com.mandiwise.farmer.dto.FarmRequest;
import com.mandiwise.farmer.dto.FarmerProfileRequest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(classes = MandiWiseApplication.class)
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class FarmerProfileIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("Farmer profile and farm management lifecycle")
    void testFarmerProfileAndFarmLifecycle() throws Exception {
        // 1. Register a new farmer
        RegisterRequest register = new RegisterRequest("suresh@kolar.org", "SecurePassword123!", "Suresh Kumar");
        register.setDistrict("Kolar");
        register.setRole("ROLE_FARMER");

        MvcResult registerResult = mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(register)))
                .andExpect(status().isCreated())
                .andReturn();

        JsonNode root = objectMapper.readTree(registerResult.getResponse().getContentAsString());
        String token = root.path("data").path("token").asText();

        // 2. Retrieve profile
        mockMvc.perform(get("/api/v1/farmers/profile")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.fullName", is("Suresh Kumar")))
                .andExpect(jsonPath("$.data.district", is("Kolar")));

        // 3. Update profile
        FarmerProfileRequest updateRequest = new FarmerProfileRequest();
        updateRequest.setDistrict("Kolar");
        updateRequest.setTaluk("Srinivaspur");
        updateRequest.setPreferredLanguage("KN");
        updateRequest.setPhoneNumber("+919988776655");

        mockMvc.perform(put("/api/v1/farmers/profile")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.taluk", is("Srinivaspur")))
                .andExpect(jsonPath("$.data.preferredLanguage", is("KN")))
                .andExpect(jsonPath("$.data.phoneNumber", is("+919988776655")));

        // 4. Add farm
        FarmRequest farmRequest = new FarmRequest();
        farmRequest.setFarmName("Kolar Mango & Tomato Grove");
        farmRequest.setDistrict("Kolar");
        farmRequest.setTaluk("Srinivaspur");
        farmRequest.setLandArea(new BigDecimal("4.50"));
        farmRequest.setLandAreaUnit("ACRES");
        farmRequest.setLatitude(new BigDecimal("13.3380"));
        farmRequest.setLongitude(new BigDecimal("78.2140"));

        mockMvc.perform(post("/api/v1/farmers/farms")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(farmRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.farmName", is("Kolar Mango & Tomato Grove")))
                .andExpect(jsonPath("$.data.district", is("Kolar")))
                .andExpect(jsonPath("$.data.landArea", is(4.5)));

        // 5. Get farms list
        mockMvc.perform(get("/api/v1/farmers/farms")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data", hasSize(1)))
                .andExpect(jsonPath("$.data[0].farmName", is("Kolar Mango & Tomato Grove")));

        // 6. Reject unauthenticated access
        mockMvc.perform(get("/api/v1/farmers/profile"))
                .andExpect(status().isForbidden());
    }
}
