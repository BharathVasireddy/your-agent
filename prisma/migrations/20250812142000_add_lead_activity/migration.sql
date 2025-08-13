CREATE TABLE IF NOT EXISTS "LeadActivity" (
  "id" TEXT PRIMARY KEY,
  "leadId" TEXT NOT NULL,
  "userId" TEXT,
  "type" TEXT NOT NULL,
  "data" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT "LeadActivity_lead_fk" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE,
  CONSTRAINT "LeadActivity_user_fk" FOREIGN KEY ("userId") REFERENCES "User"("id")
);
CREATE INDEX IF NOT EXISTS "LeadActivity_lead_created_idx" ON "LeadActivity" ("leadId", "createdAt");

