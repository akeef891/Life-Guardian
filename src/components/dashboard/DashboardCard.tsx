import type { ReactNode } from "react";

type DashboardCardProps = {
  children: ReactNode;
  className?: string;
};

export function DashboardCard({ children, className }: DashboardCardProps) {
  return (
    <section
      className={[
        "min-w-0 rounded-2xl border border-border bg-surface p-4 sm:p-6",
        className ?? "",
      ].join(" ")}
    >
      {children}
    </section>
  );
}

