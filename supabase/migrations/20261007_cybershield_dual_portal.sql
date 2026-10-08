-- ============================================================================
-- CYBERSHIELD — COMPLETE SUPABASE DATABASE SCHEMA WITH DUAL-PORTAL RLS
-- Client Portal & Security Team Portal (SOC)
-- ============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. ENUMS
DO $$ BEGIN
  CREATE TYPE user_portal_type AS ENUM ('client', 'security', 'admin');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE user_role_type AS ENUM (
    'client_user',
    'client_manager',
    'soc_analyst',
    'senior_soc_analyst',
    'incident_responder',
    'security_manager',
    'soc_admin',
    'threat_intel_analyst',
    'security_auditor',
    'super_admin'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE incident_severity_type AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE incident_status_type AS ENUM (
    'REPORTED',
    'UNDER_REVIEW',
    'TRIAGED',
    'ASSIGNED',
    'INVESTIGATING',
    'CONTAINED',
    'ERADICATED',
    'RECOVERING',
    'RESOLVED',
    'CLOSED',
    'ESCALATED',
    'REOPENED',
    'FALSE_POSITIVE'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE comment_visibility_type AS ENUM ('client_visible', 'internal_security');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE ioc_type_enum AS ENUM ('IP', 'Domain', 'URL', 'Hash', 'Email', 'File', 'Account');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 3. ORGANIZATIONS TABLE
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  tier TEXT NOT NULL DEFAULT 'Enterprise',
  domain TEXT,
  contact_email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. USER PROFILES TABLE (Linked to auth.users if Supabase Auth is active)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  department TEXT NOT NULL DEFAULT 'General',
  role user_role_type NOT NULL DEFAULT 'client_user',
  portal_type user_portal_type NOT NULL DEFAULT 'client',
  avatar_url TEXT,
  mfa_enabled BOOLEAN NOT NULL DEFAULT false,
  clearance_level TEXT NOT NULL DEFAULT 'L1',
  account_status TEXT NOT NULL DEFAULT 'Active',
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. INCIDENTS TABLE
CREATE TABLE IF NOT EXISTS cybershield_incidents (
  id SERIAL PRIMARY KEY,
  incident_number TEXT NOT NULL UNIQUE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  severity incident_severity_type NOT NULL DEFAULT 'MEDIUM',
  priority TEXT NOT NULL DEFAULT 'NORMAL',
  risk_score INTEGER NOT NULL DEFAULT 35,
  status incident_status_type NOT NULL DEFAULT 'REPORTED',
  reporter_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  reporter_name TEXT NOT NULL,
  department TEXT NOT NULL,
  assigned_analyst_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  assigned_analyst_name TEXT,
  affected_system TEXT,
  affected_users INTEGER NOT NULL DEFAULT 1,
  impact_business TEXT,
  impact_data TEXT,
  impact_availability TEXT,
  impact_summary TEXT DEFAULT 'Impact is being assessed.',
  location TEXT,
  technical_details TEXT,
  incident_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  discovery_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  sla_due_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '4 hours'),
  attack_vector TEXT,
  root_cause TEXT,
  containment TEXT,
  eradication TEXT,
  recovery TEXT,
  resolution TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. INCIDENT COMMENTS TABLE (Dual communication channel)
CREATE TABLE IF NOT EXISTS cybershield_incident_comments (
  id SERIAL PRIMARY KEY,
  incident_id INTEGER NOT NULL REFERENCES cybershield_incidents(id) ON DELETE CASCADE,
  author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  author_name TEXT NOT NULL,
  author_role TEXT NOT NULL,
  author_portal user_portal_type NOT NULL DEFAULT 'client',
  message TEXT NOT NULL,
  visibility comment_visibility_type NOT NULL DEFAULT 'client_visible',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. INCIDENT TIMELINE TABLE
CREATE TABLE IF NOT EXISTS cybershield_incident_timeline (
  id SERIAL PRIMARY KEY,
  incident_id INTEGER NOT NULL REFERENCES cybershield_incidents(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  detail TEXT NOT NULL,
  actor TEXT NOT NULL,
  kind TEXT NOT NULL DEFAULT 'activity',
  is_internal BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8. INCIDENT EVIDENCE TABLE
CREATE TABLE IF NOT EXISTS cybershield_incident_evidence (
  id SERIAL PRIMARY KEY,
  incident_id INTEGER NOT NULL REFERENCES cybershield_incidents(id) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size TEXT NOT NULL,
  file_hash TEXT NOT NULL,
  uploaded_by_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  uploaded_by_name TEXT NOT NULL,
  uploaded_by_role TEXT NOT NULL,
  storage_path TEXT,
  is_internal BOOLEAN NOT NULL DEFAULT false,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 9. INCIDENT IOCS (Indicators of Compromise) TABLE
CREATE TABLE IF NOT EXISTS cybershield_incident_iocs (
  id SERIAL PRIMARY KEY,
  incident_id INTEGER REFERENCES cybershield_incidents(id) ON DELETE CASCADE,
  ioc_type ioc_type_enum NOT NULL,
  value TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'SOC Investigation',
  threat_level TEXT NOT NULL DEFAULT 'Medium',
  confidence INTEGER NOT NULL DEFAULT 85,
  status TEXT NOT NULL DEFAULT 'Active',
  first_seen TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_seen TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 10. INCIDENT CHECKLIST TABLE
CREATE TABLE IF NOT EXISTS cybershield_incident_checklist (
  id SERIAL PRIMARY KEY,
  incident_id INTEGER NOT NULL REFERENCES cybershield_incidents(id) ON DELETE CASCADE,
  phase TEXT NOT NULL DEFAULT 'Triage',
  label TEXT NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false,
  completed_by TEXT,
  completed_at TIMESTAMPTZ
);

-- 11. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS cybershield_audit_logs (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  user_name TEXT NOT NULL,
  user_role TEXT NOT NULL,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  details TEXT NOT NULL,
  ip_address TEXT DEFAULT '127.0.0.1',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 12. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS cybershield_notifications (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info',
  link TEXT,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- 13. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cybershield_incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE cybershield_incident_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE cybershield_incident_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE cybershield_incident_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE cybershield_incident_iocs ENABLE ROW LEVEL SECURITY;
ALTER TABLE cybershield_incident_checklist ENABLE ROW LEVEL SECURITY;
ALTER TABLE cybershield_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE cybershield_notifications ENABLE ROW LEVEL SECURITY;

-- Helper function: Get authenticated user's portal type
CREATE OR REPLACE FUNCTION auth_user_portal_type()
RETURNS user_portal_type AS $$
  SELECT portal_type FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Helper function: Get authenticated user's organization id
CREATE OR REPLACE FUNCTION auth_user_organization_id()
RETURNS UUID AS $$
  SELECT organization_id FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- 13.1 PROFILES POLICIES
CREATE POLICY "Users can read own profile" ON profiles
  FOR SELECT USING (auth.uid() = id OR auth_user_portal_type() IN ('security', 'admin'));

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins have full access to profiles" ON profiles
  FOR ALL USING (auth_user_portal_type() = 'admin');

-- 13.2 INCIDENTS POLICIES
-- Client users can only see incidents for their own organization
-- Security & Admin users can see all incidents across organizations
CREATE POLICY "Client users see own organization incidents" ON cybershield_incidents
  FOR SELECT USING (
    (auth_user_portal_type() = 'client' AND organization_id = auth_user_organization_id())
    OR auth_user_portal_type() IN ('security', 'admin')
  );

CREATE POLICY "Client users can insert incidents for own organization" ON cybershield_incidents
  FOR INSERT WITH CHECK (
    auth_user_portal_type() = 'client' AND organization_id = auth_user_organization_id()
  );

CREATE POLICY "Security team and admins can update incidents" ON cybershield_incidents
  FOR UPDATE USING (
    auth_user_portal_type() IN ('security', 'admin')
  );

-- 13.3 COMMENTS POLICIES (STRICT SEPARATION: CLIENT CANNOT QUERY INTERNAL COMMENTS)
CREATE POLICY "Clients see only client_visible comments" ON cybershield_incident_comments
  FOR SELECT USING (
    (auth_user_portal_type() = 'client' AND visibility = 'client_visible' AND EXISTS (
      SELECT 1 FROM cybershield_incidents i
      WHERE i.id = incident_id AND i.organization_id = auth_user_organization_id()
    ))
    OR auth_user_portal_type() IN ('security', 'admin')
  );

CREATE POLICY "Users can insert comments according to permissions" ON cybershield_incident_comments
  FOR INSERT WITH CHECK (
    (auth_user_portal_type() = 'client' AND visibility = 'client_visible')
    OR auth_user_portal_type() IN ('security', 'admin')
  );

-- 13.4 TIMELINE POLICIES (Client users cannot see internal investigation events)
CREATE POLICY "Clients see non-internal timeline events" ON cybershield_incident_timeline
  FOR SELECT USING (
    (auth_user_portal_type() = 'client' AND is_internal = false AND EXISTS (
      SELECT 1 FROM cybershield_incidents i
      WHERE i.id = incident_id AND i.organization_id = auth_user_organization_id()
    ))
    OR auth_user_portal_type() IN ('security', 'admin')
  );

-- 13.5 AUDIT LOGS POLICIES (Read-only for security/admin; append-only for everyone)
CREATE POLICY "Security/Admin can view audit logs" ON cybershield_audit_logs
  FOR SELECT USING (auth_user_portal_type() IN ('security', 'admin'));

CREATE POLICY "System can record audit logs" ON cybershield_audit_logs
  FOR INSERT WITH CHECK (true);

-- 13.6 NOTIFICATIONS POLICIES
CREATE POLICY "Users see own notifications" ON cybershield_notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON cybershield_notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- ============================================================================
-- 14. SEED DATA (Organizations, Profiles, Incidents, IOCs, Checklist)
-- ============================================================================

INSERT INTO organizations (id, name, slug, tier, domain, contact_email) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Acme Corporation', 'acme-corp', 'Enterprise', 'acme.com', 'security@acme.com'),
  ('22222222-2222-2222-2222-222222222222', 'Apex Financial Group', 'apex-financial', 'Enterprise Plus', 'apexfin.com', 'soc@apexfin.com'),
  ('33333333-3333-3333-3333-333333333333', 'Nova Health Systems', 'nova-health', 'Healthcare Dedicated', 'novahealth.org', 'compliance@novahealth.org'),
  ('99999999-9999-9999-9999-999999999999', 'CyberShield SOC Defense', 'cybershield-soc', 'Internal Defense', 'cybershield.soc', 'soc-team@cybershield.soc')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO profiles (id, full_name, email, organization_id, department, role, portal_type, clearance_level) VALUES
  ('a1111111-0000-0000-0000-000000000001', 'Morgan Lee', 'morgan.lee@acme.com', '11111111-1111-1111-1111-111111111111', 'Finance', 'client_user', 'client', 'L1'),
  ('a1111111-0000-0000-0000-000000000002', 'Sarah Jenkins', 'sarah.jenkins@acme.com', '11111111-1111-1111-1111-111111111111', 'IT Operations', 'client_manager', 'client', 'L2'),
  ('b2222222-0000-0000-0000-000000000001', 'Alex Rivera', 'alex.rivera@cybershield.soc', '99999999-9999-9999-9999-999999999999', 'SOC Operations', 'soc_analyst', 'security', 'L3'),
  ('b2222222-0000-0000-0000-000000000002', 'Marcus Vance', 'marcus.vance@cybershield.soc', '99999999-9999-9999-9999-999999999999', 'Incident Response', 'security_manager', 'security', 'L4'),
  ('b2222222-0000-0000-0000-000000000003', 'Elena Rostova', 'elena.rostova@cybershield.soc', '99999999-9999-9999-9999-999999999999', 'SecOps Administration', 'soc_admin', 'security', 'L5')
ON CONFLICT (email) DO NOTHING;
