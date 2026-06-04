"use client";

import { RouteError } from "@/components/ui/RouteError";

type QRCardErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function QRCardError({ error, reset }: QRCardErrorProps) {
  return (
    <RouteError
      title="QR card unavailable"
      description="We could not load your QR emergency card. Please try again."
      error={error}
      reset={reset}
    />
  );
}
