import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { Section, SectionHeading, Shell } from "@/components/ui/Section";
import { type IconName } from "@/components/ui/Icon";
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

    </>
  );
}
