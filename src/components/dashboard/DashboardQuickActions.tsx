import Link from "next/link";
import { ROUTES } from "@/lib/constants/routes";
import { DashboardCard } from "./DashboardCard";

type Action = {
  href: string;
  title: string;
  description: string;
  tone?: "default" | "danger";
};

const ACTIONS: Action[] = [
  {
    href: `${ROUTES.profile}#profile-editor`,
    title: "Edit Profile",
    description: "Update your medical information.",
  },
  {
    href: `${ROUTES.profile}#emergency-contacts`,
    title: "Add Contact",
    description: "Add or update emergency contacts.",
  },
  {
    href: ROUTES.qrCard,
    title: "Generate QR",
    description: "Create your shareable emergency QR card.",
  },
  {
    href: ROUTES.sos,
    title: "Trigger SOS",
    description: "Create an SOS alert and notify your contacts.",
    tone: "danger",
  },
];

export function DashboardQuickActions() {
  return (
    <DashboardCard className="h-full">
      <h2 className="text-lg font-semibold text-foreground">Quick Actions</h2>
      <p className="mt-1 text-sm text-muted">
        Jump straight to the actions that improve your emergency readiness.
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {ACTIONS.map((action) => (
          <Link
            key={action.title}
            href={action.href}
            className={[
              "group flex min-h-[4.5rem] items-start rounded-xl border p-4 transition-shadow hover:shadow-sm focus:outline-none focus:ring-4 focus:ring-brand/25",
              action.tone === "danger"
                ? "border-sos/20 bg-sos/5 hover:border-sos/40"
                : "border-border bg-background hover:border-brand/30",
            ].join(" ")}
          >
            <div className="flex min-w-0 flex-1 items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">{action.title}</p>
                <p className="mt-1 text-xs text-muted">{action.description}</p>
              </div>
              <span
                className={[
                  "mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold transition-colors",
                  action.tone === "danger"
                    ? "bg-sos/10 text-sos group-hover:bg-sos/20"
                    : "bg-brand/10 text-brand group-hover:bg-brand/20",
                ].join(" ")}
                aria-hidden
              >
                →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </DashboardCard>
  );
}
