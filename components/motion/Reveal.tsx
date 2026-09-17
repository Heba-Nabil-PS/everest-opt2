"use client";

import { useRef, type ElementType } from "react";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";
import { distance, gsap, motion, prefersReducedMotion, registerGsap } from "@/lib/motion";

type Animation = "fade-up" | "fade" | "scale-in" | "blur-up";

interface RevealProps {
  as?: ElementType;
  animation?: Animation;
  /** Animate direct children in sequence instead of the container itself. */
  stagger?: boolean;
  delay?: number;
  className?: string;
  /** Anchor target, for sections linked from the footer or a deep link. */
  id?: string;
  "aria-label"?: string;
  children: React.ReactNode;
}

function fromState(animation: Animation): gsap.TweenVars {
  switch (animation) {
    case "fade":
      return { opacity: 0 };
    case "scale-in":
      return { opacity: 0, scale: 0.94 };
    case "blur-up":
      return { opacity: 0, y: distance("medium"), filter: "blur(8px)" };
    default:
      return { opacity: 0, y: distance("medium") };
  }
}

/**
 * Scroll-triggered reveal, scoped to its own container so ScrollTrigger never
 * re-scans the whole page. Start states live in CSS (`[data-anim]` and
 * `[data-anim-children]`), so if JS fails or motion is reduced the content is
 * shown immediately rather than staying invisible.
 */
export function Reveal({
  as = "div",
  animation = "fade-up",
  stagger = false,
  delay = 0,
  className,
  id,
  "aria-label": ariaLabel,
  children,
}: RevealProps) {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      registerGsap();
      const root = scope.current;
      if (!root) return;

      const targets = stagger ? (Array.from(root.children) as HTMLElement[]) : [root];
      if (targets.length === 0) return;

      if (prefersReducedMotion()) {
        gsap.set(targets, { opacity: 1, y: 0, scale: 1, filter: "none" });
        return;
      }

      /* useGSAP's context reverts these tweens and their triggers on unmount. */
      gsap.fromTo(targets, fromState(animation), {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        duration: animation === "blur-up" ? motion.duration.slow : motion.duration.normal,
        delay,
        ease: motion.ease.smooth,
        stagger: stagger ? motion.stagger.items : 0,
        /* Only the filter is released. Transform and opacity must stay inline:
           clearing them would let the CSS start state (hidden, offset) return. */
        clearProps: "filter",
        scrollTrigger: { trigger: root, start: motion.start, once: true },
      });
    },
    { scope, dependencies: [animation, stagger, delay] },
  );

  const Tag = as;
  const marker = stagger ? { "data-anim-children": animation } : { "data-anim": animation };
  return (
    <Tag ref={scope} id={id} aria-label={ariaLabel} className={cn(className)} {...marker}>
      {children}
    </Tag>
  );
}
