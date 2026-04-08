-- Compliance module tables (PostgreSQL)

CREATE TABLE compliance_authorized_rep (
  id SERIAL PRIMARY KEY,
  cooperative_id INTEGER NOT NULL,
  full_name TEXT NOT NULL,
  position TEXT NOT NULL,
  government_id_type TEXT NOT NULL,
  government_id_no TEXT NOT NULL,
  mobile TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE compliance_filing (
  id SERIAL PRIMARY KEY,
  cooperative_id INTEGER NOT NULL,
  coverage_year INTEGER NOT NULL,
  registration_no TEXT NOT NULL,
  profile_type TEXT NOT NULL,
  has_cte BOOLEAN DEFAULT FALSE,
  filing_status TEXT DEFAULT 'DRAFT',
  filing_channel TEXT DEFAULT 'CAPRIS',
  asset_size_class TEXT,
  authorized_rep_id INTEGER,
  membership_total INTEGER DEFAULT 0,
  membership_regular INTEGER DEFAULT 0,
  membership_associate INTEGER DEFAULT 0,
  completeness JSONB,
  submitted_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE compliance_filing_module (
  id SERIAL PRIMARY KEY,
  filing_id INTEGER NOT NULL,
  module_type TEXT NOT NULL,
  is_required BOOLEAN DEFAULT TRUE,
  status TEXT DEFAULT 'NOT_STARTED',
  evidence_url TEXT,
  evidence_version INTEGER DEFAULT 1,
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE compliance_deficiency (
  id SERIAL PRIMARY KEY,
  filing_id INTEGER NOT NULL,
  notice_date TIMESTAMP NOT NULL,
  deadline_date TIMESTAMP NOT NULL,
  details TEXT NOT NULL,
  resolved BOOLEAN DEFAULT FALSE,
  resolved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE compliance_penalty (
  id SERIAL PRIMARY KEY,
  filing_id INTEGER NOT NULL,
  days_late INTEGER NOT NULL,
  amount NUMERIC NOT NULL,
  assessed_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE compliance_sworn_statement (
  id SERIAL PRIMARY KEY,
  filing_id INTEGER UNIQUE NOT NULL,
  adheres_ra9520 BOOLEAN NOT NULL,
  adheres_cd_a_mc_2024_16 BOOLEAN NOT NULL,
  conflict_of_interest BOOLEAN NOT NULL,
  disloyalty BOOLEAN NOT NULL,
  confidentiality BOOLEAN NOT NULL,
  signatory_name TEXT NOT NULL,
  signatory_position TEXT NOT NULL,
  signed_at TIMESTAMP NOT NULL,
  evidence_url TEXT
);

CREATE TABLE compliance_requirement_profile (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  expression JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE compliance_requirement_module (
  id SERIAL PRIMARY KEY,
  profile_id INTEGER NOT NULL,
  module_type TEXT NOT NULL,
  condition JSONB,
  is_required BOOLEAN DEFAULT TRUE
);
