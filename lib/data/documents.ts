import type { Locale } from "@/lib/i18n/config";
import { categories, products } from "./products";
import type { Localized } from "./types";

export type DocumentKind = "spec-sheet" | "manual" | "brochure" | "catalogue";

export interface DocumentRef {
  id: string;
  kind: DocumentKind;
  title: Localized;
  description: Localized;
  href: string;
  fileType: "PDF";
  /** Approximate size, shown so users know what they are clicking. */
  size: string;
}

/**
 * Documents are generated on request from the same data that renders the site,
 * so a download can never disagree with the page it came from.
 */
export function documentHref(kind: DocumentKind, slug: string, locale: Locale) {
  return `/api/documents/${kind}/${slug}?lang=${locale}`;
}

export function specSheetFor(slug: string, locale: Locale) {
  return documentHref("spec-sheet", slug, locale);
}

export function manualFor(slug: string, locale: Locale) {
  return documentHref("manual", slug, locale);
}

export function brochureFor(categorySlug: string, locale: Locale) {
  return documentHref("brochure", categorySlug, locale);
}

export function catalogueHref(locale: Locale) {
  return documentHref("catalogue", "everest-full-range", locale);
}

export function allBrochures(locale: Locale): DocumentRef[] {
  return categories.map((category) => ({
    id: `brochure-${category.slug}`,
    kind: "brochure" as const,
    title: {
      en: `${category.name.en} — range brochure`,
      ar: `${category.name.ar} — كتيّب المجموعة`,
    },
    description: category.tagline,
    href: brochureFor(category.slug, locale),
    fileType: "PDF" as const,
    size: "1.2 MB",
  }));
}

export function allSpecSheets(locale: Locale): DocumentRef[] {
  return products.map((product) => ({
    id: `spec-${product.slug}`,
    kind: "spec-sheet" as const,
    title: {
      en: `${product.name} (${product.code}) — specification sheet`,
      ar: `${product.name} (${product.code}) — ورقة المواصفات`,
    },
    description: product.summary,
    href: specSheetFor(product.slug, locale),
    fileType: "PDF" as const,
    size: "180 KB",
  }));
}

export function allManuals(locale: Locale): DocumentRef[] {
  return products.map((product) => ({
    id: `manual-${product.slug}`,
    kind: "manual" as const,
    title: {
      en: `${product.name} (${product.code}) — installation & operation manual`,
      ar: `${product.name} (${product.code}) — دليل التركيب والتشغيل`,
    },
    description: product.summary,
    href: manualFor(product.slug, locale),
    fileType: "PDF" as const,
    size: "320 KB",
  }));
}
