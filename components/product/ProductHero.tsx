import { Fragment } from "react";
import { Breadcrumbs, type Crumb } from "@/components/ui/Breadcrumbs";
import { Eyebrow } from "@/components/ui/Section";
import { PhotoBackdrop } from "@/components/ui/PhotoBackdrop";
import { HeroStage } from "@/components/motion/HeroStage";
import { Parallax } from "@/components/motion/Parallax";
import { ProductMorph } from "./ProductMorph";
import { ProductPhoto } from "./ProductPhoto";
import { ProductRender } from "@/components/art/ProductRender";
import type { Product } from "@/lib/data/types";

/**
 * The product page opens like a case study: the title on the reading side, the
 * cabinet on a lit studio stage on the other. The stage photo is the same named
 * element as the card photo, so arriving from a grid the cabinet flies into
 * place rather than cutting. The model code sits behind it as an oversized
 * outline that drifts on scroll.
 */
export function ProductHero({
  product,
  image,
  eyebrow,
  crumbs,
  crumbLabel,
  subline,
  photoAlt,
  children,
}: {
  product: Product;
  /** Range photograph used as the ground. */
  image: string;
  eyebrow: string;
  crumbs: Crumb[];
  crumbLabel: string;
  subline: string;
  photoAlt: string;
  children?: React.ReactNode;
}) {
  const words = product.name.split(" ");
  const afterTitle = 160 + words.length * 60;

  return (
    <HeroStage
      closeWindow={false}
      data-header-tone="dark"
      className="under-header bg-deep relative isolate overflow-hidden text-white"
    >
      <PhotoBackdrop src={image} tone="deep" priority imageClassName="anim-media-zoom opacity-40" />

      {/* Oversized model code, outlined, drifting behind the stage. */}
      <Parallax amount={-24} className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 select-none overflow-hidden">
        <span
          dir="ltr"
          className="block whitespace-nowrap text-center font-display text-[22vw] font-bold leading-none tracking-tighter text-transparent opacity-60 [-webkit-text-stroke:1px_rgb(255_255_255/0.14)] lg:text-[16vw]"
        >
          {product.code}
        </span>
      </Parallax>

      <div className="shell relative grid gap-12 pb-16 pt-10 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-16 lg:pb-24 lg:pt-16">
        <div data-hero-content>
          <div className="anim-fade-in" style={{ animationDelay: "60ms" }}>
            <Breadcrumbs items={crumbs} label={crumbLabel} inverse />
          </div>

          <div className="anim-rise mt-10" style={{ animationDelay: "100ms" }}>
            <Eyebrow inverse>{eyebrow}</Eyebrow>
          </div>

          <h1 className="mt-4 max-w-[14ch] text-5xl leading-[1.02] tracking-[-0.02em] text-white md:text-6xl xl:text-7xl">
            {words.map((word, index) => (
              <Fragment key={`${word}-${index}`}>
                <span className="-mb-[0.14em] inline-block overflow-hidden pb-[0.14em] align-bottom">
                  <span
                    className="anim-mask-rise inline-block origin-bottom-left rtl:origin-bottom-right"
                    style={{ animationDelay: `${160 + index * 60}ms` }}
                  >
                    {word}
                  </span>
                </span>
                {index < words.length - 1 ? " " : null}
              </Fragment>
            ))}
          </h1>

          <div className="anim-rise" style={{ animationDelay: `${afterTitle}ms` }}>
            <p className="mt-6 max-w-[48ch] text-lg text-white/80">{subline}</p>
            {children}
          </div>
        </div>

        {/* The studio stage — the morph target. It has no CSS entrance of its
            own: arriving from a card, the morph is the entrance, and an ancestor
            fade would flicker as the morph hands over. HeroStage drifts it on
            scroll through the plain wrapper. */}
        <div data-hero-media className="relative">
          <div className="relative">
            <div
              aria-hidden="true"
              className="anim-fade-in absolute inset-[8%] -z-10 rounded-full bg-glacier-400/30 blur-3xl"
              style={{ animationDelay: "300ms" }}
            />
            <ProductMorph
              slug={product.slug}
              className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-[2rem] bg-[radial-gradient(ellipse_at_50%_35%,#ffffff_40%,var(--color-ice)_100%)] shadow-2xl ring-1 ring-white/20 lg:me-0 lg:w-[min(100%,calc((100svh-15rem)*0.8))]"
            >
              {product.images[0] ? (
                <ProductPhoto
                  src={product.images[0]}
                  alt={photoAlt}
                  priority
                  sizes="(min-width: 1024px) 45vw, 90vw"
                  className="bg-transparent"
                  imageClassName="p-[8%] mix-blend-multiply"
                />
              ) : (
                <ProductRender art={product.art} angle="three-quarter" alt={photoAlt} />
              )}
            </ProductMorph>
          </div>
        </div>
      </div>
    </HeroStage>
  );
}
