import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { Section, SectionHeading, Shell } from "@/components/ui/Section";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/motion/Reveal";
import { CustomizeWizard } from "@/components/forms/CustomizeWizard";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { site } from "@/lib/data/site";
import { getDictionary } from "@/lib/i18n";
import { localePath, type Locale } from "@/lib/i18n/config";

export async function generateMetadata(props: PageProps<"/[locale]/customize">): Promise<Metadata> {
  const { locale } = await props.params;
  const d = getDictionary(locale);
  return {
    title: d.customize.meta.title,
    description: d.customize.meta.description,
    alternates: { canonical: `/${locale}/customize` },
  };
}

export default async function CustomizePage(props: PageProps<"/[locale]/customize">) {
  const { locale } = await props.params;
  const typedLocale = locale as Locale;
  const d = getDictionary(locale);
  const path = (p: string) => localePath(typedLocale, p);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: d.common.home, url: `${site.url}${path("/")}` },
          { name: d.cta.customizeFridge, url: `${site.url}${path("/customize")}` },
        ]}
      />

      <PageHero
        image="/images/gallery-assembly.jpg"
        eyebrow={d.customize.hero.eyebrow}
        title={d.customize.hero.headline}
        subline={d.customize.hero.subline}
        crumbLabel={d.a11y.breadcrumb}
        crumbs={[{ label: d.common.home, href: path("/") }, { label: d.cta.customizeFridge }]}
      />

      <Section>
        <Shell className="grid gap-12 lg:grid-cols-[1.3fr_1fr] lg:items-start">
          <div className="rounded-2xl border border-hairline bg-surface p-6 lg:p-8">
            <h2 className="sr-only">{d.customize.stepsHeading}</h2>
            <CustomizeWizard locale={typedLocale} dictionary={d} />
          </div>

          <aside>
            <SectionHeading as="h2" title={d.customize.capabilitiesHeading} />
            <Reveal as="ul" stagger className="mt-6 flex flex-col gap-3">
              {d.innovation.customisation.items.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 rounded-lg border border-hairline bg-surface-muted p-4 text-sm"
                >
                  <Icon name="check" size={20} className="mt-0.5 shrink-0 text-glacier-600" />
                  <span className="text-ink">{item}</span>
                </li>
              ))}
            </Reveal>
          </aside>
        </Shell>
      </Section>
    </>
  );
}
