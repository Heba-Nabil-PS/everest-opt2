"use client";

import { QuoteButton } from "@/components/forms/QuoteButton";

/**
 * Phones only (below `sm`, where the header hides its quote button): a fixed
 * bottom bar keeps the primary conversion one tap away on every page. The
 * WhatsApp and back-to-top buttons are lifted above it at the same breakpoint.
 */
export function MobileQuoteBar({ label }: { label: string }) {
  return (
    <div
      className="fixed inset-x-0 bottom-0 border-t border-hairline bg-white/90 px-4 pt-3 shadow-[0_-8px_24px_-12px_rgb(35_34_91/0.25)] backdrop-blur-lg sm:hidden"
      style={{ zIndex: "var(--z-sticky)", paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
    >
      <QuoteButton fullWidth icon="arrowRight">
        {label}
      </QuoteButton>
    </div>
  );
}
