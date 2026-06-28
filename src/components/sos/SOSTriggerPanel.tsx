"use client";

import { useActionState, useRef, useState } from "react";
import { triggerSOSAction } from "@/app/(app)/sos/actions";
import { SOSConfirmationPanel } from "@/components/sos/SOSConfirmationPanel";
import { useActionStateToast } from "@/components/ui/toast/useActionStateToast";
import { getBrowserTimeZone } from "@/lib/datetime/format-datetime";
import { getAccuratePosition } from "@/lib/geolocation/get-accurate-position";
import { TRIGGER_SOS_INITIAL_STATE, type TriggerSosState } from "@/types/sos";

export function SOSTriggerPanel() {
  const [state, formAction, isPending] = useActionState<TriggerSosState, FormData>(
    triggerSOSAction,
    TRIGGER_SOS_INITIAL_STATE,
  );
  const [geoStatus, setGeoStatus] = useState<
    | "idle"
    | "getting-location"
    | "permission-denied"
    | "unavailable"
    | "timeout"
    | "unsupported"
    | "failed"
  >("idle");
  const formRef = useRef<HTMLFormElement>(null);
  const submitInFlightRef = useRef(false);
  const latitudeRef = useRef<HTMLInputElement>(null);
  const longitudeRef = useRef<HTMLInputElement>(null);
  const accuracyRef = useRef<HTMLInputElement>(null);
  const capturedAtRef = useRef<HTMLInputElement>(null);

  useActionStateToast(state);

  function setLocationValues(
    latitude: number | null,
    longitude: number | null,
    accuracy: number | null,
    capturedAt: number | null,
  ) {
    if (latitudeRef.current) {
      latitudeRef.current.value = latitude != null ? latitude.toFixed(7) : "";
    }
    if (longitudeRef.current) {
      longitudeRef.current.value = longitude != null ? longitude.toFixed(7) : "";
    }
    if (accuracyRef.current) {
      accuracyRef.current.value = accuracy != null ? String(accuracy) : "";
    }
    if (capturedAtRef.current) {
      capturedAtRef.current.value = capturedAt != null ? new Date(capturedAt).toISOString() : "";
    }
  }

  function submitWithLocation(
    latitude: number | null,
    longitude: number | null,
    accuracy: number | null,
    capturedAt: number | null,
  ) {
    setLocationValues(latitude, longitude, accuracy, capturedAt);
    formRef.current?.requestSubmit();
  }

  async function triggerSOSWithLocation() {
    if (submitInFlightRef.current || isPending || isLocating) {
      return;
    }

    submitInFlightRef.current = true;
    setGeoStatus("getting-location");

    try {
      const result = await getAccuratePosition();

      if (result.ok) {
        setGeoStatus("idle");
        submitWithLocation(
          result.latitude,
          result.longitude,
          result.accuracy,
          result.timestamp,
        );
        return;
      }

      setGeoStatus(result.reason);
      submitWithLocation(null, null, null, null);
    } finally {
      submitInFlightRef.current = false;
    }
  }

  const isLocating = geoStatus === "getting-location";

  return (
    <div className="min-w-0 space-y-4 overflow-x-hidden">
      {state.confirmation ? <SOSConfirmationPanel confirmation={state.confirmation} /> : null}

    <section
      className="mx-auto flex w-full min-w-0 max-w-xl flex-col overflow-hidden rounded-2xl border border-border bg-surface p-4 sm:p-6 md:p-8"
      aria-labelledby="sos-trigger-heading"
    >
      <h2 id="sos-trigger-heading" className="text-lg font-semibold text-foreground sm:text-xl">
        Trigger SOS
      </h2>
      <p className="mt-1 text-sm text-muted">
        High-accuracy GPS (up to 30s, 3 attempts). Retries when accuracy is over 50–100m. Prepares
        WhatsApp and SMS alerts for all emergency contacts.
      </p>

        <form ref={formRef} action={formAction} className="mt-5 space-y-4 sm:mt-6" aria-busy={isPending}>
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-foreground">Message (optional)</span>
            <textarea
              name="message"
              rows={3}
              placeholder="Describe your emergency briefly"
              aria-label="Optional SOS message"
              className="w-full min-h-11 resize-y rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none ring-brand/20 focus:ring-4"
            />
          </label>

          <input ref={latitudeRef} type="hidden" name="latitude" />
          <input ref={longitudeRef} type="hidden" name="longitude" />
          <input ref={accuracyRef} type="hidden" name="accuracy" />
          <input ref={capturedAtRef} type="hidden" name="locationCapturedAt" />
          <input type="hidden" name="clientTimeZone" value={getBrowserTimeZone()} />

          {state.error ? (
            <p className="sr-only" role="alert">
              {state.error}
            </p>
          ) : null}
          {isLocating ? (
            <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
            Acquiring high-accuracy GPS (up to 30 seconds, up to 3 attempts). Stay still for the best fix.
            </p>
          ) : null}
          {geoStatus === "permission-denied" ? (
            <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
              Location permission denied. SOS was still created without coordinates.
            </p>
          ) : null}
          {geoStatus === "unavailable" ? (
            <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
              Location unavailable. SOS was created without coordinates.
            </p>
          ) : null}
          {geoStatus === "unsupported" ? (
            <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
              Location is not supported by this browser/device. SOS was created without coordinates.
            </p>
          ) : null}
          {geoStatus === "timeout" ? (
            <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
              Could not get a GPS fix in time. SOS was created without coordinates.
            </p>
          ) : null}
          {geoStatus === "failed" ? (
            <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
              Unable to read location. SOS was created without coordinates.
            </p>
          ) : null}

          <button
            type="button"
            onClick={triggerSOSWithLocation}
            disabled={isPending || isLocating}
            aria-label="Trigger SOS alert with current location"
            className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-sos px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {isPending ? "Triggering..." : isLocating ? "Getting location..." : "Trigger SOS"}
          </button>
        </form>
      </section>
    </div>
  );
}
