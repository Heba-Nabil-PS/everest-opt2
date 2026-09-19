import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/sections/PageHero";
import { Section, SectionHeading, Shell } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/ui/Icon";
import { PhotoBackdrop } from "@/components/ui/PhotoBackdrop";
import { Reveal } from "@/components/motion/Reveal";
import { TextReveal } from "@/components/motion/TextReveal";
import { ImageReveal } from "@/components/motion/ImageReveal";
import { GrowBar } from "@/components/motion/GrowBar";
import { ScrollDrawLine } from "@/components/motion/ScrollDraw";
import { Glow } from "@/components/ui/Aurora";
import { Counter } from "@/components/motion/Counter";
import { DutyCycleChart } from "@/components/art/DutyCycleChart";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { certifications, site } from "@/lib/data/site";
import { getDictionary } from "@/lib/i18n";
import { localePath, type Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

const capabilityIcons: IconName[] = ["gauge", "cube", "temperature", "rotate", "bolt", "leaf"];
const testIcons: IconName[] = ["temperature", "rotate", "bolt", "gauge", "snow", "box"];
const stepIcons: IconName[] = ["info", "layers", "gauge", "shield"];
/* Lower energy, tighter band, longer compressor life — in results order. */
const resultIcons: IconName[] = ["bolt", "temperature", "clock"];
/* Brand wraps, shelving, electrics, glazing, hardware, controller — in item order. */
const customisationIcons: IconName[] = ["sparkle", "layers", "bolt", "snow", "lock", "temperature"];
const focusImages = ["/images/products-chillers.jpg", "/images/rnd-engineers.jpg", "/images/gallery-robotics.jpg"];

export async function generateMetadata(
  props: PageProps<"/[locale]/innovation">,
): Promise<Metadata> {
  const { locale } = await props.params;
  const d = getDictionary(locale);
  return {
    title: d.innovation.meta.title,
    description: d.innovation.meta.description,
    alternates: { canonical: `/${locale}/innovation` },
  };
}

export default async function InnovationPage(props: PageProps<"/[locale]/innovation">) {
  const { locale } = await props.params;
  const typedLocale = locale as Locale;
  const d = getDictionary(locale);
  const r = d.innovation;
  const path = (p: string) => localePath(typedLocale, p);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: d.common.home, url: `${site.url}${path("/")}` },
          { name: d.nav.innovation, url: `${site.url}${path("/innovation")}` },
        ]}
      />

      <PageHero
        image="/images/rnd-lab.jpg"
        eyebrow={r.hero.eyebrow}
        title={r.hero.headline}
        subline={r.hero.subline}
        crumbLabel={d.a11y.breadcrumb}
        crumbs={[{ label: d.common.home, href: path("/") }, { label: d.nav.innovation }]}
      />

      {/* Overview */}
      <Section aria-labelledby="overview-heading" className="overflow-hidden">
        <Glow className="-start-32 top-10 h-96 w-96" />
        <Shell className="grid gap-14 lg:grid-cols-2 lg:items-center">
          <div className="relative order-last lg:order-first">
            {/* The photograph wipes in and drifts, rather than popping. */}
            <ImageReveal
              variant="clip-side"
              parallax={14}
              className="relative aspect-[5/4] overflow-hidden rounded-3xl shadow-xl"
            >
              <Image src="/images/rnd-engineers.jpg" alt="" fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
            </ImageReveal>
            <div className="glass-panel absolute -bottom-6 end-6 hidden rounded-2xl p-5 sm:block">
              <p className="ltr-inline font-display text-3xl font-bold text-white">43°C · 65% RH</p>
              <p className="mt-1 text-xs text-ink-muted">{r.overview.stats[0].label}</p>
            </div>
          </div>

          <div>
            <SectionHeading id="overview-heading" eyebrow={r.overview.eyebrow} title={r.overview.heading} />
            {/* The claim lights up word by word with the scroll. */}
            <TextReveal as="p" variant="scrub" className="mt-6 max-w-[58ch] text-lg text-ink-muted">
              {r.overview.body}
            </TextReveal>

            <Reveal as="dl" stagger className="mt-10 grid grid-cols-2 gap-4">
              {r.overview.stats.map((stat) => (
                <div
                  key={stat.label}
                  className="glass-panel glass-hover flex flex-col-reverse rounded-2xl p-5"
                >
                  <dt className="mt-2 text-sm text-ink-muted">{stat.label}</dt>
                  <dd className="ltr-inline font-display text-3xl font-bold text-white">{stat.value}</dd>
                </div>
              ))}
            </Reveal>
          </div>
        </Shell>
      </Section>

      {/* Innovation approach */}
      <Section ground="muted" aria-labelledby="approach-heading">
        <Shell>
          <SectionHeading
            id="approach-heading"
            eyebrow={r.approach.eyebrow}
            title={r.approach.heading}
            intro={r.approach.intro}
          />

          {/* Five gates on a track that draws itself as the section arrives —
              the line is the argument, so it earns the animation. */}
          <Reveal as="ol" stagger className="relative mt-14 grid gap-6 md:grid-cols-5">
            <span aria-hidden="true" className="absolute inset-x-[10%] top-7 hidden h-px bg-white/10 md:block" />
            {/* aria-hidden on the wrapper: GrowBar is a `role="img"` data bar,
                but here it is pure decoration with nothing to announce. */}
            <span aria-hidden="true" className="absolute inset-x-[10%] top-7 hidden md:block">
              <GrowBar
                value={100}
                label=""
                className="h-px"
                barClassName="bg-gradient-to-r from-glacier-400 via-steel to-steel-light"
              />
            </span>
            {r.approach.steps.map((step, index) => (
              <li key={step.title} className="group relative flex flex-col items-start md:items-center md:text-center">
                <span className="tabular relative grid h-14 w-14 place-items-center rounded-2xl bg-navy-700 font-display text-lg font-bold text-glacier-300 shadow-md ring-8 ring-surface-muted transition-[transform,background-color,color] duration-300 ease-[var(--ease-spring)] group-hover:-translate-y-1 group-hover:bg-glacier-400 group-hover:text-navy-900">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-5 text-lg">{step.title}</h3>
                <p className="mt-2 text-sm text-ink-muted">{step.body}</p>
              </li>
            ))}
          </Reveal>
        </Shell>
      </Section>

      {/* Capability */}
      <Section aria-labelledby="capability-heading">
        <Shell>
          <SectionHeading id="capability-heading" title={r.capability.heading} />
          <Reveal as="ul" stagger className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {r.capability.items.map((item, index) => (
              <li
                key={item.title}
                className="glass-panel glass-spot glass-hover group flex h-full flex-col gap-3 rounded-2xl p-7"
              >
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-glacier-400 to-steel text-white shadow-[0_8px_20px_-6px_rgb(44_186_226/0.6)] transition-transform duration-300 ease-[var(--ease-spring)] group-hover:rotate-6 group-hover:scale-105">
                  <Icon name={capabilityIcons[index]} size={20} />
                </span>
                <h3 className="text-lg">{item.title}</h3>
                <p className="text-sm text-ink-muted">{item.body}</p>
              </li>
            ))}
          </Reveal>
        </Shell>
      </Section>

      {/* Testing and quality standards */}
      <Section ground="deep" aria-labelledby="testing-heading">
        <PhotoBackdrop src="/images/rnd-testing.jpg" />
        <Shell className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:items-start">
          <div>
            <SectionHeading
              id="testing-heading"
              eyebrow={r.testing.eyebrow}
              title={r.testing.heading}
              intro={r.testing.intro}
              inverse
            />
            <p className="mt-8 text-sm font-medium text-white">{r.quality.heading}</p>
            <p className="mt-2 max-w-[52ch] text-sm text-white/70">{r.quality.body}</p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {certifications.map((cert) => (
                <li key={cert.id} className="ltr-inline inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-sm font-semibold text-white backdrop-blur-md">
                  <Icon name="shield" size={16} className="text-glacier-300" />
                  {cert.standard}
                </li>
              ))}
            </ul>
          </div>

          <Reveal as="ul" stagger className="grid gap-4 sm:grid-cols-2">
            {r.testing.items.map((item, index) => (
              <li key={item.title} className="glass-dark rounded-2xl p-6">
                <Icon name={testIcons[index]} size={24} className="text-glacier-300" />
                <h3 className="mt-4 text-lg text-white">{item.title}</h3>
                <p className="mt-2 text-sm text-white/70">{item.body}</p>
              </li>
            ))}
          </Reveal>
        </Shell>
      </Section>

      {/* Focus areas */}
      <Section aria-labelledby="focus-heading">
        <Shell>
          <SectionHeading id="focus-heading" eyebrow={r.focus.eyebrow} title={r.focus.heading} />
          <Reveal as="ul" stagger className="mt-12 grid gap-6 md:grid-cols-3">
            {r.focus.items.map((item, index) => (
              <li
                key={item.title}
                className="group relative isolate flex min-h-[26rem] flex-col justify-end overflow-hidden rounded-3xl p-7 text-white"
              >
                <PhotoBackdrop
                  src={focusImages[index]}
                  tone="card"
                  className="[&_img]:transition-transform [&_img]:duration-700 group-hover:[&_img]:scale-105"
                />
                <span className="tabular font-mono text-sm text-glacier-300">{String(index + 1).padStart(2, "0")}</span>
                <h3 className="mt-2 text-2xl text-white">{item.title}</h3>
                <p className="mt-3 text-sm text-white/80">{item.body}</p>
              </li>
            ))}
          </Reveal>
        </Shell>
      </Section>

      {/* EMMD */}
      <Section ground="muted" aria-labelledby="emmd-heading" className="overflow-hidden">
        <Shell>
          {/* The claim is an engineering one, so the evidence sits beside it
              rather than under a wall of prose: the duty cycle drawn twice,
              hard on-off against demand-matched modulation. */}
          <div className="grid gap-12 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:gap-16">
            <div>
              <SectionHeading id="emmd-heading" eyebrow={r.emmd.eyebrow} title={r.emmd.heading} />
              <TextReveal as="p" variant="scrub" className="mt-6 max-w-[56ch] text-ink-muted">
                {r.emmd.body}
              </TextReveal>
            </div>

            <Reveal
              animation="scale-in"
              className="glass-panel-strong glass-spot relative isolate flex flex-col gap-7 overflow-hidden rounded-[2rem] p-7 lg:p-9"
            >
              <Glow className="-bottom-24 -start-16 h-72 w-72" />
              <Glow tone="indigo" className="-end-20 -top-20 h-60 w-60" />

              <div className="flex items-end justify-between gap-4">
                <p className="font-display text-6xl font-bold leading-[0.85] tracking-[-0.04em] sm:text-7xl">
                  <span className="ltr-inline text-aurora">
                    −<Counter value={20} locale={typedLocale} />%
                  </span>
                </p>
                <p className="glass-chip inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-2xs font-semibold uppercase tracking-[0.22em] text-glacier-300">
                  <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-glacier-400 shadow-[0_0_10px_rgb(44_186_226/0.9)]" />
                  EMMD
                </p>
              </div>

              <DutyCycleChart className="-mx-1" />

              {/* The traces carry no labels of their own, so the legend names
                  them in the same two colours. */}
              <ul className="flex flex-wrap gap-x-6 gap-y-2 text-xs">
                {[
                  { label: r.emmd.baselineLabel, swatch: "bg-white/35" },
                  { label: r.emmd.emmdLabel, swatch: "bg-gradient-to-r from-glacier-400 to-steel-light" },
                ].map((item) => (
                  <li key={item.label} className="flex items-center gap-2 text-ink-muted">
                    <span aria-hidden="true" className={cn("h-0.5 w-6 rounded-full", item.swatch)} />
                    {item.label}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <Reveal as="dl" stagger className="mt-14 grid gap-4 md:grid-cols-3">
            {r.emmd.results.map((result, index) => (
              <div
                key={result.label}
                className="glass-panel glass-spot glass-hover group relative flex flex-col overflow-hidden rounded-2xl p-7"
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-gradient-to-r from-glacier-400 to-steel-light transition-transform duration-500 ease-[var(--ease-smooth)] group-hover:scale-x-100 rtl:origin-right"
                />
                <span className="order-1 grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-glacier-400 to-steel-light text-navy-950 shadow-[0_8px_20px_-6px_rgb(44_186_226/0.6)] transition-transform duration-300 ease-[var(--ease-spring)] group-hover:rotate-6 group-hover:scale-105">
                  <Icon name={resultIcons[index]} size={20} />
                </span>
                <dd className="text-aurora order-2 mt-5 font-display text-4xl font-bold lg:text-5xl">
                  {result.value}
                </dd>
                <dt className="order-3 mt-2 text-sm font-semibold text-ink-strong">{result.label}</dt>
                <dd className="order-4 mt-2 text-sm text-ink-muted">{result.detail}</dd>
              </div>
            ))}
          </Reveal>

          <h3 className="mt-16 text-2xl">{r.emmd.howHeading}</h3>
          {/* Sense → Model → Modulate → Verify reads as a chain, so the steps
              are joined by a line that draws down the list as it arrives. */}
          <div className="relative mt-8">
            <span aria-hidden="true" className="absolute inset-y-0 start-6 w-px bg-white/10 md:hidden" />
            <ScrollDrawLine className="absolute inset-y-0 start-6 w-px bg-glacier-400 md:hidden" />
            <Reveal as="ol" stagger className="grid gap-4 md:grid-cols-4">
              {r.emmd.how.map((step, index) => (
                <li
                  key={step.step}
                  className="glass-panel glass-hover group relative flex flex-col gap-3 rounded-2xl p-6 max-md:ms-14"
                >
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-glacier-400 to-steel text-white shadow-[0_8px_20px_-6px_rgb(44_186_226/0.6)] transition-transform duration-300 ease-[var(--ease-spring)] group-hover:rotate-6">
                    <Icon name={stepIcons[index]} size={24} />
                  </span>
                  <span className="font-display text-lg font-semibold text-ink-strong">{step.step}</span>
                  <span className="text-sm text-ink-muted">{step.body}</span>
                </li>
              ))}
            </Reveal>
          </div>
        </Shell>
      </Section>

      {/* Customisation */}
      <Section ground="deep" aria-labelledby="customisation-heading">
        <PhotoBackdrop src="/images/gallery-assembly.jpg" />
        <div aria-hidden="true" className="bg-grid-inverse absolute inset-0 -z-10 opacity-60" />
        <Shell className="relative grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <div>
            <SectionHeading
              id="customisation-heading"
              title={r.customisation.heading}
              intro={r.customisation.intro}
              inverse
            />
            <ButtonLink href={path("/customize")} size="lg" className="mt-8" icon="arrowRight">
              {r.customisation.cta}
            </ButtonLink>
          </div>

          <Reveal as="ul" stagger className="grid gap-3 sm:grid-cols-2">
            {r.customisation.items.map((item, index) => (
              <li
                key={item}
                className="glass-dark group flex items-start gap-4 rounded-2xl p-5 text-sm transition-[transform,border-color] duration-300 ease-[var(--ease-out-soft)] hover:-translate-y-1 hover:border-glacier-300/50"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-glacier-400 to-steel text-white shadow-[0_8px_20px_-6px_rgb(44_186_226/0.6)] transition-transform duration-300 group-hover:rotate-6">
                  <Icon name={customisationIcons[index % customisationIcons.length]} size={20} />
                </span>
                <span className="text-white/90">{item}</span>
              </li>
            ))}
          </Reveal>
        </Shell>
      </Section>
    </>
  );
}
