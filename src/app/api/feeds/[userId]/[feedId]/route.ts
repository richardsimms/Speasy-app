import type { NextRequest } from 'next/server';
import type { ContentItem } from '@/libs/feed-generator';
import { unstable_cache } from 'next/cache';

import { NextResponse } from 'next/server';
import { generateRssFeedAsync } from '@/libs/feed-generator';
import { logger } from '@/libs/Logger';
import { createAdminClient } from '@/libs/server-only';

type FeedData = {
  feed: { id: string; title: string | null; description: string | null };
  contentItems: ContentItem[];
};

async function fetchFeedDataUncached(userId: string, feedId: string): Promise<FeedData | null> {
  const supabase = createAdminClient();

  // Find feed for this user and feedId
  // If feedId is "default", look for is_default=true, otherwise match feed_url ending
  let feedQuery = supabase
    .from('podcast_feeds')
    .select('id, title, description')
    .eq('user_id', userId);

  if (feedId === 'default') {
    feedQuery = feedQuery.eq('is_default', true);
  } else {
    feedQuery = feedQuery.ilike('feed_url', `%/${feedId}`);
  }

  const { data: feed, error: feedError } = await feedQuery.single();

  if (feedError || !feed) {
    logger.error('Feed fetch error', { error: feedError, userId, feedId });
    return null;
  }

  const { data: subscriptions } = await supabase
    .from('user_category_subscriptions')
    .select('category_id')
    .eq('user_id', userId);

  const subscribedCategoryIds
    = subscriptions?.map((s: { category_id: string }) => s.category_id) || [];

  let latestContent: any[] = [];

  if (subscribedCategoryIds.length > 0) {
    const { data: contentItems } = await supabase
      .from('content_items')
      .select(`
        id, title, summary, url, published_at, content,
        source:content_sources!inner(name, category_id),
        audio:audio_files(file_url, duration, type)
      `)
      .eq('status', 'done') // Only include processed, non-archived content
      .in('source.category_id', subscribedCategoryIds)
      .order('created_at', { ascending: false })
      .limit(100); // Fetch more items to account for filtering

    latestContent = contentItems ?? [];
  }

  if (latestContent.length === 0) {
    const { data: fallbackContent } = await supabase
      .from('content_items')
      .select(`
        id, title, summary, url, published_at, content,
        source:content_sources(name),
        audio:audio_files(file_url, duration, type)
      `)
      .eq('status', 'done') // Only include processed, non-archived content
      .order('created_at', { ascending: false })
      .limit(100); // Fetch more items to account for filtering

    latestContent = fallbackContent ?? [];
  }

  // Filter for items with audio, then limit to 50 for RSS feed
  const contentItems: ContentItem[] = latestContent
    .filter(item => item.audio?.length > 0)
    .slice(0, 50) // Limit to 50 items for RSS feed
    .map(item => ({
      id: item.id,
      title: item.title,
      summary: item.summary,
      url: item.url,
      published_at: item.published_at,
      // Use 'content' field from database, which contains HTML content
      // Convert to markdown-friendly format by using content if available, otherwise summary
      content_markdown: item.content || item.summary || '',
      source: item.source?.[0] ? { name: item.source[0].name } : undefined,
      audio: item.audio,
    }));

  return {
    feed: { id: feed.id, title: feed.title, description: feed.description },
    contentItems,
  };
}

// Podcast clients re-poll subscribed feeds every 15-60 min per subscriber,
// uncorrelated with site traffic, so cache the whole lookup+query chain
// rather than re-running it against Supabase on every poll.
function fetchFeedData(userId: string, feedId: string): Promise<FeedData | null> {
  const cached = unstable_cache(
    fetchFeedDataUncached,
    ['podcast-feed', userId, feedId],
    { revalidate: 900, tags: ['content', `feed-${userId}-${feedId}`] },
  );
  return cached(userId, feedId);
}

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ userId: string; feedId: string }> },
) {
  const { userId, feedId } = await context.params;

  logger.debug('Feed request received', { userId });
  try {
    const data = await fetchFeedData(userId, feedId);

    if (!data) {
      return new NextResponse('Feed not found', { status: 404 });
    }

    const rssFeedXml = await generateRssFeedAsync(data.contentItems, {
      title: data.feed.title || 'Speasy Feed',
      description: data.feed.description || 'Your personalized audio feed',
      userId,
      feedId: data.feed.id, // use real UUID
    });

    return new NextResponse(rssFeedXml, {
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
      },
    });
  } catch (error) {
    logger.error('Error generating feed', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      userId,
      feedId,
    });
    return new NextResponse(
      `Error generating feed: ${error instanceof Error ? error.message : String(error)}`,
      { status: 500 },
    );
  }
}
