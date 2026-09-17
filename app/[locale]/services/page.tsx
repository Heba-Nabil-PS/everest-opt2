import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { Section, SectionHeading, Shell } from "@/components/ui/Section";
import { PhotoBackdrop } from "@/components/ui/PhotoBackdrop";
import { ButtonLink } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Reveal } from "@/components/motion/Reveal";
import { ServiceForm } from "@/components/forms/ServiceForm";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { site } from "@/lib/data/site";
import { getDictionary } from "@/lib/i18n";
import { localePath, type Locale } from "@/lib/i18n/config";
import { slugify } from "@/lib/utils";

const serviceIcons: IconName[] = ["shield", "calendar", "wrench", "users", "sparkle"];
/* UAE & GCC (head office), Egypt, India & Sri Lanka, distributor markets. */
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
  const anchors = ["warranty", "scheduled-maintenance", "upgrade-and-retrofit", "regional-technical-support", "custom-design-services"];

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

      {/* Services */}
      <Section aria-labelledby="services-list-heading">
        <Shell>
          <h2 id="services-list-heading" className="sr-only">
            {d.nav.services}
          </h2>

          <div className="flex flex-col gap-6">
            {d.services.items.map((item, index) => (
              <Reveal
                key={item.title}
                as="article"
                id={anchors[index] ?? slugify(item.title)}
                className="grid scroll-mt-32 gap-8 rounded-2xl border border-hairline bg-surface p-6 lg:grid-cols-[auto_1.4fr_1fr] lg:p-8"
              >
                <span className="grid h-14 w-14 place-items-center rounded-xl bg-navy-700 text-glacier-300">
                  <Icon name={serviceIcons[index]} size={24} />
                </span>

                <div>
                  <h3 className="text-2xl">{item.title}</h3>
                  <p className="mt-2 font-medium text-glacier-600">{item.summary}</p>
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

                <ul className="flex flex-col gap-2 rounded-xl bg-surface-muted p-5">
                  {item.points.map((point) => (
                    <li key={point} className="flex items-start gap-2 text-sm">
                      <Icon name="check" size={16} className="mt-1 shrink-0 text-glacier-600" />
                      <span className="text-ink">{point}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </Shell>
      </Section>

      {/* Coverage */}
      <Section ground="frost" aria-labelledby="coverage-heading" className="overflow-hidden">
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
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-hairline bg-surface p-6 shadow-sm transition-[transform,box-shadow,border-color] duration-300 ease-[var(--ease-out-soft)] hover:-translate-y-1 hover:border-glacier-300 hover:shadow-xl"
              >
                {/* Accent line that grows on hover */}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-glacier-400 to-steel transition-transform duration-500 group-hover:scale-x-100 rtl:origin-right"
                />

                <div className="flex items-center justify-between gap-3">
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-glacier-400 to-steel text-white shadow-[0_8px_20px_-6px_rgb(44_186_226/0.6)] transition-transform duration-300 group-hover:rotate-6">
                    <Icon name={coverageIcons[index % coverageIcons.length]} size={24} />
                  </span>
                  <span aria-hidden="true" className="tabular font-display text-3xl font-bold text-navy-50">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <h3 className="mt-5 text-xl">{tier.region}</h3>

                <dl className="mt-5 flex flex-1 flex-col gap-4 border-t border-hairline pt-5 text-sm">
                  <div>
                    <dt className="flex items-center gap-2 text-2xs font-semibold uppercase tracking-[0.16em] text-glacier-600">
                      <Icon name="clock" size={16} />
                      {d.services.coverage.responseLabel}
                    </dt>
                    <dd className="mt-1.5 inline-flex rounded-lg bg-glacier-100 px-3 py-1.5 font-semibold text-glacier-800 ring-1 ring-glacier-200/60">
                      {tier.response}
                    </dd>
                  </div>
                  <div>
                    <dt className="flex items-center gap-2 text-2xs font-semibold uppercase tracking-[0.16em] text-glacier-600">
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

      {/* Request service */}
      <Section ground="deep" id="request-service" aria-labelledby="service-form-heading">
        <PhotoBackdrop src="/images/gallery-warehouse.jpg" />
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
