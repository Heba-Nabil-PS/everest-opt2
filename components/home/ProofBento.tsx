import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { TextReveal } from "@/components/motion/TextReveal";
import { ImageReveal } from "@/components/motion/ImageReveal";
import { Icon } from "@/components/ui/Icon";
import { Eyebrow, Shell } from "@/components/ui/Section";
import { StatFigure } from "@/components/ui/StatFigure";
import { certifications } from "@/lib/data/site";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n";

/**
 * Who Everest is, as a quiet bento of frosted tiles: the statement in the
 * large tile, one figure and one label per small tile, a container-port
 * photograph carrying the market count, and the certifications as a single
 * row. Every figure comes from the dictionary.
 */
export function ProofBento({ locale, dictionary: d }: { locale: Locale; dictionary: Dictionary }) {
  const [years, coolers, countries, energy] = d.home.trust.stats;
  const [professionals, , , factories] = d.home.discover.stats;

  const tile = "glass-panel glass-spot rounded-[1.5rem] p-6 lg:p-7";

  return (
    <section aria-labelledby="proof-heading" className="relative py-12 lg:py-16">
      <Shell>
        <div className="grid auto-rows-[minmax(9rem,auto)] gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Statement */}
          <Reveal className={cn(tile, "flex flex-col justify-center gap-5 md:col-span-2 lg:row-span-2")}>
            <div className="flex flex-col gap-2">
              <Eyebrow inverse>{d.home.discover.eyebrow}</Eyebrow>
              <h2 id="proof-heading" className="text-sm font-normal text-white/55">
                {d.home.trust.heading}
              </h2>
            </div>
            <TextReveal
              as="p"
              variant="scrub"
              className="max-w-[34ch] font-display text-xl leading-[1.4] text-white sm:text-2xl lg:text-[1.75rem]"
            >
              {d.home.discover.body}
            </TextReveal>
          </Reveal>

          <StatTile className={tile} value={years.value} suffix={years.suffix} label={years.label} locale={locale} />
          <StatTile className={tile} value={coolers.value} suffix={coolers.suffix} label={coolers.label} locale={locale} />

          {/* Photograph carrying the market count */}
          <div className="relative overflow-hidden rounded-[1.5rem] border border-white/10 md:col-span-2">
            <ImageReveal variant="clip-side" parallax={12} className="absolute inset-0">
              <Image src="/images/presence-port.jpg" alt="" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
            </ImageReveal>
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/40 to-transparent" />
            <div className="relative flex h-full min-h-[12rem] flex-col justify-end p-6 lg:p-7">
              <StatFigure value={countries.value} suffix={countries.suffix} locale={locale} className="text-5xl text-white" />
              <p className="mt-2 text-sm text-white/75">{countries.label}</p>
            </div>
          </div>

          <StatTile className={tile} value={energy.value} suffix={energy.suffix} label={energy.label} locale={locale} />
          <div className={cn(tile, "flex flex-col justify-end")}>
            <dl className="flex flex-col divide-y divide-white/10">
              {[professionals, factories].map((stat) => (
                <div key={stat.label} className="flex items-baseline justify-between gap-3 py-3 first:pt-0 last:pb-0">
                  <dt className="order-2 text-end text-sm text-white/65">{stat.label}</dt>
                  <dd className="order-1">
                    <StatFigure value={stat.value} suffix={stat.suffix} locale={locale} className="text-3xl text-white" />
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Certifications */}
          <div className={cn(tile, "flex flex-col justify-center md:col-span-2")}>
            <Reveal
              as="ul"
              stagger
              aria-label={d.home.trust.certificationsLabel}
              className="flex flex-wrap items-center gap-x-6 gap-y-3"
            >
              <li className="flex items-center gap-2 text-2xs font-semibold uppercase tracking-[0.18em] text-glacier-300">
                <Icon name="shield" size={16} />
                {d.home.trust.certificationsLabel}
              </li>
              {certifications.map((cert) => (
                <li key={cert.id} className="ltr-inline text-sm text-white/80">
                  {cert.standard}
                </li>
              ))}
            </Reveal>
          </div>
        </div>
      </Shell>
    </section>
  );
}

function StatTile({
  className,
  value,
  suffix,
  label,
  locale,
}: {
  className: string;
  value: number;
  suffix: string;
  label: string;
  locale: Locale;
}) {
  return (
    <div className={cn(className, "flex flex-col justify-end")}>
      <StatFigure value={value} suffix={suffix} locale={locale} className="text-5xl text-white" />
      <p className="mt-3 text-sm text-white/70">{label}</p>
    </div>
  );
}
