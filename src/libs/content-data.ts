import { Env } from '@/libs/Env';
import { logger } from '@/libs/Logger';
import { getSupabaseAdmin } from '@/libs/Supabase';

type ContentItem = {
  id: string;
  title: string;
  summary: string | null;
  keyInsight: string[] | null;
  imageUrl: string | null;
  category: string;
  duration: number | null;
  created_at: string;
  audioUrl?: string | null;
};

export type CategoryGroup = {
  categoryName: string;
  items: ContentItem[];
};

export type FetchContentResult
  = | { ok: true; categories: CategoryGroup[] }
    | { ok: false; reason: 'no-config' | 'error'; message?: string };

export async function fetchCategorisedContent(): Promise<FetchContentResult> {
  const hasSupabaseUrl = !!Env.SUPABASE_URL;
  const hasSupabaseKey = !!Env.SUPABASE_SERVICE_ROLE_KEY;

  if (!hasSupabaseUrl || !hasSupabaseKey) {
    return { ok: false, reason: 'no-config' };
  }

  const supabase = getSupabaseAdmin();

  const { data: contentItems, error } = await supabase
    .from('content_items')
    .select(
      `
      id,
      title,
      summary,
      key_insights,
      image_url,
      created_at,
      status,
      content_item_tags(
        categories(
          name
        )
      ),
      content_sources(
        name
      ),
      audio_files!inner(
        file_url,
        duration
      )
    `,
    )
    .eq('status', 'done')
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    logger.error('Error fetching content items with audio', {
      error: error.message,
    });
    return { ok: false, reason: 'error', message: error.message };
  }

  const categoryMap = new Map<string, ContentItem[]>();

  contentItems?.forEach((item: any) => {
    const audioFile = item.audio_files?.[0];
    if (!audioFile) {
      return;
    }

    let categoryName = 'Uncategorized';
    const firstTag = item.content_item_tags?.[0] as any;
    if (firstTag?.categories?.name) {
      categoryName = firstTag.categories.name;
    } else if (item.content_sources) {
      const source = Array.isArray(item.content_sources)
        ? item.content_sources[0]
        : item.content_sources;
      if (source?.name) {
        categoryName = source.name;
      }
    }

    const contentItem: ContentItem = {
      id: item.id,
      title: item.title,
      summary: item.summary,
      keyInsight: item.key_insights || null,
      imageUrl:
        item.image_url && item.image_url.trim() !== '' ? item.image_url : null,
      created_at: item.created_at,
      category: categoryName,
      duration: audioFile.duration,
      audioUrl: audioFile.file_url,
    };

    if (!categoryMap.has(categoryName)) {
      categoryMap.set(categoryName, []);
    }
    categoryMap.get(categoryName)!.push(contentItem);
  });

  // Merge categories with the same name (case-insensitive)
  const mergedCategoryMap = new Map<string, CategoryGroup>();

  categoryMap.forEach((items, categoryName) => {
    const normalizedName = categoryName.toLowerCase();
    const existing = mergedCategoryMap.get(normalizedName);

    if (existing) {
      existing.items.push(...items);
    } else {
      mergedCategoryMap.set(normalizedName, {
        categoryName,
        items: [...items],
      });
    }
  });

  const categories = Array.from(mergedCategoryMap.values())
    .map(({ categoryName, items }) => ({
      categoryName,
      items: items.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      ),
    }))
    .sort((a, b) => a.categoryName.localeCompare(b.categoryName));

  return { ok: true, categories };
}
