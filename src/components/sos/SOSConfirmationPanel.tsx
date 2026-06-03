import type { SosConfirmationDto } from "@/types/sos";

type SOSConfirmationPanelProps = {
  confirmation: SosConfirmationDto;
};

function formatSentTime(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function SOSConfirmationPanel({ confirmation }: SOSConfirmationPanelProps) {
  return (
    <section
      className="min-w-0 overflow-hidden rounded-2xl border-2 border-emerald-300 bg-emerald-50 p-4 sm:p-6"
      aria-live="polite"
      role="status"
    >
      <div className="flex items-start gap-3">
        <span
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-lg font-bold text-white"
          aria-hidden
        >
          OK
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-bold text-emerald-900 sm:text-xl">SOS Activated</h2>
          <p className="mt-1 text-sm text-emerald-800">
            Your emergency alert was logged and delivery messages were prepared.
          </p>
        </div>
      </div>

      <dl className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-emerald-200 bg-white/80 p-3">
          <dt className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
            Contacts notified
          </dt>
          <dd className="mt-1 text-2xl font-bold text-emerald-900">
            {confirmation.contactsNotified}
          </dd>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-white/80 p-3">
          <dt className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
            Time sent
          </dt>
          <dd className="mt-1 text-sm font-semibold text-emerald-900">
            {formatSentTime(confirmation.sentAt)}
          </dd>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-white/80 p-3 sm:col-span-2">
          <dt className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
            Current location
          </dt>
          <dd className="mt-1 break-words text-sm font-medium text-emerald-900">
            {confirmation.locationLabel}
          </dd>
          {confirmation.locationAccuracy != null ? (
            <dd className="mt-1 text-xs text-emerald-800">
              GPS accuracy: ±{Math.round(confirmation.locationAccuracy)}m
            </dd>
          ) : null}
          {confirmation.mapsUrl ? (
            <a
              href={confirmation.mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex min-h-10 items-center rounded-lg border border-emerald-300 bg-white px-3 py-2 text-sm font-semibold text-emerald-800 hover:bg-emerald-50"
            >
              Open in Google Maps
            </a>
          ) : null}
        </div>
      </dl>

      {confirmation.deliveryLinks.length > 0 ? (
        <div className="mt-5">
          <h3 className="text-sm font-semibold text-emerald-900">Send to contacts</h3>
          <p className="mt-1 text-xs text-emerald-800">
            Tap WhatsApp or SMS to open a pre-filled emergency message for each contact.
          </p>
          <ul className="mt-3 space-y-2">
            {confirmation.deliveryLinks.map((link) => (
              <li
                key={link.contactId}
                className="flex flex-col gap-2 rounded-xl border border-emerald-200 bg-white/80 p-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-emerald-900">
                    {link.contactName}
                  </p>
                  <p className="truncate text-xs text-emerald-700">{link.phone}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <a
                    href={link.whatsAppUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-10 flex-1 items-center justify-center rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700 sm:flex-none"
                  >
                    WhatsApp
                  </a>
                  <a
                    href={link.smsUrl}
                    className="inline-flex min-h-10 flex-1 items-center justify-center rounded-lg border border-emerald-300 bg-white px-3 py-2 text-xs font-semibold text-emerald-800 hover:bg-emerald-50 sm:flex-none"
                  >
                    SMS
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          No emergency contacts on file. Add contacts on your profile so future SOS alerts can
          reach them.
        </p>
      )}
    </section>
  );
}
