import { categories, products, subcategoryOf } from "@/lib/data/products";
import { vacancies } from "@/lib/data/careers";
import type { Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n/config";
import { localePath } from "@/lib/i18n/config";

export type SearchGroup = "products" | "categories" | "pages" | "documents";

export interface SearchEntry {
  id: string;
  group: SearchGroup;
  title: string;
  /** Shown under the title so a result is identifiable without opening it. */
  detail: string;
  href: string;
  /** Extra terms that should match but are not displayed. */
  keywords: string;
}

/**
 * The site search index covers products, model codes, categories, services and
 * documents (brief §4.1). It is built from the same data that renders the
 * pages, so a result can never point at something that no longer exists.
 */
export function buildSearchIndex(locale: Locale, d: Dictionary): SearchEntry[] {
  const path = (p: string) => localePath(locale, p);

  const productEntries: SearchEntry[] = products.map((product) => {
    const category = categories.find((c) => c.slug === product.categorySlug)!;
    return {
      id: `product-${product.slug}`,
      group: "products",
      title: `${product.name} · ${product.code}`,
      detail: `${category.name[locale]} · ${subcategoryOf(product)?.name[locale] ?? ""} — ${product.specs.capacity} ${d.units.litres}`,
      href: path(`/products/${product.categorySlug}/${product.slug}`),
      keywords: [
        product.code,
        product.name,
        product.summary[locale],
        category.name[locale],
        product.specs.refrigerant,
        `${product.specs.doors}`,
        product.specs.energyClass,
      ]
        .join(" ")
        .toLowerCase(),
    };
  });

  const categoryEntries: SearchEntry[] = categories.map((category) => ({
    id: `category-${category.slug}`,
    group: "categories",
    title: category.name[locale],
    detail: category.tagline[locale],
    href: path(`/products/${category.slug}`),
    keywords: `${category.name[locale]} ${category.tagline[locale]}`.toLowerCase(),
  }));

  const subcategoryEntries: SearchEntry[] = categories.flatMap((category) =>
    category.subcategories.map((sub) => ({
      id: `subcategory-${category.slug}-${sub.slug}`,
      group: "categories" as const,
      title: `${category.name[locale]} · ${sub.name[locale]}`,
      detail: category.tagline[locale],
      href: path(`/products/${category.slug}?type=${sub.slug}`),
      keywords: `${category.name[locale]} ${sub.name[locale]} ${sub.name.en}`.toLowerCase(),
    })),
  );

  const pageEntries: SearchEntry[] = [
    { id: "page-products", title: d.nav.products, detail: d.products.hero.subline, href: path("/products") },
    { id: "page-industries", title: d.nav.industries, detail: d.industries.hero.subline, href: path("/industries") },
    { id: "page-innovation", title: d.nav.innovation, detail: d.innovation.hero.subline, href: path("/innovation") },
    { id: "page-sustainability", title: d.nav.sustainability, detail: d.sustainability.hero.subline, href: path("/sustainability") },
    { id: "page-services", title: d.nav.services, detail: d.services.hero.subline, href: path("/services") },
    { id: "page-resources", title: d.nav.resources, detail: d.resources.hero.subline, href: path("/resources") },
    { id: "page-about", title: d.nav.about, detail: d.about.hero.subline, href: path("/about") },
    { id: "page-presence", title: d.nav.presence, detail: d.presence.hero.subline, href: path("/global-presence") },
    { id: "page-careers", title: d.nav.careers, detail: d.careers.hero.subline, href: path("/careers") },
    { id: "page-contact", title: d.nav.contact, detail: d.contact.hero.subline, href: path("/contact") },
    { id: "page-customize", title: d.cta.customizeFridge, detail: d.customize.hero.subline, href: path("/customize") },
    { id: "page-distributors", title: d.cta.becomeDistributor, detail: d.distributors.hero.subline, href: path("/distributors") },
    { id: "page-service", title: d.cta.requestService, detail: d.services.form.body, href: path("/services#request-service") },
    { id: "page-warranty", title: d.footer.links.warranty, detail: d.services.items[0].summary, href: path("/services#warranty") },
  ].map((entry) => ({
    ...entry,
    group: "pages" as const,
    keywords: `${entry.title} ${entry.detail}`.toLowerCase(),
  }));

  const vacancyEntries: SearchEntry[] = vacancies.map((vacancy) => ({
    id: `vacancy-${vacancy.slug}`,
    group: "pages",
    title: vacancy.title[locale],
    detail: `${d.nav.careers} — ${vacancy.location[locale]}`,
    href: path(`/careers/${vacancy.slug}`),
    keywords: `${vacancy.title[locale]} ${vacancy.department[locale]} ${vacancy.location[locale]}`.toLowerCase(),
  }));

  const documentEntries: SearchEntry[] = products.map((product) => ({
    id: `doc-${product.slug}`,
    group: "documents",
    title: `${product.code} — ${d.cta.downloadSpecSheet}`,
    detail: product.name,
    href: `/api/documents/spec-sheet/${product.slug}?lang=${locale}`,
    keywords: `${product.code} ${product.name} spec sheet datasheet مواصفات`.toLowerCase(),
  }));

  return [
    ...productEntries,
    ...categoryEntries,
    ...subcategoryEntries,
    ...pageEntries,
    ...vacancyEntries,
    ...documentEntries,
  ];
}

/** Scored substring match — exact code matches always win. */
export function searchIndex(entries: SearchEntry[], query: string, limit = 8) {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];

  return entries
    .map((entry) => {
      const title = entry.title.toLowerCase();
      let score = 0;
      if (title === q) score = 100;
      else if (title.startsWith(q)) score = 80;
      else if (title.includes(q)) score = 60;
      else if (entry.keywords.includes(q)) score = 30;
      return { entry, score };
    })
    .filter((hit) => hit.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((hit) => hit.entry);
}
