import { formatError, formatHealthOutput } from '../lib/format';
import { checkEnvConfig, getSupabaseClient } from '../lib/supabase';

type HealthOptions = {
  json?: boolean;
};

export async function healthCommand(options: HealthOptions): Promise<void> {
  // First check environment variables
  const envCheck = checkEnvConfig();
  if (!envCheck.ok) {
    console.log(formatError(`Missing environment variables: ${envCheck.missing.join(', ')}`));
    process.exit(1);
  }

  const result = {
    database: { connected: false, latencyMs: undefined as number | undefined, error: undefined as string | undefined },
    contentCount: 0,
    audioCount: 0,
  };

  try {
    const supabase = getSupabaseClient();

    // Test database connection with a simple query
    const startTime = Date.now();
    const { error: pingError } = await supabase
      .from('content_items')
      .select('id')
      .limit(1);

    const latencyMs = Date.now() - startTime;

    if (pingError) {
      result.database = { connected: false, latencyMs: undefined, error: pingError.message };
    } else {
      result.database = { connected: true, latencyMs, error: undefined };
    }

    // Get content count
    const { count: contentCount, error: contentError } = await supabase
      .from('content_items')
      .select('*', { count: 'exact', head: true });

    if (!contentError && contentCount !== null) {
      result.contentCount = contentCount;
    }

    // Get audio files count
    const { count: audioCount, error: audioError } = await supabase
      .from('audio_files')
      .select('*', { count: 'exact', head: true });

    if (!audioError && audioCount !== null) {
      result.audioCount = audioCount;
    }

    console.log(formatHealthOutput(result, options.json ?? false));

    // Exit with error code if database connection failed
    if (!result.database.connected) {
      process.exit(1);
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    result.database = { connected: false, latencyMs: undefined, error: message };
    console.log(formatHealthOutput(result, options.json ?? false));
    process.exit(1);
  }
}
