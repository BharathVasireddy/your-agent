-- AlterTable
ALTER TABLE "public"."Agent" ADD COLUMN     "areaId" TEXT,
ADD COLUMN     "cityId" TEXT;

-- CreateTable
CREATE TABLE "public"."City" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'India',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "City_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Area" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cityId" TEXT NOT NULL,
    "pincode" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Area_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "City_name_key" ON "public"."City"("name");

-- CreateIndex
CREATE INDEX "City_state_isActive_idx" ON "public"."City"("state", "isActive");

-- CreateIndex
CREATE INDEX "City_name_isActive_idx" ON "public"."City"("name", "isActive");

-- CreateIndex
CREATE INDEX "Area_cityId_isActive_idx" ON "public"."Area"("cityId", "isActive");

-- CreateIndex
CREATE INDEX "Area_name_isActive_idx" ON "public"."Area"("name", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "Area_name_cityId_key" ON "public"."Area"("name", "cityId");

-- CreateIndex
CREATE INDEX "Agent_cityId_areaId_idx" ON "public"."Agent"("cityId", "areaId");

-- CreateIndex
CREATE INDEX "Agent_cityId_isSubscribed_idx" ON "public"."Agent"("cityId", "isSubscribed");

-- AddForeignKey
ALTER TABLE "public"."Agent" ADD CONSTRAINT "Agent_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "public"."City"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Agent" ADD CONSTRAINT "Agent_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "public"."Area"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Area" ADD CONSTRAINT "Area_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "public"."City"("id") ON DELETE CASCADE ON UPDATE CASCADE;
