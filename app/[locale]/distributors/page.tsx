import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { Section, SectionHeading, Shell } from "@/components/ui/Section";
import { PhotoBackdrop } from "@/components/ui/PhotoBackdrop";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/motion/Reveal";
import { DistributorForm } from "@/components/forms/DistributorForm";
import { WorldMap } from "@/components/art/WorldMap";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { markets } from "@/lib/data/markets";
import { site } from "@/lib/data/site";
import { getDictionary } from "@/lib/i18n";
import { localePath, type Locale } from "@/lib/i18n/config";

export async function generateMetadata(
  props: PageProps<"/[locale]/distributors">,
): Promise<Metadata> {
  const { locale } = await props.params;
  const d = getDictionary(locale);
  return {
    title: d.distributors.meta.title,
    description: d.distributors.meta.description,
    alternates: { canonical: `/${locale}/distributors` },
  };
}

export default async function DistributorsPage(props: PageProps<"/[locale]/distributors">) {
  const { locale } = await props.params;
  const typedLocale = locale as Locale;
  const d = getDictionary(locale);
  const path = (p: string) => localePath(typedLocale, p);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: d.common.home, url: `${site.url}${path("/")}` },
          { name: d.cta.becomeDistributor, url: `${site.url}${path("/distributors")}` },
        ]}
      />

      <PageHero
        image="/images/gallery-warehouse.jpg"
        eyebrow={d.distributors.hero.eyebrow}
        title={d.distributors.hero.headline}
        subline={d.distributors.hero.subline}
        crumbLabel={d.a11y.breadcrumb}
        crumbs={[{ label: d.common.home, href: path("/") }, { label: d.cta.becomeDistributor }]}
        aside={
          <div className="rounded-2xl border border-white/12 bg-white/[0.04] p-4">
            <WorldMap markets={markets} locale={typedLocale} label={d.presence.mapHeading} statusLabels={d.presence.statusLabels} />
          </div>
        }
      />

      <Section aria-labelledby="offer-heading">
        <Shell className="grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading id="offer-heading" title={d.distributors.offerHeading} />
            <Reveal as="ul" stagger className="mt-8 flex flex-col gap-5">
              {d.distributors.offer.map((item) => (
                <li key={item.title} className="flex gap-4">
                  <span className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-glacier-100 text-glacier-700">
                    <Icon name="check" size={20} />
                  </span>
                  <span>
                    <span className="block font-display font-semibold text-ink-strong">
                      {item.title}
                    </span>
                    <span className="mt-1 block text-ink-muted">{item.body}</span>
                  </span>
                </li>
              ))}
            </Reveal>
          </div>

          <div>
            <SectionHeading as="h2" title={d.distributors.expectHeading} />
            <Reveal as="ul" stagger className="mt-8 flex flex-col gap-3">
              {d.distributors.expect.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 rounded-lg border border-hairline bg-surface-muted p-4"
                >
                  <Icon name="check" size={20} className="mt-0.5 shrink-0 text-glacier-600" />
                  <span className="text-ink">{item}</span>
                </li>
              ))}
            </Reveal>
          </div>
        </Shell>
      </Section>

      <Section ground="deep" id="apply" aria-labelledby="distributor-form-heading">
        <PhotoBackdrop src="/images/presence-port.jpg" />
        <Shell className="relative grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-start">
          <SectionHeading
            id="distributor-form-heading"
            title={d.distributors.formHeading}
            intro={d.distributors.formBody}
            inverse
          />
          <div className="form-dark glass-dark rounded-2xl p-6 lg:p-8">
            <DistributorForm locale={typedLocale} dictionary={d} />
          </div>
        </Shell>
      </Section>
    </>
  );
}
