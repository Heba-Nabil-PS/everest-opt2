"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/art/Logo";
import { Icon } from "@/components/ui/Icon";
import { QuoteButton } from "@/components/forms/QuoteButton";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { mainNav, site } from "@/lib/data/site";
import { localePath, type Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";
import type { Dictionary } from "@/lib/i18n";
import type { ProductCategory } from "@/lib/data/types";

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
  locale: Locale;
  dictionary: Dictionary;
  categories: ProductCategory[];
}

/**
 * Full-screen navigation for tablet and phone. A navy panel wipes down from
 * the top, then the large links rise in sequence; closing reverses it at twice
 * the speed. Everything is CSS transitions keyed off `open`, so it stays
 * responsive on low-end phones, and reduced motion collapses it to a cut.
 */
export function MobileNav({ open, onClose, locale, dictionary: d, categories }: MobileNavProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const path = (p: string) => localePath(locale, p);

  useEffect(() => {
    if (!open) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();

      /* Keep Tab inside the open menu. */
      if (event.key === "Tab" && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll<HTMLElement>(
          "a[href], button:not([disabled]), summary",
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    }
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  /* Each row rises with its own delay on open; all leave together on close. */
  const rise = (index: number) => ({
    className: cn(
      "transition-[transform,opacity] ease-[var(--ease-smooth)]",
      open ? "translate-y-0 opacity-100 duration-700" : "translate-y-8 opacity-0 duration-200",
    ),
    style: { transitionDelay: open ? `${180 + index * 55}ms` : "0ms" },
  });

  /* The first item opens as an accordion — the product catalogue, or the
     plain dropdown that replaces it — so it is drawn separately below. */
  const leadItem = mainNav.find((item) => item.hasMegaMenu || item.menu);
  const primary = mainNav.filter((item) => item !== leadItem);

  /* Global Presence is a main item in the dropdown arrangement, so it is only
     repeated down here when it is not already above. */
  const secondary = [
    ["/news", d.nav.news],
    ["/careers", d.nav.careers],
    ...(mainNav.some((item) => item.key === "presence")
      ? []
      : [["/global-presence", d.nav.presence] as const]),
    ["/resources", d.nav.resources],
    ["/industries", d.nav.industries],
    ["/customize", d.nav.customize],
    ["/distributors", d.nav.distributors],
  ] as const;

  const bigLink =
    "group flex min-h-14 items-center justify-between gap-4 border-b border-white/10 py-3 font-display text-3xl font-bold text-white no-underline sm:text-4xl";

  return (
    <div
      className={cn("fixed inset-0 xl:hidden", open ? "visible" : "invisible transition-[visibility] delay-500")}
      style={{ zIndex: "var(--z-overlay)" }}
      inert={!open}
    >
      <div
        ref={panelRef}
        /* Dialog semantics only while open — a hidden `aria-modal` dialog
           confuses assistive technology and hides the page behind it. */
        role={open ? "dialog" : undefined}
        aria-modal={open ? true : undefined}
        aria-label={open ? d.a11y.mainNavigation : undefined}
        className={cn(
          "bg-deep absolute inset-0 flex flex-col text-white outline-none",
          "transition-[clip-path] ease-[var(--ease-expressive)]",
          open ? "duration-700 [clip-path:inset(0_0_0_0)]" : "duration-500 [clip-path:inset(0_0_100%_0)]",
        )}
      >
        <div aria-hidden="true" className="bg-grid-inverse pointer-events-none absolute inset-0 opacity-40" />

        <div className="shell relative flex h-18 shrink-0 items-center justify-between border-b border-white/10">
          <Logo size="sm" inverse className="self-center" />
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label={d.a11y.closeMenu}
            className="group grid h-11 w-11 place-items-center rounded-full border border-white/25 transition-colors hover:border-glacier-300 hover:bg-white/10"
          >
            {/* The header's two bars, crossed. */}
            <span aria-hidden="true" className="relative block h-5 w-5">
              <span
                className={cn(
                  "absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 rounded-full bg-current transition-transform duration-500 ease-[var(--ease-smooth)]",
                  open ? "rotate-45 delay-300" : "rotate-0",
                )}
              />
              <span
                className={cn(
                  "absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 rounded-full bg-current transition-transform duration-500 ease-[var(--ease-smooth)]",
                  open ? "-rotate-45 delay-300" : "rotate-0",
                )}
              />
            </span>
          </button>
        </div>

        <nav
          aria-label={d.a11y.mainNavigation}
          data-lenis-prevent
          className="scroll-slim shell relative flex-1 overflow-y-auto overscroll-contain py-6"
        >
          <ul className="flex flex-col">
            <li {...rise(0)}>
              <details className="group">
                <summary className={cn(bigLink, "cursor-pointer list-none [&::-webkit-details-marker]:hidden")}>
                  {leadItem ? d.nav[leadItem.key] : d.nav.products}
                  <span className="grid h-10 w-10 place-items-center rounded-full border border-white/20 transition-transform duration-300 group-open:rotate-45">
                    <Icon name="plus" size={20} />
                  </span>
                </summary>

                {/* A short dropdown lists its destinations plainly; the
                    catalogue opens as the full category grid below. */}
                {leadItem?.menu ? (
                  <ul className="flex flex-col gap-2 py-4">
                    {leadItem.menu.map((sub) => (
                      <li key={sub.key}>
                        <Link
                          href={path(sub.href)}
                          onClick={onClose}
                          className="flex min-h-14 items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.04] px-4 font-display text-xl font-bold text-white no-underline"
                        >
                          {d.nav[sub.key]}
                          <Icon name="arrowRight" size={20} className="text-glacier-300 rtl:-scale-x-100" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                <ul className="grid gap-2 py-4 sm:grid-cols-2">
                  {categories.map((category) => (
                    <li key={category.slug} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                      <Link
                        href={path(`/products/${category.slug}`)}
                        onClick={onClose}
                        className="flex min-h-11 items-center justify-between font-display text-xl font-bold text-white no-underline"
                      >
                        {category.name[locale]}
                        <Icon name="arrowRight" size={20} className="text-glacier-300 rtl:-scale-x-100" />
                      </Link>
                      <ul className="mt-2 flex flex-wrap gap-2">
                        {category.subcategories.map((sub) => (
                          <li key={sub.slug}>
                            <Link
                              href={path(`/products/${category.slug}?type=${sub.slug}`)}
                              onClick={onClose}
                              className="inline-flex min-h-9 items-center rounded-full border border-white/15 px-3 text-sm text-white/85 no-underline transition-colors hover:border-glacier-300 hover:text-white"
                            >
                              {sub.name[locale]}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                  <li className="sm:col-span-2">
                    <Link
                      href={path("/products")}
                      onClick={onClose}
                      className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-glacier-300 no-underline"
                    >
                      {d.megaMenu.viewAll}
                      <Icon name="arrowRight" size={16} className="rtl:-scale-x-100" />
                    </Link>
                  </li>
                </ul>
                )}
              </details>
            </li>

            {primary.map((item, index) => {
              const active = pathname.startsWith(path(item.href));
              return (
                <li key={item.key} {...rise(index + 1)}>
                  <Link
                    href={path(item.href)}
                    onClick={onClose}
                    aria-current={active ? "page" : undefined}
                    className={cn(bigLink, active && "text-glacier-300")}
                  >
                    <span className="transition-transform duration-300 ease-[var(--ease-smooth)] group-hover:translate-x-2 rtl:group-hover:-translate-x-2">
                      {d.nav[item.key]}
                    </span>
                    <Icon
                      name="arrowRight"
                      size={24}
                      className="text-glacier-300 opacity-0 transition-[opacity,transform] duration-300 group-hover:opacity-100 rtl:-scale-x-100"
                    />
                  </Link>
                </li>
              );
            })}
          </ul>

          <ul {...rise(primary.length + 1)} className={cn(rise(primary.length + 1).className, "mt-8 grid grid-cols-2 gap-x-6")}>
            {secondary.map(([href, label]) => (
              <li key={href}>
                <Link
                  href={path(href)}
                  onClick={onClose}
                  className="link-underline inline-flex min-h-11 items-center text-sm text-white/75 transition-colors hover:text-white"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div
          {...rise(primary.length + 2)}
          className={cn(
            rise(primary.length + 2).className,
            "shell relative flex shrink-0 flex-col gap-4 border-t border-white/10 py-5",
          )}
        >
          <QuoteButton fullWidth size="lg" icon="arrowRight" onClick={onClose}>
            {d.cta.requestQuote}
          </QuoteButton>
          <div className="flex items-center justify-between">
            <a
              href={`tel:${site.phoneHref}`}
              className="inline-flex min-h-11 items-center gap-2 text-sm text-white/80 no-underline"
            >
              <Icon name="phone" size={20} className="text-glacier-300" />
              <span className="ltr-inline">{site.phone}</span>
            </a>
            <LocaleSwitcher locale={locale} label={d.a11y.languageSwitcher} />
          </div>
        </div>
      </div>
    </div>
  );
}
