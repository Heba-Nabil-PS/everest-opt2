import type { Metadata } from "next";
import { LegalPage } from "@/components/sections/LegalPage";
import { terms } from "@/lib/content/legal";
import { getDictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n/config";

export async function generateMetadata(props: PageProps<"/[locale]/terms">): Promise<Metadata> {
  const { locale } = await props.params;
  const document = terms[locale as Locale];
  return {
    title: document.title,
    description: document.intro,
    alternates: { canonical: `/${locale}/terms` },
  };
}

export default async function TermsPage(props: PageProps<"/[locale]/terms">) {
  const { locale } = await props.params;
  const typedLocale = locale as Locale;
  const d = getDictionary(locale);

  return (
    <LegalPage
      document={terms[typedLocale]}
      locale={typedLocale}
      breadcrumbLabel={d.footer.legal.terms}
    />
  );
}
