# 🛡️ CyberShield — Incident Reporting & Response SOC Platform

**Report. Categorize. Track. Respond. Resolve. Stay Secure.**

CyberShield is an enterprise cybersecurity incident management and Security Operations Center (SOC) platform with **two distinct portal experiences** powered by the same backend and Supabase PostgreSQL database:

1. **Client Portal** (`/dashboard`, `/incidents`, `/incidents/new`, `/reports`, `/profile`)
2. **Security Team Portal (SOC)** (`/security/dashboard`, `/security/incidents`, `/security/investigations`, `/security/threat-intelligence`, `/security/iocs`, `/security/sla`, `/security/analytics`, `/security/admin/*`)

---

## Architecture Overview

```text
                    CYBERSHIELD
                         |
          +--------------+--------------+
          |                             |
          ↓                             ↓
   CLIENT PORTAL                  SECURITY PORTAL (SOC)
          |                             |
   Employees                     SOC Analysts
   Client Managers               Security Managers
   Customer Organizations        SOC Administrators
          |                             |
          +--------------+--------------+
                         |
                         ↓
                    SUPABASE / API
                         |
        +----------------+----------------+
        |                |                |
       AUTH           DATABASE          STORAGE
        |                |                |
     Profiles         Incidents         Evidence
                      Comments (RLS)    Files
                      IOCs              Audit Logs
                      Notifications
```

---

## 1. Client Portal
Designed for organizations that are customers of CyberShield.
- **Audience**: Employees (`client_user`), Client Managers (`client_manager`).
- **Features**:
  - Secure login & self-registration
  - Multi-step incident reporting wizard (`/incidents/new`)
  - Incident progress tracking with lifecycle milestones
  - Evidence upload and metadata verification
  - Direct communication channel with SOC analysts
  - Organization posture and compliance reports (`/reports`)
  - Notifications & profile management
- **Privacy Enforcement**: Client users **never** see internal cybersecurity investigation information (internal notes, analyst findings, containment playbooks, attribution telemetry).

---

## 2. Security Team Portal (SOC)
Operational Security Operations Center console designed for defense analysts and incident responders.
- **Route**: `/security/dashboard`
- **Roles**:
  - `soc_analyst`: Level 2/3 triage, IOC correlation, containment checklists, forensic evidence.
  - `security_manager`: Analyst assignment, SLA overrides, escalation command, closure approvals.
  - `soc_admin`: Full tenant management, RBAC, system settings, immutable audit trail.
- **Dedicated Enterprise SOC Login**: `/security/login` (Dark navy aesthetic with telemetry monitors and MFA verification).
- **Core Modules**:
  - **SOC Dashboard**: Real-time database metrics (`OPEN INCIDENTS`, `CRITICAL`, `HIGH`, `UNDER INVESTIGATION`), live telemetry ticker.
  - **Incident Queue** (`/security/incidents`): Filterable by Severity, Status, Category, Organization, Assigned Analyst, SLA, and Risk Score.
  - **Investigation Workspace** (`/security/incidents/:id`):
    - 10-Stage Lifecycle Workflow: `New -> Triage -> Severity Assessment -> Risk Assessment -> Assignment -> Investigation -> Containment -> Eradication -> Recovery -> Resolution -> Closure`.
    - Impact assessment (Business, Data, Availability).
    - Technical Information & IOC tracking.
    - Response Checklist with live phase tracking.
    - Dual Communication Tabs: Client Visible vs Confidential Internal SOC Notes.
    - Defensive Playbook Actions (Host isolation, token revocation, escalation).
  - **SLA Monitoring Radar** (`/security/sla`): Enforces Critical (15m), High (1h), Medium (4h), Low (24h) thresholds with live countdowns and breach alerts.
  - **Security Analytics** (`/security/analytics`): Trend lines, category breakdowns, severity stratification, MTTD/MTTR benchmarks.
  - **Threat Intelligence & IOCs** (`/security/threat-intelligence`, `/security/iocs`): Defensive registry for IPs, Domains, URLs, Hashes, Emails, Accounts.
  - **Administration & Audit Trail** (`/security/admin/*`): User directory, tenant orgs, RBAC matrix, and tamper-evident audit logs.

---

## 3. Database & Supabase Row Level Security (RLS)

A complete Supabase PostgreSQL migration is located at:
`supabase/migrations/20261007_cybershield_dual_portal.sql`

Includes:
- Enums: `user_portal_type`, `user_role_type`, `incident_severity_type`, `incident_status_type`, `comment_visibility_type`, `ioc_type_enum`
- Tables: `organizations`, `profiles`, `cybershield_incidents`, `cybershield_incident_comments`, `cybershield_incident_timeline`, `cybershield_incident_evidence`, `cybershield_incident_iocs`, `cybershield_incident_checklist`, `cybershield_audit_logs`, `cybershield_notifications`
- RLS Policies:
  - Tenant organization isolation for client users.
  - Redaction of `visibility = 'internal_security'` comments from client queries.
  - Elevated operational access for security roles.
  - Append-only immutable audit logging.
- Seed data for instant deployment in Supabase SQL editor.

---

## 4. Quick Testing Accounts

| Name | Portal | Role | Organization | Email |
| :--- | :--- | :--- | :--- | :--- |
| **Morgan Lee** | Client | Employee | Acme Corp | `morgan.lee@acme.com` |
| **Sarah Jenkins** | Client | IT Manager | Acme Corp | `sarah.jenkins@acme.com` |
| **Alex Rivera** | Security | SOC Analyst | CyberShield SOC | `alex.rivera@cybershield.soc` |
| **Marcus Vance** | Security | Security Manager | CyberShield SOC | `marcus.vance@cybershield.soc` |
| **Elena Rostova** | Security | SOC Admin | CyberShield SOC | `elena.rostova@cybershield.soc` |

Both `/login` and `/security/login` feature one-click operator presets and live user-switching in the UI for effortless testing.
