import { Counter } from "@/components/motion/Counter";
import { Reveal } from "@/components/motion/Reveal";
import { TextReveal } from "@/components/motion/TextReveal";
import { Icon } from "@/components/ui/Icon";
import { Eyebrow, Shell } from "@/components/ui/Section";
import { certifications } from "@/lib/data/site";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n";

/**
 * The brand statement and its proof, straight after the hero.
 *
 * The statement is set large and lights up word by word as it is scrolled
 * through — the page slows down to say who Everest is. The four audited figures
 * then land as an editorial row, and the certifications close the section.
 * Every numeric claim on the site resolves back to one of these figures.
 */
export function TrustStrip({ locale, dictionary: d }: { locale: Locale; dictionary: Dictionary }) {
  return (
    <section aria-labelledby="trust-heading" className="relative isolate overflow-hidden bg-surface py-24 lg:py-40">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -end-40 top-24 -z-10 h-[34rem] w-[34rem] rounded-full bg-glacier-200/35 blur-3xl"
      />

      <Shell>
        <div className="grid gap-8 lg:grid-cols-[14rem_1fr] lg:gap-16">
          <div className="flex flex-col gap-3 lg:pt-3">
            <Eyebrow>{d.home.discover.eyebrow}</Eyebrow>
            <h2 id="trust-heading" className="text-sm font-semibold text-ink-muted">
              {d.home.trust.heading}
            </h2>
          </div>

          <TextReveal
            as="p"
            variant="scrub"
            className="max-w-[30ch] font-display text-3xl font-bold leading-[1.18] tracking-[-0.01em] text-ink-strong sm:text-4xl lg:text-5xl"
          >
            {d.home.discover.body}
          </TextReveal>
        </div>

        <Reveal
          as="dl"
          stagger
          className="mt-20 grid grid-cols-2 gap-y-12 border-t border-hairline-strong pt-12 lg:mt-32 lg:grid-cols-4 lg:pt-16"
        >
          {d.home.trust.stats.map((stat) => (
            <div
              key={stat.label}
              className="group relative flex flex-col-reverse justify-end pe-6 lg:border-s lg:border-hairline lg:px-8 lg:first:border-s-0 lg:first:ps-0"
            >
              <dd className="mt-2 max-w-[24ch] text-sm text-ink-muted">{stat.detail}</dd>
              <dt className="mt-4 font-semibold text-ink-strong">{stat.label}</dt>
              <dd className="font-display text-5xl font-bold leading-none tracking-tight text-navy-700 sm:text-6xl xl:text-7xl">
                <Counter value={stat.value} locale={locale} />
                {stat.suffix ? (
                  <span className="ms-0.5 align-top text-[0.5em] text-glacier-500">{stat.suffix}</span>
                ) : null}
              </dd>
              {/* Accent that draws in on hover. */}
              <span
                aria-hidden="true"
                className="absolute -top-12 start-0 h-0.5 w-16 origin-left scale-x-0 bg-glacier-400 transition-transform duration-500 ease-[var(--ease-smooth)] group-hover:scale-x-100 lg:-top-16 lg:start-8 lg:group-first:start-0 rtl:origin-right"
              />
            </div>
          ))}
        </Reveal>

        <div className="mt-16 flex flex-col gap-6 rounded-3xl bg-surface-muted p-6 lg:mt-24 lg:flex-row lg:items-center lg:justify-between lg:p-8">
          <div className="flex items-start gap-4">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-navy-700 text-glacier-300">
              <Icon name="shield" size={24} />
            </span>
            <p className="max-w-[60ch] text-sm text-ink-muted">{d.home.trust.intro}</p>
          </div>
          <Reveal
            as="ul"
            stagger
            aria-label={d.home.trust.certificationsLabel}
            className="flex flex-wrap items-center gap-2.5"
          >
            {certifications.map((cert) => (
              <li
                key={cert.id}
                className="inline-flex items-center gap-2 rounded-full border border-hairline-strong bg-surface py-1.5 pe-4 ps-1.5 text-sm transition-[border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-glacier-400"
              >
                <span className="grid h-7 w-7 place-items-center rounded-full bg-glacier-100 text-glacier-700">
                  <Icon name="check" size={16} />
                </span>
                <span className="ltr-inline font-semibold text-ink-strong">{cert.standard}</span>
              </li>
            ))}
          </Reveal>
        </div>
      </Shell>
    </section>
  );
}
