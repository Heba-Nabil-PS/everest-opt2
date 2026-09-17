import { getDictionary, t } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n/config";

export type FieldRule =
  | { type: "required" }
  | { type: "email" }
  | { type: "phone" }
  | { type: "minLength"; value: number }
  | { type: "consent" };

export interface FieldSpec {
  name: string;
  /** Dictionary key under `forms.fields`, used in error messages. */
  labelKey: keyof ReturnType<typeof getDictionary>["forms"]["fields"];
  rules: FieldRule[];
}

export interface FormState {
  status: "idle" | "success" | "error";
  /** Field name -> message. */
  errors: Record<string, string>;
  message?: string;
  /** Echoed back so the form can repopulate after a failed submit. */
  values?: Record<string, string>;
}

export const emptyFormState: FormState = { status: "idle", errors: {} };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^[+]?[\d\s()-]{7,20}$/;

/**
 * Server-side validation is the source of truth: the browser may enhance it,
 * but nothing is trusted until it has been checked here.
 */
export function validate(
  fields: FieldSpec[],
  formData: FormData,
  locale: Locale,
): { errors: Record<string, string>; values: Record<string, string> } {
  const d = getDictionary(locale);
  const errors: Record<string, string> = {};
  const values: Record<string, string> = {};

  for (const field of fields) {
    const raw = formData.get(field.name);
    const value = typeof raw === "string" ? raw.trim() : raw instanceof File ? raw.name : "";
    values[field.name] = value;
    const label = d.forms.fields[field.labelKey];

    for (const rule of field.rules) {
      if (errors[field.name]) break;

      switch (rule.type) {
        case "required":
          if (!value) errors[field.name] = t(d.forms.validation.required, { field: label });
          break;
        case "email":
          if (value && !EMAIL.test(value)) errors[field.name] = d.forms.validation.email;
          break;
        case "phone":
          if (value && !PHONE.test(value)) errors[field.name] = d.forms.validation.phone;
          break;
        case "minLength":
          if (value && value.length < rule.value)
            errors[field.name] = t(d.forms.validation.minLength, {
              field: label,
              n: rule.value,
            });
          break;
        case "consent":
          if (value !== "on" && value !== "true")
            errors[field.name] = d.forms.validation.consent;
          break;
      }
    }
  }

  return { errors, values };
}

/** Summary line shown above a failed form, with the right plural. */
export function errorSummary(errors: Record<string, string>, locale: Locale) {
  const d = getDictionary(locale);
  const count = Object.keys(errors).length;
  return t(count === 1 ? d.forms.errorBody : d.forms.errorBodyPlural, { n: count });
}
