"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, motion, prefersReducedMotion, registerGsap } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface CounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  /** Render the number verbatim (years, not quantities) with no thousands grouping. */
  raw?: boolean;
  locale: string;
  className?: string;
}

/**
 * Counts up when the figure scrolls into view. The final value is rendered on
 * the server, so the number is correct before JS runs and for reduced motion.
 */
export function Counter({ value, suffix, prefix, raw, locale, className }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);

  const format = (n: number) =>
    raw
      ? String(Math.round(n))
      : new Intl.NumberFormat(locale === "ar" ? "ar-AE-u-nu-latn" : "en-US").format(
          Math.round(n),
        );

  useGSAP(
    () => {
      registerGsap();
      const node = ref.current;
      if (!node || prefersReducedMotion()) return;

      const counter = { current: 0 };
      const tween = gsap.to(counter, {
        current: value,
        duration: motion.duration.cinematic,
        ease: motion.ease.smooth,
        onUpdate: () => {
          node.textContent = format(counter.current);
        },
        scrollTrigger: { trigger: node, start: "top 90%", once: true },
      });

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    },
    { scope: ref, dependencies: [value, locale] },
  );

  return (
    <span className={cn("tabular", className)}>
      {prefix}
      <span ref={ref}>{format(value)}</span>
      {suffix}
    </span>
  );
}
