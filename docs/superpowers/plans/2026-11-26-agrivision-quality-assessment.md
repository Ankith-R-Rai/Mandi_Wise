# Phase 8: AgriVision Quality Assessment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrate the multi-crop computer vision quality assessment engine (Tomato, Potato, Onion, Brinjal, Green Chilli) from `feature/agrivision-ai` into a dedicated Python microservice, expose it via a Spring Boot API gateway with Grade-tiered recommendation pricing (Option B), and deliver a Misty Ghats React + TypeScript UI with photo defect overlays and one-click transition to Mandi Recommendations.

**Architecture:** Python FastAPI microservice on port 8000 handling OpenCV surface inspection and MobileNetV2/YOLOv8 inferences; Spring Boot 3.3.5 on port 8080 acting as the authenticated/public API gateway via `RestClient` with a 10s timeout; React 18 + TypeScript frontend styled with Misty Ghats liquid glass, camera capture, SVG defect bounding boxes, and seamless routing to the Recommendation Engine.

**Tech Stack:** Python 3.11+, FastAPI, OpenCV, PyTorch, Torchvision, Java 21, Spring Boot 3.3.5, Spring RestClient, React 18, TypeScript, Tailwind CSS, Lucide React.

**Spec:** [docs/superpowers/specs/2026-11-26-agrivision-quality-assessment-design.md](file:///c:/Users/ankit/OneDrive/Documents/Desktop/Mandi_Wise/docs/superpowers/specs/2026-11-26-agrivision-quality-assessment-design.md)

## Global Constraints

- Strict Zero-Emoji Policy: Under no circumstances use raw OS or Unicode emojis in code, commits, markdown, or chat responses. Use Lucide icons or SVG vectors (Guardrail 6).
- Single Remote Branch Policy: local `main` branch directly tracking `origin/main`.
- Untracked Directories: Keep `.agents/`, `Project_Tracking/`, and `skills-lock.json` strictly untracked.
- Standard Units: Agricultural prices standardized to `INR_PER_QUINTAL`.
- Non-Regression Rule: Existing Phase 1-7 tests, endpoints, and routes must remain 100% operational with 0 regressions.
- Max Upload Size: 10 MB limit for JPEG, JPG, and PNG images.

## Review Focus

1. **Vision Service Offline (503 Fallback):** When `python-service` is not running, Spring Boot must return a structured 503 response and the frontend must display a friendly diagnostic banner without crashing or blocking other tabs.
2. **Untrained Classifier Fallback:** When MobileNetV2 weights are uncalibrated (`UNTRAINED_PENDING`), OpenCV surface inspection must run genuinely, and user crop selection must determine AGMARK grading rules rather than returning a blank or fake result.
3. **Multi-Crop Boundary in Recommendations:** For Brinjal and Green Chilli, the transition button must show an informational expansion notice instead of failing or defaulting incorrectly in the Recommendation Engine.
4. **Grade-Tiered Pricing Integrity:** Grade A must benchmark at `max_price`, Grade B at `modal_price`, Grade C at `min_price`. Requests without a grade must strictly maintain historical `modal_price` calculations to avoid breaking existing Phase 6 test cases.
5. **Corrupted / Invalid Image Upload:** Non-image payloads or truncated uploads must be caught with clear 400 validation errors before passing into OpenCV.

---

### Task 1: Python Vision Microservice Setup & Core CV/AGMARK Migration

**Files:**
- Create: `python-service/app/computer_vision/__init__.py`
- Create: `python-service/app/computer_vision/preprocessor.py`
- Create: `python-service/app/computer_vision/grading_rules.py`
- Create: `python-service/app/computer_vision/inference.py`
- Create: `python-service/app/schemas/vision_schemas.py`
- Create: `python-service/app/api/vision_routes.py`
- Modify: `python-service/app/main.py:1-37`
- Modify: `python-service/requirements.txt:1-8`
- Test: `python-service/tests/test_vision_routes.py`

**Interfaces:**
- Produces:
  - `GET /health` -> `{"status": "UP", ...}`
  - `GET /api/crops` -> `{"supported_vegetables": [{"name": "Tomato", ...}], "count": 5}`
  - `POST /api/analyze` (form: `file: UploadFile`, `vegetable_hint: Optional[str]`) -> `AnalysisResponseDict`

- [ ] **Step 1: Write failing test in `python-service/tests/test_vision_routes.py`**

```python
from fastapi.testclient import TestClient
import numpy as np
import cv2
import io
from app.main import app

client = TestClient(app)

def test_get_supported_crops():
    response = client.get("/api/crops")
    assert response.status_code == 200
    data = response.json()
    assert "supported_vegetables" in data
    crop_names = [c["name"] for c in data["supported_vegetables"]]
    assert "Tomato" in crop_names
    assert "Potato" in crop_names
    assert "Onion" in crop_names
    assert "Brinjal" in crop_names
    assert "Green Chilli" in crop_names

def test_analyze_image_synthetic_tomato():
    # Create synthetic red tomato image in memory
    img = np.zeros((300, 300, 3), dtype=np.uint8)
    cv2.circle(img, (150, 150), 100, (30, 30, 220), -1) # BGR Red
    _, buf = cv2.imencode(".png", img)
    
    response = client.post(
        "/api/analyze",
        files={"file": ("test_tomato.png", io.BytesIO(buf.tobytes()), "image/png")},
        data={"vegetable_hint": "Tomato"}
    )
    assert response.status_code == 200
    res = response.json()
    assert "identification" in res
    assert "quality" in res
    assert "grading" in res
    assert res["grading"]["grade"] in ["Grade A", "Grade B", "Grade C"]
```

- [ ] **Step 2: Run test to verify it fails**

Run: `python -m pytest python-service/tests/test_vision_routes.py`
Expected: FAIL with 404 Not Found (routes not registered)

- [ ] **Step 3: Migrate CV modules and implement `vision_routes.py`**

1. Copy and adapt `preprocessor.py`, `grading_rules.py`, and `inference.py` from `feature/agrivision-ai` into `python-service/app/computer_vision/`.
2. Add vegetable registry for Tomato, Potato, Onion, Brinjal, and Green Chilli in `app/computer_vision/grading_rules.py`.
3. Create `python-service/app/api/vision_routes.py` mounting `/api/crops` and `/api/analyze`.
4. Include router in `python-service/app/main.py`.
5. Update `python-service/requirements.txt` with `opencv-python-headless`, `torch`, `torchvision`, `pillow`.

- [ ] **Step 4: Run test to verify it passes**

Run: `python -m pytest python-service/tests/test_vision_routes.py`
Expected: PASS (2 passed)

- [ ] **Step 5: Commit**

```bash
git add python-service/
git commit -m "feat(vision): migrate computer vision pipeline and grading endpoints into python-service"
```

---

### Task 2: Spring Boot Grade-Tiered Recommendation Engine Update (Option B)

**Files:**
- Modify: `backend/src/main/java/com/mandiwise/recommendation/dto/RecommendationRequest.java:1-83`
- Modify: `backend/src/main/java/com/mandiwise/recommendation/service/RecommendationService.java:85-135`
- Test: `backend/src/test/java/com/mandiwise/recommendation/service/RecommendationServiceTest.java`

**Interfaces:**
- Consumes: `RecommendationRequest.getGrade()`
- Produces: `MandiCandidateDto` with breakdown calculated using Grade A (`max_price`), Grade C (`min_price`), or Grade B/null (`modal_price`).

- [ ] **Step 1: Write failing test in `RecommendationServiceTest.java`**

```java
@Test
void calculateRecommendation_withGradeA_usesMaxPriceForRevenue() {
    RecommendationRequest request = new RecommendationRequest("Tomato", new BigDecimal("1000"), "Kolar");
    request.setGrade("Grade A");
    
    RecommendationResponse response = recommendationService.compareAndRecommend(request);
    
    assertNotNull(response);
    MandiCandidateDto top = response.getTopRecommendation();
    assertNotNull(top);
    // Grade A benchmark should use max price when available
    assertTrue(top.getBreakdown().getGrossRevenue().compareTo(BigDecimal.ZERO) > 0);
}

@Test
void calculateRecommendation_withNullGrade_maintainsBackwardCompatibility() {
    RecommendationRequest request = new RecommendationRequest("Tomato", new BigDecimal("1000"), "Kolar");
    // grade is null
    RecommendationResponse response = recommendationService.compareAndRecommend(request);
    
    assertNotNull(response);
    // Must calculate identically to legacy modal price calculation
    assertEquals(1500, response.getCandidates().get(0).getBreakdown().getNetEarnings().intValue());
}
```

- [ ] **Step 2: Run test to verify it fails**

Run: `backend/mvnw.cmd test -Dtest=RecommendationServiceTest`
Expected: Compilation failure or assertion failure (missing `setGrade` method)

- [ ] **Step 3: Implement Grade-Tiered Pricing in `RecommendationService`**

1. Add `private String grade;` with getter/setter to `RecommendationRequest.java`.
2. In `RecommendationService.java`, resolve the benchmark price per candidate:
   ```java
   BigDecimal benchmarkPrice = price.getModalPrice();
   if ("Grade A".equalsIgnoreCase(request.getGrade()) && price.getMaxPrice() != null) {
       benchmarkPrice = price.getMaxPrice();
   } else if ("Grade C".equalsIgnoreCase(request.getGrade()) && price.getMinPrice() != null) {
       benchmarkPrice = price.getMinPrice();
   }
   ```
3. Pass `benchmarkPrice` into `netEarningsCalculator.calculate(...)`.

- [ ] **Step 4: Run test to verify all tests pass**

Run: `backend/mvnw.cmd test -Dtest=RecommendationServiceTest`
Expected: BUILD SUCCESS (All tests pass)

- [ ] **Step 5: Commit**

```bash
git add backend/src/main/java/com/mandiwise/recommendation/ backend/src/test/java/com/mandiwise/recommendation/
git commit -m "feat(recommendation): implement Grade-tiered pricing in RecommendationService for Option B"
```

---

### Task 3: Spring Boot Quality Gateway & Proxy Integration

**Files:**
- Create: `backend/src/main/java/com/mandiwise/quality/dto/QualityAnalysisResponseDto.java`
- Create: `backend/src/main/java/com/mandiwise/quality/dto/SupportedCropsResponseDto.java`
- Create: `backend/src/main/java/com/mandiwise/quality/exception/VisionServiceUnavailableException.java`
- Create: `backend/src/main/java/com/mandiwise/quality/service/QualityAssessmentService.java`
- Create: `backend/src/main/java/com/mandiwise/quality/controller/QualityAssessmentController.java`
- Modify: `backend/src/main/java/com/mandiwise/config/SecurityConfig.java`
- Modify: `backend/src/main/resources/application.yml`
- Test: `backend/src/test/java/com/mandiwise/quality/QualityAssessmentControllerTest.java`

**Interfaces:**
- Produces:
  - `POST /api/v1/quality/analyze` (multipart file, optional hint) -> `QualityAnalysisResponseDto`
  - `GET /api/v1/quality/supported-crops` -> `SupportedCropsResponseDto`
  - `GET /api/v1/quality/status` -> `{"status": "UP", ...}`

- [ ] **Step 1: Write failing controller test in `QualityAssessmentControllerTest.java`**

```java
@Test
void analyze_returnsGradingResult_whenPythonServiceIsOnline() throws Exception {
    MockMultipartFile file = new MockMultipartFile("file", "tomato.jpg", "image/jpeg", new byte[]{1, 2, 3});
    
    mockMvc.perform(multipart("/api/v1/quality/analyze")
            .file(file)
            .param("vegetableHint", "Tomato"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.grading.grade").exists());
}

@Test
void analyze_returns503_whenPythonServiceIsOffline() throws Exception {
    // Configure mock to throw VisionServiceUnavailableException
    mockMvc.perform(multipart("/api/v1/quality/analyze").file(dummyFile))
            .andExpect(status().isServiceUnavailable())
            .andExpect(jsonPath("$.message").value(containsString("Vision service currently unavailable")));
}
```

- [ ] **Step 2: Run test to verify it fails**

Run: `backend/mvnw.cmd test -Dtest=QualityAssessmentControllerTest`
Expected: FAIL (Endpoints do not exist)

- [ ] **Step 3: Implement Spring Boot Gateway Service & Controller**

1. Create DTO classes mapping the JSON response from `python-service`.
2. Implement `QualityAssessmentService` using Spring's `RestClient` with `setConnectTimeout(Duration.ofSeconds(5))` and `setReadTimeout(Duration.ofSeconds(10))`.
3. Catch connection exceptions and map them to `VisionServiceUnavailableException` (HTTP 503).
4. Create `QualityAssessmentController` exposing `/api/v1/quality/**`.
5. Update `SecurityConfig.java` to permit `/api/v1/quality/**` publicly.

- [ ] **Step 4: Run test to verify it passes**

Run: `backend/mvnw.cmd test -Dtest=QualityAssessmentControllerTest`
Expected: BUILD SUCCESS (All tests pass)

- [ ] **Step 5: Run full backend regression test suite**

Run: `backend/mvnw.cmd test`
Expected: BUILD SUCCESS (All 17+ tests pass, 0 failures, 0 regressions)

- [ ] **Step 6: Commit**

```bash
git add backend/src/main/java/com/mandiwise/quality/ backend/src/main/java/com/mandiwise/config/ backend/src/test/java/com/mandiwise/quality/
git commit -m "feat(quality): implement Spring Boot Quality Gateway and proxy to vision service"
```

---

### Task 4: Frontend Quality Types & Axios Service

**Files:**
- Create: `frontend/src/types/quality.ts`
- Create: `frontend/src/services/qualityService.ts`
- Test: Verify TypeScript typecheck via `npm run build`

**Interfaces:**
- Produces:
  - `qualityService.analyzeImage(file: File, hint?: string): Promise<QualityAnalysisResponse>`
  - `qualityService.getSupportedCrops(): Promise<SupportedCrop[]>`
  - `qualityService.checkStatus(): Promise<VisionServiceStatus>`

- [ ] **Step 1: Create `frontend/src/types/quality.ts`**

Define TypeScript interfaces: `IdentificationData`, `CvMetrics`, `DefectItem`, `GradingReport`, `QualityAnalysisResponse`, `SupportedCrop`.

- [ ] **Step 2: Create `frontend/src/services/qualityService.ts`**

Implement Axios client methods communicating with `/api/v1/quality/analyze` and `/api/v1/quality/supported-crops`.

- [ ] **Step 3: Verify TypeScript compilation**

Run: `cd frontend ; npm run build`
Expected: Build succeeds with 0 type errors.

- [ ] **Step 4: Commit**

```bash
git add frontend/src/types/quality.ts frontend/src/services/qualityService.ts
git commit -m "feat(frontend): create TypeScript types and client service for AgriVision Quality"
```

---

### Task 5: Frontend Quality Assessment Components

**Files:**
- Create: `frontend/src/components/quality/ImageDropzone.tsx`
- Create: `frontend/src/components/quality/DefectOverlayCanvas.tsx`
- Create: `frontend/src/components/quality/QualityGradeCard.tsx`
- Create: `frontend/src/components/quality/WorkflowTransitionBanner.tsx`

**Interfaces:**
- `ImageDropzone`: accepts `onFileSelected(file: File, hint?: string)`, renders drag-and-drop zone, camera trigger, and crop selection chips. Zero emojis.
- `DefectOverlayCanvas`: renders crop image preview with SVG overlays for defect bounding boxes (`bbox_xyxy`).
- `QualityGradeCard`: renders Grade A/B/C badge, freshness score, CV metric bars (Color Uniformity, Blemish Ratio, Texture Index, Decay Indicator), and AGMARK statutory disclaimer.
- `WorkflowTransitionBanner`: displays "Calculate Net Take-Home Earnings" button routing to `/recommendations?commodity=...&grade=...` for supported crops, or expansion notice for Brinjal/Chilli.

- [ ] **Step 1: Implement `ImageDropzone.tsx` with quick crop chips and mobile camera capture**
- [ ] **Step 2: Implement `DefectOverlayCanvas.tsx` with normalized SVG bounding boxes**
- [ ] **Step 3: Implement `QualityGradeCard.tsx` with Misty Ghats styling and metric breakdown**
- [ ] **Step 4: Implement `WorkflowTransitionBanner.tsx` with conditional routing & expansion notices**
- [ ] **Step 5: Run TypeScript build to verify components compile**

Run: `cd frontend ; npm run build`
Expected: Build succeeds with 0 errors.

- [ ] **Step 6: Commit**

```bash
git add frontend/src/components/quality/
git commit -m "feat(quality-ui): create Misty Ghats quality dropzone, defect overlay, and grade card components"
```

---

### Task 6: Dedicated Page, Routing, Navbar & Recommendation Engine Pre-Population

**Files:**
- Create: `frontend/src/pages/CropQualityPage.tsx`
- Modify: `frontend/src/components/layout/Navbar.tsx:30-80`
- Modify: `frontend/src/App.tsx:40-60`
- Modify: `frontend/src/components/recommendation/RecommendationStudio.tsx:30-70`
- Modify: `frontend/src/components/recommendation/RecommendationInputForm.tsx:1-80`

**Interfaces:**
- Navbar: adds "AgriVision Quality" navigation pill with `Sparkles` or `CheckCircle2` Lucide icon.
- App: mounts `CropQualityPage` at `/quality-assessment`.
- RecommendationStudio: inspects `useSearchParams` for `commodity` and `grade`; if present, pre-populates the input form and displays a quality badge banner: *"Benchmarked for [Grade] harvest (Price tier adjusted)"*.

- [ ] **Step 1: Create `CropQualityPage.tsx` assembling dropzone, canvas, grade card, and transition banner**
- [ ] **Step 2: Add route in `App.tsx` and navigation item in `Navbar.tsx`**
- [ ] **Step 3: Wire query parameters into `RecommendationStudio.tsx` and `RecommendationInputForm.tsx` to pre-populate crop and grade**
- [ ] **Step 4: Test frontend build**

Run: `cd frontend ; npm run build`
Expected: Build passes cleanly.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/pages/CropQualityPage.tsx frontend/src/components/layout/Navbar.tsx frontend/src/App.tsx frontend/src/components/recommendation/
git commit -m "feat(quality): integrate CropQualityPage route, navbar link, and recommendation studio pre-population"
```

---

### Task 7: Full System Verification & Living Docs

**Files:**
- Modify: `Project_Tracking/FEATURE_TRACKER.md`
- Test: Full end-to-end regression and verification suite.

- [ ] **Step 1: Run complete backend test suite**

Run: `backend/mvnw.cmd test`
Expected: BUILD SUCCESS (All 17+ tests pass)

- [ ] **Step 2: Run complete frontend build**

Run: `cd frontend ; npm run build`
Expected: Vite build succeeds with 0 type errors.

- [ ] **Step 3: Run python tests**

Run: `python -m pytest python-service/tests`
Expected: All tests pass.

- [ ] **Step 4: Update `FEATURE_TRACKER.md`**

Mark Phase 8 as completed and log deliverables.

- [ ] **Step 5: Final Commit**

```bash
git add Project_Tracking/FEATURE_TRACKER.md
git commit -m "chore(tracker): mark Phase 8 AgriVision quality assessment as completed and verified"
```
