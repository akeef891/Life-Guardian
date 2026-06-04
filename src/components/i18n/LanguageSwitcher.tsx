"use client";

import { LOCALE_LABELS, LOCALES } from "@/lib/i18n/locales";
import { useLocale } from "./LocaleProvider";

export function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();

  return (
    <label className="inline-flex min-h-11 items-center gap-2 text-sm">
      <span className="sr-only">Language</span>
      <select
        value={locale}
        onChange={(e) => setLocale(e.target.value as typeof locale)}
        className="rounded-lg border border-border bg-background px-3 py-2.5 text-sm font-medium text-foreground outline-none focus:ring-4 focus:ring-brand/25"
        aria-label="Select language"
      >
        {LOCALES.map((code) => (
          <option key={code} value={code}>
            {LOCALE_LABELS[code]}
          </option>
        ))}
      </select>
    </label>
  );
}
