-- Hatua schema (Postgres). SQLAlchemy create_all also applies this on boot.

CREATE TABLE IF NOT EXISTS stations (
  id INTEGER PRIMARY KEY,
  site_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  lon DOUBLE PRECISION NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  elev_m DOUBLE PRECISION NOT NULL,
  timezone TEXT DEFAULT 'Africa/Nairobi',
  cadence_s INTEGER DEFAULT 61
);

CREATE TABLE IF NOT EXISTS observations (
  station_id INTEGER NOT NULL REFERENCES stations(id),
  observed_at TIMESTAMPTZ NOT NULL,
  payload JSONB NOT NULL,
  rg DOUBLE PRECISION,
  rg2 DOUBLE PRECISION,
  st1 DOUBLE PRECISION,
  bt1 DOUBLE PRECISION,
  mt1 DOUBLE PRECISION,
  sh1 DOUBLE PRECISION,
  wbgt DOUBLE PRECISION,
  hi DOUBLE PRECISION,
  su1 DOUBLE PRECISION,
  ws DOUBLE PRECISION,
  wg DOUBLE PRECISION,
  hth DOUBLE PRECISION,
  source TEXT DEFAULT 'csv',
  ingest_run_id TEXT,
  PRIMARY KEY (station_id, observed_at)
);

CREATE TABLE IF NOT EXISTS trust_verdicts (
  station_id INTEGER NOT NULL REFERENCES stations(id),
  observed_at TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL,
  score DOUBLE PRECISION NOT NULL,
  flags JSONB NOT NULL,
  policy_id TEXT DEFAULT 'trust_v1',
  details JSONB NOT NULL,
  PRIMARY KEY (station_id, observed_at)
);

CREATE TABLE IF NOT EXISTS actions (
  id TEXT PRIMARY KEY,
  station_id INTEGER NOT NULL REFERENCES stations(id),
  kind TEXT NOT NULL,
  status TEXT NOT NULL,
  valid_from TIMESTAMPTZ NOT NULL,
  valid_until TIMESTAMPTZ NOT NULL,
  policy_id TEXT DEFAULT 'actions_v1',
  trust_status TEXT NOT NULL,
  explanation JSONB NOT NULL,
  headline TEXT,
  UNIQUE (station_id, kind, valid_from)
);

CREATE TABLE IF NOT EXISTS residuals (
  id SERIAL PRIMARY KEY,
  station_id INTEGER NOT NULL REFERENCES stations(id),
  valid_at TIMESTAMPTZ NOT NULL,
  conduit_mm DOUBLE PRECISION NOT NULL,
  model_mm DOUBLE PRECISION,
  model_id TEXT NOT NULL,
  delta_mm DOUBLE PRECISION,
  UNIQUE (station_id, valid_at, model_id)
);

CREATE TABLE IF NOT EXISTS events (
  id BIGSERIAL PRIMARY KEY,
  ts TIMESTAMPTZ NOT NULL,
  type TEXT NOT NULL,
  station_id INTEGER NOT NULL,
  payload JSONB NOT NULL
);

CREATE TABLE IF NOT EXISTS ingest_runs (
  id TEXT PRIMARY KEY,
  source TEXT NOT NULL,
  started_at TIMESTAMPTZ NOT NULL,
  finished_at TIMESTAMPTZ,
  rows_ok INTEGER DEFAULT 0,
  rows_dead INTEGER DEFAULT 0,
  error TEXT
);

CREATE TABLE IF NOT EXISTS dead_letters (
  id SERIAL PRIMARY KEY,
  raw TEXT NOT NULL,
  reason TEXT NOT NULL,
  seen_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS outbox (
  id TEXT PRIMARY KEY,
  action_id TEXT NOT NULL,
  channel TEXT DEFAULT 'log',
  payload JSONB NOT NULL,
  status TEXT DEFAULT 'pending'
);

CREATE TABLE IF NOT EXISTS replay_clock (
  station_id INTEGER PRIMARY KEY,
  as_of TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS source_state (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS observations_station_time ON observations (station_id, observed_at DESC);
CREATE INDEX IF NOT EXISTS actions_station_from ON actions (station_id, valid_from DESC);
CREATE INDEX IF NOT EXISTS events_station_id ON events (station_id, id);
