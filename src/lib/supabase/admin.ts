import 'server-only';

import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { supabaseUrl } from './config';

export function createAdminClient() {
  const key = process.env.INTERNMATCH_SUPABASE_SECRET_KEY ||
    (!process.env.NEXT_PUBLIC_INTERNMATCH_SUPABASE_URL ? process.env.SUPABASE_SERVICE_ROLE_KEY : undefined);
  if (!supabaseUrl || !key) return null;
  return createSupabaseClient(supabaseUrl, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
