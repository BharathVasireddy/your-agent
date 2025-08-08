-- AlterTable
ALTER TABLE "public"."Agent" ALTER COLUMN "template" SET DEFAULT 'fresh-minimal';

-- CreateIndex
CREATE INDEX "Property_agentId_createdAt_idx" ON "public"."Property"("agentId", "createdAt");

-- CreateIndex
CREATE INDEX "Property_agentId_listingType_idx" ON "public"."Property"("agentId", "listingType");

-- CreateIndex
CREATE INDEX "Property_agentId_status_idx" ON "public"."Property"("agentId", "status");
