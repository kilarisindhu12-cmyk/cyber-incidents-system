import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts';
import { TrendingUp, Clock, ShieldCheck, AlertTriangle, Layers, Building } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { dataService } from '@/lib/data-service';

export const SecurityAnalytics: React.FC = () => {
  const { currentUser } = useAuth();
  const incidents = dataService.getIncidents(currentUser);
  const stats = dataService.getDashboardStats(currentUser);

  const categoryData = stats.categories;
  const orgData = stats.organizations;

  const severityPie = [
    { name: 'Critical', value: stats.severities.CRITICAL, color: '#ef4444' },
    { name: 'High', value: stats.severities.HIGH, color: '#f97316' },
    { name: 'Medium', value: stats.severities.MEDIUM, color: '#eab308' },
    { name: 'Low', value: stats.severities.LOW, color: '#10b981' },
  ].filter((s) => s.value > 0);

  const trendData = [
    { day: 'Mon', reported: 4, resolved: 3, critical: 1 },
    { day: 'Tue', reported: 6, resolved: 5, critical: 2 },
    { day: 'Wed', reported: 8, resolved: 4, critical: 1 },
    { day: 'Thu', reported: 5, resolved: 6, critical: 0 },
    { day: 'Fri', reported: 9, resolved: 7, critical: 3 },
    { day: 'Sat', reported: 3, resolved: 4, critical: 1 },
    { day: 'Sun', reported: 4, resolved: 3, critical: 0 },
  ];

  return (
    <div className="space-y-6 font-mono">
      {/* Header */}
      <div className="border-b border-[#14234b] pb-4">
        <div className="text-[10px] uppercase text-[#00f2fe] tracking-widest">
          TELEMETRY AGGREGATION & OPERATIONAL METRICS
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
          SECURITY ANALYTICS CONSOLE
        </h1>
        <p className="text-xs text-[#64748b] mt-0.5">
          Stratified incident volume, SLA performance benchmarks, and organizational threat vectors.
        </p>
      </div>

      {/* KPI Benchmarks */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#091226] border border-[#14234b] rounded-xl p-5 shadow-xl">
          <div className="text-xs text-[#64748b] font-bold">AVG TIME TO DETECT (MTTD)</div>
          <div className="text-3xl font-black text-[#00f2fe] mt-2">7.4 min</div>
          <div className="text-[10px] text-[#10b981] mt-1">EDR automated ingestion</div>
        </div>

        <div className="bg-[#091226] border border-[#14234b] rounded-xl p-5 shadow-xl">
          <div className="text-xs text-[#64748b] font-bold">AVG TIME TO RESPOND (MTTR)</div>
          <div className="text-3xl font-black text-[#38bdf8] mt-2">18.6 min</div>
          <div className="text-[10px] text-[#38bdf8] mt-1">Triage to containment kickoff</div>
        </div>

        <div className="bg-[#091226] border border-[#14234b] rounded-xl p-5 shadow-xl">
          <div className="text-xs text-[#64748b] font-bold">OVERALL SLA COMPLIANCE</div>
          <div className="text-3xl font-black text-[#10b981] mt-2">98.5%</div>
          <div className="text-[10px] text-[#64748b] mt-1">Target contract floor: 95.0%</div>
        </div>

        <div className="bg-[#091226] border border-[#14234b] rounded-xl p-5 shadow-xl">
          <div className="text-xs text-[#64748b] font-bold">OPEN VS RESOLVED RATIO</div>
          <div className="text-3xl font-black text-white mt-2">
            {stats.open} : {stats.resolved}
          </div>
          <div className="text-[10px] text-[#a855f7] mt-1">Current response workload</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Incident Trends Over Time */}
        <div className="bg-[#091226] border border-[#14234b] rounded-xl p-6 shadow-xl">
          <h2 className="text-sm font-bold text-white mb-1">INCIDENT MOVEMENT TRENDS (LAST 7 DAYS)</h2>
          <p className="text-[11px] text-[#64748b] mb-4">Reported vs Remediated events with critical spikes</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid stroke="#172b5c" strokeDasharray="3 3" />
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#091226', borderColor: '#172b5c' }} />
                <Line type="monotone" dataKey="reported" stroke="#00f2fe" strokeWidth={2} name="Reported" />
                <Line type="monotone" dataKey="resolved" stroke="#10b981" strokeWidth={2} name="Resolved" />
                <Line type="monotone" dataKey="critical" stroke="#ef4444" strokeWidth={2} name="Critical" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Incidents by Severity Pie */}
        <div className="bg-[#091226] border border-[#14234b] rounded-xl p-6 shadow-xl">
          <h2 className="text-sm font-bold text-white mb-1">SEVERITY STRATIFICATION</h2>
          <p className="text-[11px] text-[#64748b] mb-4">Proportion of high, critical, and routine incidents</p>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={severityPie}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }: { name?: string; percent?: number }) => `${name ?? ''} (${((percent ?? 0) * 100).toFixed(0)}%)`}
                >
                  {severityPie.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#091226', borderColor: '#172b5c' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Incidents by Category */}
        <div className="bg-[#091226] border border-[#14234b] rounded-xl p-6 shadow-xl">
          <h2 className="text-sm font-bold text-white mb-1">THREAT CATEGORY DISTRIBUTION</h2>
          <p className="text-[11px] text-[#64748b] mb-4">Attack vectors observed across customer workloads</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical" margin={{ top: 5, right: 30, left: 30, bottom: 5 }}>
                <XAxis type="number" stroke="#64748b" fontSize={11} />
                <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={11} width={130} />
                <Tooltip contentStyle={{ backgroundColor: '#091226', borderColor: '#172b5c' }} />
                <Bar dataKey="count" fill="#38bdf8" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Incidents by Organization */}
        <div className="bg-[#091226] border border-[#14234b] rounded-xl p-6 shadow-xl">
          <h2 className="text-sm font-bold text-white mb-1">INCIDENTS BY TENANT ORGANIZATION</h2>
          <p className="text-[11px] text-[#64748b] mb-4">Cross-organization exposure and report volume</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={orgData} layout="vertical" margin={{ top: 5, right: 30, left: 30, bottom: 5 }}>
                <XAxis type="number" stroke="#64748b" fontSize={11} />
                <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={11} width={130} />
                <Tooltip contentStyle={{ backgroundColor: '#091226', borderColor: '#172b5c' }} />
                <Bar dataKey="count" fill="#00f2fe" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};
