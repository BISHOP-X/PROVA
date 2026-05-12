import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { createSession, getSession, clearSession, getSessionExpiresAt } from '@/services/session';

type Role = 'admin' | 'beneficiary';

export type User = {
  id: string;
  email: string;
  role: Role;
  onboardingComplete?: boolean;
};

type AuthContextType = {
  user: User | null;
  login: (email: string, role: Role) => Promise<void>;
  logout: () => void;
  completeOnboarding: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    // initialize from persisted session if valid
    try {
      return getSession();
    } catch {
      return null;
    }
  });

  const expiryTimer = useRef<number | null>(null);

  useEffect(() => {
    // initialize expiry timer once on mount and keep in sync with storage events
    function scheduleTimer() {
      const expiresAt = getSessionExpiresAt();
      if (expiryTimer.current) {
        window.clearTimeout(expiryTimer.current);
        expiryTimer.current = null;
      }
      if (expiresAt) {
        const ms = expiresAt - Date.now();
        if (ms <= 0) {
          setUser(null);
          clearSession();
        } else {
          expiryTimer.current = window.setTimeout(() => {
            setUser(null);
            clearSession();
          }, ms);
        }
      }
    }

    console.log('[AuthContext] mounting, initial session expiresAt:', getSessionExpiresAt());
    scheduleTimer();

    const handleStorage = () => {
      console.log('[AuthContext] storage event received — reloading session');
      // if session changed in another context, re-sync
      const s = getSession();
      console.log('[AuthContext] storage -> getSession returned', s);
      setUser(s);
      scheduleTimer();
    };

    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('storage', handleStorage);
      if (expiryTimer.current) {
        window.clearTimeout(expiryTimer.current);
        expiryTimer.current = null;
      }
    };
  }, []);

  const login = async (email: string, role: Role) => {
    console.log('[AuthContext] login invoked', { email, role });
    const newUser: User = { id: `${role}_${Date.now()}`, email, role, onboardingComplete: role === 'admin' };
    setUser(newUser);
    createSession(newUser);
    console.log('[AuthContext] session created', { user: newUser });
    
    // schedule expiry timer for the new session
    const expiresAt = getSessionExpiresAt();
    if (expiresAt) {
      if (expiryTimer.current) window.clearTimeout(expiryTimer.current);
      const ms = expiresAt - Date.now();
      expiryTimer.current = window.setTimeout(() => {
        console.log('[AuthContext] session expired — clearing');
        setUser(null);
        clearSession();
      }, ms);
    }

    // ensure state is flushed before callers navigate to protected routes
    await new Promise((r) => setTimeout(r, 0));
  };

  const logout = () => {
    console.log('[AuthContext] logout invoked');
    setUser(null);
    clearSession();
    if (expiryTimer.current) {
      window.clearTimeout(expiryTimer.current);
      expiryTimer.current = null;
    }
  };

  const completeOnboarding = () => {
    if (!user) return;
    console.log('[AuthContext] completing onboarding');
    const u = { ...user, onboardingComplete: true };
    setUser(u);
    createSession(u);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, completeOnboarding }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

import { useLocation } from 'react-router-dom';

export const ProtectedRoute: React.FC<React.PropsWithChildren<{ requireRole?: Role }>> = ({ children, requireRole }) => {
  const { user } = useAuth();
  const location = useLocation();
  
  console.log('[ProtectedRoute] checking access', { 
    path: location.pathname, 
    userRole: user?.role, 
    requireRole 
  });

  if (!user) {
    console.log('[ProtectedRoute] no user — redirecting to login', { from: location.pathname });
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (requireRole && user.role !== requireRole) {
    console.log('[ProtectedRoute] role mismatch — redirecting', { 
      userRole: user.role, 
      requireRole 
    });
    // Redirect beneficiaries to their status/onboarding if they try to hit admin
    if (user.role === 'beneficiary') {
      return <Navigate to="/onboarding" replace />;
    }
    // Redirect admins to dashboard if they try to hit beneficiary pages
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <>{children}</>;
};

export default AuthContext;
