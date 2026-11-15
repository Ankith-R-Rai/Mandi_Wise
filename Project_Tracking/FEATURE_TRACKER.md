# MandiWise — Feature & Phase Tracker

**Document Version:** 1.0  
**Last Updated:** 15 November 2026  
**Status Legend:**
- 🔴 Not Started
- 🟡 In Progress
- 🔵 In Testing / Verification
- 🟢 Completed
- ⚪ Deferred / Future Scope

---

## 1. Development Phases Overview

| Phase | Description | Priority | Status | Sign-Off Date |
| :---: | :--- | :---: | :---: | :---: |
| **0** | **Project Preparation & Living Docs** | **P0** | 🟢 **Completed** | 15 Nov 2026 |
| **1** | **Environment & Supabase Setup** | **P0** | 🟢 **Completed** | 15 Nov 2026 |
| **2** | **Data Feasibility & Research** | **P0** | 🟡 **Next Up** | — |
| **3** | **UI Foundation & Design System** | **P0** | 🔴 Not Started | — |
| **4** | **Backend Foundation & Authentication** | **P0** | 🔴 Not Started | — |
| **5** | **Core Market Data Module** | **P0** | 🔴 Not Started | — |
| **6** | **Market Comparison & Recommendation Engine** | **P0** | 🔴 Not Started | — |
| **7** | **Historical Price Trends** | **P0** | 🔴 Not Started | — |
| **8** | **Tomato Quality Assessment (Computer Vision)** | **P1** | 🔴 Not Started | — |
| **9** | **Buyer Discovery** | **P1** | 🔴 Not Started | — |
| **10** | **Government Schemes & Agricultural Insights** | **P1** | 🔴 Not Started | — |
| **11** | **Farmer Dashboard & Full Feature Integration** | **P0** | 🔴 Not Started | — |
| **12** | **Administration & Data Management** | **P1** | 🔴 Not Started | — |
| **13** | **System-Wide Verification & Hardening** | **P0** | 🔴 Not Started | — |
| **14** | **Deployment & Demonstration Readiness** | **P0** | 🔴 Not Started | — |

---

## 2. Feature Priority Matrix

### 2.1 Core MVP Capabilities (P0)

* [x] **Phase 0 Infrastructure & Living Docs:**
  - [x] Initialized Git repository and `.gitignore`.
  - [x] Harmonized project documents in `Project_Info/`.
  - [x] Provisioned Supabase PostgreSQL project `mandiwise-dev`.
  - [x] Established living documentation suite in `Project_Tracking/`.
* [x] **Phase 1 Environment Baseline:**
  - [x] Frontend setup (React + TypeScript + Tailwind CSS + Vite).
  - [x] Backend setup (Spring Boot 3.3.5 with script-only Maven Wrapper).
  - [x] Python service baseline (FastAPI + Uvicorn + Pytest).
  - [x] Supabase PostgreSQL project provisioned (`ap-south-1`) & connection configs verified.
* [ ] **Phase 2 Data Research:**
  - [ ] Initial data ingestion pipeline for Karnataka APMC mandis (Tomato, Onion, Potato).
  - [ ] Price unit validation (`INR_PER_QUINTAL`).
  - [ ] Data freshness policy definition.
* [ ] **Phase 3 UI Foundation:**
  - [ ] Apple/Linear/Stripe-inspired nature design system (colors, typography, spacing).
  - [ ] Reusable component library (Button, Input, Card, Table, Badge, Modal, Skeleton).
  - [ ] Cinematic illustrated Karnataka countryside hero with environmental animations.
* [ ] **Phase 4 Authentication & Security:**
  - [ ] Farmer registration and login (BCrypt, Spring Security, JWT).
  - [ ] Farmer profile & farm location management.
  - [ ] Protected route enforcement.
* [ ] **Phase 5 Market Data Module:**
  - [ ] Mandi price browsing with filters (Commodity, District, Date).
  - [ ] Observation date and source attribution display.
* [ ] **Phase 6 Mandi Recommendation Engine:**
  - [ ] Input form (Commodity, Quantity in kg, Origin location).
  - [ ] Estimated transport cost calculation (configurable cost/km).
  - [ ] Gross revenue calculation ($(\text{Qty}/100) \times \text{ModalPrice}$).
  - [ ] Net earnings calculation and ranking (`estimatedNetEarnings DESC`).
  - [ ] Recommendation explanation and candidate comparison grid.
* [ ] **Phase 7 Historical Price Trends:**
  - [ ] Recharts line charts for commodity prices over time.
  - [ ] Date-range selection and market comparison.
* [ ] **Phase 11 Farmer Dashboard:**
  - [ ] Personalized farmer overview, quick actions, and recent recommendation summary.

---

### 2.2 Important Supporting Capabilities (P1)

* [ ] **Phase 8 Quality Assessment:**
  - [ ] Tomato image upload and validation.
  - [ ] Python OpenCV / ML inference for visible defect and color grading.
  - [ ] Visual assessment display with strict limitation disclosures.
* [ ] **Phase 9 Buyer Discovery:**
  - [ ] Directory of potential agricultural buyers in Karnataka.
  - [ ] Explicit verification status labels (`VERIFIED`, `UNVERIFIED`).
* [ ] **Phase 10 Government Schemes & Insights:**
  - [ ] Sourced catalog of agricultural schemes and subsidies.
  - [ ] Potential eligibility indicator with official source links.
  - [ ] Crop rotation and soil guidance.
* [ ] **Phase 12 Administration:**
  - [ ] Ingestion monitoring and batch logs.
  - [ ] Market and commodity management dashboard.

---

### 2.3 Future Enhancements (P2)
* [ ] Predictive price forecasting models.
* [ ] Expansion beyond Karnataka to neighboring states.
* [ ] Native Android/iOS mobile application.
* [ ] Direct buyer communication portal.
