"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { QuoteForm } from "./QuoteForm";
import type { Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n/config";

/** Optional context for the request — set from a product page so the model
 *  arrives already chosen. */
export interface QuoteRequest {
  product?: string;
  hidden?: Record<string, string>;
}

const OpenQuoteContext = createContext<((request?: QuoteRequest) => void) | null>(null);

/**
 * Opens the quote form. Available anywhere below QuoteModalProvider, which the
 * locale layout mounts once — so every "Request a Quote" control on the site
 * raises the same dialog instead of navigating to a page.
 */
export function useQuoteModal() {
  const open = useContext(OpenQuoteContext);
  if (!open) throw new Error("useQuoteModal must be used inside <QuoteModalProvider>");
  return open;
}

/**
 * Holds the quote dialog for the whole site. The form lives here rather than on
 * a route, so a request can be raised from any page without losing the page
 * behind it. Closing unmounts the form, so each opening starts clean.
 */
export function QuoteModalProvider({
  locale,
  dictionary: d,
  products,
  children,
}: {
  locale: Locale;
  dictionary: Dictionary;
  products: { value: string; label: string }[];
  children: React.ReactNode;
}) {
  const [request, setRequest] = useState<QuoteRequest | null>(null);
  /* Bumped by "send another", to remount the form with a fresh action state. */
  const [attempt, setAttempt] = useState(0);

  const open = useCallback((next: QuoteRequest = {}) => setRequest(next), []);
  const close = useCallback(() => setRequest(null), []);

  return (
    <OpenQuoteContext.Provider value={open}>
      {children}

      <Modal
        open={request !== null}
        onClose={close}
        title={d.quote.hero.headline}
        description={d.quote.hero.subline}
        closeLabel={d.a11y.closeDialog}
        size="lg"
      >
        <QuoteForm
          key={attempt}
          locale={locale}
          dictionary={d}
          products={products}
          dense
          defaultProduct={request?.product}
          hidden={request?.hidden}
          submitLabel={d.home.lead.submit}
          onSendAnother={() => setAttempt((n) => n + 1)}
        />
      </Modal>
    </OpenQuoteContext.Provider>
  );
}
