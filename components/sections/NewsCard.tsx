import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { cardLinkOverlay } from "@/components/ui/Card";
import { cn, formatDate } from "@/lib/utils";
import { localePath, type Locale } from "@/lib/i18n/config";
import { t, type Dictionary } from "@/lib/i18n";
import type { NewsArticle } from "@/lib/data/types";

/**
 * Editorial news card: lifestyle photograph with the topic pinned on it, date
 * and read time, headline, summary and a "Read more" link whose overlay makes
 * the whole card clickable. `glass` renders it for dark Aurora grounds.
 */
export function NewsCard({
  article,
  locale,
  dictionary: d,
  headingLevel: Heading = "h3",
  glass,
}: {
  article: NewsArticle;
  locale: Locale;
  dictionary: Dictionary;
  headingLevel?: "h2" | "h3";
  glass?: boolean;
}) {
  return (
    <article
      data-cursor="view"
      className={cn(
        "group relative flex h-full flex-col overflow-hidden transition-[transform,box-shadow,border-color] duration-500 ease-[var(--ease-smooth)] hover:-translate-y-1",
        glass
          ? "glass-panel glass-spot rounded-[1.5rem] p-3 hover:border-white/25"
          : "rounded-2xl border border-hairline bg-surface shadow-xs hover:shadow-lg",
      )}
    >
      <div className={cn("relative aspect-[16/10] overflow-hidden bg-surface-sunken", glass && "rounded-[1.1rem]")}>
        <Image
          src={article.image}
          alt=""
          fill
          draggable={false}
          sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 100vw"
          className="object-cover transition-transform duration-1000 ease-[var(--ease-smooth)] group-hover:scale-[1.07]"
        />
        <span className="absolute inset-0 bg-gradient-to-t from-navy-950/40 to-transparent" />
        <span
          className={cn(
            "absolute start-4 top-4 rounded-full px-3 py-1 text-xs font-semibold backdrop-blur",
            glass ? "bg-navy-950/60 text-glacier-200 ring-1 ring-white/15" : "bg-white/90 text-navy-700",
          )}
        >
          {d.news.topics[article.topic]}
        </span>
      </div>

      <div className={cn("flex flex-1 flex-col", glass ? "px-3 pb-3 pt-5" : "p-6")}>
        <p className={cn("flex flex-wrap items-center gap-x-2 text-xs", glass ? "text-white/55" : "text-ink-muted")}>
          <time dateTime={article.date}>{formatDate(article.date, locale)}</time>
          <span aria-hidden="true">·</span>
          <span>{t(d.common.readTime, { n: article.readMinutes })}</span>
        </p>
        <Heading
          className={cn(
            "mt-3 text-lg leading-snug transition-colors",
            glass ? "text-white group-hover:text-glacier-200" : "group-hover:text-glacier-600",
          )}
        >
          {article.title[locale]}
        </Heading>
        <p className={cn("mt-2 line-clamp-3 text-sm", glass ? "text-white/65" : "text-ink-muted")}>
          {article.summary[locale]}
        </p>

        <Link
          href={localePath(locale, `/news/${article.slug}`)}
          className={cn(
            "mt-auto inline-flex items-center gap-2 self-start pt-5 text-sm font-semibold no-underline",
            glass ? "text-glacier-300" : "text-glacier-600",
            cardLinkOverlay,
          )}
        >
          {d.common.readMore}
          <span className="sr-only">: {article.title[locale]}</span>
          <span
            className={cn(
              "grid h-7 w-7 place-items-center rounded-full transition-[transform,background-color] duration-300 group-hover:translate-x-1 group-hover:bg-glacier-400 group-hover:text-navy-900 rtl:group-hover:-translate-x-1",
              glass ? "bg-white/10" : "bg-glacier-100",
            )}
          >
            <Icon name="arrowRight" size={16} className="rtl:-scale-x-100" />
          </span>
        </Link>
      </div>
    </article>
  );
}
