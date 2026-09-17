"use client";

import { InquiryForm } from "./InquiryForm";
import { CheckboxField, SelectField, TextArea, TextField } from "./Field";
import type { Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n/config";

export function ContactForm({
  locale,
  dictionary: d,
  defaultType,
  productOptions = [],
}: {
  locale: Locale;
  dictionary: Dictionary;
  defaultType?: string;
  /** Product ranges for the "product interest" select. */
  productOptions?: { value: string; label: string }[];
}) {
  const types = Object.entries(d.contact.inquiryTypes).map(([value, label]) => ({
    value,
    label,
  }));

  return (
    <InquiryForm kind="contact" locale={locale} dictionary={d} submitLabel={d.cta.submitInquiry}>
      {(state) => (
        <>
          <SelectField
            name="inquiryType"
            label={d.contact.inquiryTypeLabel}
            options={types}
            required
            defaultValue={defaultType ?? "quote"}
            error={state.errors.inquiryType}
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <TextField
              name="fullName"
              label={d.forms.fields.fullName}
              autoComplete="name"
              required
              error={state.errors.fullName}
              defaultValue={state.values?.fullName}
            />
            <TextField
              name="company"
              label={d.forms.fields.company}
              autoComplete="organization"
              optionalSuffix={d.forms.optionalSuffix}
              error={state.errors.company}
              defaultValue={state.values?.company}
            />
            <TextField
              name="email"
              type="email"
              label={d.forms.fields.email}
              autoComplete="email"
              required
              error={state.errors.email}
              defaultValue={state.values?.email}
            />
            <TextField
              name="phone"
              type="tel"
              label={d.forms.fields.phone}
              autoComplete="tel"
              optionalSuffix={d.forms.optionalSuffix}
              error={state.errors.phone}
              defaultValue={state.values?.phone}
            />
            <TextField
              name="country"
              label={d.forms.fields.region}
              autoComplete="country-name"
              required
              error={state.errors.country}
              defaultValue={state.values?.country}
            />
            <SelectField
              name="productInterest"
              label={d.forms.fields.productInterest}
              placeholder={d.forms.fields.productInterestPlaceholder}
              options={productOptions}
              optionalSuffix={d.forms.optionalSuffix}
              defaultValue={state.values?.productInterest}
              error={state.errors.productInterest}
            />
          </div>

          <TextArea
            name="message"
            label={d.forms.fields.message}
            placeholder={d.forms.fields.messagePlaceholder}
            required
            error={state.errors.message}
            defaultValue={state.values?.message}
          />

          <CheckboxField name="consent" label={d.forms.fields.consent} error={state.errors.consent} />
        </>
      )}
    </InquiryForm>
  );
}
