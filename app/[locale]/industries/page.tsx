import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { Section, SectionHeading, Shell } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { QuoteButton } from "@/components/forms/QuoteButton";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Reveal } from "@/components/motion/Reveal";
import { ProductRender } from "@/components/art/ProductRender";
import { ProductPhoto } from "@/components/product/ProductPhoto";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { categories, products, productsByCategory } from "@/lib/data/products";
import { site } from "@/lib/data/site";
import { getDictionary } from "@/lib/i18n";
import { localePath, type Locale } from "@/lib/i18n/config";

const sectorIcons: IconName[] = ["snow", "temperature", "box", "wrench", "building"];

/** Which ranges each sector is specified from, in the brief's sector order. */
const sectorCategories = [
  ["chillers"],
  ["chillers", "freezers"],
  ["chillers", "freezers"],
  ["freezers", "chillers"],
  ["chillers", "freezers"],
] as const;

export async function generateMetadata(
  props: PageProps<"/[locale]/industries">,
): Promise<Metadata> {
  const { locale } = await props.params;
  const d = getDictionary(locale);
  return {
    title: d.industries.meta.title,
    description: d.industries.meta.description,
    alternates: { canonical: `/${locale}/industries` },
  };
}

export default async function IndustriesPage(props: PageProps<"/[locale]/industries">) {
  const { locale } = await props.params;
  const typedLocale = locale as Locale;
  const d = getDictionary(locale);
  const path = (p: string) => localePath(typedLocale, p);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: d.common.home, url: `${site.url}${path("/")}` },
          { name: d.nav.industries, url: `${site.url}${path("/industries")}` },
        ]}
      />

      <PageHero
        image="/images/leadband-store.jpg"
        eyebrow={d.industries.hero.eyebrow}
        title={d.industries.hero.headline}
        subline={d.industries.hero.subline}
        crumbLabel={d.a11y.breadcrumb}
        crumbs={[{ label: d.common.home, href: path("/") }, { label: d.nav.industries }]}
      />

      <Section aria-labelledby="sectors-heading">
        <Shell>
          <SectionHeading id="sectors-heading" title={d.industries.heading} />

          <div className="mt-12 flex flex-col gap-6">
            {d.industries.items.map((sector, index) => {
              const linked = sectorCategories[index].map(
                (slug) => categories.find((category) => category.slug === slug)!,
              );
              const sample = productsByCategory(linked[0].slug)[0] ?? products[0];

              return (
                <Reveal
                  key={sector.name}
                  as="article"
                  className="grid gap-8 overflow-hidden rounded-2xl border border-hairline bg-surface p-6 lg:grid-cols-[auto_1.6fr_1fr] lg:items-center lg:p-8"
                >
                  <span className="grid h-14 w-14 place-items-center rounded-xl bg-navy-700 text-glacier-300">
                    <Icon name={sectorIcons[index]} size={24} />
                  </span>

                  <div>
                    <h3 className="text-2xl">{sector.name}</h3>
                    <p className="mt-2 font-medium text-glacier-600">{sector.summary}</p>
                    <p className="mt-4 max-w-[62ch] text-ink-muted">{sector.body}</p>

                    <p className="mt-5 flex flex-wrap items-center gap-2 text-sm">
                      <span className="font-medium text-ink-strong">
                        {d.industries.productsLabel}:
                      </span>
                      {linked.map((category) => (
                        <a
                          key={category.slug}
                          href={path(`/products/${category.slug}`)}
                          className="rounded-md border border-hairline px-2.5 py-1 text-ink-muted no-underline transition-colors hover:border-glacier-400 hover:text-glacier-600"
                        >
                          {category.name[typedLocale]}
                        </a>
                      ))}
                    </p>
                  </div>

                  <div className="flex flex-col gap-4">
                    <div className="aspect-[4/3] overflow-hidden rounded-xl bg-white">
                      {sample.images[0] ? (
                        <ProductPhoto src={sample.images[0]} alt="" sizes="(min-width: 1024px) 30vw, 100vw" />
                      ) : (
                        <ProductRender art={sample.art} angle="three-quarter" alt="" />
                      )}
                    </div>
                    <div className="rounded-lg bg-surface-muted p-4">
                      <p className="text-2xs font-semibold uppercase tracking-[0.14em] text-ink-muted">
                        {d.industries.referenceLabel}
                      </p>
                      <p className="mt-2 text-sm text-ink">{sector.reference}</p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </Shell>
      </Section>

      <Section ground="deep" aria-labelledby="industries-cta-heading">
        <Shell>
          <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div>
              <h2 id="industries-cta-heading" className="max-w-[22ch] text-3xl text-white">
                {d.industries.cta.heading}
              </h2>
              <p className="mt-4 max-w-[58ch] text-ink-inverse-muted">{d.industries.cta.body}</p>
            </div>
            <QuoteButton size="lg" icon="arrowRight" className="shrink-0">
              {d.industries.cta.primary}
            </QuoteButton>
          </div>
        </Shell>
      </Section>
    </>
  );
}
