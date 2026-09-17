"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";
import { isRtl, prefersReducedMotion } from "@/lib/motion";

interface SliderProps {
  /** Accessible name for the carousel region. */
  label: string;
  slides: React.ReactNode[];
  labels: { previous: string; next: string };
  /** Width of one slide; controls how many are visible per breakpoint. */
  slideClassName?: string;
  className?: string;
  /** Visual tone of the controls. */
  inverse?: boolean;
  /** Slot rendered at the start of the control row, e.g. a "View all" link. */
  footer?: React.ReactNode;
}

const DRAG_THRESHOLD = 6;

/**
 * The site's one carousel. It is a native horizontal scroller with snap
 * points, so touch devices get real momentum and the browser's own keyboard
 * scrolling, and RTL works without mirrored maths. On top of that:
 *
 *  - mouse drag with release momentum (and the "Drag" cursor),
 *  - previous / next buttons that disable at either end,
 *  - a progress bar and an "03 / 06" counter written straight to the DOM,
 *  - `data-active` on the slide nearest the start edge, for styling.
 *
 * A drag never fires the click on the card underneath it.
 */
export function Slider({
  label,
  slides,
  labels,
  slideClassName = "w-[82%] sm:w-[46%] lg:w-[31.5%]",
  className,
  inverse,
  footer,
}: SliderProps) {
  const track = useRef<HTMLUListElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [overflowing, setOverflowing] = useState(false);
  const total = slides.length;

  const measure = useCallback(() => {
    const node = track.current;
    if (!node) return;

    const max = node.scrollWidth - node.clientWidth;
    const offset = Math.abs(node.scrollLeft);
    const progress = max > 0 ? offset / max : 1;

    if (bar.current) bar.current.style.transform = `scaleX(${Math.max(progress, 1 / Math.max(total, 1))})`;

    setOverflowing(max > 4);
    setAtStart(offset < 4);
    setAtEnd(offset > max - 4);

    /* The active slide is the one whose leading edge is nearest the track's. */
    const items = Array.from(node.children) as HTMLElement[];
    const rtl = isRtl();
    const edge = node.getBoundingClientRect();
    let nearest = 0;
    let best = Infinity;
    items.forEach((item, index) => {
      const rect = item.getBoundingClientRect();
      const distance = Math.abs(rtl ? edge.right - rect.right : rect.left - edge.left);
      if (distance < best) {
        best = distance;
        nearest = index;
      }
    });
    setActive(offset > max - 4 && max > 0 ? total - 1 : nearest);
  }, [total]);

  useEffect(() => {
    const node = track.current;
    if (!node) return;

    let frame = 0;
    const onScroll = () => {
      if (!frame) {
        frame = requestAnimationFrame(() => {
          frame = 0;
          measure();
        });
      }
    };

    measure();
    node.addEventListener("scroll", onScroll, { passive: true });
    const observer = new ResizeObserver(onScroll);
    observer.observe(node);

    return () => {
      node.removeEventListener("scroll", onScroll);
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [measure]);

  /* Mouse drag with momentum. Touch and pen already scroll natively. */
  useEffect(() => {
    const node = track.current;
    if (!node) return;

    let pointerId: number | null = null;
    let startX = 0;
    let startScroll = 0;
    let lastX = 0;
    let lastTime = 0;
    let velocity = 0;
    let dragged = false;

    const onDown = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || event.button !== 0) return;
      pointerId = event.pointerId;
      startX = lastX = event.clientX;
      startScroll = node.scrollLeft;
      lastTime = performance.now();
      velocity = 0;
      dragged = false;
    };

    const onMove = (event: PointerEvent) => {
      if (pointerId !== event.pointerId) return;
      const dx = event.clientX - startX;

      if (!dragged && Math.abs(dx) > DRAG_THRESHOLD) {
        dragged = true;
        node.setPointerCapture(event.pointerId);
        node.classList.add("is-dragging");
      }
      if (!dragged) return;

      const now = performance.now();
      velocity = (event.clientX - lastX) / Math.max(now - lastTime, 1);
      lastX = event.clientX;
      lastTime = now;
      node.scrollLeft = startScroll - dx;
    };

    const onUp = (event: PointerEvent) => {
      if (pointerId !== event.pointerId) return;
      pointerId = null;
      if (!dragged) return;

      node.releasePointerCapture(event.pointerId);
      node.classList.remove("is-dragging");
      /* Fling in the drag direction, then let snap settle on a slide. */
      const fling = prefersReducedMotion() ? 0 : -velocity * 280;
      node.scrollBy({ left: fling, behavior: prefersReducedMotion() ? "instant" : "smooth" });
    };

    /* Swallow the click that ends a drag so a card is not opened by accident. */
    const onClick = (event: MouseEvent) => {
      if (dragged) {
        event.preventDefault();
        event.stopPropagation();
        dragged = false;
      }
    };

    /* Native image dragging would hijack the gesture. */
    const onDragStart = (event: DragEvent) => event.preventDefault();

    node.addEventListener("pointerdown", onDown);
    node.addEventListener("pointermove", onMove);
    node.addEventListener("pointerup", onUp);
    node.addEventListener("pointercancel", onUp);
    node.addEventListener("click", onClick, true);
    node.addEventListener("dragstart", onDragStart);

    return () => {
      node.removeEventListener("pointerdown", onDown);
      node.removeEventListener("pointermove", onMove);
      node.removeEventListener("pointerup", onUp);
      node.removeEventListener("pointercancel", onUp);
      node.removeEventListener("click", onClick, true);
      node.removeEventListener("dragstart", onDragStart);
    };
  }, []);

  const step = (direction: 1 | -1) => {
    const node = track.current;
    const first = node?.firstElementChild as HTMLElement | null;
    if (!node || !first) return;
    const gap = parseFloat(getComputedStyle(node).columnGap) || 0;
    const amount = (first.offsetWidth + gap) * direction * (isRtl() ? -1 : 1);
    node.scrollBy({ left: amount, behavior: prefersReducedMotion() ? "instant" : "smooth" });
  };

  const counter = (n: number) => String(n).padStart(2, "0");

  return (
    <div role="region" aria-roledescription="carousel" aria-label={label} className={cn("relative", className)}>
      {/* A real list, and a focusable scroller so arrow keys scroll it. */}
      <ul
        ref={track}
        tabIndex={overflowing ? 0 : -1}
        data-cursor={overflowing ? "drag" : undefined}
        data-lenis-prevent-horizontal
        className={cn(
          /* overflow-y hidden: the track must never count as a vertical scroller,
             or vertical scrolling stops when the pointer is over it. */
          "slider-track no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto overflow-y-hidden overscroll-x-contain lg:gap-6",
          /* Room for focus rings and hover lift inside the scroll clip. */
          "-my-4 py-4",
        )}
      >
        {slides.map((slide, index) => (
          <li
            key={index}
            data-active={index === active ? "true" : undefined}
            className={cn("shrink-0 snap-start", slideClassName)}
          >
            {slide}
          </li>
        ))}
      </ul>

      <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
        {footer ? <div className="me-auto">{footer}</div> : null}

        {overflowing ? (
          <>
            <p
              aria-hidden="true"
              className={cn(
                "tabular font-display text-sm font-bold",
                inverse ? "text-white" : "text-ink-strong",
                !footer && "me-auto",
              )}
            >
              <span className="ltr-inline">
                {counter(active + 1)}
                <span className={inverse ? "text-white/40" : "text-ink-muted"}> / {counter(total)}</span>
              </span>
            </p>

            <span
              aria-hidden="true"
              className={cn(
                "relative hidden h-px w-40 overflow-hidden sm:block lg:w-56",
                inverse ? "bg-white/20" : "bg-hairline-strong",
              )}
            >
              <span
                ref={bar}
                className="absolute inset-0 origin-left bg-glacier-400 transition-transform duration-300 ease-[var(--ease-out-soft)] rtl:origin-right"
              />
            </span>

            <div className="flex gap-2">
              {([-1, 1] as const).map((direction) => (
                <button
                  key={direction}
                  type="button"
                  onClick={() => step(direction)}
                  disabled={direction === -1 ? atStart : atEnd}
                  aria-label={direction === -1 ? labels.previous : labels.next}
                  className={cn(
                    "group grid h-12 w-12 place-items-center rounded-full border transition-[background-color,border-color,color,opacity] duration-200",
                    "disabled:cursor-default disabled:opacity-35",
                    inverse
                      ? "border-white/25 text-white enabled:hover:border-glacier-300 enabled:hover:bg-glacier-400 enabled:hover:text-navy-900"
                      : "border-hairline-strong text-ink-strong enabled:hover:border-navy-700 enabled:hover:bg-navy-700 enabled:hover:text-white",
                  )}
                >
                  <Icon
                    name={direction === -1 ? "arrowLeft" : "arrowRight"}
                    size={20}
                    className={cn(
                      "transition-transform duration-200 rtl:-scale-x-100",
                      direction === -1 ? "group-enabled:group-hover:-translate-x-0.5" : "group-enabled:group-hover:translate-x-0.5",
                    )}
                  />
                </button>
              ))}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
