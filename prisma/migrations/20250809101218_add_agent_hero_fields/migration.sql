/*
  Warnings:

  - A unique constraint covering the columns `[phone]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."Agent" ADD COLUMN     "heroPrimaryCtaLabel" TEXT,
ADD COLUMN     "heroSecondaryCtaLabel" TEXT,
ADD COLUMN     "heroStats" JSONB,
ADD COLUMN     "templateData" JSONB;

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "public"."User"("phone");
