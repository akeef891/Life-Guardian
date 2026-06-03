"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import QRCode from "qrcode";
import {
  generateQrTokenAction,
  type GenerateQrState,
} from "@/app/(app)/qr-card/actions";

type QRCardPanelProps = {
  emergencyUrl: string | null;
  appBaseUrl: string;
};

const initialState: GenerateQrState = { success: false };

export function QRCardPanel({ emergencyUrl, appBaseUrl }: QRCardPanelProps) {
  const [state, formAction, isPending] = useActionState(generateQrTokenAction, initialState);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const effectiveUrl = useMemo(
    () => (state.token ? null : emergencyUrl),
    [state.token, emergencyUrl],
  );
  const finalUrl = state.token ? `${appBaseUrl}/emergency/${state.token}` : effectiveUrl;

  useEffect(() => {
    const activeUrl = finalUrl && finalUrl.length > 0 ? finalUrl : null;
    if (!activeUrl) {
      setQrDataUrl(null);
      return;
    }

    void QRCode.toDataURL(activeUrl, {
      width: 320,
      margin: 1,
      errorCorrectionLevel: "M",
    }).then(setQrDataUrl);
  }, [finalUrl]);

  function handleDownload() {
    if (!qrDataUrl) {
      return;
    }
    const link = document.createElement("a");
    link.href = qrDataUrl;
    link.download = "life-guardian-emergency-qr.png";
    link.click();
  }

  return (
    <section className="flex w-full min-w-0 flex-col items-center overflow-hidden rounded-2xl border border-border bg-surface p-4 sm:p-8">
      {qrDataUrl ? (
        <img
          src={qrDataUrl}
          alt="Emergency QR code"
          className="h-56 w-56 rounded-xl border border-border bg-white p-2"
        />
      ) : (
        <div
          className="flex h-56 w-56 items-center justify-center rounded-xl border-2 border-dashed border-border bg-background text-center text-sm text-muted"
          role="img"
          aria-label="QR code placeholder"
        >
          Generate your QR card
        </div>
      )}

      <p className="mt-6 w-full min-w-0 break-all rounded-lg border border-border bg-background px-3 py-2 text-center text-sm text-muted">
        {finalUrl ?? "No emergency URL yet. Generate a QR token first."}
      </p>

      {state.error ? (
        <p className="mt-4 w-full rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      ) : null}
      {state.message ? (
        <p className="mt-4 w-full rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {state.message}
        </p>
      ) : null}

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <form action={formAction}>
          <button
            type="submit"
            disabled={isPending}
            className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? "Generating..." : "Generate QR"}
          </button>
        </form>

        <button
          type="button"
          onClick={handleDownload}
          disabled={!qrDataUrl}
          className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-background disabled:cursor-not-allowed disabled:opacity-60"
        >
          Download QR
        </button>
      </div>
    </section>
  );
}
