import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/sections/PageHero";
import { Section, SectionHeading, Shell } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/ui/Icon";
import { PhotoBackdrop } from "@/components/ui/PhotoBackdrop";
import { Reveal } from "@/components/motion/Reveal";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { certifications, site } from "@/lib/data/site";
import { getDictionary } from "@/lib/i18n";
import { localePath, type Locale } from "@/lib/i18n/config";

const capabilityIcons: IconName[] = ["gauge", "cube", "temperature", "rotate", "bolt", "leaf"];
const testIcons: IconName[] = ["temperature", "rotate", "bolt", "gauge", "snow", "box"];
const stepIcons: IconName[] = ["info", "layers", "gauge", "shield"];
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
      <Section aria-labelledby="overview-heading">
        <Shell className="grid gap-14 lg:grid-cols-2 lg:items-center">
          <Reveal animation="scale-in" className="relative order-last lg:order-first">
            <div className="relative aspect-[5/4] overflow-hidden rounded-3xl shadow-xl">
              <Image src="/images/rnd-engineers.jpg" alt="" fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
            </div>
            <div className="glass absolute -bottom-6 end-6 hidden rounded-2xl bg-white/90 p-5 sm:block">
              <p className="ltr-inline font-display text-3xl font-bold text-ink-strong">43°C · 65% RH</p>
              <p className="text-xs text-ink-muted">{r.overview.stats[0].label}</p>
            </div>
          </Reveal>

          <div>
            <SectionHeading
              id="overview-heading"
              eyebrow={r.overview.eyebrow}
              title={r.overview.heading}
              intro={r.overview.body}
            />
            <Reveal as="dl" stagger className="mt-10 grid grid-cols-2 gap-6">
              {r.overview.stats.map((stat) => (
                <div key={stat.label} className="flex flex-col-reverse border-s-2 border-glacier-400 ps-4">
                  <dt className="mt-1 text-sm text-ink-muted">{stat.label}</dt>
                  <dd className="ltr-inline font-display text-3xl font-bold text-ink-strong">{stat.value}</dd>
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

          <Reveal as="ol" stagger className="relative mt-14 grid gap-6 md:grid-cols-5">
            <span aria-hidden="true" className="absolute inset-x-[10%] top-7 hidden h-px bg-gradient-to-r from-glacier-400 via-hairline-strong to-glacier-400 md:block" />
            {r.approach.steps.map((step, index) => (
              <li key={step.title} className="relative flex flex-col items-start md:items-center md:text-center">
                <span className="tabular relative grid h-14 w-14 place-items-center rounded-2xl bg-navy-700 font-display text-lg font-bold text-glacier-300 shadow-md ring-8 ring-surface-muted">
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
          <Reveal as="ul" stagger className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-hairline bg-hairline sm:grid-cols-2 xl:grid-cols-3">
            {r.capability.items.map((item, index) => (
              <li key={item.title} className="group flex h-full flex-col gap-3 bg-surface p-7 transition-colors hover:bg-surface-muted">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-glacier-100 text-glacier-700 transition-colors group-hover:bg-glacier-400 group-hover:text-navy-900">
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
      <Section ground="muted" aria-labelledby="emmd-heading">
        <Shell>
          <SectionHeading
            id="emmd-heading"
            eyebrow={r.emmd.eyebrow}
            title={r.emmd.heading}
            intro={r.emmd.body}
          />

          <Reveal as="dl" stagger className="mt-12 grid gap-6 md:grid-cols-3">
            {r.emmd.results.map((result) => (
              <div key={result.label} className="flex flex-col rounded-2xl bg-surface p-7 shadow-sm">
                <dt className="order-2 mt-2 text-sm font-semibold text-ink-strong">{result.label}</dt>
                <dd className="order-1 font-display text-4xl font-bold text-glacier-600">{result.value}</dd>
                <dd className="order-3 mt-2 text-sm text-ink-muted">{result.detail}</dd>
              </div>
            ))}
          </Reveal>

          <h3 className="mt-16 text-2xl">{r.emmd.howHeading}</h3>
          <Reveal as="ol" stagger className="mt-8 grid gap-6 md:grid-cols-4">
            {r.emmd.how.map((step, index) => (
              <li key={step.step} className="flex flex-col gap-3 rounded-2xl border border-hairline bg-surface p-6">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-glacier-400 text-navy-700">
                  <Icon name={stepIcons[index]} size={24} />
                </span>
                <span className="font-display text-lg font-semibold text-ink-strong">{step.step}</span>
                <span className="text-sm text-ink-muted">{step.body}</span>
              </li>
            ))}
          </Reveal>
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
