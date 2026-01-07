-- Phase 1.1: Create listen_history table
-- Tracks when users have listened to content to hide from feed
-- Part of Category Preferences Signup Conversion Plan

CREATE TABLE IF NOT EXISTS "listen_history" (
	"id" uuid DEFAULT gen_random_uuid() PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"content_id" uuid NOT NULL,
	"listened_at" timestamp with time zone DEFAULT now() NOT NULL,
	"completion_percentage" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "listen_history_user_content_unique" UNIQUE("user_id","content_id")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_listen_history_user" ON "listen_history"("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_listen_history_content" ON "listen_history"("content_id");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "listen_history" ADD CONSTRAINT "listen_history_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "listen_history" ADD CONSTRAINT "listen_history_content_id_content_items_id_fk" FOREIGN KEY ("content_id") REFERENCES "content_items"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

