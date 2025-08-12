-- Minimal CRM extensions: add Lead.stage, Lead.assignedToUserId and LeadNote table
ALTER TABLE "Lead" ADD COLUMN IF NOT EXISTS "stage" TEXT NOT NULL DEFAULT 'new';
ALTER TABLE "Lead" ADD COLUMN IF NOT EXISTS "assignedToUserId" TEXT;

CREATE TABLE IF NOT EXISTS "LeadNote" (
  "id" TEXT PRIMARY KEY,
  "leadId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "text" TEXT NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Foreign keys with ON DELETE CASCADE
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'LeadNote_lead_fk'
  ) THEN
    ALTER TABLE "LeadNote" ADD CONSTRAINT "LeadNote_lead_fk" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'LeadNote_user_fk'
  ) THEN
    ALTER TABLE "LeadNote" ADD CONSTRAINT "LeadNote_user_fk" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS "LeadNote_lead_created_idx" ON "LeadNote" ("leadId", "createdAt");

