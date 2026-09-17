"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";
import { gsap, mediaQueries, motion, registerGsap } from "@/lib/motion";

/**
 * Scroll choreography for a full-viewport hero. As the page scrolls away:
 *
 *   [data-hero-media]   closes into a rounded window and settles back
 *   [data-hero-content] lifts faster than the page and fades out
 *
 * The entrance itself is CSS (it paints with the document); this only adds
 * the exit, scrubbed to the scrollbar. Phones get a lighter version with no
 * window effect; reduced motion gets nothing.
 */
export function HeroStage({
  className,
  children,
  closeWindow = true,
  ...rest
}: React.HTMLAttributes<HTMLElement> & {
  children: React.ReactNode;
  /** Close the media into a rounded window on desktop (full-viewport heroes). */
  closeWindow?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      registerGsap();
      const section = ref.current;
      if (!section) return;

      const media = section.querySelector<HTMLElement>("[data-hero-media]");
      const content = section.querySelector<HTMLElement>("[data-hero-content]");
      const mm = gsap.matchMedia();

      mm.add(
        { motionOk: mediaQueries.motionOk, desktop: mediaQueries.desktop },
        (context) => {
          const { motionOk, desktop } = context.conditions as Record<string, boolean>;
          if (!motionOk) return;

          const timeline = gsap.timeline({
            defaults: { ease: motion.ease.linear },
            scrollTrigger: { trigger: section, start: "top top", end: "bottom top", scrub: true },
          });

          if (media && desktop && closeWindow) {
            timeline.fromTo(
              media,
              { clipPath: "inset(0% 0% 0% 0% round 0px)" },
              { clipPath: "inset(5% 3% 0% 3% round 28px)" },
              0,
            );
          }
          if (media) {
            timeline.fromTo(media.firstElementChild, { yPercent: 0 }, { yPercent: desktop ? 18 : 8 }, 0);
          }
          if (content) {
            timeline.fromTo(content, { yPercent: 0, opacity: 1 }, { yPercent: desktop ? -30 : -12, opacity: 0 }, 0);
          }
        },
      );

      return () => mm.revert();
    },
    { scope: ref, dependencies: [closeWindow] },
  );

  return (
    <section ref={ref} className={cn(className)} {...rest}>
      {children}
    </section>
  );
}
