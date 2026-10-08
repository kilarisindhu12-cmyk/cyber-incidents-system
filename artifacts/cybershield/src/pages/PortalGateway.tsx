import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  ArrowRight,
  Activity,
  Terminal,
  Users,
  Lock,
  Layers,
  Clock,
  Database,
  CheckCircle2,
  AlertOctagon,
  Eye,
  EyeOff,
  Sparkles,
  RefreshCw,
  Fingerprint,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { dataService } from '@/lib/data-service';

export const PortalGateway: React.FC = () => {
  const [, setLocation] = useLocation();
  const { login, currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'gateway' | 'comparison'>('gateway');

  // Real database stats
  const clientStats = dataService.getDashboardStats({
    role: 'client_user',
    organization_id: '11111111-1111-1111-1111-111111111111',
  } as any);

  const socStats = dataService.getDashboardStats({
    role: 'soc_analyst',
    portal_type: 'security',
  } as any);

  const handleQuickEnter = async (email: string, portal: 'client' | 'security', targetPath: string) => {
    await login(email, portal);
    setLocation(targetPath);
  };

  return (
    <div className="min-h-screen bg-[#060c1b] text-slate-100 flex flex-col font-sans selection:bg-[#00f2fe]/30 selection:text-[#00f2fe]">
      {/* Top Banner Navigation */}
      <header className="sticky top-0 z-50 bg-[#081226]/90 backdrop-blur-md border-b border-[#14234b] px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0052d4] via-[#4364f7] to-[#00f2fe] flex items-center justify-center shadow-lg shadow-[#00f2fe]/25 text-white">
            <Shield size={22} strokeWidth={2.5} />
          </div>
          <div>
            <div className="font-extrabold text-lg tracking-tight text-white flex items-center gap-2">
              CYBERSHIELD <span className="text-[#00f2fe] text-xs font-mono px-2 py-0.5 rounded bg-[#00f2fe]/10 border border-[#00f2fe]/30">ENTERPRISE PLATFORM</span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              Report. Categorize. Track. Respond. Resolve. Stay Secure.
            </div>
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-2 bg-[#0c1836] p-1 rounded-xl border border-[#1b2f60]">
          <button
            onClick={() => setActiveTab('gateway')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'gateway'
                ? 'bg-[#00f2fe] text-[#060c1b] shadow-md shadow-[#00f2fe]/20'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Portal Selector
          </button>
          <button
            onClick={() => setActiveTab('comparison')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'comparison'
                ? 'bg-[#00f2fe] text-[#060c1b] shadow-md shadow-[#00f2fe]/20'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Eye size={13} />
            Side-by-Side Comparison
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-10 flex flex-col justify-center">
        {activeTab === 'gateway' ? (
          <div className="space-y-10">
            {/* Header Hero */}
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00f2fe]/10 border border-[#00f2fe]/30 text-[#00f2fe] text-xs font-mono font-semibold">
                <Sparkles size={13} /> ONE BACKEND · TWO DEDICATED PORTALS
              </div>
              <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white">
                Choose Your CyberShield Portal
              </h1>
              <p className="text-sm md:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
                Both portals share the same Supabase database, incident records, evidence, and audit logs with strict database-level Row Level Security (RLS) and distinct workflows.
              </p>
            </div>

            {/* Side-by-Side Portals Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
              {/* ================= 1. CLIENT PORTAL CARD ================= */}
              <div className="relative rounded-3xl bg-gradient-to-b from-[#0e2433] via-[#091a26] to-[#07131d] border-2 border-[#164e63] hover:border-[#14b8a6] transition-all p-7 md:p-9 shadow-2xl flex flex-col justify-between group">
                <div className="absolute top-5 right-5 px-3 py-1 rounded-full bg-[#14b8a6]/15 border border-[#14b8a6]/30 text-[#2dd4bf] text-xs font-mono font-bold">
                  PORTAL 01
                </div>

                <div className="space-y-6">
                  {/* Title & Badge */}
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#0f766e] to-[#2dd4bf] flex items-center justify-center shadow-lg shadow-[#14b8a6]/25 text-white shrink-0">
                      <ShieldCheck size={30} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-white">CLIENT PORTAL</h2>
                      <p className="text-xs text-[#2dd4bf] font-mono">For Customer Organizations & Employees</p>
                    </div>
                  </div>

                  <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                    A clean, accessible incident reporting and progress tracking portal designed for customer organizations, IT managers, and employees.
                  </p>

                  {/* Feature Highlights */}
                  <div className="space-y-2.5 bg-[#05111a]/70 rounded-2xl p-4 border border-[#133543]">
                    <div className="text-[11px] font-mono text-[#2dd4bf] uppercase tracking-wider font-bold">
                      Key Client Capabilities
                    </div>
                    <ul className="text-xs text-slate-300 space-y-1.5">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-[#2dd4bf] shrink-0" />
                        <span>3-Step Incident Reporting Wizard with Evidence Upload</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-[#2dd4bf] shrink-0" />
                        <span>Real-Time Incident Tracking & Milestone Progress</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-[#2dd4bf] shrink-0" />
                        <span>Direct Communication Channel with SOC Analysts</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <EyeOff size={14} className="text-[#f87171] shrink-0" />
                        <span className="text-slate-400">Strictly Redacted: Internal SOC investigation notes hidden</span>
                      </li>
                    </ul>
                  </div>

                  {/* Dynamic Database Metrics Preview */}
                  <div className="grid grid-cols-3 gap-2.5 pt-1">
                    <div className="bg-[#051522] rounded-xl p-3 border border-[#143d4d] text-center">
                      <div className="text-[10px] text-slate-400 font-mono">Reported</div>
                      <div className="text-xl font-black text-white font-mono">{clientStats.total}</div>
                    </div>
                    <div className="bg-[#051522] rounded-xl p-3 border border-[#143d4d] text-center">
                      <div className="text-[10px] text-slate-400 font-mono">In Review</div>
                      <div className="text-xl font-black text-[#38bdf8] font-mono">{clientStats.open}</div>
                    </div>
                    <div className="bg-[#051522] rounded-xl p-3 border border-[#143d4d] text-center">
                      <div className="text-[10px] text-slate-400 font-mono">Resolved</div>
                      <div className="text-xl font-black text-[#34d399] font-mono">{clientStats.resolved}</div>
                    </div>
                  </div>
                </div>

                {/* Actions & Instant Launch */}
                <div className="mt-8 pt-6 border-t border-[#133543] space-y-3">
                  <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                    Instant 1-Click Launch As:
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleQuickEnter('morgan.lee@acme.com', 'client', '/dashboard')}
                      className="px-3 py-2.5 rounded-xl bg-[#0f2d3a] hover:bg-[#154153] border border-[#1d4f63] text-left transition-all cursor-pointer group/btn"
                    >
                      <div className="text-xs font-bold text-white group-hover/btn:text-[#2dd4bf]">Morgan Lee</div>
                      <div className="text-[10px] text-slate-400">Employee @ Acme</div>
                    </button>
                    <button
                      onClick={() => handleQuickEnter('sarah.jenkins@acme.com', 'client', '/dashboard')}
                      className="px-3 py-2.5 rounded-xl bg-[#0f2d3a] hover:bg-[#154153] border border-[#1d4f63] text-left transition-all cursor-pointer group/btn"
                    >
                      <div className="text-xs font-bold text-white group-hover/btn:text-[#2dd4bf]">Sarah Jenkins</div>
                      <div className="text-[10px] text-slate-400">IT Manager @ Acme</div>
                    </button>
                  </div>

                  <Link
                    href="/dashboard"
                    className="w-full py-3.5 bg-gradient-to-r from-[#0d9488] to-[#14b8a6] hover:from-[#0f766e] hover:to-[#0d9488] text-white font-bold text-sm rounded-xl shadow-lg shadow-[#0d9488]/25 flex items-center justify-center gap-2 transition-all mt-2 cursor-pointer"
                  >
                    <span>Enter Client Portal</span>
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>

              {/* ================= 2. SECURITY SOC PORTAL CARD ================= */}
              <div className="relative rounded-3xl bg-gradient-to-b from-[#0b1632] via-[#081024] to-[#050b1a] border-2 border-[#1e3a8a] hover:border-[#00f2fe] transition-all p-7 md:p-9 shadow-2xl flex flex-col justify-between group">
                <div className="absolute top-5 right-5 px-3 py-1 rounded-full bg-[#00f2fe]/15 border border-[#00f2fe]/30 text-[#00f2fe] text-xs font-mono font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#00f2fe] animate-pulse"></span>
                  PORTAL 02
                </div>

                <div className="space-y-6">
                  {/* Title & Badge */}
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#1d4ed8] to-[#00f2fe] flex items-center justify-center shadow-lg shadow-[#00f2fe]/25 text-white shrink-0">
                      <Terminal size={30} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-white flex items-center gap-2">
                        SECURITY PORTAL <span className="text-[#00f2fe] font-mono text-sm">(SOC)</span>
                      </h2>
                      <p className="text-xs text-[#38bdf8] font-mono">For Cybersecurity Defense & SOC Analysts</p>
                    </div>
                  </div>

                  <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                    A high-density, professional Security Operations Center console designed for triage, threat telemetry, 10-stage investigations, and containment actions.
                  </p>

                  {/* Feature Highlights */}
                  <div className="space-y-2.5 bg-[#040916]/80 rounded-2xl p-4 border border-[#162754]">
                    <div className="text-[11px] font-mono text-[#00f2fe] uppercase tracking-wider font-bold">
                      Key SOC Capabilities
                    </div>
                    <ul className="text-xs text-slate-300 space-y-1.5">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-[#00f2fe] shrink-0" />
                        <span>10-Stage Incident Lifecycle & Containment Checklist</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-[#00f2fe] shrink-0" />
                        <span>SLA Monitoring Radar (Critical 15m, High 1h, Med 4h)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-[#00f2fe] shrink-0" />
                        <span>Threat Intel & IOC Registry (IPs, Domains, Hashes)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Lock size={14} className="text-[#fbbf24] shrink-0" />
                        <span className="text-[#fde68a]">Confidential Internal SOC Notes & Immutable Audit Trail</span>
                      </li>
                    </ul>
                  </div>

                  {/* Dynamic Database Metrics Preview */}
                  <div className="grid grid-cols-4 gap-2 pt-1 font-mono">
                    <div className="bg-[#050f24] rounded-xl p-2.5 border border-[#162852] text-center">
                      <div className="text-[9px] text-slate-400">OPEN</div>
                      <div className="text-lg font-black text-[#00f2fe]">{socStats.open}</div>
                    </div>
                    <div className="bg-[#050f24] rounded-xl p-2.5 border border-[#ef4444]/40 text-center">
                      <div className="text-[9px] text-[#ef4444]">CRITICAL</div>
                      <div className="text-lg font-black text-[#ef4444]">{socStats.critical}</div>
                    </div>
                    <div className="bg-[#050f24] rounded-xl p-2.5 border border-[#f97316]/40 text-center">
                      <div className="text-[9px] text-[#f97316]">HIGH</div>
                      <div className="text-lg font-black text-[#f97316]">{socStats.high}</div>
                    </div>
                    <div className="bg-[#050f24] rounded-xl p-2.5 border border-[#162852] text-center">
                      <div className="text-[9px] text-slate-400">INVESTIGATE</div>
                      <div className="text-lg font-black text-[#e2e8f0]">{socStats.underInvestigation}</div>
                    </div>
                  </div>
                </div>

                {/* Actions & Instant Launch */}
                <div className="mt-8 pt-6 border-t border-[#162754] space-y-3">
                  <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                    Instant 1-Click Launch As:
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => handleQuickEnter('alex.rivera@cybershield.soc', 'security', '/security/dashboard')}
                      className="px-2.5 py-2.5 rounded-xl bg-[#091533] hover:bg-[#102252] border border-[#1b3473] text-left transition-all cursor-pointer group/btn"
                    >
                      <div className="text-xs font-bold text-white group-hover/btn:text-[#00f2fe] truncate">Alex Rivera</div>
                      <div className="text-[10px] text-slate-400 truncate">SOC Analyst</div>
                    </button>
                    <button
                      onClick={() => handleQuickEnter('marcus.vance@cybershield.soc', 'security', '/security/dashboard')}
                      className="px-2.5 py-2.5 rounded-xl bg-[#091533] hover:bg-[#102252] border border-[#1b3473] text-left transition-all cursor-pointer group/btn"
                    >
                      <div className="text-xs font-bold text-white group-hover/btn:text-[#00f2fe] truncate">Marcus Vance</div>
                      <div className="text-[10px] text-slate-400 truncate">Sec Manager</div>
                    </button>
                    <button
                      onClick={() => handleQuickEnter('elena.rostova@cybershield.soc', 'security', '/security/admin/users')}
                      className="px-2.5 py-2.5 rounded-xl bg-[#091533] hover:bg-[#102252] border border-[#1b3473] text-left transition-all cursor-pointer group/btn"
                    >
                      <div className="text-xs font-bold text-white group-hover/btn:text-[#00f2fe] truncate">Elena Rostova</div>
                      <div className="text-[10px] text-slate-400 truncate">SOC Admin</div>
                    </button>
                  </div>

                  <Link
                    href="/security/dashboard"
                    className="w-full py-3.5 bg-gradient-to-r from-[#0052d4] via-[#4364f7] to-[#00f2fe] hover:opacity-95 text-[#070d1e] font-extrabold text-sm rounded-xl shadow-lg shadow-[#00f2fe]/20 flex items-center justify-center gap-2 transition-all mt-2 cursor-pointer font-mono"
                  >
                    <span>ENTER SECURITY SOC CONSOLE</span>
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ================= SIDE-BY-SIDE DUAL COMPARISON TAB ================= */
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl md:text-3xl font-black text-white">
                Live Dual Portal Comparison: Same Incident, Different Perspectives
              </h2>
              <p className="text-xs md:text-sm text-slate-400 max-w-2xl mx-auto">
                Comparing Incident <span className="font-mono text-[#00f2fe] font-bold">INC-2026-001 (Spear Phishing Campaign)</span> in real-time. Notice how internal forensic notes, IOC technical attribution, and playbooks are strictly hidden from the Client view.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left: Client View Simulation */}
              <div className="rounded-2xl bg-[#0e2433] border border-[#164e63] p-5 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-[#164e63] pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#14b8a6]"></span>
                    <span className="font-bold text-sm text-[#2dd4bf]">CLIENT PERSPECTIVE (Morgan Lee)</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#14b8a6]/15 text-[#2dd4bf]">
                    Tenant Isolated
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-[#06141d] rounded-xl border border-[#143d4d] space-y-1">
                    <div className="text-[10px] text-slate-400 uppercase font-mono">Incident Status</div>
                    <div className="font-bold text-white text-sm">Investigating · High Priority</div>
                    <div className="text-[11px] text-slate-300">
                      Our cybersecurity analysts have triaged your report and have contained the affected accounts.
                    </div>
                  </div>

                  <div className="p-3 bg-[#06141d] rounded-xl border border-[#143d4d] space-y-1.5">
                    <div className="text-[10px] text-slate-400 uppercase font-mono">Client Communication Stream</div>
                    <div className="p-2 rounded bg-[#0b2230] text-slate-200">
                      <span className="text-[#2dd4bf] font-bold">Alex Rivera (SOC):</span> &quot;We have detected the credential harvesting email and blocked the sender domain across your mail gateway.&quot;
                    </div>
                  </div>

                  <div className="p-3 bg-[#331114]/50 rounded-xl border border-[#ef4444]/40 flex items-center gap-2.5 text-[#fca5a5]">
                    <EyeOff size={16} className="shrink-0 text-[#ef4444]" />
                    <span className="text-[11px]">
                      <strong>Internal SOC findings hidden:</strong> Client users cannot see analyst notes, MITRE ATT&CK tags, raw shell actions, or malware signatures.
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleQuickEnter('morgan.lee@acme.com', 'client', '/incidents/INC-2026-001')}
                  className="w-full py-2.5 bg-[#0f766e] hover:bg-[#115e59] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2"
                >
                  <span>Open Full Incident in Client Portal</span>
                  <ArrowRight size={14} />
                </button>
              </div>

              {/* Right: SOC View Simulation */}
              <div className="rounded-2xl bg-[#09142b] border border-[#1e3a8a] p-5 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-[#1e3a8a] pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#00f2fe] animate-pulse"></span>
                    <span className="font-bold text-sm text-[#00f2fe] font-mono">SOC CONSOLE PERSPECTIVE (Alex Rivera)</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#00f2fe]/15 text-[#00f2fe]">
                    Full SOC Clearance
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-[#040b18] rounded-xl border border-[#192f66] space-y-1 font-mono">
                    <div className="text-[10px] text-slate-400 uppercase">10-Stage Lifecycle Stage</div>
                    <div className="font-bold text-[#00f2fe] text-sm">STAGE 07: ERADICATION (Risk Score: 88/100)</div>
                    <div className="text-[11px] text-slate-300">
                      SLA Threshold: 1h deadline · Time remaining: 24 mins. Host isolation active.
                    </div>
                  </div>

                  <div className="p-3 bg-[#040b18] rounded-xl border border-[#192f66] space-y-1.5 font-mono">
                    <div className="text-[10px] text-slate-400 uppercase">Confidential Internal SOC Note</div>
                    <div className="p-2 rounded bg-[#1c1809] border border-[#eab308]/40 text-[#fde047]">
                      <span className="font-bold">[CONFIDENTIAL // SOC ONLY]:</span> Correlated C2 IP 198.51.100.42 with Cobalt Strike beaconing. Revoked session tokens for 4 finance identities.
                    </div>
                  </div>

                  <div className="p-3 bg-[#040b18] rounded-xl border border-[#192f66] space-y-1 font-mono">
                    <div className="text-[10px] text-slate-400 uppercase">Extracted IOC Telemetry</div>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="px-2 py-0.5 rounded bg-[#00f2fe]/10 text-[#00f2fe] text-[10px] border border-[#00f2fe]/30">IP: 198.51.100.42</span>
                      <span className="px-2 py-0.5 rounded bg-[#00f2fe]/10 text-[#00f2fe] text-[10px] border border-[#00f2fe]/30">Domain: secure-acme-auth.top</span>
                      <span className="px-2 py-0.5 rounded bg-[#00f2fe]/10 text-[#00f2fe] text-[10px] border border-[#00f2fe]/30">Hash: 8f4b...3a1c</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleQuickEnter('alex.rivera@cybershield.soc', 'security', '/security/incidents/INC-2026-001')}
                  className="w-full py-2.5 bg-[#1d4ed8] hover:bg-[#1e40af] text-white font-mono font-bold text-xs rounded-xl flex items-center justify-center gap-2"
                >
                  <span>Open Full Investigation in SOC Console</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer Branding */}
      <footer className="border-t border-[#14234b] py-4 px-6 text-center text-xs text-slate-500 font-mono flex flex-col sm:flex-row items-center justify-between gap-2">
        <div>
          🛡️ CyberShield Enterprise Incident Response & SOC Platform
        </div>
        <div className="flex items-center gap-4 text-slate-400">
          <Link href="/login" className="hover:text-[#2dd4bf] transition-colors">Client Portal</Link>
          <span>·</span>
          <Link href="/security/login" className="hover:text-[#00f2fe] transition-colors">Security SOC Console</Link>
          <span>·</span>
          <span className="text-[#10b981]">Backend: Supabase PostgreSQL</span>
        </div>
      </footer>
    </div>
  );
};
