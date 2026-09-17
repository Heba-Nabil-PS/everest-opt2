"use client";

import { useEffect, useRef, useState } from "react";
import { InquiryForm } from "./InquiryForm";
import { CheckboxField, TextArea, TextField } from "./Field";
import { Button } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";
import { t, type Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n/config";
import type { FormState } from "@/lib/forms/validate";

/**
 * Guided specification. Every field stays mounted so a single submit carries
 * the whole brief and server validation sees all of it; steps only control what
 * is visible. Each step is checked before moving on, so the final submit rarely
 * fails — and if the server still rejects a field, the wizard jumps to it.
 */
export function CustomizeWizard({
  locale,
  dictionary: d,
}: {
  locale: Locale;
  dictionary: Dictionary;
}) {
  return (
    <InquiryForm
      kind="customize"
      locale={locale}
      dictionary={d}
      submitLabel={d.cta.requestQuote}
      hideSubmit
    >
      {(state, pending) => <Steps state={state} pending={pending} dictionary={d} locale={locale} />}
    </InquiryForm>
  );
}

const TOTAL = 5;

const stepFields: string[][] = [
  ["useCase"],
  ["capacity"],
  ["branding"],
  ["quantity", "market"],
  ["fullName", "company", "email", "consent"],
];

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type Choice = { value: string; hint: string; icon?: IconName };

function copy(locale: Locale) {
  const ar = locale === "ar";
  return {
    useCases: (ar
      ? [
          ["متجر مريح", "حركة أبواب عالية طوال اليوم", "clock"],
          ["سوبر ماركت", "ممرّات تبريد متّصلة", "layers"],
          ["محطة وقود", "حرارة محيطة مرتفعة", "gauge"],
          ["مطعم أو مقهى", "خلف الكاونتر وفي المطبخ", "users"],
          ["فندق", "تشغيل هادئ وتشطيب أنيق", "star"],
          ["مستودع أو توزيع", "سعة كبيرة وتحميل بالصناديق", "factory"],
        ]
      : [
          ["Convenience store", "High door traffic all day", "clock"],
          ["Supermarket", "Continuous chilled runs", "layers"],
          ["Forecourt", "High ambient, heavy footfall", "gauge"],
          ["Restaurant or café", "Back-bar and kitchen duty", "users"],
          ["Hotel", "Quiet running, premium finish", "star"],
          ["Depot or distribution", "Bulk capacity, case loading", "factory"],
        ]
    ).map(([value, hint, icon]) => ({ value, hint, icon: icon as IconName })),
    branding: (ar
      ? [
          ["خزانة سادة", "تشطيب إيفرست القياسي"],
          ["لافتة علوية بالعلامة", "شعارك على الواجهة العلوية"],
          ["تغليف كامل للخزانة", "ألوان علامتك على الهيكل"],
          ["تغليف كامل ولافتة مضاءة", "أقصى حضور عند نقطة البيع"],
        ]
      : [
          ["Plain cabinet", "Standard Everest finish"],
          ["Branded canopy", "Your logo on the header"],
          ["Full cabinet wrap", "Brand colours on the body"],
          ["Full wrap and illuminated header", "Maximum shelf presence"],
        ]
    ).map(([value, hint]) => ({ value, hint })),
    capacity: ar
      ? ["أقل من 150 لتر · كاونتر", "300–650 لتر · باب واحد", "800–1,000 لتر · بابان", "+1,200 لتر · أبواب متعدّدة"]
      : ["Under 150 L · countertop", "300–650 L · single door", "800–1,000 L · double door", "1,200 L+ · multi-door"],
    capacityPlaceholder: ar ? "مثال: 500 لتر، أو 6 رفوف" : "e.g. 500 L, or 6 shelves",
    quantity: (ar
      ? [
          ["1–10 وحدات", "منفذ واحد"],
          ["11–50 وحدة", "سلسلة صغيرة"],
          ["51–250 وحدة", "طرح إقليمي"],
          ["+250 وحدة", "طرح وطني"],
        ]
      : [
          ["1–10 units", "Single outlet"],
          ["11–50 units", "Small chain"],
          ["51–250 units", "Regional rollout"],
          ["250+ units", "National rollout"],
        ]
    ).map(([value, hint]) => ({ value, hint })),
  };
}

function Steps({
  state,
  pending,
  dictionary: d,
  locale,
}: {
  state: FormState;
  pending: boolean;
  dictionary: Dictionary;
  locale: Locale;
}) {
  const c = copy(locale);
  const s = d.customize;
  const meta = [s.steps.useCase, s.steps.capacity, s.steps.branding, s.steps.volume, s.steps.contact];

  const [step, setStep] = useState(0);
  const [reached, setReached] = useState(0);
  const [values, setValues] = useState<Record<string, string>>(() => ({ ...state.values }));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const headingRef = useRef<HTMLHeadingElement>(null);
  const capacityRef = useRef<HTMLDivElement>(null);
  const userMoved = useRef(false);

  /* Never leave a server error on a step the visitor cannot see. Adjusted
     during render when a new server result arrives, not in an effect. */
  const [seenState, setSeenState] = useState(state);
  if (state !== seenState) {
    setSeenState(state);
    if (state.status === "error") {
      setErrors(state.errors);
      const firstBadStep = stepFields.findIndex((fields) => fields.some((field) => state.errors[field]));
      if (firstBadStep >= 0) setStep(firstBadStep);
    }
  }

  /* Move focus to the new step's heading so keyboard and screen-reader users land in context. */
  useEffect(() => {
    if (userMoved.current) headingRef.current?.focus();
  }, [step]);

  const label = (field: string) =>
    field === "quantity" ? s.quantityLabel : d.forms.fields[field as keyof typeof d.forms.fields];

  function check(index: number) {
    const found: Record<string, string> = {};
    for (const field of stepFields[index]) {
      const value = (values[field] ?? "").trim();
      if (field === "consent") {
        if (value !== "on") found[field] = d.forms.validation.consent;
      } else if (!value) {
        found[field] = t(d.forms.validation.required, { field: label(field) });
      } else if (field === "email" && !EMAIL.test(value)) {
        found[field] = d.forms.validation.email;
      }
    }
    return found;
  }

  function goTo(index: number) {
    userMoved.current = true;
    setStep(index);
  }

  function next() {
    const found = check(step);
    setErrors((current) => {
      const cleared = { ...current };
      for (const field of stepFields[step]) delete cleared[field];
      return { ...cleared, ...found };
    });
    if (Object.keys(found).length) return;
    const target = Math.min(TOTAL - 1, step + 1);
    setReached((r) => Math.max(r, target));
    goTo(target);
  }

  /* Uncontrolled inputs report into one values map — used for checks and the summary. */
  function onChange(event: React.FormEvent<HTMLDivElement>) {
    const target = event.target as unknown as HTMLInputElement;
    if (!target.name) return;
    if (target.type === "radio" && !target.checked) return;
    const value = target.type === "checkbox" ? (target.checked ? "on" : "") : target.value;
    setValues((current) => ({ ...current, [target.name]: value }));
    if (errors[target.name]) {
      setErrors((current) => {
        const rest = { ...current };
        delete rest[target.name];
        return rest;
      });
    }
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    const target = event.target as HTMLElement;
    if (event.key !== "Enter" || step === TOTAL - 1) return;
    if (target.tagName === "TEXTAREA" || target.tagName === "BUTTON") return;
    event.preventDefault();
    next();
  }

  function pickCapacity(value: string) {
    const input = capacityRef.current?.querySelector<HTMLInputElement>('input[name="capacity"]');
    if (input) input.value = value;
    setValues((current) => ({ ...current, capacity: value }));
    setErrors((current) => {
      const rest = { ...current };
      delete rest.capacity;
      return rest;
    });
  }

  const progress = (step / (TOTAL - 1)) * 100;
  const summary = [
    { step: 0, label: s.stepShort[0], value: values.useCase },
    { step: 1, label: s.stepShort[1], value: values.capacity },
    { step: 2, label: s.stepShort[2], value: values.branding },
    { step: 3, label: s.stepShort[3], value: [values.quantity, values.market].filter(Boolean).join(" · ") },
  ];

  return (
    <div className="flex flex-col gap-8" onChange={onChange} onKeyDown={onKeyDown}>
      {/* Progress: a list, not a decoration — it says where you are and where you can go back to. */}
      <nav aria-label={s.stepsHeading}>
        <ol className="relative grid grid-cols-5">
          <span aria-hidden="true" className="absolute inset-x-[10%] top-[1.125rem] h-0.5 rounded-full bg-hairline">
            <span
              className="absolute inset-y-0 start-0 rounded-full bg-glacier-400 transition-[width] duration-500 ease-[var(--ease-out-soft)]"
              style={{ width: `${progress}%` }}
            />
          </span>

          {meta.map((item, index) => {
            const done = index !== step && (index < step || index < reached) && !stepFields[index].some((f) => errors[f]);
            const current = index === step;
            const reachable = index <= reached;
            return (
              <li key={item.title} className="relative flex justify-center">
                <button
                  type="button"
                  disabled={!reachable}
                  onClick={() => goTo(index)}
                  aria-current={current ? "step" : undefined}
                  className="group flex flex-col items-center gap-2 rounded-lg px-1 text-center disabled:cursor-not-allowed"
                >
                  <span
                    className={cn(
                      "grid h-9 w-9 place-items-center rounded-full text-sm font-semibold transition-all duration-300",
                      current
                        ? "bg-navy-700 text-white ring-4 ring-glacier-100"
                        : done
                          ? "bg-glacier-400 text-navy-700 group-hover:ring-4 group-hover:ring-glacier-100"
                          : "border-2 border-hairline-strong bg-white text-ink-muted",
                    )}
                  >
                    {done && !current ? <Icon name="check" size={16} /> : index + 1}
                  </span>
                  <span
                    className={cn(
                      "text-xs font-medium",
                      current ? "text-ink-strong" : "hidden text-ink-muted sm:block",
                    )}
                  >
                    {s.stepShort[index]}
                  </span>
                  <span className="sr-only">{item.title}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      <div>
        <p className="text-2xs font-semibold uppercase tracking-[0.14em] text-glacier-600">
          {t(s.stepLabel, { n: step + 1, total: TOTAL })}
        </p>
        <h3 ref={headingRef} tabIndex={-1} className="mt-2 text-2xl outline-none">
          {meta[step].title}
        </h3>
        <p className="mt-2 text-ink-muted">{meta[step].body}</p>
      </div>

      {/* 1 · Outlet */}
      <div hidden={step !== 0} className="anim-rise">
        <ChoiceGroup
          name="useCase"
          legend={d.forms.fields.useCase}
          choices={c.useCases}
          selected={values.useCase}
          error={errors.useCase}
          columns="sm:grid-cols-2 lg:grid-cols-3"
        />
      </div>

      {/* 2 · Capacity */}
      <div hidden={step !== 1} ref={capacityRef} className="anim-rise flex flex-col gap-5">
        <TextField
          name="capacity"
          label={d.forms.fields.capacity}
          placeholder={c.capacityPlaceholder}
          required
          defaultValue={state.values?.capacity}
          error={errors.capacity}
        />
        <div>
          <p className="mb-2 text-sm text-ink-muted">{s.capacityPresetsLabel}</p>
          <div className="flex flex-wrap gap-2">
            {c.capacity.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => pickCapacity(preset)}
                aria-pressed={values.capacity === preset}
                className={cn(
                  "min-h-11 rounded-full border px-4 text-sm font-medium transition-colors",
                  values.capacity === preset
                    ? "border-glacier-400 bg-glacier-50 text-ink-strong"
                    : "border-hairline-strong bg-white text-ink-muted hover:border-glacier-400 hover:text-ink-strong",
                )}
              >
                {preset}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3 · Branding */}
      <div hidden={step !== 2} className="anim-rise">
        <ChoiceGroup
          name="branding"
          legend={d.forms.fields.branding}
          choices={c.branding}
          selected={values.branding}
          error={errors.branding}
          columns="grid-cols-2 lg:grid-cols-4"
          visual={(index) => <BrandingArt level={index} />}
        />
      </div>

      {/* 4 · Volume */}
      <div hidden={step !== 3} className="anim-rise flex flex-col gap-6">
        <ChoiceGroup
          name="quantity"
          legend={s.quantityLabel}
          choices={c.quantity}
          selected={values.quantity}
          error={errors.quantity}
          columns="grid-cols-2 lg:grid-cols-4"
        />
        <TextField
          name="market"
          label={d.forms.fields.market}
          autoComplete="country-name"
          required
          defaultValue={state.values?.market}
          error={errors.market}
        />
      </div>

      {/* 5 · Contact, with the brief so far */}
      <div hidden={step !== 4} className="anim-rise flex flex-col gap-6">
        <section aria-label={s.summaryHeading} className="rounded-xl border border-hairline bg-ice/60 p-5">
          <p className="mb-3 text-2xs font-semibold uppercase tracking-[0.14em] text-ink-muted">
            {s.summaryHeading}
          </p>
          <dl className="grid gap-3 sm:grid-cols-2">
            {summary.map((row) => (
              <div key={row.label} className="flex items-start justify-between gap-3 rounded-lg bg-white px-4 py-3">
                <div className="min-w-0">
                  <dt className="text-2xs uppercase tracking-[0.12em] text-ink-muted">{row.label}</dt>
                  <dd className={cn("mt-0.5 text-sm font-medium", row.value ? "text-ink-strong" : "text-ink-muted")}>
                    {row.value || s.notSet}
                  </dd>
                </div>
                <button
                  type="button"
                  onClick={() => goTo(row.step)}
                  className="shrink-0 text-xs font-semibold text-glacier-600 underline-offset-4 hover:underline"
                >
                  {s.edit}
                  <span className="sr-only"> {row.label}</span>
                </button>
              </div>
            ))}
          </dl>
        </section>

        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            name="fullName"
            label={d.forms.fields.fullName}
            autoComplete="name"
            required
            defaultValue={state.values?.fullName}
            error={errors.fullName}
          />
          <TextField
            name="company"
            label={d.forms.fields.company}
            autoComplete="organization"
            required
            defaultValue={state.values?.company}
            error={errors.company}
          />
        </div>
        <TextField
          name="email"
          type="email"
          label={d.forms.fields.email}
          autoComplete="email"
          required
          defaultValue={state.values?.email}
          error={errors.email}
        />
        <TextArea
          name="message"
          label={d.forms.fields.message}
          optionalSuffix={d.forms.optionalSuffix}
          rows={3}
          defaultValue={state.values?.message}
        />
        <CheckboxField name="consent" label={d.forms.fields.consent} error={errors.consent} />
      </div>

      <div className="flex items-center justify-between gap-4 border-t border-hairline pt-6">
        <Button
          variant="ghost"
          icon="arrowLeft"
          iconLeading
          onClick={() => goTo(Math.max(0, step - 1))}
          className={cn(step === 0 && "invisible")}
        >
          {s.previous}
        </Button>

        <p className="hidden text-xs text-ink-muted md:block">
          {step < TOTAL - 1 ? s.enterHint : d.forms.requiredHint}
        </p>

        {step < TOTAL - 1 ? (
          <Button
            variant="secondary"
            icon="arrowRight"
            onClick={next}
           
          >
            {s.next}
          </Button>
        ) : (
          <Button
            type="submit"
            disabled={pending}
            icon={pending ? undefined : "arrowRight"}
           
            onClick={(event) => {
              const found = stepFields.flatMap((_, index) => Object.entries(check(index)));
              if (!found.length) return;
              event.preventDefault();
              setErrors(Object.fromEntries(found));
              const firstBad = stepFields.findIndex((fields) => fields.some((f) => found.some(([k]) => k === f)));
              goTo(firstBad);
            }}
          >
            {pending ? d.forms.submitting : d.cta.requestQuote}
          </Button>
        )}
      </div>
    </div>
  );
}

/** Radio group drawn as selectable cards. The native radio stays in the DOM for keyboard and forms. */
function ChoiceGroup({
  name,
  legend,
  choices,
  selected,
  error,
  columns,
  visual,
}: {
  name: string;
  legend: string;
  choices: Choice[];
  selected?: string;
  error?: string;
  columns: string;
  visual?: (index: number) => React.ReactNode;
}) {
  const errorId = `${name}-choice-error`;
  return (
    <fieldset aria-describedby={error ? errorId : undefined} aria-invalid={error ? true : undefined}>
      <legend className="mb-3 text-sm font-medium text-ink-strong">
        {legend}
        <span className="ms-1 text-danger" aria-hidden="true">
          *
        </span>
      </legend>
      <div className={cn("grid gap-3", columns)}>
        {choices.map((choice, index) => (
          <label
            key={choice.value}
            className={cn(
              "relative flex cursor-pointer gap-3 rounded-xl border-2 bg-white p-4 transition-all duration-200",
              "hover:-translate-y-0.5 hover:border-glacier-300 hover:shadow-md",
              "has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-glacier-500",
              visual ? "flex-col" : "items-start",
              selected === choice.value
                ? "border-glacier-400 bg-glacier-50 shadow-[0_8px_24px_-12px_rgb(44_186_226/0.6)]"
                : error
                  ? "border-danger/50"
                  : "border-hairline",
            )}
          >
            <input
              type="radio"
              name={name}
              value={choice.value}
              defaultChecked={selected === choice.value}
              required
              className="sr-only"
            />
            {visual ? visual(index) : null}
            {choice.icon ? (
              <span
                className={cn(
                  "grid h-10 w-10 shrink-0 place-items-center rounded-lg transition-colors",
                  selected === choice.value ? "bg-glacier-400 text-navy-700" : "bg-ice text-glacier-600",
                )}
              >
                <Icon name={choice.icon} size={20} />
              </span>
            ) : null}
            <span className="min-w-0 flex-1 pe-6">
              <span className="block text-sm font-semibold text-ink-strong">{choice.value}</span>
              <span className="mt-0.5 block text-xs text-ink-muted">{choice.hint}</span>
            </span>
            <span
              aria-hidden="true"
              className={cn(
                "absolute end-3 top-3 grid h-5 w-5 place-items-center rounded-full transition-all",
                selected === choice.value
                  ? "scale-100 bg-glacier-400 text-navy-700"
                  : "scale-75 border-2 border-hairline-strong bg-white text-transparent",
              )}
            >
              <Icon name="check" size={16} className="scale-75" />
            </span>
          </label>
        ))}
      </div>
      {error ? (
        <p id={errorId} className="mt-2 flex items-start gap-1.5 text-sm text-danger">
          <Icon name="alert" size={16} className="mt-0.5" />
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}

/** Small cabinet sketch that shows how much of the unit carries the brand. */
function BrandingArt({ level }: { level: number }) {
  const wrap = level >= 2;
  const canopy = level >= 1;
  const lit = level === 3;
  return (
    <svg viewBox="0 0 64 80" aria-hidden="true" className="mx-auto h-20 w-auto">
      {lit ? <rect x="6" y="2" width="52" height="18" rx="6" className="fill-glacier-300/50" /> : null}
      <rect
        x="12"
        y="6"
        width="40"
        height="70"
        rx="4"
        className={cn("stroke-navy-700/40", wrap ? "fill-navy-700" : "fill-white")}
        strokeWidth="1.5"
      />
      <rect
        x="12"
        y="6"
        width="40"
        height="11"
        rx="4"
        className={canopy ? (lit ? "fill-glacier-300" : "fill-glacier-400") : "fill-surface-muted"}
      />
      <rect x="17" y="21" width="30" height="44" rx="2" className="fill-ice stroke-navy-700/25" strokeWidth="1" />
      {[31, 41, 51].map((y) => (
        <line key={y} x1="19" x2="45" y1={y} y2={y} className="stroke-navy-700/25" strokeWidth="1" />
      ))}
    </svg>
  );
}
