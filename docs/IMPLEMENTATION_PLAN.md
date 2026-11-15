# MandiWise – Implementation Plan

**Document Version:** 1.0  
**Project:** MandiWise  
**Project Type:** Agricultural Market Decision Support Platform  
**Initial Geographic Scope:** Karnataka, India  
**Frontend:** React + TypeScript + Tailwind CSS  
**Backend:** Java + Spring Boot  
**Database:** Supabase PostgreSQL  
**Database Development Integration:** Supabase MCP  
**Processing Service:** Python + FastAPI  
**Development Approach:** Incremental, Phase-by-Phase Implementation  
**Team Size:** 2 Developers  
**Status:** Approved Development Roadmap

---

# 1. Introduction

## 1.1 Purpose

This document defines the implementation roadmap for MandiWise.

It converts the requirements, architecture, design decisions, application flows, and database schema into an actionable development sequence.

It specifies:

- Development phases.
- Implementation tasks.
- Technology setup.
- Feature dependencies.
- Testing requirements.
- Expected deliverables.
- Phase completion criteria.
- Approval checkpoints.
- Integration strategy.
- Development responsibilities.

This document will be used as the primary execution guide throughout the project.

## 1.2 Project Development Philosophy

MandiWise will not be developed by implementing every feature simultaneously.

Development will follow an incremental process.

The guiding principle is:

**Understand → Design → Implement → Test → Fix → Validate → Document → Approve**

Each phase must be completed and validated before dependent work begins.

The team must prioritise a reliable working application over a large collection of partially implemented features.

## 1.3 Core Development Principles

1. Build the core market-comparison functionality first.
2. Prioritise real and verifiable agricultural data.
3. Establish the database and backend foundation before implementing complex frontend workflows.
4. Maintain consistency with the approved UI/UX design.
5. Use reusable frontend components.
6. Keep Spring Boot as the primary backend.
7. Use Supabase PostgreSQL as the managed database.
8. Use Python only for specialised processing tasks.
9. Test each feature independently.
10. Avoid implementing features that depend on unavailable or unreliable data.
11. Maintain clear separation between actual, sample, estimated, and predicted information.
12. Do not move to the next phase until the current phase passes its acceptance criteria.

---

# 2. Development Strategy

## 2.1 Overall Development Sequence

The project will follow this sequence:

```text
PHASE 0
Project Preparation
       |
       v
PHASE 1
Environment and Supabase Setup
       |
       v
PHASE 2
Data Feasibility and Research
       |
       v
PHASE 3
UI Foundation and Design System
       |
       v
PHASE 4
Backend Foundation and Authentication
       |
       v
PHASE 5
Core Market Data Module
       |
       v
PHASE 6
Market Comparison and Recommendation Engine
       |
       v
PHASE 7
Historical Price Trends
       |
       v
PHASE 8
Quality Assessment
       |
       v
PHASE 9
Buyer Discovery
       |
       v
PHASE 10
Government Schemes and Agricultural Insights
       |
       v
PHASE 11
Dashboard and Feature Integration
       |
       v
PHASE 12
Admin and Data Management
       |
       v
PHASE 13
System-Wide Testing and Refinement
       |
       v
PHASE 14
Deployment and Final Validation
```

Some supporting work may overlap when dependencies allow, but the core sequence must be respected.

## 2.2 Development Priority

Features will be classified into three implementation priorities.

### P0 – Core MVP

Essential for the primary purpose of MandiWise.

- Project infrastructure.
- Supabase database.
- User registration and login.
- Farmer profile.
- Commodity selection.
- Karnataka market data.
- Market-price retrieval.
- Transportation cost estimation.
- Gross revenue calculation.
- Estimated net earnings calculation.
- Market ranking.
- Market comparison results.
- Basic historical price trends.
- Basic farmer dashboard.

### P1 – Important Supporting Features

Implemented after the core workflow is reliable.

- Tomato quality assessment.
- Buyer discovery.
- Government schemes.
- Agricultural insights.
- Crop-related information.
- Administrative data management.
- Enhanced dashboard analytics.

### P2 – Future Enhancements

Not required for the initial MVP.

- Advanced price forecasting.
- Additional states and markets.
- More commodity-specific ML models.
- Advanced geographic visualisation.
- Mobile application.
- Automated notifications.
- Advanced buyer matching.
- Advanced transport integrations.

---

# 3. Phase 0 – Project Preparation

## Objective

Establish the project structure, documentation, development workflow, and shared understanding before writing application code.

## 3.1 Tasks

### Task 1: Organise Project Documentation

Create the following directory:

```text
MandiWise/
    docs/
        PRD.md
        TRD.md
        UI_UX_DESIGN_BRIEF.md
        APP_FLOW.md
        BACKEND_SCHEMA.md
        IMPLEMENTATION_PLAN.md
```

All six approved documents must be maintained in this directory.

### Task 2: Establish Git Repository

Create a shared Git repository.

Recommended initial branches:

```text
main
develop
feature/*
```

Branch responsibilities:

- `main`: Stable and validated code.
- `develop`: Integrated development code.
- `feature/*`: Individual feature development.

### Task 3: Establish Development Rules

Agree on:

- Folder structure.
- Naming conventions.
- API response conventions.
- Database migration strategy.
- Git commit practices.
- Code formatting.
- Testing expectations.
- Feature approval process.

### Task 4: Read and Understand Documentation

Before implementation, the development team and AI coding assistants must understand all six documents.

The documents should be treated as the project's source of truth.

## Deliverables

- Organised project directory.
- Git repository.
- Documentation files.
- Agreed development conventions.

## Acceptance Criteria

- All six documents are present.
- Repository is accessible to both developers.
- Project structure is established.
- No conflicting architectural decisions remain unresolved.

**Approval Gate:** Do not begin application development until the project structure and documentation are ready.

---

# 4. Phase 1 – Environment and Supabase Setup

## Objective

Set up the development environment, database infrastructure, and AI-assisted database workflow.

This phase establishes the foundation for all subsequent development.

## 4.1 Frontend Environment

Install and configure:

- Node.js.
- npm.
- React.
- TypeScript.
- Vite.
- Tailwind CSS.
- React Router.
- Axios.
- TanStack Query.
- React Hook Form.
- Zod.
- Recharts.
- Lucide React.
- Motion for React.

Create the initial frontend project.

Suggested structure:

```text
frontend/
    public/
    src/
        assets/
        components/
        layouts/
        pages/
        routes/
        hooks/
        services/
        context/
        utils/
        types/
        styles/
        App.tsx
        main.tsx
    package.json
    tsconfig.json
    vite.config.ts
```

Do not implement the full application yet.

Only establish the development environment and confirm that the application runs.

## 4.2 Java Backend Environment

Install and configure:

- Java JDK.
- Maven.
- Spring Boot.
- Spring Web.
- Spring Data JPA.
- Spring Security.
- PostgreSQL JDBC Driver.
- Bean Validation.
- Flyway.
- JUnit 5.
- Mockito.

Create the initial Spring Boot application.

Suggested structure:

```text
backend/
    src/
        main/
            java/
                com/
                    mandiwise/
                        config/
                        security/
                        common/
                        user/
                        farmer/
                        market/
                        commodity/
                        price/
                        recommendation/
                        transport/
                        integration/
            resources/
                application.yml
                db/
                    migration/
        test/
    pom.xml
```

## 4.3 Python Environment

Create a separate Python project.

Suggested structure:

```text
python-service/
    app/
        api/
        services/
        models/
        schemas/
        utils/
        main.py
    tests/
    requirements.txt
```

Install the initial dependencies:

- FastAPI.
- Uvicorn.
- Pandas.
- NumPy.
- Pytest.

Install OpenCV and Scikit-learn when their respective features are introduced.

Do not build the ML functionality during this phase.

## 4.4 Supabase Project Setup

Create a dedicated Supabase development project.

Configure:

1. Project name.
2. Database access.
3. Database credentials.
4. Connection method.
5. Development environment access.
6. Appropriate database permissions.

The actual project credentials must be stored securely.

Do not place credentials inside committed source files.

## 4.5 Supabase MCP Integration

Configure the official Supabase MCP integration with Google Antigravity.

The intended workflow is:

```text
Developer
    |
    v
Google Antigravity
    |
    v
Supabase MCP
    |
    v
Supabase Development Database
```

Verify that Google Antigravity can perform the intended development operations.

Start with read-only inspection wherever possible.

Test:

- Database connection.
- Schema inspection.
- Table listing.
- SQL inspection.
- Database metadata retrieval.

Do not permit unreviewed destructive operations.

Keep migration files in Git even when MCP assists with database operations.

## 4.6 Backend Database Connection

Configure Spring Boot to connect to Supabase PostgreSQL.

Use:

- PostgreSQL JDBC.
- Spring Data JPA.
- Environment variables.
- SSL-compatible connection settings.
- Flyway for migrations.

Verify that Spring Boot can establish a database connection.

## Deliverables

- Working React development environment.
- Working Spring Boot development environment.
- Working Python environment.
- Supabase development project.
- Verified Supabase MCP integration.
- Successful Spring Boot database connection.

## Testing

- Frontend starts successfully.
- Backend starts successfully.
- Python service starts successfully.
- Spring Boot connects to PostgreSQL.
- Google Antigravity can inspect the intended Supabase development project.
- No secrets are committed to Git.

## Acceptance Criteria

All development services must run independently.

The backend must successfully connect to Supabase PostgreSQL.

**Approval Gate:** Do not begin application feature development until all required environments and connections work.

---

# 5. Phase 2 – Data Feasibility and Research

## Objective

Investigate agricultural market data availability and establish the actual data scope for the initial Karnataka implementation.

This is one of the most important phases of MandiWise.

The quality of the application's recommendations depends directly on the quality of its market-price data.

## 5.1 Identify Data Sources

Investigate:

- AGMARKNET.
- data.gov.in.
- Relevant official agricultural datasets.

Determine:

- Available access methods.
- API availability.
- Data licensing.
- Historical coverage.
- Update frequency.
- Commodity coverage.
- Market coverage.
- Price units.
- Missing records.
- Data consistency.

Do not assume that an API is available or that every dataset provides real-time information.

## 5.2 Select Initial Commodities

Select a small number of commodities based on actual data availability.

The initial research should investigate at least two commodities.

Potential candidates:

- Tomato.
- Onion.
- Potato.
- Other suitable Karnataka agricultural commodities.

The final selection must be based on dataset quality rather than convenience.

## 5.3 Select Initial Markets

Identify Karnataka markets that have sufficiently reliable records for the selected commodities.

Consider:

- Historical coverage.
- Availability of recent records.
- Market identification consistency.
- Geographic distribution.
- Data completeness.

Avoid selecting too many markets before verifying their data.

## 5.4 Dataset Analysis

Use Python and Pandas to inspect the collected data.

Analyse:

- Missing values.
- Duplicate records.
- Invalid prices.
- Inconsistent commodity names.
- Inconsistent market names.
- Date formatting.
- Price-unit differences.
- Historical gaps.

## 5.5 Define Data Eligibility Rules

Establish rules for which records are eligible for recommendations.

For example:

- Records must pass validation.
- Observation dates must be available.
- Price units must be understood.
- The selected commodity and market must be correctly identified.
- Data freshness must satisfy the agreed policy.

The exact freshness threshold must be based on source behaviour and project testing.

## 5.6 Establish Initial Data Scope

Create a documented list of:

- Supported commodities.
- Supported markets.
- Data sources.
- Historical date range.
- Known data limitations.
- Expected update frequency.
- Data validation rules.

## Deliverables

- Data feasibility report.
- Initial dataset.
- Selected commodities.
- Selected Karnataka markets.
- Data-cleaning rules.
- Data freshness policy.
- Data-source documentation.

## Testing

Validate sample records manually against their source.

Check whether the same records are interpreted consistently after preprocessing.

## Acceptance Criteria

- At least two suitable commodities have been investigated.
- The selected market coverage is supported by actual data.
- Price units are understood.
- Missing-data behaviour is documented.
- Data sources are traceable.
- The team can justify the selected initial scope.

**Approval Gate:** Do not build the recommendation engine until the team has a sufficiently reliable dataset and an agreed data-eligibility policy.

---

# 6. Phase 3 – UI Foundation and Design System

## Objective

Build the visual foundation of MandiWise before implementing the complete application workflows.

The UI must follow the approved `UI_UX_DESIGN_BRIEF.md`.

Visual quality is a major project requirement, not a final-stage enhancement.

## 6.1 Design System Setup

Establish:

- Colour palette.
- Typography.
- Spacing system.
- Border-radius conventions.
- Shadows.
- Buttons.
- Form fields.
- Cards.
- Navigation components.
- Dialogs.
- Notifications.
- Loading states.

Use the approved visual identity.

## 6.2 Typography

Use:

- Inter for primary interface typography.
- Noto Sans Kannada for Kannada text.

Ensure that both fonts render consistently.

## 6.3 Core Reusable Components

Create reusable components for:

- Buttons.
- Inputs.
- Select menus.
- Cards.
- Badges.
- Tables.
- Tabs.
- Modals.
- Tooltips.
- Navigation items.
- Loading indicators.
- Empty states.
- Error states.
- Data-status labels.

## 6.4 Animation Foundation

Configure Motion for React.

Establish reusable animation patterns for:

- Page transitions.
- Element entrance.
- Hover interactions.
- Button feedback.
- Card transitions.
- Scroll reveals.
- Loading states.

Animation must be smooth and purposeful.

Avoid excessive motion that affects usability or performance.

## 6.5 Landing Page

Implement the public landing page.

The hero section must use the approved image-led visual direction.

Expected visual elements:

- Cinematic Karnataka countryside.
- Sophisticated agricultural landscape illustration.
- Layered environmental elements.
- Atmospheric depth.
- Animated leaves and subtle environmental movement.
- Carefully staggered text and CTA entrance.
- Parallax where appropriate.
- Strong visual hierarchy.

The design must feel premium and original.

It must not look like a generic college project landing page.

## 6.6 Responsive Design

Validate layouts at:

- Desktop.
- Laptop.
- Tablet.
- Mobile.

Do not postpone mobile responsiveness until the end.

## Deliverables

- Design system.
- Reusable component library.
- Landing page.
- Responsive layouts.
- Animation foundation.

## Testing

- Components render correctly.
- Responsive layouts work.
- Animations remain smooth.
- Reduced-motion preferences are respected.
- Keyboard navigation works for interactive elements.
- Visual consistency is maintained.

## Acceptance Criteria

The landing page and design system must satisfy the approved visual direction.

**Approval Gate:** Review and approve the visual foundation before building the complete application interface.

---

# 7. Phase 4 – Backend Foundation and Authentication

## Objective

Establish the core Spring Boot architecture, database schema foundation, and secure authentication.

## 7.1 Spring Boot Architecture

Implement the initial modular backend structure.

Create:

- Configuration.
- Security.
- Common utilities.
- Exception handling.
- DTO conventions.
- Entity conventions.
- Repository conventions.
- Service conventions.
- Controller conventions.

## 7.2 Database Migrations

Create initial Flyway migrations for:

- Users.
- Roles.
- User-role mapping.
- Farmer profiles.
- Farms.

Follow `BACKEND_SCHEMA.md`.

The database schema must be managed through version-controlled migration files.

## 7.3 Authentication

Implement:

- Registration.
- Login.
- Logout.
- Password hashing.
- Authentication.
- Authorisation.
- Protected API endpoints.

Use Spring Security.

JWT-based authentication may be used with an appropriate secure refresh-token strategy.

The precise token-storage and refresh approach must be finalised before frontend authentication integration.

## 7.4 Role-Based Access Control

Implement:

- FARMER.
- ADMIN.

Ensure that backend endpoints enforce role permissions.

## 7.5 Farmer Profile

Implement:

- Farmer profile creation.
- Profile retrieval.
- Profile updates.
- Farm registration.
- Farm retrieval.

## 7.6 Frontend Authentication Integration

Build:

- Registration page.
- Login page.
- Form validation.
- Authentication state management.
- Protected routes.
- Logout flow.
- Error handling.

## Deliverables

- Working backend foundation.
- Database migrations.
- Registration.
- Login.
- Farmer profile management.
- Role-based access control.
- Protected frontend routes.

## Testing

Test:

- Valid registration.
- Duplicate email handling.
- Invalid credentials.
- Password hashing.
- Authentication failure.
- Protected endpoints.
- Farmer access restrictions.
- Admin access restrictions.
- Profile creation and retrieval.

## Acceptance Criteria

A farmer must be able to register, log in, access protected pages, and manage basic profile information.

Unauthorised users must not access protected application resources.

**Approval Gate:** Authentication and user management must pass testing before proceeding.

---

# 8. Phase 5 – Core Market Data Module

## Objective

Implement the commodity, market, and market-price infrastructure.

This phase establishes the actual agricultural data that powers MandiWise.

## 8.1 Database Implementation

Create migrations for:

- Commodities.
- Markets.
- Data sources.
- Ingestion batches.
- Market prices.

Implement constraints and indexes.

## 8.2 Data Preprocessing

Use Python and Pandas to build a preprocessing pipeline.

Tasks:

1. Load source records.
2. Standardise commodity names.
3. Standardise market names.
4. Parse observation dates.
5. Validate price values.
6. Standardise units.
7. Handle duplicates.
8. Identify missing values.
9. Produce validated output.

Do not discard the original source information.

## 8.3 Data Ingestion

Implement an ingestion workflow.

The workflow should:

1. Retrieve data from the approved source.
2. Parse incoming records.
3. Validate records.
4. Resolve commodity and market identifiers.
5. Insert accepted records.
6. Record rejected records.
7. Update ingestion statistics.
8. Preserve source references.

The actual data-retrieval mechanism will depend on the verified source.

Do not build an assumed API integration before investigating the source.

## 8.4 Market APIs

Implement endpoints for:

- Listing supported commodities.
- Listing supported markets.
- Retrieving market information.
- Retrieving market prices.
- Filtering by commodity.
- Filtering by district.
- Filtering by market.
- Retrieving the latest eligible observation.

## 8.5 Frontend Market Pages

Build:

- Market prices page.
- Commodity selection.
- District filtering.
- Market filtering.
- Price tables.
- Market detail pages.
- Data freshness labels.
- Loading and error states.

Every displayed price must include its observation date and unit.

## Deliverables

- Market and commodity database.
- Data ingestion pipeline.
- Validated price records.
- Market APIs.
- Market prices interface.
- Market detail interface.

## Testing

- Compare ingested records with source records.
- Test duplicate handling.
- Test invalid records.
- Test missing prices.
- Test filtering.
- Test sorting.
- Test date handling.
- Test unit consistency.

## Acceptance Criteria

The application must retrieve and display validated market-price observations from the selected data source.

A user must be able to identify the commodity, market, price, unit, and observation date.

**Approval Gate:** Do not implement market recommendations until the market-price module is reliable.

---

# 9. Phase 6 – Market Comparison and Recommendation Engine

## Objective

Implement the primary functionality of MandiWise.

A farmer should be able to enter their produce quantity and location and compare markets based on estimated net earnings.

This is the most important phase of the project.

## 9.1 Farmer Input Interface

Build the market-comparison form.

Required inputs:

- Commodity.
- Quantity.
- Quantity unit.
- Farmer's location.
- Optional origin farm.
- Other necessary transport information.

The interface must validate all inputs.

## 9.2 Transportation Estimation

Implement the initial transportation estimation mechanism.

Use an approved distance source or clearly documented distance-estimation method.

The initial cost model may use:

```text
Estimated Transport Cost =
Estimated Road Distance × Configured Cost Per KM
```

Do not treat straight-line distance as road distance.

Do not present estimates as confirmed transport quotations.

## 9.3 Financial Calculation Engine

Implement calculations in Java using `BigDecimal`.

### Quantity Conversion

```text
1 Quintal = 100 KG
```

### Gross Revenue

```text
Gross Revenue =
(Quantity in KG / 100) × Expected Price Per Quintal
```

### Total Expenses

```text
Total Expenses =
Transportation Cost + Other Applicable Expenses
```

### Estimated Net Earnings

```text
Estimated Net Earnings =
Gross Revenue - Total Expenses
```

Ensure that calculations use consistent units and appropriate rounding.

## 9.4 Market Recommendation Logic

For every eligible market:

1. Retrieve the appropriate price observation.
2. Validate its status.
3. Check data freshness.
4. Determine the expected price.
5. Calculate gross revenue.
6. Estimate transport cost.
7. Add applicable expenses.
8. Calculate estimated net earnings.
9. Rank the market.

Markets must be ranked by estimated net earnings.

## 9.5 Recommendation Persistence

Create and use:

- Recommendation requests.
- Recommendation results.

Store the calculation assumptions and market-price reference used.

Old results must remain understandable even when market prices or transport configurations change.

## 9.6 Results Interface

Build a polished results page showing:

- Best-ranked market.
- Estimated gross revenue.
- Estimated transport cost.
- Other expenses, where applicable.
- Estimated net earnings.
- Ranking of alternative markets.
- Expected price.
- Price observation date.
- Data freshness.
- Calculation assumptions.

Use clear visual hierarchy to highlight the best estimated outcome.

Do not hide uncertainty or limitations.

## 9.7 Market Comparison Visualisation

Provide:

- Ranked market cards.
- Financial comparison.
- Estimated expense breakdown.
- Price comparison.
- Distance information.
- Clear recommendation explanation.

## Deliverables

- Recommendation API.
- Financial calculation engine.
- Transportation estimation.
- Market-ranking engine.
- Recommendation database records.
- Market comparison interface.
- Results page.

## Testing

Create independently verified test cases.

Example:

```text
Quantity = 500 KG
Expected Price = ₹2,400 per Quintal
Transport Cost = ₹1,000
Other Expenses = ₹200
```

Expected calculations:

```text
Quantity in Quintals = 5

Gross Revenue =
5 × 2400

Gross Revenue = ₹12,000

Total Expenses =
1000 + 200

Total Expenses = ₹1,200

Estimated Net Earnings =
12000 - 1200

Estimated Net Earnings = ₹10,800
```

This is a calculation test example, not an actual market recommendation.

Also test:

- Different market prices.
- Different transportation expenses.
- Missing market data.
- Invalid market-price records.
- Outdated records.
- Zero or negative quantities.
- Markets with incomplete cost estimates.
- Equal estimated net earnings.

## Acceptance Criteria

A farmer must be able to submit a valid comparison request and receive correctly calculated, ranked market results.

Every result must be traceable to its underlying price observation and calculation assumptions.

**Approval Gate:** This phase must pass extensive calculation and integration testing before the team proceeds.

---

# 10. Phase 7 – Historical Price Trends

## Objective

Allow farmers to understand historical price movements for selected commodities and markets.

## 10.1 Backend

Implement APIs to retrieve historical prices.

Support:

- Commodity filtering.
- Market filtering.
- Date ranges.
- Historical price records.
- Aggregated statistics where appropriate.

## 10.2 Frontend

Build the price-trends page.

Include:

- Line charts.
- Historical price tables.
- Date filters.
- Market comparisons.
- Commodity selection.
- Price statistics.

Use Recharts.

## 10.3 Data Handling

Historical records must:

- Preserve original observation dates.
- Preserve units.
- Exclude invalid records.
- Display missing-data gaps appropriately.
- Distinguish historical observations from predictions.

## 10.4 Optional Future Work

Price forecasting may be introduced later if the dataset is sufficiently large and suitable.

It is not required for this phase.

## Deliverables

- Historical price APIs.
- Price-trends interface.
- Interactive charts.
- Historical data filtering.

## Testing

- Verify chart values against stored records.
- Test date filtering.
- Test missing observations.
- Test different commodities.
- Test different markets.
- Test empty historical ranges.

## Acceptance Criteria

Farmers must be able to inspect historical price trends using actual validated observations.

**Approval Gate:** Approve the historical data and chart behaviour before proceeding.

---

# 11. Phase 8 – Tomato Quality Assessment

## Objective

Introduce image-based tomato quality assessment as a supporting feature.

This phase must be implemented only after the core market-comparison workflow is stable.

## 11.1 Dataset Research

Investigate suitable tomato image datasets.

Evaluate:

- Image quality.
- Dataset size.
- Label accuracy.
- Defect categories.
- Class balance.
- Licensing.
- Suitability for the intended assessment.

Do not assume that a publicly available dataset is suitable without inspection.

## 11.2 Image Processing Pipeline

Build the initial Python processing workflow.

Tasks:

1. Accept an image.
2. Validate file type.
3. Validate image size.
4. Preprocess the image.
5. Extract supported visual characteristics.
6. Run the selected assessment method.
7. Return structured results.

## 11.3 Model Development

Evaluate suitable approaches.

Potential approaches include:

- Traditional image processing.
- Classical machine learning.
- Suitable image-classification models.

Choose the simplest method that performs reliably on the available dataset.

Do not introduce a complex deep-learning architecture without justification.

## 11.4 Python API

Create an image-assessment endpoint.

It should return structured output containing:

- Assessment status.
- Supported visible characteristics.
- Classification results, where available.
- Confidence information, where meaningful.
- Model version.
- Limitations.

## 11.5 Java Integration

Spring Boot must manage:

- Assessment requests.
- Image storage references.
- Communication with Python.
- Result validation.
- Assessment persistence.

## 11.6 Frontend

Build:

- Image upload.
- Image preview.
- Assessment progress.
- Results presentation.
- Confidence and limitation information.

## Deliverables

- Image-processing pipeline.
- Initial tomato assessment method.
- Python API.
- Java integration.
- Quality-assessment interface.

## Testing

- Valid images.
- Unsupported file types.
- Oversized images.
- Corrupted images.
- Different lighting conditions.
- Different image backgrounds.
- Model performance on a held-out dataset.
- Python service failure.

## Acceptance Criteria

The system must return a meaningful assessment for supported inputs and communicate limitations clearly.

It must not claim to identify internal quality or guarantee a market grade.

Quality-based price estimation must remain disabled unless reliable grade-to-price evidence is established.

**Approval Gate:** Model performance and limitations must be reviewed before presenting the feature as usable.

---

# 12. Phase 9 – Buyer Discovery

## Objective

Allow farmers to discover buyers associated with supported commodities and locations.

## 12.1 Backend

Implement:

- Buyer records.
- Buyer-commodity relationships.
- Buyer filtering.
- Buyer detail retrieval.
- Verification status.
- Administrative verification workflows.

## 12.2 Frontend

Build:

- Buyer discovery page.
- Buyer cards.
- Commodity filtering.
- District filtering.
- Buyer details.
- Contact information where approved.
- Verification badges.

## 12.3 Verification Workflow

Support the following statuses:

- UNVERIFIED.
- PENDING_VERIFICATION.
- VERIFIED.
- REJECTED.

Only actual verification actions should change a buyer's verification status.

## Deliverables

- Buyer database.
- Buyer APIs.
- Buyer discovery interface.
- Buyer detail page.
- Verification workflow.

## Testing

- Buyer filtering.
- Buyer status handling.
- Commodity relationships.
- Access permissions.
- Contact information handling.

## Acceptance Criteria

Farmers must be able to discover relevant buyers and clearly distinguish verified from unverified listings.

The platform must not imply that a buyer has committed to purchasing produce unless that commitment is confirmed.

**Approval Gate:** Buyer information and verification behaviour must be validated before launch.

---

# 13. Phase 10 – Government Schemes and Agricultural Insights

## Objective

Provide useful agricultural information and government scheme information.

## 13.1 Government Schemes

Implement:

- Scheme listing.
- Scheme details.
- Eligibility summaries.
- Benefit summaries.
- Application information.
- Source information.
- Last-verified date.
- Scheme status.

Use official sources wherever possible.

## 13.2 Agricultural Insights

Implement:

- Agricultural articles.
- Crop information.
- Crop rotation information.
- Commodity-related insights.
- District-specific information where supported.

## 13.3 Data Verification

Information must be reviewed before publication.

The system must distinguish:

- Official information.
- General educational information.
- Unverified information.
- Outdated information.

Potential eligibility must not be represented as confirmed eligibility.

## Deliverables

- Scheme database.
- Scheme APIs.
- Scheme listing and detail pages.
- Agricultural insights database.
- Insights APIs.
- Insights interface.

## Testing

- Source information.
- Date handling.
- Status handling.
- Commodity relationships.
- Filtering.
- Empty states.

## Acceptance Criteria

Users must be able to access clearly sourced agricultural information and government scheme details.

**Approval Gate:** Verify the reliability and presentation of information before making these features available.

---

# 14. Phase 11 – Farmer Dashboard and Feature Integration

## Objective

Bring the completed modules together into a coherent farmer dashboard.

The dashboard should provide a useful overview rather than simply displaying unrelated cards.

## 14.1 Dashboard Components

Potential components:

- Welcome section.
- Farmer profile summary.
- Quick market comparison.
- Recent recommendation.
- Best available market result.
- Recent market prices.
- Price trend summary.
- Relevant agricultural insights.
- Scheme information.
- Quality-assessment history, if implemented.

Only display information that the backend can actually provide.

## 14.2 API Integration

Integrate the dashboard with the completed backend modules.

Use TanStack Query for server-state management.

Implement:

- Loading states.
- Error states.
- Empty states.
- Refresh behaviour.
- Data freshness indicators.

## 14.3 Visual Refinement

Ensure:

- Consistent card design.
- Clear information hierarchy.
- Responsive layouts.
- Smooth transitions.
- Readable charts.
- Appropriate visual emphasis.

## Deliverables

- Farmer dashboard.
- Integrated API data.
- Dashboard loading and error states.
- Responsive dashboard layout.

## Testing

- New farmer with no historical activity.
- Farmer with previous recommendations.
- Missing market data.
- Partial API failure.
- Mobile layout.
- Dashboard refresh.

## Acceptance Criteria

The dashboard must present useful, accurate information and must not rely on hardcoded values disguised as real data.

**Approval Gate:** Approve the complete farmer-facing application experience.

---

# 15. Phase 12 – Admin and Data Management

## Objective

Provide administrative tools for maintaining the reliability of MandiWise data.

## 15.1 Admin Dashboard

Create an administrative overview containing:

- Data ingestion status.
- Total markets.
- Total commodities.
- Market-price record counts.
- Rejected records.
- Recent ingestion failures.
- Pending buyer verification.
- Data-management alerts.

## 15.2 Data Management

Implement suitable administrative workflows for:

- Commodity management.
- Market management.
- Price-data review.
- Data-source management.
- Ingestion monitoring.
- Buyer verification.
- Scheme updates.
- Agricultural insight management.

## 15.3 Audit Logging

Record important administrative actions.

Maintain traceability for changes that affect application data.

## 15.4 Access Control

All administrative operations must be protected by backend role checks.

## Deliverables

- Admin dashboard.
- Data-management interfaces.
- Ingestion monitoring.
- Buyer verification interface.
- Audit logging.

## Testing

- Farmer cannot access admin APIs.
- Admin can access permitted operations.
- Invalid changes are rejected.
- Audit records are generated.
- Data-management operations preserve integrity.

## Acceptance Criteria

Administrators must be able to manage approved data workflows without compromising the integrity of historical market records.

**Approval Gate:** Review administrative permissions and workflows before final testing.

---

# 16. Phase 13 – System-Wide Testing and Refinement

## Objective

Test the complete application as one integrated system.

Individual modules may work independently but still fail when connected.

This phase identifies and resolves those issues.

## 16.1 Functional Testing

Test all major workflows.

### User Workflow

```text
Registration
    |
    v
Login
    |
    v
Farmer Profile
    |
    v
Dashboard
```

### Market Comparison Workflow

```text
Select Commodity
    |
    v
Enter Quantity
    |
    v
Select Location
    |
    v
Retrieve Market Prices
    |
    v
Estimate Transportation
    |
    v
Calculate Net Earnings
    |
    v
Rank Markets
    |
    v
Display Results
```

### Historical Trends Workflow

```text
Select Commodity
    |
    v
Select Market
    |
    v
Choose Date Range
    |
    v
Retrieve Historical Prices
    |
    v
Display Charts
```

### Quality Assessment Workflow

```text
Upload Tomato Image
    |
    v
Validate Image
    |
    v
Process Image
    |
    v
Run Assessment
    |
    v
Validate Result
    |
    v
Display Assessment
```

### Buyer Discovery Workflow

```text
Open Buyer Discovery
    |
    v
Select Commodity
    |
    v
Filter Location
    |
    v
Retrieve Buyers
    |
    v
Display Verification Status
```

## 16.2 Backend Testing

Test:

- API responses.
- Authentication.
- Authorisation.
- Business logic.
- Database transactions.
- Validation.
- Exception handling.
- External-service failures.

## 16.3 Frontend Testing

Test:

- Navigation.
- Form validation.
- Responsive behaviour.
- API integration.
- Loading states.
- Error states.
- Empty states.
- Accessibility.
- Animation performance.

## 16.4 Database Testing

Test:

- Migration execution.
- Foreign keys.
- Constraints.
- Indexes.
- Duplicate prevention.
- Data integrity.
- User-data isolation.
- Historical record preservation.

## 16.5 Financial Accuracy Testing

Independently verify:

- Quantity conversion.
- Gross revenue.
- Transportation cost.
- Other expenses.
- Total expenses.
- Estimated net earnings.
- Market ranking.

No financial calculation should be accepted solely because the frontend displays a plausible number.

## 16.6 Security Testing

Test:

- Invalid authentication.
- Unauthorised API access.
- Role restrictions.
- Access to another farmer's data.
- Input validation.
- File-upload restrictions.
- Credential exposure.
- Administrative permissions.

## 16.7 Performance Testing

Evaluate:

- Page loading.
- API response time.
- Database query performance.
- Chart rendering.
- Image processing.
- Large market-price result sets.

Performance targets should be established from actual testing rather than invented in advance.

## 16.8 Visual Quality Review

Review the complete application against `UI_UX_DESIGN_BRIEF.md`.

Check:

- Visual consistency.
- Typography.
- Spacing.
- Responsive layouts.
- Animation quality.
- Chart readability.
- Accessibility.
- Loading and error states.

## Deliverables

- Test reports.
- Bug list.
- Fixed issues.
- Verified financial calculations.
- Security review.
- Visual review.
- Final integration build.

## Acceptance Criteria

All critical workflows must pass.

No unresolved critical or high-severity issue should remain.

**Approval Gate:** The team must approve the integrated application before deployment.

---

# 17. Phase 14 – Deployment and Final Validation

## Objective

Deploy the validated application and confirm that it works in the intended environment.

## 17.1 Deployment Preparation

Select appropriate hosting providers for:

- React frontend.
- Spring Boot backend.
- Python service.

Supabase will continue to provide the managed PostgreSQL database.

Hosting choices must consider:

- Cost.
- Free-tier limitations.
- Reliability.
- Deployment complexity.
- Environment configuration.
- Resource requirements.

## 17.2 Environment Configuration

Maintain separate development and production configurations.

Configure:

- Database connection.
- API base URLs.
- JWT secrets.
- Python service URL.
- Storage configuration.
- CORS.
- Logging.
- HTTPS.

Production credentials must never be reused in public development examples.

## 17.3 Database Deployment

Before deployment:

1. Verify production database configuration.
2. Review all pending migrations.
3. Confirm migration order.
4. Back up existing data where applicable.
5. Apply migrations.
6. Verify table structures.
7. Test backend connectivity.

## 17.4 Application Deployment

Deploy:

1. Spring Boot backend.
2. Python processing service.
3. React frontend.

Verify communication between all services.

## 17.5 Final Validation

Test the deployed application using real supported workflows.

Check:

- Registration.
- Login.
- Dashboard.
- Market prices.
- Market comparison.
- Net earnings.
- Historical trends.
- Supporting features.
- Admin access.
- Mobile responsiveness.

## Deliverables

- Deployed application.
- Production configuration.
- Database migration record.
- Deployment documentation.
- Final validation report.

## Acceptance Criteria

The deployed application must function correctly and securely.

**Final Approval Gate:** The project is considered ready for demonstration only after the deployed application passes the agreed validation checklist.

---

# 18. Two-Person Development Coordination

The project will be developed by two people.

Responsibilities should be divided according to module ownership while maintaining shared architectural understanding.

## 18.1 Suggested Responsibility Distribution

### Developer A – Backend and Data

Primary responsibilities:

- Supabase database.
- Database migrations.
- Spring Boot backend.
- Authentication.
- API development.
- Market-price ingestion.
- Data validation.
- Recommendation calculations.
- Python processing integration.
- Backend testing.

### Developer B – Frontend and Integration

Primary responsibilities:

- UI implementation.
- Design system.
- Landing page.
- Responsive layouts.
- Dashboard.
- Market pages.
- Forms.
- Charts.
- Animations.
- Frontend API integration.
- Frontend testing.

## 18.2 Shared Responsibilities

Both developers should participate in:

- Requirement discussions.
- Architecture decisions.
- Database schema reviews.
- API contract reviews.
- Integration testing.
- Financial calculation verification.
- Final validation.

## 18.3 Collaboration Rules

1. Agree on API contracts before implementing dependent frontend features.
2. Communicate database schema changes.
3. Use Git branches for separate tasks.
4. Review changes before merging.
5. Avoid modifying the same module independently without coordination.
6. Maintain shared documentation.
7. Test integration after every major feature.
8. Ensure both developers understand the complete application workflow.

The responsibility split is flexible and may change according to workload and learning requirements.

---

# 19. AI-Assisted Development Workflow

AI coding assistants may be used throughout development.

Claude Code and other suitable tools may assist with:

- Project setup.
- Code generation.
- Database inspection.
- API implementation.
- Component creation.
- Testing.
- Debugging.
- Refactoring.
- Documentation.

However, generated code must always be reviewed and tested.

## 19.1 Required Context

Before implementing a feature, the AI assistant must read the relevant project documents.

The primary references are:

```text
docs/
    PRD.md
    TRD.md
    UI_UX_DESIGN_BRIEF.md
    APP_FLOW.md
    BACKEND_SCHEMA.md
    IMPLEMENTATION_PLAN.md
```

## 19.2 Development Instructions

AI assistants must:

1. Understand the current phase.
2. Read relevant documentation.
3. Inspect the existing project structure.
4. Avoid duplicating existing functionality.
5. Follow the approved technology stack.
6. Implement only the requested phase.
7. Avoid premature implementation of future features.
8. Write maintainable code.
9. Add appropriate tests.
10. Report modified files.
11. Report commands executed.
12. Report test results.
13. Identify known limitations.
14. Wait for approval before proceeding to the next phase.

## 19.3 Database Safety

When using Supabase MCP:

- Inspect before modifying.
- Prefer read-only access for exploration.
- Review generated SQL.
- Preserve migration history.
- Avoid destructive changes.
- Never expose secrets.
- Do not modify production data during development experiments.

## 19.4 No Blind Code Generation

The AI assistant must not generate large amounts of code without understanding the existing architecture.

Every implementation should be incremental and testable.

The developer must understand the code sufficiently to maintain and debug it.

---

# 20. Phase Completion and Approval Protocol

This section defines the mandatory process for moving between phases.

## 20.1 Phase Workflow

Every phase must follow:

```text
1. Review Phase Requirements
          |
          v
2. Understand Dependencies
          |
          v
3. Plan Implementation
          |
          v
4. Implement Small Units
          |
          v
5. Run Tests
          |
          v
6. Identify Issues
          |
          v
7. Fix Issues
          |
          v
8. Re-test
          |
          v
9. Verify Acceptance Criteria
          |
          v
10. Update Documentation
          |
          v
11. Demonstrate Completed Work
          |
          v
12. Obtain Approval
          |
          v
13. Begin Next Phase
```

## 20.2 Approval Requirements

A phase is not complete simply because the code has been written.

The following must be true:

- Required functionality is implemented.
- Tests have been executed.
- Critical issues are fixed.
- Acceptance criteria are satisfied.
- Relevant documentation is updated.
- The completed functionality has been demonstrated.
- The developer has approved moving forward.

## 20.3 Handling Failed Phases

If a phase fails testing:

1. Stop dependent development.
2. Identify the root cause.
3. Fix the issue.
4. Re-run relevant tests.
5. Verify that the fix has not introduced regressions.
6. Repeat the approval process.

Do not hide incomplete work by moving it into the next phase.

---

# 21. Documentation Maintenance

Documentation must evolve alongside implementation.

Whenever an approved technical decision changes, the relevant document must be updated.

Examples:

| Change                      | Document to Update     |
| --------------------------- | ---------------------- |
| Technology-stack change     | TRD.md                 |
| New product requirement     | PRD.md                 |
| Design-system change        | UI_UX_DESIGN_BRIEF.md  |
| New user journey            | APP_FLOW.md            |
| Database schema change      | BACKEND_SCHEMA.md      |
| Development sequence change | IMPLEMENTATION_PLAN.md |

AI assistants must not silently contradict existing documentation.

If a requirement conflicts with an existing decision, identify the conflict before implementing it.

---

# 22. Risk Management

The following risks should be monitored throughout development.

| Risk                             | Potential Impact               | Mitigation                                           |
| -------------------------------- | ------------------------------ | ---------------------------------------------------- |
| Incomplete agricultural data     | Incorrect recommendations      | Restrict initial scope and validate sources          |
| Inconsistent market names        | Duplicate or incorrect records | Standardisation and source identifiers               |
| Outdated prices                  | Misleading farmer decisions    | Freshness policy and visible observation dates       |
| Unreliable distance estimates    | Incorrect transport expenses   | Clearly label estimates and validate distance method |
| Incorrect financial calculations | Incorrect market rankings      | Backend calculations and independent tests           |
| Unreliable ML model              | Misleading quality assessment  | Dataset evaluation and clear limitations             |
| Excessive feature scope          | Delayed completion             | Prioritise core MVP                                  |
| Database security issues         | Unauthorised access            | Backend access control and permission reviews        |
| MCP misuse                       | Accidental database changes    | Project scoping and reviewed operations              |
| Poor frontend performance        | Bad user experience            | Component optimisation and performance testing       |
| Integration failures             | Incomplete application         | Continuous integration testing                       |
| Incorrect scheme information     | Misleading guidance            | Official sources and verification dates              |

---

# 23. Final MVP Acceptance Checklist

The MVP should not be considered complete until the following requirements are satisfied.

## Infrastructure

- [ ] React frontend runs correctly.
- [ ] Spring Boot backend runs correctly.
- [ ] Supabase PostgreSQL connection works.
- [ ] Flyway migrations execute correctly.
- [ ] Supabase MCP is configured safely for development.
- [ ] Python service runs where required.
- [ ] Git repository is organised.

## Authentication

- [ ] Farmer registration works.
- [ ] Farmer login works.
- [ ] Passwords are securely stored.
- [ ] Protected routes work.
- [ ] Role-based access works.

## Market Data

- [ ] Supported commodities are available.
- [ ] Supported Karnataka markets are available.
- [ ] Actual market-price data is integrated.
- [ ] Price records are validated.
- [ ] Source information is preserved.
- [ ] Observation dates are displayed.
- [ ] Price units are displayed.
- [ ] Missing data is handled correctly.

## Market Comparison

- [ ] Farmer can select a commodity.
- [ ] Farmer can enter quantity.
- [ ] Farmer can provide location.
- [ ] Market prices are retrieved.
- [ ] Transportation estimates are generated where possible.
- [ ] Gross revenue is calculated correctly.
- [ ] Total expenses are calculated correctly.
- [ ] Estimated net earnings are calculated correctly.
- [ ] Markets are ranked correctly.
- [ ] Calculation assumptions are visible.
- [ ] Historical recommendation results are preserved.

## Historical Trends

- [ ] Historical prices can be retrieved.
- [ ] Commodity filtering works.
- [ ] Market filtering works.
- [ ] Charts display correct values.
- [ ] Missing records are handled correctly.

## Interface

- [ ] Landing page follows approved design.
- [ ] Dashboard is functional.
- [ ] Navigation works.
- [ ] Responsive layouts work.
- [ ] Animations work smoothly.
- [ ] Loading states exist.
- [ ] Error states exist.
- [ ] Empty states exist.
- [ ] Accessibility has been reviewed.

## Quality and Reliability

- [ ] Backend tests pass.
- [ ] Frontend tests pass.
- [ ] Database tests pass.
- [ ] Financial calculations are independently verified.
- [ ] Authentication and authorisation are tested.
- [ ] No critical or high-severity issue remains.
- [ ] No fabricated data is presented as actual data.

---

# 24. Future Development Roadmap

After the initial MVP is stable, future versions may introduce:

## Version 2

- Additional Karnataka commodities.
- Additional Karnataka markets.
- Improved transportation estimates.
- More detailed historical analytics.
- Enhanced buyer discovery.
- Better agricultural insights.

## Version 3

- Carefully evaluated market-price forecasting.
- Advanced agricultural image assessment.
- Improved buyer matching.
- More detailed geographic analysis.
- Additional Indian states.

## Version 4

- Mobile application.
- Notifications.
- Advanced farmer analytics.
- Additional verified data integrations.
- Expanded agricultural decision-support capabilities.

These versions are indicative future directions, not commitments to implement every feature.

---

# 25. Final Development Principle

MandiWise is intended to be a useful agricultural decision-support platform, not simply a demonstration of multiple technologies.

The project must prioritise:

1. Reliable agricultural data.
2. Correct financial calculations.
3. Transparent recommendations.
4. Strong user experience.
5. Maintainable architecture.
6. Secure data handling.
7. Thorough testing.

A smaller application that produces trustworthy recommendations is more valuable than a large application that presents inaccurate information.

**The primary goal is to help farmers make better-informed market decisions through clear, explainable, and data-supported comparisons.**

---

# END OF IMPLEMENTATION PLAN
