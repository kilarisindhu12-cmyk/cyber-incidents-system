import React from 'react';
import { User, Shield, KeyRound, Building, Mail, Clock, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export const SecurityProfile: React.FC = () => {
  const { currentUser } = useAuth();

  return (
    <div className="max-w-2xl mx-auto space-y-6 font-mono">
      {/* Header */}
      <div className="border-b border-[#14234b] pb-4">
        <div className="text-[10px] uppercase text-[#00f2fe] tracking-widest">
          SOC OPERATOR IDENTITY & CREDENTIAL RECORD
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
          SECURITY TEAM PROFILE
        </h1>
        <p className="text-xs text-[#64748b] mt-0.5">
          Clearance attributes, authentication posture, and access audit scope.
        </p>
      </div>

      {/* Main Card (SECTION 20 SPECIFICATION FIELDS) */}
      <div className="bg-[#091226] border border-[#14234b] rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* Operator Badge */}
        <div className="flex items-center gap-4 pb-6 border-b border-[#14234b]">
          <div className="w-16 h-16 rounded-2xl bg-[#00f2fe]/10 text-[#00f2fe] border border-[#00f2fe]/30 font-black text-2xl flex items-center justify-center">
            {currentUser?.full_name?.split(' ').map((n) => n[0]).join('')}
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">{currentUser?.full_name}</h2>
            <div className="text-xs text-[#38bdf8] mt-0.5">{currentUser?.email}</div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[10px] px-2 py-0.5 rounded bg-[#00f2fe]/10 text-[#00f2fe] border border-[#00f2fe]/30 font-bold">
                {currentUser?.clearance_level || 'L2 ANALYST'}
              </span>
              <span className="text-[10px] text-[#64748b]">Portal Scope: Security Operations</span>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3 bg-[#060c1d] border border-[#172d5c] rounded-xl space-y-1">
            <span className="text-[10px] text-[#64748b] block">ROLE ASSIGNMENT</span>
            <strong className="text-white text-sm">{currentUser?.role?.replace(/_/g, ' ').toUpperCase()}</strong>
          </div>

          <div className="p-3 bg-[#060c1d] border border-[#172d5c] rounded-xl space-y-1">
            <span className="text-[10px] text-[#64748b] block">ORGANIZATION</span>
            <strong className="text-white text-sm">{currentUser?.organization_name || 'CyberShield Defense'}</strong>
          </div>

          <div className="p-3 bg-[#060c1d] border border-[#172d5c] rounded-xl space-y-1">
            <span className="text-[10px] text-[#64748b] block">DEPARTMENT</span>
            <strong className="text-white text-sm">{currentUser?.department || 'SOC Command'}</strong>
          </div>

          <div className="p-3 bg-[#060c1d] border border-[#172d5c] rounded-xl space-y-1">
            <span className="text-[10px] text-[#64748b] block">LAST AUTHENTICATED LOGIN</span>
            <strong className="text-white text-sm">
              {currentUser?.last_login_at ? new Date(currentUser.last_login_at).toLocaleString() : 'Just now'}
            </strong>
          </div>

          <div className="p-3 bg-[#060c1d] border border-[#172d5c] rounded-xl space-y-1">
            <span className="text-[10px] text-[#64748b] block">MFA STATUS</span>
            <strong className="text-[#10b981] flex items-center gap-1.5 text-sm">
              <CheckCircle2 size={14} /> ENFORCED (HARDWARE FIDO2 + TOTP)
            </strong>
          </div>

          <div className="p-3 bg-[#060c1d] border border-[#172d5c] rounded-xl space-y-1">
            <span className="text-[10px] text-[#64748b] block">ACCOUNT STATUS</span>
            <strong className="text-[#00f2fe] flex items-center gap-1.5 text-sm">
              ACTIVE (SECURITY CLEARANCE VALID)
            </strong>
          </div>
        </div>

        {/* Security Audit Statement */}
        <div className="p-4 rounded-xl bg-[#071329] border border-[#17336b] text-xs text-[#94a3b8] space-y-2">
          <div className="font-bold text-[#38bdf8] flex items-center gap-2">
            <Shield size={14} />
            <span>SOC AUDIT & MONITORING ACKNOWLEDGEMENT</span>
          </div>
          <p className="text-[11px] leading-relaxed text-[#64748b]">
            All queries, incident status transitions, containment enforcements, and client communications performed under this account are cryptographically signed, timestamped, and stored in the immutable audit log under ISO 27001 and SOC 2 Type II controls.
          </p>
        </div>

      </div>
    </div>
  );
};
