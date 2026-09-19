import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Section, SectionHeading, Shell, Eyebrow } from "@/components/ui/Section";
import { PhotoBackdrop } from "@/components/ui/PhotoBackdrop";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Badge, EnergyBadge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Counter } from "@/components/motion/Counter";
import { Magnetic } from "@/components/motion/Magnetic";
import { Reveal } from "@/components/motion/Reveal";
import { ScrollDrawLine } from "@/components/motion/ScrollDraw";
import { Slider } from "@/components/motion/Slider";
import { TextReveal } from "@/components/motion/TextReveal";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductCard } from "@/components/product/ProductCard";
import { SpecTable } from "@/components/product/SpecTable";
import { QuoteForm } from "@/components/forms/QuoteForm";
import { BreadcrumbJsonLd, ProductJsonLd } from "@/components/seo/JsonLd";
import {
  categoryBySlug,
  productBySlug,
  products,
  relatedProducts,
  subcategoryOf,
} from "@/lib/data/products";
import { brochureFor, manualFor, specSheetFor } from "@/lib/data/documents";
import { site } from "@/lib/data/site";
import { getDictionary } from "@/lib/i18n";
import { localePath, locales, type Locale } from "@/lib/i18n/config";
import type { TechKey } from "@/lib/data/types";

const techIcons: Record<TechKey, IconName> = {
  emmd: "gauge",
  led: "bolt",
  r290: "leaf",
  lowE: "snow",
  lock: "lock",
  castors: "box",
  digital: "temperature",
};

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    products.map((product) => ({
      locale,
      category: product.categorySlug,
      model: product.slug,
    })),
  );
}

export async function generateMetadata(
  props: PageProps<"/[locale]/products/[category]/[model]">,
): Promise<Metadata> {
  const { locale, model } = await props.params;
  const product = productBySlug.get(model);
  if (!product) return {};

  const typedLocale = locale as Locale;
  return {
    title: `${product.name} (${product.code})`,
    description: product.summary[typedLocale],
    alternates: { canonical: `/${locale}/products/${product.categorySlug}/${product.slug}` },
    openGraph: {
      title: `${product.name} · ${product.code}`,
      description: product.summary[typedLocale],
    },
  };
}

/**
 * One model, told as a case study:
 *
 *   Opening       swipeable gallery beside the identity, figures and CTAs
 *   Overview      the story and the remaining facts
 *   Features      numbered benefits with a line drawing down the list
 *   Technology    what is inside this model
 *   Specification the full table and downloads
 *   Quote         pre-filled with this model
 *   Related       swipe row of neighbouring models
 */
export default async function ProductPage(
  props: PageProps<"/[locale]/products/[category]/[model]">,
) {
  const { locale, category: categorySlug, model } = await props.params;
  const product = productBySlug.get(model);
  const category = categoryBySlug.get(categorySlug as never);

  /* Guard the pairing too: a valid model under the wrong category is a 404. */
  if (!product || !category || product.categorySlug !== category.slug) notFound();

  const typedLocale = locale as Locale;
  const d = getDictionary(locale);
  const path = (p: string) => localePath(typedLocale, p);
  const url = `${site.url}${path(`/products/${product.categorySlug}/${product.slug}`)}`;
  /* The closing "next model" band is gone, so the full six can be shown. */
  const related = relatedProducts(product, 6);
  const months = locale === "ar" ? "شهراً" : "mo";

  const downloads = [
    { label: d.cta.downloadSpecSheet, href: specSheetFor(product.slug, typedLocale), icon: "document" as IconName },
    { label: d.cta.downloadManual, href: manualFor(product.slug, typedLocale), icon: "document" as IconName },
    { label: d.cta.downloadBrochure, href: brochureFor(product.categorySlug, typedLocale), icon: "document" as IconName },
  ];

  const { specs } = product;

  return (
    <>
      <ProductJsonLd product={product} category={category} locale={typedLocale} url={url} />
      <BreadcrumbJsonLd
        items={[
          { name: d.common.home, url: `${site.url}${path("/")}` },
          { name: d.nav.products, url: `${site.url}${path("/products")}` },
          {
            name: category.name[typedLocale],
            url: `${site.url}${path(`/products/${category.slug}`)}`,
          },
          { name: product.name, url },
        ]}
      />

      {/* The opening: no hero stage. The cabinet's own photographs carry the
          page from the first pixel, with the identity, the decisive figures
          and both calls to action reading beside them. The gallery sticks
          while that column scrolls. */}
      <section aria-labelledby="product-heading" className="pt-6 lg:pt-10">
        <Shell>
          <Breadcrumbs
            label={d.a11y.breadcrumb}
            inverse
            items={[
              { label: d.common.home, href: path("/") },
              { label: d.nav.products, href: path("/products") },
              { label: category.name[typedLocale], href: path(`/products/${category.slug}`) },
              {
                label: subcategoryOf(product)?.name[typedLocale] ?? "",
                href: path(`/products/${category.slug}?type=${product.subcategory}`),
              },
              { label: product.name },
            ]}
          />

          <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-14">
            <div className="min-w-0 lg:sticky lg:top-28">
              <h2 className="sr-only">{d.productPage.galleryHeading}</h2>
              <ProductGallery product={product} locale={typedLocale} dictionary={d} />
            </div>

            <div className="min-w-0">
              <Eyebrow inverse>
                {`${category.name[typedLocale]} · ${subcategoryOf(product)?.name[typedLocale] ?? ""}`}
              </Eyebrow>

              <h1
                id="product-heading"
                className="mt-4 text-4xl leading-[1.05] tracking-[-0.02em] text-white md:text-5xl xl:text-6xl"
              >
                {product.name}
              </h1>

              <p className="mt-5 max-w-[52ch] text-lg text-ink-inverse-muted">
                {product.summary[typedLocale]}
              </p>

              <p className="mt-6 flex flex-wrap items-center gap-3">
                {/* Model code as live text, never inside an image. */}
                <span className="ltr-inline rounded-md border border-white/20 bg-white/10 px-3 py-1.5 font-mono text-sm text-glacier-200">
                  {d.common.modelCode}: {product.code}
                </span>
                {product.featured ? <Badge tone="inverse">{d.common.bestSeller}</Badge> : null}
                <EnergyBadge value={specs.energyClass} label={d.common.energyClass} />
              </p>

              {/* The four figures a buyer shortlists on. */}
              <Reveal
                as="dl"
                stagger
                aria-label={d.productPage.atAGlance}
                className="mt-9 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-hairline bg-hairline sm:grid-cols-4"
              >
                {[
                  { label: d.specs.capacity, value: <Counter value={specs.capacity} locale={typedLocale} />, unit: d.units.litres },
                  {
                    label: d.specs.temperatureRange,
                    value: <span className="ltr-inline">{specs.temperatureRange.min}…{specs.temperatureRange.max}</span>,
                    unit: d.units.celsius,
                  },
                  {
                    label: d.specs.annualConsumption,
                    value: <Counter value={specs.annualConsumption} locale={typedLocale} />,
                    unit: d.units.kwh,
                  },
                  {
                    label: d.specs.warranty,
                    value: <Counter value={specs.warranty.compressor} locale={typedLocale} />,
                    unit: months,
                  },
                ].map((item) => (
                  /* column-reverse + justify-between: the label is last in the
                     DOM order a <dl> needs, but pins to the foot of the cell,
                     so a two-line label never pushes its figure out of line
                     with the other three. */
                  <div
                    key={item.label}
                    className="flex h-full flex-col-reverse justify-between gap-2 bg-surface p-5"
                  >
                    <dt className="text-2xs uppercase tracking-[0.12em] text-ink-muted">{item.label}</dt>
                    <dd className="font-display text-3xl font-bold leading-none tracking-tight text-white">
                      {item.value}
                      <span className="ms-1 text-sm font-semibold text-glacier-600">{item.unit}</span>
                    </dd>
                  </div>
                ))}
              </Reveal>

              <div className="mt-8 flex flex-wrap gap-3">
                <Magnetic>
                  <ButtonLink href="#request-a-quote" size="lg" icon="arrowRight">
                    {d.cta.requestQuote}
                  </ButtonLink>
                </Magnetic>
                <ButtonLink
                  href={specSheetFor(product.slug, typedLocale)}
                  size="lg"
                  variant="inverse"
                  icon="download"
                  external
                >
                  {d.cta.downloadSpecSheet}
                </ButtonLink>
              </div>

              {product.retail ? (
                <div className="mt-8 rounded-2xl border border-hairline bg-surface-muted p-5">
                  <p className="font-display font-semibold text-ink-strong">
                    {d.productPage.retailHeading}
                  </p>
                  <p className="mt-1 text-sm text-ink-muted">{d.productPage.retailBody}</p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    {product.retail.amazon ? (
                      <ButtonLink href={product.retail.amazon} variant="ghost" size="sm" icon="arrowUpRight" external>
                        {d.common.buyOnAmazon}
                      </ButtonLink>
                    ) : null}
                    {product.retail.noon ? (
                      <ButtonLink href={product.retail.noon} variant="ghost" size="sm" icon="arrowUpRight" external>
                        {d.common.buyOnNoon}
                      </ButtonLink>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </Shell>
      </section>

      {/* The story and the remaining facts, now that the cabinet is understood. */}
      <Section aria-labelledby="overview-heading">
        <Shell className="grid gap-10 lg:grid-cols-[1fr_1.35fr] lg:items-start lg:gap-16">
          <SectionHeading
            id="overview-heading"
            eyebrow={d.productPage.storyEyebrow}
            title={d.productPage.overviewHeading}
            className="lg:sticky lg:top-28"
          />

          <div>
            {/* `scrub`: the statement lights up word by word with the scroll,
                the same treatment the home bento gives its opening claim. */}
            <TextReveal
              as="p"
              variant="scrub"
              className="font-display text-2xl leading-snug text-ink-strong lg:text-3xl"
            >
              {product.description[typedLocale]}
            </TextReveal>

            <Reveal
              as="dl"
              stagger
              className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-hairline bg-hairline sm:grid-cols-3"
            >
              {[
                { label: d.specs.doors, value: String(specs.doors) },
                { label: d.specs.refrigerant, value: specs.refrigerant },
                {
                  label: d.specs.dimensions,
                  value: `${specs.dimensions.width} × ${specs.dimensions.depth} × ${specs.dimensions.height} mm`,
                },
                { label: d.specs.netCapacity, value: `${specs.netCapacity} ${d.units.litres}` },
                { label: d.specs.climateClass, value: specs.climateClass },
                { label: d.specs.warranty, value: `${specs.warranty.unit}/${specs.warranty.compressor} ${months}` },
              ].map((item) => (
                <div key={item.label} className="bg-surface p-5">
                  <dt className="text-2xs uppercase tracking-[0.12em] text-ink-muted">{item.label}</dt>
                  <dd className="ltr-inline tabular mt-1.5 font-display font-semibold text-ink-strong">
                    {item.value}
                  </dd>
                </div>
              ))}
            </Reveal>

            <p className="mt-6 text-xs text-ink-muted">{d.productPage.energyNote}</p>
          </div>
        </Shell>
      </Section>

      {/* Features and technology */}
      <Section ground="muted" aria-labelledby="features-heading">
        <Shell className="grid gap-14 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeading id="features-heading" title={d.productPage.featuresHeading} size="display" />
          </div>

          <div className="relative">
            <span aria-hidden="true" className="absolute bottom-6 start-[1.375rem] top-6 w-px bg-hairline-strong" />
            <ScrollDrawLine className="absolute bottom-6 start-[1.375rem] top-6 w-px bg-glacier-400" />
            <Reveal as="ol" stagger className="flex flex-col gap-10">
              {product.features.map((feature, index) => (
                <li key={feature.title.en} className="relative flex gap-6">
                  <span className="tabular relative grid h-11 w-11 shrink-0 place-items-center rounded-full bg-navy-700 font-display text-sm font-bold text-glacier-300 ring-8 ring-surface-muted">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="pt-1.5">
                    <span className="block font-display text-xl font-bold text-ink-strong lg:text-2xl">
                      {feature.title[typedLocale]}
                    </span>
                    <span className="mt-2 block max-w-[52ch] text-ink-muted">{feature.body[typedLocale]}</span>
                  </span>
                </li>
              ))}
            </Reveal>
          </div>
        </Shell>
      </Section>

      <Section aria-labelledby="technology-heading">
        <Shell>
          <SectionHeading id="technology-heading" title={d.productPage.technologyHeading} />
          <Reveal as="ul" stagger className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {product.tech.map((key) => (
              <li
                key={key}
                className="group flex h-full flex-col gap-3 rounded-2xl border border-hairline bg-surface p-6 transition-[transform,border-color,box-shadow] duration-500 ease-[var(--ease-smooth)] hover:-translate-y-1 hover:border-glacier-300 hover:shadow-lg"
              >
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-navy-700 text-glacier-300 transition-[background-color,color] duration-300 group-hover:bg-glacier-400 group-hover:text-navy-900">
                  <Icon name={techIcons[key]} size={20} />
                </span>
                <span className="font-display font-semibold text-ink-strong">{d.techLabels[key].name}</span>
                <span className="text-sm text-ink-muted">{d.techLabels[key].body}</span>
              </li>
            ))}
          </Reveal>
        </Shell>
      </Section>

      {/* Specification */}
      <Section ground="muted" aria-labelledby="spec-heading">
        <Shell className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:items-start">
          <div className="lg:sticky lg:top-28">
            <SectionHeading id="spec-heading" title={d.productPage.specHeading} />
            <p className="mt-5 max-w-[46ch] text-sm text-ink-muted">{d.productPage.specNote}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              {downloads.map((download) => (
                <ButtonLink
                  key={download.label}
                  href={download.href}
                  variant="ghost"
                  size="sm"
                  icon="download"
                  external
                >
                  {download.label}
                </ButtonLink>
              ))}
            </div>
          </div>

          {/* The table brings its own grouped panels now, so no outer card. */}
          <div>
            <SpecTable
              product={product}
              locale={typedLocale}
              dictionary={d}
              caption={`${product.name} ${product.code} — ${d.productPage.specHeading}`}
            />
          </div>
        </Shell>
      </Section>

      {/* Pre-filled quote block */}
      <Section ground="deep" id="request-a-quote" aria-labelledby="quote-heading">
        <PhotoBackdrop src="/images/hero-factory.jpg" />
        <Shell className="relative grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-start">
          <div>
            <SectionHeading
              id="quote-heading"
              title={d.productPage.quoteHeading}
              intro={d.productPage.quoteBody}
              inverse
            />
            <p className="ltr-inline mt-6 inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-4 py-2.5 font-mono text-sm text-glacier-200">
              {product.name} · {product.code}
            </p>
          </div>

          <Reveal animation="blur-up" className="form-dark glass-dark rounded-2xl p-6 lg:p-8">
            <QuoteForm
              locale={typedLocale}
              dictionary={d}
              products={[]}
              compact
              defaultProduct={`${product.name} (${product.code})`}
              hidden={{
                product: `${product.name} (${product.code})`,
                productCode: product.code,
                productUrl: url,
              }}
              submitLabel={d.cta.productInquiry}
            />
          </Reveal>
        </Shell>
      </Section>

      {/* Related models */}
      {related.length > 0 ? (
        <Section aria-labelledby="related-heading" className="overflow-hidden">
          <Shell>
            <Eyebrow>{category.name[typedLocale]}</Eyebrow>
            <SectionHeading id="related-heading" title={d.productPage.relatedHeading} className="mt-4" />
            <Slider
              className="mt-10"
              label={d.productPage.relatedHeading}
              labels={{ previous: d.interaction.previousSlide, next: d.interaction.nextSlide }}
              slides={related.map((item) => (
                /* Morph names stay unique: this list excludes the current model. */
                <ProductCard key={item.slug} product={item} locale={typedLocale} dictionary={d} />
              ))}
            />
          </Shell>
        </Section>
      ) : null}
    </>
  );
}
