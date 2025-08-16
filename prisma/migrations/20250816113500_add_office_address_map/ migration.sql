-- Add officeAddress and officeMapUrl to Agent
ALTER TABLE "Agent"
  ADD COLUMN IF NOT EXISTS "officeAddress" TEXT,
  ADD COLUMN IF NOT EXISTS "officeMapUrl" TEXT;


