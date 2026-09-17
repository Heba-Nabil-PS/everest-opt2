import "server-only";

export type InquiryKind =
  | "quote"
  | "product-inquiry"
  | "contact"
  | "service"
  | "customize"
  | "distributor"
  | "career"
  | "catalogue";

export interface Inquiry {
  kind: InquiryKind;
  locale: string;
  submittedAt: string;
  fields: Record<string, string>;
}

/**
 * Single delivery seam for every form on the site.
 *
 * Set `EVEREST_INQUIRY_WEBHOOK` to the endpoint that should receive inquiries
 * (CRM intake, Zapier, a mail relay — anything that accepts JSON). Until that
 * variable is configured the payload is written to the server log so nothing is
 * lost in development, and the caller is told delivery was not transported.
 *
 * This must be pointed at a real endpoint before launch — see README.
 */
export async function deliverInquiry(inquiry: Inquiry): Promise<{ delivered: boolean }> {
  const endpoint = process.env.EVEREST_INQUIRY_WEBHOOK;

  if (!endpoint) {
    console.info("[everest:inquiry] no EVEREST_INQUIRY_WEBHOOK configured", inquiry);
    return { delivered: false };
  }

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(inquiry),
      /* Never let a slow CRM hold a visitor's submit open. */
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      console.error("[everest:inquiry] delivery failed", response.status, inquiry.kind);
      return { delivered: false };
    }

    return { delivered: true };
  } catch (error) {
    console.error("[everest:inquiry] delivery error", error);
    return { delivered: false };
  }
}
