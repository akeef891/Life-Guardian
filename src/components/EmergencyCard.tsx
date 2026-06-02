import type { EmergencyCardData } from "@/types/emergency";
import { cn } from "@/lib/utils/cn";

type EmergencyCardProps = {
  data: EmergencyCardData;
  className?: string;
};

export function EmergencyCard({ data, className }: EmergencyCardProps) {
  const {
    displayName,
    bloodType,
    allergies,
    medications,
    medicalConditions,
    notes,
    emergencyContacts = [],
  } = data;

  return (
    <article
      className={cn(
        "overflow-hidden rounded-2xl border-2 border-emergency bg-background shadow-lg",
        className,
      )}
      aria-label={`Emergency information for ${displayName}`}
    >
      <header className="bg-emergency px-6 py-4 text-white">
        <p className="text-xs font-medium uppercase tracking-wider opacity-90">
          Emergency Medical Information
        </p>
        <h2 className="mt-1 text-2xl font-bold">{displayName}</h2>
      </header>

      <div className="space-y-6 p-6">
        {bloodType && (
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted">
              Blood Type
            </h3>
            <p className="mt-1 text-2xl font-bold text-foreground">{bloodType}</p>
          </section>
        )}

        {allergies && (
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted">
              Allergies
            </h3>
            <p className="mt-1 text-lg font-medium text-foreground">{allergies}</p>
          </section>
        )}

        {medications && (
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted">
              Medications
            </h3>
            <p className="mt-1 text-foreground">{medications}</p>
          </section>
        )}

        {medicalConditions && (
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted">
              Medical Conditions
            </h3>
            <p className="mt-1 text-foreground">{medicalConditions}</p>
          </section>
        )}

        {notes && (
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted">
              Additional Notes
            </h3>
            <p className="mt-1 text-foreground">{notes}</p>
          </section>
        )}

        <section>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted">
            Emergency Contacts
          </h3>
          {emergencyContacts.length > 0 ? (
            <ul className="mt-3 space-y-3">
              {emergencyContacts.map((contact) => (
                <li
                  key={`${contact.name}-${contact.phone}`}
                  className="rounded-lg border border-border bg-surface p-4"
                >
                  <p className="font-semibold text-foreground">{contact.name}</p>
                  <div className="mt-1 flex items-center gap-2">
                    {contact.relationship && (
                      <p className="text-sm text-muted">{contact.relationship}</p>
                    )}
                    {contact.isPrimary ? (
                      <span className="rounded-full bg-brand/10 px-2 py-0.5 text-xs font-semibold text-brand">
                        Primary
                      </span>
                    ) : null}
                  </div>
                  <a
                    href={`tel:${contact.phone.replace(/\s/g, "")}`}
                    className="mt-2 inline-block text-lg font-medium text-brand hover:underline"
                  >
                    {contact.phone}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-muted">
              No emergency contacts have been added yet.
            </p>
          )}
        </section>
      </div>

      <footer className="border-t border-border bg-surface px-6 py-3 text-center text-xs text-muted">
        Information provided via Life Guardian
      </footer>
    </article>
  );
}
