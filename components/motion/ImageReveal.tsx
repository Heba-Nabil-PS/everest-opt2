"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";
import { gsap, isRtl, mediaQueries, motion, registerGsap } from "@/lib/motion";

type Variant =
  /** The frame wipes open from the bottom while the picture settles from a zoom. */
  | "clip-up"
  /** The frame wipes open along the reading direction. */
  | "clip-side"
  /** Opacity and a slight zoom — the quiet one, for grids. */
  | "scale"
  /** A brand-navy panel lifts off the picture. */
  | "curtain"
  /** An inset, rounded window grows to the full frame as it is scrolled through. */
  | "window";

interface ImageRevealProps {
  variant?: Variant;
  /** Inner drift while the frame crosses the viewport, in % of its height. */
  parallax?: number;
  delay?: number;
  className?: string;
  /** Classes for the inner layer that holds the media. */
  innerClassName?: string;
  children: React.ReactNode;
}

/**
 * Image and video reveals. The outer frame is clipped, the inner layer
 * carries the zoom and parallax, so every variant animates only `clip-path`,
 * `transform` and `opacity`. Initial states live in CSS so a failed script
 * never leaves an image hidden. On phones the parallax travel is halved.
 */
export function ImageReveal({
  variant = "clip-up",
  parallax = 0,
  delay = 0,
  className,
  innerClassName,
  children,
}: ImageRevealProps) {
  const frame = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const curtain = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      registerGsap();
      const outer = frame.current;
      const media = inner.current;
      if (!outer || !media) return;

      const mm = gsap.matchMedia();

      mm.add(
        { motionOk: mediaQueries.motionOk, desktop: mediaQueries.desktop },
        (context) => {
          const { motionOk, desktop } = context.conditions as Record<string, boolean>;

          if (!motionOk) {
            gsap.set(outer, { clipPath: "none", opacity: 1 });
            gsap.set(media, { scale: 1 });
            if (curtain.current) gsap.set(curtain.current, { scaleY: 0 });
            return;
          }

          const trigger = { trigger: outer, start: motion.start, once: true };
          const reveal = { duration: motion.duration.slow, ease: motion.ease.expressive, delay };
          /* Once open, drop the clip entirely so shadows and focus rings show. */
          const release = () => {
            outer.style.clipPath = "none";
          };

          switch (variant) {
            case "clip-up":
              gsap.fromTo(outer, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", ...reveal, onComplete: release, scrollTrigger: trigger });
              gsap.fromTo(media, { scale: 1.2 }, { scale: 1, duration: motion.duration.cinematic, ease: motion.ease.smooth, delay, scrollTrigger: trigger });
              break;
            case "clip-side": {
              const from = isRtl() ? "inset(0% 0% 0% 100%)" : "inset(0% 100% 0% 0%)";
              gsap.fromTo(outer, { clipPath: from }, { clipPath: "inset(0% 0% 0% 0%)", ...reveal, onComplete: release, scrollTrigger: trigger });
              gsap.fromTo(media, { scale: 1.15 }, { scale: 1, duration: motion.duration.cinematic, ease: motion.ease.smooth, delay, scrollTrigger: trigger });
              break;
            }
            case "scale":
              gsap.fromTo(outer, { opacity: 0 }, { opacity: 1, duration: motion.duration.normal, ease: motion.ease.standard, delay, scrollTrigger: trigger });
              gsap.fromTo(media, { scale: 1.08 }, { scale: 1, duration: motion.duration.slow, ease: motion.ease.smooth, delay, scrollTrigger: trigger });
              break;
            case "curtain":
              if (curtain.current) {
                gsap.fromTo(curtain.current, { scaleY: 1 }, { scaleY: 0, ...reveal, scrollTrigger: trigger });
              }
              gsap.fromTo(media, { scale: 1.18 }, { scale: 1, duration: motion.duration.cinematic, ease: motion.ease.smooth, delay, scrollTrigger: trigger });
              break;
            case "window":
              gsap.fromTo(
                outer,
                { clipPath: desktop ? "inset(14% 10% 14% 10% round 32px)" : "inset(6% 4% 6% 4% round 20px)" },
                {
                  clipPath: "inset(0% 0% 0% 0% round 0px)",
                  ease: motion.ease.linear,
                  scrollTrigger: { trigger: outer, start: "top 90%", end: "top 20%", scrub: true },
                },
              );
              gsap.fromTo(
                media,
                { scale: 1.25 },
                {
                  scale: 1,
                  ease: motion.ease.linear,
                  scrollTrigger: { trigger: outer, start: "top 90%", end: "top 20%", scrub: true },
                },
              );
              break;
          }

          if (parallax) {
            const travel = desktop ? parallax : parallax * motion.mobileScale;
            gsap.fromTo(
              media,
              { yPercent: -travel / 2 },
              {
                yPercent: travel / 2,
                ease: motion.ease.linear,
                scrollTrigger: { trigger: outer, start: "top bottom", end: "bottom top", scrub: true },
              },
            );
          }
        },
      );

      return () => mm.revert();
    },
    { scope: frame, dependencies: [variant, parallax, delay] },
  );

  return (
    <div ref={frame} data-image-reveal={variant} className={cn("relative overflow-hidden", className)}>
      <div
        ref={inner}
        className={cn(
          "will-change-transform",
          /* Oversize the layer so the parallax drift never exposes an edge
             (the frame then needs its own height). */
          parallax ? "absolute inset-x-0 -top-[10%] h-[120%]" : "relative h-full w-full",
          innerClassName,
        )}
      >
        {children}
      </div>
      {variant === "curtain" ? (
        <span
          ref={curtain}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 origin-top bg-navy-800"
        />
      ) : null}
    </div>
  );
}
