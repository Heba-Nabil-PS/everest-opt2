"use client";

import { InquiryForm } from "./InquiryForm";
import { CheckboxField, SelectField, TextArea, TextField } from "./Field";
import type { Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n/config";

interface QuoteFormProps {
  locale: Locale;
  dictionary: Dictionary;
  /** Model options for the product select. */
  products: { value: string; label: string }[];
  /** Pre-selected model — set on product pages so nothing is retyped. */
  defaultProduct?: string;
  /** Model name and code travel with the inquiry even when the select is hidden. */
  hidden?: Record<string, string>;
  compact?: boolean;
  /** Tighter layout for the dialog, where the whole form has to fit the
   *  viewport without the visitor scrolling to find the send button. */
  dense?: boolean;
  inverse?: boolean;
  submitLabel: string;
  /** Passed by the quote dialog, which remounts the form instead of reloading. */
  onSendAnother?: () => void;
}

export function QuoteForm({
  locale,
  dictionary: d,
  products,
  defaultProduct,
  hidden,
  compact,
  dense,
  inverse,
  submitLabel,
  onSendAnother,
}: QuoteFormProps) {
  return (
    <InquiryForm
      kind={defaultProduct ? "product-inquiry" : "quote"}
      locale={locale}
      dictionary={d}
      submitLabel={submitLabel}
      hidden={hidden}
      inverse={inverse}
      onSendAnother={onSendAnother}
      className={dense ? "gap-4" : undefined}
    >
      {(state) => (
        <>
          <div className={dense ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3" : "grid gap-5 sm:grid-cols-2"}>
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
              required
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
              label={d.forms.fields.country}
              autoComplete="country-name"
              required
              error={state.errors.country}
              defaultValue={state.values?.country}
            />
            <TextField
              name="quantity"
              label={d.forms.fields.quantity}
              optionalSuffix={d.forms.optionalSuffix}
              error={state.errors.quantity}
              defaultValue={state.values?.quantity}
            />
          </div>

          {!compact ? (
            <SelectField
              name="product"
              label={d.forms.fields.product}
              placeholder={d.forms.fields.productPlaceholder}
              options={products}
              defaultValue={defaultProduct}
              optionalSuffix={d.forms.optionalSuffix}
              error={state.errors.product}
            />
          ) : null}

          <TextArea
            name="message"
            label={d.forms.fields.message}
            placeholder={d.forms.fields.messagePlaceholder}
            required
            rows={compact || dense ? 3 : 5}
            error={state.errors.message}
            defaultValue={state.values?.message}
          />

          <CheckboxField name="consent" label={d.forms.fields.consent} error={state.errors.consent} />
        </>
      )}
    </InquiryForm>
  );
}
