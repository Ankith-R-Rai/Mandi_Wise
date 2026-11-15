# MandiWise — Project Context & Session Memory

> **Single Source of Truth for Session Continuity across Google Antigravity**  
> *Last Updated:* 15 November 2026  
> *Current Phase:* **Phase 0 Complete — Ready for Phase 1 (Environment & Supabase Setup)**

---

## 1. Executive Summary & Core Mission
**MandiWise** is an agricultural market intelligence and decision-support platform designed initially for Karnataka, India.

Its primary purpose is to help farmers maximize their **net earnings** when selling produce by comparing markets based on true expected profit rather than raw commodity prices alone.

$$\text{Gross Revenue} = \left(\frac{\text{Quantity (kg)}}{100}\right) \times \text{Modal Price per Quintal}$$
$$\text{Total Selling Expenses} = \text{Estimated Transport Cost} + \text{Other Applicable Selling Expenses}$$
$$\text{Estimated Net Earnings} = \text{Gross Revenue} - \text{Total Selling Expenses}$$

> **Foundational Axiom:** *The highest displayed mandi price does not necessarily yield the highest profit.* A closer mandi offering ₹2,400/quintal can yield substantially higher net earnings than a distant mandi offering ₹2,600/quintal after factoring in ₹10,000 in transportation costs.

---

## 2. Active Technical Stack & Infrastructure

| Component | Selected Technology | Role & Authority |
| :--- | :--- | :--- |
| **Frontend** | React 19 / 18, TypeScript, Vite, Tailwind CSS | Responsive, accessible UI; Apple-inspired clarity; Linear-like density; Stripe-grade financial tables. |
| **State & API** | TanStack Query (server state), Axios (HTTP), React Hook Form + Zod (validation) | Resilient client communication with Spring Boot backend. |
| **Animation & Visuals** | Motion for React, Recharts (charts), Lucide React (icons) | Purposeful motion, animated numerical counting, interactive price trend charts. |
| **Primary Backend** | Java (OpenJDK 17), Spring Boot 3.x, Maven Wrapper | Authoritative application backend; handles authentication, business logic, calculations, and persistence. |
| **Security & Auth** | Spring Security, JWT (access + refresh tokens), BCrypt | User registration, authentication, role-based access control (`ROLE_FARMER`, `ROLE_ADMIN`). |
| **Database** | Supabase PostgreSQL (`ap-south-1` Mumbai) | Managed relational persistence; UUID primary keys; `NUMERIC(14,2)` for financial precision. |
| **Database Migrations** | Flyway | Version-controlled, reproducible SQL migrations (`db/migration/V*__*.sql`). |
| **AI/Dev Inspection** | Supabase MCP | Development-time schema inspection, query review, and log monitoring inside Google Antigravity. |
| **Processing Service** | Python 3.12, FastAPI, Pandas, OpenCV, Pillow | Specialized data processing, data cleaning, and Tomato computer-vision quality assessment. |
| **Operating System** | Windows 11 (PowerShell) | Host development environment. |

---

## 3. Connected Cloud & Services Metadata

* **Supabase Project Name:** `mandiwise-dev`
* **Supabase Project Reference:** `tzncfzzaquyvdhblzgdm`
* **Region:** `ap-south-1` (Mumbai, India)
* **Organization:** `hackathonais12@gmail.com's Org` (ID: `vpxhykwtgwytmlyswewd`)
* **Project Status:** `ACTIVE_HEALTHY`
* **MCP Integration:** Active via `supabase_mcp`

---

## 4. Strict Architecture & Development Guardrails

1. **Spring Boot is Authoritative:** Authoritative financial calculations, rankings, and user data operations reside in Java Spring Boot. The React frontend displays results; Python does not manage application state or direct database persistence.
2. **Supabase PostgreSQL Only:** MySQL, Firebase, or other secondary databases are strictly forbidden.
3. **Data Authenticity & Trust:**
   - Never fabricate market prices, buyers, schemes, or quality grades.
   - Always classify data: **Actual**, **Historical**, **Estimated**, **Predicted**, **Sample (Demo)**, or **Verified**.
   - Missing data must never be treated as zero prices or zero costs.
   - Every price must have an observation date, unit (`INR_PER_QUINTAL`), and traceable source.
4. **Phase-by-Phase Discipline:**
   - Follow `Project_Info/implementation_plan.md` strictly.
   - Never skip testing or jump phases. Cycle: `BUILD → TEST → FIX → DOCUMENT → REPORT → APPROVAL → NEXT PHASE`.
5. **No Direct Remote Git Operations:** Source code pushes to GitHub are managed manually by the user. Antigravity manages local Git commits and branch recommendations only.

---

## 5. Current Project Status

### Phase 0: Project Preparation — **COMPLETED**
* [x] Inspected workspace, tools, and runtimes (Node v22.19.0, OpenJDK 17.0.13, Python 3.12.10, Git 2.47.1).
* [x] Initialized local Git repository and created comprehensive `.gitignore`.
* [x] Harmonized all 6 project documents in `Project_Info/`:
  - Resolved `Database: MySQL` typo in `appflow.md` to `Supabase PostgreSQL`.
  - Normalized `implementation_pplan.md` to `implementation_plan.md`.
  - Updated tool references from "Claude Code" to "Google Antigravity".
* [x] Successfully provisioned Supabase PostgreSQL project `mandiwise-dev` (`tzncfzzaquyvdhblzgdm`) in `ap-south-1`.
* [x] Organized living tracking documents into dedicated `Project_Tracking/` folder:
  - `Project_Tracking/MANDIWISE_CONTEXT.md`
  - `Project_Tracking/ARCHITECTURE.md`
  - `Project_Tracking/FEATURE_TRACKER.md`
  - `Project_Tracking/DEVELOPMENT_LOG.md`
  - `Project_Tracking/API_DOCUMENTATION.md`
  - `Project_Tracking/DATABASE_SCHEMA.md`
  - `Project_Tracking/TESTING_STRATEGY.md`

### Immediate Next Target: **Phase 1 (Environment & Supabase Setup)**
* Establish `frontend/` (React + TypeScript + Tailwind CSS + Vite).
* Establish `backend/` (Spring Boot 3.x with Maven Wrapper `./mvnw.cmd` and initial JPA/Flyway setup).
* Establish `python-service/` (FastAPI baseline with health check).
* Connect Spring Boot backend to `mandiwise-dev` Supabase PostgreSQL instance via JDBC with SSL.
* Verify independent startup of all 3 services.
