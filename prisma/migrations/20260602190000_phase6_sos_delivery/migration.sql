-- AlterTable
ALTER TABLE "SOSAlert" ADD COLUMN     "locationAccuracy" DOUBLE PRECISION,
ADD COLUMN     "locationCapturedAt" TIMESTAMP(3),
ADD COLUMN     "mapsUrl" TEXT,
ADD COLUMN     "deliveredCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "deliveryStatus" TEXT NOT NULL DEFAULT 'PENDING';

-- CreateIndex
CREATE INDEX "SOSAlert_deliveryStatus_idx" ON "SOSAlert"("deliveryStatus");
