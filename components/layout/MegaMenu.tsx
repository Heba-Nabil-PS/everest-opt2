"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";
import { Glow } from "@/components/ui/Aurora";
import { PhotoBackdrop } from "@/components/ui/PhotoBackdrop";
import { productsByCategory } from "@/lib/data/products";
import { localePath, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n";
import type { ProductCategory } from "@/lib/data/types";

interface MegaMenuProps {
  open: boolean;
  locale: Locale;
  dictionary: Dictionary;
  categories: ProductCategory[];
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClose: () => void;
}

/** Dark glass panel dropped from the header, matching the home page's language. */
export function MegaMenu({
  open,
  locale,
  dictionary: d,
  categories,
  onMouseEnter,
  onMouseLeave,
  onClose,
}: MegaMenuProps) {
  const path = (p: string) => localePath(locale, p);

  return (
    <div
      id="products-mega-menu"
      /* Kept mounted so it can animate, but taken out of the tab order and the
         accessibility tree while closed. */
      inert={!open}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      /* Focus leaving the panel closes it, which keeps keyboard flow linear. */
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node)) onClose();
      }}
      className={cn(
        "absolute inset-x-0 top-full hidden xl:block",
        "origin-top transition-[opacity,transform,visibility] duration-300 ease-[var(--ease-smooth)]",
        open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0",
      )}
    >
      {/* Floating rather than edge-to-edge, so it reads as one glass panel
          hovering under the header instead of an extension of it. */}
      <div className="shell pt-3">
        {/* Solid navy panel — deliberately opaque (not the site's frosted
            glass) so long product-category copy stays legible over any
            content scrolling behind it. */}
        <div className="relative isolate overflow-hidden rounded-[1.75rem] border border-white/10 bg-navy-900 shadow-2xl">
          <Glow className="-start-16 -top-16 h-64 w-64" />
          <Glow tone="violet" className="-end-16 bottom-0 h-64 w-64" />

          <div className="relative grid gap-8 p-8 lg:grid-cols-[1fr_auto]">
            <div>
              <h2 className="text-2xs font-semibold uppercase tracking-[0.18em] text-glacier-300">
                {d.megaMenu.heading}
              </h2>

              <ul className="mt-6 grid grid-cols-2 gap-6">
                {categories.map((category) => {
                  const count = productsByCategory(category.slug).length;
                  return (
                    <li key={category.slug} className="grid grid-cols-[11rem_1fr] gap-5">
                      <Link
                        href={path(`/products/${category.slug}`)}
                        data-cursor="view"
                        className="group relative isolate flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-2xl p-4 text-white no-underline ring-1 ring-white/10 transition-shadow duration-300 hover:ring-glacier-300/50"
                      >
                        <PhotoBackdrop
                          src={category.image}
                          tone="card"
                          parallax={false}
                          className="[&_img]:transition-transform [&_img]:duration-500 group-hover:[&_img]:scale-105"
                        />
                        <span className="font-display text-lg font-semibold">{category.name[locale]}</span>
                        <span className="text-xs text-glacier-200">
                          {count} {locale === "ar" ? "موديلاً" : "models"}
                        </span>
                      </Link>
                      <div>
                        <p className="text-sm text-white/60">{category.tagline[locale]}</p>
                        <ul className="mt-3 grid grid-cols-2 gap-x-3">
                          {category.subcategories.map((sub) => (
                            <li key={sub.slug}>
                              <Link
                                href={path(`/products/${category.slug}?type=${sub.slug}`)}
                                className="group/sub flex min-h-10 items-center gap-2 rounded-md px-2 text-sm font-medium text-white/85 no-underline transition-colors hover:bg-white/8 hover:text-glacier-200"
                              >
                                <span className="h-1.5 w-1.5 rounded-full bg-glacier-400 transition-transform group-hover/sub:scale-150" />
                                {sub.name[locale]}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </li>
                  );
                })}
              </ul>

              <Link
                href={path("/products")}
                className="link-underline mt-6 inline-flex items-center gap-2 text-sm font-medium text-glacier-300 no-underline"
              >
                {d.megaMenu.viewAll}
                <Icon name="arrowRight" size={16} className="rtl:-scale-x-100" />
              </Link>
            </div>

            {/* Promo block — the second route into a conversation. */}
            <aside className="flex w-72 flex-col justify-between gap-6 rounded-2xl border border-white/10 bg-navy-800 p-6 text-white">
              <div>
                <Icon name="sparkle" size={24} className="text-glacier-300" />
                <h3 className="mt-4 text-lg text-white">{d.megaMenu.promoTitle}</h3>
                <p className="mt-2 text-sm text-white/65">{d.megaMenu.promoBody}</p>
              </div>
              <Link
                href={path("/customize")}
                className="inline-flex min-h-11 items-center gap-2 self-start rounded-full bg-glacier-400 px-4 text-sm font-medium text-navy-950 no-underline transition-colors hover:bg-glacier-300"
              >
                {d.megaMenu.promoCta}
                <Icon name="arrowRight" size={16} className="rtl:-scale-x-100" />
              </Link>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
