import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { ImageReveal } from "@/components/motion/ImageReveal";
import { ButtonLink } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Section, SectionHeading, Shell } from "@/components/ui/Section";
import { localePath, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n";

const serviceIcons: IconName[] = ["shield", "calendar", "wrench", "users"];
const serviceAnchors = ["warranty", "scheduled-maintenance", "upgrade-and-retrofit", "regional-technical-support"];

/**
 * Aftercare on the homepage: a technician photograph carrying the warranty
 * facts, the four service lines, and the contracted response times by region.
 */
export function ServicesSection({
  locale,
  dictionary: d,
}: {
  locale: Locale;
  dictionary: Dictionary;
}) {
  const path = (p: string) => localePath(locale, p);

  return (
    <Section ground="muted" aria-labelledby="services-heading">
      <Shell className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        {/* Photo with the warranty terms pinned on top */}
        <div className="relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-xl sm:aspect-[5/4] lg:aspect-[4/5]">
            {/* A navy curtain lifts off the photograph, which keeps drifting. */}
            <ImageReveal variant="curtain" parallax={14} className="absolute inset-0">
              <Image
                src="/images/services-technician.jpg"
                alt=""
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
            </ImageReveal>
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-navy-950/10 to-transparent" />

            <Reveal as="dl" stagger delay={0.5} className="absolute inset-x-5 bottom-5 grid grid-cols-2 gap-3 sm:inset-x-6 sm:bottom-6">
              {[
                { value: "12", label: d.services.items[0].points[0] },
                { value: "60", label: d.services.items[0].points[1] },
              ].map((fact) => (
                <div key={fact.label} className="glass-dark rounded-2xl p-4">
                  <dd className="tabular font-display text-3xl font-bold text-white">
                    {fact.value}
                    <span className="ms-1 text-sm font-medium text-glacier-300">
                      {locale === "ar" ? "شهراً" : "mo"}
                    </span>
                  </dd>
                  <dt className="mt-1 text-xs text-white/75">{fact.label}</dt>
                </div>
              ))}
            </Reveal>
          </div>
        </div>

        <div>
          <SectionHeading
            id="services-heading"
            eyebrow={d.home.services.eyebrow}
            title={d.home.services.heading}
            intro={d.home.services.body}
          />

          <Reveal as="ul" stagger className="mt-8 flex flex-col divide-y divide-hairline border-y border-hairline">
            {d.home.services.items.map((item, index) => (
              <li key={item.title}>
                <Link
                  href={path(`/services#${serviceAnchors[index]}`)}
                  className="group flex items-start gap-4 py-5 no-underline"
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-navy-700 text-glacier-300 transition-colors group-hover:bg-glacier-400 group-hover:text-navy-900">
                    <Icon name={serviceIcons[index]} size={20} />
                  </span>
                  <span className="flex-1">
                    <span className="block font-display text-lg font-semibold text-ink-strong group-hover:text-glacier-600">
                      {item.title}
                    </span>
                    <span className="mt-1 block text-sm text-ink-muted">{item.body}</span>
                  </span>
                  <Icon
                    name="arrowRight"
                    size={20}
                    className="mt-3 text-ink-muted transition-transform group-hover:translate-x-1 group-hover:text-glacier-600 rtl:-scale-x-100 rtl:group-hover:-translate-x-1"
                  />
                </Link>
              </li>
            ))}
          </Reveal>

          {/* Contracted response times */}
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {d.services.coverage.tiers.slice(0, 2).map((tier) => (
              <li key={tier.region} className="flex items-center gap-3 rounded-xl bg-surface p-3.5 shadow-xs">
                <Icon name="clock" size={20} className="text-glacier-600" />
                <span className="text-sm">
                  <span className="block font-semibold text-ink-strong">{tier.region}</span>
                  <span className="text-ink-muted">{tier.response}</span>
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href={path("/services#request-service")} icon="arrowRight">
              {d.home.services.cta}
            </ButtonLink>
            <ButtonLink href={path("/services")} variant="ghost">
              {d.nav.services}
            </ButtonLink>
          </div>
        </div>
      </Shell>
    </Section>
  );
}
