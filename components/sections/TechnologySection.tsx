import { Reveal } from "@/components/motion/Reveal";
import { GrowBar } from "@/components/motion/GrowBar";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Section, SectionHeading, Shell } from "@/components/ui/Section";
import { PhotoBackdrop } from "@/components/ui/PhotoBackdrop";
import { localePath, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n";

/**
 * EMMD explained with the comparison that actually persuades: the same duty
 * cycle, two control strategies, one bar shorter than the other.
 */
export function TechnologySection({
  locale,
  dictionary: d,
}: {
  locale: Locale;
  dictionary: Dictionary;
}) {
  return (
    <Section ground="deep" aria-labelledby="technology-heading">
      <PhotoBackdrop src="/images/rnd-testing.jpg" />

      {/* The copy column takes the larger share so the intro runs in three
          lines on desktop rather than stacking into a tall block. */}
      <Shell className="relative grid gap-14 lg:grid-cols-[1.5fr_1fr] lg:items-center">
        <div>
          <SectionHeading
            id="technology-heading"
            eyebrow={d.home.technology.eyebrow}
            title={d.home.technology.heading}
            intro={d.home.technology.body}
            introClassName="max-w-none text-base"
            inverse
          />

          <Reveal as="ul" stagger className="mt-10 flex flex-col gap-5">
            {d.home.technology.points.map((point) => (
              <li key={point.title} className="flex gap-4">
                <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-glacier-400/15 text-glacier-300">
                  <Icon name="bolt" size={20} />
                </span>
                <span>
                  <span className="block font-display font-semibold text-white">{point.title}</span>
                  <span className="mt-1 block text-sm text-ink-inverse-muted">{point.body}</span>
                </span>
              </li>
            ))}
          </Reveal>

          <ButtonLink href={localePath(locale, "/innovation")} className="mt-10" icon="arrowRight">
            {d.home.technology.cta}
          </ButtonLink>
        </div>

        {/* Energy comparison — the claim as designed data, not a paragraph. */}
        <Reveal animation="scale-in" className="glass-dark rounded-2xl p-7 lg:p-9">
          <p className="text-2xs font-semibold uppercase tracking-[0.18em] text-glacier-300">
            EMMD
          </p>

          <dl className="mt-6 flex flex-col gap-7">
            <div>
              <dt className="flex items-baseline justify-between text-sm text-white/85">
                <span>{d.home.technology.baselineLabel}</span>
                <span className="tabular font-display text-lg font-semibold text-white">100%</span>
              </dt>
              <dd className="mt-2">
                <GrowBar value={100} label="100%" barClassName="bg-gradient-to-r from-steel to-steel-light" />
              </dd>
            </div>

            <div>
              <dt className="flex items-baseline justify-between text-sm text-glacier-200">
                <span>{d.home.technology.savingsLabel}</span>
                <span className="tabular font-display text-lg font-semibold text-white">80%</span>
              </dt>
              <dd className="mt-2">
                <GrowBar value={80} label="80%" delay={0.35} barClassName="bg-gradient-to-r from-glacier-400 to-glacier-300 shadow-[0_0_16px_rgb(44_186_226/0.6)]" />
              </dd>
            </div>
          </dl>

          <p className="mt-8 border-t border-white/12 pt-6 font-display text-5xl font-bold text-white">
            <span className="ltr-inline text-gradient">−20%</span>
          </p>
          <p className="mt-2 text-sm text-ink-inverse-muted">{d.home.technology.savingsLabel}</p>
        </Reveal>
      </Shell>
    </Section>
  );
}
