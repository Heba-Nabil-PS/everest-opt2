"use client";

import { ProductLandscape } from "@/components/home/ProductLandscape";

export interface RangeCategory {
  slug: string;
  name: string;
  tagline: string;
  highlights: string[];
  href: string;
  formats: { label: string; href: string }[];
  models: {
    slug: string;
    code: string;
    name: string;
    format: string;
    capacity: string;
    temperature: string;
    image?: string;
    href: string;
    featured: boolean;
  }[];
}

/**
 * The product range as a full-bleed, continuously drifting wall — one row
 * per category (chillers, then freezers), no switcher and no description
 * panel. See ProductLandscape for the drift/drag/hover behaviour.
 */
export function RangeExplorer({
  categories,
  labels,
}: {
  categories: RangeCategory[];
  labels: { region: string; viewProduct: string };
}) {
  return (
    <div className="anim-rise relative left-1/2 right-1/2 -mx-[50vw] w-screen min-w-0">
      <ProductLandscape
        rows={categories.map((category) => ({
          key: category.slug,
          products: category.models.map((model) => ({
            slug: model.slug,
            code: model.code,
            name: model.name,
            category: model.format,
            image: model.image,
            href: model.href,
            featured: model.featured,
          })),
        }))}
        labels={labels}
      />
    </div>
  );
}
