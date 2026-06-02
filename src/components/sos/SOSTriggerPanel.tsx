"use client";

import { useActionState } from "react";
import { triggerSOSAction, type TriggerSosState } from "@/app/(app)/sos/actions";

const initialState: TriggerSosState = { success: false };

export function SOSTriggerPanel() {
  const [state, formAction, isPending] = useActionState(triggerSOSAction, initialState);

  return (
    <section className="mx-auto flex w-full max-w-xl flex-col rounded-2xl border border-border bg-surface p-6 sm:p-8">
      <h2 className="text-lg font-semibold text-foreground">Trigger SOS</h2>
      <p className="mt-1 text-sm text-muted">
        This foundation phase logs SOS events in your database with status <strong>ACTIVE</strong>.
      </p>

      <form action={formAction} className="mt-6 space-y-4">
        <label className="space-y-1.5">
          <span className="text-sm font-medium text-foreground">Message (optional)</span>
          <textarea
            name="message"
            rows={3}
            placeholder="Describe your emergency briefly"
            className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none ring-brand/20 focus:ring-4"
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-1.5">
            <span className="text-sm font-medium text-foreground">Latitude (optional)</span>
            <input
              name="latitude"
              type="number"
              step="any"
              placeholder="e.g. 37.7749"
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none ring-brand/20 focus:ring-4"
            />
          </label>
          <label className="space-y-1.5">
            <span className="text-sm font-medium text-foreground">Longitude (optional)</span>
            <input
              name="longitude"
              type="number"
              step="any"
              placeholder="e.g. -122.4194"
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none ring-brand/20 focus:ring-4"
            />
          </label>
        </div>

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

        <button
          type="submit"
          disabled={isPending}
          className="inline-flex h-12 items-center justify-center rounded-xl bg-sos px-6 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Triggering..." : "🚨 Trigger SOS"}
        </button>
      </form>
    </section>
  );
}
