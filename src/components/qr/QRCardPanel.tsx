"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { generateQrTokenAction } from "@/app/(app)/qr-card/actions";
import { GENERATE_QR_INITIAL_STATE } from "@/app/(app)/qr-card/types";
import { EmptyState } from "@/components/ui/EmptyState";
import { useActionStateToast } from "@/components/ui/toast/useActionStateToast";
import { useToast } from "@/components/ui/toast/ToastProvider";

type QRCardPanelProps = {
  emergencyUrl: string | null;
  appBaseUrl: string;
};

export function QRCardPanel({ emergencyUrl, appBaseUrl }: QRCardPanelProps) {
  const [state, formAction, isPending] = useActionState(
    generateQrTokenAction,
    GENERATE_QR_INITIAL_STATE,
  );
  const { success: toastSuccess, error: toastError } = useToast();
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);

  useActionStateToast(state);
  const effectiveUrl = useMemo(
    () => (state.token ? null : emergencyUrl),
    [state.token, emergencyUrl],
  );
  const finalUrl = state.token ? `${appBaseUrl}/emergency/${state.token}` : effectiveUrl;

  useEffect(() => {
    const activeUrl = finalUrl && finalUrl.length > 0 ? finalUrl : null;
    if (!activeUrl) {
      queueMicrotask(() => setQrDataUrl(null));
      return;
    }

    let cancelled = false;

    void import("qrcode").then(({ default: QRCode }) =>
      QRCode.toDataURL(activeUrl, {
        width: 320,
        margin: 1,
        errorCorrectionLevel: "M",
      }).then((dataUrl) => {
        if (!cancelled) {
          setQrDataUrl(dataUrl);
        }
      }),
    );

    return () => {
      cancelled = true;
    };
  }, [finalUrl]);

  function handleDownload() {
    if (!qrDataUrl) {
      toastError("Generate your emergency QR card before downloading.");
      return;
    }
    const link = document.createElement("a");
    link.href = qrDataUrl;
    link.download = "life-guardian-emergency-qr.png";
    link.click();
    toastSuccess("QR downloaded successfully.");
  }

  return (
    <section className="flex w-full min-w-0 flex-col items-center overflow-hidden rounded-2xl border border-border bg-surface p-4 sm:p-8">
      {qrDataUrl ? (
        // Dynamic QR data URL — next/image does not apply to client-generated canvas output.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={qrDataUrl}
          alt="Emergency QR code"
          className="h-56 w-56 rounded-xl border border-border bg-white p-2"
        />
      ) : (
        <div className="h-56 w-56">
          <EmptyState
            title="No QR generated yet"
            description="Generate your emergency QR card using the button below."
          />
        </div>
      )}

      <p className="mt-6 w-full min-w-0 break-all rounded-lg border border-border bg-background px-3 py-2 text-center text-sm text-muted">
        {finalUrl ?? "No emergency URL yet. Generate a QR token first."}
      </p>

      {state.error ? (
        <p className="sr-only" role="alert">
          {state.error}
        </p>
      ) : null}

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <form action={formAction}>
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark focus:outline-none focus:ring-4 focus:ring-brand/30 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? "Generating..." : "Generate QR"}
          </button>
        </form>

        <button
          type="button"
          onClick={handleDownload}
          disabled={!qrDataUrl}
          className="inline-flex min-h-11 items-center justify-center rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-background focus:outline-none focus:ring-4 focus:ring-brand/20 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Download QR
        </button>
      </div>
    </section>
  );
}
