import { certifications, site } from "@/lib/data/site";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n";
import type { Product, ProductCategory } from "@/lib/data/types";

function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      /* Structured data is generated from the same objects that render the
         page, so the markup can never describe something the page does not. */
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function OrganizationJsonLd({
  locale,
  dictionary: d,
}: {
  locale: Locale;
  dictionary: Dictionary;
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Organization",
        name: d.meta.legalName,
        alternateName: d.meta.siteName,
        url: `${site.url}/${locale}`,
        description: d.meta.defaultDescription,
        foundingDate: String(site.founded),
        telephone: site.phone,
        email: site.email,
        address: {
          "@type": "PostalAddress",
          streetAddress: site.address.line2,
          addressLocality: site.address.city,
          addressCountry: "AE",
        },
        sameAs: [site.social.linkedin, site.social.youtube],
        hasCredential: certifications.map((cert) => ({
          "@type": "EducationalOccupationalCredential",
          credentialCategory: "certification",
          name: cert.standard,
          description: cert.scope[locale],
        })),
      }}
    />
  );
}

export function ProductJsonLd({
  product,
  category,
  locale,
  url,
}: {
  product: Product;
  category: ProductCategory;
  locale: Locale;
  url: string;
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        sku: product.code,
        mpn: product.code,
        category: category.name[locale],
        description: product.summary[locale],
        url,
        brand: { "@type": "Brand", name: "Everest Industrial" },
        manufacturer: { "@type": "Organization", name: "Everest Industrial Group" },
        weight: { "@type": "QuantitativeValue", value: product.specs.netWeight, unitCode: "KGM" },
        width: { "@type": "QuantitativeValue", value: product.specs.dimensions.width, unitCode: "MMT" },
        depth: { "@type": "QuantitativeValue", value: product.specs.dimensions.depth, unitCode: "MMT" },
        height: { "@type": "QuantitativeValue", value: product.specs.dimensions.height, unitCode: "MMT" },
        additionalProperty: [
          { "@type": "PropertyValue", name: "Gross capacity", value: `${product.specs.capacity} L` },
          { "@type": "PropertyValue", name: "Doors", value: product.specs.doors },
          { "@type": "PropertyValue", name: "Energy class", value: product.specs.energyClass },
          { "@type": "PropertyValue", name: "Refrigerant", value: product.specs.refrigerant },
          {
            "@type": "PropertyValue",
            name: "Annual energy consumption",
            value: `${product.specs.annualConsumption} kWh`,
          },
        ],
      }}
    />
  );
}

export function BreadcrumbJsonLd({ items }: { items: { name: string; url: string }[] }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          item: item.url,
        })),
      }}
    />
  );
}

export function ArticleJsonLd({
  headline,
  description,
  datePublished,
  url,
}: {
  headline: string;
  description: string;
  datePublished: string;
  url: string;
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "NewsArticle",
        headline,
        description,
        datePublished,
        url,
        publisher: { "@type": "Organization", name: "Everest Industrial Group" },
      }}
    />
  );
}

export function FaqJsonLd({ items }: { items: { q: string; a: string }[] }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: items.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      }}
    />
  );
}
