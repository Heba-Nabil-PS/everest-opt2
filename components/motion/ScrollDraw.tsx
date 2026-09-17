"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion, registerGsap } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * A line that draws itself as its section scrolls into view (scaleY from the
 * top). Decorative only; the fully drawn state is the server-rendered default.
 */
export function ScrollDrawLine({ className }: { className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    registerGsap();
    const node = ref.current;
    if (!node || prefersReducedMotion()) return;
    gsap.fromTo(
      node,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: "none",
        scrollTrigger: { trigger: node, start: "top 80%", end: "bottom 55%", scrub: 0.6 },
      },
    );
  });

  return <span ref={ref} aria-hidden="true" className={cn("block origin-top", className)} />;
}

/** Circular progress ring that sweeps to `value`% when scrolled into view. */
export function ProgressRing({
  value,
  size = 88,
  stroke = 8,
  className,
  children,
}: {
  value: number;
  size?: number;
  stroke?: number;
  className?: string;
  children?: React.ReactNode;
}) {
  const ref = useRef<SVGCircleElement>(null);
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - value / 100);

  useGSAP(
    () => {
      registerGsap();
      const node = ref.current;
      if (!node || prefersReducedMotion()) return;
      gsap.fromTo(
        node,
        { strokeDashoffset: circumference },
        {
          strokeDashoffset: offset,
          duration: 1.6,
          ease: "power3.out",
          scrollTrigger: { trigger: node, start: "top 88%", once: true },
        },
      );
    },
    { dependencies: [value] },
  );

  return (
    <span className={cn("relative inline-grid place-items-center", className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90" aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="currentColor" strokeOpacity={0.12} strokeWidth={stroke} />
        <circle
          ref={ref}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <span className="absolute inset-0 grid place-items-center">{children}</span>
    </span>
  );
}
