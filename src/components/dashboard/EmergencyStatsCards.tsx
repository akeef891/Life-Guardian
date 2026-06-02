import { ProfileIcon, ContactsIcon, SosIcon, QrIcon } from "./DashboardIcons";
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
  profileCompleted: boolean;
  contactsCount: number;
  sosCount: number;
  qrEnabled: boolean;
};

export function EmergencyStatsCards({
  profileCompleted,
  contactsCount,
  sosCount,
  qrEnabled,
}: EmergencyStatsCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <DashboardCard className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              Emergency Profile Status
            </p>
            <div className="mt-2 flex items-center gap-2">
              <div className="rounded-lg bg-brand/10 p-2 text-brand">
                <ProfileIcon className="h-5 w-5" />
              </div>
              <p className="truncate text-2xl font-bold text-foreground">
                {profileCompleted ? "Complete" : "In progress"}
              </p>
            </div>
            <div className="mt-2">
              <StatusPill
                label={profileCompleted ? "Ready" : "Needs details"}
                tone={profileCompleted ? "good" : "warn"}
              />
            </div>
          </div>
        </div>
      </DashboardCard>

      <DashboardCard className="p-5">
        <div className="flex items-start justify-between gap-3">
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
        </div>
      </DashboardCard>

      <DashboardCard className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              SOS Alerts
            </p>
            <div className="mt-2 flex items-center gap-2">
              <div className="rounded-lg bg-sos/10 p-2 text-sos">
                <SosIcon className="h-5 w-5" />
              </div>
              <p className="text-2xl font-bold text-foreground">{sosCount}</p>
            </div>
            <p className="mt-2 text-sm text-muted">
              {sosCount === 0 ? "Trigger an SOS once to activate history." : "Your latest activity shows below."}
            </p>
          </div>
        </div>
      </DashboardCard>

      <DashboardCard className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              QR Card Status
            </p>
            <div className="mt-2 flex items-center gap-2">
              <div className="rounded-lg bg-brand/10 p-2 text-brand">
                <QrIcon className="h-5 w-5" />
              </div>
              <p className="truncate text-2xl font-bold text-foreground">
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
        </div>
      </DashboardCard>
    </div>
  );
}

