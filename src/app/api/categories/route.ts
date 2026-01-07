import { NextResponse } from 'next/server';
import { logger } from '@/libs/Logger';
import { getSupabaseAdmin } from '@/libs/Supabase';

/**
 * GET /api/categories
 * Returns all available categories for the category picker
 * Part of Phase 2.2 of the Category Preferences Signup Conversion Plan
 */
export async function GET() {
  try {
    const supabase = getSupabaseAdmin();

    const { data: categories, error } = await supabase
      .from('categories')
      .select('id, name, slug, description, image_url')
      .order('name', { ascending: true });

    if (error) {
      logger.error('Error fetching categories', { error: error.message });
      return NextResponse.json(
        { error: 'Failed to fetch categories' },
        { status: 500 },
      );
    }

    return NextResponse.json({
      categories: categories || [],
    });
  } catch (error) {
    logger.error('Unexpected error fetching categories', {
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
