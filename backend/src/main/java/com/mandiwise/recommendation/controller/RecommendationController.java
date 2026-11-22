package com.mandiwise.recommendation.controller;

import com.mandiwise.recommendation.dto.DistrictDto;
import com.mandiwise.recommendation.dto.RecommendationRequest;
import com.mandiwise.recommendation.dto.RecommendationResponse;
import com.mandiwise.recommendation.dto.VehicleDto;
import com.mandiwise.recommendation.service.RecommendationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/recommendations")
public class RecommendationController {

    private final RecommendationService recommendationService;

    public RecommendationController(RecommendationService recommendationService) {
        this.recommendationService = recommendationService;
    }

    @GetMapping("/districts")
    public ResponseEntity<List<DistrictDto>> getSupportedDistricts() {
        return ResponseEntity.ok(recommendationService.getSupportedDistricts());
    }

    @GetMapping("/vehicles")
    public ResponseEntity<List<VehicleDto>> getSupportedVehicles() {
        return ResponseEntity.ok(recommendationService.getSupportedVehicles());
    }

    @PostMapping("/compare")
    public ResponseEntity<RecommendationResponse> compareAndRecommend(
            @Valid @RequestBody RecommendationRequest request
    ) {
        RecommendationResponse response = recommendationService.compareAndRecommend(request);
        return ResponseEntity.ok(response);
    }
}
