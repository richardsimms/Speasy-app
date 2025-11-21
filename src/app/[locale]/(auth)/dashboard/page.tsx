import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { DashboardContent } from '@/components/dashboard-content';
import { getSupabaseAdmin } from '@/libs/Supabase';

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({
    locale,
    namespace: 'Dashboard',
  });

  return {
    title: t('meta_title'),
  };
}

export default async function Dashboard() {
  const supabase = getSupabaseAdmin();

  // Fetch content items with categories and audio files
  // Use LEFT joins to include items with audio even if they don't have tags
  // Then filter to only show items that have audio files
  const { data: contentItems, error } = await supabase
    .from('content_items')
    .select(`
      id,
      title,
      summary,
      image_url,
      created_at,
      content_item_tags(
        categories(
          name
        )
      ),
      audio_files(
        file_url,
        duration
      )
    `)
    .eq('status', 'done')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching content items:', error);
    return (
      <div className="py-5 [&_p]:my-6">
        <p className="text-red-500">Error loading content. Please try again later.</p>
      </div>
    );
  }

  // Transform and group by category
  const categoryMap = new Map<string, Array<{
    id: string;
    title: string;
    summary: string | null;
    audioUrl: string;
    imageUrl: string | null;
    category: string;
    duration: number | null;
    created_at: string;
  }>>();

  contentItems?.forEach((item: any) => {
    // Get the first audio file (items can have multiple)
    const audioFile = item.audio_files?.[0];

    // Skip items without audio files
    if (!audioFile) {
      return;
    }

    // Get category from tags, or default to "Uncategorized"
    // Handle both single tag and multiple tags
    let categoryName = 'Uncategorized';
    if (item.content_item_tags && item.content_item_tags.length > 0) {
      const firstTag = item.content_item_tags[0];
      categoryName = firstTag?.categories?.name || 'Uncategorized';
    }

    const contentItem = {
      id: item.id,
      title: item.title,
      summary: item.summary,
      imageUrl: item.image_url,
      created_at: item.created_at,
      category: categoryName,
      audioUrl: audioFile.file_url,
      duration: audioFile.duration,
    };

    if (!categoryMap.has(categoryName)) {
      categoryMap.set(categoryName, []);
    }
    categoryMap.get(categoryName)!.push(contentItem);
  });

  // Convert to array and sort categories
  const categories = Array.from(categoryMap.entries())
    .map(([categoryName, items]) => ({
      categoryName,
      items: items.sort((a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      ),
    }))
    .sort((a, b) => a.categoryName.localeCompare(b.categoryName));

  return (
    <div className="py-5 [&_p]:my-6">
      <div className="mx-auto max-w-7xl px-4">
        <h1 className="mb-12 text-4xl font-bold text-white">Your Content</h1>
        <DashboardContent categories={categories} />
      </div>
    </div>
  );
}
