import { formatError, formatStatusOutput } from '../lib/format';
import { getSupabaseClient } from '../lib/supabase';

type StatusOptions = {
  json?: boolean;
};

export async function statusCommand(options: StatusOptions): Promise<void> {
  try {
    const supabase = getSupabaseClient();

    // Get counts for each status using separate count queries (more efficient than fetching all)
    const statusTypes = ['done', 'archived', 'pending', 'processing', 'failed'] as const;
    const counts: Record<string, number> = {};

    // Fetch counts in parallel
    const countPromises = statusTypes.map(async (status) => {
      const { count, error } = await supabase
        .from('content_items')
        .select('*', { count: 'exact', head: true })
        .eq('status', status);

      if (error) {
        throw new Error(`Failed to count ${status}: ${error.message}`);
      }

      return { status, count: count ?? 0 };
    });

    // Also get total count
    const totalPromise = supabase
      .from('content_items')
      .select('*', { count: 'exact', head: true });

    const [results, totalResult] = await Promise.all([
      Promise.all(countPromises),
      totalPromise,
    ]);

    if (totalResult.error) {
      throw new Error(`Failed to count total: ${totalResult.error.message}`);
    }

    for (const result of results) {
      counts[result.status] = result.count;
    }

    const total = totalResult.count ?? 0;

    // Calculate "other" as any status not in our list
    const knownCount = Object.values(counts).reduce((sum, c) => sum + c, 0);
    const otherCount = total - knownCount;

    const output = {
      done: counts.done ?? 0,
      archived: counts.archived ?? 0,
      pending: counts.pending ?? 0,
      processing: counts.processing ?? 0,
      failed: counts.failed ?? 0,
      other: otherCount,
      total,
    };

    console.log(formatStatusOutput(output, options.json ?? false));
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.log(formatError(message));
    process.exit(1);
  }
}
