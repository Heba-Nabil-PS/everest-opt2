"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { Glow } from "@/components/ui/Aurora";
import { Icon } from "@/components/ui/Icon";
import { gsap, mediaQueries, motion, prefersReducedMotion, registerGsap } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface Plant {
  year: string;
  place: string;
  role: string;
}

/**
 * The plants in the order they opened. When the panel scrolls in, the track
 * draws itself, each stop's marker pops in turn and its card fades in; after that
 * a point of light keeps travelling the track and the last stop, still to
 * come, pulses. Horizontal from lg, a vertical rail on phones. The finished
 * state is what the server renders, so nothing is hidden without JS or under
 * reduced motion.
 */
export function PlantTimeline({
  heading,
  note,
  upcomingLabel,
  items,
}: {
  heading: string;
  note: string;
  upcomingLabel: string;
  items: readonly Plant[];
}) {
  const scope = useRef<HTMLDivElement>(null);
  const last = items.length - 1;

  useGSAP(
    () => {
      registerGsap();
      const root = scope.current;
      if (!root || prefersReducedMotion()) return;

      const mm = gsap.matchMedia();
      mm.add({ desktop: mediaQueries.desktop, mobile: mediaQueries.mobile }, (context) => {
        const desktop = Boolean(context.conditions?.desktop);
        const tl = gsap.timeline({
          scrollTrigger: { trigger: root, start: "top 75%", once: true },
          defaults: { ease: motion.ease.smooth },
        });
        tl.fromTo(
          root.querySelector(desktop ? "[data-track='x']" : "[data-track='y']"),
          desktop ? { scaleX: 0 } : { scaleY: 0 },
          { ...(desktop ? { scaleX: 1 } : { scaleY: 1 }), duration: 1.8, ease: motion.ease.expressive },
        )
          .from(root.querySelectorAll("[data-node]"), { scale: 0, opacity: 0, duration: 0.6, stagger: 0.25, ease: "back.out(2.2)" }, 0.15)
          .from(root.querySelectorAll("[data-year]"), { y: 14, opacity: 0, duration: 0.7, stagger: 0.25 }, 0.25)
          .from(root.querySelectorAll("[data-card]"), { opacity: 0, duration: 0.8, stagger: 0.25 }, 0.35);
      });
      return () => mm.revert();
    },
    { scope },
  );

  return (
    <div
      ref={scope}
      className="glass-panel-strong relative isolate overflow-hidden rounded-[1.75rem] p-6 shadow-2xl sm:p-8 lg:p-10"
    >
      <div aria-hidden="true" className="bg-grid-inverse pointer-events-none absolute inset-0 -z-10 opacity-40" />
      <Glow className="-start-24 -top-24 h-72 w-72 opacity-60" />
      <Glow tone="indigo" className="-bottom-28 -end-16 h-80 w-80 opacity-60" />

      <h2 id="plants-heading" className="text-center text-2xl text-white lg:text-3xl">
        {heading}
      </h2>

      <ol className="relative mt-10 grid gap-7 lg:grid-cols-6 lg:gap-4">
        {/* Desktop track, centred on the markers. */}
        <span aria-hidden="true" className="absolute inset-x-[8.33%] top-[3.9rem] hidden h-px bg-white/10 lg:block" />
        <span
          aria-hidden="true"
          data-track="x"
          className="absolute inset-x-[8.33%] top-[3.9rem] hidden h-px origin-left bg-gradient-to-r from-glacier-400/40 via-glacier-300 to-glacier-400 rtl:origin-right lg:block"
        >
          <span className="track-light absolute -top-[3px] block h-[7px] w-10 -translate-x-1/2 rounded-full bg-glacier-200 shadow-[0_0_18px_4px_rgb(116_215_242/0.8)] blur-[1px]" />
        </span>
        {/* Phone rail, down the start side. */}
        <span aria-hidden="true" className="absolute bottom-6 start-[1.375rem] top-6 w-px bg-white/10 lg:hidden" />
        <span
          aria-hidden="true"
          data-track="y"
          className="absolute bottom-6 start-[1.375rem] top-6 w-px origin-top bg-gradient-to-b from-glacier-400/40 via-glacier-300 to-glacier-400 lg:hidden"
        />

        {items.map((plant, index) => {
          const upcoming = index === last;
          return (
            <li key={plant.year} className="group relative flex gap-4 lg:flex-col lg:items-center lg:gap-3 lg:text-center">
              {/* Marker */}
              <span data-node className="relative z-10 grid h-11 w-11 shrink-0 place-items-center lg:order-2">
                {upcoming ? (
                  <span aria-hidden="true" className="stat-ring absolute inset-0 rounded-full border border-glacier-300/70" />
                ) : null}
                <span
                  className={cn(
                    "grid h-11 w-11 place-items-center rounded-full ring-4 ring-navy-950/60 transition-transform duration-500 ease-[var(--ease-smooth)] group-hover:scale-110",
                    upcoming
                      ? "bg-glacier-400 text-navy-950 shadow-[0_0_28px_-2px_rgb(44_186_226/0.9)]"
                      : "border border-glacier-300/40 bg-navy-800 text-glacier-300 group-hover:border-glacier-300 group-hover:bg-glacier-400 group-hover:text-navy-950",
                  )}
                >
                  <Icon name={upcoming ? "sparkle" : "factory"} size={20} />
                </span>
              </span>

              {/* Year and card; on desktop they sit above and below the marker. */}
              <div className="flex min-w-0 flex-1 flex-col gap-2 lg:contents">
                <span
                  data-year
                  className={cn(
                    "ltr-inline font-display text-2xl font-bold leading-none lg:order-1 lg:text-[1.75rem]",
                    upcoming ? "text-aurora" : "text-white",
                  )}
                >
                  {plant.year}
                </span>
                <div
                  data-card
                  className={cn(
                    "glass-chip w-full rounded-2xl p-4 transition-[transform,border-color,background-color] duration-500 ease-[var(--ease-smooth)] group-hover:-translate-y-1 group-hover:border-glacier-300/60 lg:order-3 lg:mt-2 lg:flex-1",
                    upcoming && "border-glacier-300/50 bg-glacier-400/10",
                  )}
                >
                  {upcoming ? (
                    <span className="mb-2 inline-flex rounded-full bg-glacier-400 px-2 py-0.5 text-2xs font-semibold uppercase tracking-[0.12em] text-navy-950">
                      {upcomingLabel}
                    </span>
                  ) : null}
                  <span className="block text-sm font-semibold text-white">{plant.place}</span>
                  <span className="mt-1 block text-xs text-white/60">{plant.role}</span>
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      <p className="mx-auto mt-10 max-w-[80ch] text-center text-sm text-white/65">{note}</p>
    </div>
  );
}
