/*
  Warnings:

  - You are about to drop the column `theme` on the `Agent` table. All the data in the column will be lost.

*/
-- AlterTable
-- Avoid drop if column doesn't exist in target; add template if missing
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'Agent' AND column_name = 'theme'
  ) THEN
    ALTER TABLE "public"."Agent" DROP COLUMN "theme";
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'Agent' AND column_name = 'template'
  ) THEN
    ALTER TABLE "public"."Agent" ADD COLUMN "template" TEXT NOT NULL DEFAULT 'classic-professional';
  END IF;
END $$;
