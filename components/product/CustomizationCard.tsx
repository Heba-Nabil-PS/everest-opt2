import Image from "next/image";
import Link from "next/link";
import { Glow } from "@/components/ui/Aurora";
import { Icon } from "@/components/ui/Icon";
import { localePath, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n";

/**
 * The first tile in the product listing: not a model but the customization
 * service, so it deliberately breaks the product-card pattern. A light runs
 * round its border (`.custom-card`, globals.css), the options it covers float
 * over the photograph as chips, and a three-step "how it works" replaces the
 * spec chips. The whole card is one link to the customize page. The
 * photograph is a stand-in until the client's own customization image is
 * supplied.
 */
export function CustomizationCard({ locale, dictionary: d }: { locale: Locale; dictionary: Dictionary }) {
  const c = d.products.customizationCard;

  return (
    <Link
      href={localePath(locale, "/customize")}
      data-cursor="view"
      className="custom-card group relative isolate flex h-full flex-col overflow-hidden rounded-2xl text-white no-underline transition-transform duration-500 ease-[var(--ease-smooth)] hover:-translate-y-1 focus-visible:-translate-y-1"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src="/images/gallery-assembly.jpg"
          alt=""
          fill
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-1000 ease-[var(--ease-smooth)] group-hover:scale-[1.08]"
        />
        <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/40 to-glacier-500/10" />

        <span className="absolute start-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-glacier-400 px-3 py-1 text-2xs font-semibold uppercase tracking-[0.12em] text-navy-950 shadow-[0_8px_24px_-8px_rgb(44_186_226/0.9)]">
          <Icon name="sparkle" size={16} />
          {c.eyebrow}
        </span>

        {/* What can be changed, drifting gently over the photo. */}
        <ul aria-label={c.title} className="absolute inset-x-3 bottom-3 flex flex-wrap gap-1.5">
          {c.options.map((option, index) => (
            <li
              key={option}
              className="custom-chip glass-chip rounded-full px-2.5 py-1 text-2xs font-medium text-white"
              style={{ animationDelay: `${-index * 0.9}s` }}
            >
              {option}
            </li>
          ))}
        </ul>
      </div>

      <div className="relative flex flex-1 flex-col gap-4 p-5">
        <Glow className="-bottom-24 -end-20 h-56 w-56 opacity-70 transition-opacity duration-500 group-hover:opacity-100" />

        <div>
          <h3 className="text-aurora font-display text-2xl leading-tight">{c.title}</h3>
          <p className="mt-2 text-sm text-white/70">{c.body}</p>
        </div>

        <ol className="flex flex-col gap-2">
          {c.steps.map((step, index) => (
            <li key={step} className="flex items-center gap-3 text-sm text-white/85">
              <span className="tabular grid h-6 w-6 shrink-0 place-items-center rounded-full border border-glacier-300/50 font-mono text-2xs text-glacier-300 transition-colors duration-300 group-hover:border-glacier-300 group-hover:bg-glacier-400 group-hover:text-navy-950" style={{ transitionDelay: `${index * 80}ms` }}>
                {index + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>

        <span className="mt-auto inline-flex items-center justify-center gap-2 rounded-full bg-glacier-400 px-5 py-2.5 text-sm font-semibold text-navy-950 shadow-[0_12px_32px_-12px_rgb(44_186_226/0.9)] transition-colors duration-300 group-hover:bg-glacier-300">
          {c.cta}
          <Icon
            name="arrowRight"
            size={16}
            className="transition-transform duration-300 group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1"
          />
        </span>
      </div>
    </Link>
  );
}
