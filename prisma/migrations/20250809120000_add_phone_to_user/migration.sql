-- AlterTable: add phone fields to User
ALTER TABLE "public"."User"
  ADD COLUMN IF NOT EXISTS "phone" TEXT,
  ADD COLUMN IF NOT EXISTS "phoneVerifiedAt" TIMESTAMP(3);

-- Add unique index for phone if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE schemaname = 'public' AND indexname = 'User_phone_key'
  ) THEN
    EXECUTE 'CREATE UNIQUE INDEX "User_phone_key" ON "public"."User" ("phone") WHERE "phone" IS NOT NULL';
  END IF;
END $$;


