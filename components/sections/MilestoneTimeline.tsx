"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { Icon, type IconName } from "@/components/ui/Icon";
import { gsap, motion, prefersReducedMotion, registerGsap, ScrollTrigger } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface Milestone {
  year: string;
  title: string;
  body: string;
}

/**
 * The company history as a scroll-driven reader rather than a zig-zag of
 * cards: one column of entries threaded on a spine that draws itself as the
 * section is read, and — on wide screens — a year that sticks beside them and
 * changes as each entry takes the middle of the viewport.
 *
 * The sticky column is a restatement, so it is hidden from assistive tech; the
 * ordered list carries every year, title and body. Without JavaScript, or
 * under reduced motion, the list is simply a list: nothing is hidden and the
 * spine is drawn in full.
 */
export function MilestoneTimeline({
  items,
  icons,
  images,
}: {
  items: readonly Milestone[];
  icons: readonly IconName[];
  /** One photograph per milestone, in the same order. */
  images: readonly string[];
}) {
  const scope = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const yearRef = useRef<HTMLParagraphElement>(null);
  const [active, setActive] = useState(0);

  /* Scroll wiring: spine draw, entry reveals, and which entry is current. */
  useGSAP(
    () => {
      registerGsap();
      const list = listRef.current;
      if (!list || prefersReducedMotion()) return;

      const fill = list.querySelector<HTMLElement>("[data-spine-fill]");
      if (fill) {
        gsap.fromTo(
          fill,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: motion.ease.linear,
            scrollTrigger: { trigger: list, start: "top 65%", end: "bottom 65%", scrub: 0.5 },
          },
        );
      }

      const entries = gsap.utils.toArray<HTMLElement>("[data-entry]", list);

      entries.forEach((entry, index) => {
        gsap.fromTo(
          entry,
          { opacity: 0, y: motion.distance.medium },
          {
            opacity: 1,
            y: 0,
            duration: motion.duration.normal,
            ease: motion.ease.smooth,
            scrollTrigger: { trigger: entry, start: "top 88%", once: true },
          },
        );

        /* Current entry = the one straddling the middle of the viewport. */
        ScrollTrigger.create({
          trigger: entry,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: (self) => {
            if (self.isActive) setActive(index);
          },
        });
      });
    },
    { scope, dependencies: [items] },
  );

  /* The year changes like a counter flipping, not like a crossfade. */
  useGSAP(
    () => {
      const node = yearRef.current;
      if (!node || prefersReducedMotion()) return;
      gsap.fromTo(
        node,
        { yPercent: 35, opacity: 0, filter: "blur(10px)" },
        {
          yPercent: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: motion.duration.normal,
          ease: motion.ease.smooth,
          clearProps: "filter",
        },
      );
    },
    { scope, dependencies: [active] },
  );

  const current = items[active] ?? items[0];
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div ref={scope} className="mt-14 grid gap-10 lg:mt-20 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-16">
      {/* The year, held beside the reading column */}
      <div aria-hidden="true" className="hidden lg:block">
        <div className="sticky top-32">
          <p className="tabular font-mono text-xs tracking-[0.3em] text-ink-muted">
            <span className="ltr-inline">
              {pad(active + 1)} / {pad(items.length)}
            </span>
          </p>

          {/* overflow-clip: the year rises out of its own mask on each change. */}
          <div className="mt-3 overflow-hidden">
            <p ref={yearRef} className="tabular text-gradient font-display text-7xl font-bold leading-none xl:text-8xl">
              {current.year}
            </p>
          </div>

          <p className="mt-4 max-w-[26ch] text-lg text-ink-muted">{current.title}</p>

          {/* Every photograph is stacked and cross-faded, so changing era never
             blanks the frame waiting for a new file. */}
          <div className="relative mt-6 aspect-[4/3] w-full overflow-hidden rounded-2xl bg-surface-sunken ring-1 ring-hairline">
            {items.map((item, index) => (
              <Image
                key={item.year}
                src={images[index % images.length]}
                alt=""
                fill
                sizes="320px"
                className={cn(
                  "object-cover transition-[opacity,transform] duration-700 ease-[var(--ease-smooth)]",
                  index === active ? "scale-100 opacity-100" : "scale-105 opacity-0",
                )}
              />
            ))}
            <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy-950/45 to-transparent" />
          </div>

          <span aria-hidden="true" className="mt-8 block h-1 w-40 overflow-hidden rounded-full bg-hairline-strong">
            <span
              className="block h-full origin-left rounded-full bg-gradient-to-r from-glacier-400 to-[#9d8bff] transition-transform duration-700 ease-[var(--ease-smooth)] rtl:origin-right"
              style={{ transform: `scaleX(${(active + 1) / items.length})` }}
            />
          </span>
        </div>
      </div>

      {/* The entries */}
      <ol ref={listRef} className="relative">
        {/* Spine: the unlit track, then the lit length that follows the scroll. */}
        <span
          aria-hidden="true"
          className="absolute inset-y-0 start-6 w-px -translate-x-1/2 bg-hairline-strong rtl:translate-x-1/2"
        />
        <span
          data-spine-fill
          aria-hidden="true"
          className="absolute inset-y-0 start-6 w-px origin-top -translate-x-1/2 bg-gradient-to-b from-glacier-400 via-[#7c9dff] to-[#9d8bff] shadow-[0_0_12px_rgb(44_186_226/0.8)] rtl:translate-x-1/2"
        />

        {items.map((item, index) => {
          const isCurrent = index === active;

          return (
            <li
              key={item.year}
              data-entry
              data-active={isCurrent ? "true" : undefined}
              className="group relative ps-16 pb-12 last:pb-0 lg:ps-20 lg:pb-16"
            >
              {/* Node: quiet until the entry is the one being read. */}
              <span
                aria-hidden="true"
                className={cn(
                  "absolute start-6 top-0 grid h-12 w-12 -translate-x-1/2 place-items-center rounded-full",
                  "transition-[background-color,color,transform,box-shadow] duration-500 ease-[var(--ease-smooth)] rtl:translate-x-1/2",
                  isCurrent
                    ? "scale-110 bg-gradient-to-br from-glacier-400 to-[#7c5cff] text-navy-950 shadow-[0_0_28px_-4px_rgb(44_186_226/0.9)]"
                    : "bg-surface text-glacier-600 ring-1 ring-hairline-strong",
                )}
              >
                <Icon name={icons[index % icons.length]} size={20} />
              </span>

              <div
                className={cn(
                  "transition-opacity duration-500 ease-[var(--ease-smooth)]",
                  /* Read-ahead entries sit back a little, so the current one leads. */
                  isCurrent ? "opacity-100" : "lg:opacity-60",
                )}
              >
                {/* Every entry states its own year: the sticky column is a
                   restatement, and it only tracks the scroll once JS runs. */}
                <p className="tabular font-mono text-sm font-semibold tracking-[0.2em] text-glacier-600">{item.year}</p>
                <h3 className="mt-2 text-xl lg:text-2xl">{item.title}</h3>
                <p className="mt-3 max-w-[60ch] text-ink-muted">{item.body}</p>

                {/* Narrow screens have no sticky column, so the era carries its
                   own photograph here instead. */}
                <div className="relative mt-5 aspect-[16/9] overflow-hidden rounded-xl bg-surface-sunken lg:hidden">
                  <Image
                    src={images[index % images.length]}
                    alt=""
                    fill
                    sizes="(min-width: 640px) 70vw, 85vw"
                    className="object-cover"
                  />
                  <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy-950/40 to-transparent" />
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
