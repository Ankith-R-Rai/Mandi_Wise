# MandiWise — Development Log

**Project:** MandiWise  
**Lead Engineer / Architect:** Lead Software Architect (Google Antigravity)  

---

## [2026-11-15] — Phase 1: Environment and Supabase Setup

### Summary of Actions
* **Frontend Environment Setup (`frontend/`):**
  - Scaffolded Vite + React 18 + TypeScript + Tailwind CSS application matching the UI/UX design brief.
  - Installed dependencies: React 18, React DOM, Lucide React, Motion (Framer Motion), Axios, TanStack Query, React Hook Form, Zod, Recharts, Tailwind CSS, PostCSS, Autoprefixer.
  - Configured custom nature-inspired theme tokens (`#1F5138` Forest Green, `#26312B` Charcoal, `#F8FAF7` Off-white background, `#D97706` Amber accents).
  - Implemented modular `apiClient.ts` with standard `ApiResponse<T>` envelope unwrapping, Axios interceptors, and environment configuration.
  - Built high-fidelity UI shell in `src/App.tsx` demonstrating responsive layout, Lucide iconography, and live connection status indicators.
  - Verified frontend build: `npm run build` executed successfully (`tsc -b && vite build`) with 0 errors in 13.17s.
* **Backend Environment Setup (`backend/`):**
  - Scaffolded Java 17 + Spring Boot 3.3.5 project with official script-only Maven Wrapper (`mvnw.cmd`).
  - Configured `pom.xml` with dependencies: `spring-boot-starter-web`, `spring-boot-starter-data-jpa`, `spring-boot-starter-security`, `spring-boot-starter-validation`, `postgresql`, `flyway-core`, `flyway-database-postgresql`, `h2` (test scope), and `spring-boot-starter-test`.
  - Implemented standard response wrapper `ApiResponse<T>` with timestamp, status, payload, and error details.
  - Implemented `HealthController` at `/api/v1/health` providing service status, version, and architecture details.
  - Implemented `SecurityConfig` configuring stateless security session management, CORS support, and open access for `/api/v1/health` while keeping authenticated routes protected.
  - Created `application.yml` targeting Supabase PostgreSQL with Hikari connection pool configuration and `application-test.yml` using H2 in-memory DB.
  - Implemented unit and integration tests: `MandiWiseApplicationTests` and `HealthControllerTest`.
  - Verified backend build and tests: `.\mvnw.cmd test` executed successfully with `Tests run: 2, Failures: 0, Errors: 0, Skipped: 0` (`BUILD SUCCESS` in 50.8s).
* **Python Microservice Environment Setup (`python-service/`):**
  - Initialized isolated Python virtual environment (`python-service/venv`).
  - Configured `requirements.txt` with `fastapi>=0.115.0`, `uvicorn[standard]>=0.32.0`, `pandas>=2.2.0`, `numpy>=1.26.0`, `pytest>=8.3.0`, `requests>=2.32.0`, `python-dotenv>=1.0.1`, `httpx>=0.27.0`.
  - Implemented FastAPI microservice (`app/main.py`) with `/health` endpoint and CORS middleware.
  - Created `pytest.ini` and unit test `tests/test_health.py` asserting JSON response schema and capabilities.
  - Verified test suite: `pytest tests` executed successfully with 1 passed in 1.01s.
* **Supabase Project Health Check:**
  - Verified project `mandiwise-dev` (`tzncfzzaquyvdhblzgdm`) in Mumbai region `ap-south-1`.
  - Confirmed via `list_tables` that the database is in a pristine state (`[]`), ready for Phase 3 Flyway migrations.

### Engineering Decisions & Rationale
1. **Spring Boot Version Stability:** Pinned Spring Boot to `3.3.5` (LTS) instead of experimental 4.x milestone builds for enterprise reliability and seamless PostgreSQL 17 compatibility.
2. **Dedicated H2 In-Memory Profile for Backend Tests:** Isolated integration tests from external network/database availability by defining `application-test.yml`. Backend unit and controller tests can now execute hermetically in local CI/offline without blocking on remote Supabase connectivity.
3. **Sandbox Network Isolation Discovery:** Documented that Windows sandbox restricts loopback socket binding (`socketpair`), requiring `BypassSandbox: true` for commands performing local socket/IPC or external network operations, while local file compilation runs sandboxed.

---

## [2026-11-15] — Phase 0: Project Inspection & Foundation Setup

### Summary of Actions
* Inspected workspace and discovered existing files: `.agents/skills`, `skills-lock.json`, and `Project_Info/`.
* Discovered that the workspace was not yet a Git repository; executed `git init` and authored a comprehensive `.gitignore` covering React, Spring Boot, Python, and OS files.
* Verified installed runtimes on host Windows environment:
  - Node.js: `v22.19.0` (Ready)
  - npm: `10.9.3` (Ready)
  - OpenJDK: `17.0.13` Temurin LTS (Ready)
  - Python: `3.12.10` (Ready)
  - Git: `2.47.1.windows.1` (Ready)
  - Maven: `mvn` not present in global system PATH. Decided to generate and use the Maven Wrapper (`./mvnw.cmd`) during Spring Boot project initialization in Phase 1.
* Conducted in-depth inspection of all 6 primary project documents:
  - `PRD.md`
  - `TRD.md`
  - `UI_UX_DESIGN_BRIEF.md`
  - `APP_FLOW.md`
  - `BACKEND_SCHEMA.md`
  - `IMPLEMENTATION_PLAN.md`
* Discovered and resolved documentation anomalies:
  - Corrected `Database: MySQL` draft typo in `Project_Info/appflow.md` line 12 to `Supabase PostgreSQL`.
  - Renamed `Project_Info/implementation_pplan.md` to `implementation_plan.md` (fixing duplicate 'p').
  - Removed duplicate documentation directories, preserving `Project_Info/` as the single canonical source of truth for the 6 primary requirements and design documents.
  - Replaced legacy "Claude Code" tool mentions across `trd.md`, `backend_schema.md`, and `implementation_plan.md` with "Google Antigravity".
* Interacted with connected `supabase_mcp` server:
  - Verified membership in organization `hackathonais12@gmail.com's Org` (`vpxhykwtgwytmlyswewd`).
  - Identified 0 existing projects.
  - Successfully invoked `create_project` tool to provision development database `mandiwise-dev` (`tzncfzzaquyvdhblzgdm`) in region `ap-south-1` (Mumbai).
  - Verified project status is `ACTIVE_HEALTHY` and confirmed clean initial state via `list_tables`.
* Initialized project-level living documents in dedicated `Project_Tracking/` directory:
  - `MANDIWISE_CONTEXT.md`
  - `ARCHITECTURE.md`
  - `FEATURE_TRACKER.md`
  - `DEVELOPMENT_LOG.md`
  - `API_DOCUMENTATION.md`
  - `DATABASE_SCHEMA.md`
  - `TESTING_STRATEGY.md`

### Engineering Decisions & Rationale
1. **Maven Wrapper over Global Maven:** Because `mvn` is not on the user's system PATH, using Maven Wrapper (`./mvnw` / `mvnw.cmd`) guarantees completely reproducible builds without requiring manual Windows environment variable edits.
2. **Dedicated Tracking Directory:** Preserved the original `Project_Info/` as the sole home for the 6 foundational specifications, and housed the 7 living project management files in `Project_Tracking/` to keep the workspace root clean and organized.
3. **Region Selection:** Chose `ap-south-1` (Mumbai) for the Supabase project to ensure minimal latency for Karnataka agricultural market data.

---

## [2026-11-15] — Phase 1: Environment and Supabase Setup

### Summary of Actions
* **Frontend Environment Setup (`frontend/`):**
  - Scaffolded Vite + React 18 + TypeScript + Tailwind CSS application matching the UI/UX design brief.
  - Installed dependencies: React 18, React DOM, Lucide React, Motion (Framer Motion), Axios, TanStack Query, React Hook Form, Zod, Recharts, Tailwind CSS, PostCSS, Autoprefixer.
  - Configured custom nature-inspired theme tokens (`#1F5138` Forest Green, `#26312B` Charcoal, `#F8FAF7` Off-white background, `#D97706` Amber accents).
  - Implemented modular `apiClient.ts` with standard `ApiResponse<T>` envelope unwrapping, Axios interceptors, and environment configuration.
  - Built high-fidelity UI shell in `src/App.tsx` demonstrating responsive layout, Lucide iconography, and live connection status indicators.
  - Verified frontend build: `npm run build` executed successfully (`tsc -b && vite build`) with 0 errors in 13.17s.
* **Backend Environment Setup (`backend/`):**
  - Scaffolded Java 17 + Spring Boot 3.3.5 project with official script-only Maven Wrapper (`mvnw.cmd`).
  - Configured `pom.xml` with dependencies: `spring-boot-starter-web`, `spring-boot-starter-data-jpa`, `spring-boot-starter-security`, `spring-boot-starter-validation`, `postgresql`, `flyway-core`, `flyway-database-postgresql`, `h2` (test scope), and `spring-boot-starter-test`.
  - Implemented standard response wrapper `ApiResponse<T>` with timestamp, status, payload, and error details.
  - Implemented `HealthController` at `/api/v1/health` providing service status, version, and architecture details.
  - Implemented `SecurityConfig` configuring stateless security session management, CORS support, and open access for `/api/v1/health` while keeping authenticated routes protected.
  - Created `application.yml` targeting Supabase PostgreSQL with Hikari connection pool configuration and `application-test.yml` using H2 in-memory DB.
  - Implemented unit and integration tests: `MandiWiseApplicationTests` and `HealthControllerTest`.
  - Verified backend build and tests: `.\mvnw.cmd test` executed successfully with `Tests run: 2, Failures: 0, Errors: 0, Skipped: 0` (`BUILD SUCCESS` in 50.8s).
* **Python Microservice Environment Setup (`python-service/`):**
  - Initialized isolated Python virtual environment (`python-service/venv`).
  - Configured `requirements.txt` with `fastapi>=0.115.0`, `uvicorn[standard]>=0.32.0`, `pandas>=2.2.0`, `numpy>=1.26.0`, `pytest>=8.3.0`, `requests>=2.32.0`, `python-dotenv>=1.0.1`, `httpx>=0.27.0`.
  - Implemented FastAPI microservice (`app/main.py`) with `/health` endpoint and CORS middleware.
  - Created `pytest.ini` and unit test `tests/test_health.py` asserting JSON response schema and capabilities.
  - Verified test suite: `pytest tests` executed successfully with 1 passed in 1.01s.
* **Supabase Project Health Check:**
  - Verified project `mandiwise-dev` (`tzncfzzaquyvdhblzgdm`) in Mumbai region `ap-south-1`.
  - Confirmed via `list_tables` that the database is in a pristine state (`[]`), ready for Phase 3 Flyway migrations.

### Engineering Decisions & Rationale
1. **Spring Boot Version Stability:** Pinned Spring Boot to `3.3.5` (LTS) instead of experimental 4.x milestone builds for enterprise reliability and seamless PostgreSQL 17 compatibility.
2. **Dedicated H2 In-Memory Profile for Backend Tests:** Isolated integration tests from external network/database availability by defining `application-test.yml`. Backend unit and controller tests can now execute hermetically in local CI/offline without blocking on remote Supabase connectivity.
3. **Sandbox Network Isolation Discovery:** Documented that Windows sandbox restricts loopback socket binding (`socketpair`), requiring `BypassSandbox: true` for commands performing local socket/IPC or external network operations, while local file compilation runs sandboxed.

---
