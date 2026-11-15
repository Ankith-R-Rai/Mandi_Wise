# MandiWise — System Architecture

**Document Version:** 1.0  
**Status:** Baseline Architecture Approved  
**Operating Environment:** Google Antigravity  

---

## 1. High-Level Architecture Overview

MandiWise adopts a **Modular Monolith** pattern for the primary backend, complemented by a modern single-page frontend application, a managed relational cloud database, and an isolated microservice for Python-based data processing and computer vision.

```
                              MANDIWISE SYSTEM TOPOLOGY

       FARMER / STAKEHOLDER                       ADMINISTRATOR
                │                                       │
                ▼                                       ▼
  ┌───────────────────────────────────────────────────────────┐
  │                   REACT FRONTEND (Vite)                   │
  │   • Tailwind CSS Design System                            │
  │   • Motion for React Animations                           │
  │   • Recharts Financial Trends                             │
  │   • TanStack Query + Axios REST Client                    │
  └─────────────────────────────┬─────────────────────────────┘
                                │
                                │ HTTPS / REST (/api/v1/*)
                                ▼
  ┌───────────────────────────────────────────────────────────┐
  │              JAVA SPRING BOOT PRIMARY BACKEND             │
  │   • Spring Security + JWT Authentication                  │
  │   • Authoritative Net Earnings & Ranking Engine           │
  │   • Market & Price Management Modules                     │
  │   • Spring Data JPA + Hibernate ORM                       │
  │   • Flyway Version-Controlled Migrations                  │
  └───────────────┬───────────────────────────┬───────────────┘
                  │                           │
                  │ PostgreSQL (JDBC/SSL)     │ HTTP REST (/process/*)
                  ▼                           ▼
  ┌───────────────────────────┐   ┌───────────────────────────┐
  │    SUPABASE POSTGRESQL    │   │    PYTHON FASTAPI SERVICE │
  │ • Relational Data Model   │   │ • AGMARKNET Preprocessing │
  │ • UUID Keys, Strict Types │   │ • Tomato CV Quality Model │
  │ • Schema Version Control  │   │ • OpenCV + Pillow Engine  │
  └───────────────────────────┘   └───────────────────────────┘
```

---

## 2. Layer Responsibilities & Isolation Boundaries

### 2.1 React Frontend (`frontend/`)
* **Role:** Presentation, navigation, interactive forms, responsive layouts, client-side validation, and accessible animations.
* **Responsibilities:**
  * Bilingual presentation (English & Kannada).
  * State synchronization using TanStack Query.
  * Capturing farmer inputs (commodity, quantity, farm location).
  * Rendering calculation breakdowns, comparative mandi cards, and trend charts.
* **Boundary Guardrail:** The frontend **never** calculates net earnings authoritatively or determines mandi rankings. It renders values returned by Spring Boot. Privileged database credentials never touch client code.

### 2.2 Primary Backend (`backend/`)
* **Role:** The single source of truth for application business rules, security, calculations, and relational persistence.
* **Modules:**
  * `com.mandiwise.common`: Global API response standard, exceptions, base auditing.
  * `com.mandiwise.security`: JWT filter, password hashing (BCrypt), role validation (`ROLE_FARMER`, `ROLE_ADMIN`).
  * `com.mandiwise.user` & `farmer`: Profile management, farm registration.
  * `com.mandiwise.commodity` & `market`: Normalized Karnataka APMC mandis and commodities.
  * `com.mandiwise.price`: Historical observation storage and freshness validation.
  * `com.mandiwise.transport`: Distance calculations and configurable cost-per-km models.
  * `com.mandiwise.recommendation`: Authoritative mathematical engine calculating gross revenue, transport costs, net earnings, and market rankings.
  * `com.mandiwise.integration`: HTTP client communicating with Python FastAPI service.
* **Boundary Guardrail:** Spring Boot is the only entity with read/write access to the application database.

### 2.3 Managed Database (`Supabase PostgreSQL`)
* **Instance:** `mandiwise-dev` (`tzncfzzaquyvdhblzgdm`) in `ap-south-1` (Mumbai).
* **Role:** Persistent relational storage enforcing constraints, foreign keys, and audit timestamps.
* **Boundary Guardrail:** All structural changes occur via Flyway migrations (`V1__...`). Direct ad-hoc DDL is prohibited.

### 2.4 Processing Service (`python-service/`)
* **Role:** Microservice dedicated to computationally heavy data tasks and image inference.
* **Responsibilities:**
  * Data cleaning and normalization scripts for external agricultural datasets.
  * Tomato quality assessment using computer vision (defect detection, color distribution).
* **Boundary Guardrail:** Python **never** issues database writes directly to PostgreSQL, never manages user sessions, and never bypasses Spring Boot.

---

## 3. Core Data Flow: Mandi Recommendation Engine

```
Farmer Inputs (Crop, Qty, Location)
                │
                ▼
      POST /api/v1/recommendations
                │
                ▼
  ┌───────────────────────────────────────────┐
  │ Java Spring Boot Recommendation Service   │
  │ 1. Validate quantity > 0 & active crop    │
  │ 2. Query eligible mandis & recent prices  │
  │ 3. Filter by price freshness policy       │
  │ 4. Compute road distance to each mandi    │
  │ 5. Calculate Transport Expense (Est.)     │
  │ 6. Calculate Gross Revenue:               │
  │    (Qty / 100) * ModalPricePerQuintal     │
  │ 7. Calculate Net Earnings:                │
  │    GrossRevenue - Transport - SellingFees │
  │ 8. Sort: NetEarnings DESC, Transport ASC  │
  │ 9. Persist Recommendation Snapshot        │
  └─────────────────────┬─────────────────────┘
                        │
                        ▼
       JSON Response with Detailed Breakdown
                        │
                        ▼
  ┌───────────────────────────────────────────┐
  │ React Frontend Presentation               │
  │ • Highlight Recommended Mandi             │
  │ • Display Transparent Net Earnings Math   │
  │ • Comparative Grid of Alternative Mandis  │
  │ • Warning Badges (Estimated / Stale data) │
  └───────────────────────────────────────────┘
```

---

## 4. Local Development Environment Ports

| Service | Technology | Port | Notes |
| :--- | :--- | :---: | :--- |
| **Frontend** | Vite Dev Server | `5173` | Proxies API calls or connects via `VITE_API_BASE_URL` |
| **Backend** | Spring Boot | `8080` | Exposes REST API at `http://localhost:8080/api/v1` |
| **Python Service** | FastAPI (Uvicorn) | `8000` | Exposes processing at `http://localhost:8000/process` |
| **Database** | Supabase Cloud | `5432` / `6543` | Managed remote connection via SSL pooler / direct |
