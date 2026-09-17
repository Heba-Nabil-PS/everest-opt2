"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion, registerGsap } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Horizontal data bar that fills to `value`% when it scrolls into view. The
 * final width is server-rendered, so the figure is correct without JS and for
 * reduced motion.
 */
export function GrowBar({
  value,
  label,
  delay = 0,
  className,
  barClassName,
}: {
  value: number;
  label: string;
  delay?: number;
  className?: string;
  barClassName?: string;
}) {
  const bar = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      registerGsap();
      const node = bar.current;
      if (!node || prefersReducedMotion()) return;
      gsap.fromTo(
        node,
        { width: "0%" },
        {
          width: `${value}%`,
          duration: 1.4,
          delay,
          ease: "power3.out",
          scrollTrigger: { trigger: node, start: "top 85%", once: true },
        },
      );
    },
    { dependencies: [value, delay] },
  );

  return (
    <span role="img" aria-label={label} className={cn("block h-3 w-full overflow-hidden rounded-full bg-white/10", className)}>
      <span ref={bar} className={cn("block h-full rounded-full", barClassName)} style={{ width: `${value}%` }} />
    </span>
  );
}
