import { Reveal } from "@/components/motion/Reveal";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Section, SectionHeading, Shell } from "@/components/ui/Section";
import type { Dictionary } from "@/lib/i18n";

/** One icon per narrative pillar, in the order the brief sets them out. */
const pillarIcons: IconName[] = ["globe", "shield", "gauge", "leaf"];

export function Pillars({ dictionary: d }: { dictionary: Dictionary }) {
  return (
    <Section ground="muted" aria-labelledby="pillars-heading" className="overflow-hidden">
      <div aria-hidden="true" className="absolute -start-32 top-10 -z-10 h-96 w-96 rounded-full bg-glacier-200/40 blur-3xl" />
      <Shell>
        <div className="grid gap-10 lg:grid-cols-[1fr_2fr] lg:gap-16">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <SectionHeading
              id="pillars-heading"
              eyebrow={d.home.pillars.eyebrow}
              title={d.home.pillars.heading}
              intro={d.home.pillars.intro}
            />
          </div>

          <Reveal as="ul" stagger className="grid gap-5 sm:grid-cols-2">
            {d.home.pillars.items.map((pillar, index) => (
              <li
                key={pillar.title}
                className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border border-hairline bg-surface p-7 shadow-xs transition-[transform,box-shadow,border-color] duration-500 ease-[var(--ease-out-soft)] hover:-translate-y-1.5 hover:border-glacier-300 hover:shadow-lg ${index % 2 === 1 ? "sm:translate-y-8 sm:hover:translate-y-6" : ""}`}
              >
                {/* Soft glow that blooms from the corner on hover */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -end-16 -top-16 h-48 w-48 rounded-full bg-glacier-300/0 blur-2xl transition-colors duration-500 group-hover:bg-glacier-300/35"
                />

                <div className="relative flex items-start justify-between gap-4">
                  <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-navy-600 to-navy-800 text-glacier-300 shadow-md transition-transform duration-500 ease-[var(--ease-spring)] group-hover:-rotate-6 group-hover:scale-110">
                    <Icon name={pillarIcons[index]} size={24} />
                  </span>
                  {/* Index number sits fully inside the card */}
                  <span
                    aria-hidden="true"
                    className="tabular font-display text-5xl font-bold leading-none text-transparent transition-colors duration-500 [-webkit-text-stroke:1.5px_var(--color-hairline-strong)] group-hover:[-webkit-text-stroke-color:var(--color-glacier-400)]"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <h3 className="relative mt-6 text-xl">{pillar.title}</h3>
                <p className="relative mt-3 text-ink-muted">{pillar.body}</p>

                <p className="relative mt-auto pt-6">
                  <span className="inline-flex items-center gap-2 rounded-full bg-glacier-50 px-3 py-1.5 text-sm font-semibold text-glacier-700 ring-1 ring-glacier-100">
                    <Icon name="check" size={16} />
                    {pillar.metric}
                  </span>
                </p>

                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-glacier-400 to-energy transition-transform duration-500 group-hover:scale-x-100 rtl:origin-right"
                />
              </li>
            ))}
          </Reveal>
        </div>
      </Shell>
    </Section>
  );
}
