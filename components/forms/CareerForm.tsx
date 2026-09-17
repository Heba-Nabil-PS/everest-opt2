"use client";

import { InquiryForm } from "./InquiryForm";
import { CheckboxField, FileField, SelectField, TextArea, TextField } from "./Field";
import type { Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n/config";

export function CareerForm({
  locale,
  dictionary: d,
  roles,
  defaultRole,
}: {
  locale: Locale;
  dictionary: Dictionary;
  roles: { value: string; label: string }[];
  defaultRole?: string;
}) {
  return (
    <InquiryForm kind="career" locale={locale} dictionary={d} submitLabel={d.cta.apply}>
      {(state) => (
        <>
          <SelectField
            name="role"
            label={d.careers.vacancies.roleLabel}
            options={roles}
            required
            defaultValue={defaultRole ?? roles[0]?.value}
            error={state.errors.role}
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
              name="alternatePhone"
              type="tel"
              label={d.forms.fields.alternatePhone}
              optionalSuffix={d.forms.optionalSuffix}
              error={state.errors.alternatePhone}
              defaultValue={state.values?.alternatePhone}
            />
          </div>

          <FileField
            name="cv"
            label={d.forms.fields.cv}
            hint={d.forms.fields.cvHint}
            accept=".pdf,.doc,.docx"
            required
            error={state.errors.cv}
          />

          <TextArea
            name="message"
            label={d.forms.fields.message}
            optionalSuffix={d.forms.optionalSuffix}
            rows={4}
            error={state.errors.message}
            defaultValue={state.values?.message}
          />

          <CheckboxField name="consent" label={d.forms.fields.consent} error={state.errors.consent} />
        </>
      )}
    </InquiryForm>
  );
}
