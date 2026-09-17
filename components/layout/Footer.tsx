import Image from "next/image";
import Link from "next/link";
import { Logo } from "@/components/art/Logo";
import { Icon } from "@/components/ui/Icon";
import { QuoteButton } from "@/components/forms/QuoteButton";
import { certifications, marketplaces, site } from "@/lib/data/site";
import { categories } from "@/lib/data/products";
import { localePath, type Locale } from "@/lib/i18n/config";
import { t, type Dictionary } from "@/lib/i18n";

/**
 * A compact, single-band footer: brand and contact on one side, every link
 * flattened into one wrapped row grouped by a small caption instead of three
 * tall columns, and the marketplace badges, socials and legal line sharing
 * the closing strip. About a third the height of a conventional multi-column
 * footer, so it never dominates the page it closes.
 */
export function Footer({ locale, dictionary: d }: { locale: Locale; dictionary: Dictionary }) {
  const path = (p: string) => localePath(locale, p);

  const groups = [
    {
      heading: d.footer.columns.company,
      links: [
        { label: d.footer.links.about, href: path("/about") },
        { label: d.footer.links.innovation, href: path("/innovation") },
        { label: d.footer.links.sustainability, href: path("/sustainability") },
        { label: d.footer.links.presence, href: path("/global-presence") },
        { label: d.footer.links.news, href: path("/news") },
      ],
    },
    {
      heading: d.footer.columns.productsServices,
      links: [
        ...categories.map((category) => ({
          label: category.name[locale],
          href: path(`/products/${category.slug}`),
        })),
        { label: d.footer.links.customSolutions, href: path("/customize") },
        { label: d.footer.links.services, href: path("/services") },
      ],
    },
    {
      heading: d.footer.columns.resources,
      links: [
        { label: d.footer.links.brochures, href: path("/resources#brochures") },
        { label: d.footer.links.manuals, href: path("/resources#manuals") },
        { label: d.footer.links.certifications, href: path("/resources#certifications") },
        { label: d.footer.links.catalogue, href: path("/resources#catalogue") },
      ],
    },
  ];

  const isoLine = certifications.map((cert) => cert.standard).join(" · ");

  return (
    <footer className="relative isolate overflow-hidden bg-navy-950 text-white">
      {/* One soft glow instead of a pattern keeps the ground calm. */}
      <div
        aria-hidden="true"
        className="absolute -top-32 end-[-10%] -z-10 h-64 w-[36rem] rounded-full bg-glacier-500/10 blur-3xl"
      />

      <div className="shell py-10 lg:py-12">
        {/* Brand + quote CTA */}
        <div className="flex flex-col gap-6 border-b border-white/10 pb-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Logo inverse size="md" />
            <p className="hidden max-w-[28ch] text-sm text-ink-inverse-muted sm:block">{d.meta.tagline}</p>
          </div>
          <QuoteButton icon="arrowRight" className="self-start sm:self-auto">
            {d.cta.requestQuote}
          </QuoteButton>
        </div>

        {/* Every link, grouped by a small caption, stacked one per line per group. */}
        <nav aria-label={d.a11y.footerNavigation} className="grid gap-8 border-b border-white/10 py-8 sm:grid-cols-3">
          {groups.map((group) => (
            <div key={group.heading}>
              <h2 className="text-2xs font-semibold uppercase tracking-[0.18em] text-glacier-300">{group.heading}</h2>
              <ul className="mt-3 flex flex-col gap-1.5">
                {group.links.map((link) => (
                  <li key={`${group.heading}-${link.label}`}>
                    <Link
                      href={link.href}
                      className="inline-flex min-h-8 items-center text-sm text-white/70 no-underline transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* Closing strip: contact, marketplaces, certifications, socials, legal — one row on wide screens. */}
        <div className="flex flex-col gap-6 pt-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/70">
            <a href={`tel:${site.phoneHref}`} className="inline-flex min-h-6 items-center gap-2 no-underline transition-colors hover:text-glacier-300">
              <Icon name="phone" size={16} className="text-glacier-300" />
              <span className="ltr-inline">{site.phone}</span>
            </a>
            <a href={`mailto:${site.email}`} className="inline-flex min-h-6 items-center gap-2 break-all no-underline transition-colors hover:text-glacier-300">
              <Icon name="mail" size={16} className="text-glacier-300" />
              <span className="ltr-inline">{site.email}</span>
            </a>
            <span className="ltr-inline hidden text-white/40 md:inline">{isoLine}</span>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <ul className="flex items-center gap-2">
              <li>
                <a
                  href={marketplaces.amazon}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${d.common.buyOnAmazon} — ${d.a11y.externalLink}`}
                  className="flex h-8 w-20 items-center justify-center rounded-md bg-white/8 px-2.5 ring-1 ring-white/10 no-underline transition-[background-color,transform] duration-200 hover:-translate-y-0.5 hover:bg-white/14"
                >
                  <Image src="/brand/marketplaces/amazon-white.svg" alt="" width={603} height={182} unoptimized className="h-auto w-full" />
                </a>
              </li>
              <li>
                <a
                  href={marketplaces.noon}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${d.common.buyOnNoon} — ${d.a11y.externalLink}`}
                  className="flex h-8 w-20 items-center justify-center overflow-hidden rounded-md bg-[#fce819] no-underline transition-transform duration-200 hover:-translate-y-0.5"
                >
                  <Image src="/brand/marketplaces/noon.svg" alt="" width={800} height={372} unoptimized className="h-full w-auto max-w-none" />
                </a>
              </li>
            </ul>

            <span aria-hidden="true" className="hidden h-5 w-px bg-white/15 sm:block" />

            <ul className="flex gap-2">
              {(
                [
                  [LinkedInMark, site.social.linkedin, "LinkedIn"],
                  [YouTubeMark, site.social.youtube, "YouTube"],
                ] as const
              ).map(([Mark, href, name]) => (
                <li key={name}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${name} — ${d.a11y.externalLink}`}
                    className="grid h-9 w-9 place-items-center rounded-full bg-white/8 ring-1 ring-white/10 transition-[background-color,transform] duration-200 hover:-translate-y-0.5 hover:bg-white"
                  >
                    <Mark />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Legal line */}
      <div className="border-t border-white/10">
        <div className="shell flex flex-wrap items-center gap-x-3 gap-y-2 pb-28 pt-4 text-xs text-white/55 sm:pb-4">
          <Link href={path("/privacy")} className="inline-flex min-h-6 items-center no-underline hover:text-white">
            {d.footer.legal.privacy}
          </Link>
          <span aria-hidden="true">·</span>
          <Link href={path("/terms")} className="inline-flex min-h-6 items-center no-underline hover:text-white">
            {d.footer.legal.terms}
          </Link>
          <span aria-hidden="true">·</span>
          <p>{t(d.footer.legal.copyright, { year: new Date().getFullYear() })}</p>
        </div>
      </div>
    </footer>
  );
}

/* Brand glyphs in their official colours (#0A66C2 LinkedIn, #FF0000 YouTube).
   A white shape sits under each cut-out so the "in" and the play arrow stay
   white on the dark footer instead of showing the ground through. */
function LinkedInMark() {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24">
      <rect x="2" y="2" width="20" height="20" rx="2" fill="#fff" />
      <path
        fill="#0A66C2"
        d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
      />
    </svg>
  );
}

function YouTubeMark() {
  return (
    <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24">
      <path d="M9.545 8.432 15.818 12l-6.273 3.568z" fill="#fff" />
      <path
        fill="#FF0000"
        d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
      />
    </svg>
  );
}
