import React, { useState } from 'react';
import { User, Building, Mail, Shield, KeyRound, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export const ClientProfile: React.FC = () => {
  const { currentUser } = useAuth();
  const [toast, setToast] = useState('');

  const [fullName, setFullName] = useState(currentUser?.full_name || '');
  const [department, setDepartment] = useState(currentUser?.department || '');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser) {
      currentUser.full_name = fullName;
      currentUser.department = department;
    }
    setToast('Profile preferences updated.');
    setTimeout(() => setToast(''), 2500);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#167e68] text-white text-xs px-4 py-2.5 rounded-lg shadow-xl animate-fade-in flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>{toast}</span>
        </div>
      )}

      <div>
        <h1 className="text-2xl font-black text-[#152e36] tracking-tight">Client User Profile</h1>
        <p className="text-xs text-[#6e838b] mt-1">
          Manage your organization account and communication preferences.
        </p>
      </div>

      <div className="bg-white border border-[#dfe7e9] rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        {/* User Card */}
        <div className="flex items-center gap-4 pb-6 border-b border-[#e6edee]">
          <div className="w-16 h-16 rounded-2xl bg-[#e6f4f0] text-[#14705c] font-black text-2xl flex items-center justify-center font-mono">
            {currentUser?.full_name?.split(' ').map((n) => n[0]).join('')}
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#14323b]">{currentUser?.full_name}</h2>
            <div className="text-xs text-[#667e86] mt-0.5">{currentUser?.organization_name} · {currentUser?.department}</div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#e7f4f0] text-[#14705c] font-bold">
                {currentUser?.role?.replace(/_/g, ' ').toUpperCase()}
              </span>
              <span className="text-[10px] text-[#81969e]">Tenant Portal: Client</span>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#486069] mb-1">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-[#f8fafb] border border-[#d6e0e3] rounded-lg outline-none focus:border-[#167e68]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#486069] mb-1">Business Email (Managed by Identity Provider)</label>
            <input
              type="email"
              disabled
              value={currentUser?.email || ''}
              className="w-full px-3.5 py-2 text-xs bg-[#f1f5f7] border border-[#d6e0e3] rounded-lg text-[#6d848c] cursor-not-allowed font-mono"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#486069] mb-1">Organization</label>
              <input
                type="text"
                disabled
                value={currentUser?.organization_name || ''}
                className="w-full px-3.5 py-2 text-xs bg-[#f1f5f7] border border-[#d6e0e3] rounded-lg text-[#6d848c] cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#486069] mb-1">Department</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-[#f8fafb] border border-[#d6e0e3] rounded-lg outline-none focus:border-[#167e68]"
              />
            </div>
          </div>

          {/* Security Status Box */}
          <div className="p-4 rounded-xl bg-[#f8fafb] border border-[#e1e9eb] space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[#324951]">Multi-Factor Authentication (MFA)</span>
              <span className="font-mono text-[10px] text-[#16a34a] bg-[#dcfce7] px-2 py-0.5 rounded font-bold">
                ENFORCED (TOTP)
              </span>
            </div>
            <p className="text-[11px] text-[#788e96]">
              All client access to CyberShield is protected under mandatory hardware/app authenticator MFA policies.
            </p>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-5 py-2 bg-[#167e68] hover:bg-[#126b58] text-white text-xs font-bold rounded-lg cursor-pointer shadow-xs"
            >
              Save Profile Updates
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
