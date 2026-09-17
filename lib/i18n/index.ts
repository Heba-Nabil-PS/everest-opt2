import { en, type Dictionary } from "./locales/en";
import { ar } from "./locales/ar";
import { defaultLocale, isLocale, type Locale } from "./config";

const dictionaries: Record<Locale, Dictionary> = { en, ar };

/** Synchronous lookup — dictionaries are static modules, not remote data. */
export function getDictionary(locale: string): Dictionary {
  return dictionaries[isLocale(locale) ? locale : defaultLocale];
}

/**
 * Interpolate `{name}` placeholders in a dictionary string.
 * `t(d.common.showing, { shown: 8, total: 24 })` -> "Showing 8 of 24 models"
 */
export function t(template: string, values: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}

export type { Dictionary };
export * from "./config";
