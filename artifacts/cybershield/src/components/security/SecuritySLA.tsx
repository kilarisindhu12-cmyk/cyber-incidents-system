import React from 'react';
import { Link } from 'wouter';
import { Clock, AlertTriangle, AlertOctagon, CheckCircle2, ShieldAlert, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { dataService } from '@/lib/data-service';

export const SecuritySLA: React.FC = () => {
  const { currentUser } = useAuth();
  const incidents = dataService.getIncidents(currentUser);
  const now = Date.now();

  const openIncidents = incidents.filter((i) => !['RESOLVED', 'CLOSED'].includes(i.status));

  // SLA policies (Section 16 specification)
  const policies = [
    { severity: 'CRITICAL', target: '15 minutes', desc: 'Active containment & triage kickoff', color: '#ef4444' },
    { severity: 'HIGH', target: '1 hour', desc: 'Analyst engagement & host isolation', color: '#f97316' },
    { severity: 'MEDIUM', target: '4 hours', desc: 'Remediation plan & IOC sweep', color: '#eab308' },
    { severity: 'LOW', target: '24 hours', desc: 'Resolution & customer closure', color: '#10b981' },
  ];

  // Classify each open incident
  const classified = openIncidents.map((inc) => {
    const dueTime = new Date(inc.slaDueAt).getTime();
    const diff = dueTime - now;
    let status: 'breached' | 'approaching' | 'within';
    if (diff < 0) {
      status = 'breached';
    } else if (diff <= 60 * 60 * 1000) {
      status = 'approaching';
    } else {
      status = 'within';
    }
    return { ...inc, diff, slaStatus: status };
  });

  const breached = classified.filter((i) => i.slaStatus === 'breached');
  const approaching = classified.filter((i) => i.slaStatus === 'approaching');
  const within = classified.filter((i) => i.slaStatus === 'within');

  return (
    <div className="space-y-6 font-mono">
      {/* Header */}
      <div className="border-b border-[#14234b] pb-4">
        <div className="text-[10px] uppercase text-[#00f2fe] tracking-widest">
          SLA HEALTH & CONTRACTUAL COMPLIANCE MONITOR
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
          SLA MONITORING RADAR
        </h1>
        <p className="text-xs text-[#64748b] mt-0.5">
          Real-time enforcement of service level response thresholds across tenant subscriptions.
        </p>
      </div>

      {/* Target Policy Cards (SECTION 16 SPECIFICATION) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {policies.map((p) => (
          <div key={p.severity} className="bg-[#091226] border border-[#14234b] rounded-xl p-4 shadow-xl">
            <div className="flex items-center justify-between text-xs font-bold" style={{ color: p.color }}>
              <span>{p.severity}</span>
              <Clock size={14} />
            </div>
            <div className="text-2xl font-black text-white mt-2 font-mono">
              {p.target}
            </div>
            <div className="text-[10px] text-[#64748b] mt-1">{p.desc}</div>
          </div>
        ))}
      </div>

      {/* SLA Status Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#091226] border border-[#10b981]/30 rounded-xl p-5 shadow-xl">
          <div className="text-xs text-[#10b981] font-bold flex items-center gap-1.5">
            <CheckCircle2 size={15} /> WITHIN SLA
          </div>
          <div className="text-3xl font-black text-white mt-2">{within.length}</div>
          <div className="text-[11px] text-[#64748b] mt-1">On schedule for target resolution</div>
        </div>

        <div className="bg-[#091226] border border-[#f97316]/30 rounded-xl p-5 shadow-xl">
          <div className="text-xs text-[#f97316] font-bold flex items-center gap-1.5">
            <AlertTriangle size={15} /> APPROACHING SLA
          </div>
          <div className="text-3xl font-black text-[#f97316] mt-2">{approaching.length}</div>
          <div className="text-[11px] text-[#64748b] mt-1">Under 60 minutes remaining</div>
        </div>

        <div className="bg-[#091226] border border-[#ef4444]/40 rounded-xl p-5 shadow-xl bg-gradient-to-br from-[#091226] to-[#25101a]">
          <div className="text-xs text-[#ef4444] font-bold flex items-center gap-1.5">
            <AlertOctagon size={15} /> SLA BREACHED
          </div>
          <div className="text-3xl font-black text-[#ef4444] mt-2">{breached.length}</div>
          <div className="text-[11px] text-[#f87171] mt-1">Contract violation / Manager escalation</div>
        </div>
      </div>

      {/* Active Incidents SLA Breakdown Table */}
      <div className="bg-[#091226] border border-[#14234b] rounded-xl shadow-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-[#14234b] flex items-center justify-between">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Clock size={15} className="text-[#00f2fe]" />
            ACTIVE INCIDENTS SLA STATUS RADAR ({classified.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0c1836] text-[10px] uppercase text-[#64748b] border-b border-[#14234b]">
              <tr>
                <th className="py-3 px-4">REF</th>
                <th className="py-3 px-4">ORGANIZATION</th>
                <th className="py-3 px-4">SEVERITY</th>
                <th className="py-3 px-4">STATUS</th>
                <th className="py-3 px-4">SLA CONDITION</th>
                <th className="py-3 px-4">ANALYST</th>
                <th className="py-3 px-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#101e40]">
              {classified.map((inc) => (
                <tr key={inc.id} className="hover:bg-[#0d1a3b] transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[#38bdf8]">{inc.incidentNumber}</td>
                  <td className="py-3.5 px-4 text-white font-semibold">{inc.organizationName}</td>
                  <td className="py-3.5 px-4 font-bold">
                    <span className={inc.severity === 'CRITICAL' ? 'text-[#ef4444]' : 'text-[#f97316]'}>
                      {inc.severity}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-[#cbd5e1]">{inc.status}</td>
                  <td className="py-3.5 px-4">
                    {inc.slaStatus === 'breached' ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#ef4444]/20 text-[#ef4444] border border-[#ef4444]/40 flex items-center gap-1 w-max">
                        <AlertOctagon size={11} /> SLA BREACHED
                      </span>
                    ) : inc.slaStatus === 'approaching' ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#f97316]/20 text-[#f97316] border border-[#f97316]/40 flex items-center gap-1 w-max">
                        <Clock size={11} /> APPROACHING ({Math.floor(inc.diff / (60 * 1000))}m)
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/40 flex items-center gap-1 w-max">
                        <CheckCircle2 size={11} /> WITHIN SLA
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-[#94a3b8]">{inc.assignedTo || 'Unassigned'}</td>
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      href={`/security/incidents/${inc.id}`}
                      className="px-2 py-1 text-[11px] font-bold text-[#00f2fe] bg-[#00f2fe]/10 hover:bg-[#00f2fe]/20 rounded border border-[#00f2fe]/30"
                    >
                      TRIAGE →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
