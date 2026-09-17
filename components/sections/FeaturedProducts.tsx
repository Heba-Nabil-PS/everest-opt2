import Link from "next/link";
import { HorizontalScroll } from "@/components/motion/HorizontalScroll";
import { SectionHeading } from "@/components/ui/Section";
import { Icon } from "@/components/ui/Icon";
import { ProductPhoto } from "@/components/product/ProductPhoto";
import { ProductMorph } from "@/components/product/ProductMorph";
import { featuredProducts, subcategoryOf } from "@/lib/data/products";
import { localePath, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n";
import type { Product } from "@/lib/data/types";

/**
 * The best-selling models as a horizontal journey: on desktop the section pins
 * and scrolling carries the visitor sideways through large studio cards; on
 * touch it is a swipe row. Each card's photo morphs into the product page.
 */
export function FeaturedProducts({ locale, dictionary: d }: { locale: Locale; dictionary: Dictionary }) {
  const items = featuredProducts(8);
  const path = (p: string) => localePath(locale, p);

  return (
    <section aria-labelledby="featured-heading" className="bg-deep relative isolate py-20 text-white lg:py-0">
      <div aria-hidden="true" className="bg-grid-inverse pointer-events-none absolute inset-0 -z-10 opacity-50" />

      <HorizontalScroll
        label={d.home.featured.heading}
        itemClassName="w-[80vw] max-w-[22rem] sm:w-[22rem] lg:w-[26rem] lg:max-w-none xl:w-[28rem]"
        intro={
          /* Heading and intro sit side by side on desktop so the pinned panel
             fits a 768px-tall laptop screen with the cards whole. */
          <div className="shell grid gap-6 lg:grid-cols-[1fr_minmax(0,26rem)] lg:items-end lg:gap-16">
            <SectionHeading id="featured-heading" eyebrow={d.home.featured.eyebrow} title={d.home.featured.heading} inverse />
            <div className="flex flex-col items-start gap-5">
              <p className="text-ink-inverse-muted">{d.home.featured.intro}</p>
            <Link
              href={path("/products")}
              className="group inline-flex min-h-11 shrink-0 items-center gap-3 text-sm font-semibold text-glacier-300 no-underline"
            >
              <span className="link-underline">{d.home.featured.cta}</span>
              <span className="grid h-10 w-10 place-items-center rounded-full border border-white/25 transition-[background-color,border-color,color] duration-300 group-hover:border-glacier-300 group-hover:bg-glacier-400 group-hover:text-navy-900">
                <Icon name="arrowRight" size={16} className="rtl:-scale-x-100" />
              </span>
            </Link>
            </div>
          </div>
        }
        items={items.map((product, index) => (
          <FeaturedCard key={product.slug} product={product} index={index} locale={locale} dictionary={d} />
        ))}
      />
    </section>
  );
}

function FeaturedCard({
  product,
  index,
  locale,
  dictionary: d,
}: {
  product: Product;
  index: number;
  locale: Locale;
  dictionary: Dictionary;
}) {
  const href = localePath(locale, `/products/${product.categorySlug}/${product.slug}`);
  const { capacity, temperatureRange } = product.specs;

  return (
    <article
      data-cursor="view"
      className="group relative isolate flex h-[30rem] flex-col overflow-hidden rounded-3xl bg-[radial-gradient(ellipse_at_50%_40%,#ffffff_35%,var(--color-ice)_100%)] text-ink shadow-xl lg:h-[clamp(24rem,calc(100svh-19rem),38rem)]"
    >
      <div className="relative z-10 flex items-center justify-between gap-3 p-5 lg:p-6">
        <span className="text-2xs font-semibold uppercase tracking-[0.16em] text-ink-muted">
          {subcategoryOf(product)?.name[locale]}
        </span>
        <span aria-hidden="true" className="tabular font-display text-sm font-bold text-navy-300">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      {/* Media: drifts inside the pinned track, zooms on hover, morphs on click. */}
      <div className="relative min-h-0 flex-1 overflow-hidden">
        <div data-hscroll-media className="absolute inset-0">
          <ProductMorph slug={product.slug} className="h-full w-full">
            {product.images[0] ? (
              <ProductPhoto
                src={product.images[0]}
                alt=""
                sizes="(min-width: 1280px) 28rem, (min-width: 1024px) 26rem, 80vw"
                className="bg-transparent"
                imageClassName="p-[6%] mix-blend-multiply transition-transform duration-700 ease-[var(--ease-smooth)] group-hover:scale-[1.06]"
              />
            ) : null}
          </ProductMorph>
        </div>

        {/* Summary slides up over the photo on hover and keyboard focus. */}
        <p className="absolute inset-x-5 bottom-3 translate-y-4 rounded-2xl bg-white/85 p-4 text-sm text-ink opacity-0 shadow-md backdrop-blur-md transition-[transform,opacity] duration-500 ease-[var(--ease-smooth)] group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:translate-y-0 group-hover:opacity-100 lg:inset-x-6">
          {product.summary[locale]}
        </p>
      </div>

      <div className="relative z-10 flex items-end justify-between gap-4 border-t border-hairline bg-white/60 p-5 backdrop-blur-sm lg:p-6">
        <div className="min-w-0">
          <p className="ltr-inline text-xs font-semibold text-glacier-700">{product.code}</p>
          <h3 className="mt-1 truncate text-xl leading-tight lg:text-2xl">
            <Link
              href={href}
              className="no-underline after:absolute after:inset-0 after:z-20 after:content-['']"
            >
              {product.name}
            </Link>
          </h3>
          <p className="ltr-inline tabular mt-1.5 text-sm text-ink-muted">
            {capacity} {d.units.litres} · {temperatureRange.min}…{temperatureRange.max} {d.units.celsius}
          </p>
        </div>
        <span
          aria-hidden="true"
          className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-navy-700 text-white transition-[background-color,color,transform] duration-500 ease-[var(--ease-smooth)] group-hover:-rotate-45 group-hover:bg-glacier-400 group-hover:text-navy-900 rtl:group-hover:rotate-45"
        >
          <Icon name="arrowRight" size={20} className="rtl:-scale-x-100" />
        </span>
      </div>
    </article>
  );
}
