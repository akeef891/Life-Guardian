import type { Locale } from "./locales";
import { DEFAULT_LOCALE } from "./locales";
import type { Dictionary } from "./dictionaries/en";
import { en } from "./dictionaries/en";
import { ta } from "./dictionaries/ta";
import { hi } from "./dictionaries/hi";

const dictionaries: Record<Locale, Dictionary> = { en, ta, hi };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries[DEFAULT_LOCALE];
}
