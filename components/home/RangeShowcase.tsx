import Link from "next/link";
import { ImageReveal } from "@/components/motion/ImageReveal";
import { Reveal } from "@/components/motion/Reveal";
import { Glow } from "@/components/ui/Aurora";
import { Icon } from "@/components/ui/Icon";
import { PhotoBackdrop } from "@/components/ui/PhotoBackdrop";
import { SectionHeading, Shell } from "@/components/ui/Section";
import { productsByCategory } from "@/lib/data/products";
import { localePath, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n";
import type { ProductCategory } from "@/lib/data/types";

/**
 * "Two ranges, one engineering standard": chillers and freezers as two tall
 * photographic panels in the Aurora glass language. Each panel opens with a
 * clip reveal, carries its model count as a large outlined figure, and keeps
 * its name, claim and every format on a frosted plate at the foot. Hovering
 * lifts the panel, zooms the photograph and lights its top edge. The whole
 * panel opens the range; each format chip keeps its own destination.
 */
export function RangeShowcase({
  locale,
  dictionary: d,
  categories,
}: {
  locale: Locale;
  dictionary: Dictionary;
  categories: ProductCategory[];
}) {
  const c = d.home.categories;
  const path = (p: string) => localePath(locale, p);

  return (
    <section aria-labelledby="showcase-heading" className="relative py-12 lg:py-16">
      <Shell>
        <SectionHeading
          id="showcase-heading"
          eyebrow={c.eyebrow}
          title={c.showcaseHeading}
          intro={c.intro}
          size="display"
          titleClassName="text-3xl md:text-4xl lg:text-5xl"
          inverse
        />

        <ul className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {categories.map((category, index) => {
            const models = productsByCategory(category.slug).length;

            return (
              <li key={category.slug} className="h-full">
                <ImageReveal variant="clip-up" delay={index * 0.15} className="h-full rounded-[1.75rem]">
                  <article
                    data-cursor="view"
                    className="group relative isolate flex h-full min-h-[32rem] flex-col justify-end overflow-hidden rounded-[1.75rem] p-4 ring-1 ring-white/10 transition-[transform,box-shadow] duration-700 ease-[var(--ease-smooth)] hover:-translate-y-1.5 hover:shadow-[0_40px_80px_-40px_rgb(44_186_226/0.7)] sm:p-5 lg:min-h-[38rem]"
                  >
                    <PhotoBackdrop
                      src={category.image}
                      tone="card"
                      className="[&_img]:transition-transform [&_img]:duration-[1400ms] [&_img]:ease-[var(--ease-smooth)] group-hover:[&_img]:scale-[1.08]"
                    />
                    <Glow
                      tone={index % 2 ? "indigo" : "cyan"}
                      className="-bottom-32 start-1/4 h-72 w-2/3 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                    />
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-gradient-to-r from-transparent via-glacier-300 to-transparent transition-transform duration-700 ease-[var(--ease-smooth)] group-hover:scale-x-100 rtl:origin-right"
                    />

                    {/* The model count, large and outlined in the corner. */}
                    <span className="absolute end-6 top-5 flex flex-col items-end text-end">
                      <span
                        aria-hidden="true"
                        className="tabular font-display text-7xl leading-none text-transparent transition-colors duration-700 [-webkit-text-stroke:1px_rgb(255_255_255/0.45)] group-hover:[-webkit-text-stroke:1px_rgb(116_215_242/0.9)] lg:text-8xl"
                      >
                        {models}
                      </span>
                      <span className="mt-1 text-2xs font-semibold uppercase tracking-[0.18em] text-white/75">
                        <span className="sr-only">{models} </span>
                        {c.modelsLabel} · <span className="tabular">{category.subcategories.length}</span> {c.formatsLabel}
                      </span>
                    </span>

                    <div className="glass-panel-strong relative rounded-[1.25rem] p-5 sm:p-6 lg:min-h-[15.75rem]">
                      <div className="flex items-end justify-between gap-4">
                        <h3 className="text-3xl text-white lg:text-4xl">
                          {/* Stretched link: its ::after covers the whole panel.
                              The format chips sit above it (z-10). */}
                          <Link
                            href={path(`/products/${category.slug}`)}
                            className="no-underline after:absolute after:inset-0 after:rounded-[1.75rem] after:content-['']"
                          >
                            {category.name[locale]}
                          </Link>
                        </h3>
                        <span
                          aria-hidden="true"
                          className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-white/25 text-white transition-[background-color,border-color,color,transform] duration-500 group-hover:border-glacier-300 group-hover:bg-glacier-400 group-hover:text-navy-950 group-hover:-rotate-45 rtl:group-hover:rotate-45"
                        >
                          <Icon name="arrowRight" size={20} className="rtl:-scale-x-100" />
                        </span>
                      </div>
                      <p className="mt-2 max-w-[48ch] text-sm text-white/75">{category.tagline[locale]}</p>

                      <Reveal as="ul" stagger animation="fade" className="relative z-10 mt-5 flex flex-wrap gap-2">
                        {category.subcategories.map((sub) => (
                          <li key={sub.slug}>
                            <Link
                              href={path(`/products/${category.slug}?type=${sub.slug}`)}
                              className="glass-chip inline-flex min-h-9 items-center rounded-full px-3.5 text-sm text-white no-underline transition-colors duration-300 hover:border-glacier-300 hover:bg-glacier-400 hover:text-navy-950"
                            >
                              {sub.name[locale]}
                            </Link>
                          </li>
                        ))}
                      </Reveal>
                    </div>
                  </article>
                </ImageReveal>
              </li>
            );
          })}
        </ul>
      </Shell>
    </section>
  );
}
