-- Phase 1.3: Create pending_preferences table
-- Stores preferences for anonymous users before signup (keyed by session/anonymous ID)
-- Short expiry (1 hour) creates urgency - user must complete signup promptly
-- Part of Category Preferences Signup Conversion Plan

CREATE TABLE IF NOT EXISTS "pending_preferences" (
	"id" uuid DEFAULT gen_random_uuid() PRIMARY KEY NOT NULL,
	"anonymous_id" varchar(255) NOT NULL,
	"category_ids" uuid[] NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	CONSTRAINT "pending_preferences_anonymous_id_unique" UNIQUE("anonymous_id")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_pending_preferences_anonymous" ON "pending_preferences"("anonymous_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_pending_preferences_expires" ON "pending_preferences"("expires_at");

