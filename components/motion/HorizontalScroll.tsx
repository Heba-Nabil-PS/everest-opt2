"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";
import { gsap, isRtl, mediaQueries, motion, registerGsap, ScrollTrigger } from "@/lib/motion";
import { scrollToY } from "./SmoothScroll";

interface HorizontalScrollProps {
  /** Heading block shown above the track, pinned with it. */
  intro: React.ReactNode;
  items: React.ReactNode[];
  /** Accessible name for the list of items. */
  label: string;
  itemClassName?: string;
  className?: string;
}

/**
 * Vertical scroll drives a horizontal journey through large cards.
 *
 * Desktop with motion allowed: the section pins and the track travels along
 * the reading direction (mirrored for RTL) while a progress line fills. Each
 * card's `[data-hscroll-media]` layer drifts against the travel for depth.
 *
 * Tablet, phone and reduced motion: the same markup is a native swipe row with
 * snap points — no pinning, no scroll hijacking.
 *
 * Keyboard users are never stranded: when focus lands on a card outside the
 * pinned viewport, the page scrolls to the point where that card is in view.
 */
export function HorizontalScroll({ intro, items, label, itemClassName, className }: HorizontalScrollProps) {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLUListElement>(null);
  const bar = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      registerGsap();
      const section = root.current;
      const list = track.current;
      if (!section || !list) return;

      const mm = gsap.matchMedia();

      mm.add(`${mediaQueries.desktop} and ${mediaQueries.motionOk}`, () => {
        section.classList.add("is-pinned");
        const direction = isRtl() ? 1 : -1;
        const travel = () => Math.max(list.scrollWidth - list.clientWidth, 0);

        const tween = gsap.to(list, {
          x: () => travel() * direction,
          ease: motion.ease.linear,
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${travel()}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
            anticipatePin: 1,
            onUpdate: (self) => {
              if (bar.current) bar.current.style.transform = `scaleX(${self.progress})`;
            },
          },
        });

        /* Depth: media inside each card drifts slightly against the travel. */
        list.querySelectorAll<HTMLElement>("[data-hscroll-media]").forEach((media) => {
          gsap.fromTo(
            media,
            { xPercent: 8 * -direction },
            {
              xPercent: 8 * direction,
              ease: motion.ease.linear,
              scrollTrigger: {
                trigger: media,
                containerAnimation: tween,
                start: isRtl() ? "right left" : "left right",
                end: isRtl() ? "left right" : "right left",
                scrub: true,
              },
            },
          );
        });

        const onFocus = (event: FocusEvent) => {
          const item = (event.target as Element).closest<HTMLElement>("li");
          const trigger = tween.scrollTrigger;
          if (!item || !trigger || !list.contains(item)) return;

          const max = travel();
          if (max === 0) return;
          const fromStart = isRtl()
            ? list.scrollWidth - item.offsetLeft - item.offsetWidth
            : item.offsetLeft;
          const ratio = gsap.utils.clamp(0, 1, (fromStart - list.clientWidth / 3) / max);
          scrollToY(trigger.start + (trigger.end - trigger.start) * ratio, { immediate: true });
        };
        list.addEventListener("focusin", onFocus);

        return () => {
          list.removeEventListener("focusin", onFocus);
          section.classList.remove("is-pinned");
        };
      });

      /* Fonts and images change widths after first paint. */
      const refresh = () => ScrollTrigger.refresh();
      document.fonts?.ready.then(refresh);

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root} className={cn("hscroll relative overflow-x-clip", className)}>
      <div className="hscroll-panel flex flex-col justify-center gap-10 lg:min-h-svh lg:gap-8 lg:py-10">
        {intro}

        <ul
          ref={track}
          aria-label={label}
          data-lenis-prevent-horizontal
          className={cn(
            "hscroll-track no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto overflow-y-hidden overscroll-x-contain px-[var(--shell-gutter)] pb-2 lg:gap-8",
            /* Start the first card on the page grid, not the window edge. */
            "lg:ps-[max(var(--shell-gutter),calc((100vw-var(--container-content))/2))]",
            "lg:pe-[max(var(--shell-gutter),calc((100vw-var(--container-content))/2))]",
          )}
        >
          {items.map((item, index) => (
            <li key={index} className={cn("shrink-0 snap-start", itemClassName)}>
              {item}
            </li>
          ))}
        </ul>

        <div aria-hidden="true" className="shell hidden lg:block">
          <span className="relative block h-px w-full overflow-hidden bg-white/15">
            <span
              ref={bar}
              className="absolute inset-0 origin-left scale-x-0 bg-glacier-400 rtl:origin-right"
            />
          </span>
        </div>
      </div>
    </div>
  );
}
