import { Counter } from "@/components/motion/Counter";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow, Section, Shell } from "@/components/ui/Section";
import { localePath, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n";

/**
 * "Discover Everest": the group at a glance, with a route to the corporate
 * presentation in the resources library.
 */
export function DiscoverBand({ locale, dictionary: d }: { locale: Locale; dictionary: Dictionary }) {
  const c = d.home.discover;

  return (
    <Section aria-labelledby="discover-heading" className="overflow-hidden bg-gradient-to-br from-glacier-600 via-steel to-navy-700 text-white">
      <div aria-hidden="true" className="bg-grid pointer-events-none absolute inset-0 -z-10 opacity-10" />
      <div aria-hidden="true" className="absolute -start-24 -top-24 -z-10 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
      <Shell className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        <div>
          <Eyebrow inverse>{c.eyebrow}</Eyebrow>
          <h2 id="discover-heading" className="mt-4 text-4xl text-white md:text-5xl">
            {c.heading}
          </h2>
          <p className="mt-5 max-w-[52ch] text-lg text-white/85">{c.body}</p>
          <ButtonLink href={localePath(locale, "/resources")} variant="inverse" size="lg" icon="arrowRight" className="mt-8">
            {c.cta}
          </ButtonLink>
        </div>

        <Reveal as="dl" stagger className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-white/15">
          {c.stats.map((stat) => (
            <div key={stat.label} className="flex flex-col-reverse gap-1 bg-navy-900/35 p-6 backdrop-blur-sm lg:p-8">
              <dt className="text-sm text-white/75">{stat.label}</dt>
              <dd className="font-display text-4xl font-bold lg:text-5xl">
                <Counter value={stat.value} suffix={stat.suffix} locale={locale} />
              </dd>
            </div>
          ))}
        </Reveal>
      </Shell>
    </Section>
  );
}
