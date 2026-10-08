import React, { useState, useMemo } from 'react';
import { Link, useSearch } from 'wouter';
import {
  Search,
  Filter,
  ArrowRight,
  ShieldAlert,
  Clock,
  Layers,
  Terminal,
  AlertOctagon,
  Building,
  User,
  SlidersHorizontal,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { dataService } from '@/lib/data-service';
import type { Incident } from '@/types';

export const SecurityIncidentQueue: React.FC = () => {
  const { currentUser } = useAuth();
  const searchParams = new URLSearchParams(useSearch());

  const initialSev = searchParams.get('severity') || '';
  const initialStatus = searchParams.get('status') || '';

  const incidents = dataService.getIncidents(currentUser);
  const users = dataService.getUsers();
  const analysts = users.filter((u) => u.portal_type === 'security');
  const orgs = dataService.getOrganizations().filter((o) => o.slug !== 'cybershield-soc');

  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState(initialSev);
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [orgFilter, setOrgFilter] = useState('');
  const [analystFilter, setAnalystFilter] = useState('');
  const [minRiskScore, setMinRiskScore] = useState(0);

  const filtered = useMemo(() => {
    const now = Date.now();
    return incidents.filter((inc) => {
      if (severityFilter && inc.severity !== severityFilter) return false;
      if (statusFilter && inc.status !== statusFilter) return false;
      if (categoryFilter && inc.category !== categoryFilter) return false;
      if (orgFilter && inc.organizationName !== orgFilter) return false;
      if (analystFilter && inc.assignedTo !== analystFilter) return false;
      if (inc.riskScore < minRiskScore) return false;

      if (search.trim()) {
        const q = search.toLowerCase();
        const matches =
          inc.incidentNumber.toLowerCase().includes(q) ||
          inc.title.toLowerCase().includes(q) ||
          inc.organizationName.toLowerCase().includes(q) ||
          inc.category.toLowerCase().includes(q) ||
          inc.reporter.toLowerCase().includes(q) ||
          (inc.assignedTo && inc.assignedTo.toLowerCase().includes(q));
        if (!matches) return false;
      }
      return true;
    });
  }, [incidents, search, severityFilter, statusFilter, categoryFilter, orgFilter, analystFilter, minRiskScore]);

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
      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#111e3f] text-[#cbd5e1] border border-[#1d356c]">
        {status.replace(/_/g, ' ')}
      </span>
    );
  };

  const getSlaIndicator = (slaDate: string) => {
    const diff = new Date(slaDate).getTime() - Date.now();
    if (diff < 0) {
      return <span className="text-[#ef4444] font-bold">BREACHED</span>;
    }
    const mins = Math.floor(diff / (60 * 1000));
    if (mins < 60) {
      return <span className="text-[#f97316] font-bold">{mins}m left</span>;
    }
    const hours = Math.floor(mins / 60);
    return <span className="text-[#10b981]">{hours}h {mins % 60}m</span>;
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#14234b] pb-4">
        <div>
          <div className="text-[10px] font-mono text-[#00f2fe] uppercase tracking-widest">
            INCIDENT MANAGEMENT // ACTIVE SOC DISPATCH
          </div>
          <h1 className="text-2xl font-bold font-mono text-white tracking-tight mt-1">
            INCIDENT QUEUE
          </h1>
          <p className="text-xs text-[#64748b] font-mono mt-0.5">
            Cross-tenant defensive incident intake, risk stratification, and assignment command.
          </p>
        </div>

        <div className="text-xs font-mono text-[#94a3b8] flex items-center gap-2">
          <span>Active Filtered:</span>
          <span className="text-[#00f2fe] font-bold text-sm">{filtered.length}</span>
          <span>of {incidents.length}</span>
        </div>
      </div>

      {/* Multi-Filter SOC Toolbar (SECTION 9 SPECIFICATION) */}
      <div className="bg-[#091226] border border-[#14234b] rounded-xl p-4 shadow-xl space-y-3 font-mono">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          
          {/* Search */}
          <div className="relative md:col-span-2">
            <Search size={14} className="absolute left-3 top-3 text-[#475569]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search reference, org, reporter, title, payload..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-[#050b1a] border border-[#1b3470] rounded-lg text-white placeholder-[#475569] outline-none focus:border-[#00f2fe]"
            />
          </div>

          {/* Severity */}
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-[#050b1a] border border-[#1b3470] rounded-lg text-[#94a3b8] outline-none focus:border-[#00f2fe]"
          >
            <option value="">All Severities</option>
            <option value="CRITICAL">CRITICAL</option>
            <option value="HIGH">HIGH</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="LOW">LOW</option>
          </select>

          {/* Status */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-[#050b1a] border border-[#1b3470] rounded-lg text-[#94a3b8] outline-none focus:border-[#00f2fe]"
          >
            <option value="">All Statuses</option>
            <option value="NEW">NEW</option>
            <option value="TRIAGED">TRIAGED</option>
            <option value="ASSIGNED">ASSIGNED</option>
            <option value="INVESTIGATING">INVESTIGATING</option>
            <option value="CONTAINED">CONTAINED</option>
            <option value="RESOLVED">RESOLVED</option>
            <option value="CLOSED">CLOSED</option>
            <option value="ESCALATED">ESCALATED</option>
          </select>
        </div>

        {/* Row 2 Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3 pt-2 border-t border-[#122046]">
          {/* Organization */}
          <select
            value={orgFilter}
            onChange={(e) => setOrgFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-[#050b1a] border border-[#1b3470] rounded-lg text-[#94a3b8] outline-none focus:border-[#00f2fe]"
          >
            <option value="">All Organizations</option>
            {orgs.map((o) => (
              <option key={o.id} value={o.name}>{o.name}</option>
            ))}
          </select>

          {/* Category */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-[#050b1a] border border-[#1b3470] rounded-lg text-[#94a3b8] outline-none focus:border-[#00f2fe]"
          >
            <option value="">All Categories</option>
            <option value="Phishing">Phishing</option>
            <option value="Malware / Ransomware">Malware / Ransomware</option>
            <option value="Unauthorized Access">Unauthorized Access</option>
            <option value="Account Compromise">Account Compromise</option>
            <option value="Data Exposure / Leak">Data Exposure / Leak</option>
            <option value="Lost or Stolen Device">Lost or Stolen Device</option>
          </select>

          {/* Assigned Analyst */}
          <select
            value={analystFilter}
            onChange={(e) => setAnalystFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-[#050b1a] border border-[#1b3470] rounded-lg text-[#94a3b8] outline-none focus:border-[#00f2fe]"
          >
            <option value="">All Analysts</option>
            {analysts.map((a) => (
              <option key={a.id} value={a.full_name}>{a.full_name}</option>
            ))}
          </select>

          {/* Min Risk Score */}
          <div className="flex items-center gap-2 bg-[#050b1a] border border-[#1b3470] rounded-lg px-3 py-1.5 text-xs">
            <span className="text-[#64748b] text-[11px] whitespace-nowrap">Min Risk:</span>
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={minRiskScore}
              onChange={(e) => setMinRiskScore(Number(e.target.value))}
              className="w-full accent-[#00f2fe]"
            />
            <span className="text-[#00f2fe] font-bold w-6 text-right">{minRiskScore}</span>
          </div>
        </div>
      </div>

      {/* Incident Queue Table */}
      <div className="bg-[#091226] border border-[#14234b] rounded-xl shadow-xl overflow-hidden font-mono">
        {filtered.length === 0 ? (
          <div className="p-16 text-center text-xs text-[#64748b] space-y-2">
            <div>No security incidents found matching your query filters.</div>
            <button
              onClick={() => {
                setSearch('');
                setSeverityFilter('');
                setStatusFilter('');
                setCategoryFilter('');
                setOrgFilter('');
                setAnalystFilter('');
                setMinRiskScore(0);
              }}
              className="text-[#00f2fe] font-bold hover:underline"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0c1836] text-[10px] uppercase text-[#64748b] border-b border-[#14234b]">
                <tr>
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">ORGANIZATION</th>
                  <th className="py-3 px-4">TYPE</th>
                  <th className="py-3 px-4">SEVERITY</th>
                  <th className="py-3 px-4">STATUS</th>
                  <th className="py-3 px-4">ANALYST</th>
                  <th className="py-3 px-4">SLA</th>
                  <th className="py-3 px-4">RISK</th>
                  <th className="py-3 px-4 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#101e40]">
                {filtered.map((inc) => (
                  <tr key={inc.id} className="hover:bg-[#0d1a3b] transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[#38bdf8] whitespace-nowrap">
                      {inc.incidentNumber}
                    </td>
                    <td className="py-3.5 px-4 text-white font-semibold whitespace-nowrap">
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
                    <td className="py-3.5 px-4 text-[#94a3b8]">
                      {inc.assignedTo || <span className="text-[#64748b]">Unassigned</span>}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[11px]">
                      {getSlaIndicator(inc.slaDueAt)}
                    </td>
                    <td className="py-3.5 px-4 font-bold">
                      <span className={inc.riskScore >= 80 ? 'text-[#ef4444]' : inc.riskScore >= 60 ? 'text-[#f97316]' : 'text-[#eab308]'}>
                        {inc.riskScore}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/security/incidents/${inc.id}`}
                        className="px-2.5 py-1 text-[11px] font-bold text-[#00f2fe] bg-[#00f2fe]/10 hover:bg-[#00f2fe]/20 rounded border border-[#00f2fe]/30 transition-colors inline-block whitespace-nowrap"
                      >
                        OPEN WORKSPACE →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
