import React, { useState } from 'react';
import { useLocation, Link } from 'wouter';
import { Shield, Lock, Mail, Building, User, ArrowRight, ShieldAlert, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export const ClientLogin: React.FC = () => {
  const [, setLocation] = useLocation();
  const { login, register, allUsers, switchUser } = useAuth();
  const [tab, setTab] = useState<'login' | 'register'>('login');
  
  // Login Form
  const [email, setEmail] = useState('morgan.lee@acme.com');
  const [password, setPassword] = useState('CyberShield2026!');
  
  // Register Form
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regOrg, setRegOrg] = useState('Acme Corporation');
  const [regDept, setRegDept] = useState('Finance');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await login(email, 'client');
    setLoading(false);

    if (res.success) {
      setLocation('/dashboard');
    } else {
      setError(res.error || 'Login failed. Please check credentials.');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!regName || !regEmail) {
      setError('Please provide full name and business email.');
      return;
    }

    setLoading(true);
    const res = await register(regName, regEmail, regOrg, regDept);
    setLoading(false);

    if (res.success) {
      setSuccess('Account created successfully! Redirecting to your organization dashboard...');
      setTimeout(() => {
        setLocation('/dashboard');
      }, 1200);
    } else {
      setError(res.error || 'Registration failed.');
    }
  };

  return (
    <div className="client-auth-wrapper min-h-screen bg-[#f3f7f8] flex flex-col justify-between text-[#263c44]">
      {/* Top Navbar */}
      <header className="h-16 px-6 sm:px-12 bg-white border-b border-[#e1e9eb] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#167e68] text-white flex items-center justify-center shadow-sm">
            <Shield size={20} strokeWidth={2.5} />
          </div>
          <div>
            <div className="font-extrabold text-lg tracking-tight text-[#14323b]">CyberShield</div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-[#728a92] -mt-1">Client Portal</div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/security/login"
            className="text-xs font-semibold text-[#185366] hover:text-[#0b2832] flex items-center gap-1.5 py-1.5 px-3 rounded-md hover:bg-[#eaf1f3] transition-colors"
          >
            <ShieldAlert size={14} className="text-[#0284c7]" />
            Security Team (SOC) Access →
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-6 my-8">
        <div className="w-full max-w-md bg-white border border-[#dce5e8] rounded-xl shadow-lg shadow-[#102b33]/5 p-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#e6f4f0] text-[#167e68] mb-3">
              <Shield size={26} />
            </div>
            <h1 className="text-2xl font-bold text-[#142e36]">Welcome to CyberShield</h1>
            <p className="text-xs text-[#6e828a] mt-1">
              Report cybersecurity incidents, track remediation, and protect your organization.
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex border-b border-[#e3ebed] mb-6">
            <button
              type="button"
              onClick={() => { setTab('login'); setError(''); }}
              className={`flex-1 pb-3 text-xs font-bold transition-all border-b-2 ${
                tab === 'login'
                  ? 'border-[#167e68] text-[#167e68]'
                  : 'border-transparent text-[#7c8f95] hover:text-[#324951]'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setTab('register'); setError(''); }}
              className={`flex-1 pb-3 text-xs font-bold transition-all border-b-2 ${
                tab === 'register'
                  ? 'border-[#167e68] text-[#167e68]'
                  : 'border-transparent text-[#7c8f95] hover:text-[#324951]'
              }`}
            >
              Register Organization User
            </button>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-lg bg-[#fef2f2] border border-[#fecaca] text-[#991b1b] text-xs flex items-start gap-2.5">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-5 p-3 rounded-lg bg-[#f0fdf4] border border-[#bbf7d0] text-[#166534] text-xs flex items-start gap-2.5">
              <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          {tab === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#486069] mb-1.5">Business Email</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3 top-3 text-[#94a5ab]" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-[#f8fafb] border border-[#d6e0e3] rounded-lg focus:bg-white focus:border-[#167e68] focus:ring-2 focus:ring-[#167e68]/15 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-semibold text-[#486069]">Password</label>
                  <a href="#forgot" className="text-[11px] text-[#167e68] hover:underline">Forgot password?</a>
                </div>
                <div className="relative">
                  <Lock size={15} className="absolute left-3 top-3 text-[#94a5ab]" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-[#f8fafb] border border-[#d6e0e3] rounded-lg focus:bg-white focus:border-[#167e68] focus:ring-2 focus:ring-[#167e68]/15 outline-none transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-2.5 px-4 bg-[#167e68] hover:bg-[#126b58] text-white text-xs font-bold rounded-lg shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Authenticating...' : 'Sign In to Client Portal'}
                <ArrowRight size={14} />
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#486069] mb-1">Full Name</label>
                <div className="relative">
                  <User size={15} className="absolute left-3 top-3 text-[#94a5ab]" />
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Jane Doe"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-[#f8fafb] border border-[#d6e0e3] rounded-lg outline-none focus:border-[#167e68]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#486069] mb-1">Work Email</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3 top-3 text-[#94a5ab]" />
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="jane.doe@company.com"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-[#f8fafb] border border-[#d6e0e3] rounded-lg outline-none focus:border-[#167e68]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#486069] mb-1">Organization</label>
                  <select
                    value={regOrg}
                    onChange={(e) => setRegOrg(e.target.value)}
                    className="w-full px-2.5 py-2 text-xs bg-[#f8fafb] border border-[#d6e0e3] rounded-lg outline-none focus:border-[#167e68]"
                  >
                    <option>Acme Corporation</option>
                    <option>Apex Financial Group</option>
                    <option>Nova Health Systems</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#486069] mb-1">Department</label>
                  <select
                    value={regDept}
                    onChange={(e) => setRegDept(e.target.value)}
                    className="w-full px-2.5 py-2 text-xs bg-[#f8fafb] border border-[#d6e0e3] rounded-lg outline-none focus:border-[#167e68]"
                  >
                    <option>Finance</option>
                    <option>IT Operations</option>
                    <option>Engineering</option>
                    <option>HR & Legal</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-2.5 px-4 bg-[#167e68] hover:bg-[#126b58] text-white text-xs font-bold rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Creating Account...' : 'Complete Registration'}
                <ArrowRight size={14} />
              </button>
            </form>
          )}

          {/* Quick Demo Switcher */}
          <div className="mt-8 pt-5 border-t border-[#e8eff1]">
            <div className="text-[11px] font-mono uppercase tracking-wider text-[#82969d] mb-2 text-center">
              Quick Test Accounts (Client Portal)
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setEmail('morgan.lee@acme.com');
                  login('morgan.lee@acme.com', 'client').then(() => setLocation('/dashboard'));
                }}
                className="p-2 text-left bg-[#f4f8f9] hover:bg-[#e8f2f4] rounded border border-[#d8e4e7] transition-colors"
              >
                <div className="font-bold text-xs text-[#203a42]">Morgan Lee</div>
                <div className="text-[10px] text-[#71868d]">Employee (Acme Corp)</div>
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail('sarah.jenkins@acme.com');
                  login('sarah.jenkins@acme.com', 'client').then(() => setLocation('/dashboard'));
                }}
                className="p-2 text-left bg-[#f4f8f9] hover:bg-[#e8f2f4] rounded border border-[#d8e4e7] transition-colors"
              >
                <div className="font-bold text-xs text-[#203a42]">Sarah Jenkins</div>
                <div className="text-[10px] text-[#71868d]">IT Manager (Acme Corp)</div>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-[#82959c] border-t border-[#e2eaed] bg-white">
        © 2026 CyberShield Inc. Enterprise Incident Reporting & Response Platform.
      </footer>
    </div>
  );
};
