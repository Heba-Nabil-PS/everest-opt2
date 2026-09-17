import type {
  CategorySlug,
  Localized,
  Product,
  ProductCategory,
} from "./types";

/* -------------------------------------------------------------------------
 * Shared spec fragments — written once, referenced by every model that uses
 * them, so a wording change never drifts between 24 models.
 * ---------------------------------------------------------------------- */

const lighting = {
  ledVertical: {
    en: "Vertical LED bars, both door pillars",
    ar: "أعمدة إضاءة LED رأسية على جانبَي الباب",
  },
  ledCanopy: {
    en: "LED canopy and full-height side LED",
    ar: "إضاءة LED في الواجهة العلوية وعلى كامل الارتفاع",
  },
  ledInterior: { en: "Interior LED strip", ar: "شريط إضاءة LED داخلي" },
  none: { en: "Not fitted", ar: "غير مزوّدة" },
} satisfies Record<string, Localized>;

const shelving = {
  adjustable4: { en: "4 adjustable wire shelves", ar: "4 رفوف سلكية قابلة للتعديل" },
  adjustable5: { en: "5 adjustable wire shelves", ar: "5 رفوف سلكية قابلة للتعديل" },
  adjustable6: { en: "6 adjustable wire shelves", ar: "6 رفوف سلكية قابلة للتعديل" },
  adjustable8: { en: "8 adjustable wire shelves, 2 columns", ar: "8 رفوف سلكية قابلة للتعديل في عمودين" },
  adjustable10: { en: "10 adjustable wire shelves, 2 columns", ar: "10 رفوف سلكية قابلة للتعديل في عمودين" },
  countertop2: { en: "2 chrome shelves", ar: "رفّان من الكروم" },
  countertop3: { en: "3 chrome shelves", ar: "3 رفوف من الكروم" },
  baskets2: { en: "2 coated storage baskets", ar: "سلّتا تخزين مطليتان" },
  baskets3: { en: "3 coated storage baskets", ar: "3 سلال تخزين مطلية" },
  drawers: { en: "5 pull-out freezer drawers", ar: "5 أدراج تجميد قابلة للسحب" },
  none: { en: "Not applicable", ar: "لا ينطبق" },
} satisfies Record<string, Localized>;

const defrost = {
  auto: { en: "Automatic, controller-timed", ar: "تلقائية بتوقيت وحدة التحكّم" },
  adaptive: { en: "Adaptive, demand-triggered", ar: "تكيّفية تعمل حسب الحاجة" },
  manual: { en: "Manual, with drain plug", ar: "يدوية مع فتحة تصريف" },
  none: { en: "Not required", ar: "غير مطلوبة" },
} satisfies Record<string, Localized>;

const controller = {
  emmd: { en: "EMMD demand-matched digital controller", ar: "وحدة تحكّم رقمية EMMD تعمل وفق الطلب" },
  digital: { en: "Digital controller with lockable set point", ar: "وحدة تحكّم رقمية بنقطة ضبط قابلة للقفل" },
  mechanical: { en: "Mechanical thermostat", ar: "ثرموستات ميكانيكي" },
} satisfies Record<string, Localized>;

/* -------------------------------------------------------------------------
 * Categories — two main ranges, each split into cabinet formats
 * ---------------------------------------------------------------------- */

export const categories: ProductCategory[] = [
  {
    slug: "chillers",
    name: { en: "Chillers", ar: "المبرّدات" },
    shortName: { en: "Chillers", ar: "المبرّدات" },
    tagline: {
      en: "Glass-door, countertop and open display chilling for beverage and FMCG.",
      ar: "تبريد عرض بأبواب زجاجية وللكاونتر ومفتوح للمشروبات والسلع الاستهلاكية.",
    },
    intro: {
      en: "The range beverage brands specify most — from a 60-litre can cooler on the counter to a four-door, 2,000-litre wall of product. Full-height glazing, vertical LED and demand-matched compressor control keep the bottom shelf as cold as the top through a rush.",
      ar: "المجموعة الأكثر اعتماداً لدى علامات المشروبات — من ثلاجة علب بسعة 60 لتراً على الكاونتر إلى جدار عرض بأربعة أبواب وسعة 2,000 لتر. زجاج بكامل الارتفاع، وإضاءة LED رأسية، وتحكّم بالضاغط وفق الطلب، تُبقي الرفّ السفلي بارداً كالعلوي خلال الازدحام.",
    },
    highlights: [
      { en: "60–2,000 L gross capacity", ar: "سعة إجمالية من 60 إلى 2,000 لتر" },
      { en: "Countertop to quad-door and open type", ar: "من الكاونتر إلى أربعة أبواب والنوع المفتوح" },
      { en: "R290 and EMMD control across the range", ar: "غاز R290 وتحكّم EMMD عبر المجموعة" },
    ],
    subcategories: [
      { slug: "can-cooler", name: { en: "Can Cooler", ar: "ثلاجة العلب" } },
      { slug: "countertop", name: { en: "Countertop", ar: "الكاونتر" } },
      { slug: "double-door", name: { en: "Double Door", ar: "بابان" } },
      { slug: "open-type", name: { en: "Open Type", ar: "النوع المفتوح" } },
      { slug: "quad-door", name: { en: "Quad Door", ar: "أربعة أبواب" } },
      { slug: "single-door", name: { en: "Single Door", ar: "باب واحد" } },
      { slug: "triple-door", name: { en: "Triple Door", ar: "ثلاثة أبواب" } },
    ],
    image: "/images/products-chillers.jpg",
    art: "upright",
  },
  {
    slug: "freezers",
    name: { en: "Freezers", ar: "المجمّدات" },
    shortName: { en: "Freezers", ar: "المجمّدات" },
    tagline: {
      en: "Horizontal, vertical, double-door and countertop freezing for retail and foodservice.",
      ar: "تجميد أفقي ورأسي وببابين وللكاونتر لقطاعَي التجزئة وخدمات الطعام.",
    },
    intro: {
      en: "Frozen storage and display built for kitchens and shop floors that treat equipment hard — heavier gaskets, reinforced hinges and defrost cycles timed around service rather than a fixed clock.",
      ar: "تخزين وعرض للمجمّدات مصمّم للمطابخ وصالات البيع التي تُرهق المعدّات — حشوات أثقل ومفصّلات معزّزة ودورات إزالة جليد مضبوطة على أوقات الخدمة لا على ساعة ثابتة.",
    },
    highlights: [
      { en: "100–600 L gross capacity", ar: "سعة إجمالية من 100 إلى 600 لتر" },
      { en: "Down to −24 °C hold temperature", ar: "درجة حفظ تصل إلى −24 درجة مئوية" },
      { en: "Horizontal, vertical and countertop formats", ar: "أشكال أفقية ورأسية وللكاونتر" },
    ],
    subcategories: [
      { slug: "countertop", name: { en: "CounterTop", ar: "الكاونتر" } },
      { slug: "double-door", name: { en: "Double Door", ar: "بابان" } },
      { slug: "horizontal", name: { en: "Horizontal", ar: "أفقي" } },
      { slug: "vertical", name: { en: "Vertical", ar: "رأسي" } },
    ],
    image: "/images/products-freezers.jpg",
    art: "chest",
  },
];

export const categoryBySlug = new Map(categories.map((c) => [c.slug, c]));

/** Subcategory label for a product, resolved against its own main category. */
export function subcategoryOf(product: Pick<Product, "categorySlug" | "subcategory">) {
  return categoryBySlug
    .get(product.categorySlug)
    ?.subcategories.find((sub) => sub.slug === product.subcategory);
}

/* -------------------------------------------------------------------------
 * Models
 * ---------------------------------------------------------------------- */

const models: Omit<Product, "images">[] = [
  /* ------------------------------ Chillers ------------------------------ */
  {
    slug: "evc-300-visi-cooler",
    code: "EVC-300",
    name: "Visi Cooler 300",
    categorySlug: "chillers",
    subcategory: "single-door",
    summary: {
      en: "Single-door 300 L display cooler for tight counters and forecourt outlets.",
      ar: "ثلاجة عرض بباب واحد وسعة 300 لتر للكاونترات الضيّقة ومنافذ المحطات.",
    },
    description: {
      en: "The smallest cabinet in the visi range, sized for outlets where floor space is the binding constraint. Despite the footprint it carries the same EMMD controller and vertical LED system as the 1,500 L unit, so shelf temperature and product visibility do not drop with capacity.",
      ar: "أصغر خزانة في مجموعة العرض، بمقاس يناسب المنافذ التي تكون فيها المساحة هي القيد الحاسم. ورغم صغر المساحة فإنها تحمل وحدة تحكّم EMMD ونظام إضاءة LED الرأسي نفسه الموجود في وحدة 1,500 لتر، فلا تنخفض حرارة الرفّ ولا وضوح المنتج مع انخفاض السعة.",
    },
    features: [
      {
        title: { en: "Fits where a full cooler cannot", ar: "يناسب حيث لا تتّسع ثلاجة كاملة" },
        body: {
          en: "A 600 mm width lets the unit replace a single gondola end without redrawing the aisle.",
          ar: "عرض 600 مم يتيح للوحدة أن تحلّ محلّ نهاية رفّ واحدة دون إعادة رسم الممرّ.",
        },
      },
      {
        title: { en: "Recovers fast after the rush", ar: "يستعيد حرارته سريعاً بعد الازدحام" },
        body: {
          en: "EMMD modulates against real door traffic, so the bottom shelf is back in band within minutes rather than at the end of the next cycle.",
          ar: "تعدّل EMMD التشغيل وفق حركة الباب الفعلية، فيعود الرفّ السفلي إلى نطاقه خلال دقائق بدل انتظار الدورة التالية.",
        },
      },
      {
        title: { en: "Lower running cost than its class", ar: "تكلفة تشغيل أقل من فئتها" },
        body: {
          en: "Class B at 612 kWh per year, measured on a standard duty cycle rather than an idle cabinet.",
          ar: "الفئة B عند 612 كيلوواط ساعة سنوياً، مقيسة على دورة تشغيل قياسية لا على خزانة خاملة.",
        },
      },
    ],
    specs: {
      capacity: 300,
      netCapacity: 276,
      doors: 1,
      dimensions: { width: 600, depth: 610, height: 1840 },
      netWeight: 78,
      energyClass: "B",
      annualConsumption: 612,
      refrigerant: "R290",
      temperatureRange: { min: 1, max: 10 },
      power: "220–240 V / 50 Hz",
      lighting: lighting.ledVertical,
      shelves: shelving.adjustable4,
      defrost: defrost.auto,
      climateClass: "4 (30 °C / 55% RH)",
      controller: controller.emmd,
      noiseLevel: 42,
      warranty: { unit: 12, compressor: 60 },
    },
    tech: ["emmd", "led", "r290", "lock"],
    featured: false,
    art: { form: "upright", doors: 1, shelves: 4, canopy: true, ratio: { width: 0.6, height: 1.84, depth: 0.61 } },
  },
  {
    slug: "evc-400-visi-cooler",
    code: "EVC-400",
    name: "Visi Cooler 400",
    categorySlug: "chillers",
    subcategory: "single-door",
    summary: {
      en: "The volume single-door cooler: 400 L, five shelves, convenience-store footprint.",
      ar: "ثلاجة الباب الواحد الأكثر انتشاراً: 400 لتر وخمسة رفوف بمقاس المتاجر المريحة.",
    },
    description: {
      en: "Our highest-volume single-door model and the default specification for convenience rollouts across the Gulf. Five adjustable shelves take standard bottle and can formats without wasted pitch, and the cabinet is rated for 43 °C ambient in Gulf specification.",
      ar: "أكثر موديلاتنا مبيعاً بباب واحد، وهو المواصفة الافتراضية لعمليات الطرح في المتاجر المريحة عبر الخليج. خمسة رفوف قابلة للتعديل تستوعب أحجام الزجاجات والعلب القياسية دون هدر في المسافات، والخزانة معتمدة عند حرارة 43 درجة مئوية في المواصفة الخليجية.",
    },
    features: [
      {
        title: { en: "Built around real pack formats", ar: "مصمّمة حول أحجام العبوات الفعلية" },
        body: {
          en: "Shelf pitch is set for 330 ml cans and 1.5 L bottles without leaving a dead band above the product.",
          ar: "ضُبطت المسافات بين الرفوف لعلب 330 مل وزجاجات 1.5 لتر دون ترك فراغ ميّت فوق المنتج.",
        },
      },
      {
        title: { en: "Gulf-specification glazing", ar: "زجاج بالمواصفة الخليجية" },
        body: {
          en: "Double-glazed low-E door with perimeter heating prevents condensation at 65% relative humidity.",
          ar: "باب مزدوج الزجاج منخفض الانبعاثية مع تسخين محيطي يمنع التكاثف عند رطوبة نسبية 65%.",
        },
      },
      {
        title: { en: "Serviceable from the front", ar: "قابلة للصيانة من الأمام" },
        body: {
          en: "Condenser and fan are reachable without pulling the cabinet out of the run, which keeps service visits short.",
          ar: "يمكن الوصول إلى المكثّف والمروحة دون سحب الخزانة من مكانها، ما يقصّر زمن زيارة الصيانة.",
        },
      },
    ],
    specs: {
      capacity: 400,
      netCapacity: 371,
      doors: 1,
      dimensions: { width: 620, depth: 650, height: 1980 },
      netWeight: 91,
      energyClass: "A",
      annualConsumption: 684,
      refrigerant: "R290",
      temperatureRange: { min: 1, max: 10 },
      power: "220–240 V / 50 Hz",
      lighting: lighting.ledCanopy,
      shelves: shelving.adjustable5,
      defrost: defrost.adaptive,
      climateClass: "4 (30 °C / 55% RH) · Gulf option 43 °C / 65% RH",
      controller: controller.emmd,
      noiseLevel: 43,
      warranty: { unit: 12, compressor: 60 },
    },
    tech: ["emmd", "led", "r290", "lowE", "lock"],
    featured: true,
    art: { form: "upright", doors: 1, shelves: 5, canopy: true, ratio: { width: 0.62, height: 1.98, depth: 0.65 } },
  },
  {
    slug: "evc-500-visi-cooler",
    code: "EVC-500",
    name: "Visi Cooler 500",
    categorySlug: "chillers",
    subcategory: "single-door",
    summary: {
      en: "500 L single door with six shelves — the widest facing count in its footprint.",
      ar: "500 لتر بباب واحد وستة رفوف — أكبر عدد واجهات ضمن مساحتها.",
    },
    description: {
      en: "A deeper cabinet that adds a sixth shelf and roughly 20% more facings than the 400, without widening the aperture in the aisle. Specified most often by dairy and chilled-food customers who need shelf count rather than single-item volume.",
      ar: "خزانة أعمق تضيف رفّاً سادساً وزيادة تقارب 20% في عدد الواجهات مقارنةً بموديل 400، دون توسيع الفتحة في الممرّ. وهي الأكثر اعتماداً لدى عملاء الألبان والأغذية المبرّدة الذين يحتاجون عدد رفوف لا حجم صنف واحد.",
    },
    features: [
      {
        title: { en: "Six shelves in a single aperture", ar: "ستة رفوف في فتحة واحدة" },
        body: {
          en: "More facings per metre of aisle, which is the metric category managers are actually measured on.",
          ar: "واجهات أكثر لكل متر من الممرّ، وهو المؤشّر الذي يُقاس عليه مديرو الفئات فعلياً.",
        },
      },
      {
        title: { en: "Narrow temperature band", ar: "نطاق حرارة ضيّق" },
        body: {
          en: "Holds ±0.5 °C at the bottom shelf through door cycling, which is what dairy specifications require.",
          ar: "تحافظ على ±0.5 درجة مئوية عند الرفّ السفلي خلال تكرار فتح الباب، وهو ما تتطلّبه مواصفات الألبان.",
        },
      },
      {
        title: { en: "Reinforced shelf loading", ar: "تحميل رفوف معزّز" },
        body: {
          en: "Each shelf carries 45 kg, enough for glass bottles and multipacks without deflection.",
          ar: "يتحمّل كل رفّ 45 كجم، وهو ما يكفي للزجاجات والعبوات المتعدّدة دون انحناء.",
        },
      },
    ],
    specs: {
      capacity: 500,
      netCapacity: 464,
      doors: 1,
      dimensions: { width: 680, depth: 720, height: 2010 },
      netWeight: 104,
      energyClass: "A",
      annualConsumption: 742,
      refrigerant: "R290",
      temperatureRange: { min: 0, max: 8 },
      power: "220–240 V / 50 Hz",
      lighting: lighting.ledCanopy,
      shelves: shelving.adjustable6,
      defrost: defrost.adaptive,
      climateClass: "4 (30 °C / 55% RH) · Gulf option 43 °C / 65% RH",
      controller: controller.emmd,
      noiseLevel: 44,
      warranty: { unit: 12, compressor: 60 },
    },
    tech: ["emmd", "led", "r290", "lowE", "lock", "digital"],
    featured: true,
    art: { form: "upright", doors: 1, shelves: 6, canopy: true, ratio: { width: 0.68, height: 2.01, depth: 0.72 } },
  },
  {
    slug: "evc-650-visi-cooler",
    code: "EVC-650",
    name: "Visi Cooler 650",
    categorySlug: "chillers",
    subcategory: "single-door",
    summary: {
      en: "650 L single door for high-turnover beverage outlets.",
      ar: "650 لتراً بباب واحد لمنافذ المشروبات عالية الحركة.",
    },
    description: {
      en: "Built for outlets that restock twice a day. The evaporator is oversized relative to the cabinet so that a full warm restock is pulled into band without the compressor running flat out for hours.",
      ar: "مصمّمة للمنافذ التي تُعاد تعبئتها مرتين يومياً. المبخّر أكبر نسبياً من الخزانة، بحيث تعود عملية تعبئة كاملة بمنتج دافئ إلى النطاق المطلوب دون أن يعمل الضاغط بأقصى طاقته لساعات.",
    },
    features: [
      {
        title: { en: "Oversized evaporator", ar: "مبخّر بحجم أكبر" },
        body: {
          en: "Sized for restocking load, not for a static cabinet, so pull-down after a delivery is measured in minutes.",
          ar: "مُصمَّم لحمل إعادة التعبئة لا لخزانة ساكنة، فيُقاس خفض الحرارة بعد التوريد بالدقائق.",
        },
      },
      {
        title: { en: "Heavy-duty hinge set", ar: "طقم مفصّلات شديد التحمّل" },
        body: {
          en: "Rated to the equivalent of ten years of high-traffic door cycling on our endurance rigs.",
          ar: "معتمد لما يعادل عشر سنوات من فتح الأبواب كثيف الحركة على منصّات اختبار التحمّل لدينا.",
        },
      },
      {
        title: { en: "Branded canopy as standard", ar: "واجهة علوية بعلامتك التجارية كمعيار" },
        body: {
          en: "Illuminated header sized for a full brand lockup, applied on our own line rather than by a third party.",
          ar: "لافتة علوية مضاءة بمقاس يتّسع لشعار العلامة كاملاً، تُركَّب على خطّنا لا لدى طرف ثالث.",
        },
      },
    ],
    specs: {
      capacity: 650,
      netCapacity: 604,
      doors: 1,
      dimensions: { width: 750, depth: 760, height: 2050 },
      netWeight: 118,
      energyClass: "B",
      annualConsumption: 891,
      refrigerant: "R290",
      temperatureRange: { min: 1, max: 10 },
      power: "220–240 V / 50 Hz",
      lighting: lighting.ledCanopy,
      shelves: shelving.adjustable6,
      defrost: defrost.adaptive,
      climateClass: "4 (30 °C / 55% RH) · Gulf option 43 °C / 65% RH",
      controller: controller.emmd,
      noiseLevel: 45,
      warranty: { unit: 12, compressor: 60 },
    },
    tech: ["emmd", "led", "r290", "lowE", "lock"],
    featured: false,
    art: { form: "upright", doors: 1, shelves: 6, canopy: true, ratio: { width: 0.75, height: 2.05, depth: 0.76 } },
  },
  {
    slug: "evc-800-visi-cooler",
    code: "EVC-800",
    name: "Visi Cooler 800",
    categorySlug: "chillers",
    subcategory: "double-door",
    summary: {
      en: "Double-door 800 L cooler for supermarket chilled aisles.",
      ar: "ثلاجة بابين بسعة 800 لتر لممرّات التبريد في المتاجر الكبرى.",
    },
    description: {
      en: "The first double-door model in the range. Two independently hung doors mean half the cabinet stays closed during service, which is where most of the energy advantage over a single wide door comes from.",
      ar: "أول موديل بابين في المجموعة. بابان مستقلّان يعنيان بقاء نصف الخزانة مغلقاً أثناء الخدمة، ومن هنا تأتي معظم ميزة الطاقة مقارنةً بباب واحد عريض.",
    },
    features: [
      {
        title: { en: "Two doors, half the loss", ar: "بابان، ونصف الفاقد" },
        body: {
          en: "Independent doors keep the unopened half sealed, cutting cold-air spill during restocking and browsing.",
          ar: "البابان المستقلّان يُبقيان النصف غير المفتوح محكماً، ما يقلّل تسرّب الهواء البارد أثناء التعبئة والتصفّح.",
        },
      },
      {
        title: { en: "Two-column shelving", ar: "رفوف بعمودين" },
        body: {
          en: "Eight shelves across two columns, each adjustable independently for mixed pack formats.",
          ar: "ثمانية رفوف عبر عمودين، كل منها قابل للتعديل بشكل مستقل لاستيعاب أحجام عبوات مختلفة.",
        },
      },
      {
        title: { en: "Single compressor circuit", ar: "دائرة ضاغط واحدة" },
        body: {
          en: "One circuit serving both columns, which keeps the service parts list identical to the single-door models.",
          ar: "دائرة واحدة تخدم العمودين، ما يُبقي قائمة قطع الصيانة مطابقة لموديلات الباب الواحد.",
        },
      },
    ],
    specs: {
      capacity: 800,
      netCapacity: 742,
      doors: 2,
      dimensions: { width: 1200, depth: 720, height: 2010 },
      netWeight: 156,
      energyClass: "A",
      annualConsumption: 1024,
      refrigerant: "R290",
      temperatureRange: { min: 0, max: 8 },
      power: "220–240 V / 50 Hz",
      lighting: lighting.ledCanopy,
      shelves: shelving.adjustable8,
      defrost: defrost.adaptive,
      climateClass: "4 (30 °C / 55% RH) · Gulf option 43 °C / 65% RH",
      controller: controller.emmd,
      noiseLevel: 46,
      warranty: { unit: 12, compressor: 60 },
    },
    tech: ["emmd", "led", "r290", "lowE", "lock", "digital"],
    featured: true,
    art: { form: "upright", doors: 2, shelves: 8, canopy: true, ratio: { width: 1.2, height: 2.01, depth: 0.72 } },
  },
  {
    slug: "evc-1000-visi-cooler",
    code: "EVC-1000",
    name: "Visi Cooler 1000",
    categorySlug: "chillers",
    subcategory: "double-door",
    summary: {
      en: "1,000 L double door with a wider aperture for multipack merchandising.",
      ar: "1,000 لتر بابين وفتحة أوسع لعرض العبوات المتعدّدة.",
    },
    description: {
      en: "A wider, deeper double-door cabinet for outlets merchandising multipacks and large-format bottles. Shelf load rating is raised to 60 kg to carry glass cases without deflection.",
      ar: "خزانة بابين أعرض وأعمق للمنافذ التي تعرض العبوات المتعدّدة والزجاجات كبيرة الحجم. رُفعت قدرة تحميل الرفّ إلى 60 كجم لحمل صناديق الزجاج دون انحناء.",
    },
    features: [
      {
        title: { en: "60 kg shelf rating", ar: "قدرة تحميل 60 كجم للرفّ" },
        body: {
          en: "Carries glass multipack cases at full depth without the mid-shelf sag that shortens shelf life.",
          ar: "يحمل صناديق العبوات الزجاجية بكامل العمق دون الانحناء الذي يقصّر عمر الرفّ.",
        },
      },
      {
        title: { en: "Wider aperture", ar: "فتحة أوسع" },
        body: {
          en: "A 1,320 mm opening lets staff restock a full case without lifting it over a door pillar.",
          ar: "فتحة بعرض 1,320 مم تتيح للموظفين تعبئة صندوق كامل دون رفعه فوق عمود الباب.",
        },
      },
      {
        title: { en: "Balanced airflow", ar: "تدفّق هواء متوازن" },
        body: {
          en: "Twin fan assemblies keep both columns within the same half-degree band, verified at final test.",
          ar: "مجموعتا مراوح تُبقيان العمودين ضمن نطاق نصف درجة نفسه، ويجري التحقّق من ذلك في الاختبار النهائي.",
        },
      },
    ],
    specs: {
      capacity: 1000,
      netCapacity: 928,
      doors: 2,
      dimensions: { width: 1320, depth: 780, height: 2050 },
      netWeight: 182,
      energyClass: "B",
      annualConsumption: 1236,
      refrigerant: "R290",
      temperatureRange: { min: 0, max: 8 },
      power: "220–240 V / 50 Hz",
      lighting: lighting.ledCanopy,
      shelves: shelving.adjustable8,
      defrost: defrost.adaptive,
      climateClass: "4 (30 °C / 55% RH) · Gulf option 43 °C / 65% RH",
      controller: controller.emmd,
      noiseLevel: 47,
      warranty: { unit: 12, compressor: 60 },
    },
    tech: ["emmd", "led", "r290", "lowE", "lock", "digital"],
    featured: false,
    art: { form: "upright", doors: 2, shelves: 8, canopy: true, ratio: { width: 1.32, height: 2.05, depth: 0.78 } },
  },
  {
    slug: "evc-1200-visi-cooler",
    code: "EVC-1200",
    name: "Visi Cooler 1200",
    categorySlug: "chillers",
    subcategory: "triple-door",
    summary: {
      en: "1,200 L triple door for hypermarket chilled runs.",
      ar: "1,200 لتر بثلاثة أبواب لممرّات التبريد في الهايبر ماركت.",
    },
    description: {
      en: "Three doors on one chassis, used to build continuous chilled runs without the thermal break of separate cabinets butted together. Ten shelves across two adjustable columns.",
      ar: "ثلاثة أبواب على هيكل واحد، تُستخدم لبناء ممرّات تبريد متّصلة دون الفاصل الحراري الناتج عن رصّ خزائن منفصلة. عشرة رفوف عبر عمودين قابلين للتعديل.",
    },
    features: [
      {
        title: { en: "Continuous chilled run", ar: "ممرّ تبريد متّصل" },
        body: {
          en: "One chassis instead of three cabinets removes the warm seams where units butt together.",
          ar: "هيكل واحد بدل ثلاث خزائن يلغي الفواصل الدافئة عند نقاط الالتقاء.",
        },
      },
      {
        title: { en: "Zoned airflow", ar: "تدفّق هواء مقسّم" },
        body: {
          en: "Each door zone is fed independently so opening the middle door does not warm the ends.",
          ar: "تُغذّى منطقة كل باب بشكل مستقل، فلا يؤدّي فتح الباب الأوسط إلى تدفئة الطرفين.",
        },
      },
      {
        title: { en: "Night blind ready", ar: "جاهزة لستارة ليلية" },
        body: {
          en: "Factory-fitted mounting for a night blind, which cuts out-of-hours consumption by a further 12%.",
          ar: "تثبيت مصنعي لستارة ليلية تخفّض استهلاك ساعات الإغلاق بنسبة 12% إضافية.",
        },
      },
    ],
    specs: {
      capacity: 1200,
      netCapacity: 1114,
      doors: 3,
      dimensions: { width: 1860, depth: 780, height: 2050 },
      netWeight: 244,
      energyClass: "B",
      annualConsumption: 1482,
      refrigerant: "R290",
      temperatureRange: { min: 0, max: 8 },
      power: "220–240 V / 50 Hz",
      lighting: lighting.ledCanopy,
      shelves: shelving.adjustable10,
      defrost: defrost.adaptive,
      climateClass: "4 (30 °C / 55% RH) · Gulf option 43 °C / 65% RH",
      controller: controller.emmd,
      noiseLevel: 48,
      warranty: { unit: 12, compressor: 60 },
    },
    tech: ["emmd", "led", "r290", "lowE", "lock", "digital"],
    featured: false,
    art: { form: "upright", doors: 3, shelves: 10, canopy: true, ratio: { width: 1.86, height: 2.05, depth: 0.78 } },
  },
  {
    slug: "evc-1500-visi-cooler",
    code: "EVC-1500",
    name: "Visi Cooler 1500",
    categorySlug: "chillers",
    subcategory: "triple-door",
    summary: {
      en: "The largest visi cooler: 1,500 L across three doors, built for distribution depots.",
      ar: "أكبر ثلاجة عرض: 1,500 لتر عبر ثلاثة أبواب، مصمّمة لمستودعات التوزيع.",
    },
    description: {
      en: "Specified for depots and cash-and-carry floors where product is held chilled in volume and moved in cases. Heavier castors, a reinforced base and a deeper cabinet than the 1200.",
      ar: "مخصّصة للمستودعات وصالات البيع بالجملة حيث يُحفظ المنتج مبرّداً بكميات كبيرة ويُنقل بالصناديق. عجلات أثقل وقاعدة معزّزة وخزانة أعمق من موديل 1200.",
    },
    features: [
      {
        title: { en: "Case-handling depth", ar: "عمق يناسب الصناديق" },
        body: {
          en: "An 860 mm depth takes two case rows per shelf, which halves restocking time in a depot.",
          ar: "عمق 860 مم يستوعب صفّين من الصناديق لكل رفّ، ما يخفّض زمن إعادة التعبئة في المستودع إلى النصف.",
        },
      },
      {
        title: { en: "Depot-grade castors", ar: "عجلات بمواصفة المستودعات" },
        body: {
          en: "Braked 125 mm castors on a reinforced base so the cabinet can be repositioned loaded.",
          ar: "عجلات بمكابح قياس 125 مم على قاعدة معزّزة، فيمكن تحريك الخزانة وهي محمّلة.",
        },
      },
      {
        title: { en: "Highest capacity in the range", ar: "أعلى سعة في المجموعة" },
        body: {
          en: "1,392 L net in a single chassis, with the same controller and parts list as the 300 L model.",
          ar: "1,392 لتراً صافية في هيكل واحد، بوحدة التحكّم وقائمة القطع نفسها الموجودة في موديل 300 لتر.",
        },
      },
    ],
    specs: {
      capacity: 1500,
      netCapacity: 1392,
      doors: 3,
      dimensions: { width: 1980, depth: 860, height: 2100 },
      netWeight: 287,
      energyClass: "C",
      annualConsumption: 1764,
      refrigerant: "R290",
      temperatureRange: { min: 0, max: 8 },
      power: "220–240 V / 50 Hz",
      lighting: lighting.ledCanopy,
      shelves: shelving.adjustable10,
      defrost: defrost.adaptive,
      climateClass: "4 (30 °C / 55% RH) · Gulf option 43 °C / 65% RH",
      controller: controller.emmd,
      noiseLevel: 49,
      warranty: { unit: 12, compressor: 60 },
    },
    tech: ["emmd", "led", "r290", "lowE", "lock", "castors", "digital"],
    featured: false,
    art: { form: "upright", doors: 3, shelves: 10, canopy: true, ratio: { width: 1.98, height: 2.1, depth: 0.86 } },
  },

  {
    slug: "evc-2000-quad-door-chiller",
    code: "EVC-2000",
    name: "Quad Door Chiller 2000",
    categorySlug: "chillers",
    subcategory: "quad-door",
    summary: {
      en: "Four-door 2,000 L chiller that turns a hypermarket wall into a single branded run.",
      ar: "مبرّد بأربعة أبواب وسعة 2,000 لتر يحوّل جدار الهايبرماركت إلى واجهة عرض واحدة بعلامتك.",
    },
    description: {
      en: "The largest cabinet in the chiller range, built for hypermarkets, wholesale clubs and stadium concourses. Four independently lit door zones share one continuous canopy, so a brand owns the whole wall, while twin EMMD-controlled circuits keep each half in band when one side takes the traffic.",
      ar: "أكبر خزانة في مجموعة المبرّدات، مصمّمة للهايبرماركت ونوادي الجملة وممرّات الملاعب. أربع مناطق أبواب بإضاءة مستقلة تشترك في واجهة علوية واحدة متّصلة، فتمتلك العلامة الجدار كاملاً، بينما تُبقي دائرتان بتحكّم EMMD كل نصف ضمن نطاقه عندما يستقبل أحد الجانبين الحركة.",
    },
    features: [
      {
        title: { en: "One canopy, one brand wall", ar: "واجهة علوية واحدة وجدار علامة واحد" },
        body: {
          en: "A continuous 2.5 m illuminated header carries a single artwork across all four doors.",
          ar: "واجهة علوية مضيئة متّصلة بطول 2.5 متر تحمل تصميماً واحداً عبر الأبواب الأربعة.",
        },
      },
      {
        title: { en: "Twin refrigeration circuits", ar: "دائرتا تبريد مزدوجتان" },
        body: {
          en: "Each half runs its own EMMD circuit, so a busy end never drags the quiet end out of band.",
          ar: "يعمل كل نصف بدائرة EMMD خاصة، فلا يُخرج الطرف المزدحم الطرفَ الهادئ عن نطاقه.",
        },
      },
      {
        title: { en: "Built for the long aisle", ar: "مصمّم للممرّات الطويلة" },
        body: {
          en: "Braked castors and a split-base design let the cabinet be positioned and levelled in a finished store.",
          ar: "عجلات بمكابح وقاعدة مقسّمة تتيح وضع الخزانة وضبط استوائها داخل متجر جاهز.",
        },
      },
    ],
    specs: {
      capacity: 2000,
      netCapacity: 1860,
      doors: 4,
      dimensions: { width: 2500, depth: 860, height: 2100 },
      netWeight: 318,
      energyClass: "B",
      annualConsumption: 3120,
      refrigerant: "R290",
      temperatureRange: { min: 1, max: 10 },
      power: "220–240 V / 50 Hz",
      lighting: lighting.ledCanopy,
      shelves: { en: "20 adjustable wire shelves, 4 columns", ar: "20 رفّاً سلكياً قابلاً للتعديل في 4 أعمدة" },
      defrost: defrost.adaptive,
      climateClass: "4 (30 °C / 55% RH) · Gulf option 43 °C / 65% RH",
      controller: controller.emmd,
      noiseLevel: 47,
      warranty: { unit: 12, compressor: 60 },
    },
    tech: ["emmd", "led", "r290", "lowE", "lock", "castors"],
    featured: false,
    art: { form: "upright", doors: 4, shelves: 16, canopy: true, ratio: { width: 2.5, height: 2.1, depth: 0.86 } },
  },
  {
    slug: "eoc-1250-open-type-chiller",
    code: "EOC-1250",
    name: "Open Type Chiller 1250",
    categorySlug: "chillers",
    subcategory: "open-type",
    summary: {
      en: "1,250 mm open multideck with air curtain for grab-and-go dairy, juice and fresh.",
      ar: "مبرّد عرض مفتوح متعدّد الرفوف بعرض 1,250 مم وستارة هوائية للألبان والعصائر والطازج.",
    },
    description: {
      en: "An open-front multideck for supermarkets and grab-and-go counters where a door would slow the shopper down. A tuned honeycomb air curtain holds 2–5 °C at the front of each shelf, and a pull-down night blind cuts overnight consumption when the store closes.",
      ar: "مبرّد مفتوح الواجهة متعدّد الرفوف للسوبرماركت وكاونترات الشراء السريع حيث يُبطئ الباب المتسوّق. ستارة هوائية دقيقة الضبط تحافظ على 2–5 درجات مئوية في مقدّمة كل رفّ، وستارة ليلية قابلة للسحب تخفّض الاستهلاك عند إغلاق المتجر.",
    },
    features: [
      {
        title: { en: "No door between shopper and product", ar: "لا باب بين المتسوّق والمنتج" },
        body: {
          en: "Open access lifts grab-and-go conversion for dairy, juice and ready meals.",
          ar: "الوصول المفتوح يرفع معدّل الشراء السريع للألبان والعصائر والوجبات الجاهزة.",
        },
      },
      {
        title: { en: "Honeycomb air curtain", ar: "ستارة هوائية بخلايا سداسية" },
        body: {
          en: "A laminar curtain holds product temperature at the shelf edge, not just at the back wall.",
          ar: "ستارة انسيابية تحافظ على حرارة المنتج عند حافة الرفّ لا عند الجدار الخلفي فقط.",
        },
      },
      {
        title: { en: "Night blind as standard", ar: "ستارة ليلية قياسية" },
        body: {
          en: "Closing the blind after hours cuts overnight energy draw by up to 30%.",
          ar: "إغلاق الستارة بعد ساعات العمل يخفّض استهلاك الطاقة ليلاً بما يصل إلى 30%.",
        },
      },
    ],
    specs: {
      capacity: 900,
      netCapacity: 820,
      doors: 0,
      dimensions: { width: 1250, depth: 780, height: 2000 },
      netWeight: 196,
      energyClass: "C",
      annualConsumption: 2890,
      refrigerant: "R290",
      temperatureRange: { min: 2, max: 5 },
      power: "220–240 V / 50 Hz",
      lighting: lighting.ledCanopy,
      shelves: shelving.adjustable5,
      defrost: defrost.auto,
      climateClass: "3 (25 °C / 60% RH)",
      controller: controller.digital,
      noiseLevel: 45,
      warranty: { unit: 12, compressor: 60 },
    },
    tech: ["led", "r290", "digital"],
    featured: false,
    art: { form: "upright", doors: 0, shelves: 5, canopy: true, ratio: { width: 1.25, height: 2.0, depth: 0.78 } },
  },

  /* ------------------ Chillers · Countertop & Can Cooler ---------------- */
  {
    slug: "ect-60-counter-top-cooler",
    code: "ECT-60",
    name: "Counter Top 60",
    categorySlug: "chillers",
    subcategory: "countertop",
    summary: {
      en: "60 L counter-top cooler for tills, kiosks and back-bars.",
      ar: "ثلاجة كاونتر بسعة 60 لتراً للصناديق والأكشاك والبارات الخلفية.",
    },
    description: {
      en: "The smallest cabinet Everest builds, and the one that sits closest to the transaction. A 430 mm width leaves room on a standard till counter, and the R600a circuit runs quietly enough for a hotel back-bar.",
      ar: "أصغر خزانة تصنعها إيفرست، وأقربها إلى نقطة البيع. عرض 430 مم يترك مساحة على كاونتر الصندوق القياسي، ودائرة R600a تعمل بهدوء يكفي للبار الخلفي في الفنادق.",
    },
    features: [
      {
        title: { en: "Fits a till counter", ar: "يناسب كاونتر الصندوق" },
        body: {
          en: "430 mm wide and 480 mm deep, which leaves working space on a standard 600 mm counter.",
          ar: "بعرض 430 مم وعمق 480 مم، ما يترك مساحة عمل على كاونتر قياسي بعرض 600 مم.",
        },
      },
      {
        title: { en: "Quiet enough for hospitality", ar: "هادئة بما يكفي للضيافة" },
        body: {
          en: "38 dB(A) measured at one metre, below the threshold where guests notice a cabinet.",
          ar: "38 ديسيبل مقيسة على بُعد متر واحد، أي دون العتبة التي يلاحظ عندها الضيوف وجود الجهاز.",
        },
      },
      {
        title: { en: "Single-unit purchase", ar: "شراء وحدة واحدة" },
        body: {
          en: "Also listed on regional marketplaces for outlets buying one or two units.",
          ar: "متاحة أيضاً عبر المتاجر الإلكترونية الإقليمية للمنافذ التي تشتري وحدة أو وحدتين.",
        },
      },
    ],
    specs: {
      capacity: 60,
      netCapacity: 54,
      doors: 1,
      dimensions: { width: 430, depth: 480, height: 620 },
      netWeight: 28,
      energyClass: "A",
      annualConsumption: 186,
      refrigerant: "R600a",
      temperatureRange: { min: 2, max: 10 },
      power: "220–240 V / 50 Hz",
      lighting: lighting.ledInterior,
      shelves: shelving.countertop2,
      defrost: defrost.auto,
      climateClass: "4 (30 °C / 55% RH)",
      controller: controller.digital,
      noiseLevel: 38,
      warranty: { unit: 12, compressor: 60 },
    },
    tech: ["led", "digital"],
    featured: false,
    retail: { amazon: "https://www.amazon.ae/s?i=merchant-items&me=A161WSU254ZCT4", noon: "https://www.noon.com" },
    art: { form: "countertop", doors: 1, shelves: 2, canopy: false, ratio: { width: 0.43, height: 0.62, depth: 0.48 } },
  },
  {
    slug: "ect-90-counter-top-cooler",
    code: "ECT-90",
    name: "Counter Top 90",
    categorySlug: "chillers",
    subcategory: "countertop",
    summary: {
      en: "90 L counter-top cooler with three shelves and a lockable door.",
      ar: "ثلاجة كاونتر بسعة 90 لتراً بثلاثة رفوف وباب قابل للقفل.",
    },
    description: {
      en: "A taller counter-top unit that adds a third shelf and a door lock — the combination most often requested for staff areas and unattended kiosks.",
      ar: "وحدة كاونتر أطول تضيف رفّاً ثالثاً وقفلاً للباب — وهو المزيج الأكثر طلباً لمناطق الموظفين والأكشاك غير المأهولة.",
    },
    features: [
      {
        title: { en: "Third shelf", ar: "رفّ ثالث" },
        body: {
          en: "Adds roughly 40% more facings than the ECT-60 in the same counter width.",
          ar: "يضيف نحو 40% من الواجهات مقارنةً بموديل ECT-60 بالعرض نفسه.",
        },
      },
      {
        title: { en: "Lockable door", ar: "باب قابل للقفل" },
        body: {
          en: "Keyed lock fitted as standard for unattended and staff-area placement.",
          ar: "قفل بمفتاح مركّب كمعيار للأماكن غير المأهولة ومناطق الموظفين.",
        },
      },
      {
        title: { en: "Hydrocarbon circuit", ar: "دائرة هيدروكربونية" },
        body: {
          en: "R600a charge with low GWP, serviceable with standard workshop equipment.",
          ar: "شحنة R600a منخفضة الأثر البيئي، قابلة للصيانة بمعدّات الورش القياسية.",
        },
      },
    ],
    specs: {
      capacity: 90,
      netCapacity: 82,
      doors: 1,
      dimensions: { width: 450, depth: 500, height: 860 },
      netWeight: 36,
      energyClass: "A",
      annualConsumption: 224,
      refrigerant: "R600a",
      temperatureRange: { min: 2, max: 10 },
      power: "220–240 V / 50 Hz",
      lighting: lighting.ledInterior,
      shelves: shelving.countertop3,
      defrost: defrost.auto,
      climateClass: "4 (30 °C / 55% RH)",
      controller: controller.digital,
      noiseLevel: 39,
      warranty: { unit: 12, compressor: 60 },
    },
    tech: ["led", "digital", "lock"],
    featured: false,
    retail: { amazon: "https://www.amazon.ae/s?i=merchant-items&me=A161WSU254ZCT4" },
    art: { form: "countertop", doors: 1, shelves: 3, canopy: false, ratio: { width: 0.45, height: 0.86, depth: 0.5 } },
  },
  {
    slug: "ecc-120-can-cooler",
    code: "ECC-120",
    name: "Can Cooler 120",
    categorySlug: "chillers",
    subcategory: "can-cooler",
    summary: {
      en: "120 L can cooler with fast pull-down for impulse chilling.",
      ar: "ثلاجة علب بسعة 120 لتراً مع خفض سريع للحرارة للشراء الاندفاعي.",
    },
    description: {
      en: "Purpose-built for cans. Shelf pitch, airflow and evaporator sizing are all set for 330 ml formats, which is why it pulls a warm restock down faster than a general-purpose cabinet of the same capacity.",
      ar: "مصمّمة خصيصاً للعلب. فمسافات الرفوف وتدفّق الهواء وحجم المبخّر كلها مضبوطة لعبوات 330 مل، ولهذا تخفض حرارة التعبئة الدافئة أسرع من خزانة عامة الغرض بالسعة نفسها.",
    },
    features: [
      {
        title: { en: "Can-specific shelf pitch", ar: "مسافات رفوف مخصّصة للعلب" },
        body: {
          en: "No dead band above the product, so capacity is facings rather than air.",
          ar: "لا فراغ ميّت فوق المنتج، فتكون السعة واجهات لا هواءً.",
        },
      },
      {
        title: { en: "Fast pull-down", ar: "خفض سريع للحرارة" },
        body: {
          en: "A warm restock reaches serving temperature in under 90 minutes at 30 °C ambient.",
          ar: "تصل التعبئة الدافئة إلى درجة حرارة التقديم خلال أقل من 90 دقيقة عند حرارة محيطة 30 درجة مئوية.",
        },
      },
      {
        title: { en: "Glass door with LED", ar: "باب زجاجي بإضاءة LED" },
        body: {
          en: "Product is visible and lit at the point of impulse, which is the whole argument for the format.",
          ar: "المنتج مرئي ومضاء عند نقطة الشراء الاندفاعي، وهو مبرّر هذا الشكل بالكامل.",
        },
      },
    ],
    specs: {
      capacity: 120,
      netCapacity: 110,
      doors: 1,
      dimensions: { width: 500, depth: 540, height: 1000 },
      netWeight: 44,
      energyClass: "A",
      annualConsumption: 268,
      refrigerant: "R290",
      temperatureRange: { min: 1, max: 8 },
      power: "220–240 V / 50 Hz",
      lighting: lighting.ledVertical,
      shelves: shelving.countertop3,
      defrost: defrost.auto,
      climateClass: "4 (30 °C / 55% RH)",
      controller: controller.digital,
      noiseLevel: 40,
      warranty: { unit: 12, compressor: 60 },
    },
    tech: ["led", "r290", "digital"],
    featured: true,
    retail: { amazon: "https://www.amazon.ae/s?i=merchant-items&me=A161WSU254ZCT4", noon: "https://www.noon.com" },
    art: { form: "countertop", doors: 1, shelves: 3, canopy: true, ratio: { width: 0.5, height: 1.0, depth: 0.54 } },
  },
  {
    slug: "ect-150-counter-top-cooler",
    code: "ECT-150",
    name: "Counter Top 150",
    categorySlug: "chillers",
    subcategory: "countertop",
    summary: {
      en: "150 L under-counter cooler sized to standard bar joinery.",
      ar: "ثلاجة أسفل الكاونتر بسعة 150 لتراً بمقاس نجارة البارات القياسية.",
    },
    description: {
      en: "Dimensioned to drop into standard 600 mm bar joinery with a 900 mm worktop height, so it installs into an existing fit-out without cabinetry changes.",
      ar: "بأبعاد تناسب نجارة البارات القياسية بعرض 600 مم وارتفاع سطح عمل 900 مم، فتُركَّب ضمن تجهيز قائم دون تعديل الخزائن.",
    },
    features: [
      {
        title: { en: "Drops into existing joinery", ar: "تُركَّب في النجارة القائمة" },
        body: {
          en: "600 × 600 × 860 mm matches standard bar cabinetry, avoiding a refit.",
          ar: "أبعاد 600 × 600 × 860 مم تطابق خزائن البار القياسية وتجنّبك إعادة التجهيز.",
        },
      },
      {
        title: { en: "Front-breathing", ar: "تهوية أمامية" },
        body: {
          en: "Air is drawn and exhausted at the front, so the unit can be built in on three sides.",
          ar: "يُسحب الهواء ويُطرد من الأمام، فيمكن تثبيت الوحدة محاطة من ثلاث جهات.",
        },
      },
      {
        title: { en: "Reversible door", ar: "باب قابل لعكس اتجاهه" },
        body: {
          en: "Hinge side swaps on site, which matters in a bar where service flow is fixed.",
          ar: "يمكن تبديل جهة المفصّلة في الموقع، وهو أمر مهم في بار ذي مسار خدمة ثابت.",
        },
      },
    ],
    specs: {
      capacity: 150,
      netCapacity: 138,
      doors: 1,
      dimensions: { width: 600, depth: 600, height: 860 },
      netWeight: 52,
      energyClass: "B",
      annualConsumption: 312,
      refrigerant: "R600a",
      temperatureRange: { min: 2, max: 10 },
      power: "220–240 V / 50 Hz",
      lighting: lighting.ledInterior,
      shelves: shelving.countertop2,
      defrost: defrost.auto,
      climateClass: "4 (30 °C / 55% RH)",
      controller: controller.digital,
      noiseLevel: 41,
      warranty: { unit: 12, compressor: 60 },
    },
    tech: ["led", "digital", "lock"],
    featured: false,
    art: { form: "countertop", doors: 1, shelves: 2, canopy: false, ratio: { width: 0.6, height: 0.86, depth: 0.6 } },
  },
  {
    slug: "ecc-200-can-cooler",
    code: "ECC-200",
    name: "Can Cooler 200",
    categorySlug: "chillers",
    subcategory: "can-cooler",
    summary: {
      en: "200 L can cooler with EMMD control for high-traffic forecourts.",
      ar: "ثلاجة علب بسعة 200 لتر بتحكّم EMMD لمحطات الوقود عالية الحركة.",
    },
    description: {
      en: "The largest can-specific cabinet, and the smallest unit in the range to carry the full EMMD controller. Specified for forecourt outlets where the door opens continuously through the evening peak.",
      ar: "أكبر خزانة مخصّصة للعلب، وأصغر وحدة في المجموعة تحمل وحدة تحكّم EMMD الكاملة. وهي معتمدة لمنافذ محطات الوقود حيث يُفتح الباب باستمرار خلال ذروة المساء.",
    },
    features: [
      {
        title: { en: "EMMD in a compact cabinet", ar: "تقنية EMMD في خزانة مدمجة" },
        body: {
          en: "Demand-matched control usually reserved for the visi range, in a 200 L footprint.",
          ar: "تحكّم وفق الطلب يقتصر عادةً على مجموعة العرض، في مساحة 200 لتر.",
        },
      },
      {
        title: { en: "Continuous-duty rated", ar: "معتمدة للتشغيل المتواصل" },
        body: {
          en: "Validated for door cycling at forecourt frequency without exceeding its temperature band.",
          ar: "معتمدة لتكرار فتح الأبواب بوتيرة محطات الوقود دون تجاوز نطاق حرارتها.",
        },
      },
      {
        title: { en: "Heated glazing option", ar: "خيار زجاج مُسخَّن" },
        body: {
          en: "Optional perimeter heating for humid coastal markets where condensation obscures product.",
          ar: "تسخين محيطي اختياري للأسواق الساحلية الرطبة حيث يحجب التكاثف رؤية المنتج.",
        },
      },
    ],
    specs: {
      capacity: 200,
      netCapacity: 184,
      doors: 1,
      dimensions: { width: 560, depth: 620, height: 1240 },
      netWeight: 61,
      energyClass: "A",
      annualConsumption: 358,
      refrigerant: "R290",
      temperatureRange: { min: 1, max: 8 },
      power: "220–240 V / 50 Hz",
      lighting: lighting.ledVertical,
      shelves: shelving.adjustable4,
      defrost: defrost.adaptive,
      climateClass: "4 (30 °C / 55% RH) · Gulf option 43 °C / 65% RH",
      controller: controller.emmd,
      noiseLevel: 42,
      warranty: { unit: 12, compressor: 60 },
    },
    tech: ["emmd", "led", "r290", "lowE", "digital"],
    featured: true,
    art: { form: "countertop", doors: 1, shelves: 4, canopy: true, ratio: { width: 0.56, height: 1.24, depth: 0.62 } },
  },
  {
    slug: "ect-250-counter-top-cooler",
    code: "ECT-250",
    name: "Counter Top 250",
    categorySlug: "chillers",
    subcategory: "countertop",
    summary: {
      en: "250 L twin-door under-counter cooler for service kitchens.",
      ar: "ثلاجة أسفل الكاونتر ببابين وسعة 250 لتراً لمطابخ الخدمة.",
    },
    description: {
      en: "A twin-door under-counter cabinet for prep lines, with a solid stainless front for kitchens where glazing would be a cleaning liability rather than a merchandising asset.",
      ar: "خزانة أسفل الكاونتر ببابين لخطوط التحضير، بواجهة صلبة من الفولاذ المقاوم للصدأ للمطابخ التي يكون فيها الزجاج عبئاً على النظافة لا أداة عرض.",
    },
    features: [
      {
        title: { en: "Solid stainless front", ar: "واجهة صلبة من الفولاذ المقاوم للصدأ" },
        body: {
          en: "304 stainless doors and top, wipe-down and rated for kitchen chemicals.",
          ar: "أبواب وسطح من فولاذ 304، سهلة المسح ومعتمدة لتحمّل مواد تنظيف المطابخ.",
        },
      },
      {
        title: { en: "Prep-line height", ar: "ارتفاع خطّ التحضير" },
        body: {
          en: "860 mm to the worktop, matching standard kitchen benches so it sits in the run.",
          ar: "860 مم حتى سطح العمل، بما يطابق طاولات المطابخ القياسية فتندمج في الخط.",
        },
      },
      {
        title: { en: "Two independent doors", ar: "بابان مستقلّان" },
        body: {
          en: "Half the cabinet stays sealed during service, which matters when the doors open all shift.",
          ar: "يبقى نصف الخزانة محكماً أثناء الخدمة، وهو أمر مهم حين تُفتح الأبواب طوال الوردية.",
        },
      },
    ],
    specs: {
      capacity: 250,
      netCapacity: 230,
      doors: 2,
      dimensions: { width: 1200, depth: 600, height: 860 },
      netWeight: 84,
      energyClass: "B",
      annualConsumption: 402,
      refrigerant: "R290",
      temperatureRange: { min: 0, max: 8 },
      power: "220–240 V / 50 Hz",
      lighting: lighting.ledInterior,
      shelves: shelving.adjustable4,
      defrost: defrost.auto,
      climateClass: "4 (30 °C / 55% RH)",
      controller: controller.digital,
      noiseLevel: 43,
      warranty: { unit: 12, compressor: 60 },
    },
    tech: ["led", "r290", "digital", "lock"],
    featured: false,
    art: { form: "countertop", doors: 2, shelves: 4, canopy: false, ratio: { width: 1.2, height: 0.86, depth: 0.6 } },
  },

  /* ------------------------------ Freezers ----------------------------- */
  {
    slug: "efc-200-chest-freezer",
    code: "EFC-200",
    name: "Chest Freezer 200",
    categorySlug: "freezers",
    subcategory: "horizontal",
    summary: {
      en: "200 L chest freezer with a solid lid and manual defrost.",
      ar: "مجمّد أفقي بسعة 200 لتر بغطاء صلب وإزالة جليد يدوية.",
    },
    description: {
      en: "The entry chest freezer: simple, robust and cheap to run. A solid lid and heavy insulation give the lowest consumption per litre in the range, which is why it is the default for back-of-house frozen storage.",
      ar: "المجمّد الأفقي الأساسي: بسيط ومتين ومنخفض تكلفة التشغيل. الغطاء الصلب والعزل السميك يمنحانه أقل استهلاك لكل لتر في المجموعة، ولهذا هو الخيار الافتراضي لتخزين المجمّدات في المناطق الخلفية.",
    },
    features: [
      {
        title: { en: "Lowest consumption per litre", ar: "أقل استهلاك لكل لتر" },
        body: {
          en: "A solid lid and 60 mm insulation beat any glass-top format on running cost.",
          ar: "الغطاء الصلب والعزل بسماكة 60 مم يتفوّقان على أي شكل بغطاء زجاجي في تكلفة التشغيل.",
        },
      },
      {
        title: { en: "Holds through a power cut", ar: "يحافظ على التجميد أثناء انقطاع الكهرباء" },
        body: {
          en: "Rated to hold below −18 °C for 28 hours unpowered when full — relevant in markets with unreliable supply.",
          ar: "معتمد للحفاظ على أقل من −18 درجة مئوية لمدة 28 ساعة دون كهرباء وهو ممتلئ — وهو أمر مهم في الأسواق ذات التغذية غير المستقرّة.",
        },
      },
      {
        title: { en: "Drain plug and basket", ar: "فتحة تصريف وسلّة" },
        body: {
          en: "Front drain and coated baskets make manual defrost a ten-minute job, not an afternoon.",
          ar: "التصريف الأمامي والسلال المطلية تجعل إزالة الجليد يدوياً مهمة عشر دقائق لا فترة بعد الظهر كاملة.",
        },
      },
    ],
    specs: {
      capacity: 200,
      netCapacity: 190,
      doors: 1,
      dimensions: { width: 940, depth: 620, height: 860 },
      netWeight: 46,
      energyClass: "A",
      annualConsumption: 318,
      refrigerant: "R290",
      temperatureRange: { min: -24, max: -18 },
      power: "220–240 V / 50 Hz",
      lighting: lighting.none,
      shelves: shelving.baskets2,
      defrost: defrost.manual,
      climateClass: "4 (30 °C / 55% RH)",
      controller: controller.mechanical,
      noiseLevel: 40,
      warranty: { unit: 12, compressor: 60 },
    },
    tech: ["r290", "lock"],
    featured: false,
    retail: { noon: "https://www.noon.com" },
    art: { form: "chest", doors: 1, shelves: 2, canopy: false, ratio: { width: 0.94, height: 0.86, depth: 0.62 } },
  },
  {
    slug: "efc-300-chest-freezer",
    code: "EFC-300",
    name: "Chest Freezer 300",
    categorySlug: "freezers",
    subcategory: "horizontal",
    summary: {
      en: "300 L chest freezer with a digital controller and three baskets.",
      ar: "مجمّد أفقي بسعة 300 لتر بوحدة تحكّم رقمية وثلاث سلال.",
    },
    description: {
      en: "The mid chest format, with a digital controller and lockable set point so a kitchen cannot drift the temperature. Three baskets keep stock rotation manageable at depth.",
      ar: "الشكل الأفقي المتوسّط، بوحدة تحكّم رقمية ونقطة ضبط قابلة للقفل فلا يستطيع المطبخ تغيير الحرارة. وثلاث سلال تُبقي تدوير المخزون قابلاً للإدارة رغم العمق.",
    },
    features: [
      {
        title: { en: "Lockable set point", ar: "نقطة ضبط قابلة للقفل" },
        body: {
          en: "The controller can be locked so staff cannot raise the temperature to speed up access.",
          ar: "يمكن قفل وحدة التحكّم فلا يستطيع الموظفون رفع الحرارة لتسهيل الوصول.",
        },
      },
      {
        title: { en: "Three-basket rotation", ar: "تدوير بثلاث سلال" },
        body: {
          en: "Baskets keep first-in-first-out workable in a deep cabinet, which is where frozen stock usually goes wrong.",
          ar: "تُبقي السلال مبدأ الوارد أولاً صادر أولاً عملياً في خزانة عميقة، وهو الموضع الذي يختلّ فيه مخزون المجمّدات عادةً.",
        },
      },
      {
        title: { en: "Counterbalanced lid", ar: "غطاء متوازن" },
        body: {
          en: "Stays open at any angle, so loading does not need a second pair of hands.",
          ar: "يبقى مفتوحاً عند أي زاوية، فلا يحتاج التحميل إلى مساعدة إضافية.",
        },
      },
    ],
    specs: {
      capacity: 300,
      netCapacity: 286,
      doors: 1,
      dimensions: { width: 1120, depth: 680, height: 860 },
      netWeight: 58,
      energyClass: "A",
      annualConsumption: 396,
      refrigerant: "R290",
      temperatureRange: { min: -24, max: -18 },
      power: "220–240 V / 50 Hz",
      lighting: lighting.none,
      shelves: shelving.baskets3,
      defrost: defrost.manual,
      climateClass: "4 (30 °C / 55% RH)",
      controller: controller.digital,
      noiseLevel: 41,
      warranty: { unit: 12, compressor: 60 },
    },
    tech: ["r290", "digital", "lock"],
    featured: true,
    art: { form: "chest", doors: 1, shelves: 3, canopy: false, ratio: { width: 1.12, height: 0.86, depth: 0.68 } },
  },
  {
    slug: "efc-420-chest-freezer",
    code: "EFC-420",
    name: "Chest Freezer 420",
    categorySlug: "freezers",
    subcategory: "horizontal",
    summary: {
      en: "420 L chest freezer for depot and central-kitchen storage.",
      ar: "مجمّد أفقي بسعة 420 لتراً لتخزين المستودعات والمطابخ المركزية.",
    },
    description: {
      en: "The largest chest format, specified for central kitchens and depots holding case quantities. Heavier insulation and a reinforced base take the weight of a full load of frozen cases.",
      ar: "أكبر شكل أفقي، مخصّص للمطابخ المركزية والمستودعات التي تحتفظ بكميات بالصناديق. عزل أسمك وقاعدة معزّزة تتحمّلان وزن حمولة كاملة من الصناديق المجمّدة.",
    },
    features: [
      {
        title: { en: "Case-quantity storage", ar: "تخزين بكميات الصناديق" },
        body: {
          en: "Internal dimensions take standard frozen cases without stacking them on edge.",
          ar: "الأبعاد الداخلية تستوعب الصناديق المجمّدة القياسية دون رصّها على حوافها.",
        },
      },
      {
        title: { en: "80 mm insulation", ar: "عزل بسماكة 80 مم" },
        body: {
          en: "Thicker walls hold temperature longer and cut consumption per litre at this size.",
          ar: "جدران أسمك تحافظ على الحرارة لفترة أطول وتخفّض الاستهلاك لكل لتر عند هذا الحجم.",
        },
      },
      {
        title: { en: "Braked castors", ar: "عجلات بمكابح" },
        body: {
          en: "Moves for cleaning without emptying, which is a real constraint in a central kitchen.",
          ar: "يمكن تحريكه للتنظيف دون إفراغه، وهو قيد فعلي في المطبخ المركزي.",
        },
      },
    ],
    specs: {
      capacity: 420,
      netCapacity: 402,
      doors: 1,
      dimensions: { width: 1420, depth: 720, height: 890 },
      netWeight: 76,
      energyClass: "B",
      annualConsumption: 512,
      refrigerant: "R290",
      temperatureRange: { min: -24, max: -18 },
      power: "220–240 V / 50 Hz",
      lighting: lighting.none,
      shelves: shelving.baskets3,
      defrost: defrost.manual,
      climateClass: "4 (30 °C / 55% RH)",
      controller: controller.digital,
      noiseLevel: 42,
      warranty: { unit: 12, compressor: 60 },
    },
    tech: ["r290", "digital", "lock", "castors"],
    featured: false,
    art: { form: "chest", doors: 1, shelves: 3, canopy: false, ratio: { width: 1.42, height: 0.89, depth: 0.72 } },
  },
  {
    slug: "efu-350-upright-freezer",
    code: "EFU-350",
    name: "Upright Freezer 350",
    categorySlug: "freezers",
    subcategory: "vertical",
    summary: {
      en: "350 L upright freezer with five drawers and no-frost operation.",
      ar: "مجمّد رأسي بسعة 350 لتراً بخمسة أدراج وتشغيل بدون صقيع.",
    },
    description: {
      en: "An upright format for kitchens where floor area is scarcer than headroom. Five pull-out drawers make stock visible and rotatable, and no-frost operation removes the manual defrost cycle entirely.",
      ar: "شكل رأسي للمطابخ التي تكون فيها مساحة الأرض أندر من الارتفاع. خمسة أدراج قابلة للسحب تجعل المخزون مرئياً وقابلاً للتدوير، والتشغيل بدون صقيع يلغي دورة إزالة الجليد اليدوية تماماً.",
    },
    features: [
      {
        title: { en: "Floor area of a chest half its size", ar: "مساحة أرضية بنصف مثيله الأفقي" },
        body: {
          en: "670 mm wide, so 350 L of frozen storage fits a kitchen where a chest would not.",
          ar: "بعرض 670 مم، فتتّسع 350 لتراً من التخزين المجمّد في مطبخ لا يتّسع لمجمّد أفقي.",
        },
      },
      {
        title: { en: "No-frost operation", ar: "تشغيل بدون صقيع" },
        body: {
          en: "Automatic defrost removes the manual cycle, and with it the temperature excursion that comes with it.",
          ar: "إزالة الجليد التلقائية تلغي الدورة اليدوية، ومعها الانحراف الحراري المصاحب لها.",
        },
      },
      {
        title: { en: "Visible stock", ar: "مخزون مرئي" },
        body: {
          en: "Drawers rather than a deep well, so what is at the back is still findable.",
          ar: "أدراج بدلاً من حوض عميق، فيبقى ما في الخلف قابلاً للعثور عليه.",
        },
      },
    ],
    specs: {
      capacity: 350,
      netCapacity: 322,
      doors: 1,
      dimensions: { width: 670, depth: 700, height: 1900 },
      netWeight: 88,
      energyClass: "B",
      annualConsumption: 584,
      refrigerant: "R290",
      temperatureRange: { min: -24, max: -18 },
      power: "220–240 V / 50 Hz",
      lighting: lighting.ledInterior,
      shelves: shelving.drawers,
      defrost: defrost.auto,
      climateClass: "4 (30 °C / 55% RH)",
      controller: controller.digital,
      noiseLevel: 44,
      warranty: { unit: 12, compressor: 60 },
    },
    tech: ["led", "r290", "digital", "lock"],
    featured: true,
    art: { form: "upright", doors: 1, shelves: 5, canopy: false, ratio: { width: 0.67, height: 1.9, depth: 0.7 } },
  },
  {
    slug: "efu-550-upright-freezer",
    code: "EFU-550",
    name: "Upright Freezer 550",
    categorySlug: "freezers",
    subcategory: "double-door",
    summary: {
      en: "550 L twin-door upright freezer for service kitchens.",
      ar: "مجمّد رأسي ببابين وسعة 550 لتراً لمطابخ الخدمة.",
    },
    description: {
      en: "A twin-door upright for high-throughput kitchens. Independently sealed halves mean a service rush does not warm the whole cabinet, and the reinforced hinge set is rated for continuous commercial use.",
      ar: "مجمّد رأسي ببابين للمطابخ عالية الإنتاجية. النصفان المحكمان بشكل مستقل يعنيان أن ذروة الخدمة لا تُدفئ الخزانة كاملة، وطقم المفصّلات المعزّز معتمد للاستخدام التجاري المتواصل.",
    },
    features: [
      {
        title: { en: "Independently sealed halves", ar: "نصفان محكمان بشكل مستقل" },
        body: {
          en: "Opening one door leaves the other half at temperature, which matters during a rush.",
          ar: "فتح باب واحد يُبقي النصف الآخر على حرارته، وهو أمر مهم أثناء الذروة.",
        },
      },
      {
        title: { en: "Commercial hinge set", ar: "طقم مفصّلات تجاري" },
        body: {
          en: "Rated for continuous service-kitchen duty rather than domestic cycling.",
          ar: "معتمد لتشغيل مطابخ الخدمة المتواصل لا للاستخدام المنزلي.",
        },
      },
      {
        title: { en: "Stainless interior", ar: "تجويف داخلي من الفولاذ المقاوم للصدأ" },
        body: {
          en: "Wipe-down interior that survives kitchen cleaning chemicals and food-safety audits.",
          ar: "تجويف سهل المسح يتحمّل مواد تنظيف المطابخ وعمليات تدقيق سلامة الغذاء.",
        },
      },
    ],
    specs: {
      capacity: 550,
      netCapacity: 508,
      doors: 2,
      dimensions: { width: 1340, depth: 720, height: 1980 },
      netWeight: 148,
      energyClass: "C",
      annualConsumption: 892,
      refrigerant: "R290",
      temperatureRange: { min: -24, max: -18 },
      power: "220–240 V / 50 Hz",
      lighting: lighting.ledInterior,
      shelves: shelving.adjustable6,
      defrost: defrost.auto,
      climateClass: "4 (30 °C / 55% RH)",
      controller: controller.digital,
      noiseLevel: 46,
      warranty: { unit: 12, compressor: 60 },
    },
    tech: ["led", "r290", "digital", "lock", "castors"],
    featured: false,
    art: { form: "upright", doors: 2, shelves: 6, canopy: false, ratio: { width: 1.34, height: 1.98, depth: 0.72 } },
  },
  {
    slug: "efg-600-glass-top-freezer",
    code: "EFG-600",
    name: "Glass Top Freezer 600",
    categorySlug: "freezers",
    subcategory: "horizontal",
    summary: {
      en: "600 L glass-top freezer for frozen display in retail aisles.",
      ar: "مجمّد بغطاء زجاجي وسعة 600 لتر لعرض المجمّدات في ممرّات التجزئة.",
    },
    description: {
      en: "A display freezer rather than a storage one. Sliding heated glass lids keep product visible without condensation, and the LED perimeter lifts the pack colours that sell frozen food.",
      ar: "مجمّد عرض لا تخزين. أغطية زجاجية منزلقة مُسخَّنة تُبقي المنتج مرئياً دون تكاثف، وإضاءة LED المحيطة تُبرز ألوان العبوات التي تبيع الأطعمة المجمّدة.",
    },
    features: [
      {
        title: { en: "Heated sliding glass", ar: "زجاج منزلق مُسخَّن" },
        body: {
          en: "Perimeter heating keeps the glass clear at 65% relative humidity, so product stays visible.",
          ar: "التسخين المحيطي يُبقي الزجاج صافياً عند رطوبة نسبية 65%، فيبقى المنتج مرئياً.",
        },
      },
      {
        title: { en: "LED perimeter", ar: "إضاءة LED محيطة" },
        body: {
          en: "Lights the pack face rather than the freezer well, which is what actually drives frozen impulse.",
          ar: "تضيء واجهة العبوة لا حوض المجمّد، وهو ما يحرّك الشراء الاندفاعي للمجمّدات فعلياً.",
        },
      },
      {
        title: { en: "Retail-height well", ar: "حوض بارتفاع التجزئة" },
        body: {
          en: "890 mm to the glass, so product is reachable by a shopper without leaning into the cabinet.",
          ar: "890 مم حتى الزجاج، فيصل المتسوّق إلى المنتج دون أن ينحني داخل الخزانة.",
        },
      },
    ],
    specs: {
      capacity: 600,
      netCapacity: 572,
      doors: 2,
      dimensions: { width: 1860, depth: 720, height: 890 },
      netWeight: 164,
      energyClass: "C",
      annualConsumption: 1042,
      refrigerant: "R290",
      temperatureRange: { min: -22, max: -18 },
      power: "220–240 V / 50 Hz",
      lighting: lighting.ledVertical,
      shelves: shelving.baskets3,
      defrost: defrost.auto,
      climateClass: "4 (30 °C / 55% RH) · Gulf option 43 °C / 65% RH",
      controller: controller.digital,
      noiseLevel: 45,
      warranty: { unit: 12, compressor: 60 },
    },
    tech: ["led", "r290", "digital", "lowE", "castors"],
    featured: true,
    art: { form: "chest", doors: 2, shelves: 3, canopy: false, ratio: { width: 1.86, height: 0.89, depth: 0.72 } },
  },

  {
    slug: "eft-100-countertop-freezer",
    code: "EFT-100",
    name: "Countertop Freezer 100",
    categorySlug: "freezers",
    subcategory: "countertop",
    summary: {
      en: "100 L glass-door countertop freezer for ice cream and frozen impulse at the till.",
      ar: "مجمّد كاونتر بباب زجاجي وسعة 100 لتر للآيس كريم والمجمّدات الاندفاعية عند الصندوق.",
    },
    description: {
      en: "A frozen impulse cabinet sized for the counter. A heated low-E glass door keeps ice cream visible without fogging, and the R290 circuit holds −22 °C in a forecourt shop with the door opening all afternoon.",
      ar: "خزانة مجمّدات اندفاعية بمقاس الكاونتر. باب زجاجي منخفض الانبعاثية ومُسخَّن يُبقي الآيس كريم مرئياً دون ضباب، ودائرة R290 تحافظ على −22 درجة مئوية في متجر محطة يُفتح بابه طوال فترة الظهيرة.",
    },
    features: [
      {
        title: { en: "Frozen impulse at the till", ar: "مجمّدات اندفاعية عند الصندوق" },
        body: {
          en: "A 540 mm footprint puts frozen product where the purchase decision is made.",
          ar: "مساحة 540 مم تضع المنتج المجمّد حيث يُتّخذ قرار الشراء.",
        },
      },
      {
        title: { en: "Fog-free glass", ar: "زجاج بلا ضباب" },
        body: {
          en: "Heated low-E glazing stays clear at 65% relative humidity.",
          ar: "زجاج منخفض الانبعاثية ومُسخَّن يبقى صافياً عند رطوبة نسبية 65%.",
        },
      },
      {
        title: { en: "Deep-frozen hold", ar: "حفظ بتجميد عميق" },
        body: {
          en: "Holds −22 °C, the band ice cream needs to keep its texture.",
          ar: "يحافظ على −22 درجة مئوية، وهو النطاق الذي يحتاجه الآيس كريم للحفاظ على قوامه.",
        },
      },
    ],
    specs: {
      capacity: 100,
      netCapacity: 88,
      doors: 1,
      dimensions: { width: 540, depth: 560, height: 900 },
      netWeight: 46,
      energyClass: "B",
      annualConsumption: 438,
      refrigerant: "R290",
      temperatureRange: { min: -22, max: -18 },
      power: "220–240 V / 50 Hz",
      lighting: lighting.ledInterior,
      shelves: shelving.countertop3,
      defrost: defrost.manual,
      climateClass: "4 (30 °C / 55% RH)",
      controller: controller.digital,
      noiseLevel: 41,
      warranty: { unit: 12, compressor: 60 },
    },
    tech: ["led", "r290", "lowE", "digital"],
    featured: false,
    art: { form: "countertop", doors: 1, shelves: 3, canopy: false, ratio: { width: 0.54, height: 0.9, depth: 0.56 } },
  },
];

/* -------------------------------------------------------------------------
 * Photography — placeholder mapping of the Everest model shots onto the
 * catalogue. First file is the card and gallery lead; the rest are variants
 * of the same cabinet family. Files live in /public/images/products.
 * ---------------------------------------------------------------------- */

const photos: Record<string, string[]> = {
  "evc-300-visi-cooler": ["ev09sd", "ev09-sd-slim", "ev09-sd-exd-flled", "ev09ic", "ev12sd", "ev12sd-slim", "ev12sd-slim-copy"],
  "evc-400-visi-cooler": ["ev14sd", "ev12sd-f2020", "ev-12-sd-exd-flled", "ev-12-sd-exd-flled-slim", "ev15sd", "ev15sd-exd", "ev15sd-f2020", "ev15ic", "ev-375-sd", "ev-375-exd-flg"],
  "evc-500-visi-cooler": ["ev18sd", "ev18sd-exd", "ev18sd-f2020", "ev-18-sd-exd", "ev-18-sd-exd-flled", "ev20sd", "ev20sd-f2020", "ev20sd-frameless", "ev400sd", "ev-400-max", "ev-500-sd-exd-flg", "ev-500-sd-exd-max", "ev500"],
  "evc-650-visi-cooler": ["ev24sd", "ev24sd-exd", "ev24sd-exd-alt", "ev24sd-f2020", "ev24ic", "ev25ic", "ev28sd", "ev28-sd-exd", "ev28sd-f2020", "ev-560", "ev-560-exd-fl-led", "ev5-560-exd-flg", "ev-600", "ev-600-exd-max"],
  "evc-800-visi-cooler": ["ev32dds", "ev32ddswg", "ev32ddswg-slim", "ev33ddswg", "ev33ddswg-exd", "ev37dds"],
  "evc-1000-visi-cooler": ["ev42dds", "ev37ddswg", "ev37ddswg-f2020", "ev37ddswg-frameless", "ev42ddswg", "ev42ic", "ev52dds"],
  "evc-1200-visi-cooler": ["ev72tds"],
  "evc-1500-visi-cooler": ["ev74tru", "ev37tru"],
  "evc-2000-quad-door-chiller": ["ev84qds"],
  "eoc-1250-open-type-chiller": ["ev2400ofc", "ev1550", "ev980", "ev250-ofc", "ev300ofc", "ev320ofc", "ev350-ofc"],
  /* ev06-sd dropped: the source file has a transparency checkerboard baked
     into the pixels, so it cannot be cut out cleanly. */
  "ect-60-counter-top-cooler": ["ev1b"],
  "ect-90-counter-top-cooler": ["ev2c", "ev1c", "ev123"],
  "ecc-120-can-cooler": ["ev1r"],
  "ect-150-counter-top-cooler": ["ev02sd"],
  "ecc-200-can-cooler": ["ev2a"],
  "ect-250-counter-top-cooler": ["ev14qds"],
  "efc-200-chest-freezer": ["ev100ic", "ev100icf"],
  "efc-300-chest-freezer": ["ev240ic", "ev250icf"],
  "efc-420-chest-freezer": ["ev350icf", "ev360ic", "ev430ic"],
  "efu-350-upright-freezer": ["ev700flg", "ev700-super-max", "ev700-exd-flg-fl-led", "ev-700-sd-fl-led"],
  "efu-550-upright-freezer": ["ev42ddsmax", "ev42ddswgmax", "ev42ddswg-exd"],
  "efg-600-glass-top-freezer": ["ev700ic", "ev500ic"],
  "eft-100-countertop-freezer": ["ev02ic"],
};

export const products: Product[] = models.map((model) => ({
  ...model,
  images: (photos[model.slug] ?? []).map((name) => `/images/products/${name}.webp`),
}));

/* -------------------------------------------------------------------------
 * Lookups
 * ---------------------------------------------------------------------- */

export const productBySlug = new Map(products.map((p) => [p.slug, p]));

export function productsByCategory(slug: CategorySlug) {
  return products.filter((p) => p.categorySlug === slug);
}

export function featuredProducts(limit = 4) {
  return products.filter((p) => p.featured).slice(0, limit);
}

/** Same-category models, excluding the current one. */
export function relatedProducts(product: Product, limit = 3) {
  return products
    .filter((p) => p.categorySlug === product.categorySlug && p.slug !== product.slug)
    .sort(
      (a, b) =>
        /* Same format first, then nearest capacity. */
        Number(b.subcategory === product.subcategory) - Number(a.subcategory === product.subcategory) ||
        Math.abs(a.specs.capacity - product.specs.capacity) -
          Math.abs(b.specs.capacity - product.specs.capacity),
    )
    .slice(0, limit);
}

/** The model after this one in catalogue order, wrapping to the first — the product page's closing link. */
export function nextProduct(product: Product) {
  const index = products.findIndex((p) => p.slug === product.slug);
  return products[(index + 1) % products.length];
}

/** Lowest annual consumption first — used by the sustainability page. */
export function mostEfficientProducts(limit = 4) {
  return [...products]
    .sort(
      (a, b) =>
        a.specs.annualConsumption / a.specs.capacity -
        b.specs.annualConsumption / b.specs.capacity,
    )
    .slice(0, limit);
}
