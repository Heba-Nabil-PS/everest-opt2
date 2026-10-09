import { Reveal } from "@/components/motion/Reveal";
import { TextReveal } from "@/components/motion/TextReveal";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Eyebrow, Shell } from "@/components/ui/Section";
import { StatFigure } from "@/components/ui/StatFigure";
import { certifications } from "@/lib/data/site";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n";

/** One glyph per headline figure, in dictionary order (years, countries,
 *  people, markets, coolers, capacity), after the client's Reference 5. */
const statIcons: IconName[] = ["snow", "factory", "users", "globe", "box", "gauge"];

/**
 * Who Everest is, kept light: the statement lights up word by word beside its
 * heading, then the six headline figures sit in one slim glass band, split by
 * hairlines rather than boxed one by one (six across from lg, three by two
 * below). The figures arrive in turn and count up; a point of light travels
 * the band's top edge; hovering a figure turns it cyan and lengthens the
 * accent under it. The certifications close the band as its footer. Every
 * figure comes from the dictionary, and all motion stops under
 * prefers-reduced-motion (globals.css).
 */
export function ProofBento({ locale, dictionary: d }: { locale: Locale; dictionary: Dictionary }) {
  return (
    <section aria-labelledby="proof-heading" className="relative py-12 lg:py-16">
      <Shell>
        <div className="grid gap-6 lg:grid-cols-[14rem_1fr] lg:gap-12">
          <div className="flex flex-col gap-2 lg:pt-1.5">
            <Eyebrow inverse>{d.home.discover.eyebrow}</Eyebrow>
            <h2 id="proof-heading" className="text-sm font-normal text-white/55">
              {d.home.trust.heading}
            </h2>
          </div>
          <TextReveal
            as="p"
            variant="scrub"
            className="max-w-[48ch] font-display text-lg leading-[1.5] text-white sm:text-xl lg:text-2xl"
          >
            {d.home.discover.body}
          </TextReveal>
        </div>

        <div className="glass-panel relative mt-10 overflow-hidden rounded-[1.25rem] lg:mt-12">
          {/* Top edge: a hairline with a point of light travelling along it. */}
          <span
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-glacier-400/50 to-transparent"
          >
            <span className="track-light absolute -top-px block h-[3px] w-24 -translate-x-1/2 rounded-full bg-glacier-200 shadow-[0_0_14px_3px_rgb(116_215_242/0.7)]" />
          </span>

          <Reveal
            as="ul"
            stagger
            animation="blur-up"
            aria-label={d.home.trust.heading}
            className="grid grid-cols-3 lg:grid-cols-6"
          >
            {d.home.trust.stats.map((stat, index) => (
              <li
                key={stat.label}
                title={stat.detail}
                className="group relative border-white/10 px-3 py-5 transition-colors duration-500 hover:bg-white/[0.03] sm:px-5 sm:py-6 lg:px-6 lg:py-7 [&:not(:nth-child(3n+1))]:border-s [&:nth-child(n+4)]:border-t lg:[&:nth-child(4)]:border-s lg:[&:nth-child(n+4)]:border-t-0"
              >
                <p>
                  <StatFigure
                    value={stat.value}
                    suffix={stat.suffix}
                    locale={locale}
                    className="text-3xl text-white transition-colors duration-500 group-hover:text-glacier-300 sm:text-4xl lg:text-[2.6rem]"
                  />
                </p>
                <span
                  aria-hidden="true"
                  className="mt-3 block h-px w-6 bg-glacier-400/60 transition-[width,background-color] duration-500 ease-[var(--ease-smooth)] group-hover:w-12 group-hover:bg-glacier-300"
                />
                <p className="mt-3 flex items-start gap-1.5 text-xs leading-snug text-white/65 transition-colors duration-500 group-hover:text-white sm:text-sm">
                  <Icon
                    name={statIcons[index % statIcons.length]}
                    size={16}
                    className="mt-px shrink-0 text-glacier-300 transition-transform duration-500 group-hover:scale-110"
                  />
                  <span>
                    {stat.label}
                    <span className="sr-only">. {stat.detail}</span>
                  </span>
                </p>
              </li>
            ))}
          </Reveal>

          {/* Footer: the certifications behind the figures. */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/10 px-4 py-3 sm:px-6">
            <p className="flex items-center gap-2 text-2xs font-semibold uppercase tracking-[0.18em] text-glacier-300">
              <Icon name="shield" size={16} />
              {d.home.trust.certificationsLabel}
            </p>
            <ul aria-label={d.home.trust.certificationsLabel} className="flex flex-wrap gap-x-4 gap-y-1">
              {certifications.map((cert) => (
                <li key={cert.id} className="ltr-inline text-xs text-white/60">
                  {cert.standard}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Shell>
    </section>
  );
}
