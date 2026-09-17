import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/sections/PageHero";
import { Section, SectionHeading, Shell } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { NewsCard } from "@/components/sections/NewsCard";
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { news, newsBySlug, relatedNews } from "@/lib/data/news";
import { site } from "@/lib/data/site";
import { getDictionary, t } from "@/lib/i18n";
import { localePath, locales, type Locale } from "@/lib/i18n/config";
import { formatDate } from "@/lib/utils";

export function generateStaticParams() {
  return locales.flatMap((locale) => news.map((article) => ({ locale, slug: article.slug })));
}

export async function generateMetadata(
  props: PageProps<"/[locale]/news/[slug]">,
): Promise<Metadata> {
  const { locale, slug } = await props.params;
  const article = newsBySlug.get(slug);
  if (!article) return {};

  const typedLocale = locale as Locale;
  return {
    title: article.title[typedLocale],
    description: article.summary[typedLocale],
    alternates: { canonical: `/${locale}/news/${slug}` },
    openGraph: {
      type: "article",
      publishedTime: article.date,
      title: article.title[typedLocale],
      description: article.summary[typedLocale],
    },
  };
}

export default async function ArticlePage(props: PageProps<"/[locale]/news/[slug]">) {
  const { locale, slug } = await props.params;
  const article = newsBySlug.get(slug);
  if (!article) notFound();

  const typedLocale = locale as Locale;
  const d = getDictionary(locale);
  const path = (p: string) => localePath(typedLocale, p);
  const related = relatedNews(slug, 3);
  const url = `${site.url}${path(`/news/${slug}`)}`;

  return (
    <>
      <ArticleJsonLd
        headline={article.title[typedLocale]}
        description={article.summary[typedLocale]}
        datePublished={article.date}
        url={url}
      />
      <BreadcrumbJsonLd
        items={[
          { name: d.common.home, url: `${site.url}${path("/")}` },
          { name: d.nav.news, url: `${site.url}${path("/news")}` },
          { name: article.title[typedLocale], url },
        ]}
      />

      <PageHero
        image={article.image}
        eyebrow={d.news.topics[article.topic]}
        title={article.title[typedLocale]}
        subline={article.summary[typedLocale]}
        crumbLabel={d.a11y.breadcrumb}
        crumbs={[
          { label: d.common.home, href: path("/") },
          { label: d.nav.news, href: path("/news") },
          { label: article.title[typedLocale] },
        ]}
      >
        <p className="mt-6 flex flex-wrap items-center gap-3 text-sm text-ink-inverse-muted">
          <Badge tone="inverse">{d.common.published}</Badge>
          <time dateTime={article.date}>{formatDate(article.date, typedLocale)}</time>
          <span>· {t(d.common.readTime, { n: article.readMinutes })}</span>
        </p>
      </PageHero>

      <Section>
        <Shell className="grid gap-12 lg:grid-cols-[1.5fr_1fr] lg:items-start">
          <article className="flex flex-col gap-5 text-lg text-ink">
            {article.body[typedLocale].map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}

            <div className="mt-6 flex flex-wrap gap-3">
              <ButtonLink href={path("/news")} variant="ghost" icon="arrowLeft" iconLeading>
                {d.news.backToNews}
              </ButtonLink>
              <ButtonLink href={path("/products")} icon="arrowRight">
                {d.cta.exploreProducts}
              </ButtonLink>
            </div>
          </article>

          <aside className="overflow-hidden rounded-2xl border border-hairline">
            <div className="relative aspect-[16/10]">
              <Image src={article.image} alt="" fill sizes="(min-width: 1024px) 35vw, 100vw" className="object-cover" />
            </div>
            <div className="bg-surface-muted p-6">
              <p className="text-2xs font-semibold uppercase tracking-[0.16em] text-ink-muted">
                {d.news.shareHeading}
              </p>
              <p className="ltr-inline mt-3 break-all text-sm text-ink-muted">{url}</p>
            </div>
          </aside>
        </Shell>
      </Section>

      {related.length > 0 ? (
        <Section ground="muted" aria-labelledby="related-news-heading">
          <Shell>
            <SectionHeading id="related-news-heading" title={d.news.relatedHeading} />
            <ul className="mt-10 grid gap-6 md:grid-cols-3">
              {related.map((item) => (
                <li key={item.slug} className="h-full">
                  <NewsCard article={item} locale={typedLocale} dictionary={d} />
                </li>
              ))}
            </ul>
          </Shell>
        </Section>
      ) : null}
    </>
  );
}
