import React from 'react';
import { Route, Switch, Redirect, useLocation, Router as WouterRouter } from 'wouter';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { ClientLogin } from '@/pages/ClientLogin';
import { SecurityLogin } from '@/pages/SecurityLogin';
import { ClientLayout } from '@/components/client/ClientLayout';
import { ClientDashboard } from '@/components/client/ClientDashboard';
import { ClientNewIncident } from '@/components/client/ClientNewIncident';
import { ClientIncidentQueue } from '@/components/client/ClientIncidentQueue';
import { ClientIncidentDetail } from '@/components/client/ClientIncidentDetail';
import { ClientReports } from '@/components/client/ClientReports';
import { ClientProfile } from '@/components/client/ClientProfile';
import { ClientNotifications } from '@/components/client/ClientNotifications';

import { SecurityLayout } from '@/components/security/SecurityLayout';
import { SecurityDashboard } from '@/components/security/SecurityDashboard';
import { SecurityIncidentQueue } from '@/components/security/SecurityIncidentQueue';
import { SecurityIncidentDetail } from '@/components/security/SecurityIncidentDetail';
import { SecuritySLA } from '@/components/security/SecuritySLA';
import { SecurityAnalytics } from '@/components/security/SecurityAnalytics';
import { SecurityThreatIntel } from '@/components/security/SecurityThreatIntel';
import { SecurityIOCs } from '@/components/security/SecurityIOCs';
import { SecurityProfile } from '@/components/security/SecurityProfile';
import { SecurityAdmin } from '@/components/security/SecurityAdmin';
import { SecurityReports } from '@/components/security/SecurityReports';

import NotFound from '@/pages/not-found';
import { UnifiedPortal } from '@/pages/UnifiedPortal';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

// Client Route Guard
const ClientRoute: React.FC<{ component: React.ComponentType }> = ({ component: Component }) => {
  const { currentUser, isAuthenticated } = useAuth();

  if (!isAuthenticated || !currentUser) {
    return <Redirect to="/login" />;
  }

  // If a security team member navigates to client route, allow viewing in client preview or redirect
  return (
    <ClientLayout>
      <Component />
    </ClientLayout>
  );
};

// Security Route Guard (SECTION 4 SPECIFICATION: STRICT DATABASE-ENFORCED AUTHORIZATION)
const SecurityRoute: React.FC<{ component: React.ComponentType }> = ({ component: Component }) => {
  const { currentUser, isAuthenticated } = useAuth();

  if (!isAuthenticated || !currentUser) {
    return <Redirect to="/security/login" />;
  }

  // Block client tenant users from SOC
  if (currentUser.portal_type !== 'security') {
    return (
      <div className="min-h-screen bg-[#070d1e] text-[#cbd5e1] flex items-center justify-center p-6 font-mono">
        <div className="max-w-md w-full bg-[#091226] border border-[#ef4444]/40 rounded-2xl p-8 shadow-2xl text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-[#ef4444]/15 text-[#ef4444] flex items-center justify-center mx-auto">
            <ShieldAlert size={28} />
          </div>
          <h2 className="text-lg font-bold text-white">ACCESS DENIED // NOT AUTHORIZED</h2>
          <p className="text-xs text-[#94a3b8] leading-relaxed">
            Your account ({currentUser.email}) belongs to client tenant <strong>{currentUser.organization_name}</strong>. Access to the CyberShield Security Operations Center (SOC) is restricted to verified defense team personnel.
          </p>
          <div className="pt-2">
            <a
              href="/dashboard"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#00f2fe] text-[#070d1e] font-bold text-xs rounded-lg shadow-lg shadow-[#00f2fe]/20"
            >
              <ArrowLeft size={14} /> Return to Client Dashboard
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <SecurityLayout>
      <Component />
    </SecurityLayout>
  );
};

function RootRouter() {
  const { currentUser, isAuthenticated } = useAuth();

  return (
    <Switch>
      {/* Unified Dual-Portal Root (Both Portals Included in One URL) */}
      <Route path="/" component={UnifiedPortal} />
      <Route path="/portal" component={UnifiedPortal} />

      {/* Auth Routes */}
      <Route path="/login" component={ClientLogin} />
      <Route path="/register" component={ClientLogin} />
      <Route path="/security/login" component={SecurityLogin} />

      {/* ================= CLIENT PORTAL ROUTES ================= */}
      <Route path="/dashboard">
        {() => <ClientRoute component={ClientDashboard} />}
      </Route>

      <Route path="/incidents/new">
        {() => <ClientRoute component={ClientNewIncident} />}
      </Route>

      <Route path="/incidents/:id">
        {() => <ClientRoute component={ClientIncidentDetail} />}
      </Route>

      <Route path="/incidents">
        {() => <ClientRoute component={ClientIncidentQueue} />}
      </Route>

      <Route path="/reports">
        {() => <ClientRoute component={ClientReports} />}
      </Route>

      <Route path="/profile">
        {() => <ClientRoute component={ClientProfile} />}
      </Route>

      <Route path="/notifications">
        {() => <ClientRoute component={ClientNotifications} />}
      </Route>

      {/* ================= SECURITY TEAM (SOC) PORTAL ROUTES ================= */}
      <Route path="/security">
        {() => <Redirect to="/security/dashboard" />}
      </Route>

      <Route path="/security/dashboard">
        {() => <SecurityRoute component={SecurityDashboard} />}
      </Route>

      <Route path="/security/incidents/:id">
        {() => <SecurityRoute component={SecurityIncidentDetail} />}
      </Route>

      <Route path="/security/investigations/:id">
        {() => <SecurityRoute component={SecurityIncidentDetail} />}
      </Route>

      <Route path="/security/incidents">
        {() => <SecurityRoute component={SecurityIncidentQueue} />}
      </Route>

      <Route path="/security/investigations">
        {() => <SecurityRoute component={SecurityIncidentQueue} />}
      </Route>

      <Route path="/security/sla">
        {() => <SecurityRoute component={SecuritySLA} />}
      </Route>

      <Route path="/security/analytics">
        {() => <SecurityRoute component={SecurityAnalytics} />}
      </Route>

      <Route path="/security/threat-intelligence">
        {() => <SecurityRoute component={SecurityThreatIntel} />}
      </Route>

      <Route path="/security/threat-activity">
        {() => <SecurityRoute component={SecurityThreatIntel} />}
      </Route>

      <Route path="/security/iocs">
        {() => <SecurityRoute component={SecurityIOCs} />}
      </Route>

      <Route path="/security/alerts">
        {() => <SecurityRoute component={SecurityThreatIntel} />}
      </Route>

      <Route path="/security/evidence">
        {() => <SecurityRoute component={SecurityReports} />}
      </Route>

      <Route path="/security/response-actions">
        {() => <SecurityRoute component={SecurityIncidentQueue} />}
      </Route>

      <Route path="/security/timeline">
        {() => <SecurityRoute component={SecurityReports} />}
      </Route>

      <Route path="/security/reports">
        {() => <SecurityRoute component={SecurityReports} />}
      </Route>

      <Route path="/security/profile">
        {() => <SecurityRoute component={SecurityProfile} />}
      </Route>

      {/* Security Administration & Management Subpaths */}
      <Route path="/security/admin/:subpath">
        {() => <SecurityRoute component={SecurityAdmin} />}
      </Route>

      <Route path="/security/admin">
        {() => <Redirect to="/security/admin/users" />}
      </Route>

      {/* Fallback 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <WouterRouter base={import.meta.env.BASE_URL?.replace(/\/$/, '') || ''}>
        <RootRouter />
      </WouterRouter>
    </AuthProvider>
  );
}
