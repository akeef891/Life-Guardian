"use client";

import { useActionState, useRef, useState } from "react";
import { triggerSOSAction, type TriggerSosState } from "@/app/(app)/sos/actions";
import { getAccuratePosition } from "@/lib/geolocation/get-accurate-position";

const initialState: TriggerSosState = { success: false };

export function SOSTriggerPanel() {
  const [state, formAction, isPending] = useActionState(triggerSOSAction, initialState);
  const [geoStatus, setGeoStatus] = useState<
    | "idle"
    | "getting-location"
    | "permission-denied"
    | "unavailable"
    | "timeout"
    | "unsupported"
    | "failed"
  >("idle");
  const [lastAccuracy, setLastAccuracy] = useState<number | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const latitudeRef = useRef<HTMLInputElement>(null);
  const longitudeRef = useRef<HTMLInputElement>(null);
  const accuracyRef = useRef<HTMLInputElement>(null);

  function setLocationValues(
    latitude: number | null,
    longitude: number | null,
    accuracy: number | null,
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
  }

  function submitWithLocation(
    latitude: number | null,
    longitude: number | null,
    accuracy: number | null,
  ) {
    setLocationValues(latitude, longitude, accuracy);
    formRef.current?.requestSubmit();
  }

  async function triggerSOSWithLocation() {
    setGeoStatus("getting-location");
    setLastAccuracy(null);

    const result = await getAccuratePosition();

    if (result.ok) {
      setGeoStatus("idle");
      setLastAccuracy(result.accuracy);
      submitWithLocation(result.latitude, result.longitude, result.accuracy);
      return;
    }

    setGeoStatus(result.reason);
    submitWithLocation(null, null, null);
  }

  const isLocating = geoStatus === "getting-location";

  return (
    <section className="mx-auto flex w-full max-w-xl flex-col rounded-2xl border border-border bg-surface p-4 sm:p-6 md:p-8">
      <h2 className="text-lg font-semibold text-foreground sm:text-xl">Trigger SOS</h2>
      <p className="mt-1 text-sm text-muted">
        Logs an SOS with status <strong>ACTIVE</strong>. Location uses GPS for up to ~20 seconds
        for a tighter pin before sending.
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

        {state.error ? (
          <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {state.error}
          </p>
        ) : null}
        {state.message ? (
          <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            {state.message}
          </p>
        ) : null}
        {isLocating ? (
          <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
            Pinpointing your location… Stay still and allow location access. This can take up to 20
            seconds for better GPS accuracy.
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
        {lastAccuracy != null && geoStatus === "idle" && state.success ? (
          <p className="text-xs text-muted">
            Last fix accuracy: ±{Math.round(lastAccuracy)}m
            {lastAccuracy > 50
              ? " — for best results, trigger SOS outdoors with clear sky view."
              : null}
          </p>
        ) : null}

        <button
          type="button"
          onClick={triggerSOSWithLocation}
          disabled={isPending || isLocating}
          className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-sos px-6 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {isPending
            ? "Triggering..."
            : isLocating
              ? "Getting location..."
              : "🚨 Trigger SOS"}
        </button>
      </form>
    </section>
  );
}
