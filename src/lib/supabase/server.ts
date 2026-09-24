import 'server-only';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { supabasePublishableKey, supabaseUrl } from './config';

export async function createClient() {
  const store = await cookies();
  if (!supabaseUrl || !supabasePublishableKey) throw new Error('Supabase environment is not configured.');
  return createServerClient(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll: () => store.getAll(),
      setAll(values) {
        try { values.forEach(({ name, value, options }) => store.set(name, value, options)); }
        catch { /* Server Components rely on proxy.ts for refreshed cookies. */ }
      },
    },
  });
}
