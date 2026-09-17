import Image from "next/image";
import Link from "next/link";
import { cardLinkOverlay } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { localePath, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n";
import type { NewsArticle } from "@/lib/data/types";
import { NewsMeta, ReadArrow } from "./NewsMeta";

/**
 * A supporting story, set as editorial type under its photograph: no frame,
 * no shadow, nothing between the picture and the headline. The picture is the
 * only clipped surface, so the hover zoom stays inside its rounded corners
 * while the headline and arrow move on the open page.
 *
 * `layout="split"` turns the card on its side from `lg` up. That is what
 * keeps the column next to the feature short enough for the feature to stay
 * the largest thing in the section.
 */
export function NewsStoryCard({
  article,
  locale,
  dictionary: d,
  sizes,
  layout = "stacked",
  className,
}: {
  article: NewsArticle;
  locale: Locale;
  dictionary: Dictionary;
  /** Responsive width hint for the photograph, per placement. */
  sizes: string;
  layout?: "stacked" | "split";
  className?: string;
}) {
  const split = layout === "split";

  return (
    <article
      data-cursor="view"
      className={cn("group relative flex h-full flex-col", split && "lg:flex-row lg:gap-6", className)}
    >
      <div
        className={cn(
          "relative aspect-[16/10] overflow-hidden rounded-[1.25rem] bg-surface-sunken",
          /* On its side the picture stretches to the height of the type next
             to it, so the two edges line up; the floor stops it collapsing
             behind a short headline. */
          split && "lg:aspect-auto lg:min-h-40 lg:w-[38%] lg:shrink-0",
        )}
      >
        <Image
          src={article.image}
          alt=""
          fill
          draggable={false}
          sizes={sizes}
          className="object-cover transition-transform duration-[700ms] ease-[var(--ease-smooth)] motion-safe:group-hover:scale-[1.05] motion-safe:group-focus-within:scale-[1.05]"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy-950/45 to-transparent opacity-55 transition-opacity duration-500 ease-[var(--ease-smooth)] group-hover:opacity-80"
        />
      </div>

      <div className={cn("flex flex-1 flex-col pt-5", split && "lg:pt-0")}>
        <NewsMeta article={article} locale={locale} dictionary={d} />

        <h3
          className={cn(
            "mt-2 text-balance text-lg leading-snug text-white transition-transform duration-500 ease-[var(--ease-smooth)] motion-safe:group-hover:-translate-y-0.5 motion-safe:group-focus-within:-translate-y-0.5 lg:text-xl",
            split && "lg:text-lg",
          )}
        >
          {article.title[locale]}
        </h3>

        <Link
          href={localePath(locale, `/news/${article.slug}`)}
          className={cn(
            "mt-auto inline-flex items-center gap-3 self-start pt-5 text-sm font-semibold text-glacier-300 no-underline",
            cardLinkOverlay,
          )}
        >
          <span className="link-underline">{d.common.readMore}</span>
          <span className="sr-only">: {article.title[locale]}</span>
          <ReadArrow />
        </Link>
      </div>
    </article>
  );
}
