import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { CategoryGrid } from "@/components/sections/CategoryGrid";
import { Section, SectionHeading, Shell } from "@/components/ui/Section";
import { CustomizeBand } from "@/components/sections/CustomizeBand";
import { ProductExplorer } from "@/components/product/ProductExplorer";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { categories, products } from "@/lib/data/products";
import { site } from "@/lib/data/site";
import { getDictionary, t } from "@/lib/i18n";
import { localePath, type Locale } from "@/lib/i18n/config";

export async function generateMetadata(props: PageProps<"/[locale]/products">): Promise<Metadata> {
  const { locale } = await props.params;
  const d = getDictionary(locale);
  return {
    title: d.products.meta.title,
    description: d.products.meta.description,
    alternates: { canonical: `/${locale}/products` },
  };
}

export default async function ProductsPage(props: PageProps<"/[locale]/products">) {
  const { locale } = await props.params;
  const typedLocale = locale as Locale;
  const d = getDictionary(locale);
  const path = (p: string) => localePath(typedLocale, p);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: d.common.home, url: `${site.url}${path("/")}` },
          { name: d.nav.products, url: `${site.url}${path("/products")}` },
        ]}
      />

      <PageHero
        image="/images/products-hero.jpg"
        eyebrow={d.products.hero.eyebrow}
        title={d.products.hero.headline}
        subline={d.products.hero.subline}
        crumbLabel={d.a11y.breadcrumb}
        crumbs={[
          { label: d.common.home, href: path("/") },
          { label: d.nav.products },
        ]}
      />

      <CategoryGrid
        locale={typedLocale}
        dictionary={d}
        categories={categories}
        heading={d.products.categoriesHeading}
        ground="surface"
      />

      <Section ground="muted" aria-labelledby="all-models-heading">
        <Shell>
          <SectionHeading
            id="all-models-heading"
            title={d.products.allModelsHeading}
            intro={t(d.products.allModelsIntro, { n: products.length })}
          />
          <div className="mt-10">
            <ProductExplorer
              products={products}
              categories={categories}
              locale={typedLocale}
              dictionary={d}
            />
          </div>
        </Shell>
      </Section>

      <CustomizeBand locale={typedLocale} dictionary={d} headingId="products-help-heading" />
    </>
  );
}
