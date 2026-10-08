import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import {
  Shield,
  Activity,
  Layers,
  AlertOctagon,
  TrendingUp,
  Clock,
  Fingerprint,
  Radio,
  FileCheck2,
  Users,
  Settings,
  ShieldAlert,
  Terminal,
  LogOut,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Bell,
  Menu,
  X,
  Database,
  Lock,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { dataService } from '@/lib/data-service';

export const SecurityLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [location] = useLocation();
  const { currentUser, logout, switchUser, allUsers } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [switchOpen, setSwitchOpen] = useState(false);

  const stats = dataService.getDashboardStats(currentUser);
  const notifications = dataService.getNotifications(currentUser);
  const unreadAlerts = notifications.filter((n) => !n.read).length;

  const isManager = currentUser?.role === 'security_manager' || currentUser?.role === 'soc_admin' || currentUser?.role === 'super_admin';
  const isAdmin = currentUser?.role === 'soc_admin' || currentUser?.role === 'super_admin';

  // Section 8 Navigation Groups
  const navSections = [
    {
      title: 'SOC',
      items: [
        { label: 'SOC Dashboard', href: '/security/dashboard', icon: Activity },
        { label: 'Incident Queue', href: '/security/incidents', icon: Layers, badge: stats.open },
        { label: 'My Investigations', href: '/security/investigations', icon: Terminal },
        { label: 'Critical Incidents', href: '/security/incidents?severity=CRITICAL', icon: AlertOctagon, alertBadge: stats.critical },
        { label: 'Escalations', href: '/security/incidents?status=ESCALATED', icon: Radio },
      ],
    },
    {
      title: 'THREAT OPERATIONS',
      items: [
        { label: 'Threat Intelligence', href: '/security/threat-intelligence', icon: Radio },
        { label: 'IOC Management', href: '/security/iocs', icon: Fingerprint },
        { label: 'Threat Activity', href: '/security/threat-intelligence?tab=activity', icon: Activity },
        { label: 'Security Alerts', href: '/security/alerts', icon: Bell, badge: unreadAlerts },
      ],
    },
    {
      title: 'INCIDENT RESPONSE',
      items: [
        { label: 'Investigations', href: '/security/investigations', icon: Terminal },
        { label: 'Evidence Vault', href: '/security/evidence', icon: Database },
        { label: 'Response Actions', href: '/security/response-actions', icon: ShieldAlert },
        { label: 'Incident Timeline', href: '/security/timeline', icon: Clock },
      ],
    },
    {
      title: 'ANALYTICS',
      items: [
        { label: 'Security Analytics', href: '/security/analytics', icon: TrendingUp },
        { label: 'SLA Monitoring', href: '/security/sla', icon: Clock, alertBadge: stats.slaBreached },
        { label: 'SOC Reports', href: '/security/reports', icon: FileCheck2 },
      ],
    },
    ...(isManager
      ? [
          {
            title: 'MANAGEMENT',
            items: [
              { label: 'SOC Team', href: '/security/admin/team', icon: Users },
              { label: 'Analyst Assignments', href: '/security/admin/assignments', icon: Layers },
              { label: 'Performance & MTTR', href: '/security/admin/performance', icon: TrendingUp },
              { label: 'SLA Policies', href: '/security/admin/sla-settings', icon: Clock },
              { label: 'Executive Reports', href: '/security/admin/mgmt-reports', icon: FileCheck2 },
            ],
          },
        ]
      : []),
    ...(isAdmin
      ? [
          {
            title: 'ADMINISTRATION',
            items: [
              { label: 'User Directory', href: '/security/admin/users', icon: Users },
              { label: 'Client Organizations', href: '/security/admin/organizations', icon: Layers },
              { label: 'Roles & RBAC', href: '/security/admin/roles', icon: Lock },
              { label: 'Security Permissions', href: '/security/admin/permissions', icon: Shield },
              { label: 'Audit Trail Logs', href: '/security/admin/audit-logs', icon: FileCheck2 },
              { label: 'System Settings', href: '/security/admin/settings', icon: Settings },
            ],
          },
        ]
      : []),
  ];

  return (
    <div className="min-h-screen bg-[#070d1e] text-[#cbd5e1] flex font-sans selection:bg-[#00f2fe]/20 selection:text-[#00f2fe]">
      
      {/* SOC Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#091226] border-r border-[#14234b] flex flex-col justify-between transition-transform duration-200 lg:translate-x-0 ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        
        {/* Brand Header */}
        <div className="p-4 border-b border-[#14234b] flex items-center justify-between">
          <Link href="/security/dashboard" className="flex items-center gap-3 decoration-transparent">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0052d4] via-[#4364f7] to-[#00f2fe] text-white flex items-center justify-center shadow-md shadow-[#00f2fe]/20">
              <Shield size={20} strokeWidth={2.5} />
            </div>
            <div>
              <div className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5 font-mono">
                CYBERSHIELD <span className="text-[#00f2fe] text-xs">SOC</span>
              </div>
              <div className="text-[9px] font-mono uppercase tracking-widest text-[#7dd3fc]">
                Security Ops Center
              </div>
            </div>
          </Link>

          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden text-[#64748b] hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Navigation Groups */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin scrollbar-thumb-[#172b5c]">
          {navSections.map((sec, sIdx) => (
            <div key={sIdx} className="space-y-1">
              <div className="px-3 py-1 text-[10px] font-mono tracking-widest uppercase text-[#00f2fe]/70 font-semibold">
                {sec.title}
              </div>
              {sec.items.map((item) => {
                const active = location === item.href || (location.startsWith(item.href) && item.href !== '/security/dashboard');
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-mono transition-all ${
                      active
                        ? 'bg-[#0f2352] text-[#00f2fe] font-bold border-l-2 border-[#00f2fe] shadow-xs'
                        : 'text-[#8ba3bf] hover:text-white hover:bg-[#0c1836]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon size={14} className={active ? 'text-[#00f2fe]' : 'text-[#64748b]'} />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {Boolean(item.badge) && (
                      <span className="px-1.5 py-0.5 text-[9px] font-mono rounded bg-[#1e293b] text-[#38bdf8] border border-[#334155]">
                        {item.badge}
                      </span>
                    )}

                    {Boolean(item.alertBadge) && (
                      <span className="px-1.5 py-0.5 text-[9px] font-mono rounded bg-[#ef4444]/20 text-[#ef4444] border border-[#ef4444]/40 animate-pulse">
                        {item.alertBadge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Operator Profile Footer */}
        <div className="p-3 border-t border-[#14234b] bg-[#070e22]">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse"></div>
              <span className="text-[10px] font-mono text-[#64748b]">TELEMETRY ACTIVE</span>
            </div>
            <Link href="/security/profile" className="text-[10px] font-mono text-[#38bdf8] hover:underline">
              My Profile
            </Link>
          </div>

          <div className="flex items-center justify-between bg-[#0b1735] p-2.5 rounded-xl border border-[#193066]">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-[#142857] text-[#00f2fe] flex items-center justify-center font-mono font-bold text-xs shrink-0 border border-[#1e3d80]">
                {currentUser?.full_name?.split(' ').map((n) => n[0]).join('')}
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-bold text-white truncate font-mono">{currentUser?.full_name}</div>
                <div className="text-[9px] text-[#38bdf8] truncate font-mono">
                  {currentUser?.clearance_level || currentUser?.role?.replace(/_/g, ' ').toUpperCase()}
                </div>
              </div>
            </div>

            <button
              onClick={logout}
              title="Sign Out"
              className="p-1.5 text-[#64748b] hover:text-[#ef4444] hover:bg-[#ef4444]/10 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut size={15} />
            </button>
          </div>

          {/* Quick SOC Tester Trigger */}
          <div className="mt-2 relative">
            <button
              onClick={() => setSwitchOpen(!switchOpen)}
              className="w-full text-center py-1 text-[10px] font-mono text-[#64748b] hover:text-[#94a3b8] flex items-center justify-center gap-1 border border-dashed border-[#1a2d59] rounded"
            >
              <span>Operator Switcher</span>
              <ChevronDown size={11} />
            </button>

            {switchOpen && (
              <div className="absolute bottom-10 left-0 right-0 bg-[#0c1836] border border-[#1d3772] rounded-xl shadow-2xl p-2 z-50 space-y-1">
                <div className="text-[9px] font-mono text-[#64748b] px-2 py-1 uppercase">Switch Clearance</div>
                {allUsers
                  .filter((u) => u.portal_type === 'security')
                  .map((u) => (
                    <button
                      key={u.id}
                      onClick={() => {
                        switchUser(u.id);
                        setSwitchOpen(false);
                      }}
                      className={`w-full p-2 text-left text-xs font-mono rounded flex items-center justify-between ${
                        currentUser?.id === u.id
                          ? 'bg-[#152e66] text-[#00f2fe] font-bold'
                          : 'text-[#94a3b8] hover:bg-[#102047]'
                      }`}
                    >
                      <div>
                        <div>{u.full_name}</div>
                        <div className="text-[9px] text-[#64748b]">{u.role}</div>
                      </div>
                      <span className="text-[9px] text-[#38bdf8] font-bold">{u.clearance_level}</span>
                    </button>
                  ))}
                <div className="pt-1 border-t border-[#1a2f60]">
                  <Link
                    href="/dashboard"
                    className="text-[10px] font-mono text-[#10b981] hover:underline block px-2 py-1"
                  >
                    ← Switch to Client Portal
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

      </aside>

      {/* Main Column */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        
        {/* Top SOC Telemetry Header */}
        <header className="sticky top-0 z-40 h-14 bg-[#091226]/95 backdrop-blur-md border-b border-[#14234b] px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden text-[#94a3b8] hover:text-white"
            >
              <Menu size={20} />
            </button>

            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="text-[#64748b] hidden sm:inline">DEFENSE GRID:</span>
              <span className="text-[#10b981] flex items-center gap-1.5 font-semibold">
                <span className="w-2 h-2 rounded-full bg-[#10b981] animate-ping"></span>
                ACTIVE MONITORING
              </span>
              <span className="text-[#334155] hidden sm:inline">|</span>
              <span className="text-[#64748b] hidden md:inline">SLA COMPLIANCE:</span>
              <span className="text-[#38bdf8] font-bold hidden md:inline">98.5%</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/security/sla"
              className="px-2.5 py-1 bg-[#0f2048] hover:bg-[#172f6b] text-[#38bdf8] text-[11px] font-mono font-semibold rounded-lg border border-[#1b3470] flex items-center gap-1.5 transition-colors"
            >
              <Clock size={12} />
              <span>SLA RADAR</span>
              {stats.slaBreached > 0 && (
                <span className="px-1 bg-[#ef4444] text-white text-[9px] rounded font-bold">
                  {stats.slaBreached}
                </span>
              )}
            </Link>

            <Link
              href="/security/alerts"
              className="p-2 text-[#94a3b8] hover:text-white bg-[#0f2048] hover:bg-[#172f6b] rounded-lg border border-[#1b3470] relative"
            >
              <Bell size={14} />
              {unreadAlerts > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#ef4444]"></span>
              )}
            </Link>

            <Link
              href="/dashboard"
              className="hidden sm:flex text-xs font-mono text-[#00f2fe] hover:underline items-center gap-1 pl-2 border-l border-[#192b59]"
            >
              <span>Client Portal</span>
              <ExternalLink size={12} />
            </Link>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {children}
        </main>

        {/* SOC Bottom Status Bar */}
        <footer className="h-8 bg-[#060c1d] border-t border-[#111e40] px-4 sm:px-8 flex items-center justify-between text-[10px] font-mono text-[#475569]">
          <div>CYBERSHIELD DEFENSIVE SIEM / SOAR / CASE MANAGEMENT ENGINE</div>
          <div className="hidden sm:block">FIPS 140-2 // SOC 2 TYPE II ENFORCED // RLS ACTIVE</div>
        </footer>

      </div>
    </div>
  );
};
