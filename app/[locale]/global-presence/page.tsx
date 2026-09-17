import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/sections/PageHero";
import { Eyebrow, Section, SectionHeading, Shell } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Reveal } from "@/components/motion/Reveal";
import { Counter } from "@/components/motion/Counter";
import { WorldMap } from "@/components/art/WorldMap";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { factories, markets, marketsByStatus } from "@/lib/data/markets";
import type { FactoryStatus } from "@/lib/data/types";
import { site } from "@/lib/data/site";
import { getDictionary } from "@/lib/i18n";
import { localePath, type Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

/** One icon per headline figure, in dictionary order. */
const statIcons: IconName[] = ["globe", "factory", "box", "gauge", "users", "star"];

/** Site photography per factory card, in data order (UAE, Egypt, KSA, Sri Lanka, India, Syria). */
const factoryImages = [
  "/images/hero-factory.jpg",
  "/images/gallery-assembly.jpg",
  "/images/gallery-welding.jpg",
  "/images/gallery-warehouse.jpg",
  "/images/about-factory.jpg",
  "/images/gallery-robotics.jpg",
];

const conditionIcons: IconName[] = ["temperature", "users", "bolt"];

const factoryTone: Record<FactoryStatus, { pill: string; dot: string }> = {
  operational: { pill: "bg-energy text-white", dot: "bg-[#4ade80]" },
  expanding: { pill: "bg-glacier-400 text-navy-900", dot: "bg-white" },
  new: { pill: "bg-white text-navy-800", dot: "bg-glacier-400" },
  planned: { pill: "border border-white/50 bg-navy-950/40 text-white backdrop-blur-sm", dot: "bg-white/60" },
};

export async function generateMetadata(
  props: PageProps<"/[locale]/global-presence">,
): Promise<Metadata> {
  const { locale } = await props.params;
  const d = getDictionary(locale);
  return {
    title: d.presence.meta.title,
    description: d.presence.meta.description,
    alternates: { canonical: `/${locale}/global-presence` },
  };
}

export default async function PresencePage(props: PageProps<"/[locale]/global-presence">) {
  const { locale } = await props.params;
  const typedLocale = locale as Locale;
  const d = getDictionary(locale);
  const p = d.presence;
  const path = (href: string) => localePath(typedLocale, href);

  const groups = [
    { key: "established", label: p.statusLabels.established, items: marketsByStatus("established") },
    { key: "growth", label: p.statusLabels.growth, items: marketsByStatus("growth") },
    { key: "future", label: p.statusLabels.future, items: marketsByStatus("future") },
  ] as const;

  const hq = markets.find((market) => market.country === "AE");
  const regional = markets.filter((market) => market.contact && market.country !== "AE");

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: d.common.home, url: `${site.url}${path("/")}` },
          { name: d.nav.presence, url: `${site.url}${path("/global-presence")}` },
        ]}
      />

      <PageHero
        image="/images/presence-port.jpg"
        eyebrow={p.hero.eyebrow}
        title={p.hero.headline}
        subline={p.hero.subline}
        crumbLabel={d.a11y.breadcrumb}
        crumbs={[{ label: d.common.home, href: path("/") }, { label: d.nav.presence }]}
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="#footprint" icon="arrowRight">
            {p.footprint.eyebrow}
          </ButtonLink>
          <ButtonLink href={path("/distributors")} variant="inverse">
            {p.cta.primary}
          </ButtonLink>
        </div>
        {/* Room for the stats panel that overlaps the bottom of the hero. */}
        <div aria-hidden="true" className="h-16 lg:h-20" />
      </PageHero>

      {/* Group at a glance — a floating panel that bridges hero and map */}
      <section aria-label={p.hero.eyebrow} className="relative z-10 -mb-28 -mt-20 lg:-mt-24">
        <Shell>
          <div className="relative isolate overflow-hidden rounded-3xl bg-surface shadow-2xl ring-1 ring-hairline">
            <div aria-hidden="true" className="bg-grid pointer-events-none absolute inset-0 -z-10 opacity-50" />
            <Reveal as="dl" stagger className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
              {p.stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className="group relative flex flex-col-reverse gap-1 p-5 transition-colors duration-300 hover:bg-ice/70 lg:p-7"
                >
                  <dt className="text-xs leading-snug text-ink-muted lg:text-sm">{stat.label}</dt>
                  <dd className="font-display text-3xl font-bold leading-none lg:text-4xl">
                    <span className="bg-gradient-to-br from-navy-700 to-glacier-500 bg-clip-text text-transparent">
                      <Counter value={stat.value} suffix={stat.suffix} locale={typedLocale} />
                    </span>
                  </dd>
                  <span className="mb-3 grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-glacier-400 to-steel text-white shadow-[0_8px_18px_-8px_rgb(44_186_226/0.7)] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:rotate-6">
                    <Icon name={statIcons[index % statIcons.length]} size={20} />
                  </span>
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-glacier-400 to-steel transition-transform duration-500 group-hover:scale-x-100 rtl:origin-right"
                  />
                </div>
              ))}
            </Reveal>
          </div>
        </Shell>
      </section>

      {/* Map */}
      <Section ground="deep" aria-labelledby="map-heading" className="overflow-hidden pt-40 lg:pt-44">
        <div aria-hidden="true" className="absolute -start-40 top-1/3 -z-10 h-[36rem] w-[36rem] rounded-full bg-glacier-500/15 blur-3xl" />
        <div aria-hidden="true" className="absolute -end-40 bottom-0 -z-10 h-[28rem] w-[28rem] rounded-full bg-steel/25 blur-3xl" />
        <Shell>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading id="map-heading" eyebrow={p.hero.eyebrow} title={p.mapHeading} intro={p.mapNote} inverse />

            {/* Legend with counts — the list equivalent of the map */}
            <dl className="flex flex-wrap gap-2 lg:justify-end">
              {groups.map((group) => (
                <div
                  key={group.key}
                  className="flex items-center gap-3 rounded-2xl border border-white/12 bg-white/[0.05] px-4 py-3 backdrop-blur-sm"
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "h-3 w-3 rounded-full",
                      group.key === "established" && "bg-glacier-400 shadow-[0_0_12px_rgb(44_186_226/0.9)]",
                      group.key === "growth" && "bg-glacier-200",
                      group.key === "future" && "border border-dashed border-white/70",
                    )}
                  />
                  <dt className="text-sm text-white/80">{group.label}</dt>
                  <dd className="ltr-inline rounded-full bg-white/10 px-2 py-0.5 font-display text-sm font-semibold text-white">
                    {group.items.length}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="mt-10 rounded-3xl border border-white/12 bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-4 shadow-2xl lg:p-8">
            <WorldMap
              markets={markets}
              locale={typedLocale}
              labelledBy="map-heading"
              statusLabels={p.statusLabels}
              factoryLabels={p.footprint.statusLabels}
            />
          </div>
        </Shell>
      </Section>

      {/* Manufacturing footprint */}
      <Section id="footprint" aria-labelledby="footprint-heading" className="scroll-mt-28">
        <Shell>
          <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-end">
            <SectionHeading id="footprint-heading" eyebrow={p.footprint.eyebrow} title={p.footprint.heading} />
            <p className="max-w-[52ch] text-lg text-ink-muted">{p.footprint.intro}</p>
          </div>

          <Reveal as="ul" stagger className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {factories.map((market, index) => {
              const factory = market.factory!;
              const planned = factory.status === "planned";
              const tone = factoryTone[factory.status];
              /* The flagship and the planned site run wide so the grid closes evenly. */
              const wide = index === 0 || (planned && index === factories.length - 1);
              return (
                <li
                  key={market.country}
                  className={cn(
                    "group relative flex h-full flex-col overflow-hidden rounded-3xl bg-surface shadow-sm ring-1 ring-hairline transition-[transform,box-shadow] duration-500 ease-[var(--ease-out-soft)] hover:-translate-y-1.5 hover:shadow-xl",
                    wide && "lg:flex-row",
                    index === 0 && "lg:col-span-2",
                    wide && index !== 0 && "sm:col-span-2 lg:col-span-3",
                  )}
                >
                  <div
                    className={cn(
                      "relative h-52 shrink-0 overflow-hidden",
                      wide && "lg:h-auto lg:min-h-56",
                      index === 0 ? "lg:w-1/2" : wide && "lg:w-1/3",
                    )}
                  >
                    <Image
                      src={factoryImages[index % factoryImages.length]}
                      alt=""
                      fill
                      sizes={index === 0 ? "(min-width: 1024px) 33vw, 100vw" : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"}
                      className={cn(
                        "object-cover transition-transform duration-700 ease-[var(--ease-out-soft)] group-hover:scale-105",
                        planned && "grayscale",
                      )}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-navy-950/25 to-transparent" />

                    <span
                      className={cn(
                        "absolute start-4 top-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-2xs font-semibold uppercase tracking-[0.12em]",
                        tone.pill,
                      )}
                    >
                      <span aria-hidden="true" className={cn("h-1.5 w-1.5 rounded-full", tone.dot, !planned && "animate-pulse")} />
                      {p.footprint.statusLabels[factory.status]}
                    </span>

                    <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3">
                      <h3 className="text-2xl text-white">{market.name[typedLocale]}</h3>
                      <span className="ltr-inline rounded-md bg-white/15 px-2 py-0.5 font-mono text-xs font-semibold text-white backdrop-blur-sm">
                        {market.country}
                      </span>
                    </div>
                  </div>

                  <div className={cn("flex flex-1 flex-col gap-3 p-6", wide && "lg:justify-center lg:p-10")}>
                    <p className="flex items-center gap-2 text-sm font-semibold text-glacier-700">
                      <Icon name="factory" size={16} />
                      {factory.role[typedLocale]}
                    </p>
                    <p className={cn("text-sm text-ink-muted", index === 0 && "lg:text-base")}>{factory.note[typedLocale]}</p>

                    {factory.figure ? (
                      <p className="mt-auto flex items-baseline gap-2 pt-4">
                        <span className="ltr-inline bg-gradient-to-br from-navy-700 to-glacier-500 bg-clip-text font-display text-4xl font-bold text-transparent">
                          {factory.figure.value}
                        </span>
                        <span className="text-xs uppercase tracking-[0.12em] text-ink-muted">
                          {factory.figure.label[typedLocale]}
                        </span>
                      </p>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </Reveal>
        </Shell>
      </Section>

      {/* Strategic partnership */}
      <Section ground="deep" aria-labelledby="partnership-heading" className="overflow-hidden">
        <div aria-hidden="true" className="bg-grid pointer-events-none absolute inset-0 -z-10 opacity-10" />
        <div aria-hidden="true" className="absolute -end-40 -top-40 -z-10 h-[34rem] w-[34rem] rounded-full bg-glacier-400/20 blur-3xl" />
        <Shell className="grid items-center gap-14 lg:grid-cols-[1.1fr_1fr]">
          <div className="flex flex-col gap-6">
            <SectionHeading
              id="partnership-heading"
              eyebrow={p.partnership.eyebrow}
              title={p.partnership.heading}
              inverse
            />
            <p className="max-w-[60ch] text-lg text-ink-inverse-muted">{p.partnership.body}</p>
            <a
              href={p.partnership.pressUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex w-fit items-center gap-3 rounded-2xl border border-white/15 bg-white/[0.06] px-5 py-3.5 text-white no-underline transition-colors hover:border-glacier-400 hover:bg-white/10"
            >
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-glacier-400 text-navy-900">
                <Icon name="document" size={20} />
              </span>
              <span className="flex flex-col">
                <span className="text-sm font-semibold">{p.partnership.pressLabel}</span>
                <span className="text-xs text-ink-inverse-muted">{p.partnership.pressSource}</span>
              </span>
              <Icon
                name="arrowUpRight"
                size={20}
                className="ms-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:-scale-x-100"
              />
            </a>
          </div>

          <div className="flex flex-col gap-6">
            {/* Everest × VBL lockup */}
            <div className="relative flex items-center justify-center gap-6 rounded-3xl border border-white/12 bg-white/[0.05] p-8 backdrop-blur-sm">
              <span className="grid h-28 w-28 place-items-center rounded-full bg-white p-4 shadow-xl ring-8 ring-white/10">
                <Image src="/brand/everest-logo.png" alt="Everest" width={96} height={56} className="h-auto w-full" />
              </span>
              <span aria-hidden="true" className="relative flex items-center">
                <span className="h-px w-10 bg-gradient-to-r from-transparent to-glacier-300 sm:w-16" />
                <span className="grid h-10 w-10 place-items-center rounded-full bg-glacier-400 font-display text-lg font-bold text-navy-900 shadow-[0_0_24px_rgb(44_186_226/0.7)]">
                  ×
                </span>
                <span className="h-px w-10 bg-gradient-to-l from-transparent to-glacier-300 sm:w-16" />
              </span>
              <span className="grid h-28 w-28 place-items-center rounded-full bg-gradient-to-br from-[#0b5fae] to-[#073b73] shadow-xl ring-8 ring-white/10">
                <span className="ltr-inline font-display text-3xl font-bold tracking-tight text-white">VBL</span>
              </span>
            </div>

            <Reveal as="dl" stagger className="grid gap-4 sm:grid-cols-3">
              {p.partnership.facts.map((fact) => (
                <div
                  key={fact.label}
                  className="flex flex-col-reverse gap-2 rounded-2xl border border-white/12 bg-white/[0.05] p-5 transition-colors hover:border-glacier-400/60"
                >
                  <dt className="text-xs leading-snug text-ink-inverse-muted">{fact.label}</dt>
                  <dd className="font-display text-2xl font-bold text-glacier-300">{fact.value}</dd>
                </div>
              ))}
            </Reveal>
          </div>
        </Shell>
      </Section>

      {/* Growth roadmap */}
      <Section ground="frost" aria-labelledby="roadmap-heading" className="overflow-hidden">
        <div aria-hidden="true" className="bg-grid absolute inset-0 -z-10 opacity-70" />
        <Shell>
          <SectionHeading
            id="roadmap-heading"
            eyebrow={p.roadmap.eyebrow}
            title={p.roadmap.heading}
            align="center"
            className="mx-auto"
          />

          <ol className="relative mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {p.roadmap.items.map((item, index) => {
              const ahead = index >= p.roadmap.items.length - 3;
              return (
                <li
                  key={item.title}
                  className={cn(
                    "group relative flex gap-5 rounded-3xl p-6 transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-lg",
                    ahead
                      ? "border-2 border-dashed border-glacier-300 bg-white/70"
                      : "bg-surface shadow-md ring-1 ring-hairline",
                  )}
                >
                  <span
                    className={cn(
                      "grid h-14 w-14 shrink-0 place-items-center rounded-2xl font-display text-lg font-bold",
                      ahead
                        ? "bg-glacier-100 text-glacier-700"
                        : "bg-gradient-to-br from-navy-600 to-navy-800 text-glacier-300 shadow-md",
                    )}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p
                      className={cn(
                        "inline-flex rounded-full px-2.5 py-0.5 text-2xs font-semibold uppercase tracking-[0.14em]",
                        ahead ? "bg-glacier-100 text-glacier-800" : "bg-energy-soft text-energy",
                      )}
                    >
                      {item.phase}
                    </p>
                    <h3 className="mt-2 text-lg">{item.title}</h3>
                    <p className="mt-1.5 text-sm text-ink-muted">{item.body}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </Shell>
      </Section>

      {/* Regional contacts: HQ feature + regional list */}
      <Section aria-labelledby="regional-heading">
        <Shell>
          <SectionHeading id="regional-heading" title={p.regionalHeading} intro={p.regionalIntro} />

          <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_1.4fr]">
            {hq?.contact ? (
              <div className="relative isolate flex flex-col overflow-hidden rounded-3xl bg-deep p-8 text-white shadow-xl lg:p-10">
                <div aria-hidden="true" className="absolute -end-20 -top-20 -z-10 h-72 w-72 rounded-full bg-glacier-400/25 blur-3xl" />
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-glacier-400 text-navy-900 shadow-[0_0_30px_rgb(44_186_226/0.5)]">
                  <Icon name="building" size={24} />
                </span>
                <Eyebrow inverse className="mt-6">
                  {p.hqLabel}
                </Eyebrow>
                <h3 className="mt-3 text-3xl text-white">{hq.name[typedLocale]}</h3>
                <p className="mt-2 text-ink-inverse-muted">{hq.contact.label[typedLocale]}</p>
                <p className="mt-1 text-sm text-ink-inverse-muted">
                  {site.address.line2}, {site.address.city}
                </p>

                <div className="mt-auto flex flex-col gap-3 pt-8">
                  {hq.contact.phone ? (
                    <a
                      href={`tel:${hq.contact.phone.replace(/\s/g, "")}`}
                      className="ltr-inline flex items-center gap-3 rounded-2xl bg-white/[0.07] px-4 py-3 font-medium text-white no-underline transition-colors hover:bg-white/15"
                    >
                      <Icon name="phone" size={20} className="text-glacier-300" />
                      {hq.contact.phone}
                    </a>
                  ) : null}
                  {hq.contact.email ? (
                    <a
                      href={`mailto:${hq.contact.email}`}
                      className="ltr-inline flex items-center gap-3 break-all rounded-2xl bg-white/[0.07] px-4 py-3 font-medium text-white no-underline transition-colors hover:bg-white/15"
                    >
                      <Icon name="mail" size={20} className="text-glacier-300" />
                      {hq.contact.email}
                    </a>
                  ) : null}
                </div>
              </div>
            ) : null}

            <Reveal as="ul" stagger className="grid gap-4 sm:grid-cols-2">
              {regional.map((market) => (
                <li
                  key={market.country}
                  className="group flex h-full flex-col gap-4 rounded-3xl border border-hairline bg-surface p-6 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-glacier-300 hover:shadow-lg"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="grid h-11 w-11 place-items-center rounded-xl bg-glacier-100 text-glacier-700 transition-colors group-hover:bg-glacier-400 group-hover:text-navy-900">
                      <Icon name="pin" size={20} />
                    </span>
                    <span className="ltr-inline rounded-md bg-surface-muted px-2 py-0.5 font-mono text-xs font-semibold text-ink-muted">
                      {market.country}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg">{market.name[typedLocale]}</h3>
                    <p className="mt-1 text-sm text-ink-muted">{market.contact!.label[typedLocale]}</p>
                  </div>
                  {market.contact!.email ? (
                    <a
                      href={`mailto:${market.contact!.email}`}
                      className="ltr-inline mt-auto inline-flex items-center gap-2 break-all border-t border-hairline pt-4 text-sm font-medium text-glacier-600 no-underline hover:underline"
                    >
                      <Icon name="mail" size={16} />
                      {market.contact!.email}
                    </a>
                  ) : null}
                </li>
              ))}
            </Reveal>
          </div>
        </Shell>
      </Section>

      {/* Why we build where we build + distributor CTA */}
      <Section aria-labelledby="expansion-heading" className="overflow-hidden bg-gradient-to-br from-glacier-600 via-steel to-navy-800 text-white">
        <div aria-hidden="true" className="bg-grid pointer-events-none absolute inset-0 -z-10 opacity-10" />
        <div aria-hidden="true" className="absolute -start-24 -top-24 -z-10 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        <Shell>
          <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center">
            <div>
              <Eyebrow inverse>{p.expansion.eyebrow}</Eyebrow>
              <h2 id="expansion-heading" className="mt-4 max-w-[18ch] text-4xl text-white md:text-5xl">
                {p.expansion.heading}
              </h2>
              <p className="mt-5 max-w-[58ch] text-lg text-white/85">{p.expansion.body}</p>
            </div>

            <Reveal as="ul" stagger className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              {p.expansion.points.map((point, index) => (
                <li
                  key={point.title}
                  className="flex items-center gap-4 rounded-2xl border border-white/15 bg-navy-950/25 p-5 backdrop-blur-sm"
                >
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-white text-glacier-700">
                    <Icon name={conditionIcons[index % conditionIcons.length]} size={24} />
                  </span>
                  <span>
                    <span className="block font-display text-lg font-semibold text-white">{point.title}</span>
                    <span className="block text-sm text-white/75">{point.body}</span>
                  </span>
                </li>
              ))}
            </Reveal>
          </div>

          <div className="mt-14 flex flex-col items-start justify-between gap-6 rounded-3xl bg-white p-8 text-ink shadow-2xl lg:flex-row lg:items-center lg:p-10">
            <div className="flex items-start gap-5">
              <span className="hidden h-14 w-14 shrink-0 place-items-center rounded-2xl bg-deep text-glacier-300 sm:grid">
                <Icon name="globe" size={24} />
              </span>
              <div>
                <h2 className="text-2xl md:text-3xl">{p.cta.heading}</h2>
                <p className="mt-2 max-w-[58ch] text-ink-muted">{p.cta.body}</p>
              </div>
            </div>
            <ButtonLink href={path("/distributors")} size="lg" icon="arrowRight" className="shrink-0">
              {p.cta.primary}
            </ButtonLink>
          </div>
        </Shell>
      </Section>
    </>
  );
}
