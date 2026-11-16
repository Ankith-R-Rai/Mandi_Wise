-- =============================================================================
-- MandiWise: Flyway Migration V1
-- Description: Core User Management, Authentication & Farmer Profiles Schema
-- Authoritative Schema: BACKEND_SCHEMA.md
-- Best Practices: Supabase PostgreSQL Guidelines (UUIDs, TIMESTAMPTZ, FK Indexes)
-- =============================================================================

-- 1. ROLES TABLE
CREATE TABLE IF NOT EXISTS roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(30) UNIQUE NOT NULL,
    description VARCHAR(255)
);

-- 2. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    phone_number VARCHAR(20),
    account_status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    email_verified BOOLEAN DEFAULT FALSE,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 3. USER_ROLES JOIN TABLE (Composite Primary Key)
CREATE TABLE IF NOT EXISTS user_roles (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, role_id)
);

-- 4. FARMER_PROFILES TABLE (1-to-1 with users)
CREATE TABLE IF NOT EXISTS farmer_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    preferred_language VARCHAR(20) DEFAULT 'EN',
    district VARCHAR(100),
    taluk VARCHAR(100),
    village VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 5. FARMS TABLE (1-to-Many with farmer_profiles)
CREATE TABLE IF NOT EXISTS farms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farmer_id UUID NOT NULL REFERENCES farmer_profiles(id) ON DELETE CASCADE,
    farm_name VARCHAR(150),
    district VARCHAR(100) NOT NULL,
    taluk VARCHAR(100),
    village VARCHAR(100),
    land_area NUMERIC(10,2) CHECK (land_area IS NULL OR land_area > 0),
    land_area_unit VARCHAR(20) DEFAULT 'ACRES',
    latitude NUMERIC(10,7) CHECK (latitude IS NULL OR (latitude >= -90 AND latitude <= 90)),
    longitude NUMERIC(10,7) CHECK (longitude IS NULL OR (longitude >= -180 AND longitude <= 180)),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- INDEXES (Supabase Best Practices: FK Coverage & High-Traffic Lookups)
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_user_roles_role_id ON user_roles(role_id);
CREATE INDEX IF NOT EXISTS idx_farmer_profiles_user_id ON farmer_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_farms_farmer_id ON farms(farmer_id);

-- =============================================================================
-- SEED DATA: Baseline System Roles
-- =============================================================================
INSERT INTO roles (name, description) VALUES
    ('ROLE_FARMER', 'Standard farmer account with access to market prices, recommendations, and farm management'),
    ('ROLE_ADMIN', 'Platform administrative account with data management and governance access')
ON CONFLICT (name) DO NOTHING;
