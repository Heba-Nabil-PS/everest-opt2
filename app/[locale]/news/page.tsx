import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { Section, Shell } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { NewsCard } from "@/components/sections/NewsCard";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { news } from "@/lib/data/news";
import { site } from "@/lib/data/site";
import { getDictionary } from "@/lib/i18n";
import { localePath, type Locale } from "@/lib/i18n/config";

export async function generateMetadata(props: PageProps<"/[locale]/news">): Promise<Metadata> {
  const { locale } = await props.params;
  const d = getDictionary(locale);
  return {
    title: d.news.meta.title,
    description: d.news.meta.description,
    alternates: { canonical: `/${locale}/news` },
  };
}

export default async function NewsPage(props: PageProps<"/[locale]/news">) {
  const { locale } = await props.params;
  const typedLocale = locale as Locale;
  const d = getDictionary(locale);
  const path = (p: string) => localePath(typedLocale, p);
  const sorted = [...news].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: d.common.home, url: `${site.url}${path("/")}` },
          { name: d.nav.news, url: `${site.url}${path("/news")}` },
        ]}
      />

      <PageHero
        image="/images/news-desk.jpg"
        eyebrow={d.news.hero.eyebrow}
        title={d.news.hero.headline}
        subline={d.news.hero.subline}
        crumbLabel={d.a11y.breadcrumb}
        crumbs={[{ label: d.common.home, href: path("/") }, { label: d.nav.news }]}
      />

      <Section aria-labelledby="news-list-heading">
        <Shell>
          <h2 id="news-list-heading" className="sr-only">
            {d.nav.news}
          </h2>

          <Reveal as="ul" stagger className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {sorted.map((article) => (
              <li key={article.slug} className="h-full">
                <NewsCard article={article} locale={typedLocale} dictionary={d} />
              </li>
            ))}
          </Reveal>
        </Shell>
      </Section>
    </>
  );
}
