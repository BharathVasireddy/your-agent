-- DropForeignKey
ALTER TABLE "public"."LeadActivity" DROP CONSTRAINT "LeadActivity_lead_fk";

-- DropForeignKey
ALTER TABLE "public"."LeadActivity" DROP CONSTRAINT "LeadActivity_user_fk";

-- AlterTable
ALTER TABLE "public"."Lead" ALTER COLUMN "updatedAt" DROP DEFAULT,
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "public"."LeadActivity" ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(3);

-- CreateTable
CREATE TABLE "public"."AgentAward" (
    "id" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "issuedBy" TEXT,
    "year" INTEGER,
    "description" TEXT,
    "imageUrl" TEXT,
    "isRemovedByAdmin" BOOLEAN NOT NULL DEFAULT false,
    "removedReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AgentAward_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AgentGalleryImage" (
    "id" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "caption" TEXT,
    "isRemovedByAdmin" BOOLEAN NOT NULL DEFAULT false,
    "removedReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AgentGalleryImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AgentBuilder" (
    "id" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "logoUrl" TEXT NOT NULL,
    "websiteUrl" TEXT,
    "isRemovedByAdmin" BOOLEAN NOT NULL DEFAULT false,
    "removedReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AgentBuilder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AgentAward_agentId_createdAt_idx" ON "public"."AgentAward"("agentId", "createdAt");

-- CreateIndex
CREATE INDEX "AgentGalleryImage_agentId_createdAt_idx" ON "public"."AgentGalleryImage"("agentId", "createdAt");

-- CreateIndex
CREATE INDEX "AgentBuilder_agentId_createdAt_idx" ON "public"."AgentBuilder"("agentId", "createdAt");

-- AddForeignKey
ALTER TABLE "public"."LeadActivity" ADD CONSTRAINT "LeadActivity_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "public"."Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LeadActivity" ADD CONSTRAINT "LeadActivity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AgentAward" ADD CONSTRAINT "AgentAward_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "public"."Agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AgentGalleryImage" ADD CONSTRAINT "AgentGalleryImage_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "public"."Agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AgentBuilder" ADD CONSTRAINT "AgentBuilder_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "public"."Agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "public"."LeadActivity_lead_created_idx" RENAME TO "LeadActivity_leadId_createdAt_idx";
