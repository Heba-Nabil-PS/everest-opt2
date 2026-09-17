import Image from "next/image";
import { Counter } from "@/components/motion/Counter";
import { Reveal } from "@/components/motion/Reveal";
import { TextReveal } from "@/components/motion/TextReveal";
import { ImageReveal } from "@/components/motion/ImageReveal";
import { Glow } from "@/components/ui/Aurora";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Eyebrow, Shell } from "@/components/ui/Section";
import { certifications } from "@/lib/data/site";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n";

/**
 * Who Everest is, as a bento of frosted tiles: the statement lights up word by
 * word in the large tile, the audited figures count up in the small ones, a
 * factory photograph carries the market count, and the certifications close
 * the grid. Every figure comes from the dictionary.
 */
export function ProofBento({ locale, dictionary: d }: { locale: Locale; dictionary: Dictionary }) {
  const [years, coolers, countries, energy] = d.home.trust.stats;
  const [professionals, , , factories] = d.home.discover.stats;

  const tile = "glass-panel glass-spot glass-hover rounded-[1.75rem] p-6 lg:p-8";

  return (
    <section aria-labelledby="proof-heading" className="relative py-12 lg:py-16">
      <Shell>
        <div className="grid auto-rows-[minmax(10.5rem,auto)] gap-4 md:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {/* Statement */}
          <Reveal className={cn(tile, "relative flex flex-col justify-between gap-10 md:col-span-2 lg:row-span-2")}>
            <Glow className="-start-20 -top-20 h-64 w-64" />
            <div className="flex flex-col gap-3">
              <Eyebrow inverse>{d.home.discover.eyebrow}</Eyebrow>
              <h2 id="proof-heading" className="text-sm font-semibold text-white/60">
                {d.home.trust.heading}
              </h2>
            </div>
            <TextReveal
              as="p"
              variant="scrub"
              className="font-display text-2xl font-bold leading-[1.2] tracking-[-0.01em] text-white sm:text-3xl xl:text-[2.6rem]"
            >
              {d.home.discover.body}
            </TextReveal>
          </Reveal>

          <StatTile className={tile} icon="calendar" value={years.value} suffix={years.suffix} label={years.label} detail={years.detail} locale={locale} />
          <StatTile className={tile} icon="box" value={coolers.value} suffix={coolers.suffix} label={coolers.label} detail={coolers.detail} locale={locale} accent />

          {/* Photograph carrying the market count */}
          <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 md:col-span-2">
            <ImageReveal variant="clip-side" parallax={12} className="absolute inset-0">
              <Image src="/images/about-factory.jpg" alt="" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
            </ImageReveal>
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/40 to-transparent" />
            <div className="relative flex h-full min-h-[14rem] items-end justify-between gap-4 p-6 lg:p-8">
              <div>
                <p className="font-display text-6xl font-bold leading-none text-white lg:text-7xl">
                  <Counter value={countries.value} locale={locale} />
                </p>
                <p className="mt-2 font-semibold text-white">{countries.label}</p>
                <p className="text-sm text-white/65">{countries.detail}</p>
              </div>
              <span className="glass-chip grid h-12 w-12 shrink-0 place-items-center rounded-full text-glacier-300">
                <Icon name="globe" size={24} />
              </span>
            </div>
          </div>

          <StatTile className={tile} icon="bolt" value={energy.value} suffix={energy.suffix} label={energy.label} detail={energy.detail} locale={locale} accent />
          <div className={cn(tile, "flex flex-col justify-between gap-6")}>
            <span className="glass-chip grid h-11 w-11 place-items-center rounded-full text-glacier-300">
              <Icon name="users" size={20} />
            </span>
            <dl className="flex flex-col divide-y divide-white/10">
              {[professionals, factories].map((stat) => (
                <div key={stat.label} className="flex items-baseline justify-between gap-3 py-3 first:pt-0 last:pb-0">
                  <dt className="order-2 text-end text-sm text-white/65">{stat.label}</dt>
                  <dd className="order-1 font-display text-4xl font-bold leading-none text-white">
                    <Counter value={stat.value} locale={locale} />
                    {stat.suffix ? <span className="text-aurora text-[0.6em]">{stat.suffix}</span> : null}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Certifications */}
          <div className={cn(tile, "flex flex-col justify-between gap-6 md:col-span-2")}>
            <div className="flex items-start gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-glacier-400 to-[#7c5cff] text-navy-950">
                <Icon name="shield" size={20} />
              </span>
              <p className="max-w-[46ch] text-sm text-white/70">{d.home.trust.intro}</p>
            </div>
            <Reveal as="ul" stagger aria-label={d.home.trust.certificationsLabel} className="flex flex-wrap gap-2">
              {certifications.map((cert) => (
                <li key={cert.id} className="glass-chip inline-flex items-center gap-2 rounded-full py-1.5 pe-4 ps-1.5 text-sm">
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-white/10 text-glacier-300">
                    <Icon name="check" size={16} />
                  </span>
                  <span className="ltr-inline font-semibold text-white">{cert.standard}</span>
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
  icon,
  value,
  suffix,
  label,
  detail,
  locale,
  accent,
}: {
  className: string;
  icon: IconName;
  value: number;
  suffix: string;
  label: string;
  detail: string;
  locale: Locale;
  accent?: boolean;
}) {
  return (
    <div className={cn(className, "flex flex-col justify-between gap-6")}>
      <span
        className={cn(
          "grid h-11 w-11 place-items-center rounded-full",
          accent ? "bg-gradient-to-br from-glacier-400 to-[#7c5cff] text-navy-950" : "glass-chip text-glacier-300",
        )}
      >
        <Icon name={icon} size={20} />
      </span>
      <div className="flex flex-col-reverse">
        <p className="mt-1 text-sm text-white/60">{detail}</p>
        <p className="mt-3 font-semibold text-white">{label}</p>
        <p className="font-display text-5xl font-bold leading-none text-white lg:text-6xl">
          <Counter value={value} locale={locale} />
          {suffix ? <span className="text-aurora ms-0.5 align-top text-[0.55em]">{suffix}</span> : null}
        </p>
      </div>
    </div>
  );
}
