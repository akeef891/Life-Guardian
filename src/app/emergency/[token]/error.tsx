"use client";

import { RouteError } from "@/components/ui/RouteError";

type EmergencyPublicErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function EmergencyPublicError({ error, reset }: EmergencyPublicErrorProps) {
  return (
    <main className="mx-auto flex min-h-[50vh] w-full min-w-0 max-w-3xl items-center px-3 py-10 sm:px-6">
      <RouteError
        title="Emergency card unavailable"
        description="This emergency card could not be loaded right now. Please try again or contact local emergency services."
        error={error}
        reset={reset}
      />
    </main>
  );
}
