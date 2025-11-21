import { currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { logger } from '@/libs/Logger';
import { userOperations } from '@/libs/Supabase';

export async function GET() {
  try {
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

    // Get user from Supabase by email
    const supabaseUser = await userOperations.getUserByEmail(email);

    if (!supabaseUser) {
      logger.warn('User not found in Supabase', { userId: user.id, email });
      return NextResponse.json(
        { error: 'User not found in database' },
        { status: 404 },
      );
    }

    logger.info('Retrieved user from Supabase', {
      userId: user.id,
      supabaseUserId: supabaseUser.id,
      email,
    });

    // Return user data (excluding sensitive fields if needed)
    return NextResponse.json({
      id: supabaseUser.id,
      email: supabaseUser.email,
      created_at: supabaseUser.created_at,
      updated_at: supabaseUser.updated_at,
      stripe_customer_id: supabaseUser.stripe_customer_id,
      subscription_status: supabaseUser.subscription_status,
      subscription_end_date: supabaseUser.subscription_end_date,
    });
  } catch (error) {
    logger.error('Error fetching user from Supabase', {
      error: error instanceof Error ? error.message : String(error),
    });

    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
