package com.mandiwise.common.controller;

import com.mandiwise.common.dto.ApiResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/health")
public class HealthController {

    private final Environment environment;

    @Value("${spring.application.name:mandiwise-backend}")
    private String applicationName;

    public HealthController(Environment environment) {
        this.environment = environment;
    }

    @GetMapping
    public ApiResponse<Map<String, Object>> getHealth() {
        Map<String, Object> status = new HashMap<>();
        status.put("application", applicationName);
        status.put("status", "UP");
        status.put("activeProfiles", environment.getActiveProfiles());
        status.put("timestamp", Instant.now().toString());
        status.put("version", "0.1.0-SNAPSHOT");
        status.put("phase", "Phase 1 - Environment & Supabase Setup");

        return ApiResponse.success("MandiWise primary backend is healthy", status);
    }
}
