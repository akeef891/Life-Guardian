import type { Dictionary } from "./dictionaries/en";
import { en } from "./dictionaries/en";
import type { Locale } from "./locales";

/** Loads locale dictionaries on demand for client bundles (English stays synchronous). */
export async function loadClientDictionary(locale: Locale): Promise<Dictionary> {
  if (locale === "ta") {
    return (await import("./dictionaries/ta")).ta;
  }
  if (locale === "hi") {
    return (await import("./dictionaries/hi")).hi;
  }
  return en;
}

export function getInitialClientDictionary(
  locale: Locale,
  serverDictionary?: Dictionary,
): Dictionary {
  if (serverDictionary) {
    return serverDictionary;
  }
  return locale === "en" ? en : en;
}
