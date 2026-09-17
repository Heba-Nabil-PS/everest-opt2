"use client";

import { InquiryForm } from "./InquiryForm";
import { CheckboxField, TextArea, TextField } from "./Field";
import type { Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n/config";

export function ServiceForm({
  locale,
  dictionary: d,
}: {
  locale: Locale;
  dictionary: Dictionary;
}) {
  return (
    <InquiryForm kind="service" locale={locale} dictionary={d} submitLabel={d.cta.requestService}>
      {(state) => (
        <>
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
              required
              error={state.errors.phone}
              defaultValue={state.values?.phone}
            />
            <TextField
              name="serialNumber"
              label={d.forms.fields.serialNumber}
              required
              error={state.errors.serialNumber}
              defaultValue={state.values?.serialNumber}
            />
            <TextField
              name="purchaseDate"
              type="date"
              label={d.forms.fields.purchaseDate}
              optionalSuffix={d.forms.optionalSuffix}
              error={state.errors.purchaseDate}
              defaultValue={state.values?.purchaseDate}
            />
          </div>

          <TextArea
            name="issue"
            label={d.forms.fields.issue}
            required
            error={state.errors.issue}
            defaultValue={state.values?.issue}
          />

          <CheckboxField name="consent" label={d.forms.fields.consent} error={state.errors.consent} />
        </>
      )}
    </InquiryForm>
  );
}
