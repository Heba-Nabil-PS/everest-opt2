import { Reveal } from "@/components/motion/Reveal";
import { ScrollDrawLine } from "@/components/motion/ScrollDraw";
import { ButtonLink } from "@/components/ui/Button";
import { Glow } from "@/components/ui/Aurora";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading, Shell } from "@/components/ui/Section";
import { localePath, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * The commitments as dated stops on a glass track: the connecting line draws
 * itself as the section scrolls in, the audited year reads as reached and the
 * rest as targets, and the three headline figures close the section.
 */
export function SustainabilityTrack({
  locale,
  dictionary: d,
}: {
  locale: Locale;
  dictionary: Dictionary;
}) {
  const s = d.home.sustainability;

  return (
    <section aria-labelledby="sustainability-heading" className="relative isolate overflow-hidden py-12 lg:py-16">
      <Shell>
        <SectionHeading
          id="sustainability-heading"
          eyebrow={s.eyebrow}
          title={s.heading}
          intro={s.body}
          size="display"
          inverse
        />

        <div className="relative mt-10">
          <Glow className="-start-16 -top-10 h-80 w-80" />
          <Glow tone="indigo" className="-end-16 bottom-0 h-72 w-72" />

          {/* Dated track — the line draws as you scroll */}
          <div className="relative">
            <span
              aria-hidden="true"
              className="absolute start-[1.375rem] top-6 bottom-6 w-px bg-white/15 lg:start-0 lg:end-0 lg:top-[1.375rem] lg:bottom-auto lg:h-px lg:w-auto"
            />
            <ScrollDrawLine
              className="absolute start-[1.375rem] top-6 bottom-6 w-px bg-gradient-to-b from-glacier-300 to-glacier-500 lg:start-0 lg:end-0 lg:top-[1.375rem] lg:bottom-auto lg:h-px lg:w-auto lg:bg-gradient-to-r"
            />

            <Reveal as="ol" stagger className="flex flex-col gap-4 lg:grid lg:grid-cols-3 lg:gap-6">
              {s.milestones.map((milestone) => {
                const done = milestone.state === "done";
                return (
                  <li key={milestone.year} className="relative flex items-center gap-5 lg:flex-col lg:items-start lg:gap-0">
                    <span className="relative grid h-11 w-11 shrink-0 place-items-center">
                      {done ? (
                        <span aria-hidden="true" className="absolute inset-0 animate-ping rounded-full bg-glacier-400/25" />
                      ) : null}
                      <span
                        className={cn(
                          "relative grid h-11 w-11 place-items-center rounded-full",
                          done
                            ? "bg-glacier-400 text-navy-950 shadow-[0_8px_30px_-8px_rgb(44_186_226/0.8)]"
                            : "glass-chip border-dashed text-glacier-300",
                        )}
                      >
                        <Icon name={done ? "check" : "leaf"} size={20} />
                      </span>
                    </span>

                    <span className="glass-panel glass-spot flex flex-1 flex-col gap-1 rounded-2xl p-5 transition-transform duration-300 hover:-translate-y-1 lg:mt-6 lg:w-full">
                      <span
                        className={cn(
                          "tabular font-display text-3xl font-bold",
                          done ? "text-glacier-300" : "text-white",
                        )}
                      >
                        {milestone.year}
                      </span>
                      <span className="text-sm text-white/75">{milestone.label}</span>
                    </span>
                  </li>
                );
              })}
            </Reveal>
          </div>

          <Reveal as="dl" stagger className="mt-6 grid gap-4 sm:grid-cols-3">
            {s.facts.map((fact) => (
              <div key={fact.label} className="glass-panel flex flex-col-reverse rounded-2xl p-6">
                <dt className="mt-2 text-sm text-white/70">{fact.label}</dt>
                <dd className="ltr-inline font-display text-4xl font-bold text-aurora">{fact.value}</dd>
              </div>
            ))}
          </Reveal>
        </div>

        <ButtonLink href={localePath(locale, "/sustainability")} className="mt-10" icon="arrowRight" variant="glass">
          {s.cta}
        </ButtonLink>
      </Shell>
    </section>
  );
}
