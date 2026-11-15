# MandiWise — Living Database Schema Tracker

**Database Platform:** Supabase PostgreSQL  
**Active Project Reference:** `tzncfzzaquyvdhblzgdm` (`mandiwise-dev`)  
**Region:** `ap-south-1` (Mumbai)  
**ORM / Data Layer:** Spring Data JPA + Hibernate  
**Migration Engine:** Flyway  
**Version:** 1.0 (Baseline Approved)  

---

## 1. Migration Sequence & Version Control Roadmap

Flyway migrations will reside in `backend/src/main/resources/db/migration/`.

| Migration File | Module Focus | Tables Introduced | Status |
| :--- | :--- | :--- | :---: |
| `V1__init_users_and_profiles.sql` | Auth & Farmer Profiles | `users`, `roles`, `user_roles`, `farmer_profiles`, `farms` | 🔴 Planned (Phase 4) |
| `V2__init_market_and_prices.sql` | Commodities & Mandi Prices | `commodities`, `markets`, `data_sources`, `ingestion_batches`, `market_prices` | 🔴 Planned (Phase 5) |
| `V3__init_recommendations.sql` | Calculations & Transport | `transport_cost_configs`, `recommendation_requests`, `recommendation_results` | 🔴 Planned (Phase 6) |
| `V4__init_quality_and_buyers.sql` | CV Assessment & Buyers | `quality_assessments`, `buyers`, `buyer_commodities` | 🔴 Planned (Phase 8/9) |
| `V5__init_schemes_insights_audit.sql`| Schemes, Insights & Audit | `government_schemes`, `agricultural_insights`, `insight_commodities`, `audit_logs` | 🔴 Planned (Phase 10/12) |

---

## 2. Table Specifications & Constraints

### 2.1 Users & Authentication Module

#### `users`
* `id` UUID PRIMARY KEY DEFAULT gen_random_uuid()
* `email` VARCHAR(255) NOT NULL UNIQUE
* `password_hash` VARCHAR(255) NOT NULL
* `full_name` VARCHAR(150) NOT NULL
* `phone_number` VARCHAR(20) NULL
* `account_status` VARCHAR(20) NOT NULL DEFAULT 'ACTIVE'
* `email_verified` BOOLEAN DEFAULT FALSE
* `last_login_at` TIMESTAMPTZ NULL
* `created_at` TIMESTAMPTZ NOT NULL DEFAULT NOW()
* `updated_at` TIMESTAMPTZ NOT NULL DEFAULT NOW()

#### `roles`
* `id` UUID PRIMARY KEY DEFAULT gen_random_uuid()
* `name` VARCHAR(30) NOT NULL UNIQUE (`ROLE_FARMER`, `ROLE_ADMIN`)
* `description` VARCHAR(255) NULL

#### `user_roles`
* `user_id` UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
* `role_id` UUID NOT NULL REFERENCES roles(id) ON DELETE RESTRICT
* `assigned_at` TIMESTAMPTZ NOT NULL DEFAULT NOW()
* PRIMARY KEY (`user_id`, `role_id`)

#### `farmer_profiles`
* `id` UUID PRIMARY KEY DEFAULT gen_random_uuid()
* `user_id` UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE
* `preferred_language` VARCHAR(20) DEFAULT 'KN'
* `district` VARCHAR(100) NULL
* `taluk` VARCHAR(100) NULL
* `village` VARCHAR(100) NULL
* `created_at` TIMESTAMPTZ NOT NULL DEFAULT NOW()
* `updated_at` TIMESTAMPTZ NOT NULL DEFAULT NOW()

#### `farms`
* `id` UUID PRIMARY KEY DEFAULT gen_random_uuid()
* `farmer_id` UUID NOT NULL REFERENCES farmer_profiles(id) ON DELETE CASCADE
* `farm_name` VARCHAR(150) NULL
* `district` VARCHAR(100) NOT NULL
* `taluk` VARCHAR(100) NULL
* `village` VARCHAR(100) NULL
* `land_area` NUMERIC(10,2) NULL CHECK (land_area > 0)
* `land_area_unit` VARCHAR(20) DEFAULT 'ACRES'
* `latitude` NUMERIC(10,7) NULL CHECK (latitude BETWEEN -90 AND 90)
* `longitude` NUMERIC(10,7) NULL CHECK (longitude BETWEEN -180 AND 180)
* `created_at` TIMESTAMPTZ NOT NULL DEFAULT NOW()
* `updated_at` TIMESTAMPTZ NOT NULL DEFAULT NOW()

---

### 2.2 Commodities & Market Prices Module

#### `commodities`
* `id` UUID PRIMARY KEY DEFAULT gen_random_uuid()
* `name` VARCHAR(120) NOT NULL
* `normalized_name` VARCHAR(120) NOT NULL UNIQUE
* `kannada_name` VARCHAR(120) NULL
* `category` VARCHAR(80) NULL
* `standard_unit` VARCHAR(30) NOT NULL DEFAULT 'QUINTAL'
* `is_active` BOOLEAN DEFAULT TRUE
* `created_at` TIMESTAMPTZ NOT NULL DEFAULT NOW()
* `updated_at` TIMESTAMPTZ NOT NULL DEFAULT NOW()

#### `markets`
* `id` UUID PRIMARY KEY DEFAULT gen_random_uuid()
* `name` VARCHAR(180) NOT NULL
* `normalized_name` VARCHAR(180) NOT NULL
* `district` VARCHAR(100) NOT NULL
* `state` VARCHAR(100) NOT NULL DEFAULT 'Karnataka'
* `state_code` VARCHAR(10) DEFAULT 'KA'
* `latitude` NUMERIC(10,7) NULL
* `longitude` NUMERIC(10,7) NULL
* `address` TEXT NULL
* `is_active` BOOLEAN DEFAULT TRUE
* `created_at` TIMESTAMPTZ NOT NULL DEFAULT NOW()
* `updated_at` TIMESTAMPTZ NOT NULL DEFAULT NOW()
* CONSTRAINT `uk_market_name_district_state` UNIQUE (`normalized_name`, `district`, `state`)

#### `data_sources`
* `id` UUID PRIMARY KEY DEFAULT gen_random_uuid()
* `name` VARCHAR(150) NOT NULL UNIQUE
* `source_type` VARCHAR(50) NOT NULL
* `base_url` TEXT NULL
* `is_active` BOOLEAN DEFAULT TRUE
* `created_at` TIMESTAMPTZ NOT NULL DEFAULT NOW()

#### `market_prices`
* `id` UUID PRIMARY KEY DEFAULT gen_random_uuid()
* `commodity_id` UUID NOT NULL REFERENCES commodities(id) ON DELETE RESTRICT
* `market_id` UUID NOT NULL REFERENCES markets(id) ON DELETE RESTRICT
* `source_id` UUID NOT NULL REFERENCES data_sources(id) ON DELETE RESTRICT
* `observation_date` DATE NOT NULL
* `min_price` NUMERIC(12,2) NULL CHECK (min_price >= 0)
* `max_price` NUMERIC(12,2) NULL CHECK (max_price >= 0)
* `modal_price` NUMERIC(12,2) NOT NULL CHECK (modal_price >= 0)
* `price_unit` VARCHAR(30) NOT NULL DEFAULT 'INR_PER_QUINTAL'
* `source_record_id` VARCHAR(180) NULL
* `retrieved_at` TIMESTAMPTZ NOT NULL DEFAULT NOW()
* `validation_status` VARCHAR(30) NOT NULL DEFAULT 'VALIDATED'
* `created_at` TIMESTAMPTZ NOT NULL DEFAULT NOW()
* CONSTRAINT `chk_price_range` CHECK (min_price IS NULL OR max_price IS NULL OR min_price <= max_price)

---

### 2.3 Recommendation Engine Module

#### `transport_cost_configs`
* `id` UUID PRIMARY KEY DEFAULT gen_random_uuid()
* `vehicle_type` VARCHAR(80) NOT NULL
* `cost_per_km` NUMERIC(10,2) NOT NULL CHECK (cost_per_km >= 0)
* `effective_from` DATE NOT NULL
* `effective_until` DATE NULL
* `is_active` BOOLEAN DEFAULT TRUE

#### `recommendation_requests`
* `id` UUID PRIMARY KEY DEFAULT gen_random_uuid()
* `farmer_id` UUID NOT NULL REFERENCES farmer_profiles(id)
* `commodity_id` UUID NOT NULL REFERENCES commodities(id)
* `quantity_kg` NUMERIC(12,2) NOT NULL CHECK (quantity_kg > 0)
* `origin_district` VARCHAR(100) NULL
* `origin_latitude` NUMERIC(10,7) NULL
* `origin_longitude` NUMERIC(10,7) NULL
* `request_status` VARCHAR(30) NOT NULL DEFAULT 'COMPLETED'
* `created_at` TIMESTAMPTZ NOT NULL DEFAULT NOW()

#### `recommendation_results`
* `id` UUID PRIMARY KEY DEFAULT gen_random_uuid()
* `request_id` UUID NOT NULL REFERENCES recommendation_requests(id) ON DELETE CASCADE
* `market_id` UUID NOT NULL REFERENCES markets(id)
* `market_price_id` UUID NOT NULL REFERENCES market_prices(id)
* `expected_price_per_quintal` NUMERIC(12,2) NOT NULL
* `gross_revenue` NUMERIC(14,2) NOT NULL
* `estimated_distance_km` NUMERIC(10,2) NULL
* `estimated_transport_cost` NUMERIC(12,2) NOT NULL
* `other_expenses` NUMERIC(12,2) NOT NULL DEFAULT 0.00
* `total_expenses` NUMERIC(12,2) NOT NULL
* `estimated_net_earnings` NUMERIC(14,2) NOT NULL
* `ranking_position` INTEGER NOT NULL CHECK (ranking_position >= 1)
* `calculation_details` JSONB NULL
* `created_at` TIMESTAMPTZ NOT NULL DEFAULT NOW()

---

## 3. High-Performance Indexing Strategy

```sql
-- Fast historical price queries by commodity and market over time
CREATE INDEX idx_market_prices_commodity_market_date
ON market_prices (commodity_id, market_id, observation_date DESC);

-- Fast latest price queries
CREATE INDEX idx_market_prices_observation_date
ON market_prices (observation_date DESC);

-- Farmer recommendation history lookup
CREATE INDEX idx_recommendation_requests_farmer
ON recommendation_requests (farmer_id, created_at DESC);

-- Recommendation results lookup by request and rank
CREATE INDEX idx_recommendation_results_request
ON recommendation_results (request_id, ranking_position);
```
