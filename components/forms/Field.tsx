"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";

interface BaseProps {
  name: string;
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  optionalSuffix?: string;
  defaultValue?: string;
  className?: string;
}

const controlClass =
  "min-h-12 w-full rounded-lg border bg-white px-4 text-base text-ink " +
  "transition-[border-color,box-shadow] duration-150 " +
  "placeholder:text-ink-muted/70 " +
  "focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-glacier-500";

function fieldState(error?: string) {
  return error
    ? "border-danger bg-[#fdf6f6]"
    : "border-hairline-strong hover:border-cool";
}

function Shell({
  id,
  label,
  error,
  hint,
  required,
  optionalSuffix,
  errorId,
  hintId,
  className,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  optionalSuffix?: string;
  errorId: string;
  hintId: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {/* Labels are always visible — a placeholder is not a label. */}
      <label htmlFor={id} className="text-sm font-medium text-ink-strong">
        {label}
        {required ? (
          <span className="ms-1 text-danger" aria-hidden="true">
            *
          </span>
        ) : optionalSuffix ? (
          <span className="ms-1 font-normal text-ink-muted">{optionalSuffix}</span>
        ) : null}
      </label>

      {hint ? (
        <p id={hintId} className="text-xs text-ink-muted">
          {hint}
        </p>
      ) : null}

      {children}

      {/* The error sits next to the field it belongs to, not only in a summary. */}
      {error ? (
        <p id={errorId} className="flex items-start gap-1.5 text-sm text-danger">
          <Icon name="alert" size={16} className="mt-0.5" />
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function TextField({
  type = "text",
  placeholder,
  autoComplete,
  ...props
}: BaseProps & {
  type?: "text" | "email" | "tel" | "date" | "number";
  placeholder?: string;
  autoComplete?: string;
}) {
  const id = useId();
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;

  return (
    <Shell id={id} errorId={errorId} hintId={hintId} {...props}>
      <input
        id={id}
        name={props.name}
        type={type}
        required={props.required}
        defaultValue={props.defaultValue}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={props.error ? true : undefined}
        aria-describedby={
          [props.error ? errorId : null, props.hint ? hintId : null].filter(Boolean).join(" ") ||
          undefined
        }
        className={cn(controlClass, fieldState(props.error))}
      />
    </Shell>
  );
}

export function TextArea({
  rows = 5,
  placeholder,
  ...props
}: BaseProps & { rows?: number; placeholder?: string }) {
  const id = useId();
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;

  return (
    <Shell id={id} errorId={errorId} hintId={hintId} {...props}>
      <textarea
        id={id}
        name={props.name}
        rows={rows}
        required={props.required}
        defaultValue={props.defaultValue}
        placeholder={placeholder}
        aria-invalid={props.error ? true : undefined}
        aria-describedby={
          [props.error ? errorId : null, props.hint ? hintId : null].filter(Boolean).join(" ") ||
          undefined
        }
        className={cn(
          controlClass,
          fieldState(props.error),
          "py-3 leading-relaxed",
          /* A deliberately short box keeps its asked-for height. */
          rows <= 3 ? "min-h-24" : "min-h-32",
        )}
      />
    </Shell>
  );
}

export function SelectField({
  options,
  placeholder,
  ...props
}: BaseProps & {
  options: { value: string; label: string }[];
  placeholder?: string;
}) {
  const id = useId();
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;

  return (
    <Shell id={id} errorId={errorId} hintId={hintId} {...props}>
      <div className="relative">
        <select
          id={id}
          name={props.name}
          required={props.required}
          defaultValue={props.defaultValue ?? ""}
          aria-invalid={props.error ? true : undefined}
          aria-describedby={
            [props.error ? errorId : null, props.hint ? hintId : null].filter(Boolean).join(" ") ||
            undefined
          }
          className={cn(controlClass, fieldState(props.error), "appearance-none pe-11")}
        >
          {placeholder ? (
            <option value="" disabled>
              {placeholder}
            </option>
          ) : null}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <Icon
          name="chevronDown"
          size={20}
          className="pointer-events-none absolute end-4 top-1/2 -translate-y-1/2 text-ink-muted"
        />
      </div>
    </Shell>
  );
}

export function FileField({
  accept,
  ...props
}: BaseProps & { accept?: string }) {
  const id = useId();
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;

  return (
    <Shell id={id} errorId={errorId} hintId={hintId} {...props}>
      <input
        id={id}
        name={props.name}
        type="file"
        accept={accept}
        required={props.required}
        aria-invalid={props.error ? true : undefined}
        aria-describedby={
          [props.error ? errorId : null, props.hint ? hintId : null].filter(Boolean).join(" ") ||
          undefined
        }
        className={cn(
          "w-full rounded-lg border border-dashed bg-white p-4 text-sm text-ink-muted",
          "file:me-4 file:rounded-md file:border-0 file:bg-navy-700 file:px-4 file:py-2.5",
          "file:text-sm file:font-medium file:text-white hover:file:bg-navy-600",
          props.error ? "border-danger" : "border-hairline-strong",
        )}
      />
    </Shell>
  );
}

export function CheckboxField({
  name,
  label,
  error,
  defaultChecked,
}: {
  name: string;
  label: string;
  error?: string;
  defaultChecked?: boolean;
}) {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-start gap-3">
        <input
          id={id}
          name={name}
          type="checkbox"
          defaultChecked={defaultChecked}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            "mt-0.5 h-6 w-6 shrink-0 rounded border-2 accent-glacier-500",
            error ? "border-danger" : "border-hairline-strong",
          )}
        />
        <label htmlFor={id} className="text-sm text-ink">
          {label}
        </label>
      </div>
      {error ? (
        <p id={errorId} className="flex items-start gap-1.5 ps-8 text-sm text-danger">
          <Icon name="alert" size={16} className="mt-0.5" />
          {error}
        </p>
      ) : null}
    </div>
  );
}

/** Hidden field that only bots fill in. Never announced, never focusable. */
export function Honeypot() {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
      <label htmlFor="company_website">Company website</label>
      <input id="company_website" name="company_website" type="text" tabIndex={-1} autoComplete="off" />
    </div>
  );
}
