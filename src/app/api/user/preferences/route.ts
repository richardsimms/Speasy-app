import type { NextRequest } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { logger } from '@/libs/Logger';
import { getSupabaseAdmin } from '@/libs/Supabase';

/**
 * GET /api/user/preferences
 * Returns the current user's category preferences
 * Part of Phase 4 and 5 of the Category Preferences Signup Conversion Plan
 */
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 },
      );
    }

    const user = await currentUser();
    const email = user?.primaryEmailAddress?.emailAddress;

    if (!email) {
      return NextResponse.json(
        { error: 'User email not found' },
        { status: 404 },
      );
    }

    const supabase = getSupabaseAdmin();

    // Get Supabase user ID
    const { data: supabaseUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (!supabaseUser) {
      return NextResponse.json(
        { error: 'User not found in database' },
        { status: 404 },
      );
    }

    // Get user's category subscriptions
    const { data: subscriptions, error } = await supabase
      .from('user_category_subscriptions')
      .select('category_id')
      .eq('user_id', supabaseUser.id);

    if (error) {
      logger.error('Error fetching user preferences', {
        error: error.message,
        userId: supabaseUser.id,
      });
      return NextResponse.json(
        { error: 'Failed to fetch preferences' },
        { status: 500 },
      );
    }

    const categoryIds = subscriptions?.map(s => s.category_id) || [];

    return NextResponse.json({ categoryIds });
  } catch (error) {
    logger.error('Unexpected error fetching user preferences', {
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

/**
 * PUT /api/user/preferences
 * Updates the current user's category preferences
 * Part of Phase 4 and 5 of the Category Preferences Signup Conversion Plan
 */
export async function PUT(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 },
      );
    }

    const user = await currentUser();
    const email = user?.primaryEmailAddress?.emailAddress;

    if (!email) {
      return NextResponse.json(
        { error: 'User email not found' },
        { status: 404 },
      );
    }

    const body = await request.json();
    const { categoryIds } = body;

    if (!Array.isArray(categoryIds)) {
      return NextResponse.json(
        { error: 'categoryIds must be an array' },
        { status: 400 },
      );
    }

    if (categoryIds.length === 0) {
      return NextResponse.json(
        { error: 'At least one category must be selected' },
        { status: 400 },
      );
    }

    const supabase = getSupabaseAdmin();

    // Get Supabase user ID
    const { data: supabaseUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (!supabaseUser) {
      return NextResponse.json(
        { error: 'User not found in database' },
        { status: 404 },
      );
    }

    // Delete existing subscriptions
    const { error: deleteError } = await supabase
      .from('user_category_subscriptions')
      .delete()
      .eq('user_id', supabaseUser.id);

    if (deleteError) {
      logger.error('Error deleting existing preferences', {
        error: deleteError.message,
        userId: supabaseUser.id,
      });
      return NextResponse.json(
        { error: 'Failed to update preferences' },
        { status: 500 },
      );
    }

    // Insert new subscriptions
    const subscriptions = categoryIds.map((categoryId: string) => ({
      user_id: supabaseUser.id,
      category_id: categoryId,
    }));

    const { error: insertError } = await supabase
      .from('user_category_subscriptions')
      .insert(subscriptions);

    if (insertError) {
      logger.error('Error inserting preferences', {
        error: insertError.message,
        userId: supabaseUser.id,
      });
      return NextResponse.json(
        { error: 'Failed to save preferences' },
        { status: 500 },
      );
    }

    logger.info('Successfully updated user preferences', {
      userId: supabaseUser.id,
      categoryCount: categoryIds.length,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error('Unexpected error updating user preferences', {
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
