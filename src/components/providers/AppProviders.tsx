"use client";

import type { ReactNode } from "react";
import { LocaleProvider } from "@/components/i18n/LocaleProvider";
import { ToastProvider } from "@/components/ui/toast/ToastProvider";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";
import type { Locale } from "@/lib/i18n/locales";

type AppProvidersProps = {
  children: ReactNode;
  initialLocale?: Locale;
  initialDictionary?: Dictionary;
};

export function AppProviders({
  children,
  initialLocale,
  initialDictionary,
}: AppProvidersProps) {
  return (
    <LocaleProvider initialLocale={initialLocale} initialDictionary={initialDictionary}>
      <ToastProvider>{children}</ToastProvider>
    </LocaleProvider>
  );
}
