"use client";

import { useActionState } from "react";
import { saveEmergencyProfile } from "@/app/(app)/profile/actions";
import type { SaveProfileState } from "@/app/(app)/profile/types";
import { useActionStateToast } from "@/components/ui/toast/useActionStateToast";

type EmergencyProfileFormValues = {
  displayName: string;
  dateOfBirth: string;
  bloodType: string;
  allergies: string;
  medications: string;
  medicalConditions: string;
  notes: string;
  primaryLanguage: string;
};

type EmergencyProfileFormProps = {
  initialValues: EmergencyProfileFormValues;
};

const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const;

const initialState: SaveProfileState = { success: false };

export function EmergencyProfileForm({ initialValues }: EmergencyProfileFormProps) {
  const [state, formAction, isPending] = useActionState(saveEmergencyProfile, initialState);

  useActionStateToast(state);

  return (
    <form action={formAction} className="space-y-5" aria-busy={isPending}>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-medium text-foreground">Display name</span>
          <input
            name="displayName"
            type="text"
            defaultValue={initialValues.displayName}
            placeholder="e.g. Alex Morgan"
            className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none ring-brand/20 transition focus:ring-4"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-foreground">Date of birth</span>
          <input
            name="dateOfBirth"
            type="date"
            defaultValue={initialValues.dateOfBirth}
            className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none ring-brand/20 transition focus:ring-4"
          />
        </label>
      </div>

      <label className="space-y-2">
        <span className="text-sm font-medium text-foreground">Blood type</span>
        <select
          name="bloodType"
          defaultValue={initialValues.bloodType}
          className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none ring-brand/20 transition focus:ring-4"
        >
          <option value="">Select blood type</option>
          {BLOOD_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </label>

      <label className="space-y-2">
        <span className="text-sm font-medium text-foreground">Allergies</span>
        <textarea
          name="allergies"
          defaultValue={initialValues.allergies}
          rows={3}
          placeholder="List known allergies"
          className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none ring-brand/20 transition focus:ring-4"
        />
      </label>

      <label className="space-y-2">
        <span className="text-sm font-medium text-foreground">Medications</span>
        <textarea
          name="medications"
          defaultValue={initialValues.medications}
          rows={3}
          placeholder="List ongoing medications"
          className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none ring-brand/20 transition focus:ring-4"
        />
      </label>

      <label className="space-y-2">
        <span className="text-sm font-medium text-foreground">Medical conditions</span>
        <textarea
          name="medicalConditions"
          defaultValue={initialValues.medicalConditions}
          rows={3}
          placeholder="e.g. Asthma, Diabetes"
          className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none ring-brand/20 transition focus:ring-4"
        />
      </label>

      <label className="space-y-2">
        <span className="text-sm font-medium text-foreground">Primary language</span>
        <input
          name="primaryLanguage"
          type="text"
          defaultValue={initialValues.primaryLanguage}
          placeholder="e.g. en"
          className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none ring-brand/20 transition focus:ring-4"
        />
      </label>

      <label className="space-y-2">
        <span className="text-sm font-medium text-foreground">Additional notes</span>
        <textarea
          name="notes"
          defaultValue={initialValues.notes}
          rows={4}
          placeholder="Any critical notes for emergency responders"
          className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none ring-brand/20 transition focus:ring-4"
        />
      </label>

      {state.error ? (
        <p className="sr-only" role="alert">
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex min-h-11 items-center justify-center rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark focus:outline-none focus:ring-4 focus:ring-brand/30 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isPending ? "Saving..." : "Save Emergency Profile"}
      </button>
    </form>
  );
}
