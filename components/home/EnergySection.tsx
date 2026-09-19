import { Counter } from "@/components/motion/Counter";
import { DutyCycleChart } from "@/components/art/DutyCycleChart";
import { GrowBar } from "@/components/motion/GrowBar";
import { Reveal } from "@/components/motion/Reveal";
import { Magnetic } from "@/components/motion/Magnetic";
import { ButtonLink } from "@/components/ui/Button";
import { Glow } from "@/components/ui/Aurora";
import { Icon, type IconName } from "@/components/ui/Icon";
import { PhotoBackdrop } from "@/components/ui/PhotoBackdrop";
import { SectionHeading, Shell } from "@/components/ui/Section";
import { localePath, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n";

const pointIcons: IconName[] = ["gauge", "bolt", "temperature", "leaf"];

/**
 * EMMD as a data poster: one giant counted figure, the fixed-speed versus EMMD
 * bars in a glass meter, and the four engineering points as a 2×2 of chips.
 */
export function EnergySection({ locale, dictionary: d }: { locale: Locale; dictionary: Dictionary }) {
  const t = d.home.technology;

  return (
    <section aria-labelledby="energy-heading" className="relative isolate overflow-hidden py-12 lg:py-16">
      <PhotoBackdrop src="/images/rnd-testing.jpg" className="opacity-60 [mask-image:linear-gradient(to_bottom,transparent,#000_25%,#000_75%,transparent)]" />

      <Shell>
        <SectionHeading id="energy-heading" eyebrow={t.eyebrow} title={t.heading} intro={t.body} size="display" inverse />

        <div className="mt-10 grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-6">
          {/* The figure */}
          <Reveal animation="scale-in" className="glass-panel-strong glass-spot relative isolate flex flex-col justify-between gap-7 overflow-hidden rounded-[2rem] p-8 lg:gap-8 lg:p-10">
            <Glow className="-bottom-24 -start-16 h-80 w-80" />
            <Glow tone="indigo" className="-end-20 -top-20 h-64 w-64" />
            <p className="glass-chip inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-2xs font-semibold uppercase tracking-[0.22em] text-glacier-300">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-glacier-400 shadow-[0_0_10px_rgb(44_186_226/0.9)]" />
              EMMD
            </p>

            <div className="relative">
              {/* The figure sits in its own pool of light rather than on flat glass. */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgb(44_186_226/0.22),transparent_65%)] blur-2xl"
              />
              <p className="font-display text-[5.25rem] font-bold leading-[0.85] tracking-[-0.04em] xs:text-[6.5rem] sm:text-[9rem] lg:text-[9.5rem]">
                <span className="ltr-inline text-aurora">
                  −<Counter value={20} locale={locale} />%
                </span>
              </p>
            </div>

            {/* Why the figure exists: hard cycling against modulated demand. */}
            <DutyCycleChart className="-mx-1" />

            <dl className="flex flex-col gap-5">
              <div>
                <dt className="flex items-baseline justify-between text-sm text-white/75">
                  <span>{t.baselineLabel}</span>
                  <span className="tabular font-display font-semibold text-white">100%</span>
                </dt>
                <dd className="mt-2">
                  <GrowBar value={100} label="100%" barClassName="bg-white/35" />
                </dd>
              </div>
              <div>
                <dt className="flex items-baseline justify-between text-sm text-glacier-200">
                  <span>{t.savingsLabel}</span>
                  <span className="tabular font-display font-semibold text-white">80%</span>
                </dt>
                <dd className="mt-2">
                  <GrowBar
                    value={80}
                    label="80%"
                    delay={0.35}
                    barClassName="bg-gradient-to-r from-glacier-400 to-steel-light shadow-[0_0_20px_rgb(44_186_226/0.7)]"
                  />
                </dd>
              </div>
            </dl>
          </Reveal>

          {/* The engineering */}
          <div className="flex flex-col gap-5">
            <Reveal as="ul" stagger className="grid gap-5 sm:grid-cols-2">
              {t.points.map((point, index) => (
                <li key={point.title} className="glass-panel glass-spot glass-hover flex h-full flex-col gap-4 rounded-[1.5rem] p-6">
                  <span className="glass-chip grid h-11 w-11 place-items-center rounded-full text-glacier-300">
                    <Icon name={pointIcons[index]} size={20} />
                  </span>
                  <span className="font-display text-lg font-bold text-white">{point.title}</span>
                  <span className="text-sm text-white/65">{point.body}</span>
                </li>
              ))}
            </Reveal>
            <Magnetic className="self-start">
              <ButtonLink href={localePath(locale, "/innovation")} size="lg" icon="arrowRight">
                {t.cta}
              </ButtonLink>
            </Magnetic>
          </div>
        </div>
      </Shell>
    </section>
  );
}
