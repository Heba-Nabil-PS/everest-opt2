import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/sections/PageHero";
import { Section, Shell } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { QuoteButton } from "@/components/forms/QuoteButton";
import { Icon } from "@/components/ui/Icon";
import { ProductExplorer } from "@/components/product/ProductExplorer";
import { CustomizeBand } from "@/components/sections/CustomizeBand";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { categories, categoryBySlug, productsByCategory } from "@/lib/data/products";
import { brochureFor } from "@/lib/data/documents";
import { site } from "@/lib/data/site";
import { getDictionary } from "@/lib/i18n";
import { localePath, locales, type Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    categories.map((category) => ({ locale, category: category.slug })),
  );
}

export async function generateMetadata(
  props: PageProps<"/[locale]/products/[category]">,
): Promise<Metadata> {
  const { locale, category: slug } = await props.params;
  const category = categoryBySlug.get(slug as never);
  if (!category) return {};

  const d = getDictionary(locale);
  const typedLocale = locale as Locale;

  return {
    title: `${category.name[typedLocale]} | ${d.nav.products}`,
    description: category.intro[typedLocale],
    alternates: { canonical: `/${locale}/products/${slug}` },
  };
}

export default async function CategoryPage(props: PageProps<"/[locale]/products/[category]">) {
  const { locale, category: slug } = await props.params;
  const { type } = await props.searchParams;
  const category = categoryBySlug.get(slug as never);
  if (!category) notFound();

  const activeType = typeof type === "string" ? type : undefined;
  const typedLocale = locale as Locale;
  const d = getDictionary(locale);
  const path = (p: string) => localePath(typedLocale, p);
  const models = productsByCategory(category.slug);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: d.common.home, url: `${site.url}${path("/")}` },
          { name: d.nav.products, url: `${site.url}${path("/products")}` },
          {
            name: category.name[typedLocale],
            url: `${site.url}${path(`/products/${category.slug}`)}`,
          },
        ]}
      />

      <PageHero
        image={category.image}
        eyebrow={d.nav.products}
        title={category.name[typedLocale]}
        subline={category.intro[typedLocale]}
        crumbLabel={d.a11y.breadcrumb}
        crumbs={[
          { label: d.common.home, href: path("/") },
          { label: d.nav.products, href: path("/products") },
          { label: category.name[typedLocale] },
        ]}
      >
        <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
          {category.highlights.map((highlight) => (
            <li key={highlight.en} className="inline-flex items-center gap-2 text-sm text-white">
              <Icon name="check" size={16} className="text-glacier-300" />
              {highlight[typedLocale]}
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-wrap gap-3">
          <QuoteButton icon="arrowRight">{d.cta.requestQuote}</QuoteButton>
          <ButtonLink
            href={brochureFor(category.slug, typedLocale)}
            variant="inverse"
            icon="download"
            external
          >
            {d.cta.downloadBrochure}
          </ButtonLink>
        </div>
      </PageHero>

      <Section ground="muted" tight>
        <Shell>
          <h2 className="sr-only">{d.products.allModelsHeading}</h2>

          {/* Format shortcuts — the same selection the Type filter makes. */}
          <nav aria-label={d.products.filters.type} className="no-scrollbar -mx-1 overflow-x-auto px-1 pb-1">
            <ul className="flex min-w-max gap-2">
              {[{ slug: undefined, label: d.products.filters.allTypes }, ...category.subcategories.map((sub) => ({ slug: sub.slug, label: sub.name[typedLocale] }))].map((item) => {
                const count = item.slug ? models.filter((m) => m.subcategory === item.slug).length : models.length;
                const current = activeType === item.slug;
                return (
                  <li key={item.slug ?? "all"}>
                    <Link
                      href={path(`/products/${category.slug}${item.slug ? `?type=${item.slug}` : ""}`)}
                      scroll={false}
                      aria-current={current ? "true" : undefined}
                      className={cn(
                        "inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm font-medium no-underline transition-colors",
                        current
                          ? "border-navy-700 bg-navy-700 text-white"
                          : "border-hairline-strong bg-white text-ink hover:border-glacier-400",
                      )}
                    >
                      {item.label}
                      <span className={cn("tabular text-xs", current ? "text-glacier-300" : "text-ink-muted")}>{count}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="mt-8">
            <ProductExplorer
              key={activeType ?? "all"}
              products={models}
              categories={[category]}
              initialType={activeType}
              locale={typedLocale}
              dictionary={d}
            />
          </div>
        </Shell>
      </Section>

      <CustomizeBand locale={typedLocale} dictionary={d} headingId="category-help-heading" />
    </>
  );
}
