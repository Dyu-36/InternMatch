'use client';

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
export const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
export const supabaseConfigured = Boolean(supabaseUrl && supabaseKey);

const SESSION_STORAGE_KEY = 'internmatch_supabase_session';

export type SupabaseSession = {
  access_token: string;
  refresh_token?: string;
  expires_at?: number;
  user: { id: string; email?: string; user_metadata?: Record<string, unknown> };
};

export function toAuthEmail(username: string) {
  return `${username.trim().toLowerCase()}@internmatch.local`;
}

export function loadStoredSession(): SupabaseSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const value = window.localStorage.getItem(SESSION_STORAGE_KEY);
    return value ? (JSON.parse(value) as SupabaseSession) : null;
  } catch {
    return null;
  }
}

export function saveStoredSession(session: SupabaseSession | null) {
  if (typeof window === 'undefined') return;
  if (session) window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  else window.localStorage.removeItem(SESSION_STORAGE_KEY);
}

async function readError(response: Response) {
  try {
    const body = await response.json() as { message?: string; error_description?: string; msg?: string };
    return body.message ?? body.error_description ?? body.msg ?? `Supabase request failed (${response.status})`;
  } catch {
    return `Supabase request failed (${response.status})`;
  }
}

function authHeaders(accessToken?: string) {
  return {
    apikey: supabaseKey,
    Authorization: `Bearer ${accessToken ?? supabaseKey}`,
    'Content-Type': 'application/json',
  };
}

export async function supabaseAuthSignIn(username: string, password: string) {
  const response = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ email: toAuthEmail(username), password }),
  });
  if (!response.ok) throw new Error(await readError(response));
  return response.json() as Promise<SupabaseSession>;
}

export async function supabaseAuthSignUp(username: string, password: string, role: 'STUDENT' | 'COMPANY') {
  const response = await fetch(`${supabaseUrl}/auth/v1/signup`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({
      email: toAuthEmail(username),
      password,
      data: { username: username.trim(), name: username.trim(), role },
    }),
  });
  if (!response.ok) throw new Error(await readError(response));
  return response.json() as Promise<SupabaseSession & { session: SupabaseSession | null }>;
}

export async function supabaseAuthSignOut(accessToken: string) {
  await fetch(`${supabaseUrl}/auth/v1/logout`, {
    method: 'POST',
    headers: authHeaders(accessToken),
  });
}

export async function supabaseRest<T = unknown>(path: string, init: RequestInit = {}, accessToken?: string): Promise<T> {
  const response = await fetch(`${supabaseUrl}/rest/v1/${path}`, {
    ...init,
    headers: {
      ...authHeaders(accessToken),
      ...(init.headers ?? {}),
    },
  });
  if (!response.ok) throw new Error(await readError(response));
  if (response.status === 204) return null as T;
  return response.json() as Promise<T>;
}

export async function supabaseStorageUpload(bucket: string, path: string, file: File, accessToken?: string) {
  const response = await fetch(`${supabaseUrl}/storage/v1/object/${bucket}/${path}`, {
    method: 'POST',
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${accessToken ?? supabaseKey}`,
      'Content-Type': file.type || 'application/octet-stream',
      'x-upsert': 'true',
    },
    body: file,
  });
  if (!response.ok) throw new Error(await readError(response));
  return path;
}

export function publicStorageUrl(bucket: string, path: string) {
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`;
}
