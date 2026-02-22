import { formatError, formatGapsOutput } from '../lib/format';
import { getSupabaseClient } from '../lib/supabase';

type GapsOptions = {
  json?: boolean;
  category?: string;
  limit?: number;
};

type GapItem = {
  id: string;
  title: string;
  status: string;
  issue: string;
  created_at: string;
};

export async function gapsCommand(options: GapsOptions): Promise<void> {
  try {
    const supabase = getSupabaseClient();
    const gaps: GapItem[] = [];
    const limit = options.limit ?? 50;

    // 1. Find items missing audio files
    const { data: itemsWithoutAudio, error: audioError } = await supabase
      .from('content_items')
      .select(`
        id,
        title,
        status,
        created_at,
        audio_files(id)
      `)
      .eq('status', 'done')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (audioError) {
      console.log(formatError(`Failed to check audio files: ${audioError.message}`));
      process.exit(1);
    }

    for (const item of itemsWithoutAudio ?? []) {
      const audioFiles = item.audio_files as Array<{ id: string }> | null;
      if (!audioFiles || audioFiles.length === 0) {
        gaps.push({
          id: item.id,
          title: item.title ?? 'Untitled',
          status: item.status ?? 'unknown',
          issue: 'Missing audio',
          created_at: item.created_at,
        });
      }
    }

    // 2. Find items with missing metadata (summary or key_insights)
    const { data: itemsWithMissingMeta, error: metaError } = await supabase
      .from('content_items')
      .select('id, title, status, created_at, summary, key_insights, image_url')
      .eq('status', 'done')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (metaError) {
      console.log(formatError(`Failed to check metadata: ${metaError.message}`));
      process.exit(1);
    }

    const existingIds = new Set(gaps.map(g => g.id));

    for (const item of itemsWithMissingMeta ?? []) {
      if (existingIds.has(item.id)) {
        continue;
      }

      if (!item.summary || item.summary.trim() === '') {
        gaps.push({
          id: item.id,
          title: item.title ?? 'Untitled',
          status: item.status ?? 'unknown',
          issue: 'Missing summary',
          created_at: item.created_at,
        });
        existingIds.add(item.id);
      } else if (!item.key_insights || (Array.isArray(item.key_insights) && item.key_insights.length === 0)) {
        gaps.push({
          id: item.id,
          title: item.title ?? 'Untitled',
          status: item.status ?? 'unknown',
          issue: 'Missing key insights',
          created_at: item.created_at,
        });
        existingIds.add(item.id);
      } else if (!item.image_url || item.image_url.trim() === '') {
        gaps.push({
          id: item.id,
          title: item.title ?? 'Untitled',
          status: item.status ?? 'unknown',
          issue: 'Missing image',
          created_at: item.created_at,
        });
        existingIds.add(item.id);
      }
    }

    // 3. Find items stuck in non-done status for >24h
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    const { data: stuckItems, error: stuckError } = await supabase
      .from('content_items')
      .select('id, title, status, created_at')
      .neq('status', 'done')
      .lt('created_at', oneDayAgo)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (stuckError) {
      console.log(formatError(`Failed to check stuck items: ${stuckError.message}`));
      process.exit(1);
    }

    for (const item of stuckItems ?? []) {
      if (existingIds.has(item.id)) {
        continue;
      }

      gaps.push({
        id: item.id,
        title: item.title ?? 'Untitled',
        status: item.status ?? 'unknown',
        issue: 'Stuck >24h',
        created_at: item.created_at,
      });
      existingIds.add(item.id);
    }

    // Sort by created_at descending
    gaps.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    console.log(formatGapsOutput(gaps.slice(0, limit), options.json ?? false));
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.log(formatError(message));
    process.exit(1);
  }
}
