import Link from "next/link";
import { Badge, EnergyBadge } from "@/components/ui/Badge";
import { Card, cardLinkOverlay } from "@/components/ui/Card";
import { Icon, type IconName } from "@/components/ui/Icon";
import { ProductRender } from "@/components/art/ProductRender";
import { ProductPhoto } from "./ProductPhoto";
import { ProductMorph } from "./ProductMorph";
import { subcategoryOf } from "@/lib/data/products";
import { localePath, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n";
import type { Product } from "@/lib/data/types";

/**
 * One model card, used identically in the category grid, related products and
 * search-adjacent listings. Photo, format, name and code, then three decisive
 * specs as icon chips — the unit carries the meaning, so no stacked labels.
 */
export function ProductCard({
  product,
  locale,
  dictionary: d,
  morph = true,
}: {
  product: Product;
  locale: Locale;
  dictionary: Dictionary;
  /** Name the photo for the route morph. Off where the model may be listed twice. */
  morph?: boolean;
}) {
  const href = localePath(locale, `/products/${product.categorySlug}/${product.slug}`);
  const { capacity, temperatureRange, annualConsumption, energyClass } = product.specs;

  const specs: { icon: IconName; label: string; value: string }[] = [
    { icon: "box", label: d.specs.capacity, value: `${capacity} ${d.units.litres}` },
    {
      icon: "temperature",
      label: d.specs.temperatureRange,
      value: `${temperatureRange.min}–${temperatureRange.max}${d.units.celsius}`,
    },
    { icon: "bolt", label: d.specs.annualConsumption, value: `${annualConsumption} ${d.units.kwh}` },
  ];

  return (
    <Card interactive className="h-full" cursor="view">
      <div className="relative aspect-[4/3] overflow-hidden bg-[radial-gradient(ellipse_at_center,#ffffff_45%,var(--color-ice)_100%)]">
        <ProductMorph slug={product.slug} enabled={morph} className="h-full w-full">
          {product.images[0] ? (
            <ProductPhoto
              src={product.images[0]}
              alt=""
              sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"
              className="bg-transparent"
              imageClassName="p-[8%] mix-blend-multiply transition-transform duration-700 ease-[var(--ease-smooth)] group-hover:scale-[1.07]"
            />
          ) : (
            <ProductRender
              art={product.art}
              angle="three-quarter"
              alt=""
              className="transition-transform duration-700 ease-[var(--ease-smooth)] group-hover:scale-[1.07]"
            />
          )}
        </ProductMorph>

        {/* Key figures rise over the photo on hover and keyboard focus. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-3 bottom-3 flex translate-y-3 items-center justify-between gap-2 rounded-xl bg-navy-800/90 px-3.5 py-2.5 text-xs text-white opacity-0 backdrop-blur-md transition-[transform,opacity] duration-500 ease-[var(--ease-smooth)] group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:translate-y-0 group-hover:opacity-100"
        >
          <span className="ltr-inline tabular font-semibold">
            {product.specs.dimensions.width}×{product.specs.dimensions.depth}×{product.specs.dimensions.height} mm
          </span>
          <span className="ltr-inline font-semibold text-glacier-300">{product.specs.refrigerant}</span>
        </span>
        {product.featured ? (
          <span className="absolute start-3 top-3">
            <Badge tone="accent" icon="star">
              {d.common.bestSeller}
            </Badge>
          </span>
        ) : null}
        {product.retail ? (
          <span className="absolute end-3 top-3">
            <Badge tone="neutral" icon="box">
              {d.common.b2cAvailable}
            </Badge>
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-3 border-t border-hairline p-5">
        <div className="flex items-center justify-between gap-3">
          <p className="truncate text-2xs font-semibold uppercase tracking-[0.14em] text-ink-muted">
            {subcategoryOf(product)?.name[locale]}
          </p>
          <span className="ltr-inline shrink-0 rounded-full bg-glacier-100 px-2.5 py-0.5 text-2xs font-semibold text-glacier-800">
            {product.code}
          </span>
        </div>

        {/* Model name and code are live text, never baked into the image. */}
        <h3 className="text-lg leading-snug">
          <Link href={href} className={`no-underline hover:text-glacier-600 ${cardLinkOverlay}`}>
            {product.name}
          </Link>
        </h3>

        <p className="line-clamp-2 text-sm text-ink-muted">{product.summary[locale]}</p>

        <dl className="flex flex-wrap gap-2">
          {specs.map((spec) => (
            <div
              key={spec.icon}
              className="inline-flex items-center gap-1.5 rounded-lg bg-ice px-2.5 py-1.5"
              title={spec.label}
            >
              <dt className="flex text-glacier-600">
                <Icon name={spec.icon} size={16} />
                <span className="sr-only">{spec.label}</span>
              </dt>
              <dd className="ltr-inline tabular text-xs font-semibold text-ink-strong">{spec.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-hairline pt-4">
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-glacier-600">
            {d.cta.viewProduct}
            <Icon
              name="arrowRight"
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1"
            />
          </span>
          <EnergyBadge value={energyClass} label={d.common.energyClass} />
        </div>
      </div>
    </Card>
  );
}
