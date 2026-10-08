import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import {
  Shield,
  LayoutDashboard,
  PlusCircle,
  FileText,
  BarChart3,
  Bell,
  User,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ShieldCheck,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { dataService } from '@/lib/data-service';

export const ClientLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [location] = useLocation();
  const { currentUser, logout, switchUser, allUsers } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [switchOpen, setSwitchOpen] = useState(false);

  const notifications = dataService.getNotifications(currentUser);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const isManager = currentUser?.role === 'client_manager';

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Report Incident', href: '/incidents/new', icon: PlusCircle, highlight: true },
    { label: 'My Incidents', href: '/incidents', icon: FileText },
    ...(isManager ? [{ label: 'Organization Reports', href: '/reports', icon: BarChart3 }] : []),
    { label: 'Notifications', href: '/notifications', icon: Bell, badge: unreadCount },
    { label: 'Profile', href: '/profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-[#f4f7f8] flex flex-col font-sans text-[#233840]">
      {/* Client Top Navigation */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#dfe7e9] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Brand */}
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="flex items-center gap-3 decoration-transparent">
              <div className="w-9 h-9 rounded-xl bg-[#167e68] text-white flex items-center justify-center shadow-sm">
                <Shield size={20} strokeWidth={2.5} />
              </div>
              <div>
                <div className="font-extrabold text-lg tracking-tight text-[#14323b] leading-tight">CyberShield</div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-[#738a92] leading-none">
                  {currentUser?.organization_name || 'Client Portal'}
                </div>
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <nav className="hidden md:flex items-center gap-1 ml-4">
              {navItems.map((item) => {
                const active = location === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg transition-all ${
                      item.highlight
                        ? 'bg-[#167e68] text-white hover:bg-[#126b58] ml-2 shadow-xs'
                        : active
                        ? 'bg-[#e7f4f0] text-[#14705c]'
                        : 'text-[#586e75] hover:text-[#183138] hover:bg-[#f0f4f5]'
                    }`}
                  >
                    <Icon size={15} />
                    <span>{item.label}</span>
                    {Boolean(item.badge) && (
                      <span className="ml-1 px-1.5 py-0.2 text-[10px] font-mono rounded-full bg-[#ef4444] text-white">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* User Controls */}
          <div className="flex items-center gap-3">
            {/* Quick Demo Switcher */}
            <div className="relative hidden sm:block">
              <button
                type="button"
                onClick={() => setSwitchOpen(!switchOpen)}
                className="flex items-center gap-2 px-2.5 py-1.5 bg-[#f0f4f5] hover:bg-[#e4ebed] text-[#334b54] text-xs rounded-lg border border-[#d6e0e3] transition-colors"
              >
                <span className="w-2 h-2 rounded-full bg-[#167e68]"></span>
                <span className="font-medium max-w-[120px] truncate">{currentUser?.full_name}</span>
                <span className="text-[10px] text-[#71878f] uppercase font-mono">({currentUser?.role === 'client_manager' ? 'Mgr' : 'User'})</span>
                <ChevronDown size={13} className="text-[#71878f]" />
              </button>

              {switchOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-[#dce5e8] rounded-xl shadow-xl py-2 z-50">
                  <div className="px-3 py-1.5 text-[10px] font-mono text-[#82969d] uppercase border-b border-[#eef2f3]">
                    Switch Portal User
                  </div>
                  {allUsers.map((u) => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => {
                        switchUser(u.id);
                        setSwitchOpen(false);
                      }}
                      className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-[#f4f8f9] ${
                        currentUser?.id === u.id ? 'bg-[#e8f5f1] font-bold text-[#14705c]' : 'text-[#384f57]'
                      }`}
                    >
                      <div>
                        <div>{u.full_name}</div>
                        <div className="text-[10px] text-[#71878f]">{u.organization_name} · {u.role}</div>
                      </div>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                        u.portal_type === 'security' ? 'bg-[#dbeafe] text-[#1e40af]' : 'bg-[#e2e8f0] text-[#334155]'
                      }`}>
                        {u.portal_type}
                      </span>
                    </button>
                  ))}
                  <div className="pt-2 mt-1 border-t border-[#eef2f3] px-3">
                    <Link
                      href="/security/dashboard"
                      className="text-xs text-[#0284c7] hover:underline flex items-center gap-1.5 font-semibold"
                    >
                      Open Security SOC Portal <ExternalLink size={12} />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Logout */}
            <button
              type="button"
              onClick={logout}
              title="Sign Out"
              className="p-2 text-[#657a82] hover:text-[#a0392e] hover:bg-[#faeeee] rounded-lg transition-colors"
            >
              <LogOut size={16} />
            </button>

            {/* Mobile Hamburger */}
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-[#566c74] hover:bg-[#f0f4f5] rounded-lg"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Nav */}
        {mobileOpen && (
          <div className="md:hidden bg-white border-b border-[#dfe7e9] px-4 pt-2 pb-4 space-y-1">
            {navItems.map((item) => {
              const active = location === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg ${
                    active ? 'bg-[#e7f4f0] text-[#14705c]' : 'text-[#586e75] hover:bg-[#f0f4f5]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </div>
                  {Boolean(item.badge) && (
                    <span className="px-2 py-0.5 text-[10px] font-mono rounded-full bg-[#ef4444] text-white">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-[#dfe7e9] py-5 text-center text-xs text-[#7d9098]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-[#167e68]" />
            <span>CyberShield Client Security Gateway</span>
          </div>
          <div>Tenant Scope: <strong>{currentUser?.organization_name}</strong></div>
          <div>24/7 Incident Hotline: <strong>+1 (800) 555-CYBER</strong></div>
        </div>
      </footer>
    </div>
  );
};
