"use server";

import { getDictionary } from "@/lib/i18n";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n/config";
import { deliverInquiry, type InquiryKind } from "./deliver";
import {
  careerFields,
  catalogueFields,
  contactFields,
  customizeFields,
  distributorFields,
  quoteFields,
  serviceFields,
} from "./specs";
import { errorSummary, validate, type FieldSpec, type FormState } from "./validate";

const registry: Record<InquiryKind, FieldSpec[]> = {
  quote: quoteFields,
  "product-inquiry": quoteFields,
  contact: contactFields,
  service: serviceFields,
  customize: customizeFields,
  distributor: distributorFields,
  career: careerFields,
  catalogue: catalogueFields,
};

/**
 * One server action for every form. The form declares its kind and locale in
 * hidden inputs, so a single action validates against the right spec and
 * answers in the right language — and it works without JavaScript.
 */
export async function submitInquiry(
  _previous: FormState,
  formData: FormData,
): Promise<FormState> {
  const kind = String(formData.get("kind") ?? "contact") as InquiryKind;
  const rawLocale = String(formData.get("locale") ?? defaultLocale);
  const locale: Locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const d = getDictionary(locale);

  const spec = registry[kind];
  if (!spec) {
    return { status: "error", errors: {}, message: d.forms.networkError };
  }

  /* Honeypot: a field only an automated submitter fills in. Answer with the
     success state so the bot learns nothing from the difference. */
  if (String(formData.get("company_website") ?? "") !== "") {
    return { status: "success", errors: {} };
  }

  const { errors, values } = validate(spec, formData, locale);

  if (Object.keys(errors).length > 0) {
    return {
      status: "error",
      errors,
      message: errorSummary(errors, locale),
      values,
    };
  }

  const { delivered } = await deliverInquiry({
    kind,
    locale,
    submittedAt: new Date().toISOString(),
    fields: values,
  });

  /* In production a submission that was never transported is a failure, and
     the visitor is told so rather than shown a false confirmation. */
  if (!delivered && process.env.NODE_ENV === "production") {
    return { status: "error", errors: {}, message: d.forms.networkError, values };
  }

  return { status: "success", errors: {} };
}
