-- NamingGuru (தமிழ் குழந்தை பெயர்கள்) PostgreSQL Schema
-- Dedicated Supabase / Neon PostgreSQL Instance

CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE TABLE IF NOT EXISTS tamil_names (
  id VARCHAR(64) PRIMARY KEY,
  slug VARCHAR(128) UNIQUE NOT NULL,
  name_tamil VARCHAR(128) NOT NULL,
  name_latin VARCHAR(128) NOT NULL,
  gender VARCHAR(16) NOT NULL CHECK (gender IN ('boy', 'girl', 'unisex')),
  meaning_ta TEXT NOT NULL,
  meaning_en TEXT NOT NULL,
  origin_category VARCHAR(64) NOT NULL,
  theme JSONB DEFAULT '[]'::jsonb,
  nakshatra_slugs JSONB DEFAULT '[]'::jsonb,
  starting_syllable_ta VARCHAR(16) NOT NULL,
  starting_syllable_en VARCHAR(16) NOT NULL,
  rasi_ta VARCHAR(64),
  rasi_en VARCHAR(64),
  literary_reference TEXT,
  source_citation TEXT,
  confidence NUMERIC(4,2) DEFAULT 0.90,
  popularity_rank VARCHAR(32) DEFAULT 'moderate',
  verification_status VARCHAR(128) DEFAULT 'AI-Verified',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tamil_names_latin_trgm ON tamil_names USING gin (name_latin gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_tamil_names_gender ON tamil_names (gender);

CREATE TABLE IF NOT EXISTS social_polls (
  token VARCHAR(64) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  parent_name VARCHAR(128) NOT NULL,
  candidate_slugs JSONB NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  closes_at TIMESTAMPTZ NOT NULL,
  votes JSONB DEFAULT '[]'::jsonb
);

CREATE TABLE IF NOT EXISTS public_suggestions (
  id VARCHAR(64) PRIMARY KEY,
  name_tamil VARCHAR(128) NOT NULL,
  name_latin VARCHAR(128) NOT NULL,
  gender VARCHAR(16) NOT NULL,
  meaning_ta TEXT NOT NULL,
  meaning_en TEXT NOT NULL,
  literary_reference TEXT,
  submitted_by VARCHAR(128),
  status VARCHAR(32) NOT NULL,
  ai_confidence NUMERIC(4,2) NOT NULL,
  ai_review_note TEXT,
  ai_model_used VARCHAR(128),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS error_reports (
  id VARCHAR(64) PRIMARY KEY,
  name_slug VARCHAR(128) NOT NULL,
  issue_type VARCHAR(64) NOT NULL,
  details TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

