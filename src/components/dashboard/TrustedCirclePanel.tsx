import type { EmergencyContactRecord } from "@/lib/db/prisma-types";
import { ROUTES } from "@/lib/constants/routes";
import Link from "next/link";
import { DashboardCard } from "./DashboardCard";

type Props = {
  contacts: EmergencyContactRecord[];
  responsesReceived: number;
  totalSos: number;
};

export function TrustedCirclePanel({ contacts, responsesReceived, totalSos }: Props) {
  const primary = contacts.find((c) => c.isPrimary) ?? contacts[0] ?? null;
  const responseRate =
    totalSos > 0 ? Math.round((responsesReceived / Math.max(contacts.length * totalSos, 1)) * 100) : 0;

  return (
    <DashboardCard className="h-full">
      <h2 className="text-lg font-semibold text-foreground">Trusted Circle</h2>
      <p className="mt-1 text-sm text-muted">Your emergency network at a glance.</p>

      <dl className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-background p-4">
          <dt className="text-xs font-semibold uppercase tracking-wide text-muted">
            Primary contact
          </dt>
          <dd className="mt-2 text-sm font-semibold text-foreground">
            {primary ? primary.name : "Not set"}
          </dd>
          {primary?.phone ? (
            <dd className="mt-1 truncate text-xs text-muted">{primary.phone}</dd>
          ) : null}
        </div>
        <div className="rounded-xl border border-border bg-background p-4">
          <dt className="text-xs font-semibold uppercase tracking-wide text-muted">
            Total contacts
          </dt>
          <dd className="mt-2 text-2xl font-bold text-foreground">{contacts.length}</dd>
        </div>
        <div className="rounded-xl border border-border bg-background p-4 sm:col-span-2">
          <dt className="text-xs font-semibold uppercase tracking-wide text-muted">
            Response statistics
          </dt>
          <dd className="mt-2 flex flex-wrap gap-4 text-sm">
            <span>
              <span className="font-bold text-foreground">{responsesReceived}</span>{" "}
              <span className="text-muted">responses received</span>
            </span>
            <span>
              <span className="font-bold text-foreground">{responseRate}%</span>{" "}
              <span className="text-muted">approx. response rate</span>
            </span>
          </dd>
        </div>
      </dl>

      <Link
        href={`${ROUTES.profile}#emergency-contacts`}
        className="mt-5 inline-flex min-h-11 items-center justify-center rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-background focus:outline-none focus:ring-4 focus:ring-brand/25"
      >
        Manage trusted circle
      </Link>
    </DashboardCard>
  );
}
