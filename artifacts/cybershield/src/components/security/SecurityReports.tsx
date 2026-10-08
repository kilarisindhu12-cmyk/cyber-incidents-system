import React from 'react';
import { Download, FileCheck2, ShieldCheck, Printer, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { dataService } from '@/lib/data-service';

export const SecurityReports: React.FC = () => {
  const { currentUser } = useAuth();
  const incidents = dataService.getIncidents(currentUser);
  const stats = dataService.getDashboardStats(currentUser);

  return (
    <div className="space-y-6 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#14234b] pb-4">
        <div>
          <div className="text-[10px] uppercase text-[#00f2fe] tracking-widest">
            OPERATIONAL COMPLIANCE & INCIDENT ARCHIVES
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            SOC EXECUTIVE REPORTS & AUDIT ARCHIVES
          </h1>
          <p className="text-xs text-[#64748b] mt-0.5">
            Formal incident containment reports, SLA breach disclosures, and forensics.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-[#00f2fe] hover:bg-[#38bdf8] text-[#070d1e] font-bold text-xs rounded-lg flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Printer size={15} />
          <span>Print / Export PDF</span>
        </button>
      </div>

      {/* Summary Box */}
      <div className="bg-[#091226] border border-[#14234b] rounded-xl p-6 shadow-xl space-y-4">
        <h2 className="text-sm font-bold text-white uppercase flex items-center gap-2">
          <FileCheck2 size={16} className="text-[#00f2fe]" />
          <span>INCIDENT REPORT PORTFOLIO</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-[#060c1d] border border-[#172d5c]">
            <div className="text-[10px] text-[#64748b] uppercase">TOTAL RECORDED INCIDENTS</div>
            <div className="text-2xl font-bold text-white mt-1">{stats.total}</div>
          </div>
          <div className="p-4 rounded-xl bg-[#060c1d] border border-[#172d5c]">
            <div className="text-[10px] text-[#64748b] uppercase">RESOLVED CASES</div>
            <div className="text-2xl font-bold text-[#10b981] mt-1">{stats.resolved}</div>
          </div>
          <div className="p-4 rounded-xl bg-[#060c1d] border border-[#172d5c]">
            <div className="text-[10px] text-[#64748b] uppercase">SLA COMPLIANCE</div>
            <div className="text-2xl font-bold text-[#00f2fe] mt-1">98.5%</div>
          </div>
        </div>
      </div>

      {/* Incident Case Report Archive */}
      <div className="bg-[#091226] border border-[#14234b] rounded-xl shadow-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-[#14234b]">
          <h2 className="text-sm font-bold text-white">ALL CASE DOSSIERS ({incidents.length})</h2>
        </div>

        <div className="divide-y divide-[#101e40]">
          {incidents.map((inc) => (
            <div key={inc.id} className="p-5 hover:bg-[#0c1836] transition-colors space-y-2 text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#38bdf8]">{inc.incidentNumber}</span>
                  <span className="text-[#64748b]">·</span>
                  <span className="text-white font-bold">{inc.organizationName}</span>
                  <span className="text-[#64748b]">·</span>
                  <span className="text-[#94a3b8]">{inc.category}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    inc.severity === 'CRITICAL' ? 'bg-[#ef4444]/20 text-[#ef4444]' : 'bg-[#f97316]/20 text-[#f97316]'
                  }`}>
                    {inc.severity}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-[#1e293b] text-[#cbd5e1]">
                    {inc.status}
                  </span>
                </div>
              </div>

              <div className="text-white font-bold text-sm">{inc.title}</div>
              <p className="text-[#94a3b8] text-[11px] line-clamp-2">{inc.description}</p>

              <div className="flex flex-wrap items-center gap-4 text-[10px] text-[#64748b] pt-1">
                <span>Reporter: <strong>{inc.reporter}</strong></span>
                <span>Analyst: <strong>{inc.assignedTo || 'Unassigned'}</strong></span>
                <span>Risk Score: <strong>{inc.riskScore}/100</strong></span>
                <span>Created: <strong>{new Date(inc.createdAt).toLocaleString()}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
