"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { gsap, hasFinePointer, motion, prefersReducedMotion, registerGsap } from "@/lib/motion";

type CursorState = "default" | "link" | "view" | "drag" | "hidden";

const INTERACTIVE = "a, button, [role='button'], summary, label[for], select";
const TEXT_ENTRY = "input:not([type='checkbox']):not([type='radio']):not([type='submit']), textarea, [contenteditable='true']";

/**
 * A soft follower that tells the visitor what a click will do. The system
 * cursor always stays visible — this layer only adds meaning on top of it,
 * so precision and accessibility settings are never overridden.
 *
 * States come from markup, not from component wiring:
 *   data-cursor="view"  → large disc with the "View" label (cards)
 *   data-cursor="drag"  → large disc with the "Drag" label (sliders)
 *   data-cursor="hide"  → no follower (media controls, maps)
 *   data-cursor-label   → overrides the label text
 * Links and buttons get an expanded ring automatically.
 *
 * Mouse and trackpad only; never rendered for touch or reduced motion.
 */
export function Cursor({ labels }: { labels: { view: string; drag: string } }) {
  const [enabled, setEnabled] = useState(false);
  const [state, setState] = useState<CursorState>("hidden");
  const [label, setLabel] = useState("");
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

      const marked = target.closest<HTMLElement>("[data-cursor]");
      if (marked) {
        const kind = marked.dataset.cursor as CursorState | "hide";
        if (kind === "hide") {
          setState("hidden");
          return;
        }
        setState(kind);
        setLabel(marked.dataset.cursorLabel ?? (kind === "drag" ? labels.drag : labels.view));
        return;
      }

      if (target.closest(TEXT_ENTRY)) setState("hidden");
      else if (target.closest(INTERACTIVE)) setState("link");
      else setState("default");
    };

    const onLeaveWindow = () => {
      visible = false;
      setState("hidden");
    };

    const onDown = () => gsap.to(node.firstElementChild, { scale: 0.85, duration: motion.duration.instant });
    const onUp = () => gsap.to(node.firstElementChild, { scale: 1, duration: motion.duration.fast });

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeaveWindow);
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("pointerleave", onLeaveWindow);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, [enabled, labels.drag, labels.view]);

  if (!enabled) return null;

  const expanded = state === "view" || state === "drag";

  return (
    /* The outer layer follows the pointer; the inner disc changes state with
       transform and colour only (a fixed 96px disc, scaled), never its size. */
    <div
      ref={root}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0"
      style={{ zIndex: "var(--z-cursor)", direction: "ltr" }}
    >
      <div
        className={cn(
          "absolute -left-12 -top-12 grid h-24 w-24 place-items-center rounded-full border-2",
          "transition-[scale,background-color,border-color,opacity] duration-300 ease-[var(--ease-out-soft)]",
          state === "hidden" && "scale-[0.08] border-transparent opacity-0",
          state === "default" && "scale-[0.08] border-transparent bg-glacier-400 opacity-90",
          state === "link" && "scale-[0.46] border-glacier-400 bg-glacier-400/10",
          state === "view" && "scale-100 border-transparent bg-glacier-400 text-navy-800",
          state === "drag" && "scale-100 border-transparent bg-navy-700/90 text-white",
        )}
      >
        <span
          className={cn(
            "flex items-center gap-1.5 whitespace-nowrap text-2xs font-bold uppercase tracking-[0.16em] transition-opacity duration-200",
            expanded ? "opacity-100 delay-100" : "opacity-0",
          )}
        >
          {state === "drag" ? <span className="text-xs">‹</span> : null}
          {label}
          {state === "drag" ? <span className="text-xs">›</span> : null}
        </span>
      </div>
    </div>
  );
}
