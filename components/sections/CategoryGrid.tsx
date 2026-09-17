import Link from "next/link";
import { ImageReveal } from "@/components/motion/ImageReveal";
import { Icon } from "@/components/ui/Icon";
import { PhotoBackdrop } from "@/components/ui/PhotoBackdrop";
import { Section, SectionHeading, Shell } from "@/components/ui/Section";
import { productsByCategory } from "@/lib/data/products";
import { localePath, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n";
import type { ProductCategory } from "@/lib/data/types";

/**
 * The two main ranges as photographic panels. Each panel names the range,
 * states its claims and lists every format inside it, so a buyer can jump
 * straight to "Freezers · Vertical" from the homepage.
 */
export function CategoryGrid({
  locale,
  dictionary: d,
  categories,
  heading,
  eyebrow,
  intro,
  ground = "surface",
}: {
  locale: Locale;
  dictionary: Dictionary;
  categories: ProductCategory[];
  heading: string;
  eyebrow?: string;
  intro?: string;
  ground?: "surface" | "muted" | "frost";
}) {
  const path = (p: string) => localePath(locale, p);

  return (
    <Section ground={ground} aria-labelledby="categories-heading">
      <Shell>
        <SectionHeading id="categories-heading" eyebrow={eyebrow} title={heading} intro={intro} />

        <ul className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {categories.map((category, index) => {
            const models = productsByCategory(category.slug);

            return (
              <li key={category.slug} className="h-full">
                {/* The two panels open one after the other, bottom to top. */}
                <ImageReveal variant="clip-up" delay={index * 0.12} className="h-full rounded-3xl shadow-lg">
                {/* Content starts at a fixed offset from the top (not the foot),
                    so both range titles line up however many formats follow. */}
                <article
                  data-cursor="view"
                  className="group relative isolate flex h-full min-h-[30rem] flex-col overflow-hidden rounded-3xl p-7 pt-40 text-white lg:min-h-[36rem] lg:p-9 lg:pt-56"
                >
                  <PhotoBackdrop
                    src={category.image}
                    tone="card"
                    className="[&_img]:transition-transform [&_img]:duration-1000 [&_img]:ease-[var(--ease-smooth)] group-hover:[&_img]:scale-[1.07]"
                  />

                  <span className="absolute end-6 top-6 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-md">
                    <span className="tabular">{models.length}</span> {locale === "ar" ? "موديلاً" : "models"}
                  </span>

                  <h3 className="text-3xl text-white lg:text-4xl">
                    {/* Stretched link: its ::after covers the whole card, so a
                        click anywhere opens the range. Format chips and the CTA
                        sit above it (z-10) and keep their own destinations. */}
                    <Link
                      href={path(`/products/${category.slug}`)}
                      className="no-underline transition-colors group-hover:text-glacier-200 after:absolute after:inset-0 after:rounded-3xl after:content-['']"
                    >
                      {category.name[locale]}
                    </Link>
                  </h3>
                  <p className="mt-3 max-w-[48ch] text-white/80">{category.tagline[locale]}</p>

                  <ul className="relative z-10 mt-6 flex flex-wrap gap-2">
                    {category.subcategories.map((sub) => (
                      <li key={sub.slug}>
                        <Link
                          href={path(`/products/${category.slug}?type=${sub.slug}`)}
                          className="inline-flex min-h-9 items-center rounded-full border border-white/25 bg-white/10 px-3.5 text-sm text-white no-underline backdrop-blur-md transition-colors hover:border-glacier-300 hover:bg-glacier-400 hover:text-navy-900"
                        >
                          {sub.name[locale]}
                        </Link>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={path(`/products/${category.slug}`)}
                    tabIndex={-1}
                    aria-hidden="true"
                    className="relative z-10 mt-auto inline-flex items-center gap-2 self-start pt-7 text-sm font-semibold text-glacier-300 no-underline hover:text-white"
                  >
                    {d.home.categories.cta}
                    <Icon name="arrowRight" size={16} className="transition-transform group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1" />
                    <span className="sr-only">— {category.name[locale]}</span>
                  </Link>
                </article>
                </ImageReveal>
              </li>
            );
          })}
        </ul>
      </Shell>
    </Section>
  );
}
