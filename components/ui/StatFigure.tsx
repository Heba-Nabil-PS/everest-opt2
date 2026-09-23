import { Counter } from "@/components/motion/Counter";
import { cn } from "@/lib/utils";

/**
 * A counted figure with its suffix split in two: a unit (`M`, `K`) sets at
 * full size on the baseline, so "4M" reads as one number, while a mark (`+`,
 * `%`) rides small at the top of the line as a quiet annotation.
 */
export function StatFigure({
  value,
  suffix = "",
  locale,
  className,
}: {
  value: number;
  suffix?: string;
  locale: string;
  className?: string;
}) {
  const unit = suffix.replace(/[+%]/g, "");
  const mark = suffix.replace(/[^+%]/g, "");

  return (
    <span className={cn("ltr-inline tabular font-display leading-none", className)}>
      <Counter value={value} locale={locale} />
      {unit}
      {mark ? <span className="ms-0.5 align-top text-[0.5em] text-glacier-300">{mark}</span> : null}
    </span>
  );
}
