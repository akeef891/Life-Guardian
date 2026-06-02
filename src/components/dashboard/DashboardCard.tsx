import type { ReactNode } from "react";

type DashboardCardProps = {
  children: ReactNode;
  className?: string;
};

export function DashboardCard({ children, className }: DashboardCardProps) {
  return (
    <section
      className={[
        "rounded-2xl border border-border bg-surface p-6",
        className ?? "",
      ].join(" ")}
    >
      {children}
    </section>
  );
}

