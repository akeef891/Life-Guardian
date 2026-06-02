import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { getOrCreateCurrentUserWithProfile } from "@/lib/auth/user-context";
import { ROUTES } from "@/lib/constants/routes";
import { prisma } from "@/lib/db/prisma";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your Life Guardian dashboard overview.",
};

const QUICK_LINKS = [
  {
    href: ROUTES.profile,
    title: "Emergency Profile",
    description: "View and manage your medical information and contacts.",
  },
  {
    href: ROUTES.qrCard,
    title: "QR Card",
    description: "Preview and manage your scannable emergency card.",
  },
  {
    href: ROUTES.sos,
    title: "SOS",
    description: "Trigger an emergency alert to your contacts.",
  },
] as const;

export default async function DashboardPage() {
  const { id: userId, firstName, email, profile } = await getOrCreateCurrentUserWithProfile();
  const recentSosAlerts = await prisma.sOSAlert.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 5,
    select: {
      id: true,
      status: true,
      createdAt: true,
    },
  });
  const greetingName = firstName ?? email;

  return (
    <>
      <PageHeader
        title="Dashboard"
        description={`Welcome ${greetingName}. Quick access to your emergency tools.`}
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {QUICK_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="group rounded-2xl border border-border bg-surface p-6 transition-shadow hover:shadow-md"
          >
            <h2 className="text-lg font-semibold text-foreground group-hover:text-brand">
              {link.title}
            </h2>
            <p className="mt-2 text-sm text-muted">{link.description}</p>
          </Link>
        ))}
      </div>

      <section className="mt-10 rounded-2xl border border-dashed border-border bg-surface/50 p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
          Placeholder stats
        </h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-3">
          <div>
            <dt className="text-sm text-muted">Profile completeness</dt>
            <dd className="text-2xl font-bold text-foreground">
              {profile?.bloodType ? "In progress" : "Start setup"}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-muted">QR card status</dt>
            <dd className="text-2xl font-bold text-foreground">
              {profile?.qrToken ? "Active" : "Not generated"}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-muted">Recent SOS alerts</dt>
            <dd className="text-2xl font-bold text-foreground">{recentSosAlerts.length}</dd>
          </div>
        </dl>
      </section>

      <section className="mt-6 rounded-2xl border border-border bg-surface p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
          Recent SOS Alerts
        </h2>
        {recentSosAlerts.length ? (
          <ul className="mt-4 space-y-2">
            {recentSosAlerts.map((alert) => (
              <li
                key={alert.id}
                className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm"
              >
                <span className="rounded-full bg-sos/10 px-2 py-0.5 text-xs font-semibold text-sos">
                  {alert.status}
                </span>
                <span className="text-muted">{alert.createdAt.toLocaleDateString()}</span>
                <span className="text-muted">•</span>
                <span className="text-muted">
                  {alert.createdAt.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-muted">No SOS alerts triggered yet.</p>
        )}
      </section>

      <section className="mt-6 rounded-2xl border border-border bg-surface p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
          Emergency Contacts
        </h2>
        {profile?.contacts.length ? (
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {profile.contacts.map((contact) => (
              <li
                key={contact.id}
                className="rounded-lg border border-border bg-background px-4 py-3"
              >
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-foreground">{contact.name}</p>
                  {contact.isPrimary ? (
                    <span className="rounded-full bg-brand/10 px-2 py-0.5 text-xs font-semibold text-brand">
                      Primary
                    </span>
                  ) : null}
                </div>
                {contact.relationship ? (
                  <p className="text-sm text-muted">{contact.relationship}</p>
                ) : null}
                <p className="mt-1 text-sm text-foreground">{contact.phone}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-muted">
            No contacts configured yet. Add contacts from the profile page.
          </p>
        )}
      </section>
    </>
  );
}
