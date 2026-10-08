import React, { createContext, useContext, useEffect, useState } from 'react';
import type { PortalType, UserProfile, UserRole } from '@/types';
import { dataService, SEED_USERS } from '@/lib/data-service';

interface AuthContextType {
  currentUser: UserProfile | null;
  isAuthenticated: boolean;
  login: (email: string, portalScope?: 'client' | 'security') => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, organization: string, department: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  switchUser: (userId: string) => void;
  allUsers: UserProfile[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'cybershield_active_user_id';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const savedId = localStorage.getItem(AUTH_STORAGE_KEY);
      const users = dataService.getUsers();
      if (savedId) {
        const found = users.find((u) => u.id === savedId);
        if (found) return found;
      }
      // Default to Client Employee (Morgan Lee) on first load
      return users[0] || SEED_USERS[0];
    } catch {
      return SEED_USERS[0];
    }
  });

  const allUsers = dataService.getUsers();

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(AUTH_STORAGE_KEY, currentUser.id);
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [currentUser]);

  const login = async (
    email: string,
    portalScope?: 'client' | 'security'
  ): Promise<{ success: boolean; error?: string }> => {
    const users = dataService.getUsers();
    const normalized = email.trim().toLowerCase();
    const user = users.find((u) => u.email.toLowerCase() === normalized);

    if (!user) {
      return {
        success: false,
        error: `No registered account found with email "${email}".`,
      };
    }

    // Portal Scope Enforcement (Do NOT allow browser to decide; enforce from profile)
    if (portalScope === 'security') {
      if (user.portal_type !== 'security') {
        return {
          success: false,
          error: 'ACCESS DENIED: This account does not possess Security Operations Center (SOC) clearance. Please use the Client Portal.',
        };
      }
    }

    if (portalScope === 'client') {
      if (user.portal_type === 'security') {
        // Automatically route security user to SOC portal
        setCurrentUser(user);
        dataService.recordAuditLog(
          user,
          'Login',
          'Session',
          user.id,
          `Authenticated to SOC console via client gateway redirect.`
        );
        return { success: true };
      }
    }

    setCurrentUser(user);
    dataService.recordAuditLog(
      user,
      'Login',
      'Session',
      user.id,
      `User signed in to ${user.portal_type.toUpperCase()} portal.`
    );
    return { success: true };
  };

  const register = async (
    name: string,
    email: string,
    organization: string,
    department: string
  ): Promise<{ success: boolean; error?: string }> => {
    const users = dataService.getUsers();
    const normalized = email.trim().toLowerCase();
    if (users.some((u) => u.email.toLowerCase() === normalized)) {
      return { success: false, error: 'An account with this email already exists.' };
    }

    const orgs = dataService.getOrganizations();
    let org = orgs.find((o) => o.name.toLowerCase() === organization.toLowerCase());
    if (!org) {
      org = orgs[0];
    }

    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      full_name: name,
      email: normalized,
      organization_id: org.id,
      organization_name: organization || org.name,
      department: department || 'General',
      role: 'client_user',
      portal_type: 'client',
      mfa_enabled: false,
      clearance_level: 'Client Member',
      account_status: 'Active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const updated = [...users, newUser];
    try {
      localStorage.setItem('cybershield_v2_users', JSON.stringify(updated));
    } catch (e) {
      console.warn(e);
    }

    setCurrentUser(newUser);
    dataService.recordAuditLog(
      newUser,
      'User Created',
      'User',
      newUser.email,
      `New client user registered: ${newUser.full_name} (${organization})`
    );

    return { success: true };
  };

  const logout = () => {
    if (currentUser) {
      dataService.recordAuditLog(
        currentUser,
        'Logout',
        'Session',
        currentUser.id,
        'User logged out from session.'
      );
    }
    setCurrentUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const switchUser = (userId: string) => {
    const users = dataService.getUsers();
    const target = users.find((u) => u.id === userId);
    if (target) {
      setCurrentUser(target);
      dataService.recordAuditLog(
        target,
        'User Switched (Demo)',
        'Session',
        target.id,
        `Switched session to ${target.full_name} (${target.role})`
      );
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: Boolean(currentUser),
        login,
        register,
        logout,
        switchUser,
        allUsers,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
