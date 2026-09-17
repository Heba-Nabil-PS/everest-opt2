import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading, Shell } from "@/components/ui/Section";
import { NewsFeature } from "@/components/sections/NewsFeature";
import { NewsStoryCard } from "@/components/sections/NewsStoryCard";
import { latestNews } from "@/lib/data/news";
import { localePath, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n";

/**
 * Latest news as an editorial spread rather than a row of equal cards.
 *
 *   heading            the section's opening statement, with the way out of
 *                      the section set against it on the same line
 *   feature + three    the newest story at full picture size, three supporting
 *                      stories turned on their side beside it on wide screens,
 *                      stacked under it on narrow ones
 *
 * The entrance is choreographed rather than a single fade: heading, then the
 * feature's picture, then its headline, then the supporting stories in
 * sequence — each step is a `Reveal`/`ImageReveal` delay, so reduced motion
 * and a failed script both land on the finished composition.
 */
export function NewsGlass({ locale, dictionary: d }: { locale: Locale; dictionary: Dictionary }) {
  const n = d.home.news;
  const articles = latestNews(4);
  if (articles.length === 0) return null;

  /* The lead story is the newest flagged one, else simply the newest. */
  const feature = articles.find((article) => article.featured) ?? articles[0];
  const beside = articles.filter((article) => article.slug !== feature.slug);

  return (
    <section aria-labelledby="news-heading" className="relative overflow-hidden py-12 lg:py-16">
      <Shell>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between sm:gap-10">
          <SectionHeading id="news-heading" eyebrow={n.eyebrow} title={n.heading} inverse />

          <Reveal animation="fade" delay={0.2} className="shrink-0 sm:pb-1">
            <Link
              href={localePath(locale, "/news")}
              className="group inline-flex min-h-11 items-center gap-3 text-sm font-semibold text-glacier-300 no-underline"
            >
              <span className="link-underline">{n.cta}</span>
              <Icon
                name="arrowRight"
                size={16}
                className="transition-transform duration-500 ease-[var(--ease-smooth)] motion-safe:group-hover:translate-x-1 motion-safe:group-focus-visible:translate-x-1 rtl:-scale-x-100 rtl:motion-safe:group-hover:-translate-x-1"
              />
            </Link>
          </Reveal>
        </div>

        <div className="mt-10 grid gap-8 lg:mt-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <NewsFeature article={feature} locale={locale} dictionary={d} />
          </div>

          {beside.length > 0 ? (
            <Reveal
              stagger
              delay={0.45}
              className="grid gap-8 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1 lg:content-start lg:gap-10"
            >
              {beside.map((article) => (
                <NewsStoryCard
                  key={article.slug}
                  article={article}
                  locale={locale}
                  dictionary={d}
                  layout="split"
                  sizes="(min-width: 1024px) 16vw, (min-width: 640px) 45vw, 100vw"
                />
              ))}
            </Reveal>
          ) : null}
        </div>
      </Shell>
    </section>
  );
}
