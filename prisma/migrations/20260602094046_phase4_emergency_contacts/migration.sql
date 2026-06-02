-- AlterTable
ALTER TABLE "EmergencyContact" ADD COLUMN     "isPrimary" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "EmergencyContact_profileId_isPrimary_idx" ON "EmergencyContact"("profileId", "isPrimary");
