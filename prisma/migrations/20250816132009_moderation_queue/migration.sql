-- AlterTable
ALTER TABLE "public"."FAQ" ADD COLUMN     "isRemovedByAdmin" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "removedReason" TEXT;

-- AlterTable
ALTER TABLE "public"."Property" ADD COLUMN     "isRemovedByAdmin" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "removedReason" TEXT;

-- AlterTable
ALTER TABLE "public"."Testimonial" ADD COLUMN     "isRemovedByAdmin" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "removedReason" TEXT;

-- CreateTable
CREATE TABLE "public"."ModerationItem" (
    "id" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "snapshot" JSONB,

    CONSTRAINT "ModerationItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ModerationItem_status_createdAt_idx" ON "public"."ModerationItem"("status", "createdAt");

-- CreateIndex
CREATE INDEX "ModerationItem_agentId_type_status_idx" ON "public"."ModerationItem"("agentId", "type", "status");

-- AddForeignKey
ALTER TABLE "public"."ModerationItem" ADD CONSTRAINT "ModerationItem_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "public"."Agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
