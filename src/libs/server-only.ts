import { createClient } from '@supabase/supabase-js';

export function createAdminClient() {
  if (typeof window !== 'undefined') {
    throw new TypeError('Admin client can only be used on the server');
  }

  // Access environment variables directly
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      `Supabase admin client configuration failed:\n`
      + `${!url ? 'Environment variable NEXT_PUBLIC_SUPABASE_URL: Required but not set\n' : ''}`
      + `${!serviceKey ? 'Environment variable SUPABASE_SERVICE_ROLE_KEY: Required but not set' : ''}`,
    );
  }

  return createClient(url, serviceKey);
}
