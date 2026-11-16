-- KidNamingApp (Peyarcholai) V1 PostgreSQL Migration (Design 06 §4)
-- Compatible with Neon PostgreSQL 16/17 (run via Neon SQL Editor or DATABASE_URL_UNPOOLED)

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email            VARCHAR(255) UNIQUE,
  phone            VARCHAR(20) UNIQUE,
  full_name        VARCHAR(150),
  avatar_url       TEXT,
  primary_provider VARCHAR(30) NOT NULL CHECK (primary_provider IN ('google', 'facebook', 'phone', 'email')),
  email_verified   TIMESTAMPTZ,
  phone_verified   TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_accounts (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider            VARCHAR(30) NOT NULL,
  provider_account_id VARCHAR(255) NOT NULL,
  refresh_token       TEXT,
  access_token        TEXT,
  expires_at          BIGINT,
  token_type          VARCHAR(50),
  scope               TEXT,
  id_token            TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (provider, provider_account_id)
);

CREATE TABLE IF NOT EXISTS sessions (
  id_hash      CHAR(64) PRIMARY KEY,
  user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at   TIMESTAMPTZ NOT NULL,
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);

CREATE TABLE IF NOT EXISTS entitlements (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  app_id     TEXT NOT NULL DEFAULT 'peyarcholai',
  tier       TEXT NOT NULL CHECK (tier IN ('suvadi_49', 'kudumba_499')),
  starts_at  TIMESTAMPTZ NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  source     TEXT NOT NULL,
  CHECK (expires_at > starts_at)
);
CREATE INDEX IF NOT EXISTS idx_ent_user_active ON entitlements(user_id, expires_at);

CREATE TABLE IF NOT EXISTS shortlists (
  user_id  UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  slug     TEXT NOT NULL,
  added_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, slug)
);

CREATE TABLE IF NOT EXISTS polls (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id       UUID REFERENCES users(id) ON DELETE CASCADE,
  invite_token        VARCHAR(64) UNIQUE NOT NULL,
  creator_secret_hash CHAR(64),
  title               VARCHAR(120) NOT NULL,
  parent_name         VARCHAR(120) NOT NULL DEFAULT 'Parents',
  notes               VARCHAR(500),
  candidate_slugs     JSONB NOT NULL CHECK (jsonb_array_length(candidate_slugs) BETWEEN 1 AND 10),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  closes_at           TIMESTAMPTZ NOT NULL,
  closed_at           TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS poll_votes (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id          UUID NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
  voter_token_hash CHAR(64) NOT NULL,
  voter_name       VARCHAR(60) NOT NULL,
  loved_slugs      JSONB NOT NULL DEFAULT '[]'::jsonb,
  removed_slugs    JSONB NOT NULL DEFAULT '[]'::jsonb,
  reason           VARCHAR(120) NOT NULL DEFAULT 'Personal preference',
  comment          VARCHAR(280) NOT NULL DEFAULT '',
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (poll_id, voter_token_hash)
);

CREATE TABLE IF NOT EXISTS class_collision_surveys (
  id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_slug              VARCHAR(128) NOT NULL,
  had_same_name_in_class BOOLEAN NOT NULL,
  class_size             INTEGER NOT NULL CHECK (class_size BETWEEN 5 AND 100),
  created_at             TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_collision_survey_slug ON class_collision_surveys(name_slug);
