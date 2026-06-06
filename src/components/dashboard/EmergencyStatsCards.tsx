import { LocalDateTime } from "@/components/datetime/LocalDateTime";
import { ContactsIcon, QrIcon, ReadinessIcon, SosIcon } from "./DashboardIcons";
import { DashboardCard } from "./DashboardCard";

type StatusPillProps = {
  label: string;
  tone: "good" | "warn" | "neutral";
};

function StatusPill({ label, tone }: StatusPillProps) {
  const toneClasses =
    tone === "good"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : tone === "warn"
        ? "bg-amber-50 text-amber-800 border-amber-200"
        : "bg-background text-muted border-border";

  return (
    <span
      className={[
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold",
        toneClasses,
      ].join(" ")}
    >
      {label}
    </span>
  );
}

type EmergencyStatsCardsProps = {
  readinessScore: number;
  readinessLabel: string;
  contactsCount: number;
  sosCount: number;
  lastSosAt: Date | string | null;
  qrEnabled: boolean;
};

function readinessTone(score: number): StatusPillProps["tone"] {
  if (score >= 80) {
    return "good";
  }
  if (score >= 50) {
    return "neutral";
  }
  return "warn";
}

export function EmergencyStatsCards({
  readinessScore,
  readinessLabel,
  contactsCount,
  sosCount,
  lastSosAt,
  qrEnabled,
}: EmergencyStatsCardsProps) {
  return (
    <div className="grid min-w-0 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <DashboardCard className="p-4 sm:p-5">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            Readiness Score
          </p>
          <div className="mt-2 flex items-center gap-2">
            <div className="rounded-lg bg-brand/10 p-2 text-brand">
              <ReadinessIcon className="h-5 w-5" />
            </div>
            <p className="text-2xl font-bold text-foreground">{readinessScore}</p>
            <span className="text-sm font-medium text-muted">/100</span>
          </div>
          <div className="mt-2">
            <StatusPill label={readinessLabel} tone={readinessTone(readinessScore)} />
          </div>
        </div>
      </DashboardCard>

      <DashboardCard className="p-4 sm:p-5">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            Emergency Contacts
          </p>
          <div className="mt-2 flex items-center gap-2">
            <div className="rounded-lg bg-brand/10 p-2 text-brand">
              <ContactsIcon className="h-5 w-5" />
            </div>
            <p className="text-2xl font-bold text-foreground">{contactsCount}</p>
          </div>
          <p className="mt-2 text-sm text-muted">
            {contactsCount === 0 ? "Add at least one contact." : "Keep info up to date."}
          </p>
        </div>
      </DashboardCard>

      <DashboardCard className="p-4 sm:p-5">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            SOS Alerts Sent
          </p>
          <div className="mt-2 flex items-center gap-2">
            <div className="rounded-lg bg-sos/10 p-2 text-sos">
              <SosIcon className="h-5 w-5" />
            </div>
            <p className="text-2xl font-bold text-foreground">{sosCount}</p>
          </div>
          <p className="mt-2 truncate text-sm text-muted">
            Last SOS:{" "}
            {lastSosAt ? <LocalDateTime value={lastSosAt} mode="datetime" /> : "Never"}
          </p>
        </div>
      </DashboardCard>

      <DashboardCard className="p-4 sm:p-5">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">QR Status</p>
          <div className="mt-2 flex items-center gap-2">
            <div className="rounded-lg bg-brand/10 p-2 text-brand">
              <QrIcon className="h-5 w-5" />
            </div>
            <p className="truncate text-xl font-bold text-foreground sm:text-2xl">
              {qrEnabled ? "Active" : "Not generated"}
            </p>
          </div>
          <div className="mt-2">
            <StatusPill
              label={qrEnabled ? "Shareable" : "Generate first"}
              tone={qrEnabled ? "good" : "neutral"}
            />
          </div>
        </div>
      </DashboardCard>
    </div>
  );
}
