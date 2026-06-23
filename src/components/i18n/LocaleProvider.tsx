"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";
import {
  getInitialClientDictionary,
  loadClientDictionary,
} from "@/lib/i18n/client-dictionary";
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  type Locale,
} from "@/lib/i18n/locales";

type LocaleContextValue = {
  locale: Locale;
  dictionary: Dictionary;
  setLocale: (locale: Locale) => void;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

type LocaleProviderProps = {
  children: ReactNode;
  initialLocale?: Locale;
  initialDictionary?: Dictionary;
};

export function LocaleProvider({
  children,
  initialLocale = DEFAULT_LOCALE,
  initialDictionary,
}: LocaleProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const [dictionary, setDictionary] = useState<Dictionary>(() =>
    getInitialClientDictionary(initialLocale, initialDictionary),
  );

  useEffect(() => {
    if (locale === initialLocale && initialDictionary) {
      return;
    }

    let cancelled = false;

    void loadClientDictionary(locale).then((nextDictionary) => {
      if (!cancelled) {
        setDictionary(nextDictionary);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [locale, initialLocale, initialDictionary]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    document.cookie = `${LOCALE_COOKIE}=${next};path=/;max-age=31536000;SameSite=Lax`;
    document.documentElement.lang = next;
  }, []);

  const value = useMemo(
    () => ({
      locale,
      dictionary,
      setLocale,
    }),
    [locale, dictionary, setLocale],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useLocale must be used within LocaleProvider");
  }
  return ctx;
}
