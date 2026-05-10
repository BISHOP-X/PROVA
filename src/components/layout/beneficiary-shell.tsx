import type { ReactNode } from 'react';
import { Shield, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface BeneficiaryShellProps {
  children: ReactNode;
}

export function BeneficiaryShell({ children }: BeneficiaryShellProps) {
  const location = useLocation();
  const isOnboarding = location.pathname.includes('/onboarding');

  return (
    <div className="bg-background text-surface-on min-h-screen flex flex-col font-body-md antialiased">
      {/* Top Navigation */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/10 z-50 flex items-center justify-between px-4 md:px-8">
        <Link to="/status" className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-primary" />
          <span className="font-title-lg text-xl font-bold text-surface-on">PROVA</span>
        </Link>
        <div className="flex items-center gap-4">
          {isOnboarding ? (
            <button className="text-surface-on-variant hover:text-primary transition-all font-label-md text-xs font-semibold uppercase tracking-wider">
              Cancel Onboarding
            </button>
          ) : (
            <button className="flex items-center gap-2 bg-surface-container-lowest border border-outline-variant/30 px-4 py-2 rounded-lg hover:bg-surface-variant transition-colors text-surface-on font-label-md text-xs font-semibold uppercase tracking-wider">
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 pt-24 pb-12 w-full">
        {children}
      </div>
    </div>
  );
}
