import { currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { logger } from '@/libs/Logger';
import { userOperations } from '@/libs/Supabase';

/**
 * Manual sync endpoint to sync the current Clerk user to Supabase
 * This is useful for:
 * - Users created before webhook was configured
 * - Testing the sync functionality
 * - Manual recovery
 */
export async function POST() {
  try {
    // Check if Supabase is configured
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      logger.error('Supabase not configured', {
        hasUrl: !!process.env.SUPABASE_URL,
        hasKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      });
      return NextResponse.json(
        {
          error: 'Supabase not configured',
          message: 'SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set',
        },
        { status: 500 },
      );
    }

    // Get the current user from Clerk
    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 },
      );
    }

    // Get user email from Clerk
    const email = user.primaryEmailAddress?.emailAddress;

    if (!email) {
      logger.warn('No email found for Clerk user', { userId: user.id });
      return NextResponse.json(
        { error: 'User email not found' },
        { status: 404 },
      );
    }

    logger.info('Manually syncing Clerk user to Supabase', {
      clerkUserId: user.id,
      email,
    });

    // Sync user to Supabase
    const supabaseUser = await userOperations.upsertUser(email);

    logger.info('Successfully synced Clerk user to Supabase', {
      clerkUserId: user.id,
      supabaseUserId: supabaseUser.id,
      email,
    });

    return NextResponse.json({
      message: 'User synced successfully',
      user: {
        id: supabaseUser.id,
        email: supabaseUser.email,
        created_at: supabaseUser.created_at,
        updated_at: supabaseUser.updated_at,
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;

    logger.error('Error syncing user', {
      error: errorMessage,
      stack: errorStack,
    });

    // Return more detailed error information for debugging
    return NextResponse.json(
      {
        error: 'Error syncing user',
        message: errorMessage,
        details: process.env.NODE_ENV === 'development'
          ? {
              stack: errorStack,
              type: error?.constructor?.name,
            }
          : undefined,
      },
      { status: 500 },
    );
  }
}
