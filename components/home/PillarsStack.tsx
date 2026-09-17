import { Glow } from "@/components/ui/Aurora";
import { Icon, type IconName } from "@/components/ui/Icon";
import { SectionHeading, Shell } from "@/components/ui/Section";
import type { Dictionary } from "@/lib/i18n";

const icons: IconName[] = ["globe", "shield", "gauge", "leaf"];

/**
 * The four renewal reasons as a deck of glass cards. On desktop each card is
 * sticky a little lower than the last, so scrolling deals them onto a pile —
 * pure CSS `position: sticky`, no scroll listeners. On phones they simply
 * stack in the flow.
 */
export function PillarsStack({ dictionary: d }: { dictionary: Dictionary }) {
  const p = d.home.pillars;

  return (
    <section aria-labelledby="pillars-heading" className="relative py-12 lg:py-16">
      <Shell className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] lg:gap-20">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SectionHeading id="pillars-heading" eyebrow={p.eyebrow} title={p.heading} intro={p.intro} size="display" inverse />
        </div>

        <ol className="flex flex-col gap-6 lg:gap-0">
          {p.items.map((pillar, index) => (
            <li
              key={pillar.title}
              className="lg:sticky lg:pb-10"
              style={{ top: `calc(8rem + ${index * 1.75}rem)` }}
            >
              <article className="glass-panel-strong glass-spot relative overflow-hidden rounded-[2rem] p-7 lg:min-h-[22rem] lg:p-10">
                <Glow tone={index % 2 ? "violet" : "cyan"} className="-end-24 -top-24 h-72 w-72 opacity-70" />
                <div className="flex items-start justify-between gap-6">
                  <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-glacier-400 to-[#7c5cff] text-navy-950 shadow-[0_12px_40px_-12px_rgb(44_186_226/0.8)]">
                    <Icon name={icons[index]} size={24} />
                  </span>
                  <span
                    aria-hidden="true"
                    className="tabular font-display text-7xl font-bold leading-none text-transparent [-webkit-text-stroke:1.5px_rgb(255_255_255/0.22)] lg:text-8xl"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-8 text-2xl lg:text-3xl">{pillar.title}</h3>
                <p className="mt-4 max-w-[52ch] text-white/70 lg:text-lg">{pillar.body}</p>
                <p className="glass-chip mt-8 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-glacier-200">
                  <Icon name="check" size={16} />
                  {pillar.metric}
                </p>
              </article>
            </li>
          ))}
        </ol>
      </Shell>
    </section>
  );
}
