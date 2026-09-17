"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { locales, localeMeta, switchLocalePath, type Locale } from "@/lib/i18n/config";

/* What the switch shows: the full Arabic name on English pages, "EN" on Arabic pages. */
const switchLabel: Record<Locale, string> = {
  ar: localeMeta.ar.label,
  en: localeMeta.en.shortLabel,
};

/**
 * Language is a link, not a script toggle, so the choice is crawlable, works
 * without JavaScript and lands on the same page in the other language. Only
 * the other language is offered — the current one needs no link.
 */
export function LocaleSwitcher({
  locale,
  label,
  tone = "dark",
}: {
  locale: Locale;
  label: string;
  tone?: "dark" | "light";
}) {
  const pathname = usePathname();
  const target = locales.find((code) => code !== locale) ?? locale;

  return (
    <div className="flex items-center" role="group" aria-label={label}>
      <Link
        href={switchLocalePath(pathname, target)}
        hrefLang={target}
        lang={target}
        className={cn(
          "inline-flex min-h-8 min-w-8 items-center justify-center rounded px-1.5 text-xs font-semibold no-underline transition-colors",
          tone === "dark" ? "text-white/85 hover:text-glacier-300" : "text-ink-strong hover:text-glacier-600",
        )}
      >
        {switchLabel[target]}
        {switchLabel[target] !== localeMeta[target].label ? (
          <span className="sr-only"> — {localeMeta[target].label}</span>
        ) : null}
      </Link>
    </div>
  );
}
