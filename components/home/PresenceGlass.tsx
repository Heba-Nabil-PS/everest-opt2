import { WorldMap } from "@/components/art/WorldMap";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { Glow } from "@/components/ui/Aurora";
import { SectionHeading, Shell } from "@/components/ui/Section";
import { markets, marketsByStatus } from "@/lib/data/markets";
import { cn } from "@/lib/utils";
import { localePath, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n";

/**
 * Markets as a full-width glass map console, with the three market tiers as
 * frosted cards beneath the map.
 */
export function PresenceGlass({ locale, dictionary: d }: { locale: Locale; dictionary: Dictionary }) {
  const p = d.home.presence;
  const groups = [
    { label: p.establishedLabel, items: marketsByStatus("established"), dot: "bg-glacier-400 shadow-[0_0_12px_rgb(44_186_226/0.9)]" },
    { label: p.growthLabel, items: marketsByStatus("growth"), dot: "bg-glacier-200" },
    { label: p.futureLabel, items: marketsByStatus("future"), dot: "border border-dashed border-white/70" },
  ];

  return (
    <section aria-labelledby="presence-heading" className="relative py-12 lg:py-16">
      <Shell>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading id="presence-heading" eyebrow={p.eyebrow} title={p.heading} intro={p.body} inverse />
          <ButtonLink href={localePath(locale, "/distributors")} size="lg" icon="arrowRight" className="shrink-0 self-start lg:self-end">
            {p.cta}
          </ButtonLink>
        </div>

        <div className="glass-panel-strong relative mt-10 overflow-hidden rounded-[2rem] p-4 lg:p-8">
          <Glow className="-end-32 -top-32 h-96 w-96" />
          <Glow tone="violet" className="-bottom-32 -start-24 h-80 w-80" />
          <Reveal animation="scale-in">
            <WorldMap markets={markets} locale={locale} labelledBy="presence-heading" statusLabels={d.presence.statusLabels} />
          </Reveal>

          <Reveal as="dl" stagger className="relative mt-6 grid gap-3 md:grid-cols-3">
            {groups.map((group) => (
              <div key={group.label} className="glass-panel glass-hover rounded-[1.25rem] px-5 py-4">
                <dt className="flex items-center justify-between gap-2 text-2xs font-semibold uppercase tracking-[0.16em] text-glacier-300">
                  <span className="flex items-center gap-2">
                    <span aria-hidden="true" className={cn("inline-block h-2.5 w-2.5 rounded-full", group.dot)} />
                    {group.label}
                  </span>
                  <span className="tabular text-white/50">{group.items.length}</span>
                </dt>
                <dd className="mt-2 text-sm text-white/85">{group.items.map((market) => market.name[locale]).join(" · ")}</dd>
              </div>
            ))}
          </Reveal>
        </div>
      </Shell>
    </section>
  );
}
