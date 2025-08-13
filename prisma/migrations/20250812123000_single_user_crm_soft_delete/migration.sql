-- Single-user CRM migration: remove assignment, add soft delete

-- Drop assignedToUserId if it exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'Lead' AND column_name = 'assignedToUserId'
  ) THEN
    ALTER TABLE "Lead" DROP COLUMN "assignedToUserId";
  END IF;
END $$;

-- Add deletedAt if not exists
ALTER TABLE "Lead" ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP NULL;

-- Optional: index for faster filtering by non-deleted
CREATE INDEX IF NOT EXISTS "Lead_deletedAt_idx" ON "Lead" ("deletedAt");


