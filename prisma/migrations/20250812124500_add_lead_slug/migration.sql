-- Add optional slug per agent for SEO-friendly lead URLs
ALTER TABLE "Lead" ADD COLUMN IF NOT EXISTS "slug" TEXT;
-- Unique per agent to avoid global collisions
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE indexname = 'Lead_agentId_slug_key'
  ) THEN
    CREATE UNIQUE INDEX "Lead_agentId_slug_key" ON "Lead" ("agentId", "slug");
  END IF;
END $$;


