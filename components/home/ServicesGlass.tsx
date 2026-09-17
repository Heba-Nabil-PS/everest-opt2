import { ButtonLink } from "@/components/ui/Button";
import { PhotoBackdrop } from "@/components/ui/PhotoBackdrop";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading, Shell } from "@/components/ui/Section";
import { localePath, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n";
import { ServicesPanels } from "./ServicesPanels";

const anchors = ["warranty", "scheduled-maintenance", "upgrade-and-retrofit", "regional-technical-support"];

/** After-sales: expanding service panels, then contracted response times as glass chips. */
export function ServicesGlass({ locale, dictionary: d }: { locale: Locale; dictionary: Dictionary }) {
  const path = (p: string) => localePath(locale, p);
  const s = d.home.services;

  return (
    <section aria-labelledby="services-heading" className="relative isolate overflow-hidden py-12 lg:py-16">
      {/* The service network on the ground, behind the panels that describe it. */}
      <PhotoBackdrop
        src="/images/gallery-assembly.jpg"
        tone="hero"
        className="opacity-55 [mask-image:linear-gradient(to_bottom,transparent,#000_20%,#000_70%,transparent)]"
      />

      <Shell>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading id="services-heading" eyebrow={s.eyebrow} title={s.heading} intro={s.body} inverse />
          <div className="flex shrink-0 flex-wrap gap-3">
            <ButtonLink href={path("/services#request-service")} size="lg" icon="arrowRight">
              {s.cta}
            </ButtonLink>
            <ButtonLink href={path("/services")} size="lg" variant="glass">
              {d.nav.services}
            </ButtonLink>
          </div>
        </div>

        <div className="mt-10">
          <ServicesPanels
            items={s.items.map((item, index) => ({
              title: item.title,
              body: item.body,
              href: path(`/services#${anchors[index]}`),
            }))}
          />
        </div>

        <ul className="mt-5 flex flex-wrap gap-3">
          {d.services.coverage.tiers.map((tier) => (
            <li key={tier.region} className="glass-chip inline-flex items-center gap-3 rounded-full py-2 pe-5 ps-2">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-glacier-300">
                <Icon name="clock" size={16} />
              </span>
              <span className="text-sm">
                <span className="font-semibold text-white">{tier.region}</span>
                <span className="text-white/60"> · {tier.response}</span>
              </span>
            </li>
          ))}
        </ul>
      </Shell>
    </section>
  );
}
