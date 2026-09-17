import type { Metadata } from "next";
import { LegalPage } from "@/components/sections/LegalPage";
import { privacy } from "@/lib/content/legal";
import { getDictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n/config";

export async function generateMetadata(props: PageProps<"/[locale]/privacy">): Promise<Metadata> {
  const { locale } = await props.params;
  const document = privacy[locale as Locale];
  return {
    title: document.title,
    description: document.intro,
    alternates: { canonical: `/${locale}/privacy` },
  };
}

export default async function PrivacyPage(props: PageProps<"/[locale]/privacy">) {
  const { locale } = await props.params;
  const typedLocale = locale as Locale;
  const d = getDictionary(locale);

  return (
    <LegalPage
      document={privacy[typedLocale]}
      locale={typedLocale}
      breadcrumbLabel={d.footer.legal.privacy}
    />
  );
}
