package com.mandiwise.quality.service;

import com.mandiwise.quality.dto.QualityAnalysisResponseDto;
import com.mandiwise.quality.dto.SupportedCropsResponseDto;
import com.mandiwise.quality.exception.VisionServiceUnavailableException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.MediaType;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

@Service
public class QualityAssessmentService {

    private static final Logger log = LoggerFactory.getLogger(QualityAssessmentService.class);

    private final RestClient restClient;

    public QualityAssessmentService(@Value("${mandiwise.python-service.url:http://localhost:8000}") String pythonServiceUrl) {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(Duration.ofSeconds(5));
        factory.setReadTimeout(Duration.ofSeconds(10));

        this.restClient = RestClient.builder()
                .baseUrl(pythonServiceUrl)
                .requestFactory(factory)
                .build();
    }

    public QualityAnalysisResponseDto analyzeQuality(MultipartFile file, String vegetableHint) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Image file cannot be empty");
        }

        try {
            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            ByteArrayResource resource = new ByteArrayResource(file.getBytes()) {
                @Override
                public String getFilename() {
                    return file.getOriginalFilename() != null ? file.getOriginalFilename() : "upload.jpg";
                }
            };
            body.add("file", resource);
            if (vegetableHint != null && !vegetableHint.isBlank()) {
                body.add("vegetable_hint", vegetableHint.trim());
            }

            return restClient.post()
                    .uri("/api/analyze")
                    .contentType(MediaType.MULTIPART_FORM_DATA)
                    .body(body)
                    .retrieve()
                    .body(QualityAnalysisResponseDto.class);
        } catch (IOException e) {
            log.error("Failed to read image bytes: {}", e.getMessage());
            throw new IllegalArgumentException("Unable to read image file", e);
        } catch (Exception e) {
            log.error("Failed to invoke Python vision microservice /api/analyze: {}", e.getMessage());
            throw new VisionServiceUnavailableException("Vision service currently unavailable: " + e.getMessage(), e);
        }
    }

    public SupportedCropsResponseDto getSupportedCrops() {
        try {
            return restClient.get()
                    .uri("/api/crops")
                    .retrieve()
                    .body(SupportedCropsResponseDto.class);
        } catch (Exception e) {
            log.error("Failed to invoke Python vision microservice /api/crops: {}", e.getMessage());
            throw new VisionServiceUnavailableException("Vision service currently unavailable: " + e.getMessage(), e);
        }
    }

    public Map<String, Object> getStatus() {
        try {
            @SuppressWarnings("unchecked")
            Map<String, Object> res = restClient.get()
                    .uri("/api/status")
                    .retrieve()
                    .body(Map.class);
            return res != null ? res : Map.of("status", "UP");
        } catch (Exception e) {
            log.warn("Python vision microservice is unreachable: {}", e.getMessage());
            Map<String, Object> fallback = new HashMap<>();
            fallback.put("status", "DOWN");
            fallback.put("service", "agrivision-vision-service");
            fallback.put("error", "Vision microservice is unreachable");
            return fallback;
        }
    }
}
