-- AI-Eng-TAM Survey Database Schema for Supabase
-- Run this in the Supabase SQL Editor to set up all tables and policies.

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- Table: respondents
-- ============================================================
CREATE TABLE respondents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  stakeholder_type TEXT NOT NULL CHECK (stakeholder_type IN ('faculty', 'student', 'practitioner')),
  access_code TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),

  -- Faculty demographics
  engineering_discipline TEXT,
  years_in_academia TEXT,         -- '0-5', '6-10', '11-20', '21+'
  primary_role TEXT,              -- 'Teaching', 'Research', 'Administration', 'Combination'
  institution_type TEXT,          -- 'R1', 'R2', 'Teaching-focused', 'Other'
  institution_type_other TEXT,
  prior_ai_experience TEXT,       -- 'None', 'Limited', 'Moderate', 'Extensive'
  primary_ai_context TEXT,        -- varies by stakeholder

  -- Student demographics
  major_program TEXT,
  year_in_program TEXT,           -- 'Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate'

  -- Practitioner demographics
  years_professional_experience TEXT,  -- '0-5', '6-10', '11-20', '21+'
  practitioner_role TEXT,              -- 'Engineer', 'Manager', 'Technical Lead', 'Hiring Manager', 'Other'
  practitioner_role_other TEXT,
  industry_sector TEXT,
  organization_size TEXT               -- '<100', '100-999', '1000-9999', '10000+'
);

-- ============================================================
-- Table: section_a_responses (AI Tool Usage by Category)
-- ============================================================
CREATE TABLE section_a_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  respondent_id UUID NOT NULL REFERENCES respondents(id) ON DELETE CASCADE,
  category TEXT NOT NULL,         -- 'ML', 'DL', 'NLP', 'CV', 'GenAI', 'Recommender', 'EngDesign', 'Robotics', 'Expert'
  uses_category BOOLEAN NOT NULL DEFAULT false,
  selected_tools JSONB DEFAULT '[]',   -- array of tool name strings
  other_tool TEXT,                      -- free-text "Other" entry
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- Table: likert_responses (Sections B, C, D)
-- ============================================================
CREATE TABLE likert_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  respondent_id UUID NOT NULL REFERENCES respondents(id) ON DELETE CASCADE,
  section TEXT NOT NULL CHECK (section IN ('B', 'C', 'D')),
  item_code TEXT NOT NULL,        -- e.g. 'PU-L1', 'EJ3', 'AR2', 'CR5'
  value INTEGER NOT NULL CHECK (value >= 1 AND value <= 7),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(respondent_id, item_code)
);

-- ============================================================
-- Indexes
-- ============================================================
CREATE INDEX idx_section_a_respondent ON section_a_responses(respondent_id);
CREATE INDEX idx_likert_respondent ON likert_responses(respondent_id);
CREATE INDEX idx_likert_item_code ON likert_responses(item_code);
CREATE INDEX idx_respondents_type ON respondents(stakeholder_type);

-- ============================================================
-- Row-Level Security (RLS)
-- ============================================================
ALTER TABLE respondents ENABLE ROW LEVEL SECURITY;
ALTER TABLE section_a_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE likert_responses ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (for survey submission)
CREATE POLICY "Allow anonymous insert" ON respondents
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous insert" ON section_a_responses
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous insert" ON likert_responses
  FOR INSERT WITH CHECK (true);

-- Allow reads only via service role (admin dashboard uses service key)
-- The anon key will NOT be able to read other respondents' data
CREATE POLICY "Deny anonymous reads" ON respondents
  FOR SELECT USING (false);

CREATE POLICY "Deny anonymous reads" ON section_a_responses
  FOR SELECT USING (false);

CREATE POLICY "Deny anonymous reads" ON likert_responses
  FOR SELECT USING (false);

-- Note: The admin dashboard should use the Supabase service_role key
-- to bypass RLS for reading data. Set VITE_SUPABASE_SERVICE_KEY
-- as an environment variable (never expose in client code for production).
-- For pilot-scale use, the admin route uses this key server-side or
-- you can create a Supabase Edge Function for the dashboard queries.
