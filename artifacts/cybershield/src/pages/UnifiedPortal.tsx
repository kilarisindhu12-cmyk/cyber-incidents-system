import React, { useState } from 'react';
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Terminal,
  Activity,
  Layers,
  Columns,
  Maximize2,
  Users,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  RefreshCw,
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertOctagon,
  Fingerprint,
  Radio,
  FileCheck2,
  Settings,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { dataService } from '@/lib/data-service';

// Client Components
import { ClientDashboard } from '@/components/client/ClientDashboard';
import { ClientNewIncident } from '@/components/client/ClientNewIncident';
import { ClientIncidentQueue } from '@/components/client/ClientIncidentQueue';
import { ClientIncidentDetail } from '@/components/client/ClientIncidentDetail';
import { ClientReports } from '@/components/client/ClientReports';
import { ClientProfile } from '@/components/client/ClientProfile';

// Security Components
import { SecurityDashboard } from '@/components/security/SecurityDashboard';
import { SecurityIncidentQueue } from '@/components/security/SecurityIncidentQueue';
import { SecurityIncidentDetail } from '@/components/security/SecurityIncidentDetail';
import { SecuritySLA } from '@/components/security/SecuritySLA';
import { SecurityAnalytics } from '@/components/security/SecurityAnalytics';
import { SecurityThreatIntel } from '@/components/security/SecurityThreatIntel';
import { SecurityIOCs } from '@/components/security/SecurityIOCs';
import { SecurityAdmin } from '@/components/security/SecurityAdmin';
import { SecurityProfile } from '@/components/security/SecurityProfile';

export const UnifiedPortal: React.FC = () => {
  const { currentUser, switchUser, allUsers, login } = useAuth();
  
  // View mode: 'client' | 'security' | 'split'
  const [activePortal, setActivePortal] = useState<'client' | 'security' | 'split'>('split');
  
  // Sub-views for single portal modes
  const [clientTab, setClientTab] = useState<'dashboard' | 'new' | 'incidents' | 'reports' | 'profile'>('dashboard');
  const [securityTab, setSecurityTab] = useState<'dashboard' | 'queue' | 'sla' | 'analytics' | 'intel' | 'iocs' | 'admin' | 'profile'>('dashboard');

  // Selected incident ID for split-view comparison
  const [selectedIncidentId, setSelectedIncidentId] = useState<number>(101);

  // Quick switch user persona
  const handleSelectUser = async (userId: string) => {
    switchUser(userId);
  };

  const handlePortalSwitch = (portal: 'client' | 'security' | 'split') => {
    setActivePortal(portal);
    if (portal === 'client' && currentUser?.portal_type !== 'client') {
      // Auto-switch to client user Morgan Lee
      const morgan = allUsers.find((u) => u.email === 'morgan.lee@acme.com');
      if (morgan) switchUser(morgan.id);
    } else if (portal === 'security' && currentUser?.portal_type !== 'security') {
      // Auto-switch to SOC Analyst Alex Rivera
      const alex = allUsers.find((u) => u.email === 'alex.rivera@cybershield.soc');
      if (alex) switchUser(alex.id);
    }
  };

  return (
    <div className="min-h-screen bg-[#070d1e] text-slate-100 flex flex-col font-sans selection:bg-[#00f2fe]/20 selection:text-[#00f2fe]">
      {/* ================= UNIVERSAL TOP CYBERSHIELD COMMAND BAR ================= */}
      <header className="sticky top-0 z-50 bg-[#091226] border-b border-[#14234b] px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-lg">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0052d4] via-[#4364f7] to-[#00f2fe] flex items-center justify-center shadow-md shadow-[#00f2fe]/25 text-white shrink-0">
            <Shield size={20} strokeWidth={2.5} />
          </div>
          <div>
            <div className="font-extrabold text-base tracking-tight text-white flex items-center gap-2">
              CYBERSHIELD <span className="text-[#00f2fe] text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#00f2fe]/10 border border-[#00f2fe]/30">DUAL PORTAL HUB</span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono hidden sm:block">
              One URL · Client Portal + Security SOC Platform
            </div>
          </div>
        </div>

        {/* ================= PORTAL SWITCHER BUTTONS (ONE URL) ================= */}
        <div className="flex items-center bg-[#050b18] p-1 rounded-xl border border-[#1b2f60]">
          {/* Client Portal Tab */}
          <button
            onClick={() => handlePortalSwitch('client')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activePortal === 'client'
                ? 'bg-[#0f766e] text-white shadow-md shadow-[#0f766e]/30'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <ShieldCheck size={14} className={activePortal === 'client' ? 'text-[#5eead4]' : 'text-slate-400'} />
            <span>Client Portal</span>
          </button>

          {/* Security SOC Portal Tab */}
          <button
            onClick={() => handlePortalSwitch('security')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activePortal === 'security'
                ? 'bg-[#00f2fe] text-[#070d1e] font-extrabold shadow-md shadow-[#00f2fe]/25'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Terminal size={14} className={activePortal === 'security' ? 'text-[#070d1e]' : 'text-[#00f2fe]'} />
            <span>Security Portal (SOC)</span>
          </button>

          {/* Side-by-Side Split View Tab */}
          <button
            onClick={() => handlePortalSwitch('split')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activePortal === 'split'
                ? 'bg-gradient-to-r from-[#4364f7] to-[#00f2fe] text-[#070d1e] font-extrabold shadow-md shadow-[#00f2fe]/20'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Columns size={14} />
            <span>Split View (Both Live)</span>
          </button>
        </div>

        {/* Persona Selector & DB Status */}
        <div className="flex items-center gap-2.5">
          <div className="hidden md:flex items-center gap-1.5 text-[11px] font-mono text-[#34d399] px-2 py-1 rounded bg-[#052e16]/60 border border-[#166534]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#34d399] animate-pulse"></span>
            Supabase DB Synced
          </div>

          {/* Active User Switcher */}
          <div className="flex items-center gap-1.5 bg-[#0c1836] border border-[#1b2f60] px-2.5 py-1 rounded-xl text-xs">
            <span className="text-slate-400 text-[10px] uppercase font-mono">User:</span>
            <select
              value={currentUser?.id || ''}
              onChange={(e) => handleSelectUser(e.target.value)}
              className="bg-transparent text-white font-bold text-xs outline-none cursor-pointer"
            >
              <optgroup label="Client Organization Users">
                {allUsers
                  .filter((u) => u.portal_type === 'client')
                  .map((u) => (
                    <option key={u.id} value={u.id} className="bg-[#091226] text-white">
                      🏢 {u.full_name} ({u.role})
                    </option>
                  ))}
              </optgroup>
              <optgroup label="Cybersecurity Defense Team">
                {allUsers
                  .filter((u) => u.portal_type === 'security')
                  .map((u) => (
                    <option key={u.id} value={u.id} className="bg-[#091226] text-white">
                      🛡️ {u.full_name} ({u.role})
                    </option>
                  ))}
              </optgroup>
            </select>
          </div>
        </div>
      </header>

      {/* ================= PORTAL BODY CONTAINER ================= */}
      <div className="flex-1 flex flex-col">
        {/* ================================================================= */}
        {/* MODE 1: CLIENT PORTAL FULL VIEW                                   */}
        {/* ================================================================= */}
        {activePortal === 'client' && (
          <div className="flex-1 flex flex-col bg-[#f0f6f8] text-[#19333c]">
            {/* Client Top Navigation Sub-bar */}
            <div className="bg-white border-b border-[#dfe7e9] px-6 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]"></span>
                <span className="font-bold text-sm text-[#19333c]">CLIENT PORTAL — ACME CORP</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#e0f2fe] text-[#0369a1] font-mono">
                  Organization Tenant View
                </span>
              </div>

              {/* Client Subtabs */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setClientTab('dashboard')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                    clientTab === 'dashboard' ? 'bg-[#173e4a] text-white' : 'text-[#556970] hover:bg-[#f1f5f9]'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setClientTab('new')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 ${
                    clientTab === 'new' ? 'bg-[#10b981] text-white' : 'text-[#556970] hover:bg-[#f1f5f9]'
                  }`}
                >
                  <PlusCircle size={13} />
                  Report Incident
                </button>
                <button
                  onClick={() => setClientTab('incidents')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                    clientTab === 'incidents' ? 'bg-[#173e4a] text-white' : 'text-[#556970] hover:bg-[#f1f5f9]'
                  }`}
                >
                  Incident History
                </button>
                <button
                  onClick={() => setClientTab('reports')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                    clientTab === 'reports' ? 'bg-[#173e4a] text-white' : 'text-[#556970] hover:bg-[#f1f5f9]'
                  }`}
                >
                  Security Reports
                </button>
                <button
                  onClick={() => setClientTab('profile')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                    clientTab === 'profile' ? 'bg-[#173e4a] text-white' : 'text-[#556970] hover:bg-[#f1f5f9]'
                  }`}
                >
                  My Profile
                </button>
              </div>
            </div>

            {/* Client Content Area */}
            <div className="p-6 max-w-7xl w-full mx-auto">
              {clientTab === 'dashboard' && <ClientDashboard />}
              {clientTab === 'new' && <ClientNewIncident />}
              {clientTab === 'incidents' && <ClientIncidentQueue />}
              {clientTab === 'reports' && <ClientReports />}
              {clientTab === 'profile' && <ClientProfile />}
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* MODE 2: SECURITY SOC PORTAL FULL VIEW                             */}
        {/* ================================================================= */}
        {activePortal === 'security' && (
          <div className="flex-1 flex flex-col bg-[#070d1e] text-[#cbd5e1]">
            {/* Security Top Navigation Sub-bar */}
            <div className="bg-[#091226] border-b border-[#14234b] px-6 py-2.5 flex items-center justify-between font-mono">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00f2fe] animate-pulse"></span>
                <span className="font-bold text-sm text-white">CYBERSHIELD SOC CONSOLE</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#00f2fe]/10 text-[#00f2fe] border border-[#00f2fe]/30">
                  Full Defensive Clearance
                </span>
              </div>

              {/* Security Subtabs */}
              <div className="flex items-center gap-1 font-sans">
                <button
                  onClick={() => setSecurityTab('dashboard')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono ${
                    securityTab === 'dashboard' ? 'bg-[#00f2fe] text-[#070d1e]' : 'text-slate-300 hover:bg-[#0c1836]'
                  }`}
                >
                  SOC DASHBOARD
                </button>
                <button
                  onClick={() => setSecurityTab('queue')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono ${
                    securityTab === 'queue' ? 'bg-[#00f2fe] text-[#070d1e]' : 'text-slate-300 hover:bg-[#0c1836]'
                  }`}
                >
                  INCIDENT QUEUE
                </button>
                <button
                  onClick={() => setSecurityTab('sla')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono ${
                    securityTab === 'sla' ? 'bg-[#00f2fe] text-[#070d1e]' : 'text-slate-300 hover:bg-[#0c1836]'
                  }`}
                >
                  SLA RADAR
                </button>
                <button
                  onClick={() => setSecurityTab('analytics')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono ${
                    securityTab === 'analytics' ? 'bg-[#00f2fe] text-[#070d1e]' : 'text-slate-300 hover:bg-[#0c1836]'
                  }`}
                >
                  ANALYTICS
                </button>
                <button
                  onClick={() => setSecurityTab('intel')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono ${
                    securityTab === 'intel' ? 'bg-[#00f2fe] text-[#070d1e]' : 'text-slate-300 hover:bg-[#0c1836]'
                  }`}
                >
                  THREAT INTEL
                </button>
                <button
                  onClick={() => setSecurityTab('iocs')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono ${
                    securityTab === 'iocs' ? 'bg-[#00f2fe] text-[#070d1e]' : 'text-slate-300 hover:bg-[#0c1836]'
                  }`}
                >
                  IOCS
                </button>
                <button
                  onClick={() => setSecurityTab('admin')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono ${
                    securityTab === 'admin' ? 'bg-[#00f2fe] text-[#070d1e]' : 'text-slate-300 hover:bg-[#0c1836]'
                  }`}
                >
                  ADMIN & AUDIT
                </button>
              </div>
            </div>

            {/* Security Content Area */}
            <div className="p-6 max-w-7xl w-full mx-auto">
              {securityTab === 'dashboard' && <SecurityDashboard />}
              {securityTab === 'queue' && <SecurityIncidentQueue />}
              {securityTab === 'sla' && <SecuritySLA />}
              {securityTab === 'analytics' && <SecurityAnalytics />}
              {securityTab === 'intel' && <SecurityThreatIntel />}
              {securityTab === 'iocs' && <SecurityIOCs />}
              {securityTab === 'admin' && <SecurityAdmin />}
              {securityTab === 'profile' && <SecurityProfile />}
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* MODE 3: SPLIT VIEW (BOTH PORTALS LIVE SIDE-BY-SIDE IN ONE URL)    */}
        {/* ================================================================= */}
        {activePortal === 'split' && (
          <div className="flex-1 flex flex-col p-4 sm:p-6 gap-4">
            {/* Split View Explanation Bar */}
            <div className="bg-[#0b152d] border border-[#1a2f62] rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-3 shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#00f2fe]/10 text-[#00f2fe] flex items-center justify-center shrink-0">
                  <Columns size={18} />
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-2">
                    LIVE DUAL PORTAL DEMONSTRATION IN ONE URL
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#10b981]/20 text-[#34d399] border border-[#10b981]/40">
                      SAME SUPABASE BACKEND
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Interact with the <strong>Client Portal</strong> on the left and the <strong>Security SOC Console</strong> on the right simultaneously.
                  </div>
                </div>
              </div>

              {/* Incident Selector for Comparative Inspection */}
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-slate-400">Comparing Incident:</span>
                <select
                  value={selectedIncidentId}
                  onChange={(e) => setSelectedIncidentId(Number(e.target.value))}
                  className="bg-[#060e20] border border-[#1b3473] text-[#00f2fe] font-bold rounded-lg px-2.5 py-1 text-xs outline-none cursor-pointer"
                >
                  <option value={101}>INC-2026-000101 (Ransomware Attempt)</option>
                  <option value={102}>INC-2026-000102 (Phishing Credentials)</option>
                  <option value={103}>INC-2026-000103 (Data Exfiltration)</option>
                </select>
              </div>
            </div>

            {/* The Two Portals Side-by-Side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 flex-1 items-start">
              
              {/* ================= LEFT COLUMN: CLIENT PORTAL ================= */}
              <div className="rounded-2xl bg-[#f0f6f8] text-[#19333c] border-2 border-[#14b8a6]/50 shadow-2xl overflow-hidden flex flex-col">
                {/* Header */}
                <div className="bg-[#173e4a] text-white p-3.5 flex items-center justify-between border-b border-[#115e59]">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={18} className="text-[#2dd4bf]" />
                    <span className="font-extrabold text-sm tracking-tight">CLIENT PORTAL (ACME CORP)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#2dd4bf]/20 text-[#2dd4bf]">
                      Morgan Lee (Employee)
                    </span>
                    <button
                      onClick={() => setActivePortal('client')}
                      title="Expand to Full Screen"
                      className="text-slate-300 hover:text-white"
                    >
                      <Maximize2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Sub-bar */}
                <div className="bg-white border-b border-[#dfe7e9] px-4 py-2 flex items-center justify-between text-xs">
                  <span className="text-[#556970] font-medium">Customer Facing Experience</span>
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#0f766e]">
                    <EyeOff size={13} className="text-[#ef4444]" />
                    <span>Confidential SOC notes hidden</span>
                  </div>
                </div>

                {/* Scrollable Client View */}
                <div className="p-4 space-y-4 max-h-[780px] overflow-y-auto">
                  {/* Quick Action */}
                  <div className="p-4 bg-white rounded-xl border border-[#dfe7e9] shadow-xs flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-[#19333c]">Reported Incidents: Acme Corp</div>
                      <div className="text-[11px] text-[#687f87]">Client users can view status, add info, and message analysts.</div>
                    </div>
                    <button
                      onClick={() => setClientTab('new')}
                      className="px-3 py-1.5 bg-[#10b981] text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm"
                    >
                      <PlusCircle size={13} /> Report
                    </button>
                  </div>

                  {/* Render Client Incident Detail */}
                  <div className="bg-white rounded-xl border border-[#dfe7e9] p-4 shadow-xs">
                    <ClientIncidentDetail incidentIdProp={selectedIncidentId} />
                  </div>
                </div>
              </div>

              {/* ================= RIGHT COLUMN: SECURITY SOC PORTAL ================= */}
              <div className="rounded-2xl bg-[#091226] text-[#cbd5e1] border-2 border-[#00f2fe]/50 shadow-2xl overflow-hidden flex flex-col font-mono">
                {/* Header */}
                <div className="bg-[#050e22] text-white p-3.5 flex items-center justify-between border-b border-[#162754]">
                  <div className="flex items-center gap-2">
                    <Terminal size={18} className="text-[#00f2fe]" />
                    <span className="font-extrabold text-sm tracking-tight text-[#00f2fe]">CYBERSHIELD SOC CONSOLE</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#00f2fe]/20 text-[#00f2fe]">
                      Alex Rivera (SOC Analyst)
                    </span>
                    <button
                      onClick={() => setActivePortal('security')}
                      title="Expand to Full Screen"
                      className="text-slate-400 hover:text-white"
                    >
                      <Maximize2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Sub-bar */}
                <div className="bg-[#071026] border-b border-[#14234b] px-4 py-2 flex items-center justify-between text-xs">
                  <span className="text-slate-400">10-Stage Investigation & Triage Workspace</span>
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#fde047]">
                    <Lock size={13} className="text-[#eab308]" />
                    <span>Confidential SOC notes unlocked</span>
                  </div>
                </div>

                {/* Scrollable SOC View */}
                <div className="p-4 space-y-4 max-h-[780px] overflow-y-auto font-sans">
                  {/* Real-time SOC Alert Ticker */}
                  <div className="p-3 bg-[#050f24] rounded-xl border border-[#162852] font-mono text-xs flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[#00f2fe]">
                      <span className="w-2 h-2 rounded-full bg-[#00f2fe] animate-pulse"></span>
                      <span>ACTIVE TRIAGE: INC-2026-000{selectedIncidentId}</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#ef4444]/20 text-[#ef4444] border border-[#ef4444]/40 font-bold">
                      SLA CRITICAL
                    </span>
                  </div>

                  {/* Render Security Incident Detail with 10-Stage Workflow */}
                  <div className="bg-[#091226] rounded-xl border border-[#14234b] p-4 shadow-xs">
                    <SecurityIncidentDetail incidentIdProp={selectedIncidentId} />
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>

      {/* ================= FOOTER ================= */}
      <footer className="bg-[#050b18] border-t border-[#14234b] py-3 px-6 text-center text-xs text-slate-500 font-mono flex flex-col sm:flex-row items-center justify-between gap-2">
        <div>
          🛡️ CyberShield Enterprise Incident Management & SOC Platform
        </div>
        <div className="flex items-center gap-3 text-slate-400">
          <span>Single URL: <strong>http://localhost:5173/</strong></span>
          <span>·</span>
          <span className="text-[#10b981]">PostgreSQL & Supabase RLS Active</span>
        </div>
      </footer>
    </div>
  );
};
