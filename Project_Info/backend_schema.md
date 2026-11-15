# MandiWise – Backend Database Schema

**Document Version:** 1.0  
**Project:** MandiWise  
**Database:** Supabase PostgreSQL  
**Primary Backend:** Java Spring Boot  
**ORM:** Spring Data JPA + Hibernate  
**Migration Tool:** Flyway  
**Initial Geographic Scope:** Karnataka, India  
**Status:** Approved Database Design Baseline

---

# 1. Introduction

## 1.1 Purpose

This document defines the database schema for the MandiWise agricultural market decision-support platform.

It specifies:

- Database tables.
- Column names and data types.
- Primary keys.
- Foreign-key relationships.
- Unique constraints.
- Check constraints.
- Indexing strategy.
- Data-integrity requirements.
- Relationships between application modules.
- Database migration conventions.

This document serves as the reference for implementing the PostgreSQL database and corresponding Java entities.

## 1.2 Database Technology

MandiWise will use:

**Supabase PostgreSQL**

The application backend will connect to the database through PostgreSQL JDBC and Spring Data JPA.

Supabase MCP may be used inside Google Antigravity for database inspection and development assistance.

However, the actual application will communicate with the database through Spring Boot.

## 1.3 Database Design Principles

The database must follow these principles:

1. Maintain relational integrity.
2. Avoid unnecessary duplication.
3. Preserve historical market-price observations.
4. Maintain traceability of external data.
5. Store financial values with appropriate numeric precision.
6. Distinguish actual data from estimated and predicted data.
7. Preserve user-data isolation.
8. Support future expansion beyond Karnataka.
9. Avoid unnecessary complexity during the MVP.
10. Maintain a clear relationship between database records and application modules.

---

# 2. Database Architecture Overview

The database will be organised into functional groups.

| Module                | Purpose                                |
| --------------------- | -------------------------------------- |
| User Management       | Accounts, profiles, roles              |
| Farm Management       | Farmer farm information                |
| Commodity Management  | Agricultural commodities               |
| Market Management     | Agricultural market information        |
| Price Management      | Historical market-price observations   |
| Data Management       | Sources and ingestion records          |
| Recommendation Engine | Market comparison requests and results |
| Transportation        | Cost estimation configuration          |
| Quality Assessment    | Produce image assessments              |
| Buyer Discovery       | Buyer information and verification     |
| Government Schemes    | Scheme information and sources         |
| Agricultural Insights | Crop and agricultural information      |
| Administration        | Audit and administrative records       |

The initial implementation should prioritise the tables required for registration, market prices, and market recommendations.

Other tables can be introduced during their respective development phases.

---

# 3. Entity Relationship Overview

The following diagram illustrates the primary relationships.

```text
                         USERS
                           |
              +------------+------------+
              |                         |
              v                         v
        USER_ROLES                 FARMER_PROFILES
                                          |
                                          v
                                         FARMS


       COMMODITIES                    MARKETS
            |                            |
            +-------------+--------------+
                          |
                          v
                    MARKET_PRICES
                          |
                          |
                    DATA_SOURCES


       FARMER_PROFILES
              |
              v
      RECOMMENDATION_REQUESTS
              |
              v
      RECOMMENDATION_RESULTS
              |
              +--------------------+
              |                    |
              v                    v
           MARKETS             COMMODITIES


       FARMER_PROFILES
              |
              v
       QUALITY_ASSESSMENTS


          BUYERS
            |
            v
       BUYER_COMMODITIES
            |
            v
       COMMODITIES


      GOVERNMENT_SCHEMES
              |
              v
       SCHEME_CATEGORIES


       CROPS / INSIGHTS
              |
              v
          COMMODITIES
```

This is a logical overview. The final implementation will use the detailed foreign-key relationships defined below.

---

# 4. Database Naming Conventions

Consistent naming must be followed throughout the database.

## 4.1 Table Names

- Use lowercase.
- Use snake_case.
- Use plural table names.
- Avoid spaces and special characters.

Examples:

```text
users
farmer_profiles
market_prices
commodities
recommendation_requests
recommendation_results
```

## 4.2 Column Names

Use lowercase snake_case.

Examples:

```text
created_at
updated_at
market_id
commodity_id
modal_price
observation_date
```

## 4.3 Primary Keys

Use UUID primary keys.

Example:

```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid()
```

UUIDs provide globally unique identifiers and are suitable for distributed application components.

## 4.4 Foreign Keys

Foreign keys should use the referenced table name followed by `_id`.

Example:

```text
user_id
market_id
commodity_id
farmer_id
```

## 4.5 Timestamps

Use:

```sql
TIMESTAMPTZ
```

for timestamps.

Store timestamps consistently in UTC.

Market observation dates should use `DATE` when only the calendar date is known.

Do not invent a precise observation timestamp when the source only provides a date.

## 4.6 Financial Values

Use PostgreSQL `NUMERIC` rather than floating-point types for financial calculations.

Examples:

```sql
NUMERIC(12,2)
NUMERIC(14,2)
NUMERIC(8,2)
```

This avoids unnecessary floating-point precision errors.

Java should use `BigDecimal` for corresponding financial values.

---

# 5. Common Database Fields

Most application tables should contain appropriate creation and modification timestamps.

Recommended fields:

| Column     | Type        | Purpose                |
| ---------- | ----------- | ---------------------- |
| id         | UUID        | Primary key            |
| created_at | TIMESTAMPTZ | Record creation time   |
| updated_at | TIMESTAMPTZ | Last modification time |

Not every table requires every common field.

For example, immutable historical market-price records should not be casually updated simply to change their timestamps.

A database trigger may be introduced to maintain `updated_at` consistently where appropriate.

---

# 6. User Management Module

## 6.1 `users`

Stores application account information.

Since the initial authentication approach uses Spring Security, user credentials will be managed by the Spring Boot application.

Supabase Auth is not part of the initial authentication design.

### Table Structure

| Column         | Data Type    | Constraints      | Description               |
| -------------- | ------------ | ---------------- | ------------------------- |
| id             | UUID         | PK               | Unique user ID            |
| email          | VARCHAR(255) | UNIQUE, NOT NULL | User email                |
| password_hash  | VARCHAR(255) | NOT NULL         | Secure password hash      |
| full_name      | VARCHAR(150) | NOT NULL         | User's name               |
| phone_number   | VARCHAR(20)  | NULL             | Contact number            |
| account_status | VARCHAR(20)  | NOT NULL         | Account status            |
| email_verified | BOOLEAN      | DEFAULT FALSE    | Email verification status |
| last_login_at  | TIMESTAMPTZ  | NULL             | Last successful login     |
| created_at     | TIMESTAMPTZ  | NOT NULL         | Creation time             |
| updated_at     | TIMESTAMPTZ  | NOT NULL         | Modification time         |

### Account Status

Initial supported values:

- ACTIVE
- INACTIVE
- SUSPENDED
- PENDING_VERIFICATION

The backend must validate status transitions.

### Constraints

- Email must be unique.
- Email must be normalised before storage.
- Passwords must never be stored as plain text.
- Suspended users must not access protected application features.

---

## 6.2 `roles`

Stores available application roles.

| Column      | Data Type    | Constraints      |
| ----------- | ------------ | ---------------- |
| id          | UUID         | PK               |
| name        | VARCHAR(30)  | UNIQUE, NOT NULL |
| description | VARCHAR(255) | NULL             |

Initial roles:

```text
FARMER
ADMIN
```

Additional roles may be introduced if required.

## 6.3 `user_roles`

Associates users with application roles.

| Column      | Data Type   | Constraints   |
| ----------- | ----------- | ------------- |
| user_id     | UUID        | FK → users.id |
| role_id     | UUID        | FK → roles.id |
| assigned_at | TIMESTAMPTZ | NOT NULL      |

Composite primary key:

```text
(user_id, role_id)
```

This allows the application to support multiple roles for a user without duplicating account records.

---

# 7. Farmer and Farm Management

## 7.1 `farmer_profiles`

Stores additional information about users registered as farmers.

| Column             | Data Type    | Constraints           |
| ------------------ | ------------ | --------------------- |
| id                 | UUID         | PK                    |
| user_id            | UUID         | FK → users.id, UNIQUE |
| preferred_language | VARCHAR(20)  | NULL                  |
| district           | VARCHAR(100) | NULL                  |
| taluk              | VARCHAR(100) | NULL                  |
| village            | VARCHAR(100) | NULL                  |
| created_at         | TIMESTAMPTZ  | NOT NULL              |
| updated_at         | TIMESTAMPTZ  | NOT NULL              |

The farmer profile is separate from the general user account.

This allows future non-farmer account types without unnecessarily expanding the users table.

## 7.2 `farms`

Stores farm information associated with a farmer.

| Column         | Data Type     | Constraints             |
| -------------- | ------------- | ----------------------- |
| id             | UUID          | PK                      |
| farmer_id      | UUID          | FK → farmer_profiles.id |
| farm_name      | VARCHAR(150)  | NULL                    |
| district       | VARCHAR(100)  | NOT NULL                |
| taluk          | VARCHAR(100)  | NULL                    |
| village        | VARCHAR(100)  | NULL                    |
| land_area      | NUMERIC(10,2) | NULL                    |
| land_area_unit | VARCHAR(20)   | NULL                    |
| latitude       | NUMERIC(10,7) | NULL                    |
| longitude      | NUMERIC(10,7) | NULL                    |
| created_at     | TIMESTAMPTZ   | NOT NULL                |
| updated_at     | TIMESTAMPTZ   | NOT NULL                |

### Rules

- A farmer may own or manage multiple farms.
- Land area must be positive when provided.
- Latitude must be between -90 and 90.
- Longitude must be between -180 and 180.
- Location coordinates are optional.

PostGIS is not required for the initial implementation.

It may be introduced later if advanced geographic queries become necessary.

---

# 8. Commodity Management

## 8.1 `commodities`

Stores the agricultural commodities supported by MandiWise.

| Column          | Data Type    | Constraints      |
| --------------- | ------------ | ---------------- |
| id              | UUID         | PK               |
| name            | VARCHAR(120) | NOT NULL         |
| normalized_name | VARCHAR(120) | UNIQUE, NOT NULL |
| local_name      | VARCHAR(120) | NULL             |
| kannada_name    | VARCHAR(120) | NULL             |
| category        | VARCHAR(80)  | NULL             |
| standard_unit   | VARCHAR(30)  | NOT NULL         |
| is_active       | BOOLEAN      | DEFAULT TRUE     |
| created_at      | TIMESTAMPTZ  | NOT NULL         |
| updated_at      | TIMESTAMPTZ  | NOT NULL         |

Examples:

| Name   | Category  | Standard Unit |
| ------ | --------- | ------------- |
| Tomato | Vegetable | QUINTAL       |
| Onion  | Vegetable | QUINTAL       |
| Potato | Vegetable | QUINTAL       |

### Rules

- Commodity names must be standardised.
- Different spellings of the same commodity must not create duplicate records.
- Local-language names may be stored separately.
- Inactive commodities should not appear in new farmer searches.
- Historical price records must remain accessible even if a commodity becomes inactive.

---

# 9. Agricultural Market Management

## 9.1 `markets`

Stores agricultural market information.

| Column          | Data Type     | Constraints  |
| --------------- | ------------- | ------------ |
| id              | UUID          | PK           |
| name            | VARCHAR(180)  | NOT NULL     |
| normalized_name | VARCHAR(180)  | NOT NULL     |
| district        | VARCHAR(100)  | NOT NULL     |
| state           | VARCHAR(100)  | NOT NULL     |
| state_code      | VARCHAR(10)   | NULL         |
| market_type     | VARCHAR(50)   | NULL         |
| latitude        | NUMERIC(10,7) | NULL         |
| longitude       | NUMERIC(10,7) | NULL         |
| address         | TEXT          | NULL         |
| is_active       | BOOLEAN       | DEFAULT TRUE |
| created_at      | TIMESTAMPTZ   | NOT NULL     |
| updated_at      | TIMESTAMPTZ   | NOT NULL     |

### Constraints

A market should not be duplicated simply because its name appears with different capitalisation or spelling.

A suitable uniqueness rule should be established using the normalised market name and its geographic identifiers.

For example:

```text
normalized_name + district + state
```

### Important

Market identifiers from external government datasets should be preserved separately where available.

They must not be treated as interchangeable with MandiWise-generated UUIDs.

---

# 10. Market Price Management

This is one of the most important database modules in MandiWise.

Market-price records will power:

- Market comparison.
- Best mandi recommendations.
- Historical price trends.
- Gross revenue calculations.
- Estimated net earnings.
- Dashboard statistics.

## 10.1 `market_prices`

Stores individual agricultural market-price observations.

| Column            | Data Type     | Constraints          |
| ----------------- | ------------- | -------------------- |
| id                | UUID          | PK                   |
| commodity_id      | UUID          | FK → commodities.id  |
| market_id         | UUID          | FK → markets.id      |
| source_id         | UUID          | FK → data_sources.id |
| observation_date  | DATE          | NOT NULL             |
| min_price         | NUMERIC(12,2) | NULL                 |
| max_price         | NUMERIC(12,2) | NULL                 |
| modal_price       | NUMERIC(12,2) | NOT NULL             |
| price_unit        | VARCHAR(30)   | NOT NULL             |
| source_record_id  | VARCHAR(180)  | NULL                 |
| retrieved_at      | TIMESTAMPTZ   | NOT NULL             |
| validation_status | VARCHAR(30)   | NOT NULL             |
| created_at        | TIMESTAMPTZ   | NOT NULL             |

### Example Record

```json
{
  "commodity": "Tomato",
  "market": "Example Market",
  "observationDate": "2026-11-14",
  "minPrice": 1800.0,
  "maxPrice": 2800.0,
  "modalPrice": 2400.0,
  "priceUnit": "INR_PER_QUINTAL",
  "validationStatus": "VALIDATED"
}
```

This is a schema illustration, not an actual market-price record.

### Validation Rules

1. Commodity must exist.
2. Market must exist.
3. Data source must exist.
4. Observation date must be valid.
5. Modal price must be non-negative.
6. Minimum price must not exceed maximum price when both are provided.
7. Modal price should fall within the minimum and maximum range when all three values are present, subject to source-specific validation rules.
8. Price unit must be explicitly stored.
9. Source information must be preserved.
10. Duplicate observations must be handled through a defined ingestion policy.

### Price Unit

Initial supported unit:

```text
INR_PER_QUINTAL
```

Additional units may be introduced when supported by verified source data.

Do not assume every external source uses the same price unit.

### Validation Status

Initial values:

- PENDING
- VALIDATED
- REJECTED
- FLAGGED

Rejected records must not be used in market recommendations.

Flagged records should require an explicit policy before they can be used.

### Historical Data Rule

Market-price observations must be preserved historically.

Do not overwrite previous observations merely because a newer price becomes available.

Each observation represents a separate record.

---

# 11. Data Source and Ingestion Management

## 11.1 `data_sources`

Stores information about external data providers.

| Column      | Data Type    | Constraints      |
| ----------- | ------------ | ---------------- |
| id          | UUID         | PK               |
| name        | VARCHAR(150) | UNIQUE, NOT NULL |
| source_type | VARCHAR(50)  | NOT NULL         |
| base_url    | TEXT         | NULL             |
| description | TEXT         | NULL             |
| is_active   | BOOLEAN      | DEFAULT TRUE     |
| created_at  | TIMESTAMPTZ  | NOT NULL         |
| updated_at  | TIMESTAMPTZ  | NOT NULL         |

Potential sources include:

- AGMARKNET.
- data.gov.in.
- Other verified government agricultural datasets.

The actual access method and source details must be investigated before integration.

## 11.2 `ingestion_batches`

Tracks individual data-ingestion operations.

| Column           | Data Type   | Constraints          |
| ---------------- | ----------- | -------------------- |
| id               | UUID        | PK                   |
| source_id        | UUID        | FK → data_sources.id |
| started_at       | TIMESTAMPTZ | NOT NULL             |
| completed_at     | TIMESTAMPTZ | NULL                 |
| status           | VARCHAR(30) | NOT NULL             |
| records_received | INTEGER     | DEFAULT 0            |
| records_inserted | INTEGER     | DEFAULT 0            |
| records_updated  | INTEGER     | DEFAULT 0            |
| records_rejected | INTEGER     | DEFAULT 0            |
| error_message    | TEXT        | NULL                 |

### Purpose

This table helps administrators understand:

- When data was collected.
- Which source was used.
- How many records were received.
- How many records were accepted.
- How many records were rejected.
- Whether ingestion completed successfully.

It also supports debugging and data-quality monitoring.

---

# 12. Transportation Management

Transportation expenses are essential to calculating estimated net earnings.

## 12.1 `transport_cost_configs`

Stores configurable transportation cost assumptions.

| Column          | Data Type     | Constraints  |
| --------------- | ------------- | ------------ |
| id              | UUID          | PK           |
| vehicle_type    | VARCHAR(80)   | NOT NULL     |
| cost_per_km     | NUMERIC(10,2) | NOT NULL     |
| effective_from  | DATE          | NOT NULL     |
| effective_until | DATE          | NULL         |
| is_active       | BOOLEAN       | DEFAULT TRUE |
| created_at      | TIMESTAMPTZ   | NOT NULL     |
| updated_at      | TIMESTAMPTZ   | NOT NULL     |

### Example Vehicle Categories

- MINI_TRUCK
- LIGHT_COMMERCIAL_VEHICLE
- HEAVY_TRUCK

These categories are initial configuration options, not confirmed transport-market rates.

### Rules

- Cost per kilometre must be non-negative.
- Historical configurations should be retained.
- Only applicable active configurations should be used for new estimates.
- Rates must not be presented as confirmed quotations.

## 12.2 Transportation Calculation

The initial calculation may use:

```text
Estimated Transport Cost =
Estimated Road Distance × Cost Per KM
```

The backend must retain the assumptions used for a recommendation.

This ensures that an old recommendation can be understood even if the configured transportation rate changes later.

---

# 13. Market Recommendation Module

This module stores farmer requests and the results generated by the recommendation engine.

It must preserve enough information to explain why a market was recommended.

## 13.1 `recommendation_requests`

Stores individual market-comparison requests.

| Column           | Data Type     | Constraints             |
| ---------------- | ------------- | ----------------------- |
| id               | UUID          | PK                      |
| farmer_id        | UUID          | FK → farmer_profiles.id |
| commodity_id     | UUID          | FK → commodities.id     |
| quantity_kg      | NUMERIC(12,2) | NOT NULL                |
| origin_farm_id   | UUID          | FK → farms.id, NULL     |
| origin_district  | VARCHAR(100)  | NULL                    |
| origin_latitude  | NUMERIC(10,7) | NULL                    |
| origin_longitude | NUMERIC(10,7) | NULL                    |
| request_status   | VARCHAR(30)   | NOT NULL                |
| created_at       | TIMESTAMPTZ   | NOT NULL                |

### Rules

- Quantity must be greater than zero.
- Commodity must be active for new requests.
- Farmer must be authenticated.
- Origin information must be sufficient for the selected transport-estimation method.
- Requests must belong to the requesting farmer.

## 13.2 `recommendation_results`

Stores the market-wise result of a recommendation request.

One request may produce multiple market results.

| Column                     | Data Type     | Constraints                     |
| -------------------------- | ------------- | ------------------------------- |
| id                         | UUID          | PK                              |
| request_id                 | UUID          | FK → recommendation_requests.id |
| market_id                  | UUID          | FK → markets.id                 |
| market_price_id            | UUID          | FK → market_prices.id           |
| expected_price_per_quintal | NUMERIC(12,2) | NOT NULL                        |
| gross_revenue              | NUMERIC(14,2) | NOT NULL                        |
| estimated_distance_km      | NUMERIC(10,2) | NULL                            |
| estimated_transport_cost   | NUMERIC(12,2) | NOT NULL                        |
| other_expenses             | NUMERIC(12,2) | NOT NULL                        |
| total_expenses             | NUMERIC(12,2) | NOT NULL                        |
| estimated_net_earnings     | NUMERIC(14,2) | NOT NULL                        |
| ranking_position           | INTEGER       | NOT NULL                        |
| calculation_details        | JSONB         | NULL                            |
| created_at                 | TIMESTAMPTZ   | NOT NULL                        |

### Calculation Details

The JSONB field may preserve supporting calculation assumptions.

Example:

```json
{
  "quantityUnit": "KG",
  "priceUnit": "INR_PER_QUINTAL",
  "transportCostPerKm": 25.0,
  "distanceType": "ROAD_ESTIMATE",
  "otherExpensesIncluded": false
}
```

The actual values must be generated from the calculation performed.

### Important Rules

- Each result must reference the market-price observation used.
- Results must preserve the expected price and calculation assumptions.
- Ranking must be generated by the backend.
- Ranking must be based on estimated net earnings.
- Missing market prices must not be treated as zero.
- The system must not rank markets using invalid price records.
- Old recommendation results must remain understandable if the underlying market price or transport configuration later changes.

### Recommendation Snapshot

Recommendation results should be treated as historical calculation snapshots.

If a new market price becomes available tomorrow, the old recommendation must not silently change.

A new calculation should generate a new recommendation request or a clearly versioned recalculation.

---

# 14. Quality Assessment Module

The initial quality-assessment feature will focus on tomato images.

The database must preserve the assessment input, output, model information, and limitations.

## 14.1 `quality_assessments`

| Column             | Data Type    | Constraints             |
| ------------------ | ------------ | ----------------------- |
| id                 | UUID         | PK                      |
| farmer_id          | UUID         | FK → farmer_profiles.id |
| commodity_id       | UUID         | FK → commodities.id     |
| image_storage_path | TEXT         | NOT NULL                |
| image_content_type | VARCHAR(100) | NOT NULL                |
| model_name         | VARCHAR(150) | NULL                    |
| model_version      | VARCHAR(80)  | NULL                    |
| assessment_status  | VARCHAR(30)  | NOT NULL                |
| assessment_result  | JSONB        | NULL                    |
| confidence_score   | NUMERIC(6,5) | NULL                    |
| limitation_notes   | TEXT         | NULL                    |
| created_at         | TIMESTAMPTZ  | NOT NULL                |

### Assessment Status

- PENDING
- PROCESSING
- COMPLETED
- FAILED

### Assessment Result

The JSONB field may contain:

```json
{
  "visibleDefects": [],
  "colourClassification": null,
  "shapeClassification": null,
  "overallAssessment": null
}
```

The actual structure must be based on the implemented model.

### Rules

- Images must be stored using controlled storage access.
- The database should store the storage path, not the image binary itself.
- Model name and version should be retained when available.
- Confidence scores must be validated.
- The system must not present model outputs as guaranteed quality grades.
- An assessment must not automatically produce a price premium without reliable supporting grade-to-price data.

---

# 15. Buyer Discovery Module

## 15.1 `buyers`

Stores buyer information.

| Column              | Data Type    | Constraints  |
| ------------------- | ------------ | ------------ |
| id                  | UUID         | PK           |
| name                | VARCHAR(180) | NOT NULL     |
| buyer_type          | VARCHAR(80)  | NULL         |
| contact_person      | VARCHAR(150) | NULL         |
| phone_number        | VARCHAR(20)  | NULL         |
| email               | VARCHAR(255) | NULL         |
| address             | TEXT         | NULL         |
| district            | VARCHAR(100) | NULL         |
| state               | VARCHAR(100) | NULL         |
| verification_status | VARCHAR(30)  | NOT NULL     |
| is_active           | BOOLEAN      | DEFAULT TRUE |
| created_at          | TIMESTAMPTZ  | NOT NULL     |
| updated_at          | TIMESTAMPTZ  | NOT NULL     |

### Verification Status

- UNVERIFIED
- PENDING_VERIFICATION
- VERIFIED
- REJECTED

### Rules

- Unverified buyers must be clearly labelled.
- Verification must follow an actual review process.
- Contact information must be handled appropriately.
- The platform must not claim that a buyer is willing to purchase a particular quantity unless that information has been confirmed.

## 15.2 `buyer_commodities`

Associates buyers with commodities they are recorded as dealing in.

| Column       | Data Type   | Constraints         |
| ------------ | ----------- | ------------------- |
| buyer_id     | UUID        | FK → buyers.id      |
| commodity_id | UUID        | FK → commodities.id |
| created_at   | TIMESTAMPTZ | NOT NULL            |

Composite primary key:

```text
(buyer_id, commodity_id)
```

This relationship does not imply a confirmed purchase commitment.

---

# 16. Government Schemes Module

## 16.1 `government_schemes`

Stores government scheme information.

| Column                   | Data Type    | Constraints                |
| ------------------------ | ------------ | -------------------------- |
| id                       | UUID         | PK                         |
| name                     | VARCHAR(220) | NOT NULL                   |
| description              | TEXT         | NULL                       |
| administering_department | VARCHAR(180) | NULL                       |
| level                    | VARCHAR(30)  | NOT NULL                   |
| state                    | VARCHAR(100) | NULL                       |
| eligibility_summary      | TEXT         | NULL                       |
| benefits_summary         | TEXT         | NULL                       |
| application_url          | TEXT         | NULL                       |
| source_id                | UUID         | FK → data_sources.id, NULL |
| last_verified_at         | TIMESTAMPTZ  | NULL                       |
| scheme_status            | VARCHAR(30)  | NOT NULL                   |
| created_at               | TIMESTAMPTZ  | NOT NULL                   |
| updated_at               | TIMESTAMPTZ  | NOT NULL                   |

### Level

- CENTRAL
- STATE
- DISTRICT
- OTHER

### Scheme Status

- ACTIVE
- INACTIVE
- UNDER_REVIEW
- UNKNOWN

### Rules

- Scheme information must have an identifiable source.
- The last verification date must be displayed where available.
- Potential eligibility must not be represented as confirmed eligibility.
- Outdated information must be flagged.
- Application URLs must be validated before publication.

---

# 17. Agricultural Insights Module

Agricultural insights may include crop information, crop rotation suggestions, and general agricultural guidance.

These records should not be confused with personalised or officially verified recommendations.

## 17.1 `agricultural_insights`

| Column             | Data Type    | Constraints                |
| ------------------ | ------------ | -------------------------- |
| id                 | UUID         | PK                         |
| title              | VARCHAR(220) | NOT NULL                   |
| category           | VARCHAR(100) | NOT NULL                   |
| content            | TEXT         | NOT NULL                   |
| district           | VARCHAR(100) | NULL                       |
| source_id          | UUID         | FK → data_sources.id, NULL |
| last_verified_at   | TIMESTAMPTZ  | NULL                       |
| publication_status | VARCHAR(30)  | NOT NULL                   |
| created_at         | TIMESTAMPTZ  | NOT NULL                   |
| updated_at         | TIMESTAMPTZ  | NOT NULL                   |

## 17.2 `insight_commodities`

Associates agricultural insights with relevant commodities.

| Column       | Data Type | Constraints                   |
| ------------ | --------- | ----------------------------- |
| insight_id   | UUID      | FK → agricultural_insights.id |
| commodity_id | UUID      | FK → commodities.id           |

Composite primary key:

```text
(insight_id, commodity_id)
```

### Rules

- Information must have an identifiable source wherever possible.
- Unverified guidance must not be presented as official agricultural advice.
- District-specific information must be labelled appropriately.

---

# 18. Audit and Administrative Management

## 18.1 `audit_logs`

Stores important administrative and security-related actions.

| Column      | Data Type    | Constraints         |
| ----------- | ------------ | ------------------- |
| id          | UUID         | PK                  |
| user_id     | UUID         | FK → users.id, NULL |
| action      | VARCHAR(120) | NOT NULL            |
| entity_type | VARCHAR(100) | NULL                |
| entity_id   | UUID         | NULL                |
| description | TEXT         | NULL                |
| metadata    | JSONB        | NULL                |
| ip_address  | INET         | NULL                |
| created_at  | TIMESTAMPTZ  | NOT NULL            |

### Example Actions

- USER_CREATED
- USER_SUSPENDED
- MARKET_CREATED
- PRICE_DATA_IMPORTED
- PRICE_RECORD_REJECTED
- BUYER_VERIFIED
- SCHEME_UPDATED

### Rules

- Audit records must not be casually modified.
- Sensitive information must not be unnecessarily stored in logs.
- Passwords, access tokens, and private credentials must never be logged.
- Administrative changes should be traceable.

---

# 19. Table Relationship Summary

| Parent Table            | Child Table             | Relationship |
| ----------------------- | ----------------------- | ------------ |
| users                   | user_roles              | One-to-many  |
| roles                   | user_roles              | One-to-many  |
| users                   | farmer_profiles         | One-to-one   |
| farmer_profiles         | farms                   | One-to-many  |
| commodities             | market_prices           | One-to-many  |
| markets                 | market_prices           | One-to-many  |
| data_sources            | market_prices           | One-to-many  |
| data_sources            | ingestion_batches       | One-to-many  |
| farmer_profiles         | recommendation_requests | One-to-many  |
| commodities             | recommendation_requests | One-to-many  |
| recommendation_requests | recommendation_results  | One-to-many  |
| markets                 | recommendation_results  | One-to-many  |
| market_prices           | recommendation_results  | One-to-many  |
| farmer_profiles         | quality_assessments     | One-to-many  |
| commodities             | quality_assessments     | One-to-many  |
| buyers                  | buyer_commodities       | One-to-many  |
| commodities             | buyer_commodities       | One-to-many  |
| data_sources            | government_schemes      | One-to-many  |
| data_sources            | agricultural_insights   | One-to-many  |

---

# 20. Database Indexing Strategy

Indexes must be created for frequently queried columns.

They should improve query performance without creating unnecessary write overhead.

## 20.1 User Indexes

```sql
CREATE UNIQUE INDEX idx_users_email
ON users(email);
```

If a unique constraint already creates an index, do not create a duplicate index.

## 20.2 Market Price Indexes

The market-price table is expected to grow significantly.

Important query patterns include:

- Prices for a selected commodity.
- Prices for a selected market.
- Latest available prices.
- Historical prices for a commodity-market pair.

Recommended index:

```sql
CREATE INDEX idx_market_prices_commodity_market_date
ON market_prices (
    commodity_id,
    market_id,
    observation_date DESC
);
```

Additional index:

```sql
CREATE INDEX idx_market_prices_observation_date
ON market_prices(observation_date DESC);
```

## 20.3 Recommendation Indexes

```sql
CREATE INDEX idx_recommendation_requests_farmer
ON recommendation_requests(farmer_id, created_at DESC);
```

```sql
CREATE INDEX idx_recommendation_results_request
ON recommendation_results(request_id, ranking_position);
```

## 20.4 Buyer Indexes

```sql
CREATE INDEX idx_buyers_district_status
ON buyers(district, verification_status);
```

## 20.5 Indexing Rules

- Index frequently used foreign keys.
- Index columns used in filtering and sorting.
- Avoid indexing every column.
- Review query execution plans when performance becomes a concern.
- Add additional indexes only when justified by actual query patterns.

---

# 21. Important Data Integrity Rules

The following rules are mandatory.

## 21.1 Market Prices

- Never store a missing price as zero.
- Never discard observation dates.
- Never discard source information.
- Never silently overwrite historical records.
- Do not use rejected records for recommendations.
- Preserve price units.
- Validate imported data before making it available to farmers.

## 21.2 Financial Calculations

The following formulas must be used consistently.

**Quantity conversion:**

```text
1 Quintal = 100 KG
```

**Gross revenue:**

```text
Gross Revenue =
(Quantity in KG / 100) × Expected Price Per Quintal
```

**Total expenses:**

```text
Total Expenses =
Transportation Cost + Other Applicable Expenses
```

**Estimated net earnings:**

```text
Estimated Net Earnings =
Gross Revenue - Total Expenses
```

Use Java `BigDecimal` for financial calculations.

The backend must be the authoritative source of calculated results.

## 21.3 Recommendation Integrity

- A recommendation must reference its original request.
- Each result must reference the price observation used.
- Historical results must preserve their original assumptions.
- Invalid market-price records must not be used.
- Missing transportation estimates must not silently become zero.
- Ranking must be based on estimated net earnings.

## 21.4 User Data Isolation

- Farmers must only access their own private records.
- Farmers must not access another farmer's farm details.
- Farmers must not access another farmer's recommendation history.
- Farmers must not access another farmer's private quality assessments.
- Administrative operations must require appropriate permissions.

---

# 22. PostgreSQL Data Types and Validation Standards

| Data                     | PostgreSQL Type |
| ------------------------ | --------------- |
| Primary keys             | UUID            |
| Names                    | VARCHAR         |
| Long descriptions        | TEXT            |
| Prices                   | NUMERIC         |
| Quantities               | NUMERIC         |
| Latitude                 | NUMERIC(10,7)   |
| Longitude                | NUMERIC(10,7)   |
| Observation dates        | DATE            |
| Creation timestamps      | TIMESTAMPTZ     |
| Boolean flags            | BOOLEAN         |
| Flexible structured data | JSONB           |
| IP addresses             | INET            |

## 22.1 JSONB Usage

JSONB should be used only when flexible structured data is genuinely required.

Suitable examples:

- Recommendation calculation details.
- Quality-assessment output.
- Audit metadata.

Core relational data must remain in properly structured columns.

Do not store the entire application database as JSON documents.

---

# 23. Row Level Security and Database Permissions

## 23.1 Initial Access Model

The initial application architecture uses Spring Boot as the only application-level database access layer.

The React frontend will not directly query privileged PostgreSQL tables.

Therefore, application authorisation will primarily be enforced through Spring Security and backend service checks.

## 23.2 Supabase Security

Supabase database security features must still be reviewed and configured appropriately.

Requirements:

1. Do not expose privileged database credentials.
2. Restrict database access to trusted backend connections.
3. Review default database privileges.
4. Configure appropriate database roles.
5. Enable Row Level Security on tables exposed through Supabase APIs.
6. Avoid granting broad access to anonymous or public roles.
7. Test access permissions before deployment.

If a future feature requires direct frontend access to Supabase, proper Row Level Security policies must be implemented before that access is enabled.

RLS must not be treated as a substitute for Spring Security.

---

# 24. Demonstration Data Strategy

MandiWise may require sample data for demonstrations and development.

Sample data must remain distinguishable from actual agricultural records.

Recommended approach:

- Use clearly identified demonstration records.
- Maintain separate development and production environments.
- Use explicit data-origin metadata.
- Never silently replace unavailable actual records with sample values.

If demonstration data is stored in the same database, the schema must explicitly identify its status.

For example, a future data-origin field may distinguish:

```text
ACTUAL
SAMPLE
```

This field must be incorporated into the relevant data tables before mixed actual and sample records are introduced.

Demonstration records must never enter production recommendation calculations unless the application is explicitly operating in demonstration mode and clearly communicates that status.

---

# 25. Recommended Database Implementation Order

The database should be implemented progressively.

Do not create every table before the corresponding application features are ready.

## Phase 1 – Core Foundation

Create:

1. `users`
2. `roles`
3. `user_roles`
4. `farmer_profiles`
5. `farms`

Test:

- User registration.
- User retrieval.
- Role assignment.
- Farmer profile creation.
- Farm creation.
- Foreign-key relationships.

## Phase 2 – Market Data

Create:

1. `commodities`
2. `markets`
3. `data_sources`
4. `ingestion_batches`
5. `market_prices`

Test:

- Commodity insertion.
- Market insertion.
- Data-source creation.
- Price-data insertion.
- Price validation.
- Duplicate handling.
- Historical price retrieval.

## Phase 3 – Recommendation Engine

Create:

1. `transport_cost_configs`
2. `recommendation_requests`
3. `recommendation_results`

Test:

- Recommendation request creation.
- Quantity conversion.
- Gross revenue calculation.
- Transportation estimation.
- Net earnings calculation.
- Market ranking.
- Historical result retrieval.

## Phase 4 – Supporting Features

Create:

1. `quality_assessments`
2. `buyers`
3. `buyer_commodities`
4. `government_schemes`
5. `agricultural_insights`
6. `insight_commodities`

Test each module independently.

## Phase 5 – Administration

Create:

1. `audit_logs`

Test:

- Administrative actions.
- Audit record creation.
- Role restrictions.
- Data-management workflows.

---

# 26. Implementation Rules for AI Coding Assistants

Any AI coding assistant working on MandiWise must follow these rules.

### Database Design

1. Read this document before creating or modifying database tables.
2. Use PostgreSQL-compatible SQL.
3. Use UUID primary keys.
4. Follow the established naming conventions.
5. Preserve all required foreign-key relationships.
6. Add appropriate constraints.
7. Use NUMERIC for financial values.
8. Use TIMESTAMPTZ for timestamps.
9. Preserve market-price source information.
10. Avoid unnecessary JSONB fields.

### Spring Boot Integration

11. Use Spring Data JPA for database persistence.
12. Use Java `BigDecimal` for financial values.
13. Use DTOs rather than exposing database entities directly through APIs.
14. Keep business logic in service classes.
15. Keep controllers focused on HTTP handling.
16. Use transactions where multiple related database operations must succeed together.
17. Handle database exceptions properly.

### Migration Management

18. Use Flyway for schema migrations.
19. Never casually modify an already-applied migration.
20. Do not execute destructive SQL without explicit review.
21. Test migrations before applying them to production.
22. Keep migration files committed to Git.
23. Do not use Hibernate schema auto-update as the production schema-management strategy.

### Data Integrity

24. Never invent agricultural market data.
25. Never silently substitute sample data.
26. Never overwrite historical observations without a defined correction process.
27. Preserve the original data source.
28. Distinguish actual records from estimates and predictions.
29. Keep recommendation snapshots reproducible.
30. Validate data before allowing it into financial calculations.

### Development Workflow

31. Implement database modules in the documented order.
32. Test each module before proceeding.
33. Do not introduce unrelated tables prematurely.
34. Do not modify the approved architecture without discussing the change.
35. Keep this document updated if an approved schema decision changes.

---

# 27. Final Database Architecture Summary

| Module                    | Table                   |
| ------------------------- | ----------------------- |
| User                      | users                   |
| User Roles                | roles                   |
| User-Role Mapping         | user_roles              |
| Farmer                    | farmer_profiles         |
| Farm                      | farms                   |
| Commodity                 | commodities             |
| Market                    | markets                 |
| Market Prices             | market_prices           |
| Data Source               | data_sources            |
| Data Ingestion            | ingestion_batches       |
| Transport Configuration   | transport_cost_configs  |
| Recommendation Request    | recommendation_requests |
| Recommendation Results    | recommendation_results  |
| Quality Assessment        | quality_assessments     |
| Buyer                     | buyers                  |
| Buyer-Commodity Mapping   | buyer_commodities       |
| Government Schemes        | government_schemes      |
| Agricultural Insights     | agricultural_insights   |
| Insight-Commodity Mapping | insight_commodities     |
| Audit                     | audit_logs              |

---

# 28. Final Notes

This schema represents the intended database architecture for MandiWise.

It is designed to support the initial Karnataka-focused MVP while leaving room for future expansion.

The database should be implemented incrementally, following the implementation plan.

The most important initial tables are:

- Users.
- Farmer profiles.
- Commodities.
- Markets.
- Data sources.
- Market prices.
- Recommendation requests.
- Recommendation results.

These tables form the foundation of the application's primary purpose: helping farmers compare markets based on estimated net earnings.

Additional modules must not delay the implementation and validation of this core workflow.

**Accuracy, traceability, data integrity, and maintainability take priority over unnecessary database complexity.**

---

# END OF BACKEND SCHEMA DOCUMENT
