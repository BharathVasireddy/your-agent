-- AlterTable
ALTER TABLE "public"."Property" ADD COLUMN     "propertyData" JSONB,
ALTER COLUMN "area" DROP NOT NULL,
ALTER COLUMN "bedrooms" DROP NOT NULL,
ALTER COLUMN "bathrooms" DROP NOT NULL;
