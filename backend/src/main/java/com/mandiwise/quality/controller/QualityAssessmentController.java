package com.mandiwise.quality.controller;

import com.mandiwise.common.dto.ApiResponse;
import com.mandiwise.quality.dto.QualityAnalysisResponseDto;
import com.mandiwise.quality.dto.SupportedCropsResponseDto;
import com.mandiwise.quality.service.QualityAssessmentService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/quality")
public class QualityAssessmentController {

    private final QualityAssessmentService qualityAssessmentService;

    public QualityAssessmentController(QualityAssessmentService qualityAssessmentService) {
        this.qualityAssessmentService = qualityAssessmentService;
    }

    @PostMapping(value = "/analyze", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<QualityAnalysisResponseDto>> analyzeQuality(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "vegetableHint", required = false) String vegetableHint) {
        QualityAnalysisResponseDto result = qualityAssessmentService.analyzeQuality(file, vegetableHint);
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @GetMapping("/supported-crops")
    public ResponseEntity<ApiResponse<SupportedCropsResponseDto>> getSupportedCrops() {
        SupportedCropsResponseDto crops = qualityAssessmentService.getSupportedCrops();
        return ResponseEntity.ok(ApiResponse.success(crops));
    }

    @GetMapping("/status")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStatus() {
        Map<String, Object> status = qualityAssessmentService.getStatus();
        return ResponseEntity.ok(ApiResponse.success(status));
    }
}
