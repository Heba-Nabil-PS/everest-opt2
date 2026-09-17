"use client";

import { useEffect, useLayoutEffect, useRef, ViewTransition } from "react";
import { usePathname } from "next/navigation";
import { registerGsap, ScrollTrigger } from "@/lib/motion";
import { scrollToY } from "./SmoothScroll";

/**
 * Route transitions through React's <ViewTransition> and the browser View
 * Transitions API, so no JavaScript ever holds a navigation back:
 *
 *   current page  → lifts away and fades (fast, ~200ms)
 *   new page      → rises into place (slower, ~700ms)
 *   hero content  → replays its own CSS entrance inside the live new view
 *
 * Keying the boundary on the pathname turns every route change into an
 * exit/enter pair. Named elements inside it (a product photo on a card and on
 * the product page) morph between routes instead. Query-string changes on the
 * same path — filters — do not animate. Browsers without the API simply swap.
 * The CSS lives in globals.css under "Page transitions".
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const firstRender = useRef(true);
  const historyNavigation = useRef(false);

  useEffect(() => {
    const onPopState = () => {
      historyNavigation.current = true;
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  /* Layout phase, so the new view is captured already at the top. */
  useLayoutEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    /* Every new page starts from the top, unless the link targets an anchor
       or the user went Back/Forward (the browser restores that position). */
    const wasHistoryNavigation = historyNavigation.current;
    historyNavigation.current = false;
    if (!window.location.hash && !wasHistoryNavigation) {
      scrollToY(0, { immediate: true });
    }
  }, [pathname]);

  /* Re-measure every trigger once the new page has laid out. */
  useEffect(() => {
    registerGsap();
    const frame = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  return (
    <ViewTransition key={pathname} enter="page-enter" exit="page-exit" default="none">
      <div>{children}</div>
    </ViewTransition>
  );
}
