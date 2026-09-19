"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { Icon } from "@/components/ui/Icon";
import { ProductRender, type RenderAngle } from "@/components/art/ProductRender";
import { ProductMorph } from "./ProductMorph";
import { ProductPhoto } from "./ProductPhoto";
import { cn } from "@/lib/utils";
import { isRtl, prefersReducedMotion } from "@/lib/motion";
import { t, type Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n/config";
import type { Product } from "@/lib/data/types";

const angles: RenderAngle[] = ["three-quarter", "front", "detail"];

/** Travel before a press counts as a drag rather than a click. */
const DRAG_THRESHOLD = 6;
const MIN_SCALE = 1;
/* The cut-outs are ~620px wide, so past 3x there are no pixels left to show. */
const MAX_SCALE = 3;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

/**
 * Mouse drag to scroll a native horizontal scroller, with release momentum —
 * the same gesture the site's carousel uses. Touch and pen already scroll
 * natively, so only the mouse is wired up here.
 *
 * The click that ends a drag is swallowed in the capture phase, so dragging
 * the stage never opens the zoom and dragging the strip never jumps a slide.
 */
function useDragScroll(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const node = ref.current;
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

    const onClick = (event: MouseEvent) => {
      if (!dragged) return;
      event.preventDefault();
      event.stopPropagation();
      dragged = false;
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
  }, [ref]);
}

/**
 * The model's photographs as one draggable stage with a draggable thumbnail
 * strip beneath it. Clicking the photograph opens it magnified, where the
 * wheel drives the zoom.
 *
 * Both rows are native snap scrollers, so touch gets real momentum and RTL
 * needs no mirrored maths; the thumbnails scroll the stage with a measured
 * delta rather than an index calculation, which is direction-agnostic too.
 *
 * Every view is a named, described image — a buyer never sees a bare tile.
 * Models without photography fall back to the rendered angles.
 */
export function ProductGallery({
  product,
  locale,
  dictionary: d,
}: {
  product: Product;
  locale: Locale;
  dictionary: Dictionary;
}) {
  const track = useRef<HTMLUListElement>(null);
  const strip = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);
  /* Which photograph the zoom is showing — null when it is closed. */
  const [zoomIndex, setZoomIndex] = useState<number | null>(null);

  const hasPhotos = product.images.length > 0;
  const count = hasPhotos ? product.images.length : angles.length;

  useDragScroll(track);
  useDragScroll(strip);

  const altFor = (index: number) => {
    if (hasPhotos) {
      return `${product.name} ${product.code} — ${
        locale === "ar" ? `صورة ${index + 1} من ${count}` : `photo ${index + 1} of ${count}`
      }`;
    }
    return {
      "three-quarter": `${product.name} ${product.code} — ${locale === "ar" ? "منظور ثلاثة أرباع" : "three-quarter view"}`,
      front: `${product.name} ${product.code} — ${locale === "ar" ? "منظور أمامي" : "front view"}`,
      detail: `${product.name} ${product.code} — ${locale === "ar" ? "تفاصيل الباب ووحدة التحكّم" : "door seal and controller detail"}`,
    }[angles[index]];
  };

  const view = (
    index: number,
    alt: string,
    sizes: string,
    { priority, bleed }: { priority?: boolean; bleed?: boolean } = {},
  ) =>
    hasPhotos ? (
      <ProductPhoto
        src={product.images[index]}
        alt={alt}
        sizes={sizes}
        priority={priority}
        /* In the zoom the studio margin is wasted magnification, so the
           cut-out is allowed to reach the edges of the frame. */
        imageClassName={bleed ? "p-0" : undefined}
      />
    ) : (
      <ProductRender art={product.art} angle={angles[index]} alt={alt} />
    );

  /* The slide whose leading edge sits nearest the track's — the same rule the
     site's carousel uses, so LTR and RTL both fall out of the measurement. */
  const measure = useCallback(() => {
    const node = track.current;
    if (!node) return;
    const rtl = isRtl();
    const edge = node.getBoundingClientRect();
    let nearest = 0;
    let best = Infinity;
    (Array.from(node.children) as HTMLElement[]).forEach((item, index) => {
      const rect = item.getBoundingClientRect();
      const distance = Math.abs(rtl ? edge.right - rect.right : rect.left - edge.left);
      if (distance < best) {
        best = distance;
        nearest = index;
      }
    });
    setActive(nearest);
  }, []);

  useEffect(() => {
    const node = track.current;
    if (!node) return;

    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        measure();
      });
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

  /* Scroll by the measured gap between the two elements: no index arithmetic,
     so it is correct in both writing directions. */
  const scrollTo = (container: HTMLElement | null, index: number, align: "start" | "center") => {
    const item = container?.children[index] as HTMLElement | undefined;
    if (!container || !item) return;
    const box = container.getBoundingClientRect();
    const rect = item.getBoundingClientRect();
    const delta =
      align === "start"
        ? rect.left - box.left
        : rect.left + rect.width / 2 - (box.left + box.width / 2);
    container.scrollBy({ left: delta, behavior: prefersReducedMotion() ? "instant" : "smooth" });
  };

  const goTo = (index: number) => scrollTo(track.current, clamp(index, 0, count - 1), "start");

  /* Keep the active thumbnail in the strip as the stage is swiped. */
  useEffect(() => {
    scrollTo(strip.current, active, "center");
  }, [active]);

  const stageTone = hasPhotos ? "bg-white" : "bg-ice";

  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <ul
          ref={track}
          tabIndex={count > 1 ? 0 : -1}
          data-lenis-prevent-horizontal
          aria-label={d.productPage.galleryHeading}
          className={cn(
            /* w-full + min-w-0: the track must take the column's width, never
               the sum of its slides, or the grid track grows to fit them. */
            "slider-track no-scrollbar flex w-full min-w-0 snap-x snap-mandatory overflow-x-auto overflow-y-hidden overscroll-x-contain",
            "rounded-2xl border border-hairline",
            stageTone,
          )}
        >
          {Array.from({ length: count }, (_, index) => (
            <li
              key={index}
              className={cn("relative w-full shrink-0 snap-start", hasPhotos && "aspect-square")}
            >
              {/* The photograph is the zoom control: clicking it opens the
                  magnified view. A drag never reaches this click — the scroll
                  gesture swallows it in the capture phase. */}
              <button
                type="button"
                onClick={() => setZoomIndex(index)}
                tabIndex={index === active ? 0 : -1}
                aria-label={`${d.productPage.zoomLabel} — ${altFor(index)}`}
                className="block h-full w-full cursor-zoom-in"
              >
                {index === 0 ? (
                  <ProductMorph slug={product.slug} className="h-full w-full">
                    {view(index, altFor(index), "(min-width: 1024px) 50vw, 100vw", { priority: true })}
                  </ProductMorph>
                ) : (
                  view(index, altFor(index), "(min-width: 1024px) 50vw, 100vw")
                )}
              </button>
            </li>
          ))}
        </ul>

        {count > 1 ? (
          <>
            {/* Navy on the white studio ground: the arrows have to read against
                a cut-out shot, so they are solid rather than a light scrim. */}
            {([-1, 1] as const).map((direction) => (
              <button
                key={direction}
                type="button"
                onClick={() => goTo(active + direction)}
                disabled={direction === -1 ? active === 0 : active === count - 1}
                aria-label={direction === -1 ? d.a11y.previousImage : d.a11y.nextImage}
                className={cn(
                  "group absolute top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full",
                  "bg-navy-900/85 text-white shadow-lg ring-1 ring-white/20 backdrop-blur-sm",
                  "transition-[background-color,opacity] duration-200",
                  "enabled:hover:bg-glacier-400 enabled:hover:text-navy-900",
                  "disabled:cursor-default disabled:opacity-30",
                  direction === -1 ? "start-3" : "end-3",
                )}
              >
                <Icon
                  name={direction === -1 ? "arrowLeft" : "arrowRight"}
                  size={20}
                  className={cn(
                    "transition-transform duration-200 rtl:-scale-x-100",
                    direction === -1
                      ? "group-enabled:group-hover:-translate-x-0.5"
                      : "group-enabled:group-hover:translate-x-0.5",
                  )}
                />
              </button>
            ))}

            <p
              aria-hidden="true"
              className="ltr-inline tabular pointer-events-none absolute bottom-4 start-4 rounded-full bg-navy-950/70 px-3 py-1 font-display text-xs font-bold text-white backdrop-blur-sm"
            >
              {active + 1} / {count}
            </p>
          </>
        ) : null}

        {/* The zoom happens here, over the stage — not in a dialog. A buyer
            clicked this photograph in this spot, so the closer look belongs in
            the same spot, with the page still around it. */}
        {zoomIndex !== null ? (
          <div
            className={cn(
              "absolute inset-0 z-10 overflow-hidden rounded-2xl border border-glacier-400/60",
              stageTone,
            )}
          >
            <ZoomStage
              className="h-full w-full"
              hint={d.productPage.zoomHint}
              labels={{
                zoomIn: d.a11y.zoomIn,
                zoomOut: d.a11y.zoomOut,
                reset: d.a11y.resetZoom,
                close: d.a11y.closeZoom,
              }}
              onClose={() => setZoomIndex(null)}
            >
              {view(zoomIndex, altFor(zoomIndex), "(min-width: 1024px) 50vw, 100vw", { bleed: true })}
            </ZoomStage>
          </div>
        ) : null}
      </div>

      {count > 1 ? (
        <ul
          ref={strip}
          data-cursor="drag"
          data-lenis-prevent-horizontal
          className="slider-track no-scrollbar -mx-1 flex w-full min-w-0 gap-3 overflow-x-auto overflow-y-hidden overscroll-x-contain px-1 py-1"
        >
          {Array.from({ length: count }, (_, index) => (
            <li key={index} className="shrink-0">
              <button
                type="button"
                onClick={() => goTo(index)}
                aria-current={index === active}
                aria-label={t(d.a11y.viewImage, { n: index + 1, total: count })}
                className={cn(
                  "relative block h-20 w-20 overflow-hidden rounded-lg border-2 transition-colors",
                  stageTone,
                  index === active
                    ? "border-glacier-400"
                    : "border-hairline hover:border-hairline-strong",
                )}
              >
                {view(index, "", "80px")}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

/**
 * The magnified view, laid over the gallery stage it was opened from.
 *
 * It opens already zoomed in — a click on the photograph asked for a closer
 * look, so arriving at 1× would answer with nothing. From there the wheel is
 * the zoom control: it is captured here (a non-passive listener, so the page
 * behind never scrolls instead) and applied around the pointer, so the detail
 * under the cursor is the detail that grows. Dragging pans, clamped to the
 * frame so the cabinet can never be thrown off-screen.
 *
 * The controls float over the photograph rather than sitting under it: the
 * frame is the stage's size, and a control strip below would push the page
 * around every time the zoom opened.
 */
function ZoomStage({
  children,
  className,
  hint,
  labels,
  onClose,
}: {
  children: React.ReactNode;
  className?: string;
  hint: string;
  labels: { zoomIn: string; zoomOut: string; reset: string; close: string };
  onClose: () => void;
}) {
  const frame = useRef<HTMLDivElement>(null);
  const [tform, setTform] = useState({ scale: 2, x: 0, y: 0 });
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

      <button type="button" onClick={onClose} aria-label={labels.close} className={cn(chip, "absolute end-3 top-3")}>
        <Icon name="close" size={20} />
      </button>

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

      <p className="ltr-inline pointer-events-none absolute inset-x-3 top-3 me-14 truncate rounded-full bg-navy-950/70 px-3 py-1.5 text-2xs text-white/80 backdrop-blur-sm">
        {hint}
      </p>
    </div>
  );
}
