import type { Market } from "./types";

/**
 * `position` is a percentage of the equirectangular map box used by
 * <WorldMap>: x = (longitude + 180) / 3.6, y = (90 − latitude) / 1.8.
 *
 * Factory footprint per the 2026 client questionnaire: UAE, Egypt, Sri Lanka,
 * Saudi Arabia, plus India (new) and Syria (planned re-operation).
 */
export const markets: Market[] = [
  {
    country: "AE",
    name: { en: "United Arab Emirates", ar: "الإمارات العربية المتحدة" },
    status: "established",
    position: { x: 65.4, y: 35.9 },
    contact: {
      label: { en: "Head office · Sharjah", ar: "المقر الرئيسي · الشارقة" },
      phone: "+971 6 543 9555",
      email: "everestmktg@everestindustrial.com",
    },
    factory: {
      status: "operational",
      role: { en: "Group headquarters and flagship plant", ar: "مقر المجموعة والمصنع الرئيسي" },
      note: {
        en: "Where Everest began in 1981. Home to group engineering, R&D, climate-chamber testing and the widest model range.",
        ar: "حيث بدأت إيفرست عام 1981. يضمّ الهندسة المركزية والبحث والتطوير وغرف الاختبار المناخي وأوسع مجموعة موديلات.",
      },
      figure: { value: "1981", label: { en: "Founded", ar: "سنة التأسيس" } },
    },
  },
  {
    country: "EG",
    name: { en: "Egypt", ar: "مصر" },
    status: "established",
    position: { x: 58.3, y: 35.0 },
    contact: {
      label: { en: "Regional sales & service · Egypt", ar: "المبيعات والخدمة الإقليمية · مصر" },
      email: "egypt@everestindustrial.com",
    },
    factory: {
      status: "expanding",
      role: { en: "Mega plant for Africa and the Levant", ar: "مصنع ضخم لأفريقيا والمشرق" },
      note: {
        en: "Expansion under way to a mega plant producing over 1,000 units a day — Everest's largest single-site output.",
        ar: "توسعة جارية لمصنع ضخم ينتج أكثر من 1,000 وحدة يومياً — أعلى إنتاج لموقع واحد في إيفرست.",
      },
      figure: { value: "1,000+", label: { en: "Units per day", ar: "وحدة يومياً" } },
    },
  },
  {
    country: "SA",
    name: { en: "Saudi Arabia", ar: "المملكة العربية السعودية" },
    status: "established",
    position: { x: 62.5, y: 36.7 },
    contact: {
      label: { en: "Regional sales · Saudi Arabia", ar: "المبيعات الإقليمية · السعودية" },
      email: "ksa@everestindustrial.com",
    },
    factory: {
      status: "operational",
      role: { en: "In-Kingdom manufacturing", ar: "تصنيع داخل المملكة" },
      note: {
        en: "Local production for the Kingdom's beverage and retail accounts, shortening lead times across the GCC.",
        ar: "إنتاج محلي لحسابات المشروبات والتجزئة في المملكة، يقصّر مدد التوريد في دول الخليج.",
      },
    },
  },
  {
    country: "LK",
    name: { en: "Sri Lanka", ar: "سريلانكا" },
    status: "growth",
    position: { x: 72.4, y: 45.6 },
    contact: {
      label: { en: "Everest Industrial Lanka", ar: "إيفرست الصناعية لانكا" },
      email: "srilanka@everestindustrial.com",
    },
    factory: {
      status: "operational",
      role: { en: "Joint venture with Varun Beverages", ar: "مشروع مشترك مع فارون للمشروبات" },
      note: {
        en: "Varun Beverages Limited, one of PepsiCo's largest bottlers worldwide, holds a 50% stake in Everest Industrial Lanka.",
        ar: "تمتلك شركة فارون للمشروبات، إحدى أكبر شركات تعبئة بيبسيكو في العالم، حصة 50% في إيفرست الصناعية لانكا.",
      },
      figure: { value: "50%", label: { en: "VBL stake", ar: "حصة VBL" } },
    },
  },
  {
    country: "IN",
    name: { en: "India", ar: "الهند" },
    status: "growth",
    position: { x: 71.7, y: 38.3 },
    contact: {
      label: { en: "Regional office · India", ar: "المكتب الإقليمي · الهند" },
      email: "india@everestindustrial.com",
    },
    factory: {
      status: "new",
      role: { en: "Mega factory partnership", ar: "شراكة المصنع الضخم" },
      note: {
        en: "A new factory built with Varun Beverages to serve South Asia's fastest-growing beverage market from inside it.",
        ar: "مصنع جديد بالشراكة مع فارون للمشروبات لخدمة أسرع أسواق المشروبات نمواً في جنوب آسيا من داخلها.",
      },
    },
  },
  {
    country: "SY",
    name: { en: "Syria", ar: "سوريا" },
    status: "future",
    position: { x: 60.1, y: 31.4 },
    factory: {
      status: "planned",
      role: { en: "Damascus plant", ar: "مصنع دمشق" },
      note: {
        en: "Plans are in place to re-operate the Damascus facility and supply the Levant locally again.",
        ar: "توجد خطط لإعادة تشغيل منشأة دمشق وتزويد المشرق محلياً من جديد.",
      },
    },
  },
  {
    country: "US",
    name: { en: "United States", ar: "الولايات المتحدة" },
    status: "future",
    position: { x: 22.8, y: 28.3 },
  },
  {
    country: "EU",
    name: { en: "Europe", ar: "أوروبا" },
    status: "future",
    position: { x: 52.8, y: 22.2 },
  },
];

export const marketsByStatus = (status: Market["status"]) =>
  markets.filter((m) => m.status === status);

export const factories = markets.filter((m) => m.factory);
