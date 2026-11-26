package com.mandiwise.quality;

import com.mandiwise.MandiWiseApplication;
import com.mandiwise.quality.dto.*;
import com.mandiwise.quality.exception.VisionServiceUnavailableException;
import com.mandiwise.quality.service.QualityAssessmentService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;
import java.util.List;
import java.util.Map;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(classes = MandiWiseApplication.class)
@AutoConfigureMockMvc
@ActiveProfiles("test")
class QualityAssessmentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private QualityAssessmentService qualityAssessmentService;

    @Test
    @DisplayName("POST /api/v1/quality/analyze returns grading result when service is available")
    void analyze_returnsGradingResult_whenServiceIsOnline() throws Exception {
        QualityAnalysisResponseDto mockResponse = new QualityAnalysisResponseDto();

        QualityAnalysisResponseDto.IdentificationDto ident = new QualityAnalysisResponseDto.IdentificationDto();
        ident.setPredictedVegetable("Tomato");
        ident.setSupported(true);
        ident.setConfidence(0.95);
        ident.setModelVersion("v1.0.0");
        ident.setModelStatus("PROD");
        mockResponse.setIdentification(ident);

        QualityAnalysisResponseDto.GradingDto grading = new QualityAnalysisResponseDto.GradingDto();
        grading.setGrade("Grade A");
        grading.setGradeBasis("AGMARK Visual Inspection");
        grading.setConfidence(0.92);
        grading.setExplanation("Excellent firmness and uniform red color.");
        grading.setAgmarkDisclaimer("Advisory standard only.");
        mockResponse.setGrading(grading);

        QualityAnalysisResponseDto.QualityDetailsDto quality = new QualityAnalysisResponseDto.QualityDetailsDto();
        quality.setFreshnessClassification("FRESH");
        quality.setMaturityStage("RIPE");
        mockResponse.setQuality(quality);

        when(qualityAssessmentService.analyzeQuality(any(), eq("Tomato"))).thenReturn(mockResponse);

        MockMultipartFile file = new MockMultipartFile("file", "tomato.jpg", MediaType.IMAGE_JPEG_VALUE, new byte[]{1, 2, 3});

        mockMvc.perform(multipart("/api/v1/quality/analyze")
                        .file(file)
                        .param("vegetableHint", "Tomato"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.identification.predicted_vegetable", is("Tomato")))
                .andExpect(jsonPath("$.data.grading.grade", is("Grade A")))
                .andExpect(jsonPath("$.data.quality.freshness_classification", is("FRESH")));
    }

    @Test
    @DisplayName("POST /api/v1/quality/analyze returns 503 when python-service is unavailable")
    void analyze_returns503_whenServiceIsOffline() throws Exception {
        when(qualityAssessmentService.analyzeQuality(any(), any()))
                .thenThrow(new VisionServiceUnavailableException("Vision microservice unreachable"));

        MockMultipartFile file = new MockMultipartFile("file", "tomato.jpg", MediaType.IMAGE_JPEG_VALUE, new byte[]{1, 2, 3});

        mockMvc.perform(multipart("/api/v1/quality/analyze")
                        .file(file))
                .andExpect(status().isServiceUnavailable())
                .andExpect(jsonPath("$.success", is(false)))
                .andExpect(jsonPath("$.errorCode", is("VISION_SERVICE_UNAVAILABLE")))
                .andExpect(jsonPath("$.message", containsString("Vision microservice unreachable")));
    }

    @Test
    @DisplayName("GET /api/v1/quality/supported-crops returns supported crops")
    void getSupportedCrops_returnsCrops() throws Exception {
        SupportedCropsResponseDto dto = new SupportedCropsResponseDto();
        SupportedCropsResponseDto.SupportedCropDto crop = new SupportedCropsResponseDto.SupportedCropDto();
        crop.setName("Tomato");
        crop.setAgmarknetAliases(List.of("Tomato"));
        crop.setAgmarkVisualNote("Firm and uniform.");
        dto.setSupportedVegetables(List.of(crop));
        dto.setCount(1);

        when(qualityAssessmentService.getSupportedCrops()).thenReturn(dto);

        mockMvc.perform(get("/api/v1/quality/supported-crops"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.count", is(1)))
                .andExpect(jsonPath("$.data.supported_vegetables[0].name", is("Tomato")));
    }

    @Test
    @DisplayName("GET /api/v1/quality/status returns service status")
    void getStatus_returnsStatus() throws Exception {
        when(qualityAssessmentService.getStatus()).thenReturn(Map.of("status", "UP", "service", "agrivision-vision-service"));

        mockMvc.perform(get("/api/v1/quality/status"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.status", is("UP")));
    }
}
