import React, { createContext, useContext, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import * as sb from '@/services/supabase';
import type { AppRole, ProfileRecord } from '@/services/supabase';

type Role = AppRole;

export type User = {
  id: string;
  email: string;
  role: Role;
  fullName?: string;
  phone?: string;
  createdAt?: string;
  onboardingComplete?: boolean;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  signUp: (email: string, password: string, fullName: string, role: sb.AppRole) => Promise<void>;
  logout: () => Promise<void>;
  completeOnboarding: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mapProfileToUser = (profile: ProfileRecord, authEmail?: string | null): User => ({
  id: profile.id,
  email: profile.email || authEmail || '',
  role: profile.role,
  fullName: profile.full_name ?? undefined,
  phone: profile.phone ?? undefined,
  createdAt: profile.created_at ?? undefined,
  onboardingComplete: profile.role === 'admin',
});

const loadUserFromSession = async () => {
  const session = await sb.getAuthSession();
  if (!session?.user) return null;

  const profile = await sb.getProfileById(session.user.id);
  return mapProfileToUser(profile, session.user.email);
};

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function initialize() {
      try {
        const sessionUser = await loadUserFromSession();
        if (mounted) setUser(sessionUser);
      } catch (err) {
        console.error('[AuthContext] failed to load Supabase session', err);
        if (mounted) setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    initialize();

    const subscription = sb.onAuthStateChange(() => {
      initialize();
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    const result = await sb.signInWithPassword(email, password);
    const authUser = result.user;
    if (!authUser) throw new Error('Supabase did not return an authenticated user.');

    const profile = await sb.getProfileById(authUser.id);
    const nextUser = mapProfileToUser(profile, authUser.email);
    setUser(nextUser);
    return nextUser;
  };

  const signUp = async (email: string, password: string, fullName: string, role: sb.AppRole) => {
    await sb.signUp(email, password, fullName, role);
  };

  const logout = async () => {
    await sb.signOut();
    setUser(null);
  };

  const completeOnboarding = () => {
    setUser((current) => (current ? { ...current, onboardingComplete: true } : current));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signUp, logout, completeOnboarding }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const ProtectedRoute: React.FC<React.PropsWithChildren<{ requireRole?: Role }>> = ({ children, requireRole }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-on-background flex items-center justify-center">
        <div className="text-sm font-medium text-on-surface-variant">Loading secure session...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (requireRole && user.role !== requireRole) {
    if (user.role === 'beneficiary') {
      return <Navigate to="/onboarding" replace />;
    }
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <>{children}</>;
};

export default AuthContext;
