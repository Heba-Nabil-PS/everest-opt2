import { Reveal } from "@/components/motion/Reveal";
import { ProgressRing, ScrollDrawLine } from "@/components/motion/ScrollDraw";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Section, SectionHeading, Shell } from "@/components/ui/Section";
import { cn } from "@/lib/utils";
import { localePath, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n";

/** Ring fill per fact, in dictionary order: 45% target, R290 (≈99% lower GWP), 95–99% recyclable. */
const factRings = [45, 99, 97];

export function SustainabilitySection({
  locale,
  dictionary: d,
}: {
  locale: Locale;
  dictionary: Dictionary;
}) {
  const s = d.home.sustainability;

  return (
    <Section ground="frost" aria-labelledby="sustainability-heading" className="overflow-hidden">
      <div aria-hidden="true" className="absolute -end-24 bottom-0 -z-10 h-96 w-96 rounded-full bg-energy/10 blur-3xl" />
      <Shell>
        <div className="grid gap-14 lg:grid-cols-[1fr_1.15fr] lg:items-center">
          <div>
            <SectionHeading
              id="sustainability-heading"
              eyebrow={s.eyebrow}
              title={s.heading}
              intro={s.body}
            />
            <ButtonLink
              href={localePath(locale, "/sustainability")}
              className="mt-10"
              icon="arrowRight"
            >
              {s.cta}
            </ButtonLink>
          </div>

          <div className="flex flex-col gap-8">
            {/* Dated roadmap — the connecting line draws as you scroll */}
            <div className="relative">
              <span aria-hidden="true" className="absolute bottom-7 start-[1.3125rem] top-7 w-0.5 bg-hairline-strong" />
              <ScrollDrawLine className="absolute bottom-7 start-[1.3125rem] top-7 w-0.5 bg-gradient-to-b from-energy via-glacier-400 to-glacier-300" />

              <Reveal as="ol" stagger className="flex flex-col gap-4">
                {s.milestones.map((milestone) => {
                  const done = milestone.state === "done";
                  return (
                    <li key={milestone.year} className="relative flex items-center gap-5">
                      <span className="relative grid h-11 w-11 shrink-0 place-items-center">
                        {done ? (
                          <span aria-hidden="true" className="absolute inset-0 animate-ping rounded-full bg-energy/30" />
                        ) : null}
                        <span
                          className={cn(
                            "relative grid h-11 w-11 place-items-center rounded-full ring-4 ring-ice",
                            done ? "bg-energy text-white" : "border-2 border-dashed border-glacier-400 bg-white text-glacier-600",
                          )}
                        >
                          <Icon name={done ? "check" : "leaf"} size={20} />
                        </span>
                      </span>

                      <span className="flex flex-1 items-center gap-4 rounded-2xl border border-white bg-white/80 px-5 py-4 shadow-sm backdrop-blur transition-[transform,box-shadow] duration-300 hover:translate-x-1 hover:shadow-md rtl:hover:-translate-x-1">
                        <span className={cn("tabular font-display text-2xl font-bold", done ? "text-energy" : "text-ink-strong")}>
                          {milestone.year}
                        </span>
                        <span aria-hidden="true" className="h-8 w-px bg-hairline" />
                        <span className="text-sm text-ink">{milestone.label}</span>
                      </span>
                    </li>
                  );
                })}
              </Reveal>
            </div>

            <Reveal as="dl" stagger className="grid gap-4 sm:grid-cols-3">
              {s.facts.map((fact, index) => (
                <div
                  key={fact.label}
                  className="group flex flex-col items-center rounded-2xl border border-white bg-white/80 p-5 text-center shadow-sm backdrop-blur transition-transform duration-300 hover:-translate-y-1"
                >
                  <dt className="order-2 mt-3 text-sm text-ink-muted">{fact.label}</dt>
                  <dd className="order-1">
                    <ProgressRing value={factRings[index]} className="text-energy">
                      <span className="tabular font-display text-lg font-bold text-ink-strong">{fact.value}</span>
                    </ProgressRing>
                  </dd>
                </div>
              ))}
            </Reveal>
          </div>
        </div>
      </Shell>
    </Section>
  );
}
