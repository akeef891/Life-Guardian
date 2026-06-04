"use client";

import { RouteError } from "@/components/ui/RouteError";

type SOSErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function SOSError({ error, reset }: SOSErrorProps) {
  return (
    <RouteError
      title="SOS page unavailable"
      description="Something went wrong loading SOS tools. Your existing alerts are unchanged."
      error={error}
      reset={reset}
    />
  );
}
