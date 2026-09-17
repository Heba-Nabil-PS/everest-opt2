import { Icon } from "@/components/ui/Icon";
import { Section, SectionHeading, Shell } from "@/components/ui/Section";
import { PhotoBackdrop } from "@/components/ui/PhotoBackdrop";
import { QuoteForm } from "@/components/forms/QuoteForm";
import { products } from "@/lib/data/products";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n";

/**
 * The closing band: every scroll depth on this page has paired a proof point
 * with an action, and this is where the last one lands.
 */
export function LeadBand({ locale, dictionary: d }: { locale: Locale; dictionary: Dictionary }) {
  const options = products.map((product) => ({
    value: `${product.name} (${product.code})`,
    label: `${product.name} · ${product.code}`,
  }));

  return (
    <Section ground="deep" aria-labelledby="lead-heading">
      <PhotoBackdrop src="/images/leadband-store.jpg" />
      <Shell className="relative grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-start">
        <div>
          <SectionHeading
            id="lead-heading"
            eyebrow={d.home.lead.eyebrow}
            title={d.home.lead.heading}
            intro={d.home.lead.body}
            size="display"
            inverse
          />

          <ul className="mt-8 flex flex-col gap-3">
            {d.home.lead.reassurance.map((item) => (
              <li key={item} className="flex items-start gap-3 text-ink-inverse-muted">
                <Icon name="check" size={20} className="mt-0.5 shrink-0 text-glacier-300" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="form-dark glass-dark rounded-2xl p-6 lg:p-8">
          <QuoteForm
            locale={locale}
            dictionary={d}
            products={options}
            submitLabel={d.home.lead.submit}
          />
        </div>
      </Shell>
    </Section>
  );
}
