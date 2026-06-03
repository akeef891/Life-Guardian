"use client";

import { useActionState, useRef, useState } from "react";
import { triggerSOSAction } from "@/app/(app)/sos/actions";
import { SOSConfirmationPanel } from "@/components/sos/SOSConfirmationPanel";
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
  const latitudeRef = useRef<HTMLInputElement>(null);
  const longitudeRef = useRef<HTMLInputElement>(null);
  const accuracyRef = useRef<HTMLInputElement>(null);
  const capturedAtRef = useRef<HTMLInputElement>(null);

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
    setGeoStatus("getting-location");

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
  }

  const isLocating = geoStatus === "getting-location";

  return (
    <div className="space-y-4">
      {state.confirmation ? <SOSConfirmationPanel confirmation={state.confirmation} /> : null}

      <section className="mx-auto flex w-full max-w-xl flex-col rounded-2xl border border-border bg-surface p-4 sm:p-6 md:p-8">
        <h2 className="text-lg font-semibold text-foreground sm:text-xl">Trigger SOS</h2>
        <p className="mt-1 text-sm text-muted">
          Activates an emergency alert, captures GPS (15s timeout, high accuracy), prepares
          WhatsApp and SMS messages for your contacts, and logs delivery status.
        </p>

        <form ref={formRef} action={formAction} className="mt-5 space-y-4 sm:mt-6">
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-foreground">Message (optional)</span>
            <textarea
              name="message"
              rows={3}
              placeholder="Describe your emergency briefly"
              className="w-full resize-y rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none ring-brand/20 focus:ring-4"
            />
          </label>

          <input ref={latitudeRef} type="hidden" name="latitude" />
          <input ref={longitudeRef} type="hidden" name="longitude" />
          <input ref={accuracyRef} type="hidden" name="accuracy" />
          <input ref={capturedAtRef} type="hidden" name="locationCapturedAt" />

          {state.error ? (
            <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {state.error}
            </p>
          ) : null}
          {state.message && !state.confirmation ? (
            <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              {state.message}
            </p>
          ) : null}
          {isLocating ? (
            <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
              Getting your location with high accuracy… Stay still. Retries once if accuracy is
              poor (up to 15 seconds).
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
            className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-sos px-6 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {isPending ? "Triggering..." : isLocating ? "Getting location..." : "Trigger SOS"}
          </button>
        </form>
      </section>
    </div>
  );
}
