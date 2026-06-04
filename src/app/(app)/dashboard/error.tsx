"use client";

import { RouteError } from "@/components/ui/RouteError";

type DashboardErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function DashboardError({ error, reset }: DashboardErrorProps) {
  return (
    <RouteError
      title="Dashboard unavailable"
      description="We could not load your dashboard. Your data is safe — please try again."
      error={error}
      reset={reset}
    />
  );
}
