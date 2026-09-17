"use client";

import { useRef, type ElementType } from "react";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";
import { gsap, motion, prefersReducedMotion, registerGsap, SplitText } from "@/lib/motion";

type Variant =
  /** Each line rises out of its own mask. The default for headings. */
  | "lines"
  /** Each word rises out of its own mask — for short, large display lines. */
  | "words"
  /** Words brighten one by one as the block is scrolled through — for statements. */
  | "scrub";

interface TextRevealProps {
  as?: ElementType;
  variant?: Variant;
  delay?: number;
  className?: string;
  id?: string;
  children: React.ReactNode;
}

/**
 * Typography as motion. Text is split with GSAP SplitText after fonts load
 * (and re-split on resize), so line breaks always match what is on screen.
 *
 * The words stay as real text in reading order, so assistive technology reads
 * the sentence normally. Arabic is only ever split into lines or words, never
 * characters, so letters keep their joined forms.
 *
 * Until the split runs, CSS keeps the block hidden (`[data-text-reveal]`);
 * without JavaScript or with reduced motion it is simply shown.
 */
export function TextReveal({
  as = "div",
  variant = "lines",
  delay = 0,
  className,
  id,
  children,
}: TextRevealProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      registerGsap();
      const node = ref.current;
      if (!node) return;

      const show = () => gsap.set(node, { visibility: "visible" });

      if (prefersReducedMotion()) {
        show();
        return;
      }

      let played = false;

      const split = SplitText.create(node, {
        type: variant === "lines" ? "lines" : "words,lines",
        mask: variant === "scrub" ? undefined : variant,
        linesClass: "split-line",
        wordsClass: "split-word",
        aria: "none",
        autoSplit: true,
        onSplit(self) {
          show();

          if (variant === "scrub") {
            return gsap.fromTo(
              self.words,
              { opacity: 0.16 },
              {
                opacity: 1,
                ease: motion.ease.linear,
                stagger: 0.1,
                scrollTrigger: {
                  trigger: node,
                  start: "top 82%",
                  end: "bottom 50%",
                  scrub: 0.6,
                },
              },
            );
          }

          /* A re-split after the reveal has played must not replay it. */
          if (played) return;

          const targets = variant === "words" ? self.words : self.lines;
          return gsap.from(targets, {
            yPercent: 110,
            rotate: variant === "words" ? 4 : 0,
            duration: motion.duration.slow,
            ease: motion.ease.smooth,
            stagger: variant === "words" ? motion.stagger.text * 2 : motion.stagger.items,
            delay,
            scrollTrigger: {
              trigger: node,
              start: motion.start,
              once: true,
            },
            onComplete: () => {
              played = true;
            },
          });
        },
      });

      return () => split.revert();
    },
    { scope: ref, dependencies: [variant, delay] },
  );

  const Tag = as;
  return (
    <Tag ref={ref} id={id} className={cn(className)} data-text-reveal={variant}>
      {children}
    </Tag>
  );
}
