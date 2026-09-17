import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/sections/PageHero";
import { Section, SectionHeading, Shell } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/motion/Reveal";
import { CareerForm } from "@/components/forms/CareerForm";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { SPECULATIVE_SLUG, vacancies, vacancyBySlug } from "@/lib/data/careers";
import { site } from "@/lib/data/site";
import { getDictionary } from "@/lib/i18n";
import { localePath, locales, type Locale } from "@/lib/i18n/config";

/** One glyph per benefit, in dictionary order: medical, travel, training, transport, bonus, gratuity. */
const benefitIcons: IconName[] = ["shield", "globe", "star", "users", "bolt", "calendar"];

export function generateStaticParams() {
  return locales.flatMap((locale) => [
    ...vacancies.map((vacancy) => ({ locale, slug: vacancy.slug })),
    { locale, slug: SPECULATIVE_SLUG },
  ]);
}

export async function generateMetadata(
  props: PageProps<"/[locale]/careers/[slug]">,
): Promise<Metadata> {
  const { locale, slug } = await props.params;
  const typedLocale = locale as Locale;
  const d = getDictionary(locale);

  if (slug === SPECULATIVE_SLUG) {
    return {
      title: d.careers.speculative.pageTitle,
      description: d.careers.speculative.pageSubline,
      alternates: { canonical: `/${locale}/careers/${slug}` },
    };
  }

  const vacancy = vacancyBySlug.get(slug);
  if (!vacancy) return {};

  return {
    title: `${vacancy.title[typedLocale]} | ${d.nav.careers}`,
    description: vacancy.summary[typedLocale],
    alternates: { canonical: `/${locale}/careers/${slug}` },
  };
}

export default async function VacancyPage(props: PageProps<"/[locale]/careers/[slug]">) {
  const { locale, slug } = await props.params;
  const isSpeculative = slug === SPECULATIVE_SLUG;
  const vacancy = vacancyBySlug.get(slug);
  if (!vacancy && !isSpeculative) notFound();

  const typedLocale = locale as Locale;
  const d = getDictionary(locale);
  const path = (p: string) => localePath(typedLocale, p);

  const title = vacancy ? vacancy.title[typedLocale] : d.careers.speculative.pageTitle;
  const url = `${site.url}${path(`/careers/${slug}`)}`;

  const roleOptions = [
    ...vacancies.map((item) => ({ value: item.title[typedLocale], label: item.title[typedLocale] })),
    { value: d.careers.form.speculative, label: d.careers.form.speculative },
  ];

  const otherRoles = vacancies.filter((item) => item.slug !== slug).slice(0, 3);

  const facts: { icon: IconName; label: string; value: string }[] = vacancy
    ? [
        { icon: "building", label: d.careers.vacancies.departmentLabel, value: vacancy.department[typedLocale] },
        { icon: "pin", label: d.careers.vacancies.locationLabel, value: vacancy.location[typedLocale] },
        { icon: "clock", label: d.careers.vacancies.typeLabel, value: vacancy.type[typedLocale] },
      ]
    : [];

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: d.common.home, url: `${site.url}${path("/")}` },
          { name: d.nav.careers, url: `${site.url}${path("/careers")}` },
          { name: title, url },
        ]}
      />

      <PageHero
        image="/images/careers-team.jpg"
        eyebrow={vacancy ? vacancy.department[typedLocale] : d.careers.hero.eyebrow}
        title={title}
        subline={vacancy ? vacancy.summary[typedLocale] : d.careers.speculative.pageSubline}
        crumbLabel={d.a11y.breadcrumb}
        crumbs={[
          { label: d.common.home, href: path("/") },
          { label: d.nav.careers, href: path("/careers") },
          { label: title },
        ]}
      >
        {vacancy ? (
          <p className="mt-6 flex flex-wrap items-center gap-2">
            <Badge tone="inverse" icon="pin">
              {vacancy.location[typedLocale]}
            </Badge>
            <Badge tone="inverse" icon="clock">
              {vacancy.type[typedLocale]}
            </Badge>
          </p>
        ) : null}
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href={path("/careers#vacancies")} variant="inverse" icon="arrowLeft" iconLeading>
            {d.careers.detail.backToVacancies}
          </ButtonLink>
          <ButtonLink href="#apply" icon="arrowRight">
            {d.careers.vacancies.applyNow}
          </ButtonLink>
        </div>
      </PageHero>

      {vacancy ? (
        <Section aria-labelledby="role-overview-heading">
          <Shell className="grid gap-12 lg:grid-cols-[1.6fr_1fr] lg:items-start">
            <div className="flex flex-col gap-12">
              <div>
                <SectionHeading id="role-overview-heading" title={d.careers.detail.overviewHeading} />
                <p className="mt-5 max-w-[62ch] text-lg text-ink-muted">{vacancy.summary[typedLocale]}</p>
              </div>

              <div className="rounded-2xl border border-hairline bg-surface p-6 lg:p-8">
                <h2 className="flex items-center gap-3 text-2xl">
                  <span className="grid h-10 w-10 place-items-center rounded-lg bg-glacier-100 text-glacier-700">
                    <Icon name="wrench" size={20} />
                  </span>
                  {d.careers.detail.responsibilitiesHeading}
                </h2>
                <Reveal as="ul" stagger className="mt-6 flex flex-col gap-3">
                  {vacancy.responsibilities.map((item) => (
                    <li key={item.en} className="flex items-start gap-3">
                      <Icon name="check" size={20} className="mt-0.5 shrink-0 text-glacier-600" />
                      <span className="text-ink">{item[typedLocale]}</span>
                    </li>
                  ))}
                </Reveal>
              </div>

              <div className="rounded-2xl border border-hairline bg-surface-muted p-6 lg:p-8">
                <h2 className="flex items-center gap-3 text-2xl">
                  <span className="grid h-10 w-10 place-items-center rounded-lg bg-navy-50 text-navy-700">
                    <Icon name="shield" size={20} />
                  </span>
                  {d.careers.detail.requirementsHeading}
                </h2>
                <Reveal as="ul" stagger className="mt-6 flex flex-col gap-3">
                  {vacancy.requirements.map((item) => (
                    <li key={item.en} className="flex items-start gap-3">
                      <Icon name="check" size={20} className="mt-0.5 shrink-0 text-glacier-600" />
                      <span className="text-ink">{item[typedLocale]}</span>
                    </li>
                  ))}
                </Reveal>
              </div>
            </div>

            <aside className="rounded-2xl bg-deep p-7 text-white lg:sticky lg:top-28">
              <h2 className="text-xl text-white">{d.careers.detail.summaryHeading}</h2>
              <dl className="mt-6 flex flex-col gap-5">
                {facts.map((fact) => (
                  <div key={fact.label} className="flex items-start gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-white/10 text-glacier-300">
                      <Icon name={fact.icon} size={20} />
                    </span>
                    <div>
                      <dt className="text-2xs font-semibold uppercase tracking-[0.16em] text-glacier-300">
                        {fact.label}
                      </dt>
                      <dd className="mt-0.5 text-white">{fact.value}</dd>
                    </div>
                  </div>
                ))}
              </dl>
              <ButtonLink href="#apply" fullWidth icon="arrowRight" className="mt-8">
                {d.careers.vacancies.applyNow}
              </ButtonLink>
              <p className="mt-5 text-sm text-ink-inverse-muted">{d.careers.detail.shareNote}</p>
            </aside>
          </Shell>
        </Section>
      ) : null}

      {/* Application */}
      {/* One photograph per page (the header); the application sits on a calm ground. */}
      <Section ground="frost" id="apply" aria-labelledby="apply-heading" className="scroll-mt-32 overflow-hidden">
        <div aria-hidden="true" className="bg-grid absolute inset-0 -z-10 opacity-60" />
        <div aria-hidden="true" className="absolute -end-40 top-20 -z-10 h-[28rem] w-[28rem] rounded-full bg-glacier-200/50 blur-3xl" />
        <Shell className="relative grid gap-12 lg:grid-cols-[1fr_1.25fr] lg:items-start">
          <div className="lg:sticky lg:top-28">
            <SectionHeading
              id="apply-heading"
              eyebrow={d.careers.form.heading}
              title={title}
              intro={d.careers.form.body}
            />

            <div className="mt-8 rounded-2xl bg-deep p-6 text-white shadow-lg">
              <p className="text-2xs font-semibold uppercase tracking-[0.16em] text-glacier-300">
                {d.careers.benefits.heading}
              </p>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {d.careers.benefits.items.map((benefit, index) => (
                  <li key={benefit} className="flex items-start gap-3 text-sm text-white/85">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/10 text-glacier-300">
                      <Icon name={benefitIcons[index % benefitIcons.length]} size={16} />
                    </span>
                    <span className="pt-1.5">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="rounded-3xl bg-surface p-6 shadow-xl ring-1 ring-hairline lg:p-10">
            <CareerForm
              locale={typedLocale}
              dictionary={d}
              roles={roleOptions}
              defaultRole={vacancy ? vacancy.title[typedLocale] : d.careers.form.speculative}
            />
          </div>
        </Shell>
      </Section>

      {otherRoles.length > 0 ? (
        <Section ground="muted" aria-labelledby="other-roles-heading">
          <Shell>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionHeading id="other-roles-heading" title={d.careers.detail.otherRolesHeading} />
              <ButtonLink href={path("/careers#vacancies")} variant="ghost" icon="arrowRight">
                {d.cta.viewVacancies}
              </ButtonLink>
            </div>
            <ul className="mt-10 grid gap-5 md:grid-cols-3">
              {otherRoles.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={path(`/careers/${item.slug}`)}
                    className="group flex h-full flex-col rounded-2xl border border-hairline bg-surface p-6 no-underline transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-1 hover:border-glacier-300 hover:shadow-lg"
                  >
                    <span className="text-2xs font-semibold uppercase tracking-[0.16em] text-glacier-600">
                      {item.department[typedLocale]}
                    </span>
                    <span className="mt-3 font-display text-lg font-semibold text-ink-strong">
                      {item.title[typedLocale]}
                    </span>
                    <span className="mt-2 inline-flex items-center gap-1.5 text-sm text-ink-muted">
                      <Icon name="pin" size={16} />
                      {item.location[typedLocale]}
                    </span>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-glacier-600">
                      {d.careers.vacancies.viewDetails}
                      <Icon
                        name="arrowRight"
                        size={16}
                        className="transition-transform duration-200 group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1"
                      />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Shell>
        </Section>
      ) : null}
    </>
  );
}
