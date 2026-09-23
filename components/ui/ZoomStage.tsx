"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "./Icon";
import { cn } from "@/lib/utils";

const MIN_SCALE = 1;
/* Source artwork is ~620px wide, so past 3x there are no pixels left to show. */
const MAX_SCALE = 3;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

/**
 * A magnified view of whatever is placed inside it — a product photograph on
 * the gallery stage, a certificate inside a dialog.
 *
 * The wheel is the zoom control: it is captured here (a non-passive listener,
 * so the page behind never scrolls instead) and applied around the pointer, so
 * the detail under the cursor is the detail that grows. Dragging pans, clamped
 * to the frame so the content can never be thrown off-screen, and a
 * double-click toggles between fitted and magnified.
 *
 * The controls float over the content rather than sitting under it: the frame
 * is the host's size, and a control strip below would push the layout around
 * every time the zoom opened.
 */
export function ZoomStage({
  children,
  className,
  hint,
  labels,
  onClose,
  initialScale = 2,
  showClose = true,
}: {
  children: React.ReactNode;
  className?: string;
  hint: string;
  labels: { zoomIn: string; zoomOut: string; reset: string; close: string };
  onClose: () => void;
  /**
   * Opening scale. A photograph opens magnified, because the click asked for
   * a closer look; a document opens whole, because it has to be read before
   * any part of it is worth enlarging.
   */
  initialScale?: number;
  /** Off when the host already provides a close control, such as a dialog. */
  showClose?: boolean;
}) {
  const frame = useRef<HTMLDivElement>(null);
  const [tform, setTform] = useState({ scale: initialScale, x: 0, y: 0 });
  const zoomed = tform.scale > 1;

  /* Escape leaves the zoom, as it would a dialog. */
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  /* Pan is limited to the overflow the current scale creates. */
  const settle = useCallback((next: { scale: number; x: number; y: number }) => {
    const box = frame.current?.getBoundingClientRect();
    if (!box || next.scale <= 1) return { scale: next.scale, x: 0, y: 0 };
    const maxX = (box.width * (next.scale - 1)) / 2;
    const maxY = (box.height * (next.scale - 1)) / 2;
    return {
      scale: next.scale,
      x: clamp(next.x, -maxX, maxX),
      y: clamp(next.y, -maxY, maxY),
    };
  }, []);

  /* Scale around a point, keeping whatever sits under it in place. */
  const zoomAround = useCallback(
    (factor: number, pointX: number, pointY: number) =>
      setTform((prev) => {
        const scale = clamp(prev.scale * factor, MIN_SCALE, MAX_SCALE);
        const ratio = scale / prev.scale;
        return settle({
          scale,
          x: pointX - (pointX - prev.x) * ratio,
          y: pointY - (pointY - prev.y) * ratio,
        });
      }),
    [settle],
  );

  useEffect(() => {
    const node = frame.current;
    if (!node) return;

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      const box = node.getBoundingClientRect();
      zoomAround(
        Math.exp(-event.deltaY * 0.0018),
        event.clientX - box.left - box.width / 2,
        event.clientY - box.top - box.height / 2,
      );
    };

    node.addEventListener("wheel", onWheel, { passive: false });
    return () => node.removeEventListener("wheel", onWheel);
  }, [zoomAround]);

  /* Drag to pan, once there is something to pan to. */
  useEffect(() => {
    const node = frame.current;
    if (!node) return;

    let pointerId: number | null = null;
    let lastX = 0;
    let lastY = 0;

    const onDown = (event: PointerEvent) => {
      if (event.button !== 0) return;
      /* Without this the browser starts its own image drag on the <img>
         underneath, which cancels the pointer stream and kills the pan. */
      event.preventDefault();
      pointerId = event.pointerId;
      lastX = event.clientX;
      lastY = event.clientY;
      node.setPointerCapture(event.pointerId);
    };

    const onMove = (event: PointerEvent) => {
      if (pointerId !== event.pointerId) return;
      const dx = event.clientX - lastX;
      const dy = event.clientY - lastY;
      lastX = event.clientX;
      lastY = event.clientY;
      setTform((prev) =>
        prev.scale <= 1 ? prev : settle({ ...prev, x: prev.x + dx, y: prev.y + dy }),
      );
    };

    const onUp = (event: PointerEvent) => {
      if (pointerId !== event.pointerId) return;
      pointerId = null;
      node.releasePointerCapture(event.pointerId);
    };

    /* Belt and braces: Firefox starts the drag from `dragstart`, not from the
       unprevented pointerdown, so both routes have to be closed off. */
    const onDragStart = (event: DragEvent) => event.preventDefault();

    node.addEventListener("pointerdown", onDown);
    node.addEventListener("pointermove", onMove);
    node.addEventListener("pointerup", onUp);
    node.addEventListener("pointercancel", onUp);
    node.addEventListener("dragstart", onDragStart);

    return () => {
      node.removeEventListener("pointerdown", onDown);
      node.removeEventListener("pointermove", onMove);
      node.removeEventListener("pointerup", onUp);
      node.removeEventListener("pointercancel", onUp);
      node.removeEventListener("dragstart", onDragStart);
    };
  }, [settle]);

  const step = (factor: number) => zoomAround(factor, 0, 0);

  /* Navy chips on the white studio ground, matching the gallery arrows. */
  const chip =
    "grid h-10 w-10 place-items-center rounded-full bg-navy-900/85 text-white shadow-lg ring-1 ring-white/20 backdrop-blur-sm transition-[background-color,opacity] duration-200 enabled:hover:bg-glacier-400 enabled:hover:text-navy-900 disabled:cursor-default disabled:opacity-30";

  return (
    <div
      ref={frame}
      data-cursor={zoomed ? "drag" : "hide"}
      onDoubleClick={() => (zoomed ? setTform({ scale: 1, x: 0, y: 0 }) : step(2.2))}
      className={cn(
        "relative touch-none select-none overflow-hidden",
        zoomed ? "cursor-grab active:cursor-grabbing" : "cursor-zoom-in",
        className,
      )}
    >
      <div
        className="h-full w-full origin-center will-change-transform"
        style={{
          transform: `translate3d(${tform.x}px, ${tform.y}px, 0) scale(${tform.scale})`,
          transition: "transform 90ms linear",
        }}
      >
        {children}
      </div>

      {showClose ? (
        <button type="button" onClick={onClose} aria-label={labels.close} className={cn(chip, "absolute end-3 top-3")}>
          <Icon name="close" size={20} />
        </button>
      ) : null}

      <div className="absolute inset-x-3 bottom-3 flex items-center gap-2">
        {(
          [
            ["minus", 1 / 1.4, labels.zoomOut] as const,
            ["plus", 1.4, labels.zoomIn] as const,
          ]
        ).map(([icon, factor, label]) => (
          <button
            key={label}
            type="button"
            onClick={() => step(factor)}
            aria-label={label}
            disabled={factor < 1 ? !zoomed : tform.scale >= MAX_SCALE}
            className={chip}
          >
            <Icon name={icon} size={20} />
          </button>
        ))}

        <button
          type="button"
          onClick={() => setTform({ scale: 1, x: 0, y: 0 })}
          disabled={!zoomed}
          aria-label={labels.reset}
          className={chip}
        >
          <Icon name="rotate" size={20} />
        </button>

        <p
          aria-hidden="true"
          className="ltr-inline tabular ms-auto rounded-full bg-navy-950/70 px-3 py-1 font-display text-xs font-bold text-white backdrop-blur-sm"
        >
          {Math.round(tform.scale * 100)}%
        </p>
      </div>

      <p className={cn(
          "ltr-inline pointer-events-none absolute start-3 top-3 w-fit max-w-full truncate rounded-full bg-navy-950/70 px-3 py-1.5 text-2xs text-white/80 backdrop-blur-sm",
          showClose && "me-14",
        )}>
        {hint}
      </p>
    </div>
  );
}
