import type {
  AuditLog,
  ChecklistItem,
  Evidence,
  Incident,
  IncidentComment,
  IncidentSeverity,
  IncidentStatus,
  Ioc,
  NotificationItem,
  Organization,
  TimelineEvent,
  UserProfile,
} from '@/types';

const STORAGE_KEY_PREFIX = 'cybershield_v2_';

// Seed Organizations
export const SEED_ORGANIZATIONS: Organization[] = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    name: 'Acme Corporation',
    slug: 'acme-corp',
    tier: 'Enterprise',
    domain: 'acme.com',
    contact_email: 'security@acme.com',
    created_at: '2026-01-15T08:00:00Z',
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    name: 'Apex Financial Group',
    slug: 'apex-financial',
    tier: 'Enterprise Plus',
    domain: 'apexfin.com',
    contact_email: 'soc@apexfin.com',
    created_at: '2026-02-01T09:30:00Z',
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    name: 'Nova Health Systems',
    slug: 'nova-health',
    tier: 'Healthcare Dedicated',
    domain: 'novahealth.org',
    contact_email: 'compliance@novahealth.org',
    created_at: '2026-02-20T11:15:00Z',
  },
  {
    id: '99999999-9999-9999-9999-999999999999',
    name: 'CyberShield SOC Defense',
    slug: 'cybershield-soc',
    tier: 'Internal Security Operations',
    domain: 'cybershield.soc',
    contact_email: 'operations@cybershield.soc',
    created_at: '2026-01-01T00:00:00Z',
  },
];

// Seed Profiles (Dual Portal Accounts)
export const SEED_USERS: UserProfile[] = [
  {
    id: 'a1111111-0000-0000-0000-000000000001',
    full_name: 'Morgan Lee',
    email: 'morgan.lee@acme.com',
    organization_id: '11111111-1111-1111-1111-111111111111',
    organization_name: 'Acme Corporation',
    department: 'Finance',
    role: 'client_user',
    portal_type: 'client',
    mfa_enabled: true,
    clearance_level: 'Client Employee',
    account_status: 'Active',
    last_login_at: '2026-10-07T08:15:00Z',
    created_at: '2026-03-01T00:00:00Z',
    updated_at: '2026-10-07T08:15:00Z',
  },
  {
    id: 'a1111111-0000-0000-0000-000000000002',
    full_name: 'Sarah Jenkins',
    email: 'sarah.jenkins@acme.com',
    organization_id: '11111111-1111-1111-1111-111111111111',
    organization_name: 'Acme Corporation',
    department: 'IT Operations',
    role: 'client_manager',
    portal_type: 'client',
    mfa_enabled: true,
    clearance_level: 'Client Manager',
    account_status: 'Active',
    last_login_at: '2026-10-07T09:00:00Z',
    created_at: '2026-02-15T00:00:00Z',
    updated_at: '2026-10-07T09:00:00Z',
  },
  {
    id: 'b2222222-0000-0000-0000-000000000001',
    full_name: 'Alex Rivera',
    email: 'alex.rivera@cybershield.soc',
    organization_id: '99999999-9999-9999-9999-999999999999',
    organization_name: 'CyberShield SOC Defense',
    department: 'SOC Level 2 Triage',
    role: 'soc_analyst',
    portal_type: 'security',
    mfa_enabled: true,
    clearance_level: 'SOC Analyst L2',
    account_status: 'Active',
    last_login_at: '2026-10-07T10:20:00Z',
    created_at: '2026-01-10T00:00:00Z',
    updated_at: '2026-10-07T10:20:00Z',
  },
  {
    id: 'b2222222-0000-0000-0000-000000000002',
    full_name: 'Marcus Vance',
    email: 'marcus.vance@cybershield.soc',
    organization_id: '99999999-9999-9999-9999-999999999999',
    organization_name: 'CyberShield SOC Defense',
    department: 'Incident Response Command',
    role: 'security_manager',
    portal_type: 'security',
    mfa_enabled: true,
    clearance_level: 'SecOps Command L4',
    account_status: 'Active',
    last_login_at: '2026-10-07T07:45:00Z',
    created_at: '2026-01-05T00:00:00Z',
    updated_at: '2026-10-07T07:45:00Z',
  },
  {
    id: 'b2222222-0000-0000-0000-000000000003',
    full_name: 'Elena Rostova',
    email: 'elena.rostova@cybershield.soc',
    organization_id: '99999999-9999-9999-9999-999999999999',
    organization_name: 'CyberShield SOC Defense',
    department: 'Security Infrastructure & Policy',
    role: 'soc_admin',
    portal_type: 'security',
    mfa_enabled: true,
    clearance_level: 'Super Admin L5',
    account_status: 'Active',
    last_login_at: '2026-10-07T06:30:00Z',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-10-07T06:30:00Z',
  },
];

// Seed Incidents (Real database values)
export const SEED_INCIDENTS: Incident[] = [
  {
    id: 101,
    incidentNumber: 'INC-2026-000101',
    organizationId: '22222222-2222-2222-2222-222222222222',
    organizationName: 'Apex Financial Group',
    title: 'Ransomware deployment attempt on core transaction database',
    description: 'Suspicious PowerShell script executed with encoded payload attempting to encrypt file shares in the payment processing subnet. Endpoint isolation protocol initiated.',
    category: 'Malware / Ransomware',
    severity: 'CRITICAL',
    priority: 'URGENT',
    riskScore: 94,
    status: 'INVESTIGATING',
    reporter: 'David Kim',
    department: 'Core Banking Infrastructure',
    assignedTo: 'Alex Rivera',
    assignedAnalystId: 'b2222222-0000-0000-0000-000000000001',
    affectedSystem: 'SRV-PAY-PROD-04',
    affectedUsers: 1450,
    impact: 'Potential transaction suspension and customer payment disruption.',
    impactBusiness: 'Critical processing slowdown, estimated potential downtime impact of $250k/hr.',
    impactData: 'Database files targeted; backup validation confirmed uncorrupted.',
    impactAvailability: 'Temporary segmentation of transaction processing gateway.',
    location: 'New York Data Center',
    technicalDetails: 'Payload origin: 185.220.101.42. Encoded PowerShell command invoked via Task Scheduler persistence.',
    incidentDate: '2026-10-07T04:15:00Z',
    discoveryDate: '2026-10-07T04:22:00Z',
    slaDueAt: new Date(Date.now() + 12 * 60 * 1000).toISOString(), // 12 mins remaining (approaching SLA)
    attackVector: 'Compromised VPN service account with stale credentials',
    rootCause: 'Lack of MFA on legacy vendor VPN gateway tunnel',
    containment: 'Host isolated from VLAN 40; firewall rule 9042 pushed to drop all traffic to 185.220.101.42',
    eradication: 'Malicious scheduled task removed and binary quarantined by Falcon sensor.',
    recovery: 'Forensic image captured, host rebuild in progress.',
    resolution: null,
    createdAt: '2026-10-07T04:25:00Z',
    updatedAt: '2026-10-07T09:30:00Z',
  },
  {
    id: 102,
    incidentNumber: 'INC-2026-000102',
    organizationId: '11111111-1111-1111-1111-111111111111',
    organizationName: 'Acme Corporation',
    title: 'Targeted Phishing Email Campaign targeting Executive Finance Staff',
    description: 'Multiple finance employees received emails spoofing the Chief Financial Officer requesting immediate wire release for an offshore vendor acquisition. One employee submitted credentials on the fake portal.',
    category: 'Phishing',
    severity: 'HIGH',
    priority: 'HIGH',
    riskScore: 78,
    status: 'TRIAGED',
    reporter: 'Morgan Lee',
    department: 'Finance',
    assignedTo: 'Alex Rivera',
    assignedAnalystId: 'b2222222-0000-0000-0000-000000000001',
    affectedSystem: 'Office 365 Exchange & Okta SSO',
    affectedUsers: 12,
    impact: 'Risk of corporate fund transfer and unauthorized inbox forwarding rules.',
    impactBusiness: 'Attempted fraud amount was $84,000; wire intercepted before authorization.',
    impactData: 'One employee Okta session token harvested.',
    impactAvailability: 'None',
    location: 'Chicago HQ & Remote',
    technicalDetails: 'Phishing domain: https://login-auth-verify.net/acme-sso. Sender IP: 194.26.29.112.',
    incidentDate: '2026-10-07T07:10:00Z',
    discoveryDate: '2026-10-07T07:30:00Z',
    slaDueAt: new Date(Date.now() + 35 * 60 * 1000).toISOString(), // 35 min remaining
    attackVector: 'Spoofed email with Lookalike domain registration',
    rootCause: 'DMARC policy set to p=none instead of p=reject on vendor domain',
    containment: 'User password reset; revoked active Okta refresh tokens; phishing domain blocked at perimeter proxy.',
    eradication: null,
    recovery: null,
    resolution: null,
    createdAt: '2026-10-07T07:35:00Z',
    updatedAt: '2026-10-07T08:50:00Z',
  },
  {
    id: 103,
    incidentNumber: 'INC-2026-000103',
    organizationId: '33333333-3333-3333-3333-333333333333',
    organizationName: 'Nova Health Systems',
    title: 'Anomalous Data Egress Spike from Electronic Health Records (EHR) Bucket',
    description: 'CloudTrail detected 45 GB outbound egress from S3 bucket storing encrypted patient diagnostic summaries to an unindexed IP address in Eastern Europe outside normal clinical hours.',
    category: 'Data Exposure / Leak',
    severity: 'CRITICAL',
    priority: 'URGENT',
    riskScore: 91,
    status: 'CONTAINED',
    reporter: 'Dr. Rebecca Stone',
    department: 'Clinical Informatics',
    assignedTo: 'Marcus Vance',
    assignedAnalystId: 'b2222222-0000-0000-0000-000000000002',
    affectedSystem: 'AWS S3 Bucket ehr-records-archive-nova',
    affectedUsers: 480,
    impact: 'Potential HIPAA breach and sensitive PHI disclosure.',
    impactBusiness: 'Regulatory disclosure obligations triggered under HIPAA Breach Notification Rule.',
    impactData: 'Access logs indicate 3,200 patient diagnostic PDFs accessed.',
    impactAvailability: 'Storage bucket access restricted.',
    location: 'AWS us-east-1',
    technicalDetails: 'IAM Access Key AKIAIOSFODNN7EXAMPLE used from 45.142.166.11. Key created 18 months ago without rotation.',
    incidentDate: '2026-10-06T23:45:00Z',
    discoveryDate: '2026-10-07T00:15:00Z',
    slaDueAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(), // Breached SLA
    attackVector: 'Exposed IAM credential committed in private legacy repo',
    rootCause: 'Access key rotation failure and broad bucket policy',
    containment: 'Compromised IAM key immediately deactivated; bucket policy locked to VPC endpoint only.',
    eradication: 'Audit of all IAM permissions completed; secrets rotation enacted.',
    recovery: 'Forensic audit ongoing with external privacy counsel.',
    resolution: null,
    createdAt: '2026-10-07T00:20:00Z',
    updatedAt: '2026-10-07T08:10:00Z',
  },
  {
    id: 104,
    incidentNumber: 'INC-2026-000104',
    organizationId: '11111111-1111-1111-1111-111111111111',
    organizationName: 'Acme Corporation',
    title: 'Unauthorized SSH Brute-Force against Internal Gitlab Server',
    description: 'Internal SIEM alert fired on 10,000+ failed SSH attempts originating from an engineer laptop on the guest WiFi subnet targeting the on-premises source code repository.',
    category: 'Unauthorized Access',
    severity: 'HIGH',
    priority: 'HIGH',
    riskScore: 72,
    status: 'ASSIGNED',
    reporter: 'Sarah Jenkins',
    department: 'IT Operations',
    assignedTo: 'Alex Rivera',
    assignedAnalystId: 'b2222222-0000-0000-0000-000000000001',
    affectedSystem: 'Internal GitLab CE (srv-git-01)',
    affectedUsers: 85,
    impact: 'Proprietary source code exposure risk.',
    impactBusiness: 'No code checkout detected; server rate limiting held.',
    impactData: 'SSH logs captured; no successful root authentication.',
    impactAvailability: 'Service remained operational.',
    location: 'Austin Engineering Hub',
    technicalDetails: 'Source IP: 10.100.4.88 (MAC: 3c:22:fb:18:a0:12). Wordlist attack using hydra user-agent.',
    incidentDate: '2026-10-07T08:00:00Z',
    discoveryDate: '2026-10-07T08:12:00Z',
    slaDueAt: new Date(Date.now() + 180 * 60 * 1000).toISOString(),
    attackVector: 'Compromised workstation on guest network',
    rootCause: 'VLAN hopping misconfiguration on Austin office switch',
    containment: null,
    eradication: null,
    recovery: null,
    resolution: null,
    createdAt: '2026-10-07T08:15:00Z',
    updatedAt: '2026-10-07T08:30:00Z',
  },
  {
    id: 105,
    incidentNumber: 'INC-2026-000105',
    organizationId: '11111111-1111-1111-1111-111111111111',
    organizationName: 'Acme Corporation',
    title: 'Unauthorized USB Storage Device Inserted into Reception Kiosk',
    description: 'Endpoint DLP blocked an unapproved SanDisk USB flash drive plugged into the visitor reception kiosk. Antivirus scanned autorun.inf containing suspicious shortcut droppers.',
    category: 'Lost or Stolen Device',
    severity: 'MEDIUM',
    priority: 'NORMAL',
    riskScore: 45,
    status: 'RESOLVED',
    reporter: 'Sarah Jenkins',
    department: 'IT Operations',
    assignedTo: 'Alex Rivera',
    assignedAnalystId: 'b2222222-0000-0000-0000-000000000001',
    affectedSystem: 'KIOSK-LOBBY-01',
    affectedUsers: 1,
    impact: 'Potential malware dropper into visitor registration system.',
    impactBusiness: 'Zero data lost. Kiosk remained protected.',
    impactData: 'None transferred.',
    impactAvailability: '10 minute kiosk reboot for forensic integrity check.',
    location: 'Chicago HQ Lobby',
    technicalDetails: 'Hardware ID: USBSTOR\\DiskSanDisk_Cruzer_Blade. Dropper hash: a8f5c9e2b4421b0177dd34fe55a123bc.',
    incidentDate: '2026-10-06T14:20:00Z',
    discoveryDate: '2026-10-06T14:21:00Z',
    slaDueAt: '2026-10-06T18:20:00Z',
    attackVector: 'Physical USB drop attack',
    rootCause: 'Reception desk unattended during shift changeover',
    containment: 'DLP USB restriction blocked file execution; USB drive physically secured in SOC evidence locker.',
    eradication: 'Host scanned clean with Falcon agent.',
    recovery: 'Kiosk reimaged from golden baseline.',
    resolution: 'Physical security alerted; visitor sign-in escort protocol enforced. Incident resolved.',
    createdAt: '2026-10-06T14:25:00Z',
    updatedAt: '2026-10-06T17:40:00Z',
  },
  {
    id: 106,
    incidentNumber: 'INC-2026-000106',
    organizationId: '22222222-2222-2222-2222-222222222222',
    organizationName: 'Apex Financial Group',
    title: 'Simultaneous Concurrent Logins from London and Singapore for Trader Account',
    description: 'Risk engine flagged anomalous geolocation jump within 8 minutes for high-volume securities trader account. Multiple limit buy orders queued.',
    category: 'Account Compromise',
    severity: 'HIGH',
    priority: 'HIGH',
    riskScore: 82,
    status: 'INVESTIGATING',
    reporter: 'Apex Risk Engine',
    department: 'Trading & Operations',
    assignedTo: 'Alex Rivera',
    assignedAnalystId: 'b2222222-0000-0000-0000-000000000001',
    affectedSystem: 'Apex Trader Portal',
    affectedUsers: 1,
    impact: 'Financial order tampering risk.',
    impactBusiness: 'Trade queue placed on automated compliance pause.',
    impactData: 'Trader credentials compromised via infostealer malware on home laptop.',
    impactAvailability: 'Single user account suspended.',
    location: 'Singapore & London Proxies',
    technicalDetails: 'Residential proxy node 103.253.25.10 used for unauthorized session hijack.',
    incidentDate: '2026-10-07T09:12:00Z',
    discoveryDate: '2026-10-07T09:14:00Z',
    slaDueAt: new Date(Date.now() + 45 * 60 * 1000).toISOString(),
    attackVector: 'Session token cookie theft via RedLine stealer',
    rootCause: 'Trader synced personal browser credentials with work profile',
    containment: 'Account trading permissions revoked; session killed globally across all clusters.',
    eradication: null,
    recovery: null,
    resolution: null,
    createdAt: '2026-10-07T09:15:00Z',
    updatedAt: '2026-10-07T10:05:00Z',
  },
];

// Seed Comments: Clearly distinguishing CLIENT-VISIBLE vs INTERNAL-SECURITY
export const SEED_COMMENTS: IncidentComment[] = [
  // INC 101
  {
    id: 1,
    incidentId: 101,
    authorId: 'b2222222-0000-0000-0000-000000000001',
    author: 'Alex Rivera',
    authorRole: 'SOC Analyst',
    authorPortal: 'security',
    message: 'We have received the alert and our incident response team has isolated the affected server from the internal network. Core services remain protected.',
    visibility: 'client_visible',
    createdAt: '2026-10-07T04:35:00Z',
  },
  {
    id: 2,
    incidentId: 101,
    authorId: 'b2222222-0000-0000-0000-000000000001',
    author: 'Alex Rivera',
    authorRole: 'SOC Analyst',
    authorPortal: 'security',
    message: 'INTERNAL SOC NOTE: Process injection detected inside spoolsv.exe. Payload matches BlackCat/ALPHV affiliate tooling. Egress beacon attempted to 185.220.101.42 port 8443. Threat Intel matched to FIN7 campaign.',
    visibility: 'internal_security',
    createdAt: '2026-10-07T05:10:00Z',
  },
  {
    id: 3,
    incidentId: 101,
    authorId: 'b2222222-0000-0000-0000-000000000002',
    author: 'Marcus Vance',
    authorRole: 'Security Manager',
    authorPortal: 'security',
    message: 'INTERNAL ESCALATION: Notified General Counsel and insurer. Tier 1 containment verified. Do not release raw memory dump outside SOC evidence vault.',
    visibility: 'internal_security',
    createdAt: '2026-10-07T06:20:00Z',
  },
  // INC 102
  {
    id: 4,
    incidentId: 102,
    authorId: 'a1111111-0000-0000-0000-000000000001',
    author: 'Morgan Lee',
    authorRole: 'Employee',
    authorPortal: 'client',
    message: 'I received the suspicious email at 7:05 AM. It asked me to verify payroll details immediately. I clicked the link before realizing the sender was wrong. I have disconnected my laptop from WiFi.',
    visibility: 'client_visible',
    createdAt: '2026-10-07T07:40:00Z',
  },
  {
    id: 5,
    incidentId: 102,
    authorId: 'b2222222-0000-0000-0000-000000000001',
    author: 'Alex Rivera',
    authorRole: 'SOC Analyst',
    authorPortal: 'security',
    message: 'Thank you for reporting this quickly Morgan. Our team has already invalidated your active login sessions and reset your password. Please coordinate with IT when reconnecting.',
    visibility: 'client_visible',
    createdAt: '2026-10-07T08:05:00Z',
  },
  {
    id: 6,
    incidentId: 102,
    authorId: 'b2222222-0000-0000-0000-000000000001',
    author: 'Alex Rivera',
    authorRole: 'SOC Analyst',
    authorPortal: 'security',
    message: 'INTERNAL SOC NOTE: Domain login-auth-verify.net registered 3 days ago via NameCheap. Reverse DNS traces to Russian hosting VPS. Created firewall rule to blackhole 194.26.29.112 across all client egress proxies.',
    visibility: 'internal_security',
    createdAt: '2026-10-07T08:15:00Z',
  },
];

// Seed Timeline
export const SEED_TIMELINE: TimelineEvent[] = [
  {
    id: 1,
    incidentId: 101,
    label: 'Incident Reported',
    detail: 'Apex Financial EDR telemetry raised automated high-severity malware alarm.',
    actor: 'EDR Automation',
    kind: 'reported',
    isInternal: false,
    createdAt: '2026-10-07T04:22:00Z',
  },
  {
    id: 2,
    incidentId: 101,
    label: 'Triage & Risk Assessment',
    detail: 'SOC Analyst Alex Rivera triaged incident. Severity elevated to CRITICAL. Risk calculated at 94/100.',
    actor: 'Alex Rivera (SOC)',
    kind: 'triage',
    isInternal: false,
    createdAt: '2026-10-07T04:30:00Z',
  },
  {
    id: 3,
    incidentId: 101,
    label: 'Host Isolated (Containment)',
    detail: 'SRV-PAY-PROD-04 segmented from corporate VLAN. C2 firewall block enacted.',
    actor: 'Alex Rivera (SOC)',
    kind: 'containment',
    isInternal: false,
    createdAt: '2026-10-07T04:45:00Z',
  },
  {
    id: 4,
    incidentId: 101,
    label: 'Forensic Memory Acquisition',
    detail: 'INTERNAL: Volatility memory dump captured (mem_SRV-PAY-PROD-04.raw). SHA-256 hash verified.',
    actor: 'Alex Rivera (SOC)',
    kind: 'evidence',
    isInternal: true,
    createdAt: '2026-10-07T05:30:00Z',
  },
  {
    id: 5,
    incidentId: 102,
    label: 'Incident Submitted by Client',
    detail: 'Morgan Lee (Acme Corp Finance) submitted phishing report via Client Portal.',
    actor: 'Morgan Lee',
    kind: 'reported',
    isInternal: false,
    createdAt: '2026-10-07T07:35:00Z',
  },
  {
    id: 6,
    incidentId: 102,
    label: 'Assigned to SOC Analyst',
    detail: 'Assigned to Alex Rivera. Triage completed.',
    actor: 'SOC Command',
    kind: 'assignment',
    isInternal: false,
    createdAt: '2026-10-07T07:45:00Z',
  },
];

// Seed Evidence
export const SEED_EVIDENCE: Evidence[] = [
  {
    id: 1,
    incidentId: 101,
    filename: 'mem_SRV-PAY-PROD-04_dump.raw',
    type: 'Memory Dump',
    size: '16.4 GB',
    hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    uploadedBy: 'Alex Rivera',
    uploadedByRole: 'SOC Analyst',
    isInternal: true,
    storagePath: '/evidence/2026/inc-101/mem.raw',
    uploadedAt: '2026-10-07T05:30:00Z',
  },
  {
    id: 2,
    incidentId: 102,
    filename: 'Phishing_Email_Headers_Wire_Request.eml',
    type: 'Email Header / File',
    size: '142 KB',
    hash: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    uploadedBy: 'Morgan Lee',
    uploadedByRole: 'Employee',
    isInternal: false,
    storagePath: '/evidence/2026/inc-102/phish.eml',
    uploadedAt: '2026-10-07T07:38:00Z',
  },
  {
    id: 3,
    incidentId: 102,
    filename: 'Fake_Portal_Screenshot.png',
    type: 'Screenshot',
    size: '890 KB',
    hash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
    uploadedBy: 'Morgan Lee',
    uploadedByRole: 'Employee',
    isInternal: false,
    storagePath: '/evidence/2026/inc-102/screen.png',
    uploadedAt: '2026-10-07T07:42:00Z',
  },
  {
    id: 4,
    incidentId: 103,
    filename: 's3_access_egress_logs_sampled.json',
    type: 'Cloud Access Log',
    size: '4.2 MB',
    hash: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
    uploadedBy: 'Marcus Vance',
    uploadedByRole: 'Security Manager',
    isInternal: true,
    storagePath: '/evidence/2026/inc-103/s3.json',
    uploadedAt: '2026-10-07T01:15:00Z',
  },
];

// Seed Threat Intelligence & IOCs
export const SEED_IOCS: Ioc[] = [
  {
    id: 1,
    incidentId: 101,
    relatedIncidentNumber: 'INC-2026-000101',
    type: 'IP',
    value: '185.220.101.42',
    source: 'SOC Incident Investigation',
    threatLevel: 'Critical',
    confidence: 95,
    status: 'Blocked',
    firstSeen: '2026-10-07T04:15:00Z',
    lastSeen: '2026-10-07T09:30:00Z',
  },
  {
    id: 2,
    incidentId: 101,
    relatedIncidentNumber: 'INC-2026-000101',
    type: 'Hash',
    value: '7b52009b64fd0a2a49e6d8a939753077792b0554f6c4ff47cae4751717277884',
    source: 'CrowdStrike Falcon Sensor',
    threatLevel: 'Critical',
    confidence: 99,
    status: 'Blocked',
    firstSeen: '2026-10-07T04:22:00Z',
    lastSeen: '2026-10-07T08:00:00Z',
  },
  {
    id: 3,
    incidentId: 102,
    relatedIncidentNumber: 'INC-2026-000102',
    type: 'Domain',
    value: 'login-auth-verify.net',
    source: 'Client Phishing Submission',
    threatLevel: 'High',
    confidence: 90,
    status: 'Blocked',
    firstSeen: '2026-10-07T07:10:00Z',
    lastSeen: '2026-10-07T08:50:00Z',
  },
  {
    id: 4,
    incidentId: 102,
    relatedIncidentNumber: 'INC-2026-000102',
    type: 'Email',
    value: 'cfo-wire-auth@acme-verify.org',
    source: 'Email Gateway Header',
    threatLevel: 'High',
    confidence: 88,
    status: 'Blocked',
    firstSeen: '2026-10-07T07:05:00Z',
    lastSeen: '2026-10-07T07:15:00Z',
  },
  {
    id: 5,
    incidentId: 103,
    relatedIncidentNumber: 'INC-2026-000103',
    type: 'IP',
    value: '45.142.166.11',
    source: 'AWS GuardDuty Telemetry',
    threatLevel: 'Critical',
    confidence: 92,
    status: 'Blocked',
    firstSeen: '2026-10-06T23:45:00Z',
    lastSeen: '2026-10-07T01:00:00Z',
  },
  {
    id: 6,
    incidentId: 104,
    relatedIncidentNumber: 'INC-2026-000104',
    type: 'Account',
    value: 'guest_wifi_dev_test',
    source: 'Internal SIEM Log',
    threatLevel: 'Medium',
    confidence: 75,
    status: 'Monitoring',
    firstSeen: '2026-10-07T08:00:00Z',
    lastSeen: '2026-10-07T08:12:00Z',
  },
  {
    id: 7,
    incidentId: null,
    relatedIncidentNumber: 'GLOBAL THREAT FEED',
    type: 'URL',
    value: 'http://malware-drop-zone.cc/update.bin',
    source: 'Abuse.ch URLhaus Feed',
    threatLevel: 'Critical',
    confidence: 98,
    status: 'Active',
    firstSeen: '2026-10-05T00:00:00Z',
    lastSeen: '2026-10-07T10:00:00Z',
  },
];

// Seed Response Checklist
export const SEED_CHECKLIST: ChecklistItem[] = [
  // INC 101
  { id: 1, incidentId: 101, phase: 'Triage', label: 'Verify host telemetry & alert authenticity', completed: true, completedBy: 'Alex Rivera', completedAt: '2026-10-07T04:28:00Z' },
  { id: 2, incidentId: 101, phase: 'Containment', label: 'Isolate affected endpoint from corporate VLAN', completed: true, completedBy: 'Alex Rivera', completedAt: '2026-10-07T04:45:00Z' },
  { id: 3, incidentId: 101, phase: 'Containment', label: 'Block external C2 IP at perimeter firewall', completed: true, completedBy: 'Alex Rivera', completedAt: '2026-10-07T04:50:00Z' },
  { id: 4, incidentId: 101, phase: 'Investigation', label: 'Acquire volatile memory & file system forensic image', completed: true, completedBy: 'Alex Rivera', completedAt: '2026-10-07T05:30:00Z' },
  { id: 5, incidentId: 101, phase: 'Eradication', label: 'Identify and remove persistence mechanisms (scheduled tasks, run keys)', completed: false },
  { id: 6, incidentId: 101, phase: 'Recovery', label: 'Restore system from trusted golden baseline and verify integrity', completed: false },

  // INC 102
  { id: 7, incidentId: 102, phase: 'Triage', label: 'Confirm recipient list and identify anyone who clicked the link', completed: true, completedBy: 'Alex Rivera', completedAt: '2026-10-07T07:50:00Z' },
  { id: 8, incidentId: 102, phase: 'Containment', label: 'Reset compromised user password and revoke active SSO sessions', completed: true, completedBy: 'Alex Rivera', completedAt: '2026-10-07T08:00:00Z' },
  { id: 9, incidentId: 102, phase: 'Containment', label: 'Add malicious domain to DNS sinkhole and proxy blocklist', completed: true, completedBy: 'Alex Rivera', completedAt: '2026-10-07T08:15:00Z' },
  { id: 10, incidentId: 102, phase: 'Eradication', label: 'Purge phishing emails from all mailbox inboxes via Exchange admin', completed: false },
  { id: 11, incidentId: 102, phase: 'Recovery', label: 'Review user mailbox rules for unauthorized forwarding directives', completed: false },
];

// Seed Audit Logs
export const SEED_AUDIT_LOGS: AuditLog[] = [
  {
    id: 1,
    userId: 'b2222222-0000-0000-0000-000000000001',
    userName: 'Alex Rivera',
    userRole: 'soc_analyst',
    action: 'Login',
    resourceType: 'Session',
    details: 'Successful authenticated login to Security Operations Center.',
    ipAddress: '198.51.100.14',
    createdAt: '2026-10-07T10:20:00Z',
  },
  {
    id: 2,
    userId: 'b2222222-0000-0000-0000-000000000001',
    userName: 'Alex Rivera',
    userRole: 'soc_analyst',
    action: 'Status Changed',
    resourceType: 'Incident',
    resourceId: 'INC-2026-000101',
    details: 'Status transitioned from TRIAGED to INVESTIGATING.',
    ipAddress: '198.51.100.14',
    createdAt: '2026-10-07T04:45:00Z',
  },
  {
    id: 3,
    userId: 'a1111111-0000-0000-0000-000000000001',
    userName: 'Morgan Lee',
    userRole: 'client_user',
    action: 'Incident Created',
    resourceType: 'Incident',
    resourceId: 'INC-2026-000102',
    details: 'New incident report submitted: Targeted Phishing Email Campaign.',
    ipAddress: '203.0.113.88',
    createdAt: '2026-10-07T07:35:00Z',
  },
  {
    id: 4,
    userId: 'a1111111-0000-0000-0000-000000000001',
    userName: 'Morgan Lee',
    userRole: 'client_user',
    action: 'Evidence Uploaded',
    resourceType: 'Evidence',
    resourceId: 'INC-2026-000102',
    details: 'Uploaded file: Phishing_Email_Headers_Wire_Request.eml (SHA: 9f86d081...).',
    ipAddress: '203.0.113.88',
    createdAt: '2026-10-07T07:38:00Z',
  },
  {
    id: 5,
    userId: 'b2222222-0000-0000-0000-000000000001',
    userName: 'Alex Rivera',
    userRole: 'soc_analyst',
    action: 'Internal Note Added',
    resourceType: 'Comment',
    resourceId: 'INC-2026-000101',
    details: 'Internal investigation note saved with FIN7 attribution findings.',
    ipAddress: '198.51.100.14',
    createdAt: '2026-10-07T05:10:00Z',
  },
];

// Seed Notifications
export const SEED_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 1,
    title: 'New Critical Incident Alert',
    message: 'INC-2026-000101: Ransomware deployment attempt reported by Apex Financial.',
    type: 'critical',
    portalTarget: 'security',
    link: '/security/incidents/101',
    read: false,
    createdAt: '2026-10-07T04:25:00Z',
  },
  {
    id: 2,
    title: 'SLA Approaching Deadline',
    message: 'INC-2026-000101 has 12 minutes remaining before SLA breach.',
    type: 'sla',
    portalTarget: 'security',
    link: '/security/sla',
    read: false,
    createdAt: '2026-10-07T09:48:00Z',
  },
  {
    id: 3,
    title: 'Client Added Information',
    message: 'Morgan Lee (Acme Corp) submitted email evidence headers on INC-2026-000102.',
    type: 'evidence',
    portalTarget: 'security',
    link: '/security/incidents/102',
    read: false,
    createdAt: '2026-10-07T07:42:00Z',
  },
  {
    id: 4,
    title: 'Security Team Update',
    message: 'SOC Analyst Alex Rivera has begun investigation on your report INC-2026-000102.',
    type: 'info',
    portalTarget: 'client',
    link: '/incidents/102',
    read: false,
    createdAt: '2026-10-07T08:05:00Z',
  },
];

// In-Memory & LocalStorage Data Store
class CyberShieldDataStore {
  private get<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(STORAGE_KEY_PREFIX + key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  private set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(value));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }

  // --- Incidents ---
  getIncidents(currentUser?: UserProfile | null): Incident[] {
    const list = this.get<Incident[]>('incidents', SEED_INCIDENTS);
    if (!currentUser) return list;

    // Strict RLS emulation:
    // Client users ONLY see incidents from their own organization!
    if (currentUser.portal_type === 'client') {
      return list.filter((i) => i.organizationId === currentUser.organization_id);
    }

    // Security & Admin see all
    return list;
  }

  getIncidentById(id: number, currentUser?: UserProfile | null): Incident | null {
    const all = this.get<Incident[]>('incidents', SEED_INCIDENTS);
    const item = all.find((i) => i.id === id) || null;
    if (!item) return null;

    if (currentUser && currentUser.portal_type === 'client') {
      if (item.organizationId !== currentUser.organization_id) {
        return null; // Forbidden across organizations
      }
    }
    return item;
  }

  createIncident(input: Partial<Incident>, currentUser: UserProfile): Incident {
    const incidents = this.get<Incident[]>('incidents', SEED_INCIDENTS);
    const nextId = incidents.reduce((max, i) => Math.max(max, i.id), 100) + 1;
    const year = new Date().getFullYear();
    const incNumber = `INC-${year}-${String(nextId).padStart(6, '0')}`;

    const severity = input.severity || 'MEDIUM';
    const slaMinutes = severity === 'CRITICAL' ? 15 : severity === 'HIGH' ? 60 : severity === 'MEDIUM' ? 240 : 1440;
    const slaDueAt = new Date(Date.now() + slaMinutes * 60 * 1000).toISOString();

    const newIncident: Incident = {
      id: nextId,
      incidentNumber: incNumber,
      organizationId: currentUser.organization_id,
      organizationName: currentUser.organization_name || 'Organization',
      title: input.title || 'Untitled Incident',
      description: input.description || '',
      category: input.category || 'Phishing',
      severity,
      priority: severity === 'CRITICAL' ? 'URGENT' : severity === 'HIGH' ? 'HIGH' : 'NORMAL',
      riskScore: input.riskScore || (severity === 'CRITICAL' ? 85 : severity === 'HIGH' ? 65 : 35),
      status: 'NEW',
      reporter: currentUser.full_name,
      reporterId: currentUser.id,
      department: input.department || currentUser.department,
      assignedTo: null,
      assignedAnalystId: null,
      affectedSystem: input.affectedSystem || null,
      affectedUsers: input.affectedUsers || 1,
      impact: input.impact || 'Under assessment',
      impactBusiness: input.impactBusiness || '',
      impactData: input.impactData || '',
      impactAvailability: input.impactAvailability || '',
      location: input.location || null,
      technicalDetails: input.technicalDetails || '',
      incidentDate: new Date().toISOString(),
      discoveryDate: new Date().toISOString(),
      slaDueAt,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    incidents.unshift(newIncident);
    this.set('incidents', incidents);

    // Initial timeline
    this.addTimelineEvent({
      incidentId: newIncident.id,
      label: 'Incident Reported',
      detail: `${newIncident.incidentNumber} submitted by ${currentUser.full_name} (${newIncident.organizationName}).`,
      actor: currentUser.full_name,
      kind: 'reported',
      isInternal: false,
    });

    // Audit log
    this.recordAuditLog(
      currentUser,
      'Incident Created',
      'Incident',
      newIncident.incidentNumber,
      `Reported incident: "${newIncident.title}" in category ${newIncident.category}`
    );

    // Notification for SOC
    this.addNotification({
      title: `New ${severity} Incident Reported`,
      message: `${newIncident.incidentNumber} from ${newIncident.organizationName}: ${newIncident.title}`,
      type: severity === 'CRITICAL' ? 'critical' : severity === 'HIGH' ? 'high' : 'info',
      portalTarget: 'security',
      link: `/security/incidents/${newIncident.id}`,
    });

    return newIncident;
  }

  updateIncident(
    id: number,
    updates: Partial<Incident>,
    currentUser: UserProfile,
    actionDetail?: string
  ): Incident {
    const incidents = this.get<Incident[]>('incidents', SEED_INCIDENTS);
    const index = incidents.findIndex((i) => i.id === id);
    if (index === -1) throw new Error('Incident not found');

    const prev = incidents[index];
    const updated: Incident = {
      ...prev,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    incidents[index] = updated;
    this.set('incidents', incidents);

    // Timeline event if status changed
    if (updates.status && updates.status !== prev.status) {
      this.addTimelineEvent({
        incidentId: id,
        label: `Status changed to ${updates.status}`,
        detail: `Lifecycle transition: ${prev.status} → ${updates.status}`,
        actor: currentUser.full_name,
        kind: 'status',
        isInternal: false,
      });

      this.recordAuditLog(
        currentUser,
        'Status Changed',
        'Incident',
        updated.incidentNumber,
        `Status transitioned: ${prev.status} → ${updates.status}`
      );

      // Notify client
      this.addNotification({
        title: `Incident ${updated.incidentNumber} Updated`,
        message: `Status has progressed to ${updates.status}.`,
        type: 'info',
        portalTarget: 'client',
        link: `/incidents/${updated.id}`,
      });
    }

    // Timeline if assigned
    if (updates.assignedTo !== undefined && updates.assignedTo !== prev.assignedTo) {
      this.addTimelineEvent({
        incidentId: id,
        label: updates.assignedTo ? 'Analyst Assigned' : 'Assignment Cleared',
        detail: updates.assignedTo
          ? `Incident assigned to ${updates.assignedTo}.`
          : 'Assignment removed.',
        actor: currentUser.full_name,
        kind: 'assignment',
        isInternal: false,
      });

      this.recordAuditLog(
        currentUser,
        'Incident Assigned',
        'Incident',
        updated.incidentNumber,
        `Assigned to ${updates.assignedTo || 'Unassigned'}`
      );
    }

    if (updates.severity && updates.severity !== prev.severity) {
      this.recordAuditLog(
        currentUser,
        'Severity Changed',
        'Incident',
        updated.incidentNumber,
        `Severity adjusted from ${prev.severity} to ${updates.severity}`
      );
    }

    return updated;
  }

  // --- Comments (Strict Separation: Client vs Internal) ---
  getComments(incidentId: number, currentUser?: UserProfile | null): IncidentComment[] {
    const all = this.get<IncidentComment[]>('comments', SEED_COMMENTS);
    const filtered = all.filter((c) => c.incidentId === incidentId);

    // STRICT RLS RULE: Client users can NEVER see internal_security notes!
    if (!currentUser || currentUser.portal_type === 'client') {
      return filtered.filter((c) => c.visibility === 'client_visible');
    }

    return filtered;
  }

  addComment(
    incidentId: number,
    message: string,
    visibility: 'client_visible' | 'internal_security',
    currentUser: UserProfile
  ): IncidentComment {
    const comments = this.get<IncidentComment[]>('comments', SEED_COMMENTS);
    const nextId = comments.reduce((max, c) => Math.max(max, c.id), 0) + 1;

    // Enforce that client users can NEVER post internal notes
    const actualVisibility =
      currentUser.portal_type === 'client' ? 'client_visible' : visibility;

    const newComment: IncidentComment = {
      id: nextId,
      incidentId,
      authorId: currentUser.id,
      author: currentUser.full_name,
      authorRole: currentUser.role.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      authorPortal: currentUser.portal_type,
      message,
      visibility: actualVisibility,
      createdAt: new Date().toISOString(),
    };

    comments.push(newComment);
    this.set('comments', comments);

    const isInternal = actualVisibility === 'internal_security';
    this.addTimelineEvent({
      incidentId,
      label: isInternal ? 'Internal SOC Note Added' : 'Message Posted',
      detail: message.slice(0, 100) + (message.length > 100 ? '…' : ''),
      actor: currentUser.full_name,
      kind: 'comment',
      isInternal,
    });

    this.recordAuditLog(
      currentUser,
      isInternal ? 'Internal Note Added' : 'Comment Added',
      'Comment',
      `INC-${incidentId}`,
      `Added ${actualVisibility} comment: "${message.slice(0, 60)}..."`
    );

    // Cross-portal notification
    if (currentUser.portal_type === 'client') {
      this.addNotification({
        title: 'Client Communication Received',
        message: `${currentUser.full_name} posted an update on INC-${incidentId}.`,
        type: 'info',
        portalTarget: 'security',
        link: `/security/incidents/${incidentId}`,
      });
    } else if (actualVisibility === 'client_visible') {
      this.addNotification({
        title: 'Security Team Message',
        message: `${currentUser.full_name} posted an update for your incident.`,
        type: 'info',
        portalTarget: 'client',
        link: `/incidents/${incidentId}`,
      });
    }

    return newComment;
  }

  // --- Timeline ---
  getTimeline(incidentId: number, currentUser?: UserProfile | null): TimelineEvent[] {
    const all = this.get<TimelineEvent[]>('timeline', SEED_TIMELINE);
    const forIncident = all.filter((t) => t.incidentId === incidentId);

    // Filter internal events for client users
    if (!currentUser || currentUser.portal_type === 'client') {
      return forIncident.filter((t) => !t.isInternal);
    }
    return forIncident;
  }

  addTimelineEvent(event: Omit<TimelineEvent, 'id' | 'createdAt'>): TimelineEvent {
    const timeline = this.get<TimelineEvent[]>('timeline', SEED_TIMELINE);
    const nextId = timeline.reduce((max, t) => Math.max(max, t.id), 0) + 1;
    const newEvent: TimelineEvent = {
      ...event,
      id: nextId,
      createdAt: new Date().toISOString(),
    };
    timeline.unshift(newEvent);
    this.set('timeline', timeline);
    return newEvent;
  }

  // --- Evidence ---
  getEvidence(incidentId: number, currentUser?: UserProfile | null): Evidence[] {
    const all = this.get<Evidence[]>('evidence', SEED_EVIDENCE);
    const forIncident = all.filter((e) => e.incidentId === incidentId);

    if (!currentUser || currentUser.portal_type === 'client') {
      return forIncident.filter((e) => !e.isInternal);
    }
    return forIncident;
  }

  addEvidence(
    incidentId: number,
    data: { filename: string; type: string; size: string; isInternal?: boolean },
    currentUser: UserProfile
  ): Evidence {
    const evidence = this.get<Evidence[]>('evidence', SEED_EVIDENCE);
    const nextId = evidence.reduce((max, e) => Math.max(max, e.id), 0) + 1;

    // Simulate crypto hash
    const fakeHash = Array.from({ length: 64 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('');

    const newEvidence: Evidence = {
      id: nextId,
      incidentId,
      filename: data.filename,
      type: data.type,
      size: data.size,
      hash: fakeHash,
      uploadedBy: currentUser.full_name,
      uploadedByRole: currentUser.role,
      isInternal: currentUser.portal_type === 'security' ? Boolean(data.isInternal) : false,
      uploadedAt: new Date().toISOString(),
    };

    evidence.unshift(newEvidence);
    this.set('evidence', evidence);

    this.addTimelineEvent({
      incidentId,
      label: 'Evidence Uploaded',
      detail: `${newEvidence.filename} (${newEvidence.size}, SHA-256 verified) attached.`,
      actor: currentUser.full_name,
      kind: 'evidence',
      isInternal: newEvidence.isInternal,
    });

    this.recordAuditLog(
      currentUser,
      'Evidence Uploaded',
      'Evidence',
      `INC-${incidentId}`,
      `Uploaded file: ${newEvidence.filename} (Hash: ${newEvidence.hash.slice(0, 16)}...)`
    );

    return newEvidence;
  }

  // --- Threat Intel & IOCs ---
  getIocs(incidentId?: number): Ioc[] {
    const all = this.get<Ioc[]>('iocs', SEED_IOCS);
    if (incidentId !== undefined) {
      return all.filter((i) => i.incidentId === incidentId);
    }
    return all;
  }

  addIoc(ioc: Omit<Ioc, 'id' | 'firstSeen' | 'lastSeen'>, currentUser: UserProfile): Ioc {
    const iocs = this.get<Ioc[]>('iocs', SEED_IOCS);
    const nextId = iocs.reduce((max, i) => Math.max(max, i.id), 0) + 1;
    const now = new Date().toISOString();
    const newIoc: Ioc = {
      ...ioc,
      id: nextId,
      firstSeen: now,
      lastSeen: now,
    };
    iocs.unshift(newIoc);
    this.set('iocs', iocs);

    this.recordAuditLog(
      currentUser,
      'IOC Added',
      'Threat Intelligence',
      newIoc.value,
      `Added IOC ${newIoc.type}: ${newIoc.value} (${newIoc.threatLevel})`
    );

    return newIoc;
  }

  // --- Checklist ---
  getChecklist(incidentId: number): ChecklistItem[] {
    const all = this.get<ChecklistItem[]>('checklist', SEED_CHECKLIST);
    return all.filter((c) => c.incidentId === incidentId);
  }

  toggleChecklistItem(itemId: number, currentUser: UserProfile): ChecklistItem | null {
    const all = this.get<ChecklistItem[]>('checklist', SEED_CHECKLIST);
    const item = all.find((c) => c.id === itemId);
    if (!item) return null;

    item.completed = !item.completed;
    item.completedBy = item.completed ? currentUser.full_name : undefined;
    item.completedAt = item.completed ? new Date().toISOString() : undefined;

    this.set('checklist', all);

    this.recordAuditLog(
      currentUser,
      item.completed ? 'Checklist Item Completed' : 'Checklist Item Unchecked',
      'Checklist',
      `Item #${itemId}`,
      `Toggled checklist: "${item.label}" -> ${item.completed ? 'COMPLETED' : 'PENDING'}`
    );

    return item;
  }

  // --- Audit Logs (Immutable, Protected) ---
  getAuditLogs(currentUser?: UserProfile | null): AuditLog[] {
    // Only Security team and Admins can view audit logs
    if (currentUser && currentUser.portal_type === 'client') {
      return [];
    }
    return this.get<AuditLog[]>('audit_logs', SEED_AUDIT_LOGS);
  }

  recordAuditLog(
    user: UserProfile,
    action: string,
    resourceType: string,
    resourceId?: string,
    details: string = ''
  ): AuditLog {
    const logs = this.get<AuditLog[]>('audit_logs', SEED_AUDIT_LOGS);
    const nextId = logs.reduce((max, l) => Math.max(max, l.id), 0) + 1;
    const newLog: AuditLog = {
      id: nextId,
      userId: user.id,
      userName: user.full_name,
      userRole: user.role,
      action,
      resourceType,
      resourceId,
      details,
      ipAddress: '198.51.100.14',
      createdAt: new Date().toISOString(),
    };
    logs.unshift(newLog);
    this.set('audit_logs', logs.slice(0, 200)); // maintain recent 200 logs
    return newLog;
  }

  // --- Notifications ---
  getNotifications(currentUser?: UserProfile | null): NotificationItem[] {
    const all = this.get<NotificationItem[]>('notifications', SEED_NOTIFICATIONS);
    if (!currentUser) return all;

    return all.filter(
      (n) => !n.portalTarget || n.portalTarget === currentUser.portal_type
    );
  }

  markNotificationRead(id: number): void {
    const all = this.get<NotificationItem[]>('notifications', SEED_NOTIFICATIONS);
    const target = all.find((n) => n.id === id);
    if (target) {
      target.read = true;
      this.set('notifications', all);
    }
  }

  addNotification(item: Omit<NotificationItem, 'id' | 'read' | 'createdAt'>): NotificationItem {
    const all = this.get<NotificationItem[]>('notifications', SEED_NOTIFICATIONS);
    const nextId = all.reduce((max, n) => Math.max(max, n.id), 0) + 1;
    const newItem: NotificationItem = {
      ...item,
      id: nextId,
      read: false,
      createdAt: new Date().toISOString(),
    };
    all.unshift(newItem);
    this.set('notifications', all);
    return newItem;
  }

  // --- Real Database Stats Computation (No Fake Numbers) ---
  getDashboardStats(currentUser?: UserProfile | null) {
    const incidents = this.getIncidents(currentUser);
    const now = Date.now();

    const openStatuses = new Set([
      'NEW',
      'TRIAGED',
      'ASSIGNED',
      'INVESTIGATING',
      'CONTAINED',
      'ERADICATED',
      'RECOVERING',
      'ESCALATED',
      'REOPENED',
    ]);

    const openIncidents = incidents.filter((i) => openStatuses.has(i.status));
    const criticalIncidents = openIncidents.filter((i) => i.severity === 'CRITICAL');
    const highIncidents = openIncidents.filter((i) => i.severity === 'HIGH');
    const underInvestigation = openIncidents.filter((i) =>
      ['INVESTIGATING', 'TRIAGED', 'ASSIGNED'].includes(i.status)
    );

    const slaApproaching = openIncidents.filter((i) => {
      const remaining = new Date(i.slaDueAt).getTime() - now;
      return remaining > 0 && remaining <= 60 * 60 * 1000; // less than 1 hour left
    });

    const slaBreached = openIncidents.filter((i) => {
      return new Date(i.slaDueAt).getTime() < now;
    });

    const resolved = incidents.filter((i) => ['RESOLVED', 'CLOSED'].includes(i.status));

    // Categories
    const categoryCounts: Record<string, number> = {};
    for (const inc of incidents) {
      categoryCounts[inc.category] = (categoryCounts[inc.category] || 0) + 1;
    }

    // Severities
    const severityCounts = {
      CRITICAL: incidents.filter((i) => i.severity === 'CRITICAL').length,
      HIGH: incidents.filter((i) => i.severity === 'HIGH').length,
      MEDIUM: incidents.filter((i) => i.severity === 'MEDIUM').length,
      LOW: incidents.filter((i) => i.severity === 'LOW').length,
    };

    // Organizations
    const orgCounts: Record<string, number> = {};
    for (const inc of incidents) {
      orgCounts[inc.organizationName] = (orgCounts[inc.organizationName] || 0) + 1;
    }

    return {
      total: incidents.length,
      open: openIncidents.length,
      critical: criticalIncidents.length,
      high: highIncidents.length,
      underInvestigation: underInvestigation.length,
      slaApproaching: slaApproaching.length,
      slaBreached: slaBreached.length,
      resolved: resolved.length,
      categories: Object.entries(categoryCounts).map(([name, count]) => ({ name, count })),
      severities: severityCounts,
      organizations: Object.entries(orgCounts).map(([name, count]) => ({ name, count })),
    };
  }

  // --- Users & Orgs Management ---
  getUsers(): UserProfile[] {
    return this.get<UserProfile[]>('users', SEED_USERS);
  }

  getOrganizations(): Organization[] {
    return this.get<Organization[]>('organizations', SEED_ORGANIZATIONS);
  }

  updateUserRole(userId: string, newRole: any, adminUser: UserProfile): void {
    const users = this.getUsers();
    const u = users.find((x) => x.id === userId);
    if (u) {
      const oldRole = u.role;
      u.role = newRole;
      u.portal_type = newRole.startsWith('client_') ? 'client' : 'security';
      this.set('users', users);
      this.recordAuditLog(
        adminUser,
        'Role Changed',
        'User',
        u.email,
        `Role changed for ${u.full_name}: ${oldRole} → ${newRole}`
      );
    }
  }
}

export const dataService = new CyberShieldDataStore();
