"use client";

import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
}

/**
 * ARIA tabs with roving focus: arrow keys move between tabs, Home/End jump to
 * the ends, and only the active tab is in the tab order. A URL hash matching a
 * tab id (e.g. /resources#manuals) opens that tab, on load and from in-page links.
 */
export function Tabs({ items, className }: { items: TabItem[]; className?: string }) {
  const [active, setActive] = useState(0);
  const baseId = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const rootRef = useRef<HTMLDivElement>(null);
  const ids = items.map((item) => item.id).join(",");

  useEffect(() => {
    const tabIds = ids.split(",");

    function openFromHash(hash: string) {
      const index = tabIds.indexOf(decodeURIComponent(hash.replace(/^#/, "")));
      if (index === -1) return false;
      setActive(index);
      // Wait for the panel to unhide before scrolling to it.
      requestAnimationFrame(() => rootRef.current?.scrollIntoView({ block: "start" }));
      return true;
    }

    openFromHash(window.location.hash);

    const onHashChange = () => openFromHash(window.location.hash);

    // Next's <Link> changes the hash through pushState, which fires no
    // hashchange, so same-page links (the footer) are caught on click.
    function onClick(event: MouseEvent) {
      const anchor = (event.target as Element | null)?.closest?.("a[href*='#']");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      if (anchor.pathname !== window.location.pathname) return;
      if (!openFromHash(anchor.hash)) return;
      event.preventDefault();
      history.replaceState(history.state, "", anchor.hash);
    }

    window.addEventListener("hashchange", onHashChange);
    document.addEventListener("click", onClick, true);
    return () => {
      window.removeEventListener("hashchange", onHashChange);
      document.removeEventListener("click", onClick, true);
    };
  }, [ids]);

  function onKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    const rtl = document.documentElement.dir === "rtl";
    const forward = rtl ? "ArrowLeft" : "ArrowRight";
    const back = rtl ? "ArrowRight" : "ArrowLeft";

    let next: number | null = null;
    if (event.key === forward) next = (active + 1) % items.length;
    else if (event.key === back) next = (active - 1 + items.length) % items.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = items.length - 1;

    if (next !== null) {
      event.preventDefault();
      setActive(next);
      refs.current[next]?.focus();
    }
  }

  return (
    <div ref={rootRef} className={cn("scroll-mt-32", className)}>
      {/* Capsules, the same shape the rest of the site uses for chips and
          filters: frosted when idle, a lit cyan pill when selected. */}
      <div
        role="tablist"
        onKeyDown={onKeyDown}
        className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 py-1"
      >
        {items.map((item, index) => {
          const selected = index === active;
          return (
            <button
              key={item.id}
              ref={(node) => {
                refs.current[index] = node;
              }}
              role="tab"
              type="button"
              id={`${baseId}-tab-${item.id}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${item.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(index)}
              className={cn(
                "min-h-11 shrink-0 whitespace-nowrap rounded-full px-5 text-sm font-semibold",
                "transition-[background-color,color,box-shadow] duration-200 ease-[var(--ease-out-soft)]",
                selected
                  ? "bg-glacier-400 text-navy-950 shadow-[0_8px_22px_-6px_rgb(44_186_226/0.7)]"
                  : "glass-chip text-ink-muted hover:text-ink-strong",
              )}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {items.map((item, index) => (
        <div
          key={item.id}
          role="tabpanel"
          id={`${baseId}-panel-${item.id}`}
          aria-labelledby={`${baseId}-tab-${item.id}`}
          hidden={index !== active}
          tabIndex={0}
          className="mt-8 focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-glacier-500"
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}
