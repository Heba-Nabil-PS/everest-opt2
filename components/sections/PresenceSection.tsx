import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { Section, SectionHeading, Shell } from "@/components/ui/Section";
import { WorldMap } from "@/components/art/WorldMap";
import { markets, marketsByStatus } from "@/lib/data/markets";
import { localePath, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n";

export function PresenceSection({
  locale,
  dictionary: d,
}: {
  locale: Locale;
  dictionary: Dictionary;
}) {
  const groups = [
    { label: d.home.presence.establishedLabel, items: marketsByStatus("established"), dot: "bg-glacier-400" },
    { label: d.home.presence.growthLabel, items: marketsByStatus("growth"), dot: "bg-glacier-200" },
    { label: d.home.presence.futureLabel, items: marketsByStatus("future"), dot: "border border-dashed border-white/60" },
  ];

  return (
    <Section ground="deep" aria-labelledby="presence-heading" className="overflow-hidden">
      <div aria-hidden="true" className="absolute -end-40 top-1/4 -z-10 h-[32rem] w-[32rem] rounded-full bg-glacier-500/15 blur-3xl" />
      <Shell>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.9fr] lg:items-center">
          <div>
            <SectionHeading
              id="presence-heading"
              eyebrow={d.home.presence.eyebrow}
              title={d.home.presence.heading}
              intro={d.home.presence.body}
              inverse
            />

            <Reveal as="dl" stagger className="mt-10 grid gap-3">
              {groups.map((group) => (
                <div key={group.label} className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
                  <dt className="flex items-center gap-2 text-2xs font-semibold uppercase tracking-[0.16em] text-glacier-300">
                    <span aria-hidden="true" className={`inline-block h-2.5 w-2.5 rounded-full ${group.dot}`} />
                    {group.label}
                  </dt>
                  <dd className="mt-1 text-sm text-white">
                    {group.items.map((market) => market.name[locale]).join(" · ")}
                  </dd>
                </div>
              ))}
            </Reveal>

            <ButtonLink href={localePath(locale, "/distributors")} className="mt-8" icon="arrowRight">
              {d.home.presence.cta}
            </ButtonLink>
          </div>

          <Reveal animation="scale-in" className="rounded-3xl border border-white/10 bg-navy-950/40 p-4 shadow-2xl lg:p-6">
            <WorldMap
              markets={markets}
              locale={locale}
              labelledBy="presence-heading"
              statusLabels={d.presence.statusLabels}
            />
          </Reveal>
        </div>
      </Shell>
    </Section>
  );
}
