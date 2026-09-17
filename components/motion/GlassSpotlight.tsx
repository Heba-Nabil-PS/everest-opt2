"use client";

import { useEffect } from "react";
import { hasFinePointer, prefersReducedMotion } from "@/lib/motion";

/**
 * One pointer listener for the whole site: over any `.glass-spot` element it
 * writes the pointer position as `--spot-x` / `--spot-y`, which the element's
 * CSS highlight follows. No React state, no per-card listeners.
 */
export function GlassSpotlight() {
  useEffect(() => {
    if (!hasFinePointer() || prefersReducedMotion()) return;

    let frame = 0;
    let last: PointerEvent | null = null;

    const apply = () => {
      frame = 0;
      const event = last;
      const target = (event?.target as Element | null)?.closest?.<HTMLElement>(".glass-spot");
      if (!event || !target) return;
      const rect = target.getBoundingClientRect();
      target.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
      target.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
    };

    const onMove = (event: PointerEvent) => {
      last = event;
      if (!frame) frame = requestAnimationFrame(apply);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
