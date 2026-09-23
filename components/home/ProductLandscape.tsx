"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { getLenis } from "@/components/motion/SmoothScroll";
import { ProductMorph } from "@/components/product/ProductMorph";
import { Icon } from "@/components/ui/Icon";
import { gsap, isRtl, motion, prefersReducedMotion, registerGsap, ScrollTrigger } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface LandscapeProduct {
  slug: string;
  code: string;
  name: string;
  category: string;
  image?: string;
  href: string;
  featured: boolean;
}

interface LayerConfig {
  /** Base autoplay speed in px/second. */
  speed: number;
  direction: 1 | -1;
  /** Fraction of a drag/scroll impulse this layer receives — the parallax depth. */
  depth: number;
  /** Overall vertical bias for the row, so the two streams don't sit on one line. */
  bias: string;
}

/* Row 1 drifts left, row 2 drifts right, at different speeds and heights —
 * two independent currents, not a synchronised grid. */
const LAYERS: LayerConfig[] = [
  { speed: 40, direction: -1, depth: 0.85, bias: "-translate-y-[2%]" },
  { speed: 28, direction: 1, depth: 1, bias: "translate-y-[2%]" },
];

const REPEAT = 3;
/* How many products per row are loaded up front rather than lazily — roughly
   what fits on a wide screen before the row has drifted. */
const EAGER_PER_ROW = 4;
const CLICK_DRAG_THRESHOLD = 6;
const PARALLAX_PX = 6;
const PARALLAX_PX_Y = 4;
/* Speed multiplier eases toward 0/1 instead of snapping, so a hover decelerates
 * the row rather than freezing it. */
const EASE_RATE = 0.12;

/* A little editorial drift — kept small so the row stays compact, not tall. */
const OFFSET_Y = ["-0.5rem", "0.5rem", "0px", "-0.75rem", "0.25rem"];

/** The background-free version of a shot (see scripts/cutout-products.mjs). */
function cutoutSrc(image: string) {
  return image.replace("/images/products/", "/images/products/cutout/");
}

/**
 * The product range as one continuous, immersive stream rather than a card
 * grid: two rows of product compositions — a circle paired with its name —
 * drifting in opposite directions at different speeds and heights. Autoplay
 * eases with scroll velocity, and the whole canvas can be dragged (mouse or
 * touch) with momentum that eases back into drift.
 *
 * Hovering or focusing a product decelerates only *its own row* — the other
 * keeps moving — dims its neighbours, scales the product toward the viewer,
 * and reveals an Explore label over it.
 *
 * `prefers-reduced-motion` and any pointer without hover fall back to plain,
 * independently swipeable rows — no ticker, no synthetic drag, no parallax.
 */
export function ProductLandscape({
  rows,
  labels,
}: {
  rows: { key: string; products: LandscapeProduct[] }[];
  labels: { region: string; viewProduct: string };
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRefs = useRef<Array<HTMLUListElement | null>>([]);
  const [reducedMotion, setReducedMotion] = useState(true);

  useEffect(() => {
    const update = () => setReducedMotion(prefersReducedMotion());
    update();
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useGSAP(
    () => {
      if (reducedMotion) return;
      registerGsap();
      const root = rootRef.current;
      const tracks = trackRefs.current;
      if (!root || tracks.every((t) => !t)) return;

      const rtl = isRtl();
      const rtlSign = rtl ? -1 : 1;
      const mobile = window.matchMedia("(max-width: 639px)").matches;
      const speedScale = mobile ? 0.6 : 1;

      const widths = tracks.map((track) => (track ? track.scrollWidth / REPEAT : 0));
      const autoplay = tracks.map(() => 0);
      const dragOffset = tracks.map(() => 0);
      const dragVelocity = tracks.map(() => 0);
      /* Independent per row: hovering row 1 never stops row 2. */
      const pausedRows = tracks.map(() => false);
      /* Eased 0→1 multiplier per row, so pausing/resuming decelerates rather than snaps. */
      const rowSpeed = tracks.map(() => 1);

      /* Entrance: the wall is already populated by the time the section is
         read. Names and products come up together, and the stagger is capped
         in total time rather than per item — with ~46 products a per-item
         step would take seconds to finish. */
      const names = root.querySelectorAll<HTMLElement>("[data-landscape-name]:not([data-duplicate])");
      const items = root.querySelectorAll<HTMLElement>("[data-landscape-item]:not([data-duplicate])");
      gsap.set(names, { opacity: 0, y: 18 });
      gsap.set(items, { opacity: 0, scale: 0.94, y: 14 });

      let playing = false;
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root, start: "top 95%", toggleActions: "play none none none" },
        onComplete: () => {
          playing = true;
        },
      });
      tl.to(names, { opacity: 1, y: 0, duration: motion.duration.fast, ease: motion.ease.smooth, stagger: 0.04 }).to(
        items,
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: motion.duration.normal,
          ease: motion.ease.smooth,
          stagger: { amount: 0.4, from: "random" },
        },
        "<",
      );

      let smoothVelocity = 0;

      const ticker = (_time: number, deltaMs: number) => {
        if (!playing) return;
        const dt = Math.min(deltaMs, 48) / 1000;
        const lenis = getLenis();
        const rawVelocity = lenis ? lenis.velocity : 0;
        smoothVelocity += (rawVelocity - smoothVelocity) * 0.06;
        const scrollBoost = gsap.utils.clamp(-2.2, 2.2, smoothVelocity * 0.045);

        tracks.forEach((track, i) => {
          if (!track) return;
          const cfg = LAYERS[i];
          rowSpeed[i] += ((pausedRows[i] ? 0 : 1) - rowSpeed[i]) * EASE_RATE;
          const speed = cfg.speed * speedScale * rowSpeed[i] * (1 + scrollBoost * cfg.depth);
          autoplay[i] -= speed * cfg.direction * rtlSign * dt;

          if (Math.abs(dragVelocity[i]) > 0.02) {
            dragOffset[i] += dragVelocity[i];
            dragVelocity[i] *= 0.94;
          } else {
            dragVelocity[i] = 0;
          }

          const total = autoplay[i] + dragOffset[i];
          const width = widths[i] || 1;
          gsap.set(track, { x: gsap.utils.wrap(-width, 0, total) });
        });
      };
      gsap.ticker.add(ticker);

      /* Drag the whole canvas: one gesture moves every row, scaled by depth. */
      const surface = root.querySelector<HTMLElement>("[data-landscape-surface]");
      let pointerId: number | null = null;
      let lastX = 0;
      let lastTime = 0;
      let moved = 0;

      const onDown = (event: PointerEvent) => {
        if (event.pointerType === "mouse" && event.button !== 0) return;
        pointerId = event.pointerId;
        lastX = event.clientX;
        lastTime = performance.now();
        moved = 0;
        dragVelocity.fill(0);
        surface?.setPointerCapture(event.pointerId);
        surface?.classList.add("is-grabbing");
      };

      const onMove = (event: PointerEvent) => {
        if (pointerId !== event.pointerId) return;
        const dx = event.clientX - lastX;
        const now = performance.now();
        const dt = Math.max(now - lastTime, 1);
        moved += Math.abs(dx);
        lastX = event.clientX;
        lastTime = now;

        tracks.forEach((track, i) => {
          if (!track) return;
          const cfg = LAYERS[i];
          dragOffset[i] += dx * cfg.depth;
          dragVelocity[i] = (dx / dt) * 16 * cfg.depth;
        });
      };

      const onUp = (event: PointerEvent) => {
        if (pointerId !== event.pointerId) return;
        pointerId = null;
        surface?.releasePointerCapture(event.pointerId);
        surface?.classList.remove("is-grabbing");
      };

      const onClickCapture = (event: MouseEvent) => {
        if (moved > CLICK_DRAG_THRESHOLD) {
          event.preventDefault();
          event.stopPropagation();
        }
      };

      surface?.addEventListener("pointerdown", onDown);
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
      window.addEventListener("pointercancel", onUp);
      surface?.addEventListener("click", onClickCapture, true);

      /* Hover/focus: the active product becomes the focus, its neighbours recede,
         and only that product's own row decelerates — the other keeps moving. */
      const allItems = Array.from(root.querySelectorAll<HTMLElement>("[data-landscape-item]"));
      const rowOf = (el: Element) => tracks.findIndex((t) => t?.contains(el));

      const focusItem = (item: HTMLElement) => {
        allItems.forEach((el) => el.classList.toggle("is-dimmed", el !== item));
        const rowIndex = rowOf(item);
        if (rowIndex !== -1) pausedRows[rowIndex] = true;
      };
      const unfocusItem = (relatedItem: Element | null) => {
        if (relatedItem) return;
        allItems.forEach((el) => el.classList.remove("is-dimmed"));
        pausedRows.fill(false);
      };

      const onOver = (event: PointerEvent) => {
        const target = (event.target as Element | null)?.closest<HTMLElement>("[data-landscape-item]");
        if (!target) return;
        focusItem(target);
      };
      const onOut = (event: PointerEvent) => {
        unfocusItem((event.relatedTarget as Element | null)?.closest("[data-landscape-item]") ?? null);
      };
      root.addEventListener("pointerover", onOver);
      root.addEventListener("pointerout", onOut);

      /* Subtle cursor parallax: the hovered photo drifts a few px toward the pointer. */
      const onSurfaceMove = (event: PointerEvent) => {
        const target = (event.target as Element | null)?.closest<HTMLElement>("[data-landscape-item]");
        const visual = target?.querySelector<HTMLElement>("[data-landscape-visual]");
        if (!target || !visual) return;
        const rect = target.getBoundingClientRect();
        const nx = (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
        const ny = (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
        gsap.to(visual, {
          x: gsap.utils.clamp(-PARALLAX_PX, PARALLAX_PX, nx * PARALLAX_PX),
          y: gsap.utils.clamp(-PARALLAX_PX_Y, PARALLAX_PX_Y, ny * PARALLAX_PX_Y),
          duration: 0.4,
          ease: motion.ease.smooth,
          overwrite: true,
        });
      };
      const onSurfaceLeave = (event: PointerEvent) => {
        const related = (event.relatedTarget as Element | null)?.closest("[data-landscape-item]");
        if (related) return;
        gsap.to(root.querySelectorAll("[data-landscape-visual]"), {
          x: 0,
          y: 0,
          duration: 0.5,
          ease: motion.ease.smooth,
          overwrite: true,
        });
      };
      root.addEventListener("pointermove", onSurfaceMove);
      root.addEventListener("pointerout", onSurfaceLeave);

      /* Keyboard focus: ease the item's row so the focused (non-duplicate) model is centred. */
      const onFocusIn = (event: FocusEvent) => {
        const item = (event.target as Element | null)?.closest<HTMLElement>("[data-landscape-item]");
        if (!item || item.dataset.duplicate) return;
        const rowIndex = rowOf(item);
        const track = tracks[rowIndex];
        const viewport = track?.parentElement;
        if (!track || !viewport) return;

        const viewportRect = viewport.getBoundingClientRect();
        const itemRect = item.getBoundingClientRect();
        const delta = viewportRect.left + viewportRect.width / 2 - (itemRect.left + itemRect.width / 2);
        gsap.to(dragOffset, {
          [rowIndex]: dragOffset[rowIndex] + delta,
          duration: 0.6,
          ease: motion.ease.smooth,
          overwrite: true,
        });
        focusItem(item);
      };
      const onFocusOut = (event: FocusEvent) => {
        unfocusItem((event.relatedTarget as Element | null)?.closest("[data-landscape-item]") ?? null);
      };
      root.addEventListener("focusin", onFocusIn);
      root.addEventListener("focusout", onFocusOut);

      document.fonts?.ready.then(() => ScrollTrigger.refresh());

      return () => {
        gsap.ticker.remove(ticker);
        tl.kill();
        surface?.removeEventListener("pointerdown", onDown);
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
        window.removeEventListener("pointercancel", onUp);
        surface?.removeEventListener("click", onClickCapture, true);
        root.removeEventListener("pointerover", onOver);
        root.removeEventListener("pointerout", onOut);
        root.removeEventListener("pointermove", onSurfaceMove);
        root.removeEventListener("pointerout", onSurfaceLeave);
        root.removeEventListener("focusin", onFocusIn);
        root.removeEventListener("focusout", onFocusOut);
      };
    },
    { scope: rootRef, dependencies: [reducedMotion, rows] },
  );

  if (reducedMotion) {
    return (
      <div ref={rootRef} className="flex flex-col gap-4 py-4">
        {rows.map((row, rowIndex) => (
          <ul
            key={row.key}
            aria-label={`${labels.region} ${rowIndex + 1}`}
            data-lenis-prevent-horizontal
            className="no-scrollbar flex snap-x snap-mandatory items-center gap-5 overflow-x-auto overscroll-x-contain px-[var(--shell-gutter)] pb-2"
          >
            {row.products.map((item, i) => (
              <li key={item.slug} className="shrink-0 snap-start">
                <ProductNode item={item} labels={labels} eager={i < EAGER_PER_ROW} />
              </li>
            ))}
          </ul>
        ))}
      </div>
    );
  }

  return (
    <div ref={rootRef} className="landscape relative isolate overflow-hidden">
      <div
        data-landscape-surface
        role="group"
        aria-label={labels.region}
        className="relative flex cursor-grab touch-pan-y select-none flex-col gap-1 py-4 active:cursor-grabbing sm:gap-2 sm:py-5 lg:py-6"
      >
        {rows.map((row, rowIndex) => {
          const cfg = LAYERS[rowIndex];
          return (
            <div
              key={row.key}
              className="overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_6%,#000_94%,transparent)]"
            >
              <ul
                ref={(el) => {
                  trackRefs.current[rowIndex] = el;
                }}
                /* py- gives the hover scale room: the wrapper clips overflow, so
                   without it a scaled-up circle gets sliced top and bottom. */
                className={cn(
                  "flex w-max items-center gap-10 py-6 will-change-transform sm:gap-12 sm:py-8 lg:gap-16",
                  cfg?.bias,
                )}
              >
                {Array.from({ length: REPEAT }).flatMap((_, rep) =>
                  row.products.map((item, i) => (
                    <li
                      key={`${rep}-${item.slug}`}
                      data-landscape-item
                      data-duplicate={rep === 0 ? undefined : "true"}
                      aria-hidden={rep === 0 ? undefined : "true"}
                      className="landscape-item shrink-0"
                      style={{ marginTop: OFFSET_Y[i % OFFSET_Y.length] }}
                    >
                      <ProductNode
                        item={item}
                        labels={labels}
                        tabIndex={rep === 0 ? undefined : -1}
                        /* The products a visitor actually lands on: fetched with
                           the page so the circles are never still empty when the
                           row reveals. */
                        eager={rep === 0 && i < EAGER_PER_ROW}
                      />
                    </li>
                  )),
                )}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ProductNode({
  item,
  labels,
  tabIndex,
  eager,
}: {
  item: LandscapeProduct;
  labels: { viewProduct: string };
  tabIndex?: number;
  eager?: boolean;
}) {
  return (
    <Link
      href={item.href}
      tabIndex={tabIndex}
      draggable={false}
      data-cursor={tabIndex === -1 ? undefined : "view"}
      aria-label={item.name}
      className="group relative flex items-center gap-4 no-underline outline-none sm:gap-5"
    >
      {/* The product, cut out of its studio backdrop and set on a dark glass
          circle — see scripts/cutout-products.mjs for the alpha pass. */}
      <div data-landscape-visual className="relative z-10 shrink-0 will-change-transform">
        <ProductMorph slug={item.slug} enabled={tabIndex !== -1}>
          <span className="relative isolate block h-32 w-32 overflow-hidden rounded-full bg-[radial-gradient(circle_at_50%_32%,rgb(255_255_255/0.14),rgb(255_255_255/0.03)_70%)] shadow-[0_18px_50px_-20px_rgb(0_0_0/0.65)] ring-1 ring-white/10 backdrop-blur-sm transition-[transform,background-color,box-shadow] duration-500 ease-[var(--ease-smooth)] will-change-transform group-hover:scale-[1.08] group-hover:ring-white/25 group-focus-visible:scale-[1.08] sm:h-40 sm:w-40 lg:h-44 lg:w-44">
            {item.image ? (
              <Image
                src={cutoutSrc(item.image)}
                alt=""
                fill
                sizes="(min-width: 1024px) 12vw, 30vw"
                loading={eager ? "eager" : undefined}
                className="object-contain p-[16%] drop-shadow-[0_10px_20px_rgb(0_0_0/0.45)]"
              />
            ) : (
              <span className="flex h-full w-full items-center justify-center">
                <Icon name="box" size={32} className="text-white/40" />
              </span>
            )}

            {item.featured ? (
              <span className="absolute bottom-2 start-2 z-10 grid h-6 w-6 place-items-center rounded-full bg-navy-950/85 text-glacier-200">
                <Icon name="star" size={16} className="h-3 w-3" />
              </span>
            ) : null}

            {/* Explore — revealed over the product, so it never shifts the row. */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center rounded-full bg-navy-950/45 opacity-0 backdrop-blur-[2px] transition-opacity duration-400 ease-[var(--ease-smooth)] group-hover:opacity-100 group-focus-visible:opacity-100"
            >
              <span className="inline-flex translate-y-1 items-center gap-1.5 whitespace-nowrap rounded-full border border-white/20 bg-white/15 px-3 py-1 text-2xs font-bold uppercase tracking-[0.14em] text-white transition-transform duration-400 ease-[var(--ease-smooth)] group-hover:translate-y-0 group-focus-visible:translate-y-0">
                {labels.viewProduct}
                <Icon name="arrowUpRight" size={16} className="h-3 w-3 rtl:-scale-x-100" />
              </span>
            </span>
          </span>
        </ProductMorph>
      </div>

      {/* The name sits beside its product, not above it — the two read as one pair. */}
      <span
        data-landscape-name
        data-duplicate={tabIndex === -1 ? "true" : undefined}
        aria-hidden="true"
        className="pointer-events-none select-none whitespace-nowrap font-display text-[clamp(1.125rem,1.9vw,1.75rem)] leading-none text-white/[0.4] transition-colors duration-500 ease-[var(--ease-smooth)] group-hover:text-white/85"
      >
        {item.category}
      </span>
    </Link>
  );
}
