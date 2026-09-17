import { PageHero } from "@/components/sections/PageHero";
import { Section, Shell } from "@/components/ui/Section";
import { getDictionary } from "@/lib/i18n";
import { localePath, type Locale } from "@/lib/i18n/config";
import { formatDate } from "@/lib/utils";
import type { LegalDocument } from "@/lib/content/legal";

/** Shared layout for the two legal pages, so they stay identical in structure. */
export function LegalPage({
  document,
  locale,
  breadcrumbLabel,
}: {
  document: LegalDocument;
  locale: Locale;
  breadcrumbLabel: string;
}) {
  const d = getDictionary(locale);
  const path = (p: string) => localePath(locale, p);

  return (
    <>
      <PageHero
        ground="frost"
        eyebrow={d.meta.legalName}
        title={document.title}
        subline={document.intro}
        crumbLabel={d.a11y.breadcrumb}
        crumbs={[{ label: d.common.home, href: path("/") }, { label: breadcrumbLabel }]}
      >
        <p className="mt-6 text-sm text-ink-muted">
          {d.common.published}: <time dateTime={document.updated}>{formatDate(document.updated, locale)}</time>
        </p>
      </PageHero>

      <Section>
        <Shell>
          <div className="max-w-[72ch]">
            {document.sections.map((section) => (
              <section key={section.heading} className="mb-10">
                <h2 className="text-2xl">{section.heading}</h2>
                <div className="mt-4 flex flex-col gap-4 text-ink-muted">
                  {section.body.map((paragraph) => (
                    <p key={paragraph.slice(0, 24)}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </Shell>
      </Section>
    </>
  );
}
