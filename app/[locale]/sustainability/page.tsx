import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/sections/PageHero";
import { Section, SectionHeading, Shell } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/ui/Icon";
import { PhotoBackdrop } from "@/components/ui/PhotoBackdrop";
import { Reveal } from "@/components/motion/Reveal";
import { Counter } from "@/components/motion/Counter";
import { RoadmapTrack } from "@/components/sections/RoadmapTrack";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { site } from "@/lib/data/site";
import { getDictionary } from "@/lib/i18n";
import { localePath, type Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

/** One photograph per reduction pillar, in dictionary order. */
const pillarImages = [
  "/images/products-chillers.jpg",
  "/images/rnd-testing.jpg",
  "/images/gallery-warehouse.jpg",
  "/images/esg-solar.jpg",
];

/* Environmental, Social, Governance — each with its own icon and gradient. */
const esgPillars: { icon: IconName; tile: string; glow: string; accent: string }[] = [
  { icon: "leaf", tile: "from-[#34c77b] to-energy", glow: "rgb(30 142 79 / 0.55)", accent: "from-[#34c77b] to-energy" },
  { icon: "users", tile: "from-glacier-400 to-glacier-600", glow: "rgb(44 186 226 / 0.55)", accent: "from-glacier-300 to-glacier-500" },
  { icon: "shield", tile: "from-steel-light to-navy-500", glow: "rgb(74 111 165 / 0.6)", accent: "from-steel-light to-steel" },
];

/** IPCC AR4 100-year GWP. The bar scale is logarithmic so R290 is still visible. */
const refrigerantGwp = [
  { name: "R404A", gwp: 3922 },
  { name: "R134a", gwp: 1430 },
  { name: "R600a", gwp: 3 },
  { name: "R290", gwp: 3 },
];

export async function generateMetadata(
  props: PageProps<"/[locale]/sustainability">,
): Promise<Metadata> {
  const { locale } = await props.params;
  const d = getDictionary(locale);
  return {
    title: d.sustainability.meta.title,
    description: d.sustainability.meta.description,
    alternates: { canonical: `/${locale}/sustainability` },
  };
}

export default async function SustainabilityPage(
  props: PageProps<"/[locale]/sustainability">,
) {
  const { locale } = await props.params;
  const typedLocale = locale as Locale;
  const d = getDictionary(locale);
  const s = d.sustainability;
  const path = (p: string) => localePath(typedLocale, p);
  const maxLog = Math.log10(Math.max(...refrigerantGwp.map((r) => r.gwp)) + 1);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: d.common.home, url: `${site.url}${path("/")}` },
          { name: d.nav.sustainability, url: `${site.url}${path("/sustainability")}` },
        ]}
      />

      <PageHero
        image="/images/esg-solar.jpg"
        eyebrow={s.hero.eyebrow}
        title={s.hero.headline}
        subline={s.hero.subline}
        crumbLabel={d.a11y.breadcrumb}
        crumbs={[{ label: d.common.home, href: path("/") }, { label: d.nav.sustainability }]}
      >
        {/* The three headline commitments, straight under the promise */}
        <dl className="mt-10 grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3">
          {s.targets.items.map((item) => (
            <div key={item.label} className="glass-dark flex flex-col-reverse rounded-2xl p-5">
              <dt className="text-sm text-glacier-200">{item.label}</dt>
              <dd className="font-display text-3xl font-bold text-white">{item.value}</dd>
            </div>
          ))}
        </dl>
      </PageHero>

      {/* Net Zero commitment with target charts */}
      <Section aria-labelledby="commitment-heading" className="overflow-hidden">
        <div aria-hidden="true" className="absolute -end-32 -top-32 -z-10 h-96 w-96 rounded-full bg-energy/20 blur-3xl" />
        <Shell className="grid gap-12 lg:grid-cols-[1fr_1.25fr] lg:items-center">
          <div>
            <SectionHeading
              id="commitment-heading"
              eyebrow={s.commitment.eyebrow}
              title={s.commitment.heading}
              intro={s.commitment.body}
            />
            <ul className="mt-8 flex flex-wrap gap-3">
              {s.commitment.badges.map((badge) => (
                <li key={badge.title} className="glass-panel flex items-center gap-3 rounded-2xl px-4 py-3">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-energy text-white">
                    <Icon name="leaf" size={20} />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-ink-strong">{badge.title}</span>
                    <span className="block text-xs text-ink-muted">{badge.body}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="glass-panel rounded-3xl p-6 shadow-lg lg:p-10">
            <h3 className="text-lg">{s.commitment.chartsHeading}</h3>
            <Reveal as="ul" stagger className="mt-8 grid gap-8 sm:grid-cols-3">
              {s.commitment.charts.map((chart) => (
                <li key={chart.label} className="flex flex-col items-center text-center">
                  <TargetDonut value={chart.value} display={chart.display} />
                  <p className="mt-4 text-sm text-ink-muted">{chart.label}</p>
                </li>
              ))}
            </Reveal>
          </div>
        </Shell>
      </Section>

      {/* Targets explained */}
      <Section ground="frost" aria-labelledby="targets-heading" className="overflow-hidden">
        <div aria-hidden="true" className="bg-grid absolute inset-0 -z-10" />
        <Shell>
          <SectionHeading
            id="targets-heading"
            eyebrow={s.targets.eyebrow}
            title={s.roadmap.heading}
            intro={s.roadmap.intro}
            align="center"
            className="mx-auto"
          />

          <RoadmapTrack
            items={s.roadmap.items}
            doneLabel={s.roadmap.doneLabel}
            targetLabel={s.roadmap.targetLabel}
          />
        </Shell>
      </Section>

      {/* ESG / CSR commitments */}
      <Section ground="deep" aria-labelledby="esg-heading">
        <PhotoBackdrop src="/images/esg-nature.jpg" />
        <Shell>
          <SectionHeading id="esg-heading" eyebrow={s.esg.eyebrow} title={s.esg.heading} inverse />
          <Reveal as="ul" stagger className="mt-12 grid gap-5 md:grid-cols-3">
            {s.esg.items.map((pillar, index) => {
              const style = esgPillars[index % esgPillars.length];
              return (
              <li
                key={pillar.letter}
                className="glass-dark group relative overflow-hidden rounded-2xl p-7 transition-[transform,border-color] duration-300 ease-[var(--ease-out-soft)] hover:-translate-y-1 hover:border-white/25"
              >
                <span
                  aria-hidden="true"
                  className={cn("absolute inset-x-0 top-0 h-1 bg-gradient-to-r", style.accent)}
                />
                <div className="flex items-center gap-4">
                  <span
                    className={cn(
                      "grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br text-white ring-1 ring-white/20 transition-transform duration-300 ease-[var(--ease-spring)] group-hover:rotate-6 group-hover:scale-105",
                      style.tile,
                    )}
                    style={{ boxShadow: `0 12px 28px -8px ${style.glow}` }}
                  >
                    <Icon name={style.icon} size={24} className="h-7 w-7" />
                  </span>
                  <h3 className="text-xl text-white">
                    <span className="sr-only">{pillar.letter} — </span>
                    {pillar.title}
                  </h3>
                </div>
                <ul className="mt-6 flex flex-col gap-3">
                  {pillar.points.map((point) => (
                    <li key={point} className="flex items-start gap-3 text-sm text-white/85">
                      <Icon name="check" size={16} className="mt-1 shrink-0 text-glacier-300" />
                      {point}
                    </li>
                  ))}
                </ul>
              </li>
              );
            })}
          </Reveal>
        </Shell>
      </Section>

      {/* Where the reduction comes from — visual pillars */}
      <Section aria-labelledby="pillars-heading">
        <Shell>
          <SectionHeading id="pillars-heading" title={s.pillars.heading} />
          <Reveal as="ul" stagger className="mt-12 grid gap-6 md:grid-cols-2">
            {s.pillars.items.map((item, index) => (
              <li key={item.title} className="group overflow-hidden rounded-3xl border border-hairline bg-surface">
                <div className="relative aspect-[16/9] overflow-hidden">
                  <Image
                    src={pillarImages[index]}
                    alt=""
                    fill
                    sizes="(min-width: 768px) 45vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <span className="absolute start-4 top-4 grid h-11 w-11 place-items-center rounded-xl bg-white/90 text-energy backdrop-blur">
                    <Icon name="leaf" size={20} />
                  </span>
                </div>
                <div className="p-7">
                  <h3 className="text-xl">{item.title}</h3>
                  <p className="mt-3 text-ink-muted">{item.body}</p>
                </div>
              </li>
            ))}
          </Reveal>
        </Shell>
      </Section>

      {/* Solar + refrigerants */}
      <Section ground="muted" aria-labelledby="solar-heading">
        <Shell className="grid gap-8 lg:grid-cols-2">
          <div className="relative isolate flex min-h-[28rem] flex-col justify-end overflow-hidden rounded-3xl p-8 text-white">
            <PhotoBackdrop src="/images/esg-solar.jpg" tone="card" />
            <p className="text-2xs font-semibold uppercase tracking-[0.18em] text-glacier-300">{s.solar.eyebrow}</p>
            <h2 id="solar-heading" className="mt-3 text-3xl text-white">{s.solar.heading}</h2>
            <p className="mt-3 max-w-[52ch] text-white/80">{s.solar.body}</p>
            <dl className="mt-6 grid grid-cols-3 gap-3">
              {s.solar.stats.map((stat) => (
                <div key={stat.label} className="flex flex-col-reverse rounded-xl bg-white/10 p-3 backdrop-blur-md">
                  <dt className="mt-1 text-2xs text-white/75">{stat.label}</dt>
                  <dd className="font-display text-lg font-bold">{stat.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="flex flex-col rounded-3xl border border-hairline bg-surface p-8">
            <p className="text-2xs font-semibold uppercase tracking-[0.18em] text-energy">{s.refrigerants.eyebrow}</p>
            <h2 className="mt-3 text-3xl">{s.refrigerants.heading}</h2>
            <p className="mt-3 text-ink-muted">{s.refrigerants.body}</p>

            <figure className="mt-8">
              <figcaption className="text-sm font-medium text-ink-strong">{s.refrigerants.gwpLabel}</figcaption>
              <ul className="mt-4 flex flex-col gap-4">
                {refrigerantGwp.map((item) => {
                  const low = item.gwp < 10;
                  return (
                    <li key={item.name} className="grid grid-cols-[4.5rem_1fr_3.5rem] items-center gap-3">
                      <span className="ltr-inline font-mono text-sm font-semibold text-ink-strong">{item.name}</span>
                      <span className="h-3 overflow-hidden rounded-full bg-surface-sunken">
                        <span
                          className={cn("block h-full rounded-full", low ? "bg-energy" : "bg-warn/80")}
                          style={{ width: `${Math.max(3, (Math.log10(item.gwp + 1) / maxLog) * 100)}%` }}
                        />
                      </span>
                      <span className={cn("tabular text-end text-sm font-semibold", low ? "text-energy" : "text-ink-strong")}>
                        {item.gwp.toLocaleString("en-US")}
                      </span>
                    </li>
                  );
                })}
              </ul>
              <p className="mt-4 text-xs text-ink-muted">{s.refrigerants.note}</p>
            </figure>
          </div>
        </Shell>
      </Section>

      {/* Impact counters */}
      <Section ground="deep" aria-labelledby="impact-heading">
        <PhotoBackdrop src="/images/esg-nature.jpg" position="center 70%" />
        <Shell>
          <SectionHeading id="impact-heading" title={s.impact.heading} inverse />
          <Reveal as="dl" stagger className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {s.impact.stats.map((stat) => (
              <div key={stat.label} className="flex flex-col-reverse border-s-2 border-energy ps-5">
                <dt className="mt-2 text-sm text-white/75">{stat.label}</dt>
                <dd className="font-display text-4xl font-bold text-white lg:text-5xl">
                  <Counter
                    value={stat.value}
                    suffix={stat.suffix}
                    raw={"raw" in stat ? Boolean(stat.raw) : false}
                    locale={locale}
                  />
                </dd>
              </div>
            ))}
          </Reveal>
          <p className="mt-10 text-xs text-white/60">{s.dataNote}</p>
        </Shell>
      </Section>

      <Section ground="muted" tight>
        <Shell>
          {/* Closing band: the green stays as accent light over the navy ground,
              rather than a flat fill that fights the rest of the page. */}
          <div className="relative isolate flex flex-col items-start justify-between gap-8 overflow-hidden rounded-3xl p-8 text-white shadow-xl lg:flex-row lg:items-center lg:p-12">
            <PhotoBackdrop src="/images/esg-nature.jpg" tone="deep" position="center 60%" />
            <div aria-hidden="true" className="absolute -start-24 -top-24 -z-10 h-80 w-80 rounded-full bg-energy/30 blur-3xl" />
            <div aria-hidden="true" className="bg-grid-inverse absolute inset-0 -z-10 opacity-60" />
            <div>
              <h2 className="max-w-[24ch] text-3xl text-white">{s.cta.heading}</h2>
              <p className="mt-4 max-w-[58ch] text-ink-inverse-muted">{s.cta.body}</p>
            </div>
            <ButtonLink
              href={path("/resources#catalogue")}
              size="lg"
              icon="download"
              className="shrink-0"
            >
              {s.cta.primary}
            </ButtonLink>
          </div>
        </Shell>
      </Section>
    </>
  );
}

/** Static ring chart: the figure is text, the ring only illustrates it. */
function TargetDonut({ value, display }: { value: number; display: string }) {
  const r = 52;
  const circumference = 2 * Math.PI * r;
  return (
    <span className="relative grid h-36 w-36 place-items-center">
      <svg aria-hidden="true" viewBox="0 0 120 120" className="absolute inset-0 h-full w-full -rotate-90">
        <circle cx="60" cy="60" r={r} fill="none" stroke="rgb(255 255 255 / 0.12)" strokeWidth="12" />
        <circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke="#34d399"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={`${(value / 100) * circumference} ${circumference}`}
        />
      </svg>
      <span className="ltr-inline px-3 font-display text-xl font-bold leading-tight text-ink-strong">{display}</span>
    </span>
  );
}
