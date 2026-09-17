import { Icon } from "@/components/ui/Icon";
import { cn, formatDate } from "@/lib/utils";
import type { Locale } from "@/lib/i18n/config";
import { t, type Dictionary } from "@/lib/i18n";
import type { NewsArticle } from "@/lib/data/types";

/**
 * The quiet line that sits under every story: topic, publication date and,
 * on the feature, the read time. Deliberately smaller and calmer than the
 * headline it introduces — the topic carries the only accent colour.
 */
export function NewsMeta({
  article,
  locale,
  dictionary: d,
  withReadTime,
  className,
}: {
  article: NewsArticle;
  locale: Locale;
  dictionary: Dictionary;
  withReadTime?: boolean;
  className?: string;
}) {
  return (
    <p className={cn("flex flex-wrap items-center gap-x-3 gap-y-1", className)}>
      <span className="text-2xs font-semibold uppercase tracking-[0.18em] text-glacier-300">
        {d.news.topics[article.topic]}
      </span>
      <span aria-hidden="true" className="h-3 w-px bg-white/25" />
      <time dateTime={article.date} className="text-xs text-white/60">
        {formatDate(article.date, locale)}
      </time>
      {withReadTime ? (
        <>
          <span aria-hidden="true" className="h-3 w-px bg-white/25" />
          <span className="text-xs text-white/60">{t(d.common.readTime, { n: article.readMinutes })}</span>
        </>
      ) : null}
    </p>
  );
}

/**
 * The recurring read affordance. The arrow travels on hover and on keyboard
 * focus of the card's link, so pointer and keyboard read the same.
 */
export function ReadArrow({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/20 text-glacier-300",
        "transition-[transform,background-color,border-color,color] duration-500 ease-[var(--ease-smooth)]",
        "group-hover:border-glacier-300 group-hover:bg-glacier-400 group-hover:text-navy-900",
        "group-focus-within:border-glacier-300 group-focus-within:bg-glacier-400 group-focus-within:text-navy-900",
        "motion-safe:group-hover:translate-x-1 motion-safe:group-focus-within:translate-x-1",
        "rtl:motion-safe:group-hover:-translate-x-1 rtl:motion-safe:group-focus-within:-translate-x-1",
        className,
      )}
    >
      <Icon name="arrowRight" size={16} className="rtl:-scale-x-100" />
    </span>
  );
}
