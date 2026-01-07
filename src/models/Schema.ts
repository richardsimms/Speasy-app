// This file defines the structure of your database tables using the Drizzle ORM.

// To modify the database schema:
// 1. Update this file with your desired changes.
// 2. Generate a new migration by running: `npm run db:generate`

// The generated migration file will reflect your schema changes.
// The migration is automatically applied during the Next.js initialization process through `instrumentation.ts`.
// Simply restart your Next.js server to apply the database changes.
// Alternatively, if your database is running, you can run `npm run db:migrate` and there is no need to restart the server.

import {
  index,
  integer,
  pgTable,
  timestamp,
  unique,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

// Reference tables (these exist in Supabase but are defined here for foreign key references)
// Note: These tables already exist in the database and are NOT created by Drizzle migrations
// They are defined here only for type-safe foreign key references in the schema below
export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey(),
});

export const contentItems = pgTable('content_items', {
  id: uuid('id').primaryKey(),
});

// Phase 1: Database Schema Updates

/**
 * Tracks when users have listened to content to hide from feed.
 * Part of Phase 1.1 of the Category Preferences Signup Conversion Plan.
 */
export const listenHistory = pgTable(
  'listen_history',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => profiles.id, { onDelete: 'cascade' }),
    contentId: uuid('content_id')
      .notNull()
      .references(() => contentItems.id, { onDelete: 'cascade' }),
    listenedAt: timestamp('listened_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    completionPercentage: integer('completion_percentage').default(0).notNull(),
  },
  table => ({
    // Unique constraint: user can only have one listen record per content item
    userContentUnique: unique('listen_history_user_content_unique').on(
      table.userId,
      table.contentId,
    ),
    // Indexes for efficient queries
    userIdIdx: index('idx_listen_history_user').on(table.userId),
    contentIdIdx: index('idx_listen_history_content').on(table.contentId),
  }),
);

/**
 * Stores preferences for anonymous users before signup (keyed by session/anonymous ID).
 * Short expiry (1 hour) creates urgency - user must complete signup promptly.
 * Part of Phase 1.3 of the Category Preferences Signup Conversion Plan.
 */
export const pendingPreferences = pgTable(
  'pending_preferences',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    anonymousId: varchar('anonymous_id', { length: 255 }).notNull().unique(),
    categoryIds: uuid('category_ids').array().notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  },
  table => ({
    // Indexes for efficient queries
    anonymousIdIdx: index('idx_pending_preferences_anonymous').on(
      table.anonymousId,
    ),
    expiresAtIdx: index('idx_pending_preferences_expires').on(table.expiresAt),
  }),
);

// Export schema object for Drizzle
export const schema = {
  listenHistory,
  pendingPreferences,
};
