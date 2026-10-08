import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download, ShieldCheck, TrendingDown, Clock, ShieldAlert, Award } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { dataService } from '@/lib/data-service';

export const ClientReports: React.FC = () => {
  const { currentUser } = useAuth();
  const incidents = dataService.getIncidents(currentUser);
  const stats = dataService.getDashboardStats(currentUser);

  const categoryData = stats.categories.map((c) => ({
    name: c.name,
    count: c.count,
  }));

  const severityData = [
    { name: 'Critical', value: stats.severities.CRITICAL, color: '#ef4444' },
    { name: 'High', value: stats.severities.HIGH, color: '#f97316' },
    { name: 'Medium', value: stats.severities.MEDIUM, color: '#eab308' },
    { name: 'Low', value: stats.severities.LOW, color: '#10b981' },
  ].filter((s) => s.value > 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#152e36] tracking-tight">Organization Security Reports</h1>
          <p className="text-xs text-[#6e838b] mt-1">
            Executive metrics and compliance posture for <strong>{currentUser?.organization_name}</strong>.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-white border border-[#c9dcd6] hover:bg-[#f2faf7] text-[#14705c] text-xs font-bold rounded-xl shadow-xs flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Download size={14} />
          <span>Export Compliance Summary</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-[#dfe7e9] rounded-xl p-5 shadow-xs">
          <div className="text-xs font-semibold text-[#687f87]">Average SOC Triage Time</div>
          <div className="text-2xl font-black text-[#14705c] mt-2 font-mono">14.2 min</div>
          <div className="text-[11px] text-[#10b981] mt-1 flex items-center gap-1">
            <TrendingDown size={13} /> 22% faster than SLA requirement
          </div>
        </div>

        <div className="bg-white border border-[#dfe7e9] rounded-xl p-5 shadow-xs">
          <div className="text-xs font-semibold text-[#687f87]">Remediation Rate</div>
          <div className="text-2xl font-black text-[#0284c7] mt-2 font-mono">
            {stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 100}%
          </div>
          <div className="text-[11px] text-[#0284c7] mt-1 flex items-center gap-1">
            <ShieldCheck size={13} /> High containment efficacy
          </div>
        </div>

        <div className="bg-white border border-[#dfe7e9] rounded-xl p-5 shadow-xs">
          <div className="text-xs font-semibold text-[#687f87]">CyberShield SLA Compliance</div>
          <div className="text-2xl font-black text-[#10b981] mt-2 font-mono">98.5%</div>
          <div className="text-[11px] text-[#64748b] mt-1">Target contract threshold: 95.0%</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Category Breakdown */}
        <div className="bg-white border border-[#dfe7e9] rounded-xl p-6 shadow-xs">
          <h2 className="text-sm font-bold text-[#1a333c] mb-1">Incidents by Category</h2>
          <p className="text-[11px] text-[#71878f] mb-4">Frequency of threat vectors across your organization</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <XAxis type="number" stroke="#94a3b8" fontSize={11} />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={11} width={120} />
                <Tooltip />
                <Bar dataKey="count" fill="#167e68" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Severity Distribution */}
        <div className="bg-white border border-[#dfe7e9] rounded-xl p-6 shadow-xs">
          <h2 className="text-sm font-bold text-[#1a333c] mb-1">Severity Distribution</h2>
          <p className="text-[11px] text-[#71878f] mb-4">Risk stratification of reported events</p>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={severityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }: { name?: string; percent?: number }) => `${name ?? ''} (${((percent ?? 0) * 100).toFixed(0)}%)`}
                >
                  {severityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Compliance / SLA Summary Box */}
      <div className="bg-white border border-[#dfe7e9] rounded-xl p-6 shadow-xs">
        <h2 className="text-sm font-bold text-[#1a333c] mb-2">SOC Operational SLA Guarantees</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs pt-2">
          <div className="p-3 bg-[#fef2f2] rounded-lg border border-[#fecaca]">
            <div className="text-[10px] font-mono text-[#dc2626] uppercase font-bold">CRITICAL SLA</div>
            <div className="text-lg font-black text-[#991b1b] mt-1 font-mono">15 minutes</div>
            <div className="text-[10px] text-[#b91c1c] mt-0.5">Response & containment kickoff</div>
          </div>
          <div className="p-3 bg-[#fff7ed] rounded-lg border border-[#fed7aa]">
            <div className="text-[10px] font-mono text-[#ea580c] uppercase font-bold">HIGH SLA</div>
            <div className="text-lg font-black text-[#c2410c] mt-1 font-mono">1 hour</div>
            <div className="text-[10px] text-[#9a3412] mt-0.5">Analyst triage & isolation</div>
          </div>
          <div className="p-3 bg-[#fefce8] rounded-lg border border-[#fef08a]">
            <div className="text-[10px] font-mono text-[#ca8a04] uppercase font-bold">MEDIUM SLA</div>
            <div className="text-lg font-black text-[#a16207] mt-1 font-mono">4 hours</div>
            <div className="text-[10px] text-[#854d0e] mt-0.5">Remediation roadmap</div>
          </div>
          <div className="p-3 bg-[#f0fdf4] rounded-lg border border-[#bbf7d0]">
            <div className="text-[10px] font-mono text-[#16a34a] uppercase font-bold">LOW SLA</div>
            <div className="text-lg font-black text-[#15803d] mt-1 font-mono">24 hours</div>
            <div className="text-[10px] text-[#166534] mt-0.5">Review & ticket closure</div>
          </div>
        </div>
      </div>
    </div>
  );
};
