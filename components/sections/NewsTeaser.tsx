import Link from "next/link";
import { Slider } from "@/components/motion/Slider";
import { Icon } from "@/components/ui/Icon";
import { Section, SectionHeading, Shell } from "@/components/ui/Section";
import { latestNews } from "@/lib/data/news";
import { localePath, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n";
import { NewsCard } from "./NewsCard";

/**
 * Latest news as a draggable editorial row. With three stories on a wide
 * screen everything is visible and the controls stay out of the way; on
 * narrower screens it becomes a swipe carousel with progress.
 */
export function NewsTeaser({ locale, dictionary: d }: { locale: Locale; dictionary: Dictionary }) {
  const items = latestNews(6);
  const path = (p: string) => localePath(locale, p);

  return (
    <Section ground="muted" aria-labelledby="news-heading" className="overflow-hidden">
      <Shell>
        <SectionHeading id="news-heading" eyebrow={d.home.news.eyebrow} title={d.home.news.heading} />

        <Slider
          className="mt-10 lg:mt-14"
          label={d.home.news.heading}
          labels={{ previous: d.interaction.previousSlide, next: d.interaction.nextSlide }}
          slides={items.map((article) => (
            <NewsCard key={article.slug} article={article} locale={locale} dictionary={d} />
          ))}
          footer={
            <Link
              href={path("/news")}
              className="group inline-flex min-h-11 items-center gap-3 text-sm font-semibold text-glacier-600 no-underline"
            >
              <span className="link-underline">{d.home.news.cta}</span>
              <Icon
                name="arrowRight"
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1"
              />
            </Link>
          }
        />
      </Shell>
    </Section>
  );
}
