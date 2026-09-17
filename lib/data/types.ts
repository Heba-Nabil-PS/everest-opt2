import type { Locale } from "@/lib/i18n/config";

/** A string that exists in every supported language. */
export type Localized = Record<Locale, string>;

export type EnergyClass = "A" | "B" | "C" | "D" | "E";

export type Refrigerant = "R290" | "R600a" | "R134a" | "R404A";

export type TechKey = "emmd" | "led" | "r290" | "lowE" | "lock" | "castors" | "digital";

/** Which vector cabinet the art layer draws for this model. */
export type CabinetForm = "upright" | "chest" | "countertop" | "watercooler";

export interface ProductArt {
  form: CabinetForm;
  /** Glazed door panels drawn on the front face. 0 on an upright draws an open multideck. */
  doors: number;
  /** Shelf lines drawn behind the glass. */
  shelves: number;
  /** Illuminated header canopy above the door. */
  canopy: boolean;
  /** Relative cabinet proportions used by the SVG and the 3D viewer. */
  ratio: { width: number; height: number; depth: number };
}

export interface ProductSpecs {
  /** Gross capacity in litres. */
  capacity: number;
  /** Net usable capacity in litres. */
  netCapacity: number;
  doors: number;
  /** Millimetres. */
  dimensions: { width: number; depth: number; height: number };
  /** Kilograms. */
  netWeight: number;
  energyClass: EnergyClass;
  /** kWh per year on a standard duty cycle. */
  annualConsumption: number;
  refrigerant: Refrigerant;
  /** Degrees Celsius. */
  temperatureRange: { min: number; max: number };
  power: string;
  lighting: Localized;
  shelves: Localized;
  defrost: Localized;
  climateClass: string;
  controller: Localized;
  /** dB(A). */
  noiseLevel: number;
  /** Warranty in months: unit and compressor. */
  warranty: { unit: number; compressor: number };
}

export interface ProductFeature {
  title: Localized;
  body: Localized;
}

export interface Product {
  slug: string;
  /** Printed model code, always rendered as live LTR text. */
  code: string;
  name: string;
  categorySlug: CategorySlug;
  /** Format within the main category, e.g. "single-door" or "horizontal". */
  subcategory: SubcategorySlug;
  summary: Localized;
  description: Localized;
  features: ProductFeature[];
  specs: ProductSpecs;
  tech: TechKey[];
  featured: boolean;
  /** B2C marketplace links appear only on models sold as single units. */
  retail?: { amazon?: string; noon?: string };
  /** Product photographs; the first is the lead image on cards and the gallery. */
  images: string[];
  art: ProductArt;
}

export type CategorySlug = "chillers" | "freezers";

export type SubcategorySlug =
  | "can-cooler"
  | "countertop"
  | "double-door"
  | "open-type"
  | "quad-door"
  | "single-door"
  | "triple-door"
  | "horizontal"
  | "vertical";

export interface ProductSubcategory {
  slug: SubcategorySlug;
  name: Localized;
}

export interface ProductCategory {
  slug: CategorySlug;
  name: Localized;
  shortName: Localized;
  tagline: Localized;
  intro: Localized;
  /** Three claims shown on the category card, each backed by the spec data. */
  highlights: Localized[];
  /** Formats inside the category, in display order. */
  subcategories: ProductSubcategory[];
  /** Photograph used as the category's background. */
  image: string;
  art: CabinetForm;
}

export interface Market {
  name: Localized;
  country: string;
  status: "established" | "growth" | "future";
  /** Percentage coordinates on the world map illustration. */
  position: { x: number; y: number };
  contact?: { label: Localized; phone?: string; email?: string };
  /** Manufacturing site in this country, when there is one. */
  factory?: {
    status: FactoryStatus;
    role: Localized;
    note: Localized;
    /** One headline figure for the site, e.g. daily output. */
    figure?: { value: string; label: Localized };
  };
}

export type FactoryStatus = "operational" | "expanding" | "new" | "planned";

export interface NewsArticle {
  slug: string;
  date: string;
  topic: "product" | "certification" | "market" | "sustainability";
  title: Localized;
  summary: Localized;
  /** Body paragraphs, per language. */
  body: Record<Locale, string[]>;
  readMinutes: number;
  /** Lifestyle photograph shown on cards and the article page. */
  image: string;
  featured?: boolean;
}

export interface ResourceDocument {
  id: string;
  kind: "brochure" | "manual" | "spec-sheet" | "certification";
  title: Localized;
  description: Localized;
  fileType: "PDF";
  fileSize: string;
  /** Related product or category slug, used to surface the file in context. */
  relatedSlug?: string;
}

export interface Vacancy {
  slug: string;
  title: Localized;
  department: Localized;
  location: Localized;
  type: Localized;
  summary: Localized;
  responsibilities: Localized[];
  requirements: Localized[];
}

export interface Certification {
  id: string;
  standard: string;
  title: Localized;
  scope: Localized;
}
