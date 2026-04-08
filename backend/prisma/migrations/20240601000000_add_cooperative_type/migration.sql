-- CreateEnum
CREATE TYPE "CooperativeType" AS ENUM ('CREDIT', 'MULTI_PURPOSE');

-- AlterTable
ALTER TABLE "Cooperative" ADD COLUMN "type" "CooperativeType" NOT NULL DEFAULT 'CREDIT';

-- CreateTable
CREATE TABLE "SystemConfig" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SystemConfig_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SystemConfig_key_key" ON "SystemConfig"("key");

-- Insert initial system configuration
INSERT INTO "SystemConfig" ("key", "value", "description", "createdAt", "updatedAt")
VALUES ('SYSTEM_INITIALIZED', 'false', 'Flag indicating if the system has been initialized', NOW(), NOW()),
       ('DEFAULT_COOPERATIVE_TYPE', 'CREDIT', 'Default cooperative type for the system', NOW(), NOW());
