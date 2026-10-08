import React, { useState } from 'react';
import { useLocation, Link } from 'wouter';
import { Shield, Lock, Mail, KeyRound, Terminal, Activity, ArrowRight, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export const SecurityLogin: React.FC = () => {
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  
  const [email, setEmail] = useState('alex.rivera@cybershield.soc');
  const [password, setPassword] = useState('SOC_SecOps_2026!');
  const [mfaCode, setMfaCode] = useState('839402');
  const [showPassword, setShowPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await login(email, 'security');
    setLoading(false);

    if (res.success) {
      setLocation('/security/dashboard');
    } else {
      setError(res.error || 'Authentication failed. Please verify credentials and SOC authorization.');
    }
  };

  return (
    <div className="soc-login-root min-h-screen bg-[#070d1e] text-[#c8d6e5] flex flex-col justify-between selection:bg-[#00f2fe]/20 selection:text-[#00f2fe]">
      {/* Top SOC Status Ribbon */}
      <div className="h-10 px-6 sm:px-12 bg-[#091127] border-b border-[#14234b] flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-3">
          <span className="inline-block w-2 h-2 rounded-full bg-[#10b981] animate-pulse"></span>
          <span className="text-[#64748b]">SOC GATEWAY : </span>
          <span className="text-[#38bdf8] font-semibold">GRID OPERATIONAL</span>
          <span className="text-[#334155] hidden md:inline">|</span>
          <span className="text-[#64748b] hidden md:inline">NODE : </span>
          <span className="text-[#94a3b8] font-semibold hidden md:inline">DEFENSE-CLUSTER-US-EAST</span>
        </div>
        <div>
          <Link href="/login" className="text-[#38bdf8] hover:text-[#00f2fe] transition-colors text-xs">
            ← Switch to Client Portal
          </Link>
        </div>
      </div>

      {/* Main Desktop 2-Column Split Container */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-4xl bg-[#0b152d]/95 border border-[#1a2f62] rounded-2xl shadow-2xl shadow-[#020b24]/80 overflow-hidden grid grid-cols-1 md:grid-cols-12 backdrop-blur-md">
          
          {/* Left Column: CyberShield SOC Operational Showcase */}
          <div className="md:col-span-6 p-8 sm:p-12 bg-gradient-to-br from-[#0c1a38] via-[#091329] to-[#060e22] border-b md:border-b-0 md:border-r border-[#1a2f62] relative flex flex-col justify-between">
            {/* Subtle background tech grid overlay */}
            <div
              className="absolute inset-0 opacity-15 pointer-events-none"
              style={{
                backgroundImage: 'linear-gradient(to right, #00f2fe 1px, transparent 1px), linear-gradient(to bottom, #00f2fe 1px, transparent 1px)',
                backgroundSize: '32px 32px',
              }}
            />

            <div className="relative z-10">
              {/* Brand Mark */}
              <div className="flex items-center gap-3.5 mb-8">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#0052d4] via-[#4364f7] to-[#00f2fe] flex items-center justify-center shadow-lg shadow-[#00f2fe]/20 text-white">
                  <Shield size={26} strokeWidth={2.5} />
                </div>
                <div>
                  <div className="font-extrabold text-2xl tracking-tight text-white flex items-center gap-2">
                    CYBERSHIELD <span className="text-[#00f2fe] text-xl font-mono">SOC</span>
                  </div>
                  <div className="text-[11px] font-mono tracking-wider text-[#7dd3fc] uppercase">
                    Security Operations Center
                  </div>
                </div>
              </div>

              <blockquote className="text-sm text-[#94a3b8] leading-relaxed mb-8 border-l-2 border-[#00f2fe]/40 pl-4">
                Secure access to the CyberShield Security Operations Center. Real-time incident response, threat telemetry, and risk containment.
              </blockquote>

              {/* Core SOC Pillars */}
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-[#0f2147]/40 border border-[#1d356e]">
                  <div className="w-7 h-7 rounded bg-[#00f2fe]/10 text-[#00f2fe] flex items-center justify-center shrink-0 mt-0.5">
                    <Activity size={15} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white tracking-wide">Incident Response & Triage</div>
                    <div className="text-[11px] text-[#64748b] leading-normal">
                      Full 10-stage lifecycle management, evidence custody, and response checklists.
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-[#0f2147]/40 border border-[#1d356e]">
                  <div className="w-7 h-7 rounded bg-[#38bdf8]/10 text-[#38bdf8] flex items-center justify-center shrink-0 mt-0.5">
                    <Terminal size={15} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white tracking-wide">Threat Monitoring & IOC Tracking</div>
                    <div className="text-[11px] text-[#64748b] leading-normal">
                      Centralized indicator repository: IPs, domains, hashes, and behavioral telemetry.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Telemetry Bullets */}
            <div className="relative z-10 pt-8 mt-6 border-t border-[#172b5c] flex items-center justify-between text-[11px] font-mono text-[#64748b]">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00f2fe]"></span>
                <span>● SOC</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8]"></span>
                <span>● Monitoring</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]"></span>
                <span>● Response</span>
              </div>
            </div>
          </div>

          {/* Right Column: Secure Access Form */}
          <div className="md:col-span-6 p-8 sm:p-12 flex flex-col justify-between bg-[#0a142c]">
            <div>
              <div className="mb-6">
                <div className="text-[10px] font-mono tracking-widest uppercase text-[#00f2fe] mb-1">
                  CLEARANCE REQUIRED
                </div>
                <h2 className="text-2xl font-bold text-white tracking-tight">SECURE ACCESS</h2>
                <p className="text-xs text-[#64748b] mt-1">
                  Authenticate with authorized security team credentials.
                </p>
              </div>

              {error && (
                <div className="mb-5 p-3 rounded-lg bg-[#ef4444]/10 border border-[#ef4444]/30 text-[#fca5a5] text-xs flex items-start gap-2.5">
                  <AlertTriangle size={16} className="shrink-0 mt-0.5 text-[#ef4444]" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-[#94a3b8] mb-1.5 tracking-wide">
                    WORK EMAIL
                  </label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3.5 top-3.5 text-[#475569]" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="analyst@cybershield.soc"
                      className="w-full pl-10 pr-3 py-2.5 text-xs bg-[#060d1f] border border-[#1e3468] rounded-lg text-white placeholder-[#475569] font-mono focus:border-[#00f2fe] focus:ring-1 focus:ring-[#00f2fe]/40 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-mono text-[#94a3b8] tracking-wide">PASSWORD</label>
                    <span className="text-[10px] font-mono text-[#475569]">FIPS 140-2 Compliant</span>
                  </div>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3.5 top-3.5 text-[#475569]" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 text-xs bg-[#060d1f] border border-[#1e3468] rounded-lg text-white placeholder-[#475569] font-mono focus:border-[#00f2fe] focus:ring-1 focus:ring-[#00f2fe]/40 outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-[#475569] hover:text-[#94a3b8]"
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-mono text-[#94a3b8] tracking-wide">MFA SECURITY TOKEN</label>
                    <span className="text-[10px] font-mono text-[#10b981] flex items-center gap-1">
                      <KeyRound size={11} /> TOTP Active
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      maxLength={6}
                      value={mfaCode}
                      onChange={(e) => setMfaCode(e.target.value)}
                      placeholder="000000"
                      className="w-full px-3 py-2 text-center tracking-[0.4em] font-mono text-sm bg-[#060d1f] border border-[#1e3468] rounded-lg text-[#00f2fe] focus:border-[#00f2fe] outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-4 py-3 px-4 bg-gradient-to-r from-[#0052d4] via-[#4364f7] to-[#00f2fe] hover:opacity-95 text-white font-mono text-xs font-bold rounded-lg shadow-lg shadow-[#00f2fe]/10 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 tracking-wider uppercase"
                >
                  {loading ? 'Verifying Hardware & Key...' : 'SIGN IN TO SOC CONSOLE'}
                  <ArrowRight size={15} />
                </button>
              </form>
            </div>

            {/* Quick Role Tester Bar */}
            <div className="mt-8 pt-5 border-t border-[#172b5c]">
              <div className="text-[10px] font-mono uppercase tracking-wider text-[#64748b] mb-2 text-center">
                Operator Clearance Presets
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEmail('alex.rivera@cybershield.soc');
                    login('alex.rivera@cybershield.soc', 'security').then(() => setLocation('/security/dashboard'));
                  }}
                  className="p-2 text-left bg-[#081229] hover:bg-[#12234f] rounded border border-[#1b3367] transition-colors"
                >
                  <div className="font-bold text-[11px] text-white">Alex Rivera</div>
                  <div className="text-[9px] text-[#38bdf8] font-mono">SOC Analyst</div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setEmail('marcus.vance@cybershield.soc');
                    login('marcus.vance@cybershield.soc', 'security').then(() => setLocation('/security/dashboard'));
                  }}
                  className="p-2 text-left bg-[#081229] hover:bg-[#12234f] rounded border border-[#1b3367] transition-colors"
                >
                  <div className="font-bold text-[11px] text-white">Marcus Vance</div>
                  <div className="text-[9px] text-[#a855f7] font-mono">Security Mgr</div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setEmail('elena.rostova@cybershield.soc');
                    login('elena.rostova@cybershield.soc', 'security').then(() => setLocation('/security/dashboard'));
                  }}
                  className="p-2 text-left bg-[#081229] hover:bg-[#12234f] rounded border border-[#1b3367] transition-colors"
                >
                  <div className="font-bold text-[11px] text-white">Elena Rostova</div>
                  <div className="text-[9px] text-[#eab308] font-mono">SOC Admin</div>
                </button>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="py-3 px-6 text-center text-[11px] font-mono text-[#475569] border-t border-[#111e40] bg-[#060c1d]">
        CYBERSHIELD SECURITY OPERATIONS CENTER // AUTHORIZED PERSONNEL ONLY // ALL TELEMETRY & ACTIONS AUDITED
      </footer>
    </div>
  );
};
