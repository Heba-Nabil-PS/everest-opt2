import { Reveal } from "@/components/motion/Reveal";
import { TextReveal } from "@/components/motion/TextReveal";
import { Icon } from "@/components/ui/Icon";
import { Eyebrow, Shell } from "@/components/ui/Section";
import { StatFigure } from "@/components/ui/StatFigure";
import { certifications } from "@/lib/data/site";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n";

/**
 * Who Everest is, kept light: the statement lights up word by word beside its
 * heading, the four audited figures count up in one frosted strip, and the
 * certifications close as a single quiet line. Every figure comes from the
 * dictionary.
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

        <Reveal
          as="dl"
          stagger
          className="glass-panel glass-spot mt-10 grid grid-cols-2 gap-y-8 rounded-[1.5rem] p-6 lg:mt-12 lg:grid-cols-4 lg:p-8"
        >
          {d.home.trust.stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col-reverse justify-end px-2 lg:border-s lg:border-white/10 lg:px-6 lg:first:border-s-0 lg:first:ps-0"
            >
              <dt className="mt-2 text-sm text-white/70">{stat.label}</dt>
              <dd>
                <StatFigure value={stat.value} suffix={stat.suffix} locale={locale} className="text-4xl text-white lg:text-5xl" />
              </dd>
            </div>
          ))}
        </Reveal>

        <Reveal
          as="ul"
          stagger
          aria-label={d.home.trust.certificationsLabel}
          className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 px-2"
        >
          <li className="flex items-center gap-2 text-2xs font-semibold uppercase tracking-[0.18em] text-glacier-300">
            <Icon name="shield" size={16} />
            {d.home.trust.certificationsLabel}
          </li>
          {certifications.map((cert) => (
            <li key={cert.id} className="ltr-inline text-sm text-white/70">
              {cert.standard}
            </li>
          ))}
        </Reveal>
      </Shell>
    </section>
  );
}
