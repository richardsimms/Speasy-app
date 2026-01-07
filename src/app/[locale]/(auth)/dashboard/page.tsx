import type { Metadata } from 'next';
import { auth, currentUser } from '@clerk/nextjs/server';
import { getTranslations } from 'next-intl/server';
import { DiscoverGrid } from '@/components/discover-grid';
import { Env } from '@/libs/Env';
import { getSupabaseAdmin } from '@/libs/Supabase';

// Force dynamic rendering since this page requires user-specific data
export const dynamic = 'force-dynamic';

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

export default async function Dashboard(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;

  // Check if Supabase is configured before attempting to use it
  const hasSupabaseUrl = !!Env.SUPABASE_URL;
  const hasSupabaseKey = !!Env.SUPABASE_SERVICE_ROLE_KEY;

  if (!hasSupabaseUrl || !hasSupabaseKey) {
    return (
      <div className="py-5 [&_p]:my-6">
        <div className="mx-auto max-w-7xl px-4">
          <h1 className="mb-12 text-4xl font-bold text-white">Discover</h1>
          <div className="py-20 text-center">
            <p className="text-muted-foreground">
              Content is not available. Please check your configuration.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const supabase = getSupabaseAdmin();

  // Get current user for personalization
  await auth();
  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress;

  // Get user's Supabase ID and preferences
  let subscribedCategoryIds: string[] = [];
  let subscribedCategoryNames: string[] = [];
  let listenedContentIds: string[] = [];

  if (email) {
    const { data: supabaseUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (supabaseUser) {
      // Fetch user's category subscriptions
      const { data: subscriptions } = await supabase
        .from('user_category_subscriptions')
        .select('category_id')
        .eq('user_id', supabaseUser.id);

      subscribedCategoryIds = subscriptions?.map(s => s.category_id) || [];
      // Fetch category names for subscribed categories (for name-based matching fallback)
      if (subscribedCategoryIds.length > 0) {
        const { data: subscribedCategories } = await supabase
          .from('categories')
          .select('id, name')
          .in('id', subscribedCategoryIds);
        subscribedCategoryNames = subscribedCategories?.map(c => c.name.toLowerCase()) || [];
      }

      // Fetch listen history
      const { data: listenHistory } = await supabase
        .from('listen_history')
        .select('content_id')
        .eq('user_id', supabaseUser.id);

      listenedContentIds = listenHistory?.map(l => l.content_id) || [];
    }
  }

  // Fetch content items with categories and audio files
  const { data: contentItems, error } = await supabase
    .from('content_items')
    .select(
      `
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
      content_sources(
        name
      ),
      audio_files(
        file_url,
        duration
      )
    `,
    )
    .eq('status', 'done')
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="mb-8 text-4xl font-bold text-white">Discover</h1>
        <p className="text-red-500">
          Error loading content. Please try again later.
        </p>
      </div>
    );
  }

  // Transform and group by category
  const categoryMap = new Map<
    string,
    Array<{
      id: string;
      title: string;
      summary: string | null;
      imageUrl: string | null;
      category: string;
      duration: number | null;
      created_at: string;
    }>
  >();

  // Track items for "For You" feed (filtered by preferences)
  const forYouItems: Array<{
    id: string;
    title: string;
    summary: string | null;
    imageUrl: string | null;
    category: string;
    duration: number | null;
    created_at: string;
  }> = [];

  contentItems?.forEach((item: any) => {
    // Get the first audio file (items can have multiple)
    const audioFile = item.audio_files?.[0];

    // Skip items without audio files
    if (!audioFile) {
      return;
    }

    // Get category from tags, or fall back to content_sources.name, or default to "Uncategorized"
    let categoryName = 'Uncategorized';
    let categoryId: string | null = null;
    const firstTag = item.content_item_tags?.[0] as any;
    if (firstTag?.categories) {
      categoryName = firstTag.categories.name || categoryName;
      categoryId = firstTag.categories.id || null;
    } else if (item.content_sources) {
      const source = Array.isArray(item.content_sources)
        ? item.content_sources[0]
        : item.content_sources;
      if (source?.name) {
        categoryName = source.name;
      }
    }

    const contentItem = {
      id: item.id,
      title: item.title,
      summary: item.summary,
      imageUrl: item.image_url,
      created_at: item.created_at,
      category: categoryName,
      duration: audioFile.duration,
    };

    // Add to category map (for category tabs)
    if (!categoryMap.has(categoryName)) {
      categoryMap.set(categoryName, []);
    }
    categoryMap.get(categoryName)!.push(contentItem);

    // Add to "For You" feed if:
    // 1. User has preferences AND item matches a subscribed category (by ID or name)
    // 2. OR user has no preferences (show all)
    // 3. AND item hasn't been listened to
    const isNotListened = !listenedContentIds.includes(item.id);

    let isInSubscribedCategory = false;

    if (subscribedCategoryIds.length === 0) {
      // No preferences = show all
      isInSubscribedCategory = true;
    } else {
      // Check if item matches subscribed categories
      // First check by category ID
      if (categoryId && subscribedCategoryIds.includes(categoryId)) {
        isInSubscribedCategory = true;
      } else if (subscribedCategoryNames.length > 0) {
        // Fallback: match by category name (case-insensitive)
        // This handles cases where content_item_tags might not have category IDs
        if (subscribedCategoryNames.includes(categoryName.toLowerCase())) {
          isInSubscribedCategory = true;
        }
      }
    }

    if (isInSubscribedCategory && isNotListened) {
      forYouItems.push(contentItem);
    }
  });

  // Sort "For You" items by created_at (newest first)
  forYouItems.sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );

  // Merge categories with the same name (case-insensitive)
  const mergedCategoryMap = new Map<
    string,
    {
      categoryName: string;
      items: Array<{
        id: string;
        title: string;
        summary: string | null;
        imageUrl: string | null;
        category: string;
        duration: number | null;
        created_at: string;
      }>;
    }
  >();

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

  // Convert to array and sort categories
  const categories = Array.from(mergedCategoryMap.values())
    .map(({ categoryName, items }) => ({
      categoryName,
      items: items.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      ),
    }))
    .sort((a, b) => a.categoryName.localeCompare(b.categoryName));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
      <DiscoverGrid
        categories={categories}
        locale={locale}
        surface="dashboard"
        forYouItems={forYouItems}
        showEmptyState={subscribedCategoryIds.length > 0 && forYouItems.length === 0}
      />
    </div>
  );
}
