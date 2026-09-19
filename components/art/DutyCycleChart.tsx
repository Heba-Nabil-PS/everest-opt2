"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, motion, prefersReducedMotion, registerGsap } from "@/lib/motion";
import { cn } from "@/lib/utils";

/* One duty cycle, twice: a fixed-speed compressor slamming between full load
   and off, and EMMD modulating around the demand it actually reads. The two
   traces carry the same colours as the bars underneath, so the chart needs no
   legend of its own. */
const FIXED = "M0 74 H26 V20 H56 V74 H86 V20 H116 V74 H146 V20 H176 V74 H206 V20 H236 V74 H266 V20 H296 V74 H320";
const EMMD =
  "M0 58 C 18 58 26 46 44 46 S 72 56 90 54 S 120 44 140 45 S 172 55 192 52 S 222 45 244 47 S 274 55 294 52 S 312 49 320 50";

/**
 * The reason behind the figure, drawn rather than stated: hard on-off cycling
 * against demand-matched modulation. Decorative — the numbers and bars around
 * it carry the meaning — so it is hidden from assistive tech. Both traces are
 * server-rendered fully drawn; the scroll draw is an enhancement.
 */
export function DutyCycleChart({ className }: { className?: string }) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      registerGsap();
      const root = scope.current;
      if (!root || prefersReducedMotion()) return;

      const paths = root.querySelectorAll<SVGPathElement>("[data-trace]");

      paths.forEach((path, index) => {
        const length = path.getTotalLength();
        gsap.fromTo(
          path,
          { strokeDasharray: length, strokeDashoffset: length },
          {
            strokeDashoffset: 0,
            duration: motion.duration.cinematic,
            delay: index * 0.15,
            ease: motion.ease.smooth,
            /* Released so the dash pattern never shows on a resize. */
            clearProps: "strokeDasharray,strokeDashoffset",
            scrollTrigger: { trigger: root, start: motion.start, once: true },
          },
        );
      });
    },
    { scope },
  );

  return (
    <div ref={scope} aria-hidden="true" className={cn("relative", className)}>
      <svg viewBox="0 0 320 94" fill="none" preserveAspectRatio="none" className="h-24 w-full lg:h-28">
        <defs>
          <linearGradient id="emmd-trace" x1="0" y1="0" x2="320" y2="0" gradientUnits="userSpaceOnUse">
            <stop stopColor="var(--color-glacier-400)" />
            <stop offset="1" stopColor="#6d8dbc" />
          </linearGradient>
          <linearGradient id="emmd-fill" x1="0" y1="0" x2="0" y2="94" gradientUnits="userSpaceOnUse">
            <stop stopColor="var(--color-glacier-400)" stopOpacity="0.22" />
            <stop offset="1" stopColor="var(--color-glacier-400)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Floor, so both traces read against a baseline rather than floating. */}
        <path d="M0 86 H320" stroke="currentColor" strokeOpacity="0.14" strokeWidth="1" />

        <path d={`${EMMD} L320 94 L0 94 Z`} fill="url(#emmd-fill)" />

        <path
          data-trace
          d={FIXED}
          stroke="rgb(255 255 255 / 0.3)"
          strokeWidth="2"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
        <path
          data-trace
          d={EMMD}
          stroke="url(#emmd-trace)"
          strokeWidth="2.5"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          className="drop-shadow-[0_0_10px_rgb(44_186_226/0.65)]"
        />
      </svg>
    </div>
  );
}
