"use client";

import { RouteError } from "@/components/ui/RouteError";

export default function PreparednessError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <RouteError
      title="Preparedness hub unavailable"
      description="Unable to load preparedness content."
      error={error}
      reset={reset}
    />
  );
}
