"use client";

import { Button } from "@/components/ui/Button";
import { useQuoteModal, type QuoteRequest } from "./QuoteModal";

type ButtonProps = React.ComponentProps<typeof Button>;

/**
 * A "Request a Quote" control. Drop-in for the ButtonLink that used to point at
 * the quote route — same styling props, but it raises the quote dialog.
 */
export function QuoteButton({
  request,
  onClick,
  ...rest
}: Omit<ButtonProps, "onClick"> & {
  request?: QuoteRequest;
  /** Runs before the dialog opens — e.g. closing the mobile menu. */
  onClick?: () => void;
}) {
  const openQuote = useQuoteModal();

  return (
    <Button
      {...rest}
      onClick={() => {
        onClick?.();
        openQuote(request);
      }}
    />
  );
}
