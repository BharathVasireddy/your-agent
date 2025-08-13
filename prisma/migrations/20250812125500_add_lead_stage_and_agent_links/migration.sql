-- Add missing Lead.stage and Agent social/link columns to match schema

-- Lead.stage
ALTER TABLE "Lead" ADD COLUMN IF NOT EXISTS "stage" TEXT NOT NULL DEFAULT 'new';

-- Agent links
ALTER TABLE "Agent" ADD COLUMN IF NOT EXISTS "websiteUrl" TEXT;
ALTER TABLE "Agent" ADD COLUMN IF NOT EXISTS "facebookUrl" TEXT;
ALTER TABLE "Agent" ADD COLUMN IF NOT EXISTS "instagramUrl" TEXT;
ALTER TABLE "Agent" ADD COLUMN IF NOT EXISTS "linkedinUrl" TEXT;
ALTER TABLE "Agent" ADD COLUMN IF NOT EXISTS "youtubeUrl" TEXT;
ALTER TABLE "Agent" ADD COLUMN IF NOT EXISTS "twitterUrl" TEXT;


