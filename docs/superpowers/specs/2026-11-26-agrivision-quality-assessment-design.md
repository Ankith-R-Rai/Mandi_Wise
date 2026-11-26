# Design Document: Phase 8 - AgriVision Quality Assessment (Multi-Crop Computer Vision & AGMARK Grading)

**Date:** 2026-11-26  
**Status:** Proposed Design  
**Author:** MandiWise Architecture Team & User  
**Target Branch:** `main`

---

## 1. Intent and The Why

In agricultural supply chains, grading and quality assessment of harvested crops are historically subjective, opaque, and carried out by middlemen or commission agents at APMC mandis. Smallholder farmers frequently receive discounted Grade C payouts for Grade A or B produce because they lack transparent, objective quality evidence at harvest time.

**AgriVision Quality Assessment** solves this by providing:
1. **Objective Computer Vision:** Automated surface inspection analyzing colour uniformity, surface blemishes, shriveling/wrinkles, decay indicators, and shape regularity using normalized computer vision algorithms.
2. **AGMARK-Aligned Grading:** Standardized tiering into **Grade A** (Export/Premium), **Grade B** (Domestic Mandi Standard), and **Grade C** (Processing/Cull) with clear statutory disclaimers.
3. **Seamless Recommendation Workflow:** Direct one-click transfer of the assessed crop and grade into the **Mandi Recommendation Engine** (Phase 6), enabling farmers to instantly see their true net take-home earnings across Karnataka APMCs for their specific produce grade.

---

## 2. Goals, Non-Goals, and Anti-Goals

### Goals
- **Extract & Isolate CV Service:** Migrate the core computer vision engine developed in `feature/agrivision-ai` into an isolated, performant microservice directory (`python-service/`).
- **Multi-Crop Support:** Support multi-crop classification and quality analysis for **Tomato, Potato, Onion, Brinjal, and Green Chilli** (with extensibility for additional crops).
- **Deterministic Surface Inspection:** Retain OpenCV CLAHE lighting normalization, HSV color distribution, necrotic lesion detection, Sobel wrinkling texture scoring, Laplacian blur detection, and contour convex hull solidity analysis.
- **Model Integrity & Status Transparency:** Support MobileNetV2 architecture with honest status reporting (`UNTRAINED_PENDING` vs `TRAINED`), never faking neural predictions when weights are missing.
- **Spring Boot API Gateway:** Expose `/api/v1/quality/analyze` and `/api/v1/quality/supported-crops` through Spring Boot 3.3.5, proxying multipart image requests to the Python service with strict timeout handling and graceful degradation.
- **Resilient Offline Fallback:** If the Python service is offline or starting up, Spring Boot responds with a clear diagnostic status (`SERVICE_UNAVAILABLE`) and guidance without crashing the backend or affecting existing services.
- **Misty Ghats UI:** Build a native React + TypeScript page (`/quality-assessment`) adhering to MandiWise's Misty Ghats liquid glass aesthetic, Tranquil Nature palette, and Lucide iconography:
  - Drag-and-drop upload zone and mobile camera capture.
  - Interactive photo preview with visual defect bounding box overlays.
  - Comprehensive quality report card (Grade, Freshness, Blemish Ratio, Sharpness, AGMARK statutory notice).
  - One-click "Calculate Net Take-Home Earnings" button routing to `/recommendations` with query parameters (`commodity`, `grade`).
- **Strict Non-Regression:** Zero changes or regressions to Phase 1 through 7 endpoints, database tables, or test suites.

### Non-Goals
- **Statutory Certification:** This module is an automated decision aid and does not replace statutory certification under the Agricultural Produce (Grading and Marking) Act, 1937.
- **Replacing Spring Boot:** We are NOT replacing the Spring Boot backend with FastAPI for existing features.
- **Direct Database Schema Mutations:** The image analysis is processed in-flight without mutating core farmer/mandi tables in Supabase. Analysis history can optionally be cached locally or stored in a dedicated table.

### Anti-Goals
- **Zero Raw Emojis:** Strictly prohibited across all code, tests, and UI (Guardrail 6).
- **No Monolithic Overwriting:** Never merge `feature/agrivision-ai` directly into `main` because it would wipe out our TypeScript setup, Tailwind theme, and Phase 1-7 features.
- **No Backend Slowdown:** External Python vision calls must run with strict HTTP timeouts (10 seconds) and never block unrelated Spring Boot threads or Mandi explorer queries.

---

## 3. Architecture & Approaches Considered

### Approaches Evaluated

| Approach | Architecture | Frontend Stack | Trade-offs & Decision |
|---|---|---|---|
| **Approach A (Selected): Dedicated `python-service/` with Spring Boot Gateway** | FastAPI CV microservice in `python-service/` on port 8000; Spring Boot on 8080 acts as gateway proxying `/api/v1/quality/**`. | Native React + TypeScript page in `frontend/src/pages/CropQualityPage.tsx` styled with Misty Ghats liquid glass. | **Selected.** Provides a single-origin API, unified security context, zero CORS complications, full TypeScript type safety, and preserves all Phase 1-7 features. |
| **Approach B: Direct Dual-Backend Monorepo** | FastAPI runs independently on port 8000; Frontend calls port 8000 directly for CV and port 8080 for Mandi prices. | Same React page, but Axios communicates with two separate backend ports. | **Rejected.** Fragmented CORS configuration, breaks unified auth context, and increases operational complexity for local development. |
| **Approach C: Full Monolithic Python Rewrite** | Overwrite Spring Boot with the teammate's FastAPI app across the entire repository. | Use teammate's `.jsx` prototype from `feature/agrivision-ai`. | **Rejected.** Would destroy Phases 1 through 7, discard Supabase PostgreSQL integrations, and lose all existing automated test suites. |

---

## 4. Detailed Component Design

### 4.1 Python Vision Microservice (`python-service/`)
- **Directory Structure:**
  ```text
  python-service/
  ├── app/
  │   ├── __init__.py
  │   ├── main.py
  │   ├── config.py
  │   ├── routers/
  │   │   ├── __init__.py
  │   │   └── vision.py
  │   ├── computer_vision/
  │   │   ├── __init__.py
  │   │   ├── preprocessor.py
  │   │   ├── grading_rules.py
  │   │   └── inference.py
  │   └── schemas/
  │       └── vision_schemas.py
  ├── models/
  │   └── artifacts/ (weights directory)
  ├── requirements.txt
  └── run_service.py
  ```
- **Key Capabilities:**
  - `preprocessor.py`: OpenCV CLAHE L-channel normalization, HSV foreground extraction, lesion mask extraction, Sobel gradient energy for wrinkling, Laplacian variance for blur detection, contour convex hull solidity for shape regularity.
  - `grading_rules.py`: Heuristic grading matrix assigning **Grade A**, **Grade B**, or **Grade C** with clear explanations and statutory AGMARK inspection notices.
  - `inference.py`: MobileNetV2 architecture with ImageNet transforms. If weights are not yet trained, honestly sets `model_status: "UNTRAINED_PENDING"` and relies on deterministic OpenCV surface analysis.
  - `GET /health`: Health probe returning status, active devices, and loaded weights.
  - `GET /api/crops`: Returns supported vegetable registry (Tomato, Potato, Onion, Brinjal, Green Chilli).
  - `POST /api/analyze`: Receives multipart image file and optional crop hint; returns JSON grading report.

### 4.2 Spring Boot Gateway & Grade-Tiered Pricing Integration (`backend/`)
- **Package:** `com.mandiwise.quality` & `com.mandiwise.recommendation`
- **Controller:** `QualityAssessmentController.java`
  - `POST /api/v1/quality/analyze`: Accepts `MultipartFile file` and optional `String vegetableHint`.
  - `GET /api/v1/quality/supported-crops`: Returns list of crops supported by the vision engine.
  - `GET /api/v1/quality/status`: Returns whether the vision microservice is online and healthy.
- **Service:** `QualityAssessmentService.java`
  - Uses Spring's `RestClient` configured with a 10-second connect/read timeout to communicate with `http://localhost:8000`.
  - Implements graceful exception handling: if `python-service` is unreachable, throws a descriptive `VisionServiceUnavailableException` mapped to HTTP 503 with actionable farmer guidance.
- **Security:** Publicly permit `/api/v1/quality/**` in `SecurityConfig.java` to allow instant farmer access.
- **Grade-Tiered Recommendation Pricing (Option B):**
  - `RecommendationRequest.java`: Add optional `String grade` field (e.g., `"Grade A"`, `"Grade B"`, `"Grade C"`).
  - `RecommendationService.java`:
    - When `grade` is `"Grade A"`: uses each APMC's `max_price` (falling back to `modal_price` if missing).
    - When `grade` is `"Grade C"`: uses each APMC's `min_price` (falling back to `modal_price` if missing).
    - When `grade` is `"Grade B"` or null/unspecified: uses standard `modal_price`.
  - **Backward Compatibility:** All existing tests and requests without a grade parameter continue to compute revenue based on `modal_price`, preserving 100% passing status for existing automated test suites while enabling quality-grade financial differentiation.

### 4.3 Frontend UI (`frontend/`)
- **Route:** `/quality-assessment` (with navigation link in `Navbar.tsx`).
- **Components:**
  1. `CropQualityPage.tsx`: Main page container with hero header, workflow explanation, and dual-column layout.
  2. `ImageDropzone.tsx`: Drag-and-drop zone supporting PNG/JPEG up to 10 MB, mobile camera capture trigger, and quick crop selection chips (`Auto-detect`, `Tomato`, `Potato`, `Onion`, `Brinjal`, `Green Chilli`) so farmers can easily provide an upfront crop hint (*Builder Call: Settled to ensure instant crop-specific grading even when neural weights are uncalibrated*).
  3. `DefectOverlayCanvas.tsx`: Visual canvas rendering detected bounding boxes (yellow for moderate blemishes, red for high-severity defects) directly over the uploaded crop image.
  4. `QualityGradeCard.tsx`: Displays the assigned Grade (A/B/C) with color-coded badges, freshness score, defect breakdown bars (Color Uniformity, Blemish Ratio, Texture Index, Decay Indicator), and the AGMARK statutory notice.
  5. `WorkflowTransitionBanner.tsx`: "Recommended Next Step" action card:
     - For **Tomato, Potato, and Onion**: Displays a one-click button: **"Calculate Net Take-Home Earnings"**, navigating to `/recommendations?commodity=<assessed_crop>&grade=<grade>` (*Builder Call: Aligned with user guidance that extra crops will be added to market pricing features in later phases*).
     - For **Brinjal and Green Chilli**: Displays an informational badge: *"Mandi price comparisons for [Crop] will be available in the upcoming market expansion. Supported crops for Mandi Recommendations: Tomato, Potato, Onion."*
     - If crop is unclassified: Prompts the farmer with quick chips to select the crop.

---

## 5. Non-Regression & Verification Plan

1. **Backend Verification:**
   - Run `mvnw.cmd test` to ensure all 15 existing tests for Market Prices, Recommendations, and Price Trends continue to pass with 0 failures.
   - Add unit and integration tests for `QualityAssessmentService` and `QualityAssessmentController` mocking the Python service response and verifying timeout handling.
2. **Frontend Verification:**
   - Run `tsc -b && vite build` to guarantee complete TypeScript type safety and zero unused variables.
   - Verify that all navigation links (`/`, `/market-prices`, `/recommendations`, `/net-earnings-axiom`, `/price-trends`, `/quality-assessment`) work seamlessly.
3. **End-to-End Flow Verification:**
   - Start Python service and Spring Boot backend.
   - Upload sample produce images (Tomato, Potato, Onion).
   - Verify OpenCV surface analysis results, defect bounding boxes, and Grade A/B/C classification.
   - Click "Calculate Net Take-Home Earnings" and verify pre-population on the Recommendation Engine page.

---

## 6. What is Left to the Builder

- Choosing default port for Python service (default `8000`, configurable via `VISION_SERVICE_URL`).
- Minor styling details of the SVG defect bounding box corners and hover tooltips.
- Python virtual environment setup scripts (`setup_env.bat` / `run_service.bat`) for easy local running.
