import Link from "next/link";
import { ROUTES } from "@/lib/constants/routes";
import { DashboardCard } from "./DashboardCard";

type Action = {
  href: string;
  title: string;
  description: string;
};

const ACTIONS: Action[] = [
  {
    href: ROUTES.profile,
    title: "Edit Profile",
    description: "Update your medical information.",
  },
  {
    href: ROUTES.profile,
    title: "Manage Contacts",
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
            className="group rounded-xl border border-border bg-background p-4 transition-shadow hover:shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">{action.title}</p>
                <p className="mt-1 text-xs text-muted">{action.description}</p>
              </div>
              <span
                className="mt-1 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-brand/10 text-brand transition-colors group-hover:bg-brand/20"
                aria-hidden
              >
                &gt;
              </span>
            </div>
          </Link>
        ))}
      </div>
    </DashboardCard>
  );
}

