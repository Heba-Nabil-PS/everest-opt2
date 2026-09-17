import type { NewsArticle } from "./types";

export const news: NewsArticle[] = [
  {
    slug: "varun-beverages-partnership",
    image: "/images/news/news-india-srilanka.jpg",
    date: "2025-05-19",
    topic: "market",
    readMinutes: 3,
    featured: true,
    title: {
      en: "Varun Beverages takes a 50% stake in Everest Industrial Lanka",
      ar: "فارون للمشروبات تستحوذ على حصة 50% في إيفرست الصناعية لانكا",
    },
    summary: {
      en: "One of PepsiCo's largest bottlers worldwide partners with Everest, alongside a mega factory partnership in India.",
      ar: "إحدى أكبر شركات تعبئة بيبسيكو في العالم تدخل في شراكة مع إيفرست، إلى جانب شراكة المصنع الضخم في الهند.",
    },
    body: {
      en: [
        "Varun Beverages Limited (VBL), an Indian multinational and one of the largest bottlers of PepsiCo beverages in the world outside the United States, is acquiring a 50% stake in Everest Industrial Lanka.",
        "The partnership places Everest cold-merchandising manufacturing directly inside one of the world's largest beverage supply chains, and extends to a mega factory partnership in India serving South Asia's fastest-growing beverage market.",
        "It forms part of a wider expansion of the Everest manufacturing footprint, which now spans the UAE, Egypt, Saudi Arabia, Sri Lanka and India, with an Egypt mega plant being expanded to more than 1,000 units a day and plans to re-operate the Damascus plant in Syria.",
        "The transaction was reported by The Economic Times (India).",
      ],
      ar: [
        "تستحوذ شركة فارون للمشروبات المحدودة (VBL)، الشركة الهندية متعددة الجنسيات وإحدى أكبر شركات تعبئة مشروبات بيبسيكو في العالم خارج الولايات المتحدة، على حصة 50% في إيفرست الصناعية لانكا.",
        "تضع هذه الشراكة تصنيع معدّات العرض المبرّد من إيفرست مباشرةً داخل إحدى أكبر سلاسل توريد المشروبات في العالم، وتمتدّ إلى شراكة لإنشاء مصنع ضخم في الهند يخدم أسرع أسواق المشروبات نمواً في جنوب آسيا.",
        "وتأتي ضمن توسّع أوسع للبصمة التصنيعية لإيفرست التي تشمل اليوم الإمارات ومصر والسعودية وسريلانكا والهند، مع توسعة المصنع الضخم في مصر لإنتاج أكثر من 1,000 وحدة يومياً، وخطط لإعادة تشغيل مصنع دمشق في سوريا.",
        "وقد نشرت صحيفة ذي إيكونوميك تايمز (الهند) خبر الصفقة.",
      ],
    },
  },
  {
    slug: "emmd-field-results-2026",
    image: "/images/news/news-emmd-field.jpg",
    date: "2026-07-02",
    topic: "product",
    readMinutes: 4,
    featured: true,
    title: {
      en: "EMMD field data: 18% average energy reduction across 1,100 units",
      ar: "بيانات EMMD الميدانية: انخفاض متوسّط بنسبة 18% في الطاقة عبر 1,100 وحدة",
    },
    summary: {
      en: "A convenience-chain retrofit programme has produced the first large-scale field measurement of EMMD control against the fleet it replaced.",
      ar: "أنتج برنامج تحديث لسلسلة متاجر مريحة أول قياس ميداني واسع النطاق لتقنية EMMD مقارنةً بالأسطول الذي حلّت محلّه.",
    },
    body: {
      en: [
        "A retrofit programme covering 1,100 units across a regional convenience chain has produced the first large-scale field measurement of EMMD demand-matched control against the outgoing fleet.",
        "Metered over eleven months, the replacement units returned an 18% average reduction in energy consumption. Outlets with the highest door traffic returned the largest savings, which is consistent with our laboratory work: EMMD earns most of its advantage during recovery after a door opening, not at idle.",
        "Everest publishes a per-model annual consumption figure measured over a standard duty cycle rather than on a static cabinet, so customers can compare published figures against their own metered results.",
        "The full methodology is included in the sustainability overview available in the resources library.",
      ],
      ar: [
        "أنتج برنامج تحديث شمل 1,100 وحدة في سلسلة متاجر مريحة إقليمية أول قياس ميداني واسع النطاق لتقنية EMMD مقارنةً بالأسطول السابق.",
        "وعلى مدى أحد عشر شهراً من القياس، حقّقت الوحدات البديلة انخفاضاً متوسّطاً بنسبة 18% في استهلاك الطاقة. وسجّلت المنافذ الأكثر حركة في الأبواب أكبر قدر من التوفير، وهو ما يتّسق مع نتائج مختبراتنا: تحقّق EMMD معظم ميزتها أثناء استعادة الحرارة بعد فتح الباب لا في حالة السكون.",
        "وتنشر إيفرست رقم استهلاك سنوي لكل موديل مقيساً على دورة تشغيل قياسية لا على خزانة ساكنة، ليتمكّن العملاء من مقارنة الأرقام المنشورة بنتائج قياساتهم.",
        "والمنهجية الكاملة مُدرَجة في تقرير الاستدامة المتاح في مكتبة المصادر.",
      ],
    },
  },
  {
    slug: "iso-45001-recertification-2026",
    image: "/images/news/news-iso-45001.jpg",
    date: "2026-05-21",
    topic: "certification",
    readMinutes: 2,
    title: {
      en: "ISO 45001 recertified with zero major non-conformities",
      ar: "إعادة اعتماد ISO 45001 دون أي حالة عدم مطابقة رئيسية",
    },
    summary: {
      en: "The Sharjah site has been recertified to ISO 45001 following a full surveillance audit of all production lines.",
      ar: "أُعيد اعتماد موقع الشارقة وفق ISO 45001 بعد تدقيق رقابي كامل شمل جميع خطوط الإنتاج.",
    },
    body: {
      en: [
        "Everest Industrial has been recertified to ISO 45001 for occupational health and safety management, following a full surveillance audit covering all four production lines, the foaming plant and the test facility.",
        "The audit closed with zero major non-conformities and two minor observations, both related to documentation rather than practice, and both closed within the reporting period.",
        "Current certificates for ISO 9001, ISO 14001 and ISO 45001 are available in full from the certifications library.",
      ],
      ar: [
        "أُعيد اعتماد إيفرست الصناعية وفق ISO 45001 لإدارة الصحة والسلامة المهنية، بعد تدقيق رقابي كامل شمل خطوط الإنتاج الأربعة ومصنع الحقن ومنشأة الاختبار.",
        "وأُغلق التدقيق دون أي حالة عدم مطابقة رئيسية، مع ملاحظتين طفيفتين تتعلّقان بالتوثيق لا بالممارسة، وأُغلقت كلتاهما خلال فترة التقرير.",
        "والشهادات السارية لمعايير ISO 9001 وISO 14001 وISO 45001 متاحة كاملة في مكتبة الشهادات.",
      ],
    },
  },
  {
    slug: "r290-range-extension",
    image: "/images/news/news-r290.jpg",
    date: "2026-04-09",
    topic: "sustainability",
    readMinutes: 3,
    title: {
      en: "R290 platform extended across the counter-top range",
      ar: "توسيع منصّة R290 عبر مجموعة ثلاجات الكاونتر",
    },
    summary: {
      en: "Hydrocarbon refrigerant now covers both the visi and counter-top ranges in series production, cutting refrigerant GWP by more than 99% against R404A.",
      ar: "يغطّي غاز التبريد الهيدروكربوني الآن مجموعتي العرض والكاونتر في الإنتاج المتسلسل، بخفض أثر الاحترار بأكثر من 99% مقارنةً بـ R404A.",
    },
    body: {
      en: [
        "R290 hydrocarbon refrigerant is now in series production across the counter-top and can cooler range, joining the visi coolers where it has been standard since 2023.",
        "Measured against an R404A charge, the switch reduces refrigerant global warming potential by more than 99%. Charge sizes have been reduced in parallel to keep every model inside the safety thresholds for hydrocarbon systems in public-facing installations.",
        "Service procedures and workshop tooling for hydrocarbon circuits are covered in the updated technician certification, which is being delivered to distributor service teams through the year.",
      ],
      ar: [
        "دخل غاز R290 الهيدروكربوني الإنتاج المتسلسل عبر مجموعة ثلاجات الكاونتر والعلب، منضمّاً إلى ثلاجات العرض حيث أصبح معياراً منذ عام 2023.",
        "ومقارنةً بشحنة R404A، يخفّض هذا التحوّل إمكانية الاحترار العالمي لغاز التبريد بأكثر من 99%. وقد خُفّضت كميات الشحن بالتوازي لإبقاء كل موديل ضمن عتبات السلامة لأنظمة الهيدروكربون في التركيبات العامة.",
        "وتغطّي شهادة الفنيين المحدَّثة إجراءات الصيانة وأدوات الورش للدوائر الهيدروكربونية، ويجري تقديمها لفرق خدمة الموزّعين خلال العام.",
      ],
    },
  },
  {
    slug: "evc-800-launch",
    image: "/images/news/news-evc-800.jpg",
    date: "2026-02-26",
    topic: "product",
    readMinutes: 2,
    title: {
      en: "EVC-800 double-door cooler enters production",
      ar: "دخول ثلاجة EVC-800 ذات البابين مرحلة الإنتاج",
    },
    summary: {
      en: "An 800-litre twin-door cabinet closes the gap between the single-door range and the hypermarket triple-door models.",
      ar: "خزانة ببابين وسعة 800 لتر تسدّ الفجوة بين مجموعة الباب الواحد وموديلات الهايبر ماركت بثلاثة أبواب.",
    },
    body: {
      en: [
        "The EVC-800 has entered series production, adding an 800-litre twin-door cabinet between the single-door models and the triple-door hypermarket range.",
        "Two independently hung doors keep the unopened half of the cabinet sealed during service, which is where most of the format's energy advantage over a single wide door comes from. The unit carries the same EMMD controller, the same service parts list and the same warranty terms as the rest of the visi range.",
        "First deliveries are scheduled against supermarket chilled-aisle programmes in the UAE and KSA.",
      ],
      ar: [
        "دخل موديل EVC-800 الإنتاج المتسلسل، مضيفاً خزانة ببابين وسعة 800 لتر بين موديلات الباب الواحد ومجموعة الهايبر ماركت بثلاثة أبواب.",
        "ويُبقي البابان المستقلّان النصف غير المفتوح من الخزانة محكماً أثناء الخدمة، ومن هنا تأتي معظم ميزة هذا الشكل في الطاقة مقارنةً بباب واحد عريض. وتحمل الوحدة وحدة تحكّم EMMD نفسها وقائمة قطع الصيانة نفسها وشروط الضمان نفسها المطبّقة على بقية مجموعة العرض.",
        "وجُدولت التسليمات الأولى ضمن برامج ممرّات التبريد في المتاجر الكبرى بالإمارات والسعودية.",
      ],
    },
  },
  {
    slug: "baseline-year-published",
    image: "/images/news/news-baseline.jpg",
    date: "2026-01-15",
    topic: "sustainability",
    readMinutes: 3,
    title: {
      en: "2026 emissions baseline published and externally reviewed",
      ar: "نشر خطّ أساس الانبعاثات لعام 2026 ومراجعته خارجياً",
    },
    summary: {
      en: "Scope 1 and 2 emissions have been measured and externally reviewed, setting the baseline for the 45% reduction commitment by 2030.",
      ar: "قياس انبعاثات النطاقين الأول والثاني ومراجعتها خارجياً، لتحديد خطّ الأساس لالتزام خفض 45% بحلول 2030.",
    },
    body: {
      en: [
        "Everest has published its 2026 emissions baseline, covering Scope 1 and Scope 2 emissions across the Sharjah site, with Scope 3 categories mapped and prioritised for measurement.",
        "The baseline has been externally reviewed and is the reference point for our commitment to a 45% absolute reduction by 2030 and Net Zero across the value chain by 2050.",
        "Publishing a dated, audited baseline matters because supplier-ESG questionnaires increasingly require a verifiable reference year rather than an intensity ratio. Customers can cite these figures directly in their own reporting.",
        "Methodology, boundaries and assumptions are set out in the sustainability overview.",
      ],
      ar: [
        "نشرت إيفرست خطّ أساس انبعاثاتها لعام 2026، شاملاً انبعاثات النطاقين الأول والثاني في موقع الشارقة، مع حصر فئات النطاق الثالث وترتيب أولوياتها للقياس.",
        "وقد رُوجع خطّ الأساس خارجياً، وهو المرجع لالتزامنا بخفض مطلق نسبته 45% بحلول 2030 والحياد الكربوني عبر سلسلة القيمة بحلول 2050.",
        "ولنشر خطّ أساس مؤرّخ ومدقَّق أهمية، لأن استبيانات استدامة المورّدين تطلب بصورة متزايدة سنة مرجعية قابلة للتحقّق لا نسبة كثافة. ويمكن للعملاء الاستشهاد بهذه الأرقام مباشرة في تقاريرهم.",
        "والمنهجية والحدود والافتراضات موضّحة في تقرير الاستدامة.",
      ],
    },
  },
];

export const newsBySlug = new Map(news.map((n) => [n.slug, n]));

export const newsTopics = ["product", "certification", "market", "sustainability"] as const;

export function latestNews(limit = 3) {
  return [...news]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, limit);
}

export function relatedNews(slug: string, limit = 2) {
  return news.filter((n) => n.slug !== slug).slice(0, limit);
}
