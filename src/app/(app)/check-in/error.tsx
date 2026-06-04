"use client";

import { RouteError } from "@/components/ui/RouteError";

export default function CheckInError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <RouteError
      title="Check-in unavailable"
      description="Unable to load safety check-in. Please try again."
      error={error}
      reset={reset}
    />
  );
}
