import type { Localized } from "./types";

/* -------------------------------------------------------------------------
 * PLACEHOLDER CONTENT — names, bios and portraits below are stand-ins so the
 * layouts can be reviewed. Replace every entry with Everest-supplied names,
 * approved photography and signed-off bios before launch. Current photos are
 * Pexels stock (free commercial licence) and do not depict Everest staff.
 * ---------------------------------------------------------------------- */

export interface Person {
  id: string;
  name: Localized;
  role: Localized;
  bio: Localized;
  /** Portrait path. Leave unset for a named person until their own approved photo is supplied. */
  photo?: string;
}

export const directors: Person[] = [
  {
    id: "director-chairman",
    name: { en: "Mr. Haytham Duwaji", ar: "السيد هيثم دويجي" },
    role: { en: "Founder & Chairman of the Board", ar: "المؤسس ورئيس مجلس الإدارة" },
    bio: {
      en: "Founded Everest Industrial Group in 1981 and has led its growth from a single Sharjah plant into a manufacturer with factories across Asia, the Middle East and Africa, supplying 86 countries.",
      ar: "أسّس مجموعة إيفرست الصناعية عام 1981 وقاد نموّها من مصنع واحد في الشارقة إلى شركة تصنيع تمتلك مصانع عبر آسيا والشرق الأوسط وأفريقيا وتورّد إلى 86 دولة.",
    },
    /* Add Mr. Duwaji's approved portrait here, e.g. "/images/leadership/haytham-duwaji.jpg". */
  },
  {
    id: "director-md",
    name: { en: "Name to be confirmed", ar: "الاسم قيد التأكيد" },
    role: { en: "Managing Director", ar: "المدير العام" },
    bio: {
      en: "Leads group strategy, key beverage partnerships including Varun Beverages, and market development across the group's factories and 86 supplied countries.",
      ar: "يقود استراتيجية المجموعة والشراكات الرئيسية مع شركات المشروبات ومنها فارون للمشروبات، وتطوير الأسواق عبر مصانع المجموعة والدول الـ86 التي تورّد إليها.",
    },
    photo: "/images/director-3.jpg",
  },
  {
    id: "director-operations",
    name: { en: "Name to be confirmed", ar: "الاسم قيد التأكيد" },
    role: { en: "Director of Operations", ar: "مدير العمليات" },
    bio: {
      en: "Runs manufacturing across the group's plants, capacity planning for 400,000+ units a year and the supply chain behind every national rollout.",
      ar: "يدير التصنيع عبر مصانع المجموعة، وتخطيط طاقة إنتاجية تتجاوز 400,000 وحدة سنوياً، وسلسلة التوريد وراء كل عملية طرح وطنية.",
    },
    photo: "/images/director-1.jpg",
  },
  {
    id: "director-cfo",
    name: { en: "Name to be confirmed", ar: "الاسم قيد التأكيد" },
    role: { en: "Chief Financial Officer", ar: "الرئيسة المالية" },
    bio: {
      en: "Oversees group finance, investment in new capacity such as the Egypt and India mega plants, and governance across joint ventures.",
      ar: "تشرف على مالية المجموعة والاستثمار في الطاقات الجديدة مثل المصنعين الضخمين في مصر والهند، والحوكمة عبر المشاريع المشتركة.",
    },
    photo: "/images/director-4.jpg",
  },
];

export const people: Person[] = [
  {
    id: "people-line-lead",
    name: { en: "Team Member", ar: "عضو الفريق" },
    role: { en: "Production Line Lead", ar: "قائد خط إنتاج" },
    bio: {
      en: "“I started on foaming and now run final assembly. Every cabinet on my line is one I would put my name to.”",
      ar: "«بدأت في قسم الحقن وأدير اليوم التجميع النهائي. كل خزانة على خطّي أضع اسمي عليها.»",
    },
    photo: "/images/team-6.jpg",
  },
  {
    id: "people-quality",
    name: { en: "Team Member", ar: "عضوة الفريق" },
    role: { en: "Quality Engineer", ar: "مهندسة جودة" },
    bio: {
      en: "“The pull-down test is the last thing a unit does here. If it isn’t in band, it doesn’t ship.”",
      ar: "«اختبار خفض الحرارة هو آخر ما تمرّ به الوحدة هنا. إن لم تكن ضمن النطاق، فلن تُشحن.»",
    },
    photo: "/images/team-2.jpg",
  },
  {
    id: "people-design",
    name: { en: "Team Member", ar: "عضوة الفريق" },
    role: { en: "Design Engineer, R&D", ar: "مهندسة تصميم، البحث والتطوير" },
    bio: {
      en: "“We cut real prototypes on production tooling, so what passes the chamber is what the customer gets.”",
      ar: "«نصنع نماذج أولية حقيقية على أدوات الإنتاج، فما يجتاز الغرفة المناخية هو ما يستلمه العميل.»",
    },
    photo: "/images/team-3.jpg",
  },
  {
    id: "people-technician",
    name: { en: "Team Member", ar: "عضو الفريق" },
    role: { en: "Refrigeration Technician", ar: "فنّي تبريد" },
    bio: {
      en: "“Certified in-house, eleven years on the brazing line. Every circuit gets a nitrogen test.”",
      ar: "«حاصل على شهادة داخلية، أحد عشر عاماً على خط اللحام. كل دائرة تخضع لاختبار النيتروجين.»",
    },
    photo: "/images/team-1.jpg",
  },
  {
    id: "people-accounts",
    name: { en: "Team Member", ar: "عضوة الفريق" },
    role: { en: "Key Account Manager, MEA", ar: "مديرة حسابات رئيسية، الشرق الأوسط وأفريقيا" },
    bio: {
      en: "“A rollout is 2,000 outlets and one specification. My job is to make sure both stay true.”",
      ar: "«عملية الطرح تعني 2,000 منفذ ومواصفة واحدة. مهمّتي أن يبقى الاثنان صحيحين.»",
    },
    photo: "/images/team-5.jpg",
  },
  {
    id: "people-service",
    name: { en: "Team Member", ar: "عضوة الفريق" },
    role: { en: "Service Coordinator", ar: "منسّقة الخدمة" },
    bio: {
      en: "“When a unit goes down in a flagship store, the clock starts with my phone call.”",
      ar: "«عندما تتعطّل وحدة في متجر رئيسي، يبدأ العدّ مع مكالمتي.»",
    },
    photo: "/images/team-4.jpg",
  },
];

/* -------------------------------------------------------------------------
 * Media gallery — factories, installations and product showcases
 * ---------------------------------------------------------------------- */

export type GalleryKind = "factory" | "installation" | "product";

export interface GalleryItem {
  id: string;
  kind: GalleryKind;
  src: string;
  title: Localized;
  /** Present on video items: the clip plays in the lightbox. */
  video?: string;
}

export const gallery: GalleryItem[] = [
  {
    id: "video-line",
    kind: "factory",
    src: "/images/gallery-robotics.jpg",
    video: "/images/about-video.mp4",
    title: { en: "Automated production line", ar: "خط الإنتاج الآلي" },
  },
  { id: "hall", kind: "factory", src: "/images/hero-factory.jpg", title: { en: "Sharjah production hall", ar: "صالة الإنتاج في الشارقة" } },
  { id: "retail", kind: "installation", src: "/images/gallery-retail.jpg", title: { en: "Supermarket chiller installation", ar: "تركيب مبرّدات في سوبرماركت" } },
  { id: "chillers", kind: "product", src: "/images/products-chillers.jpg", title: { en: "Glass-door beverage chiller", ar: "مبرّد مشروبات بباب زجاجي" } },
  { id: "welding", kind: "factory", src: "/images/gallery-welding.jpg", title: { en: "Cabinet fabrication and welding", ar: "تصنيع الهياكل واللحام" } },
  { id: "cafe", kind: "installation", src: "/images/gallery-cafe.jpg", title: { en: "Café counter display", ar: "عرض على كاونتر مقهى" } },
  { id: "freezers", kind: "product", src: "/images/products-freezers.jpg", title: { en: "Retail freezer run", ar: "صفّ مجمّدات للتجزئة" } },
  { id: "assembly", kind: "factory", src: "/images/gallery-assembly.jpg", title: { en: "Component assembly", ar: "تجميع المكوّنات" } },
  { id: "store", kind: "installation", src: "/images/leadband-store.jpg", title: { en: "Grab-and-go counter chiller", ar: "مبرّد كاونتر للشراء السريع" } },
  { id: "aisle", kind: "product", src: "/images/products-hero.jpg", title: { en: "Chiller wall showcase", ar: "واجهة عرض المبرّدات" } },
  { id: "warehouse", kind: "factory", src: "/images/gallery-warehouse.jpg", title: { en: "Finished-goods warehouse", ar: "مستودع المنتجات الجاهزة" } },
  { id: "plant", kind: "factory", src: "/images/about-factory.jpg", title: { en: "Plant exterior", ar: "المبنى الخارجي للمصنع" } },
];
