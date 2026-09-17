import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { Eyebrow } from "@/components/ui/Section";
import { ImageReveal } from "@/components/motion/ImageReveal";
import { TextReveal } from "@/components/motion/TextReveal";
import { ProductMorph } from "./ProductMorph";
import { ProductPhoto } from "./ProductPhoto";
import { subcategoryOf } from "@/lib/data/products";
import { localePath, type Locale } from "@/lib/i18n/config";
import type { Product } from "@/lib/data/types";

/**
 * The end of a product story is the start of the next one: one large link to
 * the following model. Its photo is the named morph element, so the click
 * carries the cabinet straight into the next product's hero.
 */
export function NextProduct({
  product,
  locale,
  label,
}: {
  product: Product;
  locale: Locale;
  label: string;
}) {
  const href = localePath(locale, `/products/${product.categorySlug}/${product.slug}`);

  return (
    <section aria-label={label} className="bg-deep relative isolate overflow-hidden text-white">
      <div aria-hidden="true" className="bg-grid-inverse pointer-events-none absolute inset-0 -z-10 opacity-40" />

      <Link
        href={href}
        aria-label={`${label}: ${product.name} (${product.code})`}
        data-cursor="view"
        className="group shell grid items-center gap-10 py-20 no-underline lg:grid-cols-[1.2fr_1fr] lg:gap-16 lg:py-28"
      >
        <div>
          <Eyebrow inverse>{label}</Eyebrow>
          <p className="mt-3 text-sm text-white/60">
            {subcategoryOf(product)?.name[locale]} · <span className="ltr-inline">{product.code}</span>
          </p>
          <TextReveal
            as="p"
            variant="words"
            className="mt-6 max-w-[14ch] font-display text-5xl font-bold leading-[1.02] tracking-[-0.02em] text-white transition-colors duration-500 group-hover:text-glacier-200 md:text-6xl xl:text-7xl"
          >
            {product.name}
          </TextReveal>
          <p className="mt-6 max-w-[46ch] text-white/75">{product.summary[locale]}</p>
          <span className="mt-10 inline-flex items-center gap-4 text-sm font-semibold text-glacier-300">
            <span className="grid h-14 w-14 place-items-center rounded-full border border-white/25 transition-[background-color,border-color,color] duration-500 ease-[var(--ease-smooth)] group-hover:border-glacier-300 group-hover:bg-glacier-400 group-hover:text-navy-900">
              <Icon
                name="arrowRight"
                size={24}
                className="transition-transform duration-500 ease-[var(--ease-smooth)] group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1"
              />
            </span>
            <span className="link-underline">{label}</span>
          </span>
        </div>

        <ImageReveal variant="clip-side" className="rounded-[2rem]">
          <ProductMorph
            slug={product.slug}
            className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-[radial-gradient(ellipse_at_50%_40%,#ffffff_40%,var(--color-ice)_100%)]"
          >
            {product.images[0] ? (
              <ProductPhoto
                src={product.images[0]}
                alt=""
                sizes="(min-width: 1024px) 40vw, 90vw"
                className="bg-transparent"
                imageClassName="p-[8%] mix-blend-multiply transition-transform duration-1000 ease-[var(--ease-smooth)] group-hover:scale-[1.08]"
              />
            ) : null}
          </ProductMorph>
        </ImageReveal>
      </Link>
    </section>
  );
}
