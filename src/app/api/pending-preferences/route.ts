import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { logger } from '@/libs/Logger';
import { getSupabaseAdmin } from '@/libs/Supabase';

/**
 * POST /api/pending-preferences
 * Saves anonymous user preferences to database (server-side backup)
 * Part of Phase 3.3 of the Category Preferences Signup Conversion Plan
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { anonymousId, categoryIds, expiresAt } = body;

    if (!anonymousId || !Array.isArray(categoryIds) || !expiresAt) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    const supabase = getSupabaseAdmin();

    // Upsert pending preferences (replace if exists for same anonymous ID)
    const { error } = await supabase
      .from('pending_preferences')
      .upsert(
        {
          anonymous_id: anonymousId,
          category_ids: categoryIds,
          expires_at: expiresAt,
        },
        {
          onConflict: 'anonymous_id',
        },
      );

    if (error) {
      logger.error('Error saving pending preferences', { error: error.message });
      return NextResponse.json(
        { error: 'Failed to save preferences' },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error('Unexpected error saving pending preferences', {
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

/**
 * GET /api/pending-preferences?anonymousId=...
 * Retrieves pending preferences by anonymous ID
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const anonymousId = searchParams.get('anonymousId');

    if (!anonymousId) {
      return NextResponse.json(
        { error: 'Missing anonymousId parameter' },
        { status: 400 },
      );
    }

    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from('pending_preferences')
      .select('category_ids, expires_at')
      .eq('anonymous_id', anonymousId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Not found
        return NextResponse.json({ preferences: null });
      }
      logger.error('Error fetching pending preferences', {
        error: error.message,
      });
      return NextResponse.json(
        { error: 'Failed to fetch preferences' },
        { status: 500 },
      );
    }

    // Check if expired
    if (data && new Date(data.expires_at) < new Date()) {
      return NextResponse.json({ preferences: null });
    }

    return NextResponse.json({
      preferences: data
        ? {
            categoryIds: data.category_ids,
            expiresAt: data.expires_at,
          }
        : null,
    });
  } catch (error) {
    logger.error('Unexpected error fetching pending preferences', {
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
