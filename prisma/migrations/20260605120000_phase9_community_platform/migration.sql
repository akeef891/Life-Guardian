-- Phase 9: Community emergency platform

CREATE TABLE "SafetyCheckIn" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SafetyCheckIn_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CommunityAlert" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CommunityAlert_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "UserActivityLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "eventKind" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserActivityLog_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "SafetyCheckIn_userId_createdAt_idx" ON "SafetyCheckIn"("userId", "createdAt" DESC);
CREATE INDEX "SafetyCheckIn_status_idx" ON "SafetyCheckIn"("status");

CREATE INDEX "CommunityAlert_severity_idx" ON "CommunityAlert"("severity");
CREATE INDEX "CommunityAlert_createdAt_idx" ON "CommunityAlert"("createdAt" DESC);

CREATE INDEX "UserActivityLog_userId_createdAt_idx" ON "UserActivityLog"("userId", "createdAt" DESC);
CREATE INDEX "UserActivityLog_eventKind_idx" ON "UserActivityLog"("eventKind");

ALTER TABLE "SafetyCheckIn" ADD CONSTRAINT "SafetyCheckIn_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "UserActivityLog" ADD CONSTRAINT "UserActivityLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
