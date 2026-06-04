"use client";

import { RouteError } from "@/components/ui/RouteError";

type ProfileErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ProfileError({ error, reset }: ProfileErrorProps) {
  return (
    <RouteError
      title="Profile unavailable"
      description="We could not load your emergency profile. Please try again."
      error={error}
      reset={reset}
    />
  );
}
