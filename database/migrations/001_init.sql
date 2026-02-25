-- =============================================================
-- Jyotish Darshan — Database Schema
-- Migration: 001_init.sql
-- =============================================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- =============================================================
-- USERS
-- =============================================================
CREATE TABLE users (
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email         VARCHAR(255) UNIQUE NOT NULL,
    username      VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name     VARCHAR(255),
    avatar_url    TEXT,
    is_active     BOOLEAN DEFAULT TRUE,
    is_verified   BOOLEAN DEFAULT FALSE,
    role          VARCHAR(50) DEFAULT 'user',  -- user | astrologer | admin
    created_at    TIMESTAMPTZ DEFAULT NOW(),
    updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);

-- =============================================================
-- KUNDLIS (Birth Charts)
-- =============================================================
CREATE TABLE kundlis (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
    name            VARCHAR(255) NOT NULL,
    date_of_birth   DATE NOT NULL,
    time_of_birth   TIME NOT NULL,
    place_of_birth  VARCHAR(500) NOT NULL,
    latitude        DECIMAL(10, 7) NOT NULL,
    longitude       DECIMAL(10, 7) NOT NULL,
    timezone        VARCHAR(100) NOT NULL,
    gender          VARCHAR(20),
    is_primary      BOOLEAN DEFAULT FALSE,

    -- Computed astrological data (stored as JSON for flexibility)
    ascendant       VARCHAR(50),          -- Lagna sign
    moon_sign       VARCHAR(50),          -- Janma Rashi
    sun_sign        VARCHAR(50),
    nakshatra       VARCHAR(100),         -- Birth star
    nakshatra_pada  INTEGER,
    yoga            VARCHAR(100),
    karana          VARCHAR(100),
    tithi           VARCHAR(100),

    -- Planetary positions JSON
    planetary_positions JSONB,
    house_positions     JSONB,
    chart_data          JSONB,            -- Full chart computation

    is_public       BOOLEAN DEFAULT FALSE,
    notes           TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_kundlis_user_id ON kundlis(user_id);
CREATE INDEX idx_kundlis_created_at ON kundlis(created_at DESC);

-- =============================================================
-- PLANETS
-- =============================================================
CREATE TABLE planets (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,        -- Sun, Moon, Mars...
    sanskrit    VARCHAR(100) NOT NULL,        -- Surya, Chandra, Mangal...
    symbol      VARCHAR(10),
    category    VARCHAR(50),                  -- grahas, shadow, upagrahas
    element     VARCHAR(50),
    nature      VARCHAR(50),                  -- benefic | malefic | neutral
    day_ruled   VARCHAR(50),
    gemstone    VARCHAR(100),
    color       VARCHAR(50),
    metal       VARCHAR(50),
    mantra      TEXT,
    description TEXT,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================
-- RASHIS (Zodiac Signs)
-- =============================================================
CREATE TABLE rashis (
    id              SERIAL PRIMARY KEY,
    name            VARCHAR(100) NOT NULL,    -- Mesha, Vrishabha...
    english_name    VARCHAR(100) NOT NULL,    -- Aries, Taurus...
    symbol          VARCHAR(10),
    ruling_planet   VARCHAR(100),
    element         VARCHAR(50),             -- Fire, Earth, Air, Water
    quality         VARCHAR(50),             -- Cardinal, Fixed, Mutable
    gender          VARCHAR(20),
    start_degree    DECIMAL(6,2),
    end_degree      DECIMAL(6,2),
    date_range      VARCHAR(100),
    traits          TEXT[],
    body_parts      TEXT[],
    lucky_numbers   INTEGER[],
    lucky_colors    TEXT[],
    lucky_gems      TEXT[],
    description     TEXT,
    love_compat     INTEGER[],               -- compatible rashi IDs
    career_fields   TEXT[]
);

-- =============================================================
-- NAKSHATRAS (Lunar Mansions)
-- =============================================================
CREATE TABLE nakshatras (
    id              SERIAL PRIMARY KEY,
    name            VARCHAR(100) NOT NULL,
    symbol          VARCHAR(100),
    ruling_planet   VARCHAR(100),
    deity           VARCHAR(100),
    pada_count      INTEGER DEFAULT 4,
    start_degree    DECIMAL(6,2),
    end_degree      DECIMAL(6,2),
    qualities       TEXT[],
    favorable       TEXT[],
    unfavorable     TEXT[],
    description     TEXT
);

-- =============================================================
-- DASHAS (Planetary Periods)
-- =============================================================
CREATE TABLE dasha_periods (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    kundli_id       UUID REFERENCES kundlis(id) ON DELETE CASCADE,
    planet          VARCHAR(100) NOT NULL,
    dasha_type      VARCHAR(50) NOT NULL,     -- mahadasha | antardasha | pratyantardasha
    start_date      DATE NOT NULL,
    end_date        DATE NOT NULL,
    parent_dasha_id UUID REFERENCES dasha_periods(id),
    description     TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_dasha_kundli_id ON dasha_periods(kundli_id);
CREATE INDEX idx_dasha_dates ON dasha_periods(start_date, end_date);

-- =============================================================
-- HOROSCOPES
-- =============================================================
CREATE TABLE horoscopes (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rashi_id    INTEGER REFERENCES rashis(id),
    type        VARCHAR(50) NOT NULL,         -- daily | weekly | monthly | yearly
    date_from   DATE NOT NULL,
    date_to     DATE NOT NULL,
    prediction  TEXT NOT NULL,
    love_score       INTEGER CHECK (love_score BETWEEN 0 AND 100),
    career_score     INTEGER CHECK (career_score BETWEEN 0 AND 100),
    health_score     INTEGER CHECK (health_score BETWEEN 0 AND 100),
    finance_score    INTEGER CHECK (finance_score BETWEEN 0 AND 100),
    lucky_color      VARCHAR(100),
    lucky_number     INTEGER,
    lucky_gem        VARCHAR(100),
    lucky_day        VARCHAR(50),
    love_prediction  TEXT,
    career_prediction TEXT,
    health_prediction TEXT,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_horoscopes_rashi_date ON horoscopes(rashi_id, date_from, date_to);
CREATE INDEX idx_horoscopes_type ON horoscopes(type);

-- =============================================================
-- PLANETARY TRANSITS
-- =============================================================
CREATE TABLE planetary_transits (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    planet          VARCHAR(100) NOT NULL,
    from_sign       VARCHAR(100),
    to_sign         VARCHAR(100) NOT NULL,
    transit_date    DATE NOT NULL,
    end_date        DATE,
    is_retrograde   BOOLEAN DEFAULT FALSE,
    degree_position DECIMAL(6,2),
    effects         TEXT,
    affected_rashis INTEGER[],
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_transits_date ON planetary_transits(transit_date);
CREATE INDEX idx_transits_planet ON planetary_transits(planet);

-- =============================================================
-- REMEDIES
-- =============================================================
CREATE TABLE remedies (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    planet      VARCHAR(100),
    rashi_id    INTEGER REFERENCES rashis(id),
    category    VARCHAR(100) NOT NULL,    -- mantra | gemstone | puja | fasting | donation | yantra | herb
    title       VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    mantra      TEXT,
    gemstone    VARCHAR(100),
    day         VARCHAR(50),
    color       VARCHAR(100),
    food        TEXT,
    duration    VARCHAR(100),
    difficulty  VARCHAR(50) DEFAULT 'easy',   -- easy | medium | hard
    is_verified BOOLEAN DEFAULT TRUE,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================
-- COMPATIBILITY (Kundli Milan)
-- =============================================================
CREATE TABLE compatibility_reports (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    kundli_1_id     UUID REFERENCES kundlis(id) ON DELETE CASCADE,
    kundli_2_id     UUID REFERENCES kundlis(id) ON DELETE CASCADE,
    user_id         UUID REFERENCES users(id) ON DELETE CASCADE,

    -- Ashtakoota scores
    varna_score     INTEGER,
    vashya_score    INTEGER,
    tara_score      INTEGER,
    yoni_score      INTEGER,
    graha_maitri    INTEGER,
    gana_score      INTEGER,
    bhakoot_score   INTEGER,
    nadi_score      INTEGER,

    total_score     INTEGER,               -- out of 36
    max_score       INTEGER DEFAULT 36,
    recommendation  VARCHAR(50),           -- excellent | good | average | not recommended
    details         JSONB,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(kundli_1_id, kundli_2_id)
);

-- =============================================================
-- USER SESSIONS (managed by Java service)
-- =============================================================
CREATE TABLE user_sessions (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
    token_hash      VARCHAR(255) NOT NULL,
    device_info     TEXT,
    ip_address      VARCHAR(50),
    expires_at      TIMESTAMPTZ NOT NULL,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_sessions_expires ON user_sessions(expires_at);

-- =============================================================
-- AUDIT LOG
-- =============================================================
CREATE TABLE audit_logs (
    id          BIGSERIAL PRIMARY KEY,
    user_id     UUID REFERENCES users(id),
    action      VARCHAR(100) NOT NULL,
    resource    VARCHAR(100),
    resource_id UUID,
    details     JSONB,
    ip_address  VARCHAR(50),
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_created ON audit_logs(created_at DESC);

-- =============================================================
-- TRIGGERS — auto-update updated_at
-- =============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_kundlis_updated_at BEFORE UPDATE ON kundlis FOR EACH ROW EXECUTE FUNCTION update_updated_at();
