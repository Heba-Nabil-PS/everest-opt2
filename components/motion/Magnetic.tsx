"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";
import { gsap, hasFinePointer, motion, prefersReducedMotion, registerGsap } from "@/lib/motion";

/**
 * Pulls its child a few pixels toward the pointer, then springs back on leave.
 * Reserved for the one or two primary actions in a view — a page full of
 * magnetic buttons stops meaning anything. Mouse and trackpad only.
 */
export function Magnetic({
  strength = 0.28,
  className,
  children,
}: {
  /** Fraction of the pointer offset the child follows (0.2–0.4). */
  strength?: number;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    (_context, contextSafe) => {
      registerGsap();
      const node = ref.current;
      const target = node?.firstElementChild as HTMLElement | null;
      if (!node || !target || !hasFinePointer() || prefersReducedMotion() || !contextSafe) return;

      const toX = gsap.quickTo(target, "x", { duration: motion.duration.fast, ease: motion.ease.standard });
      const toY = gsap.quickTo(target, "y", { duration: motion.duration.fast, ease: motion.ease.standard });

      const onMove = contextSafe((event: PointerEvent) => {
        const rect = node.getBoundingClientRect();
        toX((event.clientX - (rect.left + rect.width / 2)) * strength);
        toY((event.clientY - (rect.top + rect.height / 2)) * strength);
      });

      const onLeave = contextSafe(() => {
        gsap.to(target, { x: 0, y: 0, duration: motion.duration.slow, ease: "elastic.out(1, 0.45)" });
      });

      node.addEventListener("pointermove", onMove);
      node.addEventListener("pointerleave", onLeave);
      return () => {
        node.removeEventListener("pointermove", onMove);
        node.removeEventListener("pointerleave", onLeave);
      };
    },
    { scope: ref, dependencies: [strength] },
  );

  return (
    <span ref={ref} className={cn("inline-flex", className)}>
      {children}
    </span>
  );
}
