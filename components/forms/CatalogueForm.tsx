"use client";

import { InquiryForm } from "./InquiryForm";
import { CheckboxField, TextField } from "./Field";
import { ButtonLink } from "@/components/ui/Button";
import { catalogueHref } from "@/lib/data/documents";
import type { Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n/config";

/**
 * The only gated download on the site: the full catalogue, because updated
 * editions are sent to whoever takes it. Individual documents stay ungated.
 */
export function CatalogueForm({
  locale,
  dictionary: d,
}: {
  locale: Locale;
  dictionary: Dictionary;
}) {
  return (
    <InquiryForm
      kind="catalogue"
      locale={locale}
      dictionary={d}
      submitLabel={d.cta.downloadCatalogue}
      /* The gate opens immediately — the catalogue is on the confirmation. */
      successExtra={
        <ButtonLink href={catalogueHref(locale)} icon="download" external>
          {d.cta.downloadCatalogue}
        </ButtonLink>
      }
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
          </div>
          <TextField
            name="email"
            type="email"
            label={d.forms.fields.email}
            autoComplete="email"
            required
            error={state.errors.email}
            defaultValue={state.values?.email}
          />
          <CheckboxField
            name="consent"
            label={d.forms.fields.newsletterConsent}
            error={state.errors.consent}
          />
        </>
      )}
    </InquiryForm>
  );
}
