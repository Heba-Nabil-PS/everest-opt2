import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Caladea, Carlito, Tajawal } from "next/font/google";
import "../globals.css";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ChatAgent } from "@/components/layout/ChatAgent";
import { BackToTop } from "@/components/layout/BackToTop";
import { MobileQuoteBar } from "@/components/layout/MobileQuoteBar";
import { PageTransition } from "@/components/motion/PageTransition";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { Cursor } from "@/components/motion/Cursor";
import { GlassSpotlight } from "@/components/motion/GlassSpotlight";
import { AuroraOrbs } from "@/components/motion/AuroraOrbs";
import { QuoteModalProvider } from "@/components/forms/QuoteModal";
import { categories, products } from "@/lib/data/products";
import { site } from "@/lib/data/site";
import { buildSearchIndex } from "@/lib/search";
import { getDictionary } from "@/lib/i18n";
import { isLocale, locales, localeMeta } from "@/lib/i18n/config";

/* Brand type is Cambria (titles) and Calibri (body). Both are licensed
   Microsoft system fonts that cannot be served from the web, so globals.css
   uses them first where installed, then these metric-compatible open fonts
   (identical widths, so line breaks match everywhere). */
const display = Caladea({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-caladea",
  display: "swap",
});

const body = Carlito({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-carlito",
  display: "swap",
});

/** Arabic display and body in one family, matched in weight to the Latin pair. */
const arabic = Tajawal({
  subsets: ["arabic"],
  weight: ["400", "500", "700"],
  variable: "--font-tajawal",
  display: "swap",
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata(props: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await props.params;
  const d = getDictionary(locale);

  return {
    metadataBase: new URL(site.url),
    title: {
      default: d.home.meta.title,
      template: `%s | ${d.meta.siteName}`,
    },
    description: d.meta.defaultDescription,
    alternates: {
      canonical: `/${locale}`,
      languages: Object.fromEntries(locales.map((code) => [code, `/${code}`])),
    },
    openGraph: {
      type: "website",
      siteName: d.meta.siteName,
      title: d.home.meta.title,
      description: d.meta.defaultDescription,
      locale: locale === "ar" ? "ar_AE" : "en_AE",
      url: `/${locale}`,
    },
    robots: { index: true, follow: true },
  };
}

export default async function LocaleLayout(props: LayoutProps<"/[locale]">) {
  const { locale } = await props.params;
  if (!isLocale(locale)) notFound();

  const d = getDictionary(locale);
  const searchEntries = buildSearchIndex(locale, d);
  const quoteProducts = products.map((product) => ({
    value: `${product.name} (${product.code})`,
    label: `${product.name} · ${product.code}`,
  }));

  return (
    <html
      lang={localeMeta[locale].htmlLang}
      dir={localeMeta[locale].dir}
      /* `no-js` is removed by the inline script below before React hydrates;
         until then CSS reveals all animated content, so the page is never
         blank if scripts fail. That intentional class change would otherwise
         be reported as a hydration mismatch on <html>. */
      suppressHydrationWarning
      /* Smooth scrolling is for in-page anchors only: this tells Next.js 16 to
         switch it off during route changes so new pages open at the top. */
      data-scroll-behavior="smooth"
      className={`no-js ${display.variable} ${body.variable} ${arabic.variable}`}
    >
      {/* Browser extensions (Grammarly, password managers…) stamp attributes on
          <body> before React hydrates; ignore those attribute-only differences.
          `theme-aurora` is site-wide: it remaps the design tokens to the dark
          glass palette (see globals.css) for every page in one place, and
          AuroraOrbs paints the one drifting light layer behind all of them. */}
      <body suppressHydrationWarning className="theme-aurora flex min-h-dvh flex-col">
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.remove('no-js');if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.classList.add('motion-off')}`,
          }}
        />

        <AuroraOrbs />

        {/* Every "Request a Quote" control on the site opens this one dialog,
            so a request never costs the visitor the page they were reading. */}
        <QuoteModalProvider locale={locale} dictionary={d} products={quoteProducts}>
          <Header
            locale={locale}
            dictionary={d}
            categories={categories}
            searchEntries={searchEntries}
          />

          <main id="main" tabIndex={-1} className="flex-1 outline-none">
            <PageTransition>{props.children}</PageTransition>
          </main>

          <Footer locale={locale} dictionary={d} />
          <BackToTop label={d.a11y.backToTop} />
          <MobileQuoteBar label={d.cta.requestQuote} />
          <ChatAgent locale={locale} dictionary={d} />
        </QuoteModalProvider>

        {/* The motion layer: inertial wheel scroll and the pointer follower.
            Both switch themselves off for touch and reduced motion. */}
        <SmoothScroll />
        <Cursor labels={{ view: d.interaction.cursorView, drag: d.interaction.cursorDrag }} />
        <GlassSpotlight />
      </body>
    </html>
  );
}
