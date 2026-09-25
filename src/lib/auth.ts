const AUTH_EMAIL_DOMAIN =
  process.env.NEXT_PUBLIC_AUTH_EMAIL_DOMAIN ??
  process.env.AUTH_EMAIL_DOMAIN ??
  'internmatch.vercel.app';

function hash32(value: string, seed: number) {
  let hash = seed;
  for (let index = 0; index < value.length; index += 1) {
    hash = Math.imul(hash ^ value.charCodeAt(index), 16777619) >>> 0;
  }
  return hash.toString(36).padStart(7, '0');
}

export function authEmail(username: string) {
  return `${username.trim().toLowerCase()}@${AUTH_EMAIL_DOMAIN}`;
}

export function loginEmail(identifier: string) {
  const value = identifier.trim().toLowerCase();
  return value.includes('@') ? value : authEmail(value);
}

export function registrationUsername(email: string) {
  const localPart = email
    .split('@', 1)[0]
    .normalize('NFKD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 16);
  const stem = localPart.length >= 3 ? localPart : 'user';
  return `${stem}_${hash32(email, 2166136261)}${hash32(email, 3335557771)}`;
}

export function safeInternalPath(value: unknown, fallback: string, allow?: (pathname: string) => boolean) {
  if (typeof value !== 'string' || value.length > 2048 || !value.startsWith('/') || value.startsWith('//') || value.includes('\\')) {
    return fallback;
  }
  try {
    const url = new URL(value, 'https://internmatch.invalid');
    if (url.origin !== 'https://internmatch.invalid' || !url.pathname.startsWith('/') || url.pathname.startsWith('//')) return fallback;
    if (allow && !allow(url.pathname)) return fallback;
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return fallback;
  }
}

export function safeLoginPath(value: unknown, fallback: string) {
  return safeInternalPath(value, fallback, (pathname) => {
    if (pathname === '/student' || pathname.startsWith('/student/') || pathname === '/company' || pathname.startsWith('/company/')) {
      return true;
    }
    return /^\/jobs\/[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(pathname);
  });
}

function trustedOrigin(value: string, requireHttps: boolean) {
  const url = new URL(value.includes('://') ? value : `https://${value}`);
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || (requireHttps && url.protocol !== 'https:')) {
    throw new Error('NEXT_PUBLIC_SITE_URL must be a trusted HTTP(S) origin.');
  }
  return url.origin;
}

export function getSiteUrl() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL;
  if (configured) return trustedOrigin(configured, process.env.NODE_ENV === 'production');
  const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
  if (vercelHost) return trustedOrigin(vercelHost, true);
  if (process.env.NODE_ENV !== 'production') return `http://localhost:${process.env.PORT || '3000'}`;
  throw new Error('NEXT_PUBLIC_SITE_URL is required in production.');
}
