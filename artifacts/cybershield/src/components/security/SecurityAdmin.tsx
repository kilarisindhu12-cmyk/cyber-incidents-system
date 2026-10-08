import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'wouter';
import {
  Users,
  Building,
  Lock,
  Shield,
  FileCheck2,
  Settings,
  AlertTriangle,
  Search,
  CheckCircle2,
  KeyRound,
  ShieldAlert,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { dataService } from '@/lib/data-service';

export const SecurityAdmin: React.FC = () => {
  const { currentUser } = useAuth();
  const { subpath } = useParams<{ subpath?: string }>();
  
  const currentTab = subpath || 'users';

  const isAuthorized =
    currentUser?.role === 'security_manager' ||
    currentUser?.role === 'soc_admin' ||
    currentUser?.role === 'super_admin';

  const [toast, setToast] = useState('');
  const [search, setSearch] = useState('');

  const users = dataService.getUsers();
  const orgs = dataService.getOrganizations();
  const auditLogs = dataService.getAuditLogs(currentUser);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  // Section 21: Ordinary analysts blocked from administration
  if (!isAuthorized) {
    return (
      <div className="max-w-xl mx-auto my-12 text-center bg-[#091226] border border-[#ef4444]/40 p-8 rounded-2xl shadow-2xl space-y-4 font-mono">
        <div className="w-12 h-12 rounded-full bg-[#ef4444]/15 text-[#ef4444] flex items-center justify-center mx-auto">
          <AlertTriangle size={24} />
        </div>
        <h2 className="text-lg font-bold text-white">ACCESS DENIED // PRIVILEGE LEVEL INSUFFICIENT</h2>
        <p className="text-xs text-[#94a3b8] leading-relaxed">
          The Administration module requires <strong>Security Manager</strong> or <strong>SOC Administrator</strong> clearance. Your current role (<strong>{currentUser?.role}</strong>) does not have write access to system controls.
        </p>
        <Link
          href="/security/dashboard"
          className="inline-block px-4 py-2 bg-[#00f2fe] text-[#070d1e] text-xs font-bold rounded-lg cursor-pointer"
        >
          Return to SOC Dashboard
        </Link>
      </div>
    );
  }

  const handleRoleChange = (userId: string, newRole: string) => {
    if (!currentUser) return;
    dataService.updateUserRole(userId, newRole, currentUser);
    showToast(`Updated user role to ${newRole}`);
  };

  const filteredLogs = useMemo(() => {
    if (!search.trim()) return auditLogs;
    const q = search.toLowerCase();
    return auditLogs.filter(
      (l) =>
        l.userName.toLowerCase().includes(q) ||
        l.action.toLowerCase().includes(q) ||
        l.resourceType.toLowerCase().includes(q) ||
        (l.resourceId && l.resourceId.toLowerCase().includes(q)) ||
        l.details.toLowerCase().includes(q)
    );
  }, [auditLogs, search]);

  return (
    <div className="space-y-6 font-mono">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#00f2fe] text-[#070d1e] font-bold text-xs px-4 py-2 rounded-lg shadow-xl animate-fade-in flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="border-b border-[#14234b] pb-4">
        <div className="text-[10px] uppercase text-[#00f2fe] tracking-widest">
          SECURITY GOVERNANCE & ACCESS CONTROL
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
          SOC ADMINISTRATION CONSOLE
        </h1>
        <p className="text-xs text-[#64748b] mt-0.5">
          Role-based authorization, multi-tenant organizations, and immutable audit logs.
        </p>
      </div>

      {/* Tab Navigation (SECTION 21 SPECIFICATION) */}
      <div className="flex border-b border-[#14234b] gap-2 text-xs overflow-x-auto">
        {[
          { id: 'users', label: 'USER DIRECTORY', icon: Users },
          { id: 'organizations', label: 'ORGANIZATIONS', icon: Building },
          { id: 'roles', label: 'ROLES & PERMISSIONS', icon: Lock },
          { id: 'audit-logs', label: 'IMMUTABLE AUDIT LOGS', icon: FileCheck2 },
          { id: 'settings', label: 'SYSTEM SETTINGS', icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = currentTab === tab.id;
          return (
            <Link
              key={tab.id}
              href={`/security/admin/${tab.id}`}
              className={`pb-3 px-3 font-bold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap cursor-pointer ${
                active
                  ? 'border-[#00f2fe] text-[#00f2fe]'
                  : 'border-transparent text-[#64748b] hover:text-[#cbd5e1]'
              }`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Tab: Users */}
      {currentTab === 'users' && (
        <div className="bg-[#091226] border border-[#14234b] rounded-xl shadow-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-[#14234b] flex items-center justify-between">
            <h2 className="text-sm font-bold text-white">USER ACCOUNTS & PORTAL PERMISSIONS ({users.length})</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0c1836] text-[10px] uppercase text-[#64748b] border-b border-[#14234b]">
                <tr>
                  <th className="py-3 px-4">NAME & EMAIL</th>
                  <th className="py-3 px-4">ORGANIZATION</th>
                  <th className="py-3 px-4">PORTAL DOMAIN</th>
                  <th className="py-3 px-4">ASSIGNED ROLE</th>
                  <th className="py-3 px-4">MFA</th>
                  <th className="py-3 px-4 text-right">MANAGE ROLE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#101e40]">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-[#0d1a3b] transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-white">{u.full_name}</div>
                      <div className="text-[10px] text-[#64748b]">{u.email}</div>
                    </td>
                    <td className="py-3 px-4 text-[#cbd5e1]">{u.organization_name}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        u.portal_type === 'security'
                          ? 'bg-[#00f2fe]/10 text-[#00f2fe] border border-[#00f2fe]/30'
                          : 'bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/30'
                      }`}>
                        {u.portal_type.toUpperCase()} PORTAL
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#cbd5e1] font-semibold">{u.role}</td>
                    <td className="py-3 px-4 text-[#10b981] font-bold text-[10px]">
                      {u.mfa_enabled ? 'ENABLED' : 'DISABLED'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <select
                        defaultValue={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        className="px-2 py-1 text-xs bg-[#050b1a] border border-[#1b3470] rounded text-[#94a3b8] outline-none"
                      >
                        <option value="client_user">client_user</option>
                        <option value="client_manager">client_manager</option>
                        <option value="soc_analyst">soc_analyst</option>
                        <option value="security_manager">security_manager</option>
                        <option value="soc_admin">soc_admin</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Organizations */}
      {currentTab === 'organizations' && (
        <div className="bg-[#091226] border border-[#14234b] rounded-xl shadow-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-[#14234b] flex items-center justify-between">
            <h2 className="text-sm font-bold text-white">CLIENT TENANT ORGANIZATIONS ({orgs.length})</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0c1836] text-[10px] uppercase text-[#64748b] border-b border-[#14234b]">
                <tr>
                  <th className="py-3 px-4">ORGANIZATION NAME</th>
                  <th className="py-3 px-4">SLUG</th>
                  <th className="py-3 px-4">SERVICE TIER</th>
                  <th className="py-3 px-4">DOMAIN</th>
                  <th className="py-3 px-4">CONTACT EMAIL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#101e40]">
                {orgs.map((o) => (
                  <tr key={o.id} className="hover:bg-[#0d1a3b]">
                    <td className="py-3 px-4 font-bold text-white">{o.name}</td>
                    <td className="py-3 px-4 text-[#38bdf8]">{o.slug}</td>
                    <td className="py-3 px-4 text-[#10b981] font-bold">{o.tier}</td>
                    <td className="py-3 px-4 text-[#cbd5e1]">{o.domain || '—'}</td>
                    <td className="py-3 px-4 text-[#64748b]">{o.contact_email || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Roles & RBAC */}
      {currentTab === 'roles' && (
        <div className="bg-[#091226] border border-[#14234b] rounded-xl p-6 shadow-xl space-y-4">
          <h2 className="text-sm font-bold text-white uppercase">ROLE & PERMISSION MATRIX (SECTION 3 & 23)</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-[#060c1d] border border-[#172d5c] space-y-2">
              <div className="text-[#00f2fe] font-bold text-sm">SOC ANALYST (L2/L3)</div>
              <ul className="text-[#94a3b8] space-y-1 list-disc list-inside text-[11px]">
                <li>View all cross-tenant incidents</li>
                <li>Advance 10-stage triage lifecycle</li>
                <li>Record confidential internal SOC notes</li>
                <li>Send client-visible instructions</li>
                <li>Attach forensic evidence & IOCs</li>
                <li>Execute defensive playbook actions</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-[#060c1d] border border-[#172d5c] space-y-2">
              <div className="text-[#a855f7] font-bold text-sm">SECURITY MANAGER (L4)</div>
              <ul className="text-[#94a3b8] space-y-1 list-disc list-inside text-[11px]">
                <li>All SOC Analyst capabilities</li>
                <li>Reassign incidents across analysts</li>
                <li>Override SLA deadlines and severity</li>
                <li>Approve incident final resolution & closure</li>
                <li>View analyst performance metrics</li>
                <li>Export executive breach reports</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-[#060c1d] border border-[#172d5c] space-y-2">
              <div className="text-[#eab308] font-bold text-sm">SOC ADMINISTRATOR (L5)</div>
              <ul className="text-[#94a3b8] space-y-1 list-disc list-inside text-[11px]">
                <li>All Security Manager capabilities</li>
                <li>Full user & tenant organization management</li>
                <li>Modify RBAC role mappings</li>
                <li>Configure SLA policy thresholds</li>
                <li>Access immutable audit logs</li>
                <li>Configure Supabase RLS security policies</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Immutable Audit Logs (SECTION 22 SPECIFICATION) */}
      {currentTab === 'audit-logs' && (
        <div className="bg-[#091226] border border-[#14234b] rounded-xl shadow-xl overflow-hidden space-y-3">
          <div className="p-4 border-b border-[#14234b] flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <FileCheck2 size={16} className="text-[#00f2fe]" />
                IMMUTABLE AUDIT LOG RECORDS ({filteredLogs.length})
              </h2>
              <div className="text-[10px] text-[#64748b]">Tamper-evident system activity ledger under SOC 2 Type II</div>
            </div>

            <div className="relative min-w-[220px]">
              <Search size={14} className="absolute left-3 top-2.5 text-[#475569]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Filter by user, action, resource..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#050b1a] border border-[#1b3470] rounded-lg text-white placeholder-[#475569] outline-none"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0c1836] text-[10px] uppercase text-[#64748b] border-b border-[#14234b]">
                <tr>
                  <th className="py-3 px-4">TIMESTAMP</th>
                  <th className="py-3 px-4">USER & ROLE</th>
                  <th className="py-3 px-4">ACTION</th>
                  <th className="py-3 px-4">RESOURCE</th>
                  <th className="py-3 px-4">DETAILS</th>
                  <th className="py-3 px-4">IP METADATA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#101e40]">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#0d1a3b]">
                    <td className="py-3 px-4 text-[#64748b] text-[11px] whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-bold text-white">{log.userName}</div>
                      <div className="text-[10px] text-[#38bdf8]">{log.userRole}</div>
                    </td>
                    <td className="py-3 px-4 font-bold text-[#00f2fe] whitespace-nowrap">
                      {log.action}
                    </td>
                    <td className="py-3 px-4 text-[#cbd5e1] whitespace-nowrap">
                      {log.resourceType} {log.resourceId ? `(${log.resourceId})` : ''}
                    </td>
                    <td className="py-3 px-4 text-[#94a3b8] max-w-sm">
                      {log.details}
                    </td>
                    <td className="py-3 px-4 text-[#64748b] font-mono text-[10px]">
                      {log.ipAddress}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Settings */}
      {currentTab === 'settings' && (
        <div className="bg-[#091226] border border-[#14234b] rounded-xl p-6 shadow-xl space-y-4">
          <h2 className="text-sm font-bold text-white uppercase">SYSTEM SETTINGS & INTEGRATIONS</h2>
          <div className="space-y-3 text-xs">
            <div className="p-4 bg-[#060c1d] border border-[#172d5c] rounded-xl flex items-center justify-between">
              <div>
                <strong className="text-white block">Supabase Row Level Security (RLS)</strong>
                <span className="text-[11px] text-[#64748b]">Enforces tenant incident isolation and internal note redaction</span>
              </div>
              <span className="px-2.5 py-1 rounded bg-[#10b981]/20 text-[#10b981] font-bold text-[10px]">ACTIVE</span>
            </div>

            <div className="p-4 bg-[#060c1d] border border-[#172d5c] rounded-xl flex items-center justify-between">
              <div>
                <strong className="text-white block">Automated SLA Escalation Alarms</strong>
                <span className="text-[11px] text-[#64748b]">Dispatches high-priority notification to on-call manager at 15m threshold</span>
              </div>
              <span className="px-2.5 py-1 rounded bg-[#10b981]/20 text-[#10b981] font-bold text-[10px]">ENABLED</span>
            </div>

            <div className="p-4 bg-[#060c1d] border border-[#172d5c] rounded-xl flex items-center justify-between">
              <div>
                <strong className="text-white block">Hardware Token (MFA) Verification</strong>
                <span className="text-[11px] text-[#64748b]">Mandatory FIDO2/TOTP check on /security/login route</span>
              </div>
              <span className="px-2.5 py-1 rounded bg-[#10b981]/20 text-[#10b981] font-bold text-[10px]">ENFORCED</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
