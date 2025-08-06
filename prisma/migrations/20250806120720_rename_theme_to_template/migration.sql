/*
  Warnings:

  - You are about to drop the column `theme` on the `Agent` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Agent" DROP COLUMN "theme",
ADD COLUMN     "template" TEXT NOT NULL DEFAULT 'classic-professional';
