import React from 'react';
import { Link } from 'wouter';
import {
  ShieldAlert,
  AlertOctagon,
  Clock,
  Activity,
  Layers,
  ArrowRight,
  TrendingUp,
  Fingerprint,
  Radio,
  CheckCircle2,
  Terminal,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { dataService } from '@/lib/data-service';
import type { Incident } from '@/types';

export const SecurityDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  
  // Real database stats - NO fake hardcoded numbers!
  const stats = dataService.getDashboardStats(currentUser);
  const incidents = dataService.getIncidents(currentUser);
  const iocs = dataService.getIocs();

  const activeIncidents = [...incidents]
    .filter((i) => !['RESOLVED', 'CLOSED'].includes(i.status))
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, 6);

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'CRITICAL':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#ef4444]/20 text-[#ef4444] border border-[#ef4444]/40">CRITICAL</span>;
      case 'HIGH':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#f97316]/20 text-[#f97316] border border-[#f97316]/40">HIGH</span>;
      case 'MEDIUM':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#eab308]/20 text-[#eab308] border border-[#eab308]/40">MEDIUM</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#38bdf8]/20 text-[#38bdf8] border border-[#38bdf8]/40">LOW</span>;
    }
  };

  const getStatusBadge = (status: string) => {
    return (
      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#1e293b] text-[#94a3b8] border border-[#334155]">
        {status.replace(/_/g, ' ')}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Title & SOC Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#14234b] pb-5">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-widest text-[#00f2fe] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00f2fe] animate-pulse"></span>
            LIVE OPERATIONS STREAM
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1 font-mono">
            CYBERSHIELD SOC
          </h1>
          <p className="text-xs text-[#64748b] font-mono mt-0.5">
            Security Operations Center // Incident Triage, Threat Detection, and Response Command
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/security/incidents"
            className="px-4 py-2 bg-[#00f2fe] hover:bg-[#38bdf8] text-[#070d1e] font-mono text-xs font-bold rounded-lg shadow-lg shadow-[#00f2fe]/20 flex items-center gap-2 transition-all"
          >
            <Layers size={14} />
            <span>INCIDENT QUEUE</span>
          </Link>
        </div>
      </div>

      {/* SLA Alert Ticker if breached or approaching */}
      {(stats.slaBreached > 0 || stats.slaApproaching > 0) && (
        <div className="p-3.5 rounded-xl bg-[#ef4444]/10 border border-[#ef4444]/40 flex items-center justify-between text-xs font-mono text-[#fca5a5]">
          <div className="flex items-center gap-2.5">
            <AlertOctagon size={16} className="text-[#ef4444] animate-pulse shrink-0" />
            <span>
              <strong>SLA ALERT:</strong> {stats.slaBreached} incident(s) currently breached SLA. {stats.slaApproaching} approaching deadline within 60 minutes.
            </span>
          </div>
          <Link href="/security/sla" className="text-[#38bdf8] hover:underline font-bold shrink-0">
            View SLA Radar →
          </Link>
        </div>
      )}

      {/* Four Primary Real-Time Cards (SECTION 7 SPECIFICATION) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: OPEN INCIDENTS */}
        <div className="bg-[#0b1633] border border-[#19326b] rounded-xl p-5 shadow-lg relative overflow-hidden">
          <div className="text-xs font-mono tracking-wider uppercase text-[#64748b] font-semibold">
            OPEN INCIDENTS
          </div>
          <div className="text-4xl font-extrabold font-mono text-white mt-3 tracking-tight">
            {stats.open}
          </div>
          <div className="text-[11px] font-mono text-[#38bdf8] mt-2 flex items-center gap-1.5">
            <Activity size={12} /> Active across all tenants
          </div>
          <div className="absolute top-3 right-3 text-[#19326b]">
            <Layers size={28} />
          </div>
        </div>

        {/* Card 2: CRITICAL */}
        <div className="bg-[#0b1633] border border-[#ef4444]/40 rounded-xl p-5 shadow-lg relative overflow-hidden bg-gradient-to-br from-[#0b1633] to-[#25101b]">
          <div className="text-xs font-mono tracking-wider uppercase text-[#ef4444] font-semibold">
            CRITICAL
          </div>
          <div className="text-4xl font-extrabold font-mono text-[#ef4444] mt-3 tracking-tight">
            {stats.critical}
          </div>
          <div className="text-[11px] font-mono text-[#f87171] mt-2 flex items-center gap-1.5">
            <AlertOctagon size={12} /> Needs immediate attention
          </div>
          <div className="absolute top-3 right-3 text-[#ef4444]/30">
            <AlertOctagon size={28} />
          </div>
        </div>

        {/* Card 3: HIGH */}
        <div className="bg-[#0b1633] border border-[#f97316]/40 rounded-xl p-5 shadow-lg relative overflow-hidden">
          <div className="text-xs font-mono tracking-wider uppercase text-[#f97316] font-semibold">
            HIGH
          </div>
          <div className="text-4xl font-extrabold font-mono text-[#f97316] mt-3 tracking-tight">
            {stats.high}
          </div>
          <div className="text-[11px] font-mono text-[#fb923c] mt-2 flex items-center gap-1.5">
            <Radio size={12} /> Elevated risk profile
          </div>
          <div className="absolute top-3 right-3 text-[#f97316]/30">
            <Radio size={28} />
          </div>
        </div>

        {/* Card 4: UNDER INVESTIGATION */}
        <div className="bg-[#0b1633] border border-[#19326b] rounded-xl p-5 shadow-lg relative overflow-hidden">
          <div className="text-xs font-mono tracking-wider uppercase text-[#38bdf8] font-semibold">
            UNDER INVESTIGATION
          </div>
          <div className="text-4xl font-extrabold font-mono text-[#38bdf8] mt-3 tracking-tight">
            {stats.underInvestigation}
          </div>
          <div className="text-[11px] font-mono text-[#64748b] mt-2 flex items-center gap-1.5">
            <Terminal size={12} /> Assigned to SOC responders
          </div>
          <div className="absolute top-3 right-3 text-[#19326b]">
            <Terminal size={28} />
          </div>
        </div>
      </div>

      {/* Main Grid: Priority Incident Triage Table & Threat Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: High Priority Incident Queue */}
        <div className="lg:col-span-2 bg-[#091226] border border-[#14234b] rounded-xl shadow-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-[#14234b] flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                <Terminal size={15} className="text-[#00f2fe]" />
                PRIORITY INCIDENT QUEUE
              </h2>
              <p className="text-[11px] font-mono text-[#64748b]">Real-time queue ranked by risk score & SLA countdown</p>
            </div>
            <Link href="/security/incidents" className="text-xs font-mono text-[#00f2fe] hover:underline flex items-center gap-1">
              FULL QUEUE ({incidents.length}) <ArrowRight size={13} />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#0c1836] text-[10px] uppercase text-[#64748b] border-b border-[#14234b]">
                <tr>
                  <th className="py-3 px-4">REF</th>
                  <th className="py-3 px-4">ORGANIZATION</th>
                  <th className="py-3 px-4">TYPE</th>
                  <th className="py-3 px-4">SEVERITY</th>
                  <th className="py-3 px-4">STATUS</th>
                  <th className="py-3 px-4">RISK</th>
                  <th className="py-3 px-4 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#101e40]">
                {activeIncidents.map((inc) => (
                  <tr key={inc.id} className="hover:bg-[#0d1a3b] transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[#38bdf8]">
                      {inc.incidentNumber}
                    </td>
                    <td className="py-3.5 px-4 text-white font-semibold">
                      {inc.organizationName}
                    </td>
                    <td className="py-3.5 px-4 text-[#94a3b8]">
                      {inc.category}
                    </td>
                    <td className="py-3.5 px-4">
                      {getSeverityBadge(inc.severity)}
                    </td>
                    <td className="py-3.5 px-4">
                      {getStatusBadge(inc.status)}
                    </td>
                    <td className="py-3.5 px-4 font-bold">
                      <span className={inc.riskScore >= 80 ? 'text-[#ef4444]' : inc.riskScore >= 60 ? 'text-[#f97316]' : 'text-[#eab308]'}>
                        {inc.riskScore}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/security/incidents/${inc.id}`}
                        className="px-2.5 py-1 text-[11px] font-bold text-[#00f2fe] bg-[#00f2fe]/10 hover:bg-[#00f2fe]/20 rounded border border-[#00f2fe]/30 transition-colors inline-block"
                      >
                        INVESTIGATE →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Col: Threat Telemetry & Quick IOC Highlights */}
        <div className="space-y-6">
          
          {/* IOC Telemetry Widget */}
          <div className="bg-[#091226] border border-[#14234b] rounded-xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
                <Fingerprint size={15} className="text-[#00f2fe]" />
                ACTIVE THREAT IOCS ({iocs.length})
              </h3>
              <Link href="/security/iocs" className="text-[10px] font-mono text-[#38bdf8] hover:underline">
                Manage
              </Link>
            </div>

            <div className="space-y-2">
              {iocs.slice(0, 4).map((ioc) => (
                <div key={ioc.id} className="p-2.5 rounded-lg bg-[#0c1836] border border-[#172d5e] text-xs font-mono">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-[#38bdf8] font-bold">{ioc.type}</span>
                    <span className="text-[#ef4444] font-bold">{ioc.threatLevel}</span>
                  </div>
                  <div className="text-white font-bold text-[11px] truncate mt-1">{ioc.value}</div>
                  <div className="text-[9px] text-[#64748b] mt-0.5 truncate">{ioc.source}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions Panel */}
          <div className="bg-[#091226] border border-[#14234b] rounded-xl p-5 shadow-xl space-y-3 font-mono">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              OPERATIONAL COMMANDS
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <Link
                href="/security/threat-intelligence"
                className="p-2.5 rounded-lg bg-[#0c1836] border border-[#172d5e] hover:border-[#00f2fe] hover:bg-[#0f224d] text-center text-[#cbd5e1] hover:text-[#00f2fe] transition-all block"
              >
                Threat Intel
              </Link>
              <Link
                href="/security/sla"
                className="p-2.5 rounded-lg bg-[#0c1836] border border-[#172d5e] hover:border-[#00f2fe] hover:bg-[#0f224d] text-center text-[#cbd5e1] hover:text-[#00f2fe] transition-all block"
              >
                SLA Monitor
              </Link>
              <Link
                href="/security/analytics"
                className="p-2.5 rounded-lg bg-[#0c1836] border border-[#172d5e] hover:border-[#00f2fe] hover:bg-[#0f224d] text-center text-[#cbd5e1] hover:text-[#00f2fe] transition-all block"
              >
                Analytics
              </Link>
              <Link
                href="/security/reports"
                className="p-2.5 rounded-lg bg-[#0c1836] border border-[#172d5e] hover:border-[#00f2fe] hover:bg-[#0f224d] text-center text-[#cbd5e1] hover:text-[#00f2fe] transition-all block"
              >
                SOC Reports
              </Link>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
