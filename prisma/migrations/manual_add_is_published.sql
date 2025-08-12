-- Safe DDL to add isPublished without affecting existing data
ALTER TABLE "Agent" ADD COLUMN IF NOT EXISTS "isPublished" BOOLEAN NOT NULL DEFAULT false;


