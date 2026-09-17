import type { Localized } from "./types";

/* -------------------------------------------------------------------------
 * PLACEHOLDER CONTENT — client names come from the 2026 questionnaire
 * ("add clients Pepsi, Coca-Cola…" and the Varun Beverages partnership).
 * They render as text wordmarks until Everest supplies approved logo files
 * and permission to display them. Testimonials are layout stand-ins: replace
 * with signed-off quotes, names and companies before launch.
 * ---------------------------------------------------------------------- */

export interface Client {
  name: string;
  /** Wordmark styling hint until real logo artwork is supplied. */
  tone: "blue" | "red" | "navy";
  logo?: string;
}

export const clients: Client[] = [
  { name: "PepsiCo", tone: "blue" },
  { name: "Coca-Cola", tone: "red" },
  { name: "Varun Beverages", tone: "navy" },
];

export const clientCount = 60;

export interface Testimonial {
  quote: Localized;
  role: Localized;
  organisation: Localized;
}

export const testimonials: Testimonial[] = [
  {
    quote: {
      en: "Everest delivered a national rollout on schedule, and the after-sales team was on site before we had to escalate.",
      ar: "نفّذت إيفرست طرحاً وطنياً في موعده، وكان فريق ما بعد البيع في الموقع قبل أن نضطر إلى التصعيد.",
    },
    role: { en: "Head of Cold Drink Equipment", ar: "رئيس معدّات المشروبات الباردة" },
    organisation: { en: "Global beverage bottler · GCC", ar: "شركة تعبئة مشروبات عالمية · الخليج" },
  },
  {
    quote: {
      en: "The branded cabinets hold temperature through a Gulf summer and still look new at the end of the contract.",
      ar: "تحافظ الخزائن التي تحمل علامتنا على حرارتها طوال صيف الخليج وتبدو جديدة حتى نهاية العقد.",
    },
    role: { en: "Trade Marketing Manager", ar: "مدير التسويق التجاري" },
    organisation: { en: "FMCG brand · Middle East", ar: "علامة سلع استهلاكية · الشرق الأوسط" },
  },
  {
    quote: {
      en: "Customisation happened inside series production, so our specification cost us volume pricing, not prototype pricing.",
      ar: "تمّ التخصيص داخل الإنتاج المتسلسل، فكلّفتنا مواصفتنا سعر الكميات لا سعر النماذج الأولية.",
    },
    role: { en: "Procurement Director", ar: "مدير المشتريات" },
    organisation: { en: "Dairy group · Africa", ar: "مجموعة ألبان · أفريقيا" },
  },
];
