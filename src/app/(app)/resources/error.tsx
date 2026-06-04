"use client";

import { RouteError } from "@/components/ui/RouteError";

type ResourcesErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ResourcesError({ error, reset }: ResourcesErrorProps) {
  return (
    <RouteError
      title="Resources unavailable"
      description="We could not load the emergency resource center. Please try again."
      error={error}
      reset={reset}
    />
  );
}
