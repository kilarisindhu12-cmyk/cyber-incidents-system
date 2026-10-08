import React, { useState, useMemo } from 'react';
import { Link } from 'wouter';
import {
  Search,
  Filter,
  PlusCircle,
  ArrowRight,
  ShieldAlert,
  Clock,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { dataService } from '@/lib/data-service';

export const ClientIncidentQueue: React.FC = () => {
  const { currentUser } = useAuth();
  const incidents = dataService.getIncidents(currentUser);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const filtered = useMemo(() => {
    return incidents.filter((inc) => {
      if (statusFilter && inc.status !== statusFilter) return false;
      if (severityFilter && inc.severity !== severityFilter) return false;
      if (categoryFilter && inc.category !== categoryFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const matches =
          inc.incidentNumber.toLowerCase().includes(q) ||
          inc.title.toLowerCase().includes(q) ||
          inc.description.toLowerCase().includes(q) ||
          inc.reporter.toLowerCase().includes(q) ||
          inc.category.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [incidents, search, statusFilter, severityFilter, categoryFilter]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'NEW':
      case 'REPORTED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#e0f2fe] text-[#0369a1]">Under Review</span>;
      case 'TRIAGED':
      case 'ASSIGNED':
      case 'INVESTIGATING':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#fef3c7] text-[#92400e]">Investigating</span>;
      case 'CONTAINED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#fef9c3] text-[#854d0e]">Contained</span>;
      case 'RESOLVED':
      case 'CLOSED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#dcfce7] text-[#15803d]">Resolved</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#f1f5f9] text-[#475569]">{status}</span>;
    }
  };

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'CRITICAL':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#fee2e2] text-[#b91c1c]">CRITICAL</span>;
      case 'HIGH':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#ffedd5] text-[#c2410c]">HIGH</span>;
      case 'MEDIUM':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#fef9c3] text-[#a16207]">MEDIUM</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#e0f2fe] text-[#0284c7]">LOW</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#152e36] tracking-tight">Organization Incident Tracking</h1>
          <p className="text-xs text-[#6e838b] mt-1">
            Overview of all reported security incidents within <strong>{currentUser?.organization_name}</strong>.
          </p>
        </div>

        <Link
          href="/incidents/new"
          className="px-4 py-2.5 bg-[#167e68] hover:bg-[#126b58] text-white text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer shadow-xs shrink-0 self-start sm:self-auto"
        >
          <PlusCircle size={15} />
          <span>Report New Incident</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#dfe7e9] rounded-xl p-4 shadow-xs flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-3 text-[#94a5ab]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search reference, title, reporter..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-[#f8fafb] border border-[#d6e0e3] rounded-lg outline-none focus:border-[#167e68]"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 text-xs bg-[#f8fafb] border border-[#d6e0e3] rounded-lg outline-none text-[#334c54]"
        >
          <option value="">All Statuses</option>
          <option value="NEW">Under Review / New</option>
          <option value="TRIAGED">Triaged</option>
          <option value="INVESTIGATING">Investigating</option>
          <option value="CONTAINED">Contained</option>
          <option value="RESOLVED">Resolved</option>
          <option value="CLOSED">Closed</option>
        </select>

        <select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
          className="px-3 py-2 text-xs bg-[#f8fafb] border border-[#d6e0e3] rounded-lg outline-none text-[#334c54]"
        >
          <option value="">All Severities</option>
          <option value="CRITICAL">Critical</option>
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
        </select>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2 text-xs bg-[#f8fafb] border border-[#d6e0e3] rounded-lg outline-none text-[#334c54]"
        >
          <option value="">All Categories</option>
          <option value="Phishing">Phishing</option>
          <option value="Malware / Ransomware">Malware / Ransomware</option>
          <option value="Unauthorized Access">Unauthorized Access</option>
          <option value="Account Compromise">Account Compromise</option>
          <option value="Data Exposure / Leak">Data Exposure / Leak</option>
          <option value="Lost or Stolen Device">Lost or Stolen Device</option>
        </select>

        <div className="text-[11px] font-mono text-[#81959d] ml-auto">
          {filtered.length} {filtered.length === 1 ? 'incident' : 'incidents'}
        </div>
      </div>

      {/* Incident List Table */}
      <div className="bg-white border border-[#dfe7e9] rounded-xl shadow-xs overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#71878f] space-y-2">
            <div>No incidents match your current search and filters.</div>
            <button
              onClick={() => { setSearch(''); setStatusFilter(''); setSeverityFilter(''); setCategoryFilter(''); }}
              className="text-[#167e68] font-bold hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#304851]">
              <thead className="bg-[#f8fafb] text-[10px] font-mono uppercase tracking-wider text-[#798e96] border-b border-[#e2eaec]">
                <tr>
                  <th className="py-3 px-4">Reference</th>
                  <th className="py-3 px-4">Incident Title</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Severity</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Reporter</th>
                  <th className="py-3 px-4">Reported</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#edf2f4]">
                {filtered.map((inc) => (
                  <tr key={inc.id} className="hover:bg-[#f9fbfb] transition-colors">
                    <td className="py-3.5 px-4 font-mono font-semibold text-[#14705c]">
                      {inc.incidentNumber}
                    </td>
                    <td className="py-3.5 px-4">
                      <Link
                        href={`/incidents/${inc.id}`}
                        className="font-bold text-[#18343e] hover:text-[#167e68] transition-colors block line-clamp-1 max-w-sm"
                      >
                        {inc.title}
                      </Link>
                      <div className="text-[10px] text-[#8699a0] mt-0.5">{inc.department}</div>
                    </td>
                    <td className="py-3.5 px-4 text-[#59717a]">{inc.category}</td>
                    <td className="py-3.5 px-4">{getSeverityBadge(inc.severity)}</td>
                    <td className="py-3.5 px-4">{getStatusBadge(inc.status)}</td>
                    <td className="py-3.5 px-4 text-[#59717a] font-medium">{inc.reporter}</td>
                    <td className="py-3.5 px-4 text-[#8699a0] font-mono text-[11px]">
                      {new Date(inc.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/incidents/${inc.id}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-[#167e68] bg-[#ecf7f3] hover:bg-[#dff2ec] rounded-lg transition-colors"
                      >
                        <span>Details</span>
                        <ArrowRight size={11} />
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
