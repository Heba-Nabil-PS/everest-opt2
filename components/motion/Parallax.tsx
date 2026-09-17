"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";
import { gsap, mediaQueries, motion, registerGsap } from "@/lib/motion";

/**
 * Decorative parallax layer. Applied to background art only — never to text or
 * controls — with a small delta so foreground and background never desync.
 * Phones get half the travel; reduced motion gets none.
 */
export function Parallax({
  amount = 10,
  scale,
  className,
  children,
}: {
  /** Vertical travel as a percentage of the element height (5–15). */
  amount?: number;
  /** Optional slow zoom-out across the same scroll range, e.g. 1.12 → 1. */
  scale?: number;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      registerGsap();
      const node = ref.current;
      if (!node) return;

      const mm = gsap.matchMedia();
      mm.add(
        { desktop: mediaQueries.desktop, motionOk: mediaQueries.motionOk },
        (context) => {
          const { desktop, motionOk } = context.conditions as Record<string, boolean>;
          if (!motionOk) return;

          gsap.fromTo(
            node,
            { yPercent: 0, scale: scale ?? 1 },
            {
              yPercent: desktop ? amount : amount * motion.mobileScale,
              scale: 1,
              ease: motion.ease.linear,
              scrollTrigger: {
                trigger: node.parentElement ?? node,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            },
          );
        },
      );

      return () => mm.revert();
    },
    { scope: ref, dependencies: [amount, scale] },
  );

  return (
    <div ref={ref} aria-hidden="true" className={cn("will-change-transform", className)}>
      {children}
    </div>
  );
}
