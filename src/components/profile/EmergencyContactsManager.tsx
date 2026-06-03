import {
  createEmergencyContact,
  deleteEmergencyContact,
  updateEmergencyContact,
} from "@/app/(app)/profile/contact-actions";
import type { EmergencyContactRecord } from "@/lib/db/prisma-types";

type EmergencyContactsManagerProps = {
  contacts: EmergencyContactRecord[];
};

export function EmergencyContactsManager({ contacts }: EmergencyContactsManagerProps) {
  return (
    <section className="rounded-2xl border border-border bg-surface p-6">
      <h2 className="text-lg font-semibold text-foreground">Emergency Contacts</h2>
      <p className="mt-2 text-sm text-muted">
        Add, edit, and delete contacts. Exactly one contact is kept as primary.
      </p>

      <form action={createEmergencyContact} className="mt-6 grid gap-4 rounded-xl border border-border bg-background p-4 sm:grid-cols-2">
        <label className="space-y-1">
          <span className="text-xs font-medium text-muted">Name</span>
          <input
            name="name"
            required
            placeholder="e.g. John Doe"
            className="w-full rounded-lg border border-border px-3 py-2 text-sm"
          />
        </label>
        <label className="space-y-1">
          <span className="text-xs font-medium text-muted">Relationship</span>
          <input
            name="relationship"
            placeholder="e.g. Spouse"
            className="w-full rounded-lg border border-border px-3 py-2 text-sm"
          />
        </label>
        <label className="space-y-1">
          <span className="text-xs font-medium text-muted">Phone Number</span>
          <input
            name="phone"
            required
            placeholder="+15551234567"
            pattern="^\+[1-9]\d{7,14}$"
            title="Use international format, e.g. +15551234567"
            className="w-full rounded-lg border border-border px-3 py-2 text-sm"
          />
        </label>
        <label className="flex items-center gap-2 rounded-lg border border-border px-3 py-2.5 text-sm">
          <input type="checkbox" name="isPrimary" className="h-4 w-4 rounded border-border" />
          Mark as Primary Contact
        </label>

        <div className="sm:col-span-2">
          <button
            type="submit"
            className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
          >
            Add Contact
          </button>
        </div>
      </form>

      <div className="mt-6 space-y-4">
        {contacts.length === 0 ? (
          <p className="rounded-lg border border-dashed border-border px-4 py-3 text-sm text-muted">
            No contacts added yet.
          </p>
        ) : null}

        {contacts.map((contact) => (
          <form
            key={contact.id}
            action={updateEmergencyContact}
            className="grid gap-4 rounded-xl border border-border bg-background p-4 sm:grid-cols-2"
          >
            <input type="hidden" name="contactId" value={contact.id} />

            <label className="space-y-1">
              <span className="text-xs font-medium text-muted">Name</span>
              <input
                name="name"
                required
                defaultValue={contact.name}
                className="w-full rounded-lg border border-border px-3 py-2 text-sm"
              />
            </label>
            <label className="space-y-1">
              <span className="text-xs font-medium text-muted">Relationship</span>
              <input
                name="relationship"
                defaultValue={contact.relationship ?? ""}
                className="w-full rounded-lg border border-border px-3 py-2 text-sm"
              />
            </label>
            <label className="space-y-1">
              <span className="text-xs font-medium text-muted">Phone Number</span>
              <input
                name="phone"
                required
                defaultValue={contact.phone}
                pattern="^\+[1-9]\d{7,14}$"
                title="Use international format, e.g. +15551234567"
                className="w-full rounded-lg border border-border px-3 py-2 text-sm"
              />
            </label>
            <label className="flex items-center gap-2 rounded-lg border border-border px-3 py-2.5 text-sm">
              <input
                type="checkbox"
                name="isPrimary"
                defaultChecked={contact.isPrimary}
                className="h-4 w-4 rounded border-border"
              />
              Primary Contact
            </label>

            <div className="sm:col-span-2 flex flex-wrap items-center gap-2">
              <button
                type="submit"
                className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-surface"
              >
                Save Changes
              </button>
              <button
                type="submit"
                formAction={deleteEmergencyContact}
                className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50"
              >
                Delete
              </button>
              {contact.isPrimary ? (
                <span className="ml-auto rounded-full bg-brand/10 px-2.5 py-1 text-xs font-semibold text-brand">
                  Primary
                </span>
              ) : null}
            </div>
          </form>
        ))}
      </div>
    </section>
  );
}
