import { createClient } from '@supabase/supabase-js';

type EnvConfig = {
  supabaseUrl: string;
  supabaseKey: string;
};

function loadEnv(): EnvConfig {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    throw new Error('SUPABASE_URL environment variable is not set');
  }
  if (!supabaseKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY environment variable is not set');
  }

  return { supabaseUrl, supabaseKey };
}

export function getSupabaseClient() {
  const { supabaseUrl, supabaseKey } = loadEnv();

  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export function checkEnvConfig(): { ok: true } | { ok: false; missing: string[] } {
  const missing: string[] = [];

  if (!process.env.SUPABASE_URL) {
    missing.push('SUPABASE_URL');
  }
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    missing.push('SUPABASE_SERVICE_ROLE_KEY');
  }

  if (missing.length > 0) {
    return { ok: false, missing };
  }

  return { ok: true };
}
