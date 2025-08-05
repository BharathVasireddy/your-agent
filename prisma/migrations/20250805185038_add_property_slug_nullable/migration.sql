/*
  Warnings:

  - You are about to drop the column `category` on the `Property` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[slug]` on the table `Property` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `listingType` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `propertyType` to the `Property` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Agent" ADD COLUMN     "hasSeenTour" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "public"."Property" DROP COLUMN "category",
ADD COLUMN     "listingType" TEXT NOT NULL,
ADD COLUMN     "propertyType" TEXT NOT NULL,
ADD COLUMN     "slug" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Property_slug_key" ON "public"."Property"("slug");

-- CreateIndex
CREATE INDEX "Property_agentId_slug_idx" ON "public"."Property"("agentId", "slug");
