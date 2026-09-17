import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/sections/PageHero";
import { Section, SectionHeading, Shell } from "@/components/ui/Section";
import { PhotoBackdrop } from "@/components/ui/PhotoBackdrop";
import { ButtonLink } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/motion/Reveal";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { SPECULATIVE_SLUG, vacancies } from "@/lib/data/careers";
import { site } from "@/lib/data/site";
import { getDictionary } from "@/lib/i18n";
import { localePath, type Locale } from "@/lib/i18n/config";

/** One glyph per benefit, in dictionary order: medical, travel, training, transport, bonus, gratuity. */
const benefitIcons: IconName[] = ["shield", "globe", "star", "users", "bolt", "calendar"];

export async function generateMetadata(props: PageProps<"/[locale]/careers">): Promise<Metadata> {
  const { locale } = await props.params;
  const d = getDictionary(locale);
  return {
    title: d.careers.meta.title,
    description: d.careers.meta.description,
    alternates: { canonical: `/${locale}/careers` },
  };
}

export default async function CareersPage(props: PageProps<"/[locale]/careers">) {
  const { locale } = await props.params;
  const typedLocale = locale as Locale;
  const d = getDictionary(locale);
  const path = (p: string) => localePath(typedLocale, p);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: d.common.home, url: `${site.url}${path("/")}` },
          { name: d.nav.careers, url: `${site.url}${path("/careers")}` },
        ]}
      />

      <PageHero
        image="/images/careers-team.jpg"
        eyebrow={d.careers.hero.eyebrow}
        title={d.careers.hero.headline}
        subline={d.careers.hero.subline}
        crumbLabel={d.a11y.breadcrumb}
        crumbs={[{ label: d.common.home, href: path("/") }, { label: d.nav.careers }]}
      >
        <ButtonLink href="#vacancies" className="mt-8" icon="arrowRight">
          {d.cta.viewVacancies}
        </ButtonLink>
      </PageHero>

      <Section aria-labelledby="why-heading">
        <Shell>
          <SectionHeading id="why-heading" title={d.careers.why.heading} />
          <Reveal as="ul" stagger className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {d.careers.why.items.map((item) => (
              <li
                key={item.title}
                className="flex h-full flex-col gap-3 rounded-xl border border-hairline bg-surface p-6"
              >
                <span className="grid h-11 w-11 place-items-center rounded-lg bg-glacier-100 text-glacier-700">
                  <Icon name="factory" size={20} />
                </span>
                <h3 className="text-lg">{item.title}</h3>
                <p className="text-sm text-ink-muted">{item.body}</p>
              </li>
            ))}
          </Reveal>
        </Shell>
      </Section>

      <Section ground="muted" aria-labelledby="benefits-heading" className="overflow-hidden">
        <div aria-hidden="true" className="absolute -start-32 top-10 -z-10 h-96 w-96 rounded-full bg-glacier-200/40 blur-3xl" />
        <Shell className="grid gap-12 lg:grid-cols-[1fr_1.35fr] lg:items-center">
          <div>
            <SectionHeading
              id="benefits-heading"
              eyebrow={d.careers.benefits.eyebrow}
              title={d.careers.benefits.heading}
              intro={d.careers.benefits.intro}
            />
            <div className="relative mt-8 aspect-[4/3] overflow-hidden rounded-3xl shadow-lg">
              <Image
                src="/images/team-6.jpg"
                alt=""
                fill
                sizes="(min-width: 1024px) 35vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950/70 via-transparent to-transparent" />
              <p className="absolute bottom-5 start-5 rounded-2xl bg-white/95 px-5 py-3 shadow-lg backdrop-blur-sm">
                <span className="block font-display text-2xl font-bold text-ink-strong">
                  {d.careers.benefits.tenureValue}
                </span>
                <span className="text-xs text-ink-muted">{d.careers.benefits.tenureLabel}</span>
              </p>
            </div>
          </div>

          <Reveal as="ul" stagger className="grid gap-4 sm:grid-cols-2">
            {d.careers.benefits.items.map((benefit, index) => (
              <li
                key={benefit}
                className="group relative flex h-full flex-col gap-4 overflow-hidden rounded-2xl border border-hairline bg-surface p-6 shadow-xs transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-glacier-300 hover:shadow-lg"
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-glacier-400 to-steel transition-transform duration-500 group-hover:scale-x-100 rtl:origin-right"
                />
                <div className="flex items-center justify-between">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-glacier-400 to-steel text-white shadow-[0_8px_20px_-8px_rgb(44_186_226/0.7)] transition-transform duration-300 group-hover:-rotate-6">
                    <Icon name={benefitIcons[index % benefitIcons.length]} size={24} />
                  </span>
                  <span className="tabular font-mono text-sm text-ink-muted/60">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <p className="font-medium leading-snug text-ink-strong">{benefit}</p>
              </li>
            ))}
          </Reveal>
        </Shell>
      </Section>

      {/* Vacancies */}
      <Section id="vacancies" aria-labelledby="vacancies-heading" className="scroll-mt-32">
        <Shell>
          <SectionHeading
            id="vacancies-heading"
            title={d.careers.vacancies.heading}
            intro={d.careers.vacancies.intro}
          />

          {vacancies.length === 0 ? (
            <p className="mt-10 rounded-xl border border-dashed border-hairline-strong p-10 text-center text-ink-muted">
              {d.careers.vacancies.empty}
            </p>
          ) : (
            <Reveal as="ul" stagger className="mt-10 grid gap-5 md:grid-cols-2">
              {vacancies.map((vacancy) => {
                const href = path(`/careers/${vacancy.slug}`);
                return (
                  <li key={vacancy.slug} id={vacancy.slug} className="scroll-mt-32">
                    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-hairline bg-surface p-6 shadow-xs transition-[border-color,box-shadow,transform] duration-300 ease-[var(--ease-out-soft)] hover:-translate-y-1 hover:border-glacier-300 hover:shadow-lg lg:p-8">
                      {/* Accent edge that grows on hover */}
                      <span
                        aria-hidden="true"
                        className="absolute inset-y-0 start-0 w-1 origin-top scale-y-0 bg-gradient-to-b from-glacier-400 to-steel transition-transform duration-500 group-hover:scale-y-100"
                      />

                      <div className="flex items-center justify-between gap-4">
                        <span className="text-2xs font-semibold uppercase tracking-[0.16em] text-glacier-600">
                          {vacancy.department[typedLocale]}
                        </span>
                        <Badge tone="accent" icon="clock">
                          {vacancy.type[typedLocale]}
                        </Badge>
                      </div>

                      <h3 className="mt-3 text-2xl transition-colors group-hover:text-glacier-700">
                        {/* The whole card is clickable through this stretched link. */}
                        <Link
                          href={href}
                          className="no-underline after:absolute after:inset-0 after:rounded-2xl after:content-['']"
                        >
                          {vacancy.title[typedLocale]}
                        </Link>
                      </h3>

                      <p className="mt-3 inline-flex items-center gap-1.5 text-sm text-ink-muted">
                        <Icon name="pin" size={16} className="text-glacier-600" />
                        {vacancy.location[typedLocale]}
                      </p>

                      <p className="mt-4 flex-1 text-ink-muted">{vacancy.summary[typedLocale]}</p>

                      <div className="relative mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-hairline pt-5">
                        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-glacier-600">
                          {d.careers.vacancies.viewDetails}
                          <Icon
                            name="arrowRight"
                            size={16}
                            className="transition-transform duration-200 group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1"
                          />
                        </span>
                        <ButtonLink href={`${href}#apply`} size="sm" icon="arrowRight" className="relative z-10">
                          {d.careers.vacancies.applyNow}
                        </ButtonLink>
                      </div>
                    </article>
                  </li>
                );
              })}
            </Reveal>
          )}
        </Shell>
      </Section>

      {/* Speculative applications — the form itself lives on the inner pages. */}
      <Section ground="deep" tight aria-labelledby="speculative-heading">
        <PhotoBackdrop src="/images/gallery-assembly.jpg" />
        <Shell className="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <SectionHeading
            id="speculative-heading"
            title={d.careers.speculative.heading}
            intro={d.careers.speculative.body}
            inverse
          />
          <ButtonLink
            href={path(`/careers/${SPECULATIVE_SLUG}`)}
            size="lg"
            icon="arrowRight"
            className="shrink-0"
          >
            {d.careers.speculative.cta}
          </ButtonLink>
        </Shell>
      </Section>
    </>
  );
}
