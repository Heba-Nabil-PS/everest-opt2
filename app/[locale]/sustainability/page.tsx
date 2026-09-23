import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { Section, SectionHeading, Shell } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/ui/Icon";
import { PhotoBackdrop } from "@/components/ui/PhotoBackdrop";
import { Reveal } from "@/components/motion/Reveal";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { site } from "@/lib/data/site";
import { getDictionary } from "@/lib/i18n";
import { localePath, type Locale } from "@/lib/i18n/config";
import { StructureExplorer } from "@/components/sections/StructureExplorer";

/**
 * One icon per core structure, in dictionary order: quality, product safety,
 * environment, occupational health and safety, labour, testing laboratory,
 * product marking, fair business practice.
 */
const pillarIcons: IconName[] = [
  "star",
  "shield",
  "leaf",
  "users",
  "building",
  "gauge",
  "document",
  "lock",
];

/**
 * The certificate that evidences each core structure, keyed by its position
 * in the dictionary. Labour practices, product marking and fair business
 * practice carry no certificate of their own.
 */
const structureCertificates: Record<number, string> = {
  0: "/images/certifications/iso-9001.webp",
  1: "/images/certifications/cb-iec-60335.webp",
  2: "/images/certifications/iso-14001.webp",
  3: "/images/certifications/iso-45001.webp",
  5: "/images/certifications/iso-17025.webp",
};

const certificationIcons: IconName[] = ["star", "leaf", "users", "gauge", "shield", "document"];

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

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: d.common.home, url: `${site.url}${path("/")}` },
          { name: d.nav.sustainability, url: `${site.url}${path("/sustainability")}` },
        ]}
      />

      <PageHero
        image="/images/esg-nature.jpg"
        eyebrow={s.hero.eyebrow}
        title={s.hero.headline}
        subline={s.hero.subline}
        crumbLabel={d.a11y.breadcrumb}
        crumbs={[{ label: d.common.home, href: path("/") }, { label: d.nav.sustainability }]}
      >
        {/* The three certifications a supplier file asks for first */}
        <dl className="mt-10 grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3">
          {s.certifications.items.slice(0, 3).map((item) => (
            <div key={item.code} className="glass-dark flex flex-col-reverse rounded-2xl p-5">
              <dt className="text-sm text-glacier-200">{item.label}</dt>
              <dd className="ltr-inline font-display text-2xl font-bold text-white">{item.code}</dd>
            </div>
          ))}
        </dl>
      </PageHero>

      {/* Approach */}
      <Section tight aria-labelledby="approach-heading" className="overflow-hidden">
        <div aria-hidden="true" className="absolute -end-32 -top-32 -z-10 h-96 w-96 rounded-full bg-energy/20 blur-3xl" />
        <Shell className="grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:items-start">
          <SectionHeading
            id="approach-heading"
            eyebrow={s.intro.eyebrow}
            title={s.intro.heading}
          />
          <Reveal as="div" stagger className="flex flex-col gap-5">
            {s.intro.paragraphs.map((paragraph) => (
              <p key={paragraph} className="max-w-[68ch] text-lg text-ink-muted">
                {paragraph}
              </p>
            ))}
          </Reveal>
        </Shell>
      </Section>

      {/* Certifications and accreditations */}
      <Section tight ground="frost" aria-labelledby="certifications-heading" className="overflow-hidden">
        <div aria-hidden="true" className="bg-grid absolute inset-0 -z-10" />
        <Shell>
          <SectionHeading
            id="certifications-heading"
            title={s.certifications.heading}
            intro={s.certifications.intro}
            align="center"
            className="mx-auto"
          />

          {/* A compact ledger of what Everest holds. The documents themselves
              live with the structure they evidence, in the explorer below. */}
          <Reveal as="ul" stagger className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {s.certifications.items.map((item, index) => (
              <li
                key={item.code}
                className="glass-panel glass-spot glass-hover group relative flex h-full items-start gap-4 overflow-hidden rounded-2xl p-5"
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-glacier-400 to-steel transition-transform duration-500 group-hover:scale-x-100 rtl:origin-right"
                />
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-glacier-400 to-steel text-white shadow-[0_8px_20px_-6px_rgb(44_186_226/0.6)] transition-transform duration-300 group-hover:rotate-6">
                  <Icon name={certificationIcons[index % certificationIcons.length]} size={24} />
                </span>
                <span className="min-w-0">
                  <span className="ltr-inline block font-display text-lg font-bold text-ink-strong">
                    {item.code}
                  </span>
                  <span className="mt-0.5 block text-sm font-medium text-glacier-300">{item.label}</span>
                  <span className="mt-1.5 block text-sm text-ink-muted">{item.detail}</span>
                </span>
              </li>
            ))}
          </Reveal>
        </Shell>
      </Section>

      {/* The eight core structures */}
      <Section tight aria-labelledby="pillars-heading">
        <Shell>
          <SectionHeading
            id="pillars-heading"
            title={s.pillars.heading}
            intro={s.pillars.intro}
            align="center"
            className="mx-auto"
          />

          <StructureExplorer
            items={s.pillars.items}
            icons={pillarIcons}
            certificates={structureCertificates}
            viewLabel={s.certifications.viewLabel}
            labels={{
              zoomIn: d.a11y.zoomIn,
              zoomOut: d.a11y.zoomOut,
              resetZoom: d.a11y.resetZoom,
              zoomHint: d.a11y.zoomHint,
              closeDialog: d.a11y.closeDialog,
            }}
            className="mt-10"
          />
        </Shell>
      </Section>

      {/* Testing laboratory */}
      <Section tight ground="deep" aria-labelledby="lab-heading">
        <PhotoBackdrop src="/images/rnd-lab.jpg" position="center 60%" />
        <Shell className="relative">
          <p className="text-2xs font-semibold uppercase tracking-[0.18em] text-glacier-300">{s.lab.eyebrow}</p>
          <h2 id="lab-heading" className="mt-3 max-w-[26ch] text-3xl text-white lg:text-4xl">
            {s.lab.heading}
          </h2>
          <p className="mt-5 max-w-[70ch] text-ink-inverse-muted">{s.lab.body}</p>

          <Reveal as="dl" stagger className="mt-12 grid gap-8 sm:grid-cols-3">
            {s.lab.stats.map((stat) => (
              <div key={stat.label} className="flex flex-col-reverse border-s-2 border-energy ps-5">
                <dt className="mt-2 text-sm text-white/75">{stat.label}</dt>
                <dd className="ltr-inline font-display text-4xl font-bold text-white">{stat.value}</dd>
              </div>
            ))}
          </Reveal>
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
              href={path("/resources#certifications")}
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
