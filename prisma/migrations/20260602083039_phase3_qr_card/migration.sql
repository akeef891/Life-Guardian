/*
  Warnings:

  - A unique constraint covering the columns `[qrToken]` on the table `EmergencyProfile` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "EmergencyProfile" ADD COLUMN     "qrToken" TEXT;

-- CreateTable
CREATE TABLE "EmergencyContact" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "relationship" TEXT,
    "phone" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmergencyContact_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EmergencyContact_profileId_idx" ON "EmergencyContact"("profileId");

-- CreateIndex
CREATE UNIQUE INDEX "EmergencyProfile_qrToken_key" ON "EmergencyProfile"("qrToken");

-- AddForeignKey
ALTER TABLE "EmergencyContact" ADD CONSTRAINT "EmergencyContact_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "EmergencyProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
