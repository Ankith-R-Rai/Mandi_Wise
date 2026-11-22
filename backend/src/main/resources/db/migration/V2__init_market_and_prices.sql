-- =============================================================================
-- MandiWise: Flyway Migration V2
-- Description: Core Market Data Module Schema (Commodities, Markets, Prices)
-- Authoritative Schema: DATABASE_SCHEMA.md & implementation_plan.md
-- Best Practices: Supabase PostgreSQL Guidelines (UUIDs, TIMESTAMPTZ, FK Indexes)
-- =============================================================================

-- 1. COMMODITIES TABLE
CREATE TABLE IF NOT EXISTS commodities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(120) NOT NULL,
    normalized_name VARCHAR(120) UNIQUE NOT NULL,
    kannada_name VARCHAR(120),
    category VARCHAR(80),
    standard_unit VARCHAR(30) NOT NULL DEFAULT 'QUINTAL',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. MARKETS TABLE (APMC Mandis)
CREATE TABLE IF NOT EXISTS markets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(180) NOT NULL,
    normalized_name VARCHAR(180) NOT NULL,
    district VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL DEFAULT 'Karnataka',
    state_code VARCHAR(10) DEFAULT 'KA',
    latitude NUMERIC(10,7) CHECK (latitude IS NULL OR (latitude >= -90 AND latitude <= 90)),
    longitude NUMERIC(10,7) CHECK (longitude IS NULL OR (longitude >= -180 AND longitude <= 180)),
    address TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_market_name_district_state UNIQUE (normalized_name, district, state)
);

-- 3. DATA_SOURCES TABLE
CREATE TABLE IF NOT EXISTS data_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) UNIQUE NOT NULL,
    source_type VARCHAR(50) NOT NULL,
    base_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 4. INGESTION_BATCHES TABLE
CREATE TABLE IF NOT EXISTS ingestion_batches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_id UUID NOT NULL REFERENCES data_sources(id) ON DELETE CASCADE,
    batch_status VARCHAR(30) NOT NULL DEFAULT 'COMPLETED',
    records_processed INT NOT NULL DEFAULT 0,
    records_accepted INT NOT NULL DEFAULT 0,
    records_rejected INT NOT NULL DEFAULT 0,
    started_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMPTZ,
    error_log TEXT
);

-- 5. MARKET_PRICES TABLE
CREATE TABLE IF NOT EXISTS market_prices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    commodity_id UUID NOT NULL REFERENCES commodities(id) ON DELETE RESTRICT,
    market_id UUID NOT NULL REFERENCES markets(id) ON DELETE RESTRICT,
    source_id UUID NOT NULL REFERENCES data_sources(id) ON DELETE RESTRICT,
    batch_id UUID REFERENCES ingestion_batches(id) ON DELETE SET NULL,
    observation_date DATE NOT NULL,
    variety VARCHAR(80),
    min_price NUMERIC(12,2) CHECK (min_price IS NULL OR min_price >= 0),
    max_price NUMERIC(12,2) CHECK (max_price IS NULL OR max_price >= 0),
    modal_price NUMERIC(12,2) NOT NULL CHECK (modal_price >= 0),
    price_unit VARCHAR(30) NOT NULL DEFAULT 'INR_PER_QUINTAL',
    arrivals_tonnes NUMERIC(10,2) CHECK (arrivals_tonnes IS NULL OR arrivals_tonnes >= 0),
    source_record_id VARCHAR(180),
    validation_status VARCHAR(30) NOT NULL DEFAULT 'VALIDATED',
    freshness_status VARCHAR(30) NOT NULL DEFAULT 'FRESH',
    retrieved_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_price_range CHECK (min_price IS NULL OR max_price IS NULL OR min_price <= max_price),
    CONSTRAINT uk_market_price_obs UNIQUE (commodity_id, market_id, observation_date, variety)
);

-- =============================================================================
-- INDEXES (Supabase Best Practices: FK Coverage & High-Traffic Market Lookups)
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_commodities_normalized ON commodities(normalized_name);
CREATE INDEX IF NOT EXISTS idx_markets_district ON markets(district);
CREATE INDEX IF NOT EXISTS idx_markets_normalized ON markets(normalized_name);
CREATE INDEX IF NOT EXISTS idx_ingestion_batches_source ON ingestion_batches(source_id);
CREATE INDEX IF NOT EXISTS idx_market_prices_commodity ON market_prices(commodity_id);
CREATE INDEX IF NOT EXISTS idx_market_prices_market ON market_prices(market_id);
CREATE INDEX IF NOT EXISTS idx_market_prices_source ON market_prices(source_id);
CREATE INDEX IF NOT EXISTS idx_market_prices_batch ON market_prices(batch_id);
CREATE INDEX IF NOT EXISTS idx_market_prices_date ON market_prices(observation_date DESC);
CREATE INDEX IF NOT EXISTS idx_market_prices_commodity_market ON market_prices(commodity_id, market_id);

-- =============================================================================
-- SEED DATA: Baseline Commodities, Sources & Top Karnataka APMC Mandis
-- =============================================================================
INSERT INTO commodities (name, normalized_name, kannada_name, category, standard_unit) VALUES
    ('Tomato', 'tomato', 'ಟೊಮೆಟೊ', 'Vegetable', 'QUINTAL'),
    ('Onion', 'onion', 'ಈರುಳ್ಳಿ', 'Vegetable', 'QUINTAL'),
    ('Potato', 'potato', 'ಆಲೂಗಡ್ಡೆ', 'Vegetable', 'QUINTAL')
ON CONFLICT (normalized_name) DO NOTHING;

INSERT INTO data_sources (name, source_type, base_url) VALUES
    ('AGMARKNET', 'API', 'https://agmarknet.gov.in'),
    ('data.gov.in', 'PORTAL', 'https://data.gov.in')
ON CONFLICT (name) DO NOTHING;

INSERT INTO markets (name, normalized_name, district, state, state_code, latitude, longitude, address) VALUES
    ('Kolar', 'kolar', 'Kolar', 'Karnataka', 'KA', 13.1367, 78.1291, 'APMC Market Yard, Kolar'),
    ('Bengaluru (Yeshwanthpur)', 'bengaluru (yeshwanthpur)', 'Bengaluru Urban', 'Karnataka', 'KA', 13.0280, 77.5407, 'APMC Yard, Yeshwanthpur, Bengaluru'),
    ('Belagavi', 'belagavi', 'Belagavi', 'Karnataka', 'KA', 15.8497, 74.4977, 'APMC Market, Belagavi'),
    ('Mysuru (Bandipalya)', 'mysuru (bandipalya)', 'Mysuru', 'Karnataka', 'KA', 12.2819, 76.6667, 'APMC Bandipalya, Mysuru'),
    ('Hubballi (Amaragol)', 'hubballi (amaragol)', 'Dharwad', 'Karnataka', 'KA', 15.3950, 75.1050, 'APMC Yard, Amaragol, Hubballi'),
    ('Chikkaballapura', 'chikkaballapura', 'Chikkaballapura', 'Karnataka', 'KA', 13.4325, 77.7275, 'APMC Market Yard, Chikkaballapura'),
    ('Hassan', 'hassan', 'Hassan', 'Karnataka', 'KA', 13.0033, 76.1004, 'APMC Market, B.M. Road, Hassan'),
    ('Tumakuru', 'tumakuru', 'Tumakuru', 'Karnataka', 'KA', 13.3379, 77.1010, 'APMC Market Yard, Batawadi, Tumakuru')
ON CONFLICT (normalized_name, district, state) DO NOTHING;
