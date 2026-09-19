"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Icon } from "@/components/ui/Icon";
import type { GalleryItem, GalleryKind } from "@/lib/data/company";
import type { Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

type Filter = "all" | GalleryKind;

/**
 * Filterable image grid of factories, installations and product showcases.
 * Any tile opens a full-screen lightbox; video tiles play their clip there.
 * Arrow keys step through the filtered set, Escape closes.
 */
export function MediaGallery({
  items,
  locale,
  dictionary: d,
}: {
  items: GalleryItem[];
  locale: Locale;
  dictionary: Dictionary;
}) {
  const g = d.resources.gallery;
  const [filter, setFilter] = useState<Filter>("all");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const visible = filter === "all" ? items : items.filter((item) => item.kind === filter);
  const current = openIndex === null ? null : visible[openIndex];

  const step = useCallback(
    (delta: number) =>
      setOpenIndex((index) => (index === null ? null : (index + delta + visible.length) % visible.length)),
    [visible.length],
  );

  useEffect(() => {
    if (openIndex === null) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    const rtl = document.documentElement.dir === "rtl";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpenIndex(null);
      if (event.key === "ArrowRight") step(rtl ? -1 : 1);
      if (event.key === "ArrowLeft") step(rtl ? 1 : -1);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [openIndex, step]);

  const filters: Filter[] = ["all", "factory", "installation", "product"];

  return (
    <div>
      {/* One frosted track with soft segments, rather than four standalone
          pills. The gallery sits inside a tab strip whose tabs are already
          capsules; repeating that shape one level down reads as a second row
          of tabs. A segmented control is visibly subordinate to it. */}
      <div className="no-scrollbar -mx-1 flex overflow-x-auto px-1 py-1">
        <div
          role="group"
          aria-label={g.heading}
          className="glass-chip inline-flex shrink-0 gap-1 rounded-full p-1"
        >
          {filters.map((key) => (
            <button
              key={key}
              type="button"
              aria-pressed={filter === key}
              onClick={() => setFilter(key)}
              className={cn(
                "inline-flex min-h-9 shrink-0 items-center rounded-full px-4 text-sm font-medium",
                "transition-[background-color,color] duration-200 ease-[var(--ease-out-soft)]",
                filter === key
                  ? "bg-white/15 text-white shadow-[inset_0_1px_0_0_rgb(255_255_255/0.2)]"
                  : "text-ink-muted hover:text-ink-strong",
              )}
            >
              {g.filters[key]}
            </button>
          ))}
        </div>
      </div>

      {/* Masonry-feel grid: the first tile and every sixth one span two cells */}
      <ul className="mt-8 grid grid-flow-row-dense auto-rows-[11rem] grid-cols-2 gap-3 sm:auto-rows-[13rem] md:grid-cols-4 md:gap-4">
        {visible.map((item, index) => (
          <li
            key={item.id}
            className={cn(
              "anim-rise",
              index % 6 === 0 && "col-span-2 row-span-2",
              index % 6 === 3 && "md:row-span-2",
            )}
            style={{ animationDelay: `${index * 40}ms` }}
          >
            <button
              type="button"
              onClick={() => setOpenIndex(index)}
              className="group relative block h-full w-full overflow-hidden rounded-2xl bg-surface-sunken text-start"
            >
              <Image
                src={item.src}
                alt=""
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover transition-transform duration-700 ease-[var(--ease-out-soft)] group-hover:scale-105"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent opacity-80 transition-opacity group-hover:opacity-100" />
              {item.video ? (
                <span className="absolute start-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-navy-800 shadow-xl transition-transform group-hover:scale-110 rtl:translate-x-1/2">
                  <Icon name="play" size={24} />
                  <span className="sr-only">{g.play}</span>
                </span>
              ) : null}
              <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-4">
                <span className="text-sm font-medium text-white">
                  {item.video ? (
                    <span className="me-2 rounded bg-glacier-400 px-1.5 py-0.5 text-2xs font-bold uppercase text-navy-900">
                      {g.video}
                    </span>
                  ) : null}
                  {item.title[locale]}
                </span>
                <Icon name="arrowUpRight" size={20} className="shrink-0 text-white opacity-0 transition-opacity group-hover:opacity-100" />
              </span>
              <span className="sr-only">— {g.view}</span>
            </button>
          </li>
        ))}
      </ul>

      {/* Lightbox */}
      {current ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={current.title[locale]}
          className="fixed inset-0 flex flex-col bg-navy-950/95 backdrop-blur-md"
          style={{ zIndex: "var(--z-modal)" }}
          onClick={(event) => {
            if (event.target === event.currentTarget) setOpenIndex(null);
          }}
        >
          <div className="flex items-center justify-between gap-4 p-4 text-white sm:p-6">
            <p className="text-sm">
              <span className="tabular text-white/50">
                {openIndex! + 1} / {visible.length}
              </span>
              <span className="ms-3 font-medium">{current.title[locale]}</span>
            </p>
            <button
              type="button"
              autoFocus
              onClick={() => setOpenIndex(null)}
              aria-label={d.a11y.closeDialog}
              className="grid h-11 w-11 place-items-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
            >
              <Icon name="close" size={24} />
            </button>
          </div>

          <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-6 sm:px-20">
            {current.video ? (
              <video
                key={current.id}
                src={current.video}
                poster={current.src}
                controls
                autoPlay
                playsInline
                className="max-h-full w-full max-w-5xl rounded-2xl bg-black"
              />
            ) : (
              <div className="relative h-full w-full max-w-6xl">
                <Image src={current.src} alt={current.title[locale]} fill sizes="100vw" className="object-contain" />
              </div>
            )}

            {visible.length > 1 ? (
              <>
                <button
                  type="button"
                  onClick={() => step(-1)}
                  aria-label={d.a11y.previousImage}
                  className="absolute start-2 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/25 sm:start-5"
                >
                  <Icon name="chevronLeft" size={24} className="rtl:-scale-x-100" />
                </button>
                <button
                  type="button"
                  onClick={() => step(1)}
                  aria-label={d.a11y.nextImage}
                  className="absolute end-2 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/25 sm:end-5"
                >
                  <Icon name="chevronRight" size={24} className="rtl:-scale-x-100" />
                </button>
              </>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
