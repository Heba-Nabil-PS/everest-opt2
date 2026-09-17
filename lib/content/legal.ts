import type { Locale } from "@/lib/i18n/config";

export interface LegalDocument {
  title: string;
  updated: string;
  intro: string;
  sections: { heading: string; body: string[] }[];
}

/**
 * Written to describe what this site actually does: it collects what a visitor
 * types into an inquiry form, stores one language preference cookie, and runs
 * no advertising or third-party analytics. Everest's legal counsel should
 * review the wording before launch.
 */
export const privacy: Record<Locale, LegalDocument> = {
  en: {
    title: "Privacy Policy",
    updated: "2026-09-01",
    intro:
      "This policy explains what Everest Industrial collects through everestindustrial.com, why, and what you can ask us to do with it.",
    sections: [
      {
        heading: "What we collect",
        body: [
          "Information you type into a form on this site: your name, company, work email, phone number, country, and the details of your enquiry. Where you apply for a role, the CV you attach.",
          "One preference cookie that records the language you are reading the site in, so you are not redirected away from it on your next visit.",
          "Standard web server logs, which include IP address and browser user agent, retained for security and diagnostics.",
        ],
      },
      {
        heading: "What we do not collect",
        body: [
          "We run no advertising trackers, no behavioural profiling and no third-party analytics on this site.",
          "We do not sell, rent or trade personal information to anyone.",
        ],
      },
      {
        heading: "Why we use it",
        body: [
          "To answer your enquiry, prepare a quotation, arrange service, or assess a job application.",
          "To keep records of commercial correspondence as required for contracts and warranty administration.",
        ],
      },
      {
        heading: "Who sees it",
        body: [
          "Everest employees who need it to respond to you, and — where your enquiry concerns a market served by an appointed distributor — that distributor.",
          "Service providers that host this website or deliver our email, under contract and only for those purposes.",
        ],
      },
      {
        heading: "How long we keep it",
        body: [
          "Commercial enquiries: seven years from last contact, in line with contractual and tax record-keeping requirements.",
          "Job applications: six months from submission, unless you ask us to keep them on file for longer.",
          "Server logs: twelve months.",
        ],
      },
      {
        heading: "Your rights",
        body: [
          "You can ask us for a copy of the information we hold about you, ask us to correct it, or ask us to delete it, by emailing everestmktg@everestindustrial.com.",
          "If you asked to receive updates, every message includes a way to stop receiving them.",
        ],
      },
      {
        heading: "Contact",
        body: [
          "Everest Industrial Group, Industrial Area 12, Sharjah, United Arab Emirates. Telephone +971 6 543 9555. Email everestmktg@everestindustrial.com.",
        ],
      },
    ],
  },
  ar: {
    title: "سياسة الخصوصية",
    updated: "2026-09-01",
    intro:
      "توضّح هذه السياسة ما تجمعه إيفرست الصناعية عبر موقع everestindustrial.com، ولماذا، وما الذي يمكنك أن تطلب منّا فعله به.",
    sections: [
      {
        heading: "ما الذي نجمعه",
        body: [
          "المعلومات التي تُدخلها في أي نموذج على هذا الموقع: الاسم، واسم الشركة، وبريد العمل، ورقم الهاتف، والدولة، وتفاصيل استفسارك. وفي حال التقدّم لوظيفة، السيرة الذاتية التي ترفقها.",
          "ملف تعريف ارتباط واحد لتفضيل اللغة، يحفظ اللغة التي تتصفّح بها الموقع حتى لا تُنقل عنها في زيارتك التالية.",
          "سجلّات خادم الويب المعتادة، وتشمل عنوان IP ومعرّف المتصفّح، وتُحفظ لأغراض الأمن والتشخيص.",
        ],
      },
      {
        heading: "ما الذي لا نجمعه",
        body: [
          "لا نستخدم أي أدوات تتبّع إعلاني، ولا تحليلاً سلوكياً، ولا أي تحليلات من أطراف خارجية على هذا الموقع.",
          "لا نبيع المعلومات الشخصية ولا نؤجّرها ولا نتاجر بها مع أي جهة.",
        ],
      },
      {
        heading: "لماذا نستخدمها",
        body: [
          "للردّ على استفسارك، أو إعداد عرض سعر، أو ترتيب خدمة صيانة، أو تقييم طلب توظيف.",
          "لحفظ سجلّات المراسلات التجارية وفق ما تتطلّبه العقود وإدارة الضمان.",
        ],
      },
      {
        heading: "من يطّلع عليها",
        body: [
          "موظفو إيفرست الذين يحتاجون إليها للردّ عليك، والموزّع المعتمد إذا كان استفسارك يخصّ سوقاً يغطّيه.",
          "مزوّدو الخدمات الذين يستضيفون هذا الموقع أو يديرون بريدنا الإلكتروني، بموجب عقد ولتلك الأغراض وحدها.",
        ],
      },
      {
        heading: "مدة الاحتفاظ",
        body: [
          "الاستفسارات التجارية: سبع سنوات من آخر تواصل، بما يتوافق مع متطلبات حفظ السجلّات التعاقدية والضريبية.",
          "طلبات التوظيف: ستة أشهر من تاريخ الإرسال، ما لم تطلب الاحتفاظ بها لمدة أطول.",
          "سجلّات الخادم: اثنا عشر شهراً.",
        ],
      },
      {
        heading: "حقوقك",
        body: [
          "يمكنك طلب نسخة من المعلومات التي نحتفظ بها عنك، أو طلب تصحيحها، أو طلب حذفها، عبر مراسلة everestmktg@everestindustrial.com.",
          "إذا طلبت تلقّي المستجدّات، فكل رسالة تتضمّن وسيلة لإيقاف تلقّيها.",
        ],
      },
      {
        heading: "التواصل",
        body: [
          "مجموعة إيفرست الصناعية، المنطقة الصناعية 12، الشارقة، الإمارات العربية المتحدة. هاتف ‎+971 6 543 9555. بريد everestmktg@everestindustrial.com.",
        ],
      },
    ],
  },
};

export const terms: Record<Locale, LegalDocument> = {
  en: {
    title: "Terms of Use",
    updated: "2026-09-01",
    intro:
      "These terms govern your use of everestindustrial.com. They do not replace the terms of any supply contract with Everest Industrial.",
    sections: [
      {
        heading: "Information on this site",
        body: [
          "Product specifications published here are nominal, measured at 25°C ambient unless stated otherwise, and are subject to manufacturing tolerance.",
          "Specifications, model availability and lead times may change without notice. The specification that applies to your order is the one confirmed in writing on your quotation.",
          "Energy consumption figures are measured over a standard duty cycle. Consumption in service depends on ambient conditions, door traffic and load.",
        ],
      },
      {
        heading: "Quotations and orders",
        body: [
          "Nothing on this site is an offer to sell. A binding commitment arises only from a written quotation accepted in accordance with its terms.",
          "Prices indicated in correspondence are valid for the period stated in that correspondence.",
        ],
      },
      {
        heading: "Intellectual property",
        body: [
          "The Everest name, logo, product names and model codes, and the content of this site, are the property of Everest Industrial Group.",
          "You may download and reproduce specification sheets, manuals and brochures for the purpose of evaluating, specifying, operating or servicing Everest equipment. Any other reproduction requires our written permission.",
        ],
      },
      {
        heading: "Third-party links",
        body: [
          "Where this site links to a marketplace or an external service, we are not responsible for the content or terms of that site.",
        ],
      },
      {
        heading: "Governing law",
        body: [
          "These terms are governed by the laws of the United Arab Emirates, and the courts of Sharjah have jurisdiction over any dispute arising from them.",
        ],
      },
    ],
  },
  ar: {
    title: "شروط الاستخدام",
    updated: "2026-09-01",
    intro:
      "تحكم هذه الشروط استخدامك لموقع everestindustrial.com، وهي لا تحلّ محلّ شروط أي عقد توريد مع إيفرست الصناعية.",
    sections: [
      {
        heading: "المعلومات في هذا الموقع",
        body: [
          "مواصفات المنتجات المنشورة هنا اسمية، ومقيسة عند حرارة محيطة 25 درجة مئوية ما لم يُذكر خلاف ذلك، وتخضع لتفاوتات التصنيع.",
          "قد تتغيّر المواصفات وتوفّر الموديلات ومدد التوريد دون إشعار. والمواصفة السارية على طلبك هي المؤكَّدة كتابةً في عرض السعر.",
          "أرقام استهلاك الطاقة مقيسة على دورة تشغيل قياسية، ويعتمد الاستهلاك الفعلي على الظروف المحيطة وحركة الأبواب والحمل.",
        ],
      },
      {
        heading: "عروض الأسعار والطلبات",
        body: [
          "لا يُعدّ أي محتوى في هذا الموقع عرضاً للبيع. ولا ينشأ التزام ملزم إلا من عرض سعر مكتوب يجري قبوله وفق شروطه.",
          "الأسعار الواردة في المراسلات سارية للمدة المذكورة في تلك المراسلات.",
        ],
      },
      {
        heading: "الملكية الفكرية",
        body: [
          "اسم إيفرست وشعارها وأسماء منتجاتها وأكواد موديلاتها، ومحتوى هذا الموقع، ملك لمجموعة إيفرست الصناعية.",
          "يجوز لك تحميل أوراق المواصفات والأدلّة والكتيّبات ونسخها لغرض تقييم معدّات إيفرست أو تحديد مواصفاتها أو تشغيلها أو صيانتها. وأي استنساخ آخر يتطلّب إذناً كتابياً منّا.",
        ],
      },
      {
        heading: "روابط الأطراف الخارجية",
        body: [
          "حين يربط هذا الموقع بمتجر إلكتروني أو خدمة خارجية، فإننا لسنا مسؤولين عن محتوى ذلك الموقع أو شروطه.",
        ],
      },
      {
        heading: "القانون الحاكم",
        body: [
          "تخضع هذه الشروط لقوانين دولة الإمارات العربية المتحدة، وتختصّ محاكم الشارقة بأي نزاع ينشأ عنها.",
        ],
      },
    ],
  },
};
