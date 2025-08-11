-- AlterTable
ALTER TABLE "public"."Agent" ADD COLUMN     "heroPrimaryCtaLabel" TEXT,
ADD COLUMN     "heroSecondaryCtaLabel" TEXT,
ADD COLUMN     "heroStats" JSONB,
ADD COLUMN     "templateData" JSONB;

-- Ensure subscription plan/interval columns exist to remove drift
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'Agent' AND column_name = 'subscriptionPlan'
  ) THEN
    ALTER TABLE "public"."Agent" ADD COLUMN "subscriptionPlan" TEXT;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'Agent' AND column_name = 'subscriptionInterval'
  ) THEN
    ALTER TABLE "public"."Agent" ADD COLUMN "subscriptionInterval" TEXT;
  END IF;
END $$;
