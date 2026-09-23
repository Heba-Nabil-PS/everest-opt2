"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { gsap, hasFinePointer, motion, prefersReducedMotion, registerGsap } from "@/lib/motion";

type CursorState = "default" | "link" | "hidden";

const INTERACTIVE = "a, button, [role='button'], summary, label[for], select, [data-cursor='view'], [data-cursor='drag']";
const TEXT_ENTRY = "input:not([type='checkbox']):not([type='radio']):not([type='submit']), textarea, [contenteditable='true']";

/**
 * A minimal follower: a small dot that opens into a thin ring over anything
 * clickable. The system cursor always stays visible — this layer only adds a
 * hint on top of it, so precision and accessibility settings are never
 * overridden. `data-cursor="hide"` removes it (media controls, maps).
 *
 * Mouse and trackpad only; never rendered for touch or reduced motion.
 */
export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [state, setState] = useState<CursorState>("hidden");
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const query = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setEnabled(hasFinePointer() && !prefersReducedMotion());
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    registerGsap();
    const node = root.current;
    if (!node) return;

    const toX = gsap.quickTo(node, "x", { duration: motion.duration.fast, ease: motion.ease.standard });
    const toY = gsap.quickTo(node, "y", { duration: motion.duration.fast, ease: motion.ease.standard });
    let visible = false;

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" && event.pointerType !== "pen") return;
      if (!visible) {
        gsap.set(node, { x: event.clientX, y: event.clientY });
        visible = true;
      }
      toX(event.clientX);
      toY(event.clientY);
    };

    const onOver = (event: PointerEvent) => {
      const target = event.target as Element | null;
      if (!target?.closest) return;

      if (target.closest("[data-cursor='hide']") || target.closest(TEXT_ENTRY)) setState("hidden");
      else if (target.closest(INTERACTIVE)) setState("link");
      else setState("default");
    };

    const onLeaveWindow = () => {
      visible = false;
      setState("hidden");
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeaveWindow);

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("pointerleave", onLeaveWindow);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    /* The outer layer follows the pointer; the inner mark changes state with
       transform and colour only (a fixed 28px circle, scaled), never its size. */
    <div
      ref={root}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0"
      style={{ zIndex: "var(--z-cursor)", direction: "ltr" }}
    >
      <div
        className={cn(
          "absolute -left-3.5 -top-3.5 h-7 w-7 rounded-full border",
          "transition-[scale,background-color,border-color,opacity] duration-300 ease-[var(--ease-out-soft)]",
          state === "hidden" && "scale-[0.25] border-transparent opacity-0",
          state === "default" && "scale-[0.25] border-transparent bg-glacier-400 opacity-90",
          state === "link" && "scale-100 border-glacier-400/80 bg-transparent",
        )}
      />
    </div>
  );
}
