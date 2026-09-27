import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { SectionHeading, Shell } from "@/components/ui/Section";
import { ProofBento } from "@/components/home/ProofBento";
import { RangeExplorer, type RangeCategory } from "@/components/home/RangeExplorer";
import { PillarsStack } from "@/components/home/PillarsStack";
import { DifferentiatorsMarquee } from "@/components/home/DifferentiatorsMarquee";
import { EnergySection } from "@/components/home/EnergySection";
import { ServicesGlass } from "@/components/home/ServicesGlass";
import { PresenceGlass } from "@/components/home/PresenceGlass";
import { NewsGlass } from "@/components/home/NewsGlass";
import { OrganizationJsonLd } from "@/components/seo/JsonLd";
import { categories, productsByCategory, subcategoryOf } from "@/lib/data/products";
import { getDictionary } from "@/lib/i18n";
import { localePath, type Locale } from "@/lib/i18n/config";

export async function generateMetadata(props: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await props.params;
  const d = getDictionary(locale);
  return {
    title: d.home.meta.title,
    description: d.home.meta.description,
    alternates: { canonical: `/${locale}` },
  };
}

/**
 * The home page in the Aurora glass language: one continuous navy ground lit
 * by drifting brand light, every chapter built from frosted glass.
 *
 *   Hero                    slideshow, copy on glass chips
 *   ProofBento              bento of figures around the brand statement
 *   RangeExplorer           range switch + draggable model cards
 *   PillarsStack            four reasons dealt as a sticky card deck
 *   DifferentiatorsMarquee  two drifting glass ribbons
 *   EnergySection           EMMD as a data poster
 *   ServicesGlass           expanding service panels
 *   PresenceGlass           map console with floating market cards
 *   NewsGlass               editorial news spread
 */
export default async function HomePage(props: PageProps<"/[locale]">) {
  const { locale } = await props.params;
  const d = getDictionary(locale);
  const typedLocale = locale as Locale;
  const path = (p: string) => localePath(typedLocale, p);

  const ranges: RangeCategory[] = categories.map((category) => ({
    slug: category.slug,
    name: category.name[typedLocale],
    tagline: category.tagline[typedLocale],
    highlights: category.highlights.map((item) => item[typedLocale]),
    href: path(`/products/${category.slug}`),
    formats: category.subcategories.map((sub) => ({
      label: sub.name[typedLocale],
      href: path(`/products/${category.slug}?type=${sub.slug}`),
    })),
    /* Best sellers lead the row. */
    models: [...productsByCategory(category.slug)]
      .sort((a, b) => Number(b.featured) - Number(a.featured))
      .map((product) => ({
        slug: product.slug,
        code: product.code,
        name: product.name,
        format: subcategoryOf(product)?.name[typedLocale] ?? "",
        capacity: `${product.specs.capacity} ${d.units.litres}`,
        temperature: `${product.specs.temperatureRange.min}…${product.specs.temperatureRange.max} ${d.units.celsius}`,
        image: product.images[0],
        href: path(`/products/${product.categorySlug}/${product.slug}`),
        featured: product.featured,
      })),
  }));

  return (
    <>
      {/* The Aurora ground and its drifting light are global (root layout);
          this page only supplies its own sections. */}
      <OrganizationJsonLd locale={typedLocale} dictionary={d} />

      <Hero locale={typedLocale} dictionary={d} />
      <ProofBento locale={typedLocale} dictionary={d} />

      <section aria-labelledby="ranges-heading" className="relative py-12 lg:py-16">
        <Shell>
          <SectionHeading
            id="ranges-heading"
            title={d.home.categories.heading}
            size="display"
            titleClassName="text-3xl md:text-4xl lg:text-5xl"
            inverse
          />
          <div className="mt-12">
            <RangeExplorer
              categories={ranges}
              labels={{
                region: d.home.categories.heading,
                viewProduct: d.cta.viewProduct,
              }}
            />
          </div>
        </Shell>
      </section>

      <PillarsStack dictionary={d} />
      <DifferentiatorsMarquee dictionary={d} />
      <EnergySection locale={typedLocale} dictionary={d} />
      <ServicesGlass locale={typedLocale} dictionary={d} />
      <PresenceGlass locale={typedLocale} dictionary={d} />
      <NewsGlass locale={typedLocale} dictionary={d} />
    </>
  );
}
