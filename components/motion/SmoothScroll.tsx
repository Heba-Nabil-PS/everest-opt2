"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, hasFinePointer, prefersReducedMotion, registerGsap, ScrollTrigger } from "@/lib/motion";

let instance: Lenis | null = null;

/** The active smooth-scroll instance, or null on touch / reduced motion. */
export function getLenis() {
  return instance;
}

/** Scroll the window, through Lenis when it is running so the two never fight. */
export function scrollToY(y: number, { immediate = false } = {}) {
  if (instance) {
    instance.scrollTo(y, { immediate, force: true });
  } else {
    window.scrollTo({ top: y, behavior: immediate || prefersReducedMotion() ? "instant" : "smooth" });
  }
}

/**
 * Inertial wheel scrolling for mouse and trackpad users. Lenis drives the
 * native scroll position (no transformed wrapper), so `position: sticky`,
 * anchors, find-in-page and focus scrolling all keep working. It is skipped
 * entirely on touch devices — native momentum is already right there — and
 * for reduced motion.
 *
 * GSAP's ticker drives Lenis so ScrollTrigger reads the same frame.
 */
export function SmoothScroll() {
  useEffect(() => {
    registerGsap();
    if (!hasFinePointer() || prefersReducedMotion()) return;

    const lenis = new Lenis({
      lerp: 0.1,
      wheelMultiplier: 1,
      /* Menus, the search list, modals and the chat panel scroll on their own. */
      allowNestedScroll: true,
      anchors: { offset: -96 },
      stopInertiaOnNavigate: true,
    });
    instance = lenis;

    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    /* Dialogs lock the page by setting `overflow: hidden` on <body>. Lenis
       scrolls programmatically, which that lock does not stop, so pause it. */
    const body = document.body;
    const syncLock = () => {
      if (body.style.overflow === "hidden") lenis.stop();
      else lenis.start();
    };
    const observer = new MutationObserver(syncLock);
    observer.observe(body, { attributes: true, attributeFilter: ["style"] });

    return () => {
      observer.disconnect();
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
      instance = null;
    };
  }, []);

  return null;
}
