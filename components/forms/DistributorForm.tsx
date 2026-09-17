"use client";

import { InquiryForm } from "./InquiryForm";
import { CheckboxField, TextArea, TextField } from "./Field";
import type { Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n/config";

export function DistributorForm({
  locale,
  dictionary: d,
}: {
  locale: Locale;
  dictionary: Dictionary;
}) {
  return (
    <InquiryForm
      kind="distributor"
      locale={locale}
      dictionary={d}
      submitLabel={d.cta.becomeDistributor}
    >
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
              name="jobTitle"
              label={d.forms.fields.jobTitle}
              autoComplete="organization-title"
              optionalSuffix={d.forms.optionalSuffix}
              error={state.errors.jobTitle}
              defaultValue={state.values?.jobTitle}
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
              name="market"
              label={d.forms.fields.market}
              required
              error={state.errors.market}
              defaultValue={state.values?.market}
            />
          </div>

          <TextArea
            name="portfolio"
            label={d.forms.fields.portfolio}
            required
            error={state.errors.portfolio}
            defaultValue={state.values?.portfolio}
          />

          <TextField
            name="annualVolume"
            label={d.forms.fields.annualVolume}
            optionalSuffix={d.forms.optionalSuffix}
            error={state.errors.annualVolume}
            defaultValue={state.values?.annualVolume}
          />

          <CheckboxField name="consent" label={d.forms.fields.consent} error={state.errors.consent} />
        </>
      )}
    </InquiryForm>
  );
}
