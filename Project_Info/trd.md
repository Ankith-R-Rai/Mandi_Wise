# MandiWise – Technical Requirements Document (TRD)

**Document Version:** 2.0  
**Project Name:** MandiWise  
**Project Type:** Agricultural Market Decision Support Platform  
**Initial Geographic Scope:** Karnataka, India  
**Architecture:** React Frontend + Java Spring Boot Backend + Supabase PostgreSQL + Python Processing Service  
**Status:** Technical Architecture Baseline

---

# 1. Introduction

## 1.1 Purpose

This Technical Requirements Document defines the technology stack, system architecture, development environment, integrations, database infrastructure, security requirements, and technical standards for MandiWise.

It serves as the technical reference for developers and AI coding assistants working on the project.

All implementation decisions must remain consistent with this document unless an intentional architectural change is discussed and approved.

## 1.2 Project Overview

MandiWise is an agricultural market decision-support platform designed to help farmers make informed decisions about where to sell their produce.

The platform will analyse agricultural market prices, estimate transportation and selling expenses, calculate expected net earnings, and rank available markets based on their estimated profitability.

The initial implementation will focus on a carefully selected subset of Karnataka commodities and agricultural markets.

The system will prioritise reliable information, transparent calculations, traceable data sources, and a user-friendly interface.

## 1.3 Technical Objectives

The system must:

1. Provide a modern, responsive frontend.
2. Use Java Spring Boot as the primary application backend.
3. Use Supabase PostgreSQL as the managed relational database.
4. Use Supabase MCP to assist development and database management through supported AI tools.
5. Use Python for specialised data processing and machine-learning tasks.
6. Provide secure authentication and role-based access.
7. Support accurate financial calculations and market comparisons.
8. Maintain traceability of agricultural market data.
9. Support future expansion without requiring a complete architectural redesign.
10. Be maintainable, testable, and suitable for a two-person development team.

---

# 2. Technology Stack

The following technologies form the approved baseline for MandiWise.

## 2.1 Frontend

| Technology       | Purpose                                 |
| ---------------- | --------------------------------------- |
| React            | Frontend application framework          |
| TypeScript       | Type safety and maintainability         |
| Vite             | Development server and build tooling    |
| Tailwind CSS     | Utility-first styling                   |
| React Router     | Client-side routing                     |
| TanStack Query   | Server-state management and API caching |
| Axios            | HTTP communication with backend         |
| React Hook Form  | Form management                         |
| Zod              | Frontend validation                     |
| Recharts         | Charts and data visualisation           |
| Lucide React     | Icons                                   |
| Motion for React | Animations and transitions              |

### Frontend Requirements

- Use React with TypeScript.
- Use reusable components instead of duplicating UI code.
- Maintain a consistent design system.
- Use Tailwind CSS for styling.
- Use React Router for navigation.
- Use TanStack Query for API data fetching, caching, and synchronisation.
- Use Axios for communication with the Spring Boot backend.
- Use React Hook Form and Zod for form handling and validation.
- Use Recharts for price trends and financial visualisations.
- Use Motion for React for page transitions, micro-interactions, and other interface animations.

The frontend must not independently implement authoritative financial calculations or market-ranking logic.

These operations must be handled by the backend.

## 2.2 Backend

| Technology      | Purpose                              |
| --------------- | ------------------------------------ |
| Java            | Primary backend programming language |
| Spring Boot     | Backend application framework        |
| Spring Web      | REST API development                 |
| Spring Data JPA | Database persistence                 |
| Hibernate       | ORM                                  |
| Spring Security | Authentication and authorisation     |
| Bean Validation | Request validation                   |
| Maven           | Dependency and build management      |
| JUnit 5         | Unit and integration testing         |
| Mockito         | Mocking dependencies during testing  |

### Backend Responsibilities

Spring Boot will act as the central application backend.

It will handle:

- User authentication and authorisation.
- User profiles and farm information.
- Commodity and market information.
- Market-price retrieval and storage.
- Market comparison.
- Transportation cost estimation.
- Gross revenue and net earnings calculations.
- Market ranking.
- Historical price queries.
- Buyer discovery.
- Government scheme information.
- Quality-assessment request management.
- Communication with the Python processing service.
- Database operations.
- API validation and error handling.

### Architectural Rule

Java Spring Boot is the primary backend.

Python must not become a second independent application backend.

All major application workflows and business rules must remain under the control of Spring Boot.

---

# 3. Database Infrastructure – Supabase PostgreSQL

## 3.1 Database Selection

**Approved Database: Supabase PostgreSQL**

MandiWise will use Supabase as its managed PostgreSQL database platform.

Supabase provides a managed PostgreSQL database along with additional services such as authentication, file storage, and realtime capabilities.

Official documentation:

https://supabase.com/docs

## 3.2 Why Supabase PostgreSQL?

MandiWise has a strongly relational data model.

The application will maintain relationships between:

- Users.
- Farmer profiles.
- Farms.
- Commodities.
- Agricultural markets.
- Market price observations.
- Transportation estimates.
- Market comparison requests.
- Market recommendations.
- Quality assessments.
- Buyers.
- Government schemes.
- Data sources.

PostgreSQL is suitable for these relationships because it supports:

- Relational tables.
- Foreign-key constraints.
- Complex SQL queries.
- Joins and aggregations.
- Transactions.
- Indexing.
- Data integrity constraints.
- Numeric precision for financial values.

Supabase provides managed infrastructure without requiring the team to independently deploy and maintain a database server.

## 3.3 Database Architecture

The application will follow this communication architecture:

```text
                 MANDIWISE APPLICATION

                         FARMER
                           |
                           v
                    REACT FRONTEND
                           |
                           | REST API
                           v
                  JAVA SPRING BOOT
                           |
                           | PostgreSQL
                           v
                  SUPABASE DATABASE
                           |
                           v
                    PostgreSQL
```

The application must communicate with the database through the Spring Boot backend.

The React frontend must not directly access privileged database credentials.

## 3.4 Database Connection

Spring Boot will connect to Supabase PostgreSQL using:

- PostgreSQL JDBC Driver.
- Spring Data JPA.
- Hibernate.
- Environment-based database configuration.

The database connection must use SSL as required by the selected Supabase connection method.

Database credentials must never be hardcoded in the application source code.

### Expected Dependencies

The backend will require:

- Spring Boot Starter Data JPA.
- PostgreSQL JDBC Driver.
- Spring Boot Starter Web.
- Spring Boot Starter Security.
- Spring Boot Starter Validation.

The exact dependency versions will be managed through the Spring Boot version and Maven configuration selected during project setup.

## 3.5 Database Migration Strategy

Database schema changes must be managed through version-controlled migrations.

**Recommended migration tool: Flyway.**

Example migration structure:

```text
backend/
    src/
        main/
            resources/
                db/
                    migration/
                        V1__create_initial_schema.sql
                        V2__create_user_tables.sql
                        V3__create_market_tables.sql
                        V4__create_price_tables.sql
```

Migration requirements:

1. Every structural database change must have a migration.
2. Migration files must be committed to Git.
3. Existing migrations must not be casually modified after being applied.
4. Database changes must be reviewed before application.
5. Development and production environments must remain separate.
6. Schema changes must be tested before being deployed.

Flyway migrations will serve as the authoritative record of application database schema changes.

Supabase MCP may assist with inspecting and managing the database during development, but it must not replace the migration workflow.

---

# 4. Supabase MCP Integration

## 4.1 Purpose

MandiWise will use the official Supabase MCP integration to allow supported AI development tools, such as Google Antigravity, to interact with the Supabase development project.

MCP stands for Model Context Protocol.

It allows an AI development assistant to access supported tools and resources from an external service.

## 4.2 Expected Uses

Supabase MCP may be used to:

- Inspect database schemas.
- Explore existing tables.
- Understand foreign-key relationships.
- Inspect database information.
- Create or review SQL queries.
- Assist in designing database tables.
- Review database changes.
- Inspect database logs.
- Identify database security issues.
- Review database performance recommendations.
- Assist with development and debugging.

## 4.3 Important Architectural Distinction

Supabase MCP is a development-time integration.

It is not the runtime database connection used by the MandiWise application.

There are two separate communication paths:

**Development workflow:**

```text
Developer
    |
    v
Google Antigravity
    |
    | Supabase MCP
    v
Supabase Development Project
    |
    v
PostgreSQL
```

**Application workflow:**

```text
Farmer
   |
   v
React Frontend
   |
   | REST API
   v
Spring Boot Backend
   |
   | JDBC / JPA
   v
Supabase PostgreSQL
```

The application must continue to function independently of whether the MCP connection is available.

## 4.4 MCP Security Requirements

The following rules are mandatory:

1. Use the official Supabase MCP server.
2. Scope MCP access to the intended development project.
3. Prefer read-only access when inspecting the database.
4. Review SQL operations before executing changes.
5. Never allow an AI assistant to make unreviewed destructive database changes.
6. Never expose database passwords or service-role keys in frontend code.
7. Do not commit MCP credentials or secrets to Git.
8. Keep development and production projects separate.
9. Use migrations to preserve a reproducible database schema.
10. Review database security and permission recommendations.

Official MCP documentation:

https://supabase.com/docs/guides/getting-started/mcp

---

# 5. Python Processing Service

## 5.1 Purpose

Python will be used for specialised processing tasks that are better suited to its data-science and machine-learning ecosystem.

The Python service will operate separately from the Spring Boot backend.

## 5.2 Technology Stack

| Technology   | Purpose                             |
| ------------ | ----------------------------------- |
| Python       | Processing and ML development       |
| FastAPI      | Python service API                  |
| Pandas       | Data processing                     |
| NumPy        | Numerical operations                |
| Scikit-learn | Traditional machine-learning models |
| OpenCV       | Image processing                    |
| Pillow       | Image handling                      |
| Pytest       | Testing                             |

## 5.3 Responsibilities

The Python service may handle:

- Agricultural market-data preprocessing.
- Data cleaning and standardisation.
- Historical price analysis.
- Experimental price forecasting.
- Produce image preprocessing.
- Tomato quality-assessment models.
- Model inference.
- Model evaluation.

Not every task requires machine learning.

Simple data transformations should use conventional programming and statistical methods wherever appropriate.

## 5.4 Communication Architecture

Spring Boot will communicate with Python through HTTP APIs.

```text
                 REACT FRONTEND
                       |
                       v
               SPRING BOOT BACKEND
                       |
                       | HTTP Request
                       v
                PYTHON FASTAPI
                       |
             +---------+---------+
             |                   |
             v                   v
       DATA PROCESSING      ML INFERENCE
             |                   |
             +---------+---------+
                       |
                       v
                RESPONSE TO JAVA
                       |
                       v
                REACT FRONTEND
```

## 5.5 Architectural Restrictions

- Spring Boot remains the primary backend.
- Python must not independently implement user authentication.
- Python must not independently manage the main application database.
- Python must not bypass Spring Boot for major application workflows.
- Python responses must be validated by Spring Boot before being used in application workflows.
- ML predictions must be distinguishable from actual recorded market prices.
- Model confidence and limitations must be communicated wherever relevant.

## 5.6 Initial ML Scope

The initial image-processing feature will focus on tomato quality assessment.

The system may analyse visible characteristics such as:

- Colour distribution.
- Visible surface defects.
- Visible physical damage.
- Shape irregularities.
- Other features supported by the available dataset.

The system must not claim to identify internal quality, taste, chemical composition, or shelf life from an ordinary photograph.

Quality-based price estimation must only be introduced if reliable grade-to-price data is available.

---

# 6. System Architecture

## 6.1 Architecture Pattern

MandiWise will follow a **modular monolithic architecture** for the main Spring Boot application, supported by a separate Python processing service.

This avoids unnecessary microservice complexity while keeping the application organised into independent functional modules.

## 6.2 High-Level Architecture

```text
                         USER
                          |
                          v
                   REACT FRONTEND
                          |
                          | REST APIs
                          v
                 SPRING BOOT BACKEND
                          |
       +------------------+------------------+
       |                  |                  |
       v                  v                  v
  USER MODULE        MARKET MODULE      FARM MODULE
       |                  |                  |
       v                  v                  v
  AUTH MODULE        PRICE MODULE       PROFILE MODULE
       |                  |                  |
       +------------------+------------------+
                          |
                          v
                  BUSINESS SERVICES
                          |
       +------------------+------------------+
       |                  |                  |
       v                  v                  v
  CALCULATION        RECOMMENDATION       DATA
    ENGINE               ENGINE         SERVICES
       |                  |                  |
       +------------------+------------------+
                          |
              +-----------+-----------+
              |                       |
              v                       v
       SUPABASE DATABASE       PYTHON SERVICE
                                      |
                             +--------+--------+
                             |                 |
                             v                 v
                       DATA PROCESSING    ML INFERENCE
```

## 6.3 Backend Module Structure

The Spring Boot application should be organised by functional modules.

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
                        farm/
                        commodity/
                        market/
                        price/
                        recommendation/
                        transport/
                        buyer/
                        scheme/
                        quality/
                        insights/
                        admin/
                        integration/
            resources/
                application.yml
                db/
                    migration/
        test/
```

Each functional module should contain the relevant:

- Controller.
- Service.
- Repository.
- Entity.
- DTO.
- Mapper, where required.
- Validation logic.

The exact package structure may evolve, but the separation of responsibilities must be preserved.

---

# 7. API Architecture

## 7.1 API Style

MandiWise will use RESTful APIs.

All application APIs should follow a common versioned prefix:

```text
/api/v1/
```

## 7.2 API Responsibilities

The frontend will communicate with Spring Boot through HTTP requests.

The backend will:

1. Authenticate and authorise requests.
2. Validate incoming data.
3. Execute business logic.
4. Retrieve or update database records.
5. Communicate with external services when necessary.
6. Return structured responses.

## 7.3 Initial API Modules

The following API groups are expected.

| Module                | Example Endpoint          |
| --------------------- | ------------------------- |
| Authentication        | `/api/v1/auth`            |
| Users                 | `/api/v1/users`           |
| Farmer Profile        | `/api/v1/farmers`         |
| Farms                 | `/api/v1/farms`           |
| Commodities           | `/api/v1/commodities`     |
| Markets               | `/api/v1/markets`         |
| Market Prices         | `/api/v1/prices`          |
| Recommendations       | `/api/v1/recommendations` |
| Transportation        | `/api/v1/transport`       |
| Price Trends          | `/api/v1/trends`          |
| Quality Assessment    | `/api/v1/quality`         |
| Buyers                | `/api/v1/buyers`          |
| Government Schemes    | `/api/v1/schemes`         |
| Agricultural Insights | `/api/v1/insights`        |
| Admin                 | `/api/v1/admin`           |

These are logical API groups, not a requirement to create every endpoint immediately.

Endpoints must be implemented only when their corresponding feature is introduced.

## 7.4 API Response Standards

Responses should follow a consistent structure.

Successful response example:

```json
{
  "success": true,
  "message": "Market prices retrieved successfully",
  "data": {
    "commodity": "Tomato",
    "market": "Example Market",
    "modalPrice": 2400,
    "unit": "INR_PER_QUINTAL",
    "observationDate": "2026-11-14"
  }
}
```

Error response example:

```json
{
  "success": false,
  "message": "Unable to retrieve market prices",
  "errorCode": "MARKET_DATA_UNAVAILABLE",
  "details": null
}
```

Requirements:

- Use meaningful HTTP status codes.
- Validate incoming requests.
- Avoid exposing internal stack traces.
- Use consistent error codes.
- Include relevant observation dates and units in market-price responses.
- Clearly distinguish missing data from zero values.

The exact response DTOs will be defined during implementation.

---

# 8. External Data Integration

## 8.1 Agricultural Market Data

The primary data sources to investigate are:

- AGMARKNET.
- Government datasets available through data.gov.in.
- Other official agricultural data sources, if required.

The system must investigate the actual availability, coverage, access method, update frequency, licensing conditions, and quality of each source.

No API endpoint, access method, or update frequency should be assumed before verification.

## 8.2 Data Ingestion Requirements

The data ingestion process should:

1. Retrieve data from approved sources.
2. Validate the incoming records.
3. Standardise commodity names.
4. Standardise market names and identifiers.
5. Standardise dates.
6. Standardise price units.
7. Handle missing values.
8. Detect duplicate records.
9. Preserve source information.
10. Store validated records in PostgreSQL.

## 8.3 Market Price Data Integrity

Each market-price observation should preserve, where available:

- Commodity.
- Market.
- Observation date.
- Minimum price.
- Maximum price.
- Modal price.
- Price unit.
- Source.
- Source record identifier.
- Retrieval timestamp.
- Validation status.

A market price must never be displayed without sufficient context to identify its observation date and unit.

Historical data must not be presented as live data.

If data is unavailable, the application must clearly communicate that limitation.

---

# 9. Business Logic and Financial Calculations

## 9.1 Centralised Calculation Engine

All authoritative financial calculations must be implemented in the Spring Boot backend.

The frontend may display calculated values but must not be treated as the source of truth.

## 9.2 Unit Standards

The initial financial calculation standard will use:

```text
1 Quintal = 100 Kilograms
```

All relevant quantities and prices must be converted consistently.

## 9.3 Financial Formulae

### Gross Revenue

```text
Gross Revenue =
(Quantity in KG / 100) × Expected Price per Quintal
```

### Total Expenses

```text
Total Expenses =
Transportation Cost + Other Applicable Selling Expenses
```

### Estimated Net Earnings

```text
Estimated Net Earnings =
Gross Revenue - Total Expenses
```

## 9.4 Market Ranking

Markets must be ranked using estimated net earnings rather than modal price alone.

The ranking process should consider:

- Expected selling price.
- Farmer's available quantity.
- Estimated transportation expenses.
- Other applicable expenses, when available.
- Data freshness.
- Availability of valid market-price records.

The system must not assume that the farmer will receive the full modal price or that a market will purchase the entire quantity.

## 9.5 Transportation Estimation

The initial transportation estimate may use a configurable cost-per-kilometre model.

```text
Estimated Transport Cost =
Estimated Road Distance × Configured Cost per KM
```

Requirements:

- Clearly identify estimated costs.
- Distinguish road distance from straight-line distance.
- Do not represent estimates as confirmed transport quotations.
- Make the cost assumptions configurable.
- Display the assumptions used in the recommendation.

---

# 10. Authentication and Security

## 10.1 Authentication Approach

The initial architecture will use Spring Security to manage application authentication and authorisation.

Supabase will initially act as the managed PostgreSQL database platform.

Supabase Auth is not required for the initial implementation.

This avoids maintaining two separate authentication systems during the first development phase.

The authentication implementation must be finalised before the registration and login modules are built.

## 10.2 Authentication Requirements

The system should support:

- User registration.
- User login.
- Secure password storage.
- Session management.
- Logout.
- Role-based access control.
- Protected application routes.

JWT-based authentication may be used, with a secure refresh-token strategy where required.

Tokens and credentials must be handled securely.

## 10.3 User Roles

Initial roles:

| Role   | Permissions                                           |
| ------ | ----------------------------------------------------- |
| Farmer | Access farmer-facing features and personal data       |
| Admin  | Manage application data and administrative operations |

Role checks must be enforced by the backend.

Frontend route protection alone is insufficient.

## 10.4 Security Requirements

- Use HTTPS in deployed environments.
- Store secrets in environment variables or an appropriate secret manager.
- Never commit credentials to Git.
- Use secure password hashing.
- Validate all API inputs.
- Apply authorisation checks to protected operations.
- Prevent unauthorised access to other users' data.
- Protect image-upload endpoints.
- Apply request-size restrictions where appropriate.
- Avoid exposing sensitive internal error information.
- Use appropriate database permissions.
- Review SQL operations before execution.

## 10.5 Database Access Rules

The application backend must use database credentials appropriate for its runtime requirements.

The following must never be exposed in frontend code:

- Database passwords.
- Supabase service-role keys.
- Privileged database connection strings.
- Private API secrets.

If direct frontend access to Supabase is introduced in a future phase, it must use appropriately scoped public credentials and properly configured Row Level Security policies.

The initial architecture does not require direct frontend database access.

---

# 11. File and Image Storage

## 11.1 Storage Requirements

MandiWise may require image storage for:

- Tomato quality-assessment uploads.
- Farmer profile images, if introduced.
- Other approved user-uploaded files.

Supabase Storage may be used for this purpose.

## 11.2 Image Handling

Uploaded images must:

- Be validated before processing.
- Have permitted file types.
- Have maximum file-size restrictions.
- Be stored using appropriate access permissions.
- Avoid public exposure unless explicitly intended.
- Be processed through the backend/Python workflow.

The image-processing service must not assume that an uploaded image is suitable for model inference.

---

# 12. Frontend Design and Motion Requirements

The frontend must follow the approved `UI_UX_DESIGN_BRIEF.md`.

## 12.1 Design Principles

- Premium visual quality.
- Clean and modern interface.
- Strong visual hierarchy.
- Clear data presentation.
- Responsive layouts.
- Accessible controls.
- Consistent components.
- Agricultural context without stereotypical visuals.

## 12.2 Animation Requirements

Motion is a first-class design requirement.

The application should use animations for:

- Landing-page environmental effects.
- Page transitions.
- Scroll-based reveals.
- Navigation interactions.
- Button interactions.
- Dashboard cards.
- Animated numerical values.
- Chart transitions.
- Loading states.
- Success and error feedback.

Use Motion for React as the primary animation library.

CSS transitions and keyframes may be used for simpler effects.

GSAP should only be introduced if a specific advanced animation requires it.

## 12.3 Performance Requirements

- Avoid unnecessary re-renders.
- Lazy-load suitable routes and components.
- Optimise images.
- Avoid excessive animation.
- Respect `prefers-reduced-motion`.
- Keep charts responsive.
- Provide loading states for asynchronous operations.
- Avoid blocking the main interface during long-running operations.

---

# 13. Error Handling and Reliability

## 13.1 General Requirements

The application must handle:

- Network failures.
- Database failures.
- Invalid user input.
- Authentication errors.
- Missing market-price records.
- External API failures.
- Python service failures.
- Image-processing errors.
- Invalid or incomplete datasets.

## 13.2 Data Availability

The system must distinguish between:

- Data available.
- Data unavailable.
- Data incomplete.
- Data outdated.
- Data estimated.
- Data predicted.
- Sample demonstration data.

These states must not be silently combined.

## 13.3 Fallback Behaviour

When an external service fails:

- Do not invent replacement data.
- Do not silently substitute sample records.
- Display a clear status message.
- Preserve existing valid records where appropriate.
- Record failures for debugging.
- Allow retry where suitable.

A demonstration mode may use sample data, but all sample information must be explicitly labelled.

---

# 14. Testing Strategy

Testing must happen continuously, not only at the end of development.

## 14.1 Frontend Testing

Test:

- Component rendering.
- Navigation.
- Form validation.
- API integration.
- Loading states.
- Error states.
- Responsive behaviour.
- User interactions.

A frontend testing framework such as Vitest and React Testing Library may be used.

## 14.2 Backend Testing

Use:

- JUnit 5.
- Mockito.
- Spring Boot testing support.

Test:

- Service-layer logic.
- API endpoints.
- Validation.
- Authentication.
- Authorisation.
- Database operations.
- Financial calculations.
- Market-ranking logic.

## 14.3 Database Testing

Test:

- Table relationships.
- Foreign-key constraints.
- Unique constraints.
- Required fields.
- Indexes.
- Migration execution.
- Data integrity.
- User-data isolation.

## 14.4 Python Testing

Use Pytest to test:

- Data preprocessing.
- Input validation.
- Image processing.
- Model inference.
- Error handling.
- API responses.

## 14.5 End-to-End Testing

Important user journeys must be tested across the complete system.

Example:

```text
Farmer Login
     |
     v
Select Commodity
     |
     v
Enter Quantity and Location
     |
     v
Retrieve Market Prices
     |
     v
Estimate Transportation Costs
     |
     v
Calculate Net Earnings
     |
     v
Rank Available Markets
     |
     v
Display Recommendation
```

The results must be checked against independently calculated expected values.

---

# 15. Development Environment

## 15.1 Required Software

| Software                | Purpose                                         |
| ----------------------- | ----------------------------------------------- |
| Node.js                 | Frontend development                            |
| npm                     | Frontend package management                     |
| Java JDK                | Backend development                             |
| Maven                   | Backend dependency management                   |
| Python                  | Processing service                              |
| pip                     | Python dependency management                    |
| Git                     | Version control                                 |
| VS Code / IntelliJ IDEA | Development                                     |
| Postman                 | API testing                                     |
| Supabase                | Managed PostgreSQL database                     |
| Google Antigravity      | AI-assisted development                         |
| Supabase MCP            | AI-assisted database inspection and development |

Exact software versions should be documented in the project setup guide once the environment is established.

## 15.2 Development Services

Suggested local development ports:

| Service        | Port |
| -------------- | ---: |
| React + Vite   | 5173 |
| Spring Boot    | 8080 |
| Python FastAPI | 8000 |

Supabase PostgreSQL will initially be hosted through the managed Supabase project.

A local PostgreSQL instance is not mandatory for the initial setup.

## 15.3 Environment Variables

Secrets and environment-specific configuration must be stored outside source code.

Example backend configuration:

```env
SERVER_PORT=8080

DB_URL=
DB_USERNAME=
DB_PASSWORD=

JWT_SECRET=

PYTHON_SERVICE_URL=http://localhost:8000
```

Example frontend configuration:

```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

Example Python configuration:

```env
PYTHON_SERVICE_PORT=8000
MODEL_PATH=
```

The actual values must be supplied through the appropriate development environment.

Never insert real credentials into committed example files.

Use `.env.example` files containing placeholders where useful.

---

# 16. Version Control and Code Quality

## 16.1 Git

Git will be used for version control.

The repository should contain:

```text
MandiWise/
    frontend/
    backend/
    python-service/
    docs/
    README.md
    .gitignore
```

The documentation directory should contain the approved project documents.

## 16.2 Git Practices

- Commit logical units of work.
- Use meaningful commit messages.
- Do not commit generated build files unnecessarily.
- Do not commit secrets.
- Keep database migration files in version control.
- Test changes before merging them into the main branch.

## 16.3 Code Quality

- Use meaningful variable and function names.
- Keep functions focused.
- Avoid unnecessary duplication.
- Separate business logic from controllers.
- Validate external data.
- Handle exceptions properly.
- Write tests for critical logic.
- Document non-obvious implementation decisions.

---

# 17. Deployment Architecture

Deployment will be introduced after the core application is stable.

The expected deployment structure is:

```text
                  USERS
                    |
                    v
              FRONTEND HOST
                    |
                    v
             SPRING BOOT HOST
                    |
          +---------+---------+
          |                   |
          v                   v
   SUPABASE DATABASE     PYTHON SERVICE
```

The final hosting providers will be selected after evaluating cost, reliability, deployment complexity, and available student resources.

## 17.1 Deployment Requirements

- Use HTTPS.
- Configure production environment variables.
- Keep production credentials separate.
- Use appropriate database connection settings.
- Apply database migrations in a controlled manner.
- Configure CORS correctly.
- Restrict administrative access.
- Monitor backend and Python service errors.
- Maintain database backups through an appropriate backup strategy.
- Avoid exposing internal service endpoints unnecessarily.

Development and production environments must not share unrestricted credentials or databases.

---

# 18. Scalability and Future Expansion

The initial application will focus on Karnataka.

The architecture should nevertheless support future expansion.

Potential future additions:

- More Karnataka markets.
- More commodities.
- Additional Indian states.
- Improved transportation estimates.
- Advanced price forecasting.
- Additional produce-quality models.
- Buyer verification workflows.
- More detailed farmer analytics.
- Government scheme integrations.
- Mobile application support.

Future capabilities must be introduced without compromising the accuracy and reliability of existing functionality.

---

# 19. Technical Constraints and Non-Negotiable Rules

The following rules apply throughout development.

### Architecture

1. React + TypeScript is the frontend.
2. Java Spring Boot is the primary backend.
3. Supabase PostgreSQL is the managed relational database.
4. Python FastAPI is a specialised processing service.
5. Supabase MCP is a development-time tool, not the application's runtime database connection.
6. The frontend communicates with the backend through REST APIs.
7. Spring Boot is authoritative for business logic and financial calculations.

### Database

8. Use PostgreSQL-compatible schemas and SQL.
9. Manage schema changes through version-controlled migrations.
10. Preserve relational integrity.
11. Use appropriate indexes and constraints.
12. Never expose privileged database credentials.
13. Use separate development and production environments.

### Data Integrity

14. Accuracy is more important than coverage.
15. Never fabricate agricultural prices.
16. Never silently substitute demonstration data for actual data.
17. Preserve market-price observation dates and units.
18. Distinguish estimates from confirmed values.
19. Distinguish historical records from predictions.
20. Preserve source traceability.

### AI and Machine Learning

21. ML is optional where conventional methods are sufficient.
22. Never claim unsupported model capabilities.
23. Validate model outputs.
24. Clearly communicate prediction limitations.
25. Never treat predictions as actual market observations.

### Development Process

26. Follow the phase-by-phase implementation plan.
27. Test each phase before proceeding.
28. Fix identified issues before introducing dependent features.
29. Maintain consistency with the approved project documentation.
30. Do not introduce unnecessary technologies or architectural complexity.

---

# 20. Final Technical Architecture Summary

| Layer                   | Technology                     | Responsibility                       |
| ----------------------- | ------------------------------ | ------------------------------------ |
| Frontend                | React + TypeScript             | User interface                       |
| Styling                 | Tailwind CSS                   | Design system and layouts            |
| Animation               | Motion for React               | Interface motion                     |
| Charts                  | Recharts                       | Market and financial visualisation   |
| API Communication       | Axios                          | Frontend-backend communication       |
| Primary Backend         | Java Spring Boot               | Application logic and APIs           |
| Security                | Spring Security                | Authentication and authorisation     |
| ORM                     | Spring Data JPA + Hibernate    | Database operations                  |
| Database                | Supabase PostgreSQL            | Persistent relational data           |
| DB Migrations           | Flyway                         | Version-controlled schema changes    |
| AI Database Integration | Supabase MCP                   | Development-time database assistance |
| Processing Service      | Python FastAPI                 | Data processing and ML               |
| Data Processing         | Pandas + NumPy                 | Data cleaning and analysis           |
| ML                      | Scikit-learn                   | Suitable predictive models           |
| Image Processing        | OpenCV + Pillow                | Produce image processing             |
| Testing                 | JUnit, Mockito, Pytest, Vitest | Quality assurance                    |
| Version Control         | Git                            | Source management                    |

---

# 21. Technical Decision Record

The following decisions establish the current technical baseline.

| Decision                 | Selected Approach             | Reason                                           |
| ------------------------ | ----------------------------- | ------------------------------------------------ |
| Frontend framework       | React                         | Component-based UI                               |
| Frontend language        | TypeScript                    | Type safety                                      |
| Styling                  | Tailwind CSS                  | Consistent and maintainable styling              |
| Backend language         | Java                          | Primary application development                  |
| Backend framework        | Spring Boot                   | Structured REST API and business logic           |
| Database                 | Supabase PostgreSQL           | Relational data model and managed infrastructure |
| Database access          | Spring Data JPA               | Backend-managed persistence                      |
| Database migrations      | Flyway                        | Reproducible schema changes                      |
| MCP integration          | Supabase MCP                  | AI-assisted database development                 |
| Python framework         | FastAPI                       | Separate processing service                      |
| Authentication           | Spring Security               | Centralised application authentication           |
| Image storage            | Supabase Storage, if required | Managed file storage                             |
| API architecture         | REST                          | Clear frontend-backend separation                |
| Application architecture | Modular monolith              | Manageable initial complexity                    |

**Important:** These decisions form the approved baseline. Any proposed replacement or additional technology must have a clear technical justification and must be reflected in the project documentation before implementation.

---

# END OF TECHNICAL REQUIREMENTS DOCUMENT
