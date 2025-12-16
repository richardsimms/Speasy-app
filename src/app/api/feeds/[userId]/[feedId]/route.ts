import type { NextRequest } from 'next/server';
import type { ContentItem } from '@/libs/feed-generator';

import { NextResponse } from 'next/server';
import { generateRssFeedAsync } from '@/libs/feed-generator';
import { logger } from '@/libs/Logger';
import { createAdminClient } from '@/libs/server-only';

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ userId: string; feedId: string }> },
) {
  const { userId, feedId } = await context.params;

  logger.debug('Feed request received', { userId });
  try {
    const supabase = createAdminClient();

    // Find feed for this user and feedId
    const { data: feed, error: feedError } = await supabase
      .from('podcast_feeds')
      .select('*')
      .eq('user_id', userId)
      .eq('feed_url', feedId)
      .single();

    if (!feed || feedError) {
      logger.error('Feed fetch error', { error: feedError, userId, feedId });
      return new NextResponse('Feed not found', { status: 404 });
    }

    // Handle user preferences and ensure defaults exist for new users
    try {
      const {
        getUserPreferencesWithDefaults,
        createDefaultPreferences,
        // @ts-expect-error - preferences-server may not exist, handled in catch
      } = await import('@/libs/preferences-server');

      // This will return defaults if user has no preferences
      const userPreferences = await getUserPreferencesWithDefaults(userId);

      // If no preferences were found, try to create defaults
      if (
        !userPreferences.categoryPreferences
        || userPreferences.categoryPreferences.length === 0
      ) {
        // Get user email for profile creation
        const { data: authUser }
          = await supabase.auth.admin.getUserById(userId);
        if (authUser.user?.email) {
          await createDefaultPreferences(userId, authUser.user.email);
          logger.info('Created default preferences for user during feed generation', {
            userId,
          });
        }
      }
    } catch (preferencesError) {
      logger.warn('Error handling user preferences during feed generation', {
        error: preferencesError,
        userId,
        feedId,
      });
      // Continue with feed generation even if preferences fail
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
          *,
          source:content_sources!inner(name, category_id),
          audio:audio_files(file_url, duration, type)
        `)
        .eq('status', 'done') // Only include processed, non-archived content
        .in('source.category_id', subscribedCategoryIds)
        .order('created_at', { ascending: false })
        .limit(10);

      latestContent = contentItems ?? [];
    }

    if (latestContent.length === 0) {
      const { data: fallbackContent } = await supabase
        .from('content_items')
        .select(`
          *,
          source:content_sources(name, category_id),
          audio:audio_files(file_url, duration, type)
        `)
        .eq('status', 'done') // Only include processed, non-archived content
        .order('created_at', { ascending: false })
        .limit(10);

      latestContent = fallbackContent ?? [];
    }

    const contentItems: ContentItem[] = latestContent
      .filter(item => item.audio?.length > 0)
      .map(item => ({
        id: item.id,
        title: item.title,
        summary: item.summary,
        url: item.url,
        published_at: item.published_at,
        content_markdown: item.content_markdown,
        source: item.source?.[0] ? { name: item.source[0].name } : undefined,
        audio: item.audio,
      }));

    const rssFeedXml = await generateRssFeedAsync(contentItems, {
      title: feed.title || 'Speasy Feed',
      description: feed.description || 'Your personalized audio feed',
      userId,
      feedId: feed.id, // use real UUID
    });

    return new NextResponse(rssFeedXml, {
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
      },
    });
  } catch (error) {
    logger.error('Error generating feed', { error, userId, feedId });
    return new NextResponse('Error generating feed', { status: 500 });
  }
}
