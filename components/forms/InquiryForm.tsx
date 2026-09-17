"use client";

import { useActionState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Honeypot } from "./Field";
import { submitInquiry } from "@/lib/forms/actions";
import { emptyFormState, type FormState } from "@/lib/forms/validate";
import type { InquiryKind } from "@/lib/forms/deliver";
import type { Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

interface InquiryFormProps {
  kind: InquiryKind;
  locale: Locale;
  dictionary: Dictionary;
  submitLabel: string;
  /** Rendered with the current errors so each field can show its own message. */
  children: (state: FormState, pending: boolean) => React.ReactNode;
  /** The children render their own submit control (e.g. a multi-step wizard). */
  hideSubmit?: boolean;
  /** Values carried with the submission but not edited by the visitor. */
  hidden?: Record<string, string>;
  /** Rendered inside the success panel — e.g. the download the form unlocks. */
  successExtra?: React.ReactNode;
  /** Resets the form after a send. Defaults to reloading the page, which is
   *  wrong inside a dialog — there the parent remounts the form instead. */
  onSendAnother?: () => void;
  inverse?: boolean;
  className?: string;
}

/**
 * Every form on the site runs through this component: one validation path, one
 * error-summary pattern, one success state that names who replies and when.
 * It posts to a server action, so it still works with JavaScript disabled.
 */
export function InquiryForm({
  kind,
  locale,
  dictionary: d,
  submitLabel,
  children,
  hidden,
  successExtra,
  onSendAnother,
  hideSubmit,
  inverse,
  className,
}: InquiryFormProps) {
  const [state, formAction, pending] = useActionState(submitInquiry, emptyFormState);
  const summaryRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  /* After a failed submit, move focus to the summary so the reason is heard. */
  useEffect(() => {
    if (state.status === "error") summaryRef.current?.focus();
    if (state.status === "success") successRef.current?.focus();
  }, [state]);

  if (state.status === "success") {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        className={cn(
          "flex flex-col items-start gap-4 rounded-xl border p-8 outline-none",
          inverse
            ? "border-white/15 bg-white/[0.06] text-white"
            : "border-energy/30 bg-energy-soft",
          className,
        )}
      >
        <span className="grid h-12 w-12 place-items-center rounded-full bg-energy text-white">
          <Icon name="check" size={24} />
        </span>
        <h3 className={cn("text-xl", inverse && "text-white")}>{d.forms.successTitle}</h3>
        <p className={inverse ? "text-ink-inverse-muted" : "text-ink"}>{d.forms.successBody}</p>
        {successExtra}
        <Button
          variant={inverse ? "inverse" : "ghost"}
          onClick={() => (onSendAnother ? onSendAnother() : window.location.reload())}
          size="sm"
        >
          {d.forms.successAnother}
        </Button>
      </div>
    );
  }

  return (
    <form action={formAction} noValidate className={cn("flex flex-col gap-6", className)}>
      <input type="hidden" name="kind" value={kind} />
      <input type="hidden" name="locale" value={locale} />
      {hidden
        ? Object.entries(hidden).map(([name, value]) => (
            <input key={name} type="hidden" name={name} value={value} />
          ))
        : null}
      <Honeypot />

      {state.status === "error" ? (
        <div
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          className="flex items-start gap-3 rounded-lg border border-danger/40 bg-[#fdf6f6] p-4 outline-none"
        >
          <Icon name="alert" size={20} className="mt-0.5 shrink-0 text-danger" />
          <div>
            <p className="font-medium text-danger">{d.forms.errorTitle}</p>
            {state.message ? <p className="mt-1 text-sm text-ink">{state.message}</p> : null}
          </div>
        </div>
      ) : null}

      {children(state, pending)}

      {hideSubmit ? null : (
        <div className="flex flex-wrap items-center gap-4">
          <Button type="submit" size="lg" disabled={pending} icon={pending ? undefined : "arrowRight"}>
            {pending ? d.forms.submitting : submitLabel}
          </Button>
          <p className={cn("text-xs", inverse ? "text-ink-inverse-muted" : "text-ink-muted")}>
            {d.forms.requiredHint}
          </p>
        </div>
      )}
    </form>
  );
}
