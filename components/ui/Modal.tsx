"use client";

import { useCallback, useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { cn } from "@/lib/utils";
import { Icon } from "./Icon";
import { prefersReducedMotion } from "@/lib/motion";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  closeLabel: string;
  size?: "md" | "lg" | "xl";
  children: React.ReactNode;
}

const sizes = {
  md: "max-w-lg",
  lg: "max-w-3xl",
  xl: "max-w-5xl",
};

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Dialog with depth: the panel arrives from behind the viewport plane on a
 * perspective stage, so opening reads as a physical layer rather than a fade.
 * Exit runs at ~65% of enter, per the motion tokens.
 */
export function Modal({
  open,
  onClose,
  title,
  description,
  closeLabel,
  size = "lg",
  children,
}: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const descId = useId();

  const close = useCallback(() => {
    const reduce = prefersReducedMotion();
    const panel = panelRef.current;
    const overlay = overlayRef.current;

    if (reduce || !panel || !overlay) {
      onClose();
      return;
    }

    gsap
      .timeline({ onComplete: onClose })
      .to(panel, {
        opacity: 0,
        scale: 0.96,
        y: 12,
        rotateX: 4,
        duration: 0.26,
        ease: "power2.in",
      })
      .to(overlay, { opacity: 0, duration: 0.22 }, "<");
  }, [onClose]);

  /* Mount animation, scroll lock and focus handling. */
  useEffect(() => {
    if (!open) return;

    previouslyFocused.current = document.activeElement as HTMLElement | null;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    const { overflow, paddingRight } = document.body.style;
    document.body.style.overflow = "hidden";
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;

    const panel = panelRef.current;
    const overlay = overlayRef.current;

    if (!prefersReducedMotion() && panel && overlay) {
      gsap.set(overlay, { opacity: 0 });
      gsap.set(panel, { opacity: 0, scale: 0.94, y: 28, rotateX: -8 });
      gsap
        .timeline()
        .to(overlay, { opacity: 1, duration: 0.28, ease: "power2.out" })
        .to(
          panel,
          {
            opacity: 1,
            scale: 1,
            y: 0,
            rotateX: 0,
            duration: 0.42,
            ease: "power3.out",
          },
          "<0.04",
        );
    }

    /* Focus the panel itself, not the first control, so the title is read. */
    panel?.focus();

    return () => {
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
      previouslyFocused.current?.focus?.();
    };
  }, [open]);

  /* Escape to dismiss, Tab cycles inside the dialog. */
  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }
      if (event.key !== "Tab") return;

      const panel = panelRef.current;
      if (!panel) return;
      const focusables = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null,
      );
      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && (active === first || active === panel)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, close]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      ref={overlayRef}
      className="stage-3d fixed inset-0 flex items-end justify-center overflow-y-auto bg-navy-950/70 p-4 backdrop-blur-md sm:items-center sm:p-6"
      style={{ zIndex: "var(--z-modal)" }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descId : undefined}
        tabIndex={-1}
        className={cn(
          /* Never taller than the viewport: the title stays put and only the
             body scrolls, so the page behind is never scrolled to reach a
             control. */
          "preserve-3d relative flex max-h-[calc(100dvh-2rem)] w-full flex-col rounded-2xl bg-surface shadow-xl outline-none sm:max-h-[calc(100dvh-3rem)]",
          sizes[size],
        )}
      >
        <header className="flex shrink-0 items-start justify-between gap-6 border-b border-hairline p-6">
          <div className="min-w-0">
            <h2 id={titleId} className="text-xl">
              {title}
            </h2>
            {description ? (
              <p id={descId} className="mt-2 text-sm text-ink-muted">
                {description}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={close}
            aria-label={closeLabel}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-hairline text-ink-muted transition-colors hover:border-navy-300 hover:text-ink-strong"
          >
            <Icon name="close" size={20} />
          </button>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto p-6">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
