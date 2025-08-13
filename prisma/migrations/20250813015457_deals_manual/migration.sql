-- DropIndex
DROP INDEX "public"."Lead_deletedAt_idx";

-- AlterTable
ALTER TABLE "public"."Agent" ADD COLUMN     "isPublished" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "public"."Lead" ALTER COLUMN "deletedAt" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "public"."Property" ADD COLUMN     "adoptedAt" TIMESTAMP(3),
ADD COLUMN     "isHiddenByAgent" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "sourceDealId" TEXT;

-- CreateTable
CREATE TABLE "public"."Deal" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "agentEarningAmount" INTEGER NOT NULL,
    "listingType" TEXT NOT NULL,
    "propertyType" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "amenities" TEXT[],
    "photos" TEXT[],
    "brochureUrl" TEXT,
    "propertyData" JSONB,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "minPageViewsLast30d" INTEGER,
    "minProfileViewsLast30d" INTEGER,
    "allowedCities" TEXT[],
    "allowedAreas" TEXT[],
    "allowedAgentSlugs" TEXT[],
    "excludedCities" TEXT[],
    "excludedAreas" TEXT[],
    "excludedAgentSlugs" TEXT[],

    CONSTRAINT "Deal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."LeadNote" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LeadNote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Deal_slug_key" ON "public"."Deal"("slug");

-- CreateIndex
CREATE INDEX "Deal_status_idx" ON "public"."Deal"("status");

-- CreateIndex
CREATE INDEX "LeadNote_lead_created_idx" ON "public"."LeadNote"("leadId", "createdAt");

-- AddForeignKey
ALTER TABLE "public"."Property" ADD CONSTRAINT "Property_sourceDealId_fkey" FOREIGN KEY ("sourceDealId") REFERENCES "public"."Deal"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LeadNote" ADD CONSTRAINT "LeadNote_lead_fk" FOREIGN KEY ("leadId") REFERENCES "public"."Lead"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."LeadNote" ADD CONSTRAINT "LeadNote_user_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

