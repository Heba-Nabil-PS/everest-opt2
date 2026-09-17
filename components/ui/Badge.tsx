import { cn } from "@/lib/utils";
import { Icon, type IconName } from "./Icon";
import type { EnergyClass } from "@/lib/data/types";

type Tone = "neutral" | "accent" | "energy" | "inverse" | "outline";

const tones: Record<Tone, string> = {
  neutral: "bg-navy-50 text-navy-700",
  accent: "bg-glacier-100 text-glacier-800",
  energy: "bg-energy-soft text-energy",
  inverse: "bg-white/12 text-white",
  outline: "border border-hairline-strong text-ink-muted",
};

export function Badge({
  tone = "neutral",
  icon,
  children,
  className,
}: {
  tone?: Tone;
  icon?: IconName;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium",
        tones[tone],
        className,
      )}
    >
      {icon ? <Icon name={icon} size={16} /> : null}
      {children}
    </span>
  );
}

/**
 * Energy class carries meaning, so it is never communicated by colour alone —
 * the letter is always present and is what a screen reader announces.
 */
const energyTones: Record<EnergyClass, string> = {
  A: "bg-[#1e8e4f] text-white",
  B: "bg-[#4b9b3c] text-white",
  C: "bg-[#8a9b25] text-navy-900",
  D: "bg-[#c4901a] text-navy-900",
  E: "bg-[#c2661a] text-white",
};

export function EnergyBadge({
  value,
  label,
  className,
}: {
  value: EnergyClass;
  label: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-md py-1 pe-3 ps-1 text-xs font-medium",
        "border border-hairline bg-white text-ink",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "grid h-6 w-6 place-items-center rounded-sm font-display text-sm font-bold tabular",
          energyTones[value],
        )}
      >
        {value}
      </span>
      <span>
        {label}
        <span className="sr-only">: {value}</span>
      </span>
    </span>
  );
}

export function Chip({
  active,
  children,
  className,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={cn(
        "inline-flex min-h-11 items-center gap-2 whitespace-nowrap rounded-full border px-4 text-sm font-medium",
        "transition-colors duration-150 ease-[var(--ease-out-soft)]",
        active
          ? "border-glacier-400 bg-glacier-400 text-navy-700"
          : "border-hairline-strong bg-white text-ink-muted hover:border-glacier-400 hover:text-ink-strong",
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
