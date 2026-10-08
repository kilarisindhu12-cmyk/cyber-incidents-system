export type PortalType = 'client' | 'security' | 'admin';

export type UserRole =
  | 'client_user'
  | 'client_manager'
  | 'soc_analyst'
  | 'senior_soc_analyst'
  | 'incident_responder'
  | 'security_manager'
  | 'soc_admin'
  | 'threat_intel_analyst'
  | 'security_auditor'
  | 'super_admin';

export interface Organization {
  id: string;
  name: string;
  slug: string;
  tier: string;
  domain?: string;
  contact_email?: string;
  created_at: string;
}

export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  organization_id: string;
  organization_name?: string;
  department: string;
  role: UserRole;
  portal_type: PortalType;
  avatar_url?: string;
  mfa_enabled: boolean;
  clearance_level: string;
  account_status: 'Active' | 'Suspended' | 'Pending MFA';
  last_login_at?: string;
  created_at: string;
  updated_at: string;
}

export type IncidentSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type IncidentPriority = 'URGENT' | 'HIGH' | 'NORMAL' | 'LOW';
export type IncidentStatus =
  | 'NEW'
  | 'TRIAGED'
  | 'ASSIGNED'
  | 'INVESTIGATING'
  | 'CONTAINED'
  | 'ERADICATED'
  | 'RECOVERING'
  | 'RESOLVED'
  | 'CLOSED'
  | 'ESCALATED'
  | 'REOPENED'
  | 'FALSE_POSITIVE';

export interface Incident {
  id: number;
  incidentNumber: string;
  organizationId: string;
  organizationName: string;
  title: string;
  description: string;
  category: string;
  severity: IncidentSeverity;
  priority: IncidentPriority;
  riskScore: number;
  status: IncidentStatus;
  reporterId?: string;
  reporter: string;
  department: string;
  assignedTo?: string | null;
  assignedAnalystId?: string | null;
  affectedSystem?: string | null;
  affectedUsers: number;
  impact: string;
  impactBusiness?: string;
  impactData?: string;
  impactAvailability?: string;
  location?: string | null;
  technicalDetails?: string;
  incidentDate: string;
  discoveryDate: string;
  slaDueAt: string;
  rootCause?: string | null;
  attackVector?: string | null;
  containment?: string | null;
  eradication?: string | null;
  recovery?: string | null;
  resolution?: string | null;
  createdAt: string;
  updatedAt: string;
}

export type CommentVisibility = 'client_visible' | 'internal_security';

export interface IncidentComment {
  id: number;
  incidentId: number;
  authorId: string;
  author: string;
  authorRole: string;
  authorPortal: PortalType;
  message: string;
  visibility: CommentVisibility;
  createdAt: string;
}

export interface TimelineEvent {
  id: number;
  incidentId: number;
  label: string;
  detail: string;
  actor: string;
  kind: 'reported' | 'triage' | 'status' | 'assignment' | 'comment' | 'evidence' | 'containment' | 'resolved';
  isInternal: boolean;
  createdAt: string;
}

export interface Evidence {
  id: number;
  incidentId: number;
  filename: string;
  type: string;
  size: string;
  hash: string;
  uploadedBy: string;
  uploadedByRole: string;
  isInternal: boolean;
  storagePath?: string;
  uploadedAt: string;
}

export type IocType = 'IP' | 'Domain' | 'URL' | 'Hash' | 'Email' | 'File' | 'Account';
export type ThreatLevel = 'Critical' | 'High' | 'Medium' | 'Low';
export type IocStatus = 'Active' | 'Blocked' | 'Monitoring' | 'Benign';

export interface Ioc {
  id: number;
  incidentId?: number | null;
  relatedIncidentNumber?: string;
  type: IocType;
  value: string;
  source: string;
  threatLevel: ThreatLevel;
  confidence: number;
  status: IocStatus;
  firstSeen: string;
  lastSeen: string;
}

export interface ChecklistItem {
  id: number;
  incidentId: number;
  phase: 'Triage' | 'Investigation' | 'Containment' | 'Eradication' | 'Recovery';
  label: string;
  completed: boolean;
  completedBy?: string;
  completedAt?: string;
}

export interface AuditLog {
  id: number;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  details: string;
  ipAddress: string;
  createdAt: string;
}

export interface NotificationItem {
  id: number;
  userId?: string;
  portalTarget?: PortalType;
  title: string;
  message: string;
  type: 'critical' | 'high' | 'sla' | 'assignment' | 'evidence' | 'info';
  link?: string;
  read: boolean;
  createdAt: string;
}
