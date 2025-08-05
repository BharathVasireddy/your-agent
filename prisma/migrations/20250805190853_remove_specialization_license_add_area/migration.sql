/*
  Warnings:

  - You are about to drop the column `licenseNumber` on the `Agent` table. All the data in the column will be lost.
  - You are about to drop the column `specialization` on the `Agent` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."Agent_city_specialization_idx";

-- AlterTable
ALTER TABLE "public"."Agent" DROP COLUMN "licenseNumber",
DROP COLUMN "specialization",
ADD COLUMN     "area" TEXT;

-- CreateIndex
CREATE INDEX "Agent_city_area_idx" ON "public"."Agent"("city", "area");
