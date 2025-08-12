-- CreateTable
CREATE TABLE "public"."AuthEvent" (
  "id" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "userId" TEXT,
  "identifier" TEXT,
  "ipAddress" TEXT,
  "userAgent" TEXT,
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "AuthEvent_pkey" PRIMARY KEY ("id")
);

-- Indexes to support audit queries
CREATE INDEX "AuthEvent_type_idx" ON "public"."AuthEvent"("type");
CREATE INDEX "AuthEvent_userId_idx" ON "public"."AuthEvent"("userId");
CREATE INDEX "AuthEvent_identifier_idx" ON "public"."AuthEvent"("identifier");
CREATE INDEX "AuthEvent_createdAt_idx" ON "public"."AuthEvent"("createdAt");


