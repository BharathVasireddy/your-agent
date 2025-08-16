/*
  Warnings:

  - You are about to drop the column `areaId` on the `Agent` table. All the data in the column will be lost.
  - You are about to drop the `Area` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Agent" DROP CONSTRAINT "Agent_areaId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Area" DROP CONSTRAINT "Area_cityId_fkey";

-- DropIndex
DROP INDEX "public"."Agent_cityId_areaId_idx";

-- DropIndex
DROP INDEX "public"."Agent_cityId_isSubscribed_idx";

-- DropIndex
DROP INDEX "public"."City_name_key";

-- AlterTable
ALTER TABLE "public"."Agent" DROP COLUMN "areaId",
ADD COLUMN     "districtId" TEXT,
ADD COLUMN     "stateId" TEXT;

-- AlterTable
ALTER TABLE "public"."City" ADD COLUMN     "districtId" TEXT,
ADD COLUMN     "pincode" TEXT,
ALTER COLUMN "state" DROP NOT NULL,
ALTER COLUMN "country" DROP NOT NULL,
ALTER COLUMN "country" DROP DEFAULT;

-- DropTable
DROP TABLE "public"."Area";

-- CreateTable
CREATE TABLE "public"."State" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'India',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "State_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."District" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "stateId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "District_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "State_name_key" ON "public"."State"("name");

-- CreateIndex
CREATE UNIQUE INDEX "State_code_key" ON "public"."State"("code");

-- CreateIndex
CREATE INDEX "State_isActive_idx" ON "public"."State"("isActive");

-- CreateIndex
CREATE INDEX "State_name_isActive_idx" ON "public"."State"("name", "isActive");

-- CreateIndex
CREATE INDEX "District_stateId_isActive_idx" ON "public"."District"("stateId", "isActive");

-- CreateIndex
CREATE INDEX "District_name_isActive_idx" ON "public"."District"("name", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "District_name_stateId_key" ON "public"."District"("name", "stateId");

-- CreateIndex
CREATE INDEX "Agent_stateId_districtId_cityId_idx" ON "public"."Agent"("stateId", "districtId", "cityId");

-- CreateIndex
CREATE INDEX "Agent_stateId_isSubscribed_idx" ON "public"."Agent"("stateId", "isSubscribed");

-- CreateIndex
CREATE INDEX "Agent_districtId_isSubscribed_idx" ON "public"."Agent"("districtId", "isSubscribed");

-- CreateIndex
CREATE INDEX "City_districtId_isActive_idx" ON "public"."City"("districtId", "isActive");

-- AddForeignKey
ALTER TABLE "public"."Agent" ADD CONSTRAINT "Agent_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "public"."State"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Agent" ADD CONSTRAINT "Agent_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "public"."District"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."District" ADD CONSTRAINT "District_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "public"."State"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."City" ADD CONSTRAINT "City_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "public"."District"("id") ON DELETE CASCADE ON UPDATE CASCADE;
