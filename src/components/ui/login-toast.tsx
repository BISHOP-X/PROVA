import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export function LoginToast() {
  const { user, loading } = useAuth();
  const [visible, setVisible] = useState(false);

  const message = useMemo(() => {
    if (!user) return '';
    const name = user.fullName || user.email;
    if (user.role === 'admin') return `Welcome back admin ${name}`;

    const seenKey = `prova_seen_user_${user.id}`;
    const hasSeenUser = localStorage.getItem(seenKey) === '1';
    return hasSeenUser ? `Welcome back beneficiary ${name}` : `Welcome ${name}`;
  }, [user]);

  useEffect(() => {
    if (loading || !user) return undefined;

    const sessionKey = `prova_toast_shown_${user.id}`;
    if (sessionStorage.getItem(sessionKey) === '1') return undefined;

    sessionStorage.setItem(sessionKey, '1');
    localStorage.setItem(`prova_seen_user_${user.id}`, '1');
    setVisible(true);

    const timer = window.setTimeout(() => setVisible(false), 4500);
    return () => window.clearTimeout(timer);
  }, [loading, user]);

  if (!visible || !message) return null;

  return (
    <div className="fixed right-4 top-20 z-[100] w-[min(92vw,360px)] rounded-lg border border-outline-variant bg-white p-4 shadow-xl">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 rounded-full bg-primary-fixed p-1 text-primary">
          <CheckCircle2 className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-on-surface">{message}</p>
          <p className="mt-1 text-xs text-on-surface-variant">Your secure PROVA session is active.</p>
        </div>
        <button
          type="button"
          aria-label="Dismiss notification"
          onClick={() => setVisible(false)}
          className="rounded p-1 text-on-surface-variant hover:bg-surface-container"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
