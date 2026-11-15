# MandiWise — Development Log

**Project:** MandiWise  
**Lead Engineer / Architect:** Lead Software Architect (Google Antigravity)  

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
