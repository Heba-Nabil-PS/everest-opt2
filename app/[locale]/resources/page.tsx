import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { Section, SectionHeading, Shell } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Tabs } from "@/components/ui/Tabs";
import { Accordion } from "@/components/ui/Accordion";
import { CatalogueForm } from "@/components/forms/CatalogueForm";
import { MediaGallery } from "@/components/sections/MediaGallery";
import { PhotoBackdrop } from "@/components/ui/PhotoBackdrop";
import { BreadcrumbJsonLd, FaqJsonLd } from "@/components/seo/JsonLd";
import { allBrochures, allManuals, allSpecSheets, type DocumentRef } from "@/lib/data/documents";
import { certifications, site } from "@/lib/data/site";
import { gallery } from "@/lib/data/company";
import { getDictionary, t } from "@/lib/i18n";
import { localePath, type Locale } from "@/lib/i18n/config";

export async function generateMetadata(props: PageProps<"/[locale]/resources">): Promise<Metadata> {
  const { locale } = await props.params;
  const d = getDictionary(locale);
  return {
    title: d.resources.meta.title,
    description: d.resources.meta.description,
    alternates: { canonical: `/${locale}/resources` },
  };
}

export default async function ResourcesPage(props: PageProps<"/[locale]/resources">) {
  const { locale } = await props.params;
  const typedLocale = locale as Locale;
  const d = getDictionary(locale);
  const path = (p: string) => localePath(typedLocale, p);

  const documentList = (documents: DocumentRef[]) => (
    <ul className="grid gap-4 md:grid-cols-2">
      {documents.map((document) => (
        <li key={document.id}>
          <a
            href={document.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-full items-start gap-4 rounded-xl border border-hairline bg-surface p-5 no-underline transition-[border-color,box-shadow] hover:border-glacier-300 hover:shadow-sm"
          >
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-glacier-100 text-glacier-700">
              <Icon name="document" size={20} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-display font-semibold text-ink-strong">
                {document.title[typedLocale]}
              </span>
              <span className="mt-1 block text-sm text-ink-muted">
                {document.description[typedLocale]}
              </span>
              <span className="ltr-inline mt-2 block text-xs text-ink-muted">
                {t(d.resources.documentMeta, { type: document.fileType, size: document.size })}
              </span>
            </span>
            <Icon name="download" size={20} className="shrink-0 text-glacier-600" />
          </a>
        </li>
      ))}
    </ul>
  );

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: d.common.home, url: `${site.url}${path("/")}` },
          { name: d.nav.resources, url: `${site.url}${path("/resources")}` },
        ]}
      />
      <FaqJsonLd items={d.resources.faqs.items.map((item) => ({ q: item.q, a: item.a }))} />

      <PageHero
        image="/images/resources-docs.jpg"
        eyebrow={d.resources.hero.eyebrow}
        title={d.resources.hero.headline}
        subline={d.resources.hero.subline}
        crumbLabel={d.a11y.breadcrumb}
        crumbs={[{ label: d.common.home, href: path("/") }, { label: d.nav.resources }]}
      />

      <Section aria-labelledby="library-heading">
        <Shell>
          <h2 id="library-heading" className="sr-only">
            {d.nav.resources}
          </h2>

          <Tabs
            items={[
              {
                id: "brochures",
                label: d.resources.tabs.brochures,
                content: (
                  <div id="brochures" className="scroll-mt-32">
                    {documentList(allBrochures(typedLocale))}
                  </div>
                ),
              },
              {
                id: "manuals",
                label: d.resources.tabs.manuals,
                content: (
                  <div id="manuals" className="flex scroll-mt-32 flex-col gap-10">
                    <div>
                      <h3 className="mb-5 text-xl">{d.cta.downloadSpecSheet}</h3>
                      {documentList(allSpecSheets(typedLocale))}
                    </div>
                    <div>
                      <h3 className="mb-5 text-xl">{d.cta.downloadManual}</h3>
                      {documentList(allManuals(typedLocale))}
                    </div>
                  </div>
                ),
              },
              {
                id: "certifications",
                label: d.resources.tabs.certifications,
                content: (
                  <ul id="certifications" className="grid scroll-mt-32 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {certifications.map((cert) => (
                      <li
                        key={cert.id}
                        className="flex h-full flex-col gap-3 rounded-xl border border-hairline bg-surface p-6"
                      >
                        <span className="grid h-12 w-12 place-items-center rounded-lg bg-navy-700 text-glacier-300">
                          <Icon name="shield" size={24} />
                        </span>
                        <span className="ltr-inline font-display text-lg font-semibold text-ink-strong">
                          {cert.standard}
                        </span>
                        <span className="font-medium text-glacier-600">
                          {cert.title[typedLocale]}
                        </span>
                        <span className="text-sm text-ink-muted">{cert.scope[typedLocale]}</span>
                        {/* The certificate itself is issued by the registrar, so
                            the action is a real request, not a fabricated PDF. */}
                        <ButtonLink
                          href={path("/contact?subject=certificate")}
                          variant="ghost"
                          size="sm"
                          icon="arrowRight"
                          className="mt-auto self-start"
                        >
                          {d.cta.submitInquiry}
                        </ButtonLink>
                      </li>
                    ))}
                  </ul>
                ),
              },
              {
                id: "faqs",
                label: d.resources.tabs.faqs,
                content: (
                  <div id="faqs" className="scroll-mt-32">
                    <SectionHeading
                      as="h3"
                      title={d.resources.faqs.heading}
                      intro={d.resources.faqs.intro}
                    />
                    <Accordion
                      className="mt-8"
                      items={d.resources.faqs.items.map((item) => ({
                        question: item.q,
                        answer: item.a,
                      }))}
                    />
                  </div>
                ),
              },
              {
                /* The gallery is one more thing the library holds, so it is a
                   tab rather than a separate section repeating the same
                   "pick a category" gesture further down the page. */
                id: "gallery",
                label: d.resources.tabs.gallery,
                content: (
                  <div id="gallery" className="scroll-mt-32">
                    <SectionHeading
                      as="h3"
                      title={d.resources.gallery.heading}
                      intro={d.resources.gallery.intro}
                    />
                    <div className="mt-8">
                      <MediaGallery items={gallery} locale={typedLocale} dictionary={d} />
                    </div>
                  </div>
                ),
              },
            ]}
          />
        </Shell>
      </Section>

      {/* The one gated download */}
      <Section ground="deep" id="catalogue" aria-labelledby="catalogue-heading">
        <PhotoBackdrop src="/images/resources-docs.jpg" />
        <Shell className="relative grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-start">
          <SectionHeading
            id="catalogue-heading"
            title={d.resources.catalogue.heading}
            intro={d.resources.catalogue.body}
            inverse
          />
          <div className="form-dark glass-dark rounded-2xl p-6 lg:p-8">
            <CatalogueForm locale={typedLocale} dictionary={d} />
          </div>
        </Shell>
      </Section>
    </>
  );
}
