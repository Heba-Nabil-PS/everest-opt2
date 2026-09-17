import type { FieldSpec } from "./validate";

/**
 * Field specifications are shared by the rendered form and the server action,
 * so what the visitor sees and what the server enforces can never diverge.
 */
export const quoteFields: FieldSpec[] = [
  { name: "fullName", labelKey: "fullName", rules: [{ type: "required" }, { type: "minLength", value: 2 }] },
  { name: "company", labelKey: "company", rules: [{ type: "required" }] },
  { name: "email", labelKey: "email", rules: [{ type: "required" }, { type: "email" }] },
  { name: "phone", labelKey: "phone", rules: [{ type: "phone" }] },
  { name: "country", labelKey: "country", rules: [{ type: "required" }] },
  { name: "product", labelKey: "product", rules: [] },
  { name: "quantity", labelKey: "quantity", rules: [] },
  { name: "message", labelKey: "message", rules: [{ type: "required" }, { type: "minLength", value: 12 }] },
  { name: "consent", labelKey: "consent", rules: [{ type: "consent" }] },
];

export const contactFields: FieldSpec[] = [
  { name: "inquiryType", labelKey: "message", rules: [{ type: "required" }] },
  { name: "fullName", labelKey: "fullName", rules: [{ type: "required" }, { type: "minLength", value: 2 }] },
  { name: "company", labelKey: "company", rules: [] },
  { name: "email", labelKey: "email", rules: [{ type: "required" }, { type: "email" }] },
  { name: "phone", labelKey: "phone", rules: [{ type: "phone" }] },
  { name: "country", labelKey: "region", rules: [{ type: "required" }] },
  { name: "productInterest", labelKey: "productInterest", rules: [] },
  { name: "message", labelKey: "message", rules: [{ type: "required" }, { type: "minLength", value: 12 }] },
  { name: "consent", labelKey: "consent", rules: [{ type: "consent" }] },
];

export const serviceFields: FieldSpec[] = [
  { name: "fullName", labelKey: "fullName", rules: [{ type: "required" }] },
  { name: "company", labelKey: "company", rules: [{ type: "required" }] },
  { name: "email", labelKey: "email", rules: [{ type: "required" }, { type: "email" }] },
  { name: "phone", labelKey: "phone", rules: [{ type: "required" }, { type: "phone" }] },
  { name: "serialNumber", labelKey: "serialNumber", rules: [{ type: "required" }] },
  { name: "purchaseDate", labelKey: "purchaseDate", rules: [] },
  { name: "issue", labelKey: "issue", rules: [{ type: "required" }, { type: "minLength", value: 12 }] },
  { name: "consent", labelKey: "consent", rules: [{ type: "consent" }] },
];

export const distributorFields: FieldSpec[] = [
  { name: "fullName", labelKey: "fullName", rules: [{ type: "required" }] },
  { name: "company", labelKey: "company", rules: [{ type: "required" }] },
  { name: "jobTitle", labelKey: "jobTitle", rules: [] },
  { name: "email", labelKey: "email", rules: [{ type: "required" }, { type: "email" }] },
  { name: "phone", labelKey: "phone", rules: [{ type: "required" }, { type: "phone" }] },
  { name: "market", labelKey: "market", rules: [{ type: "required" }] },
  { name: "portfolio", labelKey: "portfolio", rules: [{ type: "required" }, { type: "minLength", value: 12 }] },
  { name: "annualVolume", labelKey: "annualVolume", rules: [] },
  { name: "consent", labelKey: "consent", rules: [{ type: "consent" }] },
];

export const careerFields: FieldSpec[] = [
  { name: "role", labelKey: "jobTitle", rules: [{ type: "required" }] },
  { name: "fullName", labelKey: "fullName", rules: [{ type: "required" }] },
  { name: "email", labelKey: "email", rules: [{ type: "required" }, { type: "email" }] },
  { name: "phone", labelKey: "phone", rules: [{ type: "required" }, { type: "phone" }] },
  { name: "alternatePhone", labelKey: "alternatePhone", rules: [{ type: "phone" }] },
  { name: "message", labelKey: "message", rules: [] },
  { name: "cv", labelKey: "cv", rules: [{ type: "required" }] },
  { name: "consent", labelKey: "consent", rules: [{ type: "consent" }] },
];

export const customizeFields: FieldSpec[] = [
  { name: "useCase", labelKey: "useCase", rules: [{ type: "required" }] },
  { name: "capacity", labelKey: "capacity", rules: [{ type: "required" }] },
  { name: "branding", labelKey: "branding", rules: [{ type: "required" }] },
  { name: "quantity", labelKey: "quantity", rules: [{ type: "required" }] },
  { name: "market", labelKey: "market", rules: [{ type: "required" }] },
  { name: "fullName", labelKey: "fullName", rules: [{ type: "required" }] },
  { name: "company", labelKey: "company", rules: [{ type: "required" }] },
  { name: "email", labelKey: "email", rules: [{ type: "required" }, { type: "email" }] },
  { name: "consent", labelKey: "consent", rules: [{ type: "consent" }] },
];

export const catalogueFields: FieldSpec[] = [
  { name: "fullName", labelKey: "fullName", rules: [{ type: "required" }] },
  { name: "company", labelKey: "company", rules: [{ type: "required" }] },
  { name: "email", labelKey: "email", rules: [{ type: "required" }, { type: "email" }] },
  { name: "consent", labelKey: "consent", rules: [{ type: "consent" }] },
];
