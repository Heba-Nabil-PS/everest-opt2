import type { MetadataRoute } from "next";
import { categories, products } from "@/lib/data/products";
import { news } from "@/lib/data/news";
import { SPECULATIVE_SLUG, vacancies } from "@/lib/data/careers";
import { site } from "@/lib/data/site";
import { locales } from "@/lib/i18n/config";

const staticPaths = [
  "",
  "/products",
  "/industries",
  "/innovation",
  "/sustainability",
  "/services",
  "/resources",
  "/news",
  "/about",
  "/global-presence",
  "/careers",
  "/contact",
  "/customize",
  "/distributors",
  "/privacy",
  "/terms",
];

/**
 * Every page exists in both languages, so each entry carries the alternates
 * that tell search engines the two URLs are the same page.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    ...staticPaths,
    ...categories.map((category) => `/products/${category.slug}`),
    ...products.map((product) => `/products/${product.categorySlug}/${product.slug}`),
    ...news.map((article) => `/news/${article.slug}`),
    ...vacancies.map((vacancy) => `/careers/${vacancy.slug}`),
    `/careers/${SPECULATIVE_SLUG}`,
  ];

  return paths.flatMap((path) =>
    locales.map((locale) => ({
      url: `${site.url}/${locale}${path}`,
      lastModified: new Date(),
      changeFrequency: path.startsWith("/news") ? ("weekly" as const) : ("monthly" as const),
      priority: path === "" ? 1 : path.split("/").length > 2 ? 0.6 : 0.8,
      alternates: {
        languages: Object.fromEntries(
          locales.map((code) => [code, `${site.url}/${code}${path}`]),
        ),
      },
    })),
  );
}
