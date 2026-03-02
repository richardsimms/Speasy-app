import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { Env } from '@/libs/Env';
import { logger } from '@/libs/Logger';
import { userOperations } from '@/libs/Supabase';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type WebhookEvent = {
  data: {
    id: string;
    email_addresses?: Array<{ id: string; email_address: string }>;
    primary_email_address_id?: string | null;
    email?: string;
  };
  type: 'user.created' | 'user.updated' | 'user.deleted';
};

type UserCreatedEvent = WebhookEvent & { type: 'user.created' };
type UserUpdatedEvent = WebhookEvent & { type: 'user.updated' };
type UserDeletedEvent = WebhookEvent & { type: 'user.deleted' };

function getPrimaryEmail(data: WebhookEvent['data']): string | null {
  if (data.email) {
    return data.email;
  }
  const emails = data.email_addresses ?? [];
  const primary = data.primary_email_address_id
    ? emails.find(e => e.id === data.primary_email_address_id)
    : null;
  const first = emails[0];
  return (primary ?? first)?.email_address ?? null;
}

export async function POST(request: Request) {
  const webhookSecret = Env.USER_SYNC_WEBHOOK_SECRET;
  if (!webhookSecret) {
    logger.error('USER_SYNC_WEBHOOK_SECRET is not configured');
    return NextResponse.json(
      { error: 'Webhook secret not configured' },
      { status: 500 },
    );
  }

  const headerPayload = await headers();
  const authHeader = headerPayload.get('authorization');
  const bearer = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
  const secretHeader = headerPayload.get('x-webhook-secret');

  const providedSecret = bearer ?? secretHeader;
  if (!providedSecret || providedSecret !== webhookSecret) {
    logger.error('Invalid or missing webhook secret');
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    logger.error('Invalid JSON body in user sync webhook');
    return NextResponse.json(
      { error: 'Invalid JSON' },
      { status: 400 },
    );
  }

  const evt = body as WebhookEvent;
  if (!evt?.type || !evt?.data?.id) {
    logger.error('Missing type or data.id in webhook payload', { body: evt });
    return NextResponse.json(
      { error: 'Invalid payload: type and data.id required' },
      { status: 400 },
    );
  }

  const allowed: WebhookEvent['type'][] = ['user.created', 'user.updated', 'user.deleted'];
  if (!allowed.includes(evt.type)) {
    logger.warn('Unhandled webhook event type', { eventType: evt.type });
    return NextResponse.json(
      { error: 'Unhandled event type' },
      { status: 400 },
    );
  }

  if (evt.type === 'user.created') {
    return handleUserCreated(evt as UserCreatedEvent);
  }
  if (evt.type === 'user.updated') {
    return handleUserUpdated(evt as UserUpdatedEvent);
  }
  return handleUserDeleted(evt as UserDeletedEvent);
}

async function handleUserCreated(evt: UserCreatedEvent) {
  const userData = evt.data;
  const primaryEmail = getPrimaryEmail(userData);

  if (!primaryEmail) {
    logger.error('No email in user sync webhook event', { userId: userData.id });
    return NextResponse.json(
      { error: 'No email address found' },
      { status: 400 },
    );
  }

  try {
    logger.info('Syncing new user to Supabase', {
      userId: userData.id,
      email: primaryEmail,
    });

    const supabaseUser = await userOperations.upsertUser(primaryEmail);

    logger.info('Successfully synced user to Supabase', {
      userId: userData.id,
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
      userId: userData.id,
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
    logger.error('No email in user sync webhook event', { userId: userData.id });
    return NextResponse.json(
      { error: 'No email address found' },
      { status: 400 },
    );
  }

  try {
    logger.info('Updating user in Supabase', {
      userId: userData.id,
      email: primaryEmail,
    });

    const supabaseUser = await userOperations.upsertUser(primaryEmail);

    logger.info('Successfully updated user in Supabase', {
      userId: userData.id,
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
      userId: userData.id,
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

  logger.info('User deleted (not removing from Supabase)', {
    userId: userData.id,
    email: primaryEmail ?? 'unknown',
  });

  return NextResponse.json({
    message: 'User deletion noted',
  });
}
