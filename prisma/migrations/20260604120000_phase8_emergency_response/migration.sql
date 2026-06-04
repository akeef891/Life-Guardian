-- Phase 8: Emergency response platform (acknowledgements, escalation, incidents)

ALTER TABLE "SOSAlert" ADD COLUMN "escalationStatus" TEXT NOT NULL DEFAULT 'NONE';
ALTER TABLE "SOSAlert" ADD COLUMN "escalatedAt" TIMESTAMP(3);
ALTER TABLE "SOSAlert" ADD COLUMN "closedAt" TIMESTAMP(3);

CREATE INDEX "SOSAlert_escalationStatus_idx" ON "SOSAlert"("escalationStatus");

CREATE TABLE "SOSContactResponse" (
    "id" TEXT NOT NULL,
    "sosAlertId" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,
    "contactName" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "respondedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SOSContactResponse_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "SOSContactResponse_token_key" ON "SOSContactResponse"("token");
CREATE UNIQUE INDEX "SOSContactResponse_sosAlertId_contactId_key" ON "SOSContactResponse"("sosAlertId", "contactId");
CREATE INDEX "SOSContactResponse_sosAlertId_idx" ON "SOSContactResponse"("sosAlertId");
CREATE INDEX "SOSContactResponse_token_idx" ON "SOSContactResponse"("token");
CREATE INDEX "SOSContactResponse_status_idx" ON "SOSContactResponse"("status");

ALTER TABLE "SOSContactResponse" ADD CONSTRAINT "SOSContactResponse_sosAlertId_fkey" FOREIGN KEY ("sosAlertId") REFERENCES "SOSAlert"("id") ON DELETE CASCADE ON UPDATE CASCADE;
