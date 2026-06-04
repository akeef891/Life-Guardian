"use client";

import type { ReactNode } from "react";
import { LocaleProvider } from "@/components/i18n/LocaleProvider";
import { ToastProvider } from "@/components/ui/toast/ToastProvider";
import type { Locale } from "@/lib/i18n/locales";

type AppProvidersProps = {
  children: ReactNode;
  initialLocale?: Locale;
};

export function AppProviders({ children, initialLocale }: AppProvidersProps) {
  return (
    <LocaleProvider initialLocale={initialLocale}>
      <ToastProvider>{children}</ToastProvider>
    </LocaleProvider>
  );
}
