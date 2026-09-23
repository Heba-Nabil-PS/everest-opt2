import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { Section, SectionHeading, Shell } from "@/components/ui/Section";
import { PhotoBackdrop } from "@/components/ui/PhotoBackdrop";
import { ButtonLink } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Reveal } from "@/components/motion/Reveal";
import { ScrollDrawLine } from "@/components/motion/ScrollDraw";
import { ServiceForm } from "@/components/forms/ServiceForm";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { site } from "@/lib/data/site";
import { getDictionary } from "@/lib/i18n";
import { localePath, type Locale } from "@/lib/i18n/config";
import { slugify } from "@/lib/utils";

/** One icon per service, in dictionary order. */
const serviceIcons: IconName[] = [
  "wrench",
  "pin",
  "rotate",
  "gauge",
  "users",
  "shield",
  "box",
  "layers",
  "calendar",
];

/* UAE direct, mobility van, partner territories, dealership markets. */
const coverageIcons: IconName[] = ["building", "pin", "globe", "users"];

export async function generateMetadata(props: PageProps<"/[locale]/services">): Promise<Metadata> {
  const { locale } = await props.params;
  const d = getDictionary(locale);
  return {
    title: d.services.meta.title,
    description: d.services.meta.description,
    alternates: { canonical: `/${locale}/services` },
  };
}

export default async function ServicesPage(props: PageProps<"/[locale]/services">) {
  const { locale } = await props.params;
  const typedLocale = locale as Locale;
  const d = getDictionary(locale);
  const path = (p: string) => localePath(typedLocale, p);

  /* English slugs anchor both locales so a shared link works in either. */
  const anchors = [
    "after-sales-maintenance",
    "mobility-service",
    "refurbishments",
    "pre-sales-qualification",
    "after-sales-support",
    "warranty-services",
    "storage-and-distribution",
    "spare-parts-dealership",
    "annual-maintenance-contract",
  ];

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: d.common.home, url: `${site.url}${path("/")}` },
          { name: d.nav.services, url: `${site.url}${path("/services")}` },
        ]}
      />

      <PageHero
        image="/images/services-technician.jpg"
        eyebrow={d.services.hero.eyebrow}
        title={d.services.hero.headline}
        subline={d.services.hero.subline}
        crumbLabel={d.a11y.breadcrumb}
        crumbs={[{ label: d.common.home, href: path("/") }, { label: d.nav.services }]}
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="#request-service" icon="arrowRight">
            {d.cta.requestService}
          </ButtonLink>
        </div>
      </PageHero>

      {/* Introduction — why after-sales is part of the offering at all */}
      <Section aria-labelledby="services-intro-heading">
        <Shell className="grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:items-start">
          <SectionHeading
            id="services-intro-heading"
            eyebrow={d.services.intro.eyebrow}
            title={d.services.intro.heading}
          />
          <Reveal as="div" stagger className="flex flex-col gap-5">
            {d.services.intro.paragraphs.map((paragraph) => (
              <p key={paragraph} className="max-w-[68ch] text-lg text-ink-muted">
                {paragraph}
              </p>
            ))}
          </Reveal>
        </Shell>
      </Section>

      {/* Services */}
      <Section ground="frost" aria-labelledby="services-list-heading">
        <Shell>
          <h2 id="services-list-heading" className="sr-only">
            {d.nav.services}
          </h2>

          {/* The services read as one sequence, not nine unrelated boxes, so a
              rail runs the length of the list and draws itself on the way
              down. Each card is an index marker on that rail. */}
          <div className="relative">
            <span aria-hidden="true" className="absolute inset-y-0 start-6 hidden w-px bg-white/10 lg:block" />
            <ScrollDrawLine className="absolute inset-y-0 start-6 hidden w-px bg-glacier-400 lg:block" />

            <div className="flex flex-col gap-5">
              {d.services.items.map((item, index) => (
                <Reveal
                  key={item.title}
                  as="article"
                  id={anchors[index] ?? slugify(item.title)}
                  className="glass-panel glass-spot glass-hover group grid scroll-mt-32 gap-8 rounded-2xl p-6 lg:grid-cols-[auto_1.4fr_1fr] lg:p-8"
                >
                  <div className="flex items-center gap-4 lg:flex-col lg:items-start lg:gap-3">
                    <span className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-glacier-400 to-steel text-white shadow-[0_10px_24px_-8px_rgb(44_186_226/0.7)] ring-8 ring-navy-950/40 transition-transform duration-300 ease-[var(--ease-spring)] group-hover:rotate-6 group-hover:scale-105">
                      <Icon name={serviceIcons[index % serviceIcons.length]} size={24} />
                    </span>
                    <span className="tabular font-display text-sm font-bold text-white/30 lg:ps-4">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-2xl">{item.title}</h3>
                    <p className="mt-2 font-medium text-glacier-300">{item.summary}</p>
                    <p className="mt-4 max-w-[62ch] text-ink-muted">{item.body}</p>
                    <ButtonLink
                      href={item.cta === d.cta.customizeFridge ? path("/customize") : "#request-service"}
                      variant="ghost"
                      size="sm"
                      icon="arrowRight"
                      className="mt-6"
                    >
                      {item.cta}
                    </ButtonLink>
                  </div>

                  <ul className="flex flex-col gap-2.5 rounded-xl bg-white/5 p-5 ring-1 ring-white/10">
                    {item.points.map((point) => (
                      <li key={point} className="flex items-start gap-2.5 text-sm">
                        <Icon name="check" size={16} className="mt-0.5 shrink-0 text-glacier-300" />
                        <span className="text-ink">{point}</span>
                      </li>
                    ))}
                  </ul>
                </Reveal>
              ))}
            </div>
          </div>
        </Shell>
      </Section>

      {/* Coverage */}
      <Section aria-labelledby="coverage-heading" className="overflow-hidden">
        <div aria-hidden="true" className="bg-grid absolute inset-0 -z-10" />
        <Shell>
          <SectionHeading
            id="coverage-heading"
            title={d.services.coverage.heading}
            intro={d.services.coverage.body}
          />

          <Reveal as="ul" stagger className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {d.services.coverage.tiers.map((tier, index) => (
              <li
                key={tier.region}
                className="glass-panel glass-spot glass-hover group relative flex h-full flex-col overflow-hidden rounded-2xl p-6"
              >
                {/* Accent line that grows on hover */}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-glacier-400 to-steel transition-transform duration-500 group-hover:scale-x-100 rtl:origin-right"
                />

                <span className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-glacier-400 to-steel text-white shadow-[0_8px_20px_-6px_rgb(44_186_226/0.6)] transition-transform duration-300 group-hover:rotate-6">
                  <Icon name={coverageIcons[index % coverageIcons.length]} size={24} />
                </span>

                <h3 className="mt-5 text-xl">{tier.region}</h3>

                <dl className="mt-5 flex flex-1 flex-col gap-4 border-t border-white/10 pt-5 text-sm">
                  <div>
                    <dt className="flex items-center gap-2 text-2xs font-semibold uppercase tracking-[0.16em] text-glacier-300">
                      <Icon name="clock" size={16} />
                      {d.services.coverage.responseLabel}
                    </dt>
                    <dd className="mt-1.5 inline-flex rounded-lg bg-glacier-400/15 px-3 py-1.5 font-semibold text-glacier-200 ring-1 ring-glacier-400/30">
                      {tier.response}
                    </dd>
                  </div>
                  <div>
                    <dt className="flex items-center gap-2 text-2xs font-semibold uppercase tracking-[0.16em] text-glacier-300">
                      <Icon name="box" size={16} />
                      {d.services.coverage.stockLabel}
                    </dt>
                    <dd className="mt-1.5 text-ink-muted">{tier.stock}</dd>
                  </div>
                </dl>
              </li>
            ))}
          </Reveal>
        </Shell>
      </Section>

      {/* After Sales Portal */}
      <Section ground="muted" tight aria-labelledby="portal-heading">
        <Shell>
          <div className="relative isolate flex flex-col items-start justify-between gap-8 overflow-hidden rounded-3xl p-8 text-white shadow-xl lg:flex-row lg:items-center lg:p-12">
            <PhotoBackdrop src="/images/gallery-warehouse.jpg" tone="deep" position="center 55%" />
            <div aria-hidden="true" className="bg-grid-inverse absolute inset-0 -z-10 opacity-60" />
            <div>
              <p className="text-2xs font-semibold uppercase tracking-[0.18em] text-glacier-300">
                {d.services.portal.eyebrow}
              </p>
              <h2 id="portal-heading" className="mt-3 max-w-[24ch] text-3xl text-white">
                {d.services.portal.heading}
              </h2>
              <p className="mt-4 max-w-[58ch] text-ink-inverse-muted">{d.services.portal.body}</p>
            </div>
            <ButtonLink href="#request-service" size="lg" icon="arrowRight" className="shrink-0">
              {d.services.portal.cta}
            </ButtonLink>
          </div>
        </Shell>
      </Section>

      {/* Request service */}
      <Section ground="deep" id="request-service" aria-labelledby="service-form-heading">
        <PhotoBackdrop src="/images/gallery-assembly.jpg" />
        <Shell className="relative grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-start">
          <SectionHeading
            id="service-form-heading"
            title={d.services.form.heading}
            intro={d.services.form.body}
            inverse
          />
          <div className="form-dark glass-dark rounded-2xl p-6 lg:p-8">
            <ServiceForm locale={typedLocale} dictionary={d} />
          </div>
        </Shell>
      </Section>
    </>
  );
}
