import type { Vacancy } from "./types";

export const vacancies: Vacancy[] = [
  {
    slug: "refrigeration-design-engineer",
    title: { en: "Refrigeration Design Engineer", ar: "مهندس تصميم أنظمة تبريد" },
    department: { en: "R&D and Engineering", ar: "البحث والتطوير والهندسة" },
    location: { en: "Sharjah, UAE", ar: "الشارقة، الإمارات" },
    type: { en: "Full time", ar: "دوام كامل" },
    summary: {
      en: "Own the thermal design of new cabinet platforms from simulation through to climate-chamber sign-off.",
      ar: "تولَّ التصميم الحراري لمنصّات الخزائن الجديدة من المحاكاة حتى اعتمادها في الغرفة المناخية.",
    },
    responsibilities: [
      { en: "Size evaporators, condensers and airflow paths for new platforms", ar: "تحديد أحجام المبخّرات والمكثّفات ومسارات الهواء للمنصّات الجديدة" },
      { en: "Run and interpret climate-chamber and endurance testing", ar: "تنفيذ اختبارات الغرف المناخية والتحمّل وتفسير نتائجها" },
      { en: "Support the hydrocarbon refrigerant transition across existing platforms", ar: "دعم التحوّل إلى غازات التبريد الهيدروكربونية في المنصّات القائمة" },
      { en: "Work with production to keep designs manufacturable on existing tooling", ar: "العمل مع الإنتاج لإبقاء التصاميم قابلة للتصنيع على القوالب الحالية" },
    ],
    requirements: [
      { en: "Degree in mechanical engineering or refrigeration technology", ar: "شهادة في الهندسة الميكانيكية أو تقنية التبريد" },
      { en: "5+ years in commercial refrigeration design", ar: "خبرة 5 سنوات فأكثر في تصميم التبريد التجاري" },
      { en: "Hands-on experience with hydrocarbon refrigerant systems", ar: "خبرة عملية بأنظمة غازات التبريد الهيدروكربونية" },
      { en: "Comfortable presenting test data to customer engineering teams", ar: "القدرة على عرض بيانات الاختبار أمام الفرق الهندسية للعملاء" },
    ],
  },
  {
    slug: "production-line-supervisor",
    title: { en: "Production Line Supervisor", ar: "مشرف خطّ إنتاج" },
    department: { en: "Manufacturing", ar: "التصنيع" },
    location: { en: "Sharjah, UAE", ar: "الشارقة، الإمارات" },
    type: { en: "Full time", ar: "دوام كامل" },
    summary: {
      en: "Run a dedicated cabinet line against daily output, quality and safety targets.",
      ar: "أدِر خطّ خزائن مخصّصاً وفق أهداف الإنتاج اليومي والجودة والسلامة.",
    },
    responsibilities: [
      { en: "Plan and balance daily output across line stations", ar: "تخطيط الإنتاج اليومي وموازنته بين محطّات الخط" },
      { en: "Hold first-pass quality against the pre-dispatch gate", ar: "الحفاظ على جودة المرور الأول وفق بوّابة ما قبل الشحن" },
      { en: "Coach technicians and run in-house certification", ar: "تدريب الفنيين وإدارة الاعتماد الداخلي" },
      { en: "Maintain ISO 45001 practice on the floor, not just in the file", ar: "تطبيق ممارسات ISO 45001 في الميدان لا في الملفّات فقط" },
    ],
    requirements: [
      { en: "7+ years in manufacturing, 3+ in a supervisory role", ar: "خبرة 7 سنوات فأكثر في التصنيع، منها 3 في الإشراف" },
      { en: "Working knowledge of lean line balancing", ar: "معرفة عملية بموازنة الخطوط وفق منهجية لين" },
      { en: "Arabic and English", ar: "إجادة العربية والإنجليزية" },
    ],
  },
  {
    slug: "field-service-engineer-ksa",
    title: { en: "Field Service Engineer — KSA", ar: "مهندس خدمة ميدانية — السعودية" },
    department: { en: "Service and Support", ar: "الخدمة والدعم" },
    location: { en: "Riyadh, Saudi Arabia", ar: "الرياض، السعودية" },
    type: { en: "Full time", ar: "دوام كامل" },
    summary: {
      en: "Cover warranty, preventive maintenance and retrofit work across Saudi accounts.",
      ar: "غطِّ أعمال الضمان والصيانة الوقائية والتحديث عبر الحسابات في السعودية.",
    },
    responsibilities: [
      { en: "Diagnose and repair units in the field against response commitments", ar: "تشخيص الوحدات وإصلاحها ميدانياً وفق التزامات الاستجابة" },
      { en: "Deliver scheduled preventive maintenance across fleet accounts", ar: "تنفيذ الصيانة الوقائية المجدولة عبر حسابات الأساطيل" },
      { en: "Train customer and distributor technicians on first-line diagnosis", ar: "تدريب فنيي العملاء والموزّعين على التشخيص الأوّلي" },
      { en: "Feed field failure data back to engineering", ar: "إرجاع بيانات الأعطال الميدانية إلى قسم الهندسة" },
    ],
    requirements: [
      { en: "Refrigeration or HVAC technical qualification", ar: "مؤهّل فني في التبريد أو التكييف" },
      { en: "4+ years in commercial field service", ar: "خبرة 4 سنوات فأكثر في الخدمة الميدانية التجارية" },
      { en: "Valid KSA driving licence and willingness to travel in-kingdom", ar: "رخصة قيادة سعودية سارية والاستعداد للسفر داخل المملكة" },
    ],
  },
  {
    slug: "quality-compliance-officer",
    title: { en: "Quality & Compliance Officer", ar: "مسؤول الجودة والامتثال" },
    department: { en: "Quality", ar: "الجودة" },
    location: { en: "Sharjah, UAE", ar: "الشارقة، الإمارات" },
    type: { en: "Full time", ar: "دوام كامل" },
    summary: {
      en: "Maintain the ISO 9001, 14001 and 45001 systems and prepare the site for customer audits.",
      ar: "حافظ على أنظمة ISO 9001 و14001 و45001 وجهّز الموقع لتدقيق العملاء.",
    },
    responsibilities: [
      { en: "Run internal audits across production and support functions", ar: "تنفيذ التدقيق الداخلي عبر الإنتاج والوظائف المساندة" },
      { en: "Prepare and host customer and certification body audits", ar: "التحضير لتدقيق العملاء وجهات الاعتماد واستضافتها" },
      { en: "Own corrective and preventive action tracking to closure", ar: "متابعة الإجراءات التصحيحية والوقائية حتى الإغلاق" },
      { en: "Maintain batch-level traceability records", ar: "حفظ سجلّات التتبّع على مستوى دفعة الإنتاج" },
    ],
    requirements: [
      { en: "Lead auditor qualification in at least one of the three standards", ar: "مؤهّل مدقّق رئيسي في واحد على الأقل من المعايير الثلاثة" },
      { en: "3+ years in a manufacturing quality function", ar: "خبرة 3 سنوات فأكثر في وظيفة جودة تصنيعية" },
      { en: "Precise technical English writing", ar: "كتابة تقنية دقيقة باللغة الإنجليزية" },
    ],
  },
  {
    slug: "key-account-manager-beverage",
    title: { en: "Key Account Manager — Beverage", ar: "مدير حسابات رئيسية — قطاع المشروبات" },
    department: { en: "Commercial", ar: "التجاري" },
    location: { en: "Sharjah, UAE", ar: "الشارقة، الإمارات" },
    type: { en: "Full time", ar: "دوام كامل" },
    summary: {
      en: "Own multinational beverage accounts from specification through to rollout delivery.",
      ar: "تولَّ حسابات المشروبات متعدّدة الجنسيات من تحديد المواصفات حتى تسليم الطرح.",
    },
    responsibilities: [
      { en: "Lead specification discussions with customer engineering and procurement", ar: "قيادة مناقشات المواصفات مع فرق الهندسة والمشتريات لدى العميل" },
      { en: "Coordinate rollout phasing with production planning", ar: "تنسيق مراحل الطرح مع تخطيط الإنتاج" },
      { en: "Own commercial terms, forecasting and account profitability", ar: "إدارة الشروط التجارية والتوقّعات وربحية الحساب" },
      { en: "Bring field feedback into the product roadmap", ar: "نقل ملاحظات الميدان إلى خارطة طريق المنتج" },
    ],
    requirements: [
      { en: "6+ years selling capital equipment to FMCG or beverage groups", ar: "خبرة 6 سنوات فأكثر في بيع المعدّات الرأسمالية لمجموعات السلع الاستهلاكية أو المشروبات" },
      { en: "Comfortable reading a spec sheet and challenging it", ar: "القدرة على قراءة ورقة المواصفات ومناقشتها" },
      { en: "Arabic and English, GCC market experience", ar: "إجادة العربية والإنجليزية وخبرة في أسواق الخليج" },
    ],
  },
];

export const vacancyBySlug = new Map(vacancies.map((v) => [v.slug, v]));

/** Route segment for the open application page at /careers/speculative. */
export const SPECULATIVE_SLUG = "speculative";
