"use client";

import { useActionState } from "react";
import {
  createEmergencyContact,
  deleteEmergencyContact,
  updateEmergencyContact,
} from "@/app/(app)/profile/contact-actions";
import { CONTACT_ACTION_INITIAL_STATE } from "@/app/(app)/profile/types";
import { EmptyState } from "@/components/ui/EmptyState";
import { useActionStateToast } from "@/components/ui/toast/useActionStateToast";
import type { EmergencyContactRecord } from "@/lib/db/prisma-types";

type EmergencyContactsManagerProps = {
  contacts: EmergencyContactRecord[];
};

const inputClassName =
  "w-full min-h-11 rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none ring-brand/20 transition focus:ring-4";

function ContactRow({ contact }: { contact: EmergencyContactRecord }) {
  const [updateState, updateAction, updatePending] = useActionState(
    updateEmergencyContact,
    CONTACT_ACTION_INITIAL_STATE,
  );
  const [deleteState, deleteAction, deletePending] = useActionState(
    deleteEmergencyContact,
    CONTACT_ACTION_INITIAL_STATE,
  );

  useActionStateToast(updateState);
  useActionStateToast(deleteState);

  const busy = updatePending || deletePending;

  return (
    <div className="space-y-3">
      <form
        action={updateAction}
        className="grid gap-4 rounded-xl border border-border bg-background p-4 sm:grid-cols-2"
        aria-busy={updatePending}
      >
        <input type="hidden" name="contactId" value={contact.id} />

        <label className="space-y-1">
          <span className="text-xs font-medium text-muted">Name</span>
          <input
            name="name"
            required
            defaultValue={contact.name}
            autoComplete="name"
            className={inputClassName}
          />
        </label>
        <label className="space-y-1">
          <span className="text-xs font-medium text-muted">Relationship</span>
          <input
            name="relationship"
            defaultValue={contact.relationship ?? ""}
            autoComplete="off"
            className={inputClassName}
          />
        </label>
        <label className="space-y-1">
          <span className="text-xs font-medium text-muted">Phone Number</span>
          <input
            name="phone"
            required
            type="tel"
            defaultValue={contact.phone}
            pattern="^\+[1-9]\d{7,14}$"
            title="Use international format, e.g. +15551234567"
            autoComplete="tel"
            className={inputClassName}
          />
        </label>
        <label className="flex min-h-11 items-center gap-2 rounded-lg border border-border px-3 py-2.5 text-sm">
          <input
            type="checkbox"
            name="isPrimary"
            defaultChecked={contact.isPrimary}
            className="h-4 w-4 rounded border-border"
          />
          Primary Contact
        </label>

        <div className="flex flex-wrap items-center gap-2 sm:col-span-2">
          <button
            type="submit"
            disabled={busy}
            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-surface focus:outline-none focus:ring-4 focus:ring-brand/30 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {updatePending ? "Saving..." : "Save Changes"}
          </button>
          {contact.isPrimary ? (
            <span className="ml-auto rounded-full bg-brand/10 px-2.5 py-1 text-xs font-semibold text-brand">
              Primary
            </span>
          ) : null}
        </div>
      </form>

      <form action={deleteAction} className="flex justify-end">
        <input type="hidden" name="contactId" value={contact.id} />
        <button
          type="submit"
          disabled={busy}
          className="inline-flex min-h-11 items-center justify-center rounded-lg border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-700 transition-colors hover:bg-red-50 focus:outline-none focus:ring-4 focus:ring-red-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {deletePending ? "Deleting..." : "Delete Contact"}
        </button>
      </form>
    </div>
  );
}

export function EmergencyContactsManager({ contacts }: EmergencyContactsManagerProps) {
  const [createState, createAction, createPending] = useActionState(
    createEmergencyContact,
    CONTACT_ACTION_INITIAL_STATE,
  );

  useActionStateToast(createState);

  return (
    <section
      id="emergency-contacts"
      className="min-w-0 overflow-hidden rounded-2xl border border-border bg-surface p-4 sm:p-6"
      aria-labelledby="contacts-heading"
    >
      <h2 id="contacts-heading" className="text-lg font-semibold text-foreground">
        Emergency Contacts
      </h2>
      <p className="mt-2 text-sm text-muted">
        Add, edit, and delete contacts. Exactly one contact is kept as primary.
      </p>

      <form
        action={createAction}
        className="mt-6 grid gap-4 rounded-xl border border-border bg-background p-4 sm:grid-cols-2"
        aria-busy={createPending}
      >
        <label className="space-y-1">
          <span className="text-xs font-medium text-muted">Name</span>
          <input
            name="name"
            required
            placeholder="e.g. John Doe"
            autoComplete="name"
            className={inputClassName}
          />
        </label>
        <label className="space-y-1">
          <span className="text-xs font-medium text-muted">Relationship</span>
          <input
            name="relationship"
            placeholder="e.g. Spouse"
            autoComplete="off"
            className={inputClassName}
          />
        </label>
        <label className="space-y-1">
          <span className="text-xs font-medium text-muted">Phone Number</span>
          <input
            name="phone"
            required
            type="tel"
            placeholder="+15551234567"
            pattern="^\+[1-9]\d{7,14}$"
            title="Use international format, e.g. +15551234567"
            autoComplete="tel"
            className={inputClassName}
          />
        </label>
        <label className="flex min-h-11 items-center gap-2 rounded-lg border border-border px-3 py-2.5 text-sm">
          <input type="checkbox" name="isPrimary" className="h-4 w-4 rounded border-border" />
          Mark as Primary Contact
        </label>

        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={createPending}
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark focus:outline-none focus:ring-4 focus:ring-brand/30 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {createPending ? "Adding..." : "Add Contact"}
          </button>
        </div>
      </form>

      <div className="mt-6 space-y-4">
        {contacts.length === 0 ? (
          <EmptyState
            title="No emergency contacts yet"
            description="Add an emergency contact to improve emergency readiness."
          />
        ) : (
          contacts.map((contact) => <ContactRow key={contact.id} contact={contact} />)
        )}
      </div>
    </section>
  );
}
