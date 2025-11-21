import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { Webhook } from 'svix';
import { Env } from '@/libs/Env';
import { logger } from '@/libs/Logger';
import { userOperations } from '@/libs/Supabase';

// Disable body parsing, we need the raw body for webhook verification
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type WebhookEvent = {
  data: {
    id: string;
    email_addresses: Array<{
      id: string;
      email_address: string;
    }>;
    primary_email_address_id: string | null;
    first_name: string | null;
    last_name: string | null;
    image_url: string | null;
    created_at: number;
    updated_at: number;
  };
  object: string;
  type: string;
};

type UserCreatedEvent = WebhookEvent & { type: 'user.created' };
type UserUpdatedEvent = WebhookEvent & { type: 'user.updated' };
type UserDeletedEvent = WebhookEvent & { type: 'user.deleted' };

export async function POST(request: Request) {
  // Get the Svix headers for verification
  const headerPayload = await headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    logger.error('Missing svix headers in Clerk webhook request');
    return NextResponse.json(
      { error: 'Missing svix headers' },
      { status: 400 },
    );
  }

  // Get the raw body as text (required for svix verification)
  const body = await request.text();

  // Get the webhook signing secret from environment
  const webhookSecret = Env.CLERK_WEBHOOK_SIGNING_SECRET;

  if (!webhookSecret) {
    logger.error('CLERK_WEBHOOK_SIGNING_SECRET is not configured');
    return NextResponse.json(
      { error: 'Webhook secret not configured' },
      { status: 500 },
    );
  }

  // Create a new Svix instance with the webhook secret
  const wh = new Webhook(webhookSecret);

  let evt: WebhookEvent;

  // Verify the webhook
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    logger.error('Error verifying webhook', {
      error: err instanceof Error ? err.message : String(err),
    });
    return NextResponse.json(
      { error: 'Error verifying webhook' },
      { status: 400 },
    );
  }

  // Type narrowing for better type inference
  if (evt.type === 'user.created') {
    const event = evt as UserCreatedEvent;
    return handleUserCreated(event);
  } else if (evt.type === 'user.updated') {
    const event = evt as UserUpdatedEvent;
    return handleUserUpdated(event);
  } else if (evt.type === 'user.deleted') {
    const event = evt as UserDeletedEvent;
    return handleUserDeleted(event);
  } else {
    logger.warn('Unhandled webhook event type', { eventType: evt.type });
    return NextResponse.json(
      { error: 'Unhandled event type' },
      { status: 400 },
    );
  }
}

async function handleUserCreated(evt: UserCreatedEvent) {
  const userData = evt.data;
  const primaryEmail = getPrimaryEmail(userData);

  if (!primaryEmail) {
    logger.error('No email address found in Clerk webhook event', {
      userId: userData.id,
    });
    return NextResponse.json(
      { error: 'No email address found' },
      { status: 400 },
    );
  }

  try {
    logger.info('Syncing new Clerk user to Supabase', {
      clerkUserId: userData.id,
      email: primaryEmail,
    });

    // Create user in Supabase
    const supabaseUser = await userOperations.upsertUser(primaryEmail);

    logger.info('Successfully synced Clerk user to Supabase', {
      clerkUserId: userData.id,
      supabaseUserId: supabaseUser.id,
      email: primaryEmail,
    });

    return NextResponse.json({
      message: 'User created successfully',
      userId: supabaseUser.id,
    });
  } catch (error) {
    logger.error('Error processing user.created webhook', {
      error: error instanceof Error ? error.message : String(error),
      clerkUserId: userData.id,
      email: primaryEmail,
    });

    return NextResponse.json(
      {
        error: 'Error processing webhook',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}

async function handleUserUpdated(evt: UserUpdatedEvent) {
  const userData = evt.data;
  const primaryEmail = getPrimaryEmail(userData);

  if (!primaryEmail) {
    logger.error('No email address found in Clerk webhook event', {
      userId: userData.id,
    });
    return NextResponse.json(
      { error: 'No email address found' },
      { status: 400 },
    );
  }

  try {
    logger.info('Updating Clerk user in Supabase', {
      clerkUserId: userData.id,
      email: primaryEmail,
    });

    // Update user in Supabase (upsert in case it doesn't exist)
    const supabaseUser = await userOperations.upsertUser(primaryEmail);

    logger.info('Successfully updated Clerk user in Supabase', {
      clerkUserId: userData.id,
      supabaseUserId: supabaseUser.id,
      email: primaryEmail,
    });

    return NextResponse.json({
      message: 'User updated successfully',
      userId: supabaseUser.id,
    });
  } catch (error) {
    logger.error('Error processing user.updated webhook', {
      error: error instanceof Error ? error.message : String(error),
      clerkUserId: userData.id,
      email: primaryEmail,
    });

    return NextResponse.json(
      {
        error: 'Error processing webhook',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}

async function handleUserDeleted(evt: UserDeletedEvent) {
  const userData = evt.data;
  const primaryEmail = getPrimaryEmail(userData);

  // Note: We're not deleting users from Supabase on Clerk deletion
  // as they may have associated data. You can implement soft delete if needed.
  logger.info('Clerk user deleted (not removing from Supabase)', {
    clerkUserId: userData.id,
    email: primaryEmail || 'unknown',
  });

  return NextResponse.json({
    message: 'User deletion noted',
  });
}

function getPrimaryEmail(userData: WebhookEvent['data']): string | null {
  // Find the email object with matching ID, or use the first email
  const primaryEmailObj = userData.email_addresses.find(
    email => email.id === userData.primary_email_address_id,
  ) || userData.email_addresses[0];

  return primaryEmailObj?.email_address || null;
}
