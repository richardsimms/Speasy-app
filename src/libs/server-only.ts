import { createClient } from '@supabase/supabase-js';
import { Env } from './Env';

export function createAdminClient() {
  if (typeof window !== 'undefined') {
    throw new TypeError('Admin client can only be used on the server');
  }

  // Use Env object for proper environment variable handling
  // Try server-side first, then fall back to public (for compatibility)
  const url = Env.SUPABASE_URL || Env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = Env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      `Supabase admin client configuration failed:\n`
      + `${!url ? 'Environment variables SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL: Required but not set\n' : ''}`
      + `${!serviceKey ? 'Environment variable SUPABASE_SERVICE_ROLE_KEY: Required but not set' : ''}`,
    );
  }

  return createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
