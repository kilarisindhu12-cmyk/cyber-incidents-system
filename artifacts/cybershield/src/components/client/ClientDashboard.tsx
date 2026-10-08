import React from 'react';
import { Link } from 'wouter';
import {
  ShieldAlert,
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  MessageSquare,
  FileText,
  LifeBuoy,
  Lock,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { dataService } from '@/lib/data-service';
import type { Incident } from '@/types';

export const ClientDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const incidents = dataService.getIncidents(currentUser);
  const stats = dataService.getDashboardStats(currentUser);

  // Client visible recent incidents
  const recentIncidents = [...incidents]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

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
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#173e4a] via-[#1b505f] to-[#126b58] rounded-2xl p-6 sm:p-8 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-widest text-[#7de5cc] mb-1">
            {currentUser?.organization_name} · Cybersecurity Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Hello, {currentUser?.full_name?.split(' ')[0]}
          </h1>
          <p className="text-xs sm:text-sm text-[#c5e4dc] mt-2 max-w-xl leading-relaxed">
            Report security anomalies immediately. CyberShield SOC analysts are actively monitoring your organization&apos;s perimeter and applications.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/incidents/new"
            className="px-5 py-3 bg-[#10b981] hover:bg-[#059669] text-white text-xs font-bold rounded-xl shadow-lg shadow-[#10b981]/25 flex items-center gap-2 transition-all shrink-0 cursor-pointer"
          >
            <PlusCircle size={17} />
            <span>Report Incident</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards (Real dynamic values) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#dfe7e9] rounded-xl p-5 shadow-xs">
          <div className="text-xs font-semibold text-[#687f87]">Total Reported</div>
          <div className="text-3xl font-black text-[#19333c] mt-2 font-mono">{stats.total}</div>
          <div className="text-[11px] text-[#81969e] mt-1">In your organization</div>
        </div>

        <div className="bg-white border border-[#dfe7e9] rounded-xl p-5 shadow-xs">
          <div className="text-xs font-semibold text-[#687f87]">Active Investigations</div>
          <div className="text-3xl font-black text-[#0284c7] mt-2 font-mono">{stats.open}</div>
          <div className="text-[11px] text-[#0284c7] mt-1 flex items-center gap-1">
            <Clock size={12} /> Under SOC response
          </div>
        </div>

        <div className="bg-white border border-[#dfe7e9] rounded-xl p-5 shadow-xs">
          <div className="text-xs font-semibold text-[#687f87]">Critical Threats</div>
          <div className="text-3xl font-black text-[#dc2626] mt-2 font-mono">{stats.critical}</div>
          <div className="text-[11px] text-[#dc2626] mt-1 flex items-center gap-1">
            <AlertTriangle size={12} /> Urgent prioritization
          </div>
        </div>

        <div className="bg-white border border-[#dfe7e9] rounded-xl p-5 shadow-xs">
          <div className="text-xs font-semibold text-[#687f87]">Resolved & Closed</div>
          <div className="text-3xl font-black text-[#16a34a] mt-2 font-mono">{stats.resolved}</div>
          <div className="text-[11px] text-[#16a34a] mt-1 flex items-center gap-1">
            <CheckCircle2 size={12} /> Remediated
          </div>
        </div>
      </div>

      {/* Two Column Layout: Recent Reports & Security Guidance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Organization Incident Queue */}
        <div className="lg:col-span-2 bg-white border border-[#dfe7e9] rounded-xl shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-[#e6edee] flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-[#1a333c]">Recent Incidents in Your Organization</h2>
              <p className="text-[11px] text-[#71878f]">Track investigation progress and responses from the security team</p>
            </div>
            <Link href="/incidents" className="text-xs font-semibold text-[#14705c] hover:underline flex items-center gap-1">
              View All ({incidents.length}) <ArrowRight size={13} />
            </Link>
          </div>

          {recentIncidents.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#71878f]">
              No incidents reported for your organization. Everything looks clear!
            </div>
          ) : (
            <div className="divide-y divide-[#edf2f3]">
              {recentIncidents.map((inc) => (
                <div key={inc.id} className="p-4 sm:px-6 hover:bg-[#f9fbfb] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] font-mono text-[#71878f] font-semibold">{inc.incidentNumber}</span>
                      {getSeverityBadge(inc.severity)}
                      {getStatusBadge(inc.status)}
                      <span className="text-[11px] text-[#8a9ca2]">· {inc.category}</span>
                    </div>
                    <Link
                      href={`/incidents/${inc.id}`}
                      className="text-xs sm:text-sm font-bold text-[#1a343d] hover:text-[#126b58] transition-colors block line-clamp-1"
                    >
                      {inc.title}
                    </Link>
                    <div className="text-[11px] text-[#71878f] flex items-center gap-3">
                      <span>Reported by: <strong>{inc.reporter}</strong></span>
                      <span>·</span>
                      <span>{new Date(inc.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <Link
                    href={`/incidents/${inc.id}`}
                    className="px-3 py-1.5 text-xs font-semibold text-[#14705c] bg-[#eef7f4] hover:bg-[#e2f2ed] rounded-lg transition-colors flex items-center gap-1 shrink-0 self-start sm:self-auto"
                  >
                    <span>View Status</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Col: Quick Reporting Categories & Security Advice */}
        <div className="space-y-6">
          <div className="bg-white border border-[#dfe7e9] rounded-xl p-5 shadow-xs">
            <h3 className="text-xs font-bold text-[#1a333c] uppercase font-mono tracking-wider mb-3">
              Common Incident Types
            </h3>
            <div className="space-y-2">
              {[
                { title: 'Phishing Email', desc: 'Suspicious email, spoofed sender, credential harvest' },
                { title: 'Malware / Ransomware', desc: 'Pop-ups, encrypted files, slow performance' },
                { title: 'Unauthorized Login', desc: 'MFA notification not requested by you' },
                { title: 'Lost or Stolen Device', desc: 'Laptop, smartphone, security badge' },
                { title: 'Data Exposure', desc: 'Sensitive file sent to wrong external party' },
              ].map((item, idx) => (
                <Link
                  key={idx}
                  href="/incidents/new"
                  className="block p-2.5 rounded-lg border border-[#e8eff1] hover:border-[#a8d5c8] hover:bg-[#f6fbf9] transition-all text-left"
                >
                  <div className="text-xs font-bold text-[#1f3a43]">{item.title}</div>
                  <div className="text-[11px] text-[#778b92] mt-0.5">{item.desc}</div>
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-[#eff8f5] border border-[#cbe8df] rounded-xl p-5 text-xs text-[#1e4e42] space-y-2">
            <div className="flex items-center gap-2 font-bold text-[#136854]">
              <Lock size={15} />
              <span>CyberShield Privacy Guarantee</span>
            </div>
            <p className="text-[11px] text-[#2d5f53] leading-relaxed">
              Your submissions are confidential. Only assigned SOC responders and authorized managers can review incident details. Internal investigation notes are strictly isolated from client viewers.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
