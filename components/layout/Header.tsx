"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/art/Logo";
import { Icon } from "@/components/ui/Icon";
import { QuoteButton } from "@/components/forms/QuoteButton";
import { Magnetic } from "@/components/motion/Magnetic";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { MegaMenu } from "./MegaMenu";
import { MobileNav } from "./MobileNav";
import { SearchDialog } from "./SearchDialog";
import { mainNav, site, utilityNav } from "@/lib/data/site";
import { localePath, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n";
import type { ProductCategory } from "@/lib/data/types";
import type { SearchEntry } from "@/lib/search";

interface HeaderProps {
  locale: Locale;
  dictionary: Dictionary;
  categories: ProductCategory[];
  searchEntries: SearchEntry[];
}

/** Scroll distance before the header may hide on the way down. */
const HIDE_AFTER = 480;

/**
 * The site header is a dark navy bar (see "Site header — always dark" in
 * globals.css) with three scroll states:
 *
 *   top       — utility bar and main bar, over the hero.
 *   condensed — once scrolled, the utility bar slides away and the main bar
 *               turns to denser frosted glass.
 *   hidden    — scrolling down past the fold tucks it away; any upward scroll,
 *               an open menu or keyboard focus inside it brings it straight back.
 *
 * The header only ever moves with `transform`, so its layout height never
 * changes and never shifts the page.
 */
export function Header({ locale, dictionary: d, categories, searchEntries }: HeaderProps) {
  const pathname = usePathname();
  const [condensed, setCondensed] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const closeTimer = useRef<number | undefined>(undefined);

  const path = useCallback((p: string) => localePath(locale, p), [locale]);
  const isActive = useCallback((href: string) => pathname.startsWith(path(href)), [pathname, path]);

  useEffect(() => {
    let frame = 0;
    let lastY = window.scrollY;

    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const delta = y - lastY;
      lastY = y;

      /* Separate enter/exit thresholds (hysteresis) stop the bar flickering. */
      setCondensed((current) => (current ? y > 24 : y > 96));

      const focusInside = headerRef.current?.contains(document.activeElement) ?? false;
      if (y < HIDE_AFTER || focusInside) setHidden(false);
      else if (delta > 6) setHidden(true);
      else if (delta < -6) setHidden(false);
    };

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  /* Any navigation closes every overlay. */
  useEffect(() => {
    setMegaOpen(false);
    setMobileOpen(false);
    setSearchOpen(false);
    setHidden(false);
  }, [pathname]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setMegaOpen(false);
      /* Ctrl/Cmd+K is the conventional shortcut for site search. */
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  /* --- Sliding indicator under the main navigation ------------------------ */
  const moveIndicator = useCallback((target: HTMLElement | null) => {
    const indicator = indicatorRef.current;
    if (!indicator) return;
    if (!target) {
      indicator.style.opacity = "0";
      return;
    }
    const inset = 12;
    indicator.style.opacity = "1";
    indicator.style.transform = `translateX(${target.offsetLeft + inset}px) scaleX(${Math.max(target.offsetWidth - inset * 2, 0)})`;
  }, []);

  const activeItem = useCallback(
    () => navRef.current?.querySelector<HTMLElement>("[data-nav-active='true']") ?? null,
    [],
  );

  useLayoutEffect(() => {
    moveIndicator(activeItem());
    const onResize = () => moveIndicator(activeItem());
    window.addEventListener("resize", onResize);
    document.fonts?.ready.then(onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [pathname, moveIndicator, activeItem]);

  const openMega = () => {
    window.clearTimeout(closeTimer.current);
    setMegaOpen(true);
  };

  /* A short delay stops the panel flickering when the pointer crosses a gap. */
  const scheduleCloseMega = () => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setMegaOpen(false), 160);
  };

  const overlay = !condensed && !megaOpen;
  const tucked = hidden && !megaOpen && !searchOpen && !mobileOpen;

  const navItemClass = (active: boolean) =>
    cn(
      "relative inline-flex min-h-11 items-center gap-1.5 whitespace-nowrap rounded-lg px-3 text-sm font-medium no-underline transition-colors duration-200",
      active ? "text-[var(--hdr-accent)]" : "text-[var(--hdr-fg)] hover:text-[var(--hdr-fg-strong)]",
    );

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:inset-x-0 focus:top-0 focus:z-[100] focus:block focus:bg-navy-700 focus:p-4 focus:text-center focus:text-white"
      >
        {d.a11y.skipToContent}
      </a>

      <header
        ref={headerRef}
        data-overlay={overlay}
        data-condensed={condensed}
        className={cn(
          "site-header sticky top-0 w-full will-change-transform",
          "transition-transform duration-500 ease-[var(--ease-smooth)]",
          tucked ? "-translate-y-full" : condensed ? "-translate-y-10" : "translate-y-0",
        )}
        style={{ zIndex: "var(--z-header)", viewTransitionName: "site-header" }}
        onMouseLeave={scheduleCloseMega}
        onFocus={() => setHidden(false)}
      >
        {/* Utility bar */}
        <div
          inert={condensed}
          className={cn(
            "hdr-utility border-b border-[var(--hdr-border)] bg-[var(--hdr-util-bg)] text-white",
            "transition-[opacity,background-color,border-color] duration-300",
            condensed ? "opacity-0" : "opacity-100",
          )}
        >
          <div className="shell flex h-10 items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-5">
              <a
                href={`tel:${site.phoneHref}`}
                className="inline-flex min-h-6 items-center gap-2 no-underline transition-colors hover:text-glacier-300"
              >
                <Icon name="phone" size={16} className="text-glacier-300" />
                <span className="ltr-inline">{site.phone}</span>
              </a>
              <a
                href={`mailto:${site.email}`}
                className="hidden min-h-6 items-center gap-2 no-underline transition-colors hover:text-glacier-300 sm:inline-flex"
              >
                <Icon name="mail" size={16} className="text-glacier-300" />
                <span className="ltr-inline">{site.email}</span>
              </a>
            </div>

            <nav aria-label={d.a11y.utilityNavigation} className="flex items-center gap-5">
              {utilityNav.map((item) => (
                <Link
                  key={item.key}
                  href={path(item.href)}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={cn(
                    "link-underline hidden min-h-6 items-center transition-colors hover:text-glacier-300 md:inline-flex",
                    isActive(item.href) && "text-glacier-300",
                  )}
                >
                  {d.nav[item.key]}
                </Link>
              ))}
              <span aria-hidden="true" className="hidden h-3.5 w-px bg-white/20 md:inline-block" />
              <LocaleSwitcher locale={locale} label={d.a11y.languageSwitcher} />
            </nav>
          </div>
        </div>

        {/* Main bar */}
        <div
          className={cn(
            "hdr-main border-b transition-[background-color,box-shadow,border-color,backdrop-filter] duration-500",
            "border-[var(--hdr-border)] bg-[var(--hdr-bg)]",
          )}
        >
          <div className="shell flex h-18 items-center justify-between gap-4 py-1.5">
            <Link
              href={path("/")}
              /* Never shrink: a squeezed flex item is what distorted the logo. */
              className="site-logo shrink-0 no-underline transition-[filter] duration-500"
              aria-label={`${d.meta.siteName} — ${d.nav.home}`}
            >
              <Logo priority />
            </Link>

            <nav
              ref={navRef}
              aria-label={d.a11y.mainNavigation}
              className="relative hidden items-center gap-0.5 xl:flex"
              onMouseLeave={() => moveIndicator(activeItem())}
            >
              {mainNav.map((item) =>
                item.hasMegaMenu ? (
                  /* Not positioned: the indicator measures offsets against the nav. */
                  <div key={item.key} onMouseEnter={openMega}>
                    <button
                      type="button"
                      aria-expanded={megaOpen}
                      aria-controls="products-mega-menu"
                      data-nav-active={isActive(item.href)}
                      onClick={() => setMegaOpen((open) => !open)}
                      onMouseEnter={(event) => moveIndicator(event.currentTarget)}
                      onFocus={(event) => moveIndicator(event.currentTarget)}
                      className={navItemClass(isActive(item.href))}
                    >
                      {d.nav[item.key]}
                      <Icon
                        name="chevronDown"
                        size={16}
                        className={cn("transition-transform duration-300", megaOpen && "rotate-180")}
                      />
                    </button>
                  </div>
                ) : (
                  <Link
                    key={item.key}
                    href={path(item.href)}
                    data-nav-active={isActive(item.href)}
                    onMouseEnter={(event) => {
                      scheduleCloseMega();
                      moveIndicator(event.currentTarget);
                    }}
                    onFocus={(event) => moveIndicator(event.currentTarget)}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={navItemClass(isActive(item.href))}
                  >
                    {d.nav[item.key]}
                  </Link>
                ),
              )}

              {/* One 1px bar, positioned and stretched with transform only. */}
              <span
                ref={indicatorRef}
                aria-hidden="true"
                className="pointer-events-none absolute bottom-1 left-0 h-0.5 w-px origin-left rounded-full bg-glacier-400 opacity-0 transition-[transform,opacity] duration-500 ease-[var(--ease-smooth)]"
              />
            </nav>

            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                aria-label={d.search.shortHint}
                aria-keyshortcuts="Control+K Meta+K"
                className={cn(
                  "group inline-flex h-11 w-11 min-w-0 items-center justify-center gap-2.5 rounded-full border border-[var(--hdr-border)] bg-[var(--hdr-chip)] text-sm text-[var(--hdr-fg)]",
                  "transition-[border-color,background-color,box-shadow,color] duration-200",
                  "hover:border-glacier-400 hover:text-[var(--hdr-fg-strong)] hover:shadow-[0_0_0_4px_rgb(44_186_226/0.12)]",
                  "lg:w-64 lg:justify-start lg:px-3.5 xl:w-11 xl:justify-center xl:px-0 2xl:w-72 2xl:justify-start 2xl:px-3.5",
                )}
              >
                <Icon
                  name="search"
                  size={20}
                  className="text-[var(--hdr-accent)] transition-transform duration-200 group-hover:scale-110"
                />
                {/* Plain display toggles (not sr-only) so the hint stays on one line. */}
                <span className="hidden min-w-0 flex-1 truncate whitespace-nowrap text-start lg:block xl:hidden 2xl:block">
                  {d.search.shortHint}
                </span>
              </button>

              <Magnetic className="hidden sm:inline-flex">
                <QuoteButton size="sm" icon="arrowRight" className="whitespace-nowrap">
                  {d.cta.requestQuote}
                </QuoteButton>
              </Magnetic>

              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                aria-label={d.a11y.openMenu}
                aria-expanded={mobileOpen}
                className="group grid h-11 w-11 place-items-center rounded-full border border-[var(--hdr-border)] text-[var(--hdr-fg-strong)] transition-colors hover:border-glacier-400 xl:hidden"
              >
                {/* Two bars that offset on hover and morph into the drawer's close X. */}
                <span aria-hidden="true" className="flex w-5 flex-col items-end gap-1.5">
                  <span className="h-0.5 w-5 rounded-full bg-current transition-transform duration-300 ease-[var(--ease-smooth)] group-hover:-translate-x-1 rtl:group-hover:translate-x-1" />
                  <span className="h-0.5 w-3.5 rounded-full bg-current transition-transform duration-300 ease-[var(--ease-smooth)] group-hover:scale-x-[1.43] group-hover:origin-right rtl:group-hover:origin-left" />
                </span>
              </button>
            </div>
          </div>
        </div>

        <MegaMenu
          open={megaOpen}
          locale={locale}
          dictionary={d}
          categories={categories}
          onMouseEnter={openMega}
          onMouseLeave={scheduleCloseMega}
          onClose={() => setMegaOpen(false)}
        />
      </header>

      <MobileNav
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        locale={locale}
        dictionary={d}
        categories={categories}
      />

      <SearchDialog
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        dictionary={d}
        entries={searchEntries}
      />
    </>
  );
}
