import type { Certification } from "./types";

export const site = {
  url: "https://www.everestindustrial.com",
  phone: "+971 6 543 9555",
  phoneHref: "+97165439555",
  whatsapp: "+971 6 543 9555",
  whatsappHref: "https://wa.me/97165439555",
  email: "everestmktg@everestindustrial.com",
  address: {
    line1: "Everest Industrial Group",
    line2: "Industrial Area No. 6, King Faisal St",
    city: "Sharjah",
    country: "United Arab Emirates",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Everest+Industrial+Industrial+Area+6+King+Faisal+St+Sharjah",
  },
  social: {
    linkedin: "https://www.linkedin.com/company/everest-industrial",
    youtube: "https://www.youtube.com/@everestindustrial",
  },
  founded: 1981,
} as const;

/** Navigation is structural; labels come from the dictionary by key. */
export type NavKey =
  | "products"
  | "productsServices"
  | "viewProducts"
  | "industries"
  | "innovation"
  | "sustainability"
  | "services"
  | "resources"
  | "news"
  | "contact"
  | "about"
  | "careers"
  | "presence";

export interface NavItem {
  key: NavKey;
  href: string;
  /** Opens the full product mega menu. */
  hasMegaMenu?: boolean;
  /** Opens a plain dropdown of these destinations. */
  menu?: { key: NavKey; href: string }[];
}

/**
 * Two arrangements of the navigation, kept side by side so the site can move
 * between them by changing `navVariant` alone.
 *
 *   1 — Products opens the product mega menu, Services & Support is its own
 *       main item, and Global Presence sits in the utility bar.
 *   2 — Products & Services opens a two-link dropdown holding both, which
 *       frees a main slot for Global Presence.
 */
const navArrangements: Record<1 | 2, { main: NavItem[]; utility: { key: NavKey; href: string }[] }> = {
  1: {
    main: [
      { key: "products", href: "/products", hasMegaMenu: true },
      { key: "about", href: "/about" },
      { key: "innovation", href: "/innovation" },
      { key: "sustainability", href: "/sustainability" },
      { key: "services", href: "/services" },
      { key: "contact", href: "/contact" },
    ],
    utility: [
      { key: "news", href: "/news" },
      { key: "careers", href: "/careers" },
      { key: "presence", href: "/global-presence" },
      { key: "resources", href: "/resources" },
    ],
  },
  2: {
    main: [
      {
        key: "productsServices",
        href: "/products",
        menu: [
          { key: "viewProducts", href: "/products" },
          { key: "services", href: "/services" },
        ],
      },
      { key: "about", href: "/about" },
      { key: "innovation", href: "/innovation" },
      { key: "sustainability", href: "/sustainability" },
      { key: "presence", href: "/global-presence" },
      { key: "contact", href: "/contact" },
    ],
    utility: [
      { key: "news", href: "/news" },
      { key: "careers", href: "/careers" },
      { key: "resources", href: "/resources" },
    ],
  },
};

/** Switch to 1 to restore the mega-menu arrangement. */
export const navVariant: 1 | 2 = 2;

export const mainNav = navArrangements[navVariant].main;

/** Secondary destinations shown in the slim bar above the main navigation. */
export const utilityNav = navArrangements[navVariant].utility;

/** Marketplace storefronts for single-unit buyers ("Get Everest Directly"). */
export const marketplaces = {
  amazon: "https://www.amazon.ae/s?i=merchant-items&me=A161WSU254ZCT4",
  noon: "https://www.noon.com/uae-en/search/?q=everest%20cooler",
} as const;

export const certifications: Certification[] = [
  {
    id: "iso-9001",
    standard: "ISO 9001",
    title: { en: "Quality Management", ar: "إدارة الجودة" },
    scope: {
      en: "Design, manufacture and service of commercial refrigeration equipment.",
      ar: "تصميم وتصنيع وصيانة معدّات التبريد التجاري.",
    },
  },
  {
    id: "iso-14001",
    standard: "ISO 14001",
    title: { en: "Environmental Management", ar: "الإدارة البيئية" },
    scope: {
      en: "Environmental management across manufacturing, finishing and logistics.",
      ar: "الإدارة البيئية عبر التصنيع والتشطيب والخدمات اللوجستية.",
    },
  },
  {
    id: "iso-45001",
    standard: "ISO 45001",
    title: {
      en: "Occupational Health & Safety",
      ar: "الصحة والسلامة المهنية",
    },
    scope: {
      en: "Occupational health and safety management for all site operations.",
      ar: "إدارة الصحة والسلامة المهنية لجميع عمليات الموقع.",
    },
  },
  {
    id: "ohsas-18001",
    standard: "OHSAS 18001",
    title: {
      en: "Occupational Health & Safety Assessment",
      ar: "تقييم الصحة والسلامة المهنية",
    },
    scope: {
      en: "Occupational health and safety assessment series across manufacturing sites.",
      ar: "سلسلة تقييم الصحة والسلامة المهنية عبر مواقع التصنيع.",
    },
  },
];
