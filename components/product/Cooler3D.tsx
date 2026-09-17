"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";
import { prefersReducedMotion } from "@/lib/motion";
import type { Product } from "@/lib/data/types";

interface Cooler3DProps {
  product: Product;
  labels: {
    dragToRotate: string;
    rotateLeft: string;
    rotateRight: string;
    reset: string;
  };
  className?: string;
}

const MAX_TILT = 24;

/**
 * A real 3D cabinet: six CSS planes on a perspective stage, so the unit can be
 * turned to check footprint, canopy and door configuration. Pointer drag and
 * arrow keys drive the same state, which keeps the interaction usable without
 * a mouse (WCAG 2.2 dragging-alternative).
 */
export function Cooler3D({ product, labels, className }: Cooler3DProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const angles = useRef({ x: -12, y: -28 });
  const dragging = useRef(false);
  const last = useRef({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const { ratio, doors, shelves, canopy } = product.art;

  /* Scale the real cabinet ratio into a stage that fits any viewport. */
  const scale = 240 / Math.max(ratio.height, ratio.width);
  const w = ratio.width * scale;
  const h = ratio.height * scale;
  const d = ratio.depth * scale;

  const apply = useCallback((animate: boolean) => {
    const box = boxRef.current;
    if (!box) return;
    const vars = {
      rotateX: angles.current.x,
      rotateY: angles.current.y,
      transformPerspective: 1400,
    };
    if (animate && !prefersReducedMotion()) {
      gsap.to(box, { ...vars, duration: 0.5, ease: "power3.out" });
    } else {
      gsap.set(box, vars);
    }
  }, []);

  useEffect(() => {
    apply(false);
  }, [apply]);

  const rotateBy = useCallback(
    (dy: number, dx: number, animate = true) => {
      angles.current.y += dy;
      angles.current.x = Math.max(-MAX_TILT, Math.min(MAX_TILT, angles.current.x + dx));
      apply(animate);
    },
    [apply],
  );

  function onPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    dragging.current = true;
    setIsDragging(true);
    last.current = { x: event.clientX, y: event.clientY };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!dragging.current) return;
    const dx = event.clientX - last.current.x;
    const dy = event.clientY - last.current.y;
    last.current = { x: event.clientX, y: event.clientY };
    rotateBy(dx * 0.45, -dy * 0.3, false);
  }

  function endDrag(event: React.PointerEvent<HTMLDivElement>) {
    if (!dragging.current) return;
    dragging.current = false;
    setIsDragging(false);
    event.currentTarget.releasePointerCapture?.(event.pointerId);
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    const step = event.shiftKey ? 30 : 12;
    switch (event.key) {
      case "ArrowLeft":
        event.preventDefault();
        rotateBy(-step, 0);
        break;
      case "ArrowRight":
        event.preventDefault();
        rotateBy(step, 0);
        break;
      case "ArrowUp":
        event.preventDefault();
        rotateBy(0, step / 2);
        break;
      case "ArrowDown":
        event.preventDefault();
        rotateBy(0, -step / 2);
        break;
      case "Home":
        event.preventDefault();
        reset();
        break;
    }
  }

  const reset = useCallback(() => {
    angles.current = { x: -12, y: -28 };
    apply(true);
  }, [apply]);

  /**
   * Cube construction: every face is centred on the box, then rotated into
   * place and pushed out by half the box dimension it faces along. Side faces
   * translate by half the WIDTH, top and bottom by half the HEIGHT — using the
   * depth here is the classic mistake that leaves the panels floating apart.
   */
  const faceBase = "absolute rounded-[6px] [backface-visibility:hidden] overflow-hidden";

  const faces = {
    front: { width: w, height: h, left: 0, top: 0, transform: `translateZ(${d / 2}px)` },
    back: { width: w, height: h, left: 0, top: 0, transform: `rotateY(180deg) translateZ(${d / 2}px)` },
    right: { width: d, height: h, left: (w - d) / 2, top: 0, transform: `rotateY(90deg) translateZ(${w / 2}px)` },
    left: { width: d, height: h, left: (w - d) / 2, top: 0, transform: `rotateY(-90deg) translateZ(${w / 2}px)` },
    top: { width: w, height: d, left: 0, top: (h - d) / 2, transform: `rotateX(90deg) translateZ(${h / 2}px)` },
    bottom: { width: w, height: d, left: 0, top: (h - d) / 2, transform: `rotateX(-90deg) translateZ(${h / 2}px)` },
  } as const;

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div
        ref={stageRef}
        role="application"
        aria-label={labels.dragToRotate}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        className={cn(
          "stage-3d relative grid h-[380px] w-full touch-none select-none place-items-center",
          "rounded-xl bg-[radial-gradient(60%_60%_at_50%_35%,#f2f9fd,transparent_70%)]",
          isDragging ? "cursor-grabbing" : "cursor-grab",
        )}
      >
        {/* Contact shadow stays on the floor plane, not on the box. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-16 h-8 w-[55%] rounded-[50%] bg-navy-700/20 blur-xl"
        />

        <div
          ref={boxRef}
          className="preserve-3d relative"
          style={{ width: w, height: h }}
        >
          {/* Front: glazed door face */}
          <div
            className={cn(faceBase, "bg-gradient-to-br from-glacier-200/90 to-glacier-400/60")}
            style={faces.front}
          >
            {canopy ? (
              <div className="h-[10%] w-full bg-gradient-to-r from-glacier-400 to-glacier-500" />
            ) : null}
            <div className="flex h-full gap-[2px] p-[3px]">
              {Array.from({ length: Math.max(doors, 1) }).map((_, doorIndex) => (
                <div
                  key={doorIndex}
                  className="relative flex-1 rounded-[3px] border border-white/60 bg-white/25"
                >
                  {Array.from({
                    length: Math.max(1, Math.round(shelves / Math.max(doors, 1))),
                  }).map((__, shelfIndex, arr) => (
                    <div
                      key={shelfIndex}
                      className="absolute inset-x-1 h-px bg-navy-700/30"
                      style={{ top: `${((shelfIndex + 1) / (arr.length + 1)) * 100}%` }}
                    />
                  ))}
                  <div className="absolute inset-y-2 start-[2px] w-[2px] rounded bg-white/80" />
                  <div className="absolute inset-y-2 end-[2px] w-[2px] rounded bg-white/80" />
                  <div className="absolute end-2 top-1/2 h-10 w-[3px] -translate-y-1/2 rounded bg-ice" />
                </div>
              ))}
            </div>
          </div>

          {/* Back: condenser grille side */}
          <div className={cn(faceBase, "bg-navy-900")} style={faces.back}>
            <div className="absolute inset-x-4 bottom-4 h-1/3 rounded border border-white/10 bg-white/5" />
          </div>

          {/* Right and left cabinet walls */}
          <div
            className={cn(faceBase, "bg-gradient-to-b from-navy-600 to-navy-900")}
            style={faces.right}
          />
          <div
            className={cn(faceBase, "bg-gradient-to-b from-navy-700 to-navy-950")}
            style={faces.left}
          />

          {/* Top and bottom */}
          <div className={cn(faceBase, "bg-navy-600")} style={faces.top} />
          <div className={cn(faceBase, "bg-navy-950")} style={faces.bottom} />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ink-muted">{labels.dragToRotate}</p>
        <div className="flex items-center gap-2">
          <ControlButton label={labels.rotateLeft} onClick={() => rotateBy(-30, 0)} icon="arrowLeft" />
          <ControlButton label={labels.reset} onClick={reset} icon="rotate" />
          <ControlButton label={labels.rotateRight} onClick={() => rotateBy(30, 0)} icon="arrowRight" />
        </div>
      </div>
    </div>
  );
}

function ControlButton({
  label,
  onClick,
  icon,
}: {
  label: string;
  onClick: () => void;
  icon: "arrowLeft" | "arrowRight" | "rotate";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="grid h-11 w-11 place-items-center rounded-lg border border-hairline bg-white text-ink-muted transition-colors hover:border-glacier-400 hover:text-ink-strong"
    >
      <Icon name={icon} size={20} />
    </button>
  );
}
