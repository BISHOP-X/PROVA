const KEY = 'prova_user_v1_session';
const COOKIE_NAME = 'prova_session';
const ONE_HOUR_MS = 60 * 60 * 1000;

export function setCookie(name: string, value: string, maxAgeSeconds: number) {
  document.cookie = `${name}=${value}; max-age=${maxAgeSeconds}; path=/`;
}

export function deleteCookie(name: string) {
  document.cookie = `${name}=; max-age=0; path=/`;
}

export function createSession(user: any) {
  const expiresAt = Date.now() + ONE_HOUR_MS;
  const payload = { user, expiresAt };
  try {
    localStorage.setItem(KEY, JSON.stringify(payload));
    // Cookie used for quick existence check; token-free for demo
    setCookie(COOKIE_NAME, '1', Math.floor(ONE_HOUR_MS / 1000));
    console.log('[session] createSession', { user, expiresAt });
  } catch {
    // ignore
  }
}

export function getSession() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { user: any; expiresAt: number };
    if (!parsed || !parsed.expiresAt || Date.now() > parsed.expiresAt) {
      clearSession();
      return null;
    }
    console.log('[session] getSession OK', { user: parsed.user });
    return parsed.user;
  } catch {
    return null;
  }
}

export function clearSession() {
  try {
    localStorage.removeItem(KEY);
    deleteCookie(COOKIE_NAME);
  } catch {
    // ignore
  }
}

export function getSessionExpiresAt(): number | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { user: any; expiresAt: number };
    return parsed?.expiresAt ?? null;
  } catch {
    return null;
  }
}
