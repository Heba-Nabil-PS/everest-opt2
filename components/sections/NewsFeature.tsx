import Image from "next/image";
import Link from "next/link";
import { ImageReveal } from "@/components/motion/ImageReveal";
import { Reveal } from "@/components/motion/Reveal";
import { cardLinkOverlay } from "@/components/ui/Card";
import { localePath, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n";
import type { NewsArticle } from "@/lib/data/types";
import { NewsMeta, ReadArrow } from "./NewsMeta";

/**
 * The lead story: one large photograph with the headline set into it. It is
 * the section's centre of gravity — roughly twice the picture area of a
 * supporting card — and it carries the stronger hover: the photograph settles
 * closer, the scrim deepens, the headline lifts and the arrow travels.
 *
 * The picture arrives with the site's clip reveal; the copy follows a beat
 * later, so the composition reads image first, then headline.
 */
export function NewsFeature({
  article,
  locale,
  dictionary: d,
}: {
  article: NewsArticle;
  locale: Locale;
  dictionary: Dictionary;
}) {
  return (
    <article
      data-cursor="view"
      className="group relative isolate flex h-full min-h-[26rem] flex-col justify-end overflow-hidden rounded-[1.75rem] lg:min-h-[34rem] lg:rounded-[2rem]"
    >
      <ImageReveal
        variant="clip-up"
        delay={0.1}
        className="absolute inset-0 -z-10 h-full w-full rounded-[inherit]"
      >
        <Image
          src={article.image}
          alt=""
          fill
          draggable={false}
          sizes="(min-width: 1024px) 60vw, 100vw"
          className="object-cover transition-transform duration-[700ms] ease-[var(--ease-smooth)] motion-safe:group-hover:scale-[1.05] motion-safe:group-focus-within:scale-[1.05]"
        />
      </ImageReveal>

      {/* Legibility scrim. It deepens slightly on hover, which is what makes
          the headline and CTA step forward. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 rounded-[inherit] bg-gradient-to-t from-navy-950 via-navy-950/55 to-transparent opacity-85 transition-opacity duration-500 ease-[var(--ease-smooth)] group-hover:opacity-100 group-focus-within:opacity-100"
      />

      <Reveal delay={0.3} className="p-6 sm:p-8 lg:p-10">
        <NewsMeta article={article} locale={locale} dictionary={d} withReadTime />

        <h3 className="mt-4 max-w-[20ch] text-balance text-2xl leading-[1.15] text-white transition-transform duration-500 ease-[var(--ease-smooth)] motion-safe:group-hover:-translate-y-1 motion-safe:group-focus-within:-translate-y-1 sm:text-3xl lg:text-[2.6rem]">
          {article.title[locale]}
        </h3>

        <p className="mt-3 line-clamp-2 max-w-[52ch] text-sm text-white/70 sm:text-base">
          {article.summary[locale]}
        </p>

        <Link
          href={localePath(locale, `/news/${article.slug}`)}
          className={`mt-6 inline-flex items-center gap-3 text-sm font-semibold text-white no-underline ${cardLinkOverlay}`}
        >
          <span className="link-underline">{d.common.readMore}</span>
          <span className="sr-only">: {article.title[locale]}</span>
          <ReadArrow className="h-10 w-10" />
        </Link>
      </Reveal>
    </article>
  );
}
