package com.mandiwise.auth;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mandiwise.MandiWiseApplication;
import com.mandiwise.auth.dto.LoginRequest;
import com.mandiwise.auth.dto.RegisterRequest;
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

import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(classes = MandiWiseApplication.class)
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class AuthControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("Registration, Login, and Me Endpoint End-to-End Lifecycle")
    void testAuthLifecycle() throws Exception {
        RegisterRequest registerRequest = new RegisterRequest("basavaraj@mysuru.in", "Password123!", "Basavaraj Bommai");
        registerRequest.setDistrict("Mysuru");
        registerRequest.setTaluk("Nanjangud");
        registerRequest.setPhoneNumber("+919876543210");

        // 1. Register new user
        MvcResult registerResult = mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.token", notNullValue()))
                .andExpect(jsonPath("$.data.email", is("basavaraj@mysuru.in")))
                .andExpect(jsonPath("$.data.fullName", is("Basavaraj Bommai")))
                .andExpect(jsonPath("$.data.district", is("Mysuru")))
                .andReturn();

        // 2. Reject duplicate registration with 409 Conflict
        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.success", is(false)))
                .andExpect(jsonPath("$.errorCode", is("EMAIL_ALREADY_EXISTS")));

        // 3. Login with correct credentials
        LoginRequest loginRequest = new LoginRequest("basavaraj@mysuru.in", "Password123!");
        MvcResult loginResult = mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.token", notNullValue()))
                .andExpect(jsonPath("$.data.email", is("basavaraj@mysuru.in")))
                .andReturn();

        String responseBody = loginResult.getResponse().getContentAsString();
        JsonNode root = objectMapper.readTree(responseBody);
        String jwtToken = root.path("data").path("token").asText();

        // 4. Reject login with invalid password
        LoginRequest badLogin = new LoginRequest("basavaraj@mysuru.in", "WrongPassword!");
        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(badLogin)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success", is(false)));

        // 5. Access /api/v1/auth/me with Bearer token
        mockMvc.perform(get("/api/v1/auth/me")
                        .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.email", is("basavaraj@mysuru.in")))
                .andExpect(jsonPath("$.data.fullName", is("Basavaraj Bommai")));

        // 6. Access /api/v1/auth/me without Bearer token -> rejected
        mockMvc.perform(get("/api/v1/auth/me"))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Should validate required registration fields")
    void testRegisterValidation() throws Exception {
        RegisterRequest invalid = new RegisterRequest("", "short", "");

        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalid)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success", is(false)))
                .andExpect(jsonPath("$.errorCode", is("VALIDATION_ERROR")));
    }
}
