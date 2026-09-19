"use client";

import { useRef } from "react";
import { usePathname } from "next/navigation";
import { useGSAP } from "@gsap/react";
import { gsap, isRtl, mediaQueries, motion, registerGsap, ScrollTrigger } from "@/lib/motion";

/**
 * The light behind an Aurora page. One large, soft circle of brand light sits
 * behind the content and swings from side to side as the visitor moves from
 * section to section, brightening and dimming as it goes — so consecutive
 * sections read as a light scene and a dark scene without any hard colour
 * bands. A faint indigo counter-light always sits on the opposite side.
 *
 * Lives once in the root layout — outside the page content that route changes
 * replace — so its triggers are rebuilt against the new page's top-level
 * sections on every navigation (the `pathname` dependency below), rather than
 * pointing at DOM nodes a route change has already removed. The first section
 * on every page is that page's hero, which keeps its own fixed lighting.
 * The move is a short time-based tween when a section reaches the middle of
 * the screen (not scrubbed), so it feels like the lighting changes with the
 * scene. Both lights are radial gradients moved with `transform` only.
 * Reduced motion jumps straight to each position.
 */
export function AuroraOrbs() {
  const root = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useGSAP(
    () => {
      registerGsap();
      const layer = root.current;
      const light = layer?.querySelector<HTMLElement>("[data-orb='light']");
      const counter = layer?.querySelector<HTMLElement>("[data-orb='counter']");
      if (!layer || !light || !counter) return;

      const main = document.getElementById("main");
      const allSections = main ? Array.from(main.querySelectorAll<HTMLElement>("section")) : [];
      /* Top-level sections only — a section's own sub-sections don't get
         their own scene — at whatever depth the page renders through. */
      const sections = allSections.filter((section) => !section.parentElement?.closest("section")).slice(1);
      const mm = gsap.matchMedia();
      /* One extra measure once the new page has laid out and PageTransition's
         own effect (which can reset scroll position) has had its turn. */
      const refresh = requestAnimationFrame(() => ScrollTrigger.refresh());

      mm.add({ desktop: mediaQueries.desktop, reduced: mediaQueries.reduced }, (context) => {
        const { desktop, reduced } = context.conditions as Record<string, boolean>;
        const swing = desktop ? 30 : 22;

        /* Even scenes are lit (light on the start side), odd scenes are dark. */
        const stateFor = (index: number) => {
          const lit = index % 2 === 0;
          const startSide = isRtl() ? 1 : -1;
          const side = lit ? startSide : -startSide;
          return {
            /* GSAP owns the centring (-50%) as well as the swing. */
            light: { xPercent: -50 + side * swing * 2, yPercent: -50, opacity: lit ? 1 : 0.38, scale: lit ? 1.08 : 0.86 },
            counter: { xPercent: -50 - side * swing * 2, yPercent: -50, opacity: lit ? 0.35 : 0.7 },
          };
        };

        const apply = (index: number) => {
          const state = stateFor(index);
          const vars = { duration: reduced ? 0 : motion.duration.cinematic * 1.3, ease: motion.ease.expressive, overwrite: "auto" as const };
          gsap.to(light, { ...state.light, ...vars });
          gsap.to(counter, { ...state.counter, ...vars });
        };

        gsap.set(light, stateFor(0).light);
        gsap.set(counter, stateFor(0).counter);

        sections.forEach((section, index) => {
          ScrollTrigger.create({
            trigger: section,
            start: "top 55%",
            end: "bottom 55%",
            onToggle: (self) => {
              if (self.isActive) apply(index);
            },
          });
        });
      });

      return () => {
        cancelAnimationFrame(refresh);
        mm.revert();
      };
    },
    { scope: root, dependencies: [pathname] },
  );

  return (
    <div ref={root} aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <span
        data-orb="light"
        className="absolute left-1/2 top-1/2 h-[min(80vw,62rem)] w-[min(80vw,62rem)] rounded-full will-change-transform [background:radial-gradient(circle,rgb(44_186_226/0.42)_0%,rgb(74_111_165/0.22)_38%,transparent_68%)]"
      />
      <span
        data-orb="counter"
        className="absolute left-1/2 top-[62%] h-[min(60vw,46rem)] w-[min(60vw,46rem)] rounded-full will-change-transform [background:radial-gradient(circle,rgb(82_89_156/0.42)_0%,transparent_65%)]"
      />
      <span className="aurora-grain absolute inset-0" />
    </div>
  );
}
