-- AlterTable
ALTER TABLE "public"."Agent" ADD COLUMN     "isRemovedByAdmin" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "removedReason" TEXT;
