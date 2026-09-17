import { Reveal } from "@/components/motion/Reveal";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Section, SectionHeading, Shell } from "@/components/ui/Section";
import { clientCount, clients, testimonials, type Client } from "@/lib/data/clients";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const wordmarkTone: Record<Client["tone"], string> = {
  blue: "text-[#004b93]",
  red: "text-[#c8102e]",
  navy: "text-navy-700",
};

const differentiatorIcons: IconName[] = ["wrench", "shield", "clock", "layers", "gauge", "calendar", "sparkle", "globe"];

/**
 * Social proof: client wordmarks, partner testimonials and the eight
 * differentiators the brand leads with. Wordmarks stand in for logo artwork
 * until approved files are supplied (see lib/data/clients.ts).
 */
export function ClientsSection({ locale, dictionary: d }: { locale: Locale; dictionary: Dictionary }) {
  const c = d.home.clients;
  const more = clientCount - clients.length;

  return (
    <>
      <Section aria-labelledby="clients-heading">
        <Shell>
          <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:items-center">
            <SectionHeading id="clients-heading" eyebrow={c.eyebrow} title={c.heading} intro={c.intro} />

            <Reveal as="ul" stagger className="grid grid-cols-2 gap-4">
              {clients.map((client) => (
                <li
                  key={client.name}
                  className="grid min-h-28 place-items-center rounded-2xl border border-hairline bg-surface px-6 shadow-xs transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-md"
                >
                  <span
                    dir="ltr"
                    className={cn("font-display text-2xl font-bold tracking-tight md:text-3xl", wordmarkTone[client.tone])}
                  >
                    {client.name}
                  </span>
                </li>
              ))}
              <li className="grid min-h-28 place-items-center rounded-2xl bg-deep px-6 text-center text-white">
                <span>
                  <span className="ltr-inline block font-display text-3xl font-bold text-glacier-300">+{more}</span>
                  <span className="text-sm text-ink-inverse-muted">{c.moreLabel}</span>
                </span>
              </li>
            </Reveal>
          </div>

          <h3 className="mt-20 text-2xl">{c.testimonialsHeading}</h3>
          <Reveal as="ul" stagger className="mt-8 grid gap-6 md:grid-cols-3">
            {testimonials.map((item) => (
              <li key={item.role.en}>
                <figure className="relative flex h-full flex-col rounded-2xl border border-hairline bg-surface-muted p-7">
                  <span aria-hidden="true" className="font-display text-6xl leading-none text-glacier-400">
                    “
                  </span>
                  <blockquote className="-mt-4 flex-1 text-lg leading-relaxed text-ink-strong">
                    {item.quote[locale]}
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-3 border-t border-hairline pt-5">
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-navy-700 text-glacier-300">
                      <Icon name="users" size={20} />
                    </span>
                    <span>
                      <span className="block text-sm font-semibold text-ink-strong">{item.role[locale]}</span>
                      <span className="block text-xs text-ink-muted">{item.organisation[locale]}</span>
                    </span>
                  </figcaption>
                </figure>
              </li>
            ))}
          </Reveal>
        </Shell>
      </Section>

      <Section ground="ice" aria-labelledby="differentiators-heading">
        <Shell>
          <SectionHeading
            id="differentiators-heading"
            eyebrow={d.home.differentiators.eyebrow}
            title={d.home.differentiators.heading}
            align="center"
            className="mx-auto"
          />
          <Reveal as="ul" stagger className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {d.home.differentiators.items.map((item, index) => (
              <li
                key={item.title}
                className="group flex h-full flex-col gap-3 rounded-2xl bg-surface p-6 shadow-xs ring-1 ring-hairline transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-glacier-100 text-glacier-700 transition-colors group-hover:bg-glacier-400 group-hover:text-navy-900">
                  <Icon name={differentiatorIcons[index % differentiatorIcons.length]} size={20} />
                </span>
                <h3 className="text-base">{item.title}</h3>
                <p className="text-sm text-ink-muted">{item.body}</p>
              </li>
            ))}
          </Reveal>
        </Shell>
      </Section>
    </>
  );
}
