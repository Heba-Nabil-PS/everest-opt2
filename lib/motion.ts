import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

let registered = false;

/** Register GSAP plugins exactly once, on the client. */
export function registerGsap() {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger, SplitText);
  gsap.defaults({ ease: motion.ease.standard, duration: motion.duration.normal });
  /* Mobile address bars resize the viewport on every scroll; refreshing on
     that would jump pinned sections. Width changes still refresh. */
  ScrollTrigger.config({ ignoreMobileResize: true });
  registered = true;
}

export function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    document.documentElement.classList.contains("motion-off")
  );
}

/** A mouse or trackpad: hover, magnetic pull and the custom cursor apply. */
export function hasFinePointer() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

export function isRtl() {
  return typeof document !== "undefined" && document.documentElement.dir === "rtl";
}

/**
 * The motion language. Every animation on the site draws from these tokens,
 * so the whole product moves with one rhythm: interactions are fast, scroll
 * storytelling is slow, and nothing invents its own timing.
 *
 * The CSS mirror of these values lives in `app/globals.css` (`--dur-*`,
 * `--ease-*`, `--dist-*`) for transitions that never touch JavaScript.
 */
export const motion = {
  duration: {
    /** Hover and press feedback. */
    instant: 0.15,
    /** Menus, toggles, small UI. */
    fast: 0.3,
    /** Content reveals. */
    normal: 0.6,
    /** Headline and image reveals. */
    slow: 0.9,
    /** Section-scale, atmospheric movement. */
    cinematic: 1.4,
  },
  ease: {
    /** Default for UI: decisive start, soft landing. */
    standard: "power3.out",
    /** Reveals: long, calm deceleration. */
    smooth: "expo.out",
    /** Masks, curtains and page-scale moves. */
    expressive: "power4.inOut",
    /** Symmetric moves such as sliders settling. */
    inOut: "power2.inOut",
    /** Scroll-scrubbed tweens track the scrollbar 1:1. */
    linear: "none",
  },
  /** Travel in px. Mobile uses the `mobileScale` fraction of these. */
  distance: {
    small: 16,
    medium: 40,
    large: 96,
  },
  stagger: {
    /** Characters and words in a headline. */
    text: 0.035,
    /** Cards, list items. Never stagger more than ~8 children. */
    items: 0.08,
  },
  /** How far a reveal starts: the element's top crosses this viewport line. */
  start: "top 85%",
  mobileScale: 0.5,
} as const;

/** Media conditions shared by every `gsap.matchMedia()` call. */
export const mediaQueries = {
  desktop: "(min-width: 1024px)",
  mobile: "(max-width: 1023px)",
  fine: "(hover: hover) and (pointer: fine)",
  motionOk: "(prefers-reduced-motion: no-preference)",
  reduced: "(prefers-reduced-motion: reduce)",
} as const;

/** Distance token scaled down on small screens, where long travel feels heavy. */
export function distance(size: keyof typeof motion.distance) {
  if (typeof window === "undefined") return motion.distance[size];
  const small = window.matchMedia(mediaQueries.mobile).matches;
  return Math.round(motion.distance[size] * (small ? motion.mobileScale : 1));
}

/** Reveal the final state immediately — used whenever motion is suppressed. */
export function revealImmediately(scope: Element | null) {
  if (!scope) return;
  const targets = scope.querySelectorAll<HTMLElement>("[data-anim]");
  gsap.set(targets, { opacity: 1, y: 0, scale: 1, clearProps: "transform" });
}

export { gsap, ScrollTrigger, SplitText };
