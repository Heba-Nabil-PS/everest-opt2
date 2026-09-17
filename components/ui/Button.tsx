import Link from "next/link";
import { cn } from "@/lib/utils";
import { Icon, type IconName } from "./Icon";

type Variant = "primary" | "secondary" | "ghost" | "inverse" | "quiet" | "glass";
type Size = "sm" | "md" | "lg";

/* Pill-shaped everywhere: the Aurora glass language uses fully rounded controls. */
const base =
  "group relative inline-flex items-center justify-center gap-2 font-medium " +
  "rounded-full transition-[transform,background-color,border-color,box-shadow,color] " +
  "duration-200 ease-[var(--ease-out-soft)] " +
  "active:scale-[0.98] disabled:pointer-events-none disabled:opacity-55 " +
  "focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-glacier-500";

const variants: Record<Variant, string> = {
  /* Glacier cyan on navy text — 6.4:1, the only primary CTA treatment. */
  primary:
    "bg-glacier-400 text-navy-700 shadow-[0_6px_20px_-6px_rgb(44_186_226/0.6)] " +
    "hover:bg-glacier-300 hover:shadow-[0_10px_28px_-8px_rgb(44_186_226/0.75)]",
  secondary:
    "bg-navy-700 text-white shadow-sm hover:bg-navy-600 hover:shadow-md",
  ghost:
    "border border-hairline-strong bg-white/70 text-ink-strong backdrop-blur-sm " +
    "hover:border-glacier-400 hover:bg-white",
  inverse:
    "border border-white/25 bg-white/10 text-white backdrop-blur-sm " +
    "hover:border-white/45 hover:bg-white/20",
  quiet:
    "text-glacier-600 underline decoration-glacier-400/50 underline-offset-4 " +
    "hover:decoration-glacier-500 hover:text-glacier-700",
  /* Frosted control for dark Aurora grounds. */
  glass:
    "glass-chip text-white hover:border-glacier-300/60 hover:bg-white/15",
};

const sizes: Record<Size, string> = {
  /* Every size clears the 44px minimum touch target. */
  sm: "min-h-11 px-4 text-sm",
  md: "min-h-12 px-5 text-[0.9375rem]",
  lg: "min-h-14 px-7 text-base",
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  icon?: IconName;
  /** Place the icon before the label instead of after it. */
  iconLeading?: boolean;
  fullWidth?: boolean;
  className?: string;
  children: React.ReactNode;
}

type ButtonProps = CommonProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps>;

type LinkButtonProps = CommonProps &
  Omit<React.ComponentProps<typeof Link>, keyof CommonProps | "href"> & {
    href: string;
    external?: boolean;
  };

function content(
  children: React.ReactNode,
  icon: IconName | undefined,
  iconLeading: boolean,
  variant: Variant,
) {
  const glyph = icon ? (
    <Icon
      name={icon}
      size={20}
      className={cn(
        "transition-transform duration-200 ease-[var(--ease-out-soft)]",
        variant !== "quiet" &&
          (iconLeading
            ? "group-hover:-translate-x-0.5 rtl:group-hover:translate-x-0.5"
            : "group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5"),
        /* Directional glyphs must flip in RTL, symmetric ones must not. */
        icon.startsWith("arrow") || icon.startsWith("chevron") ? "rtl:-scale-x-100" : "",
      )}
    />
  ) : null;

  return (
    <>
      {iconLeading && glyph}
      <span>{children}</span>
      {!iconLeading && glyph}
    </>
  );
}

export function Button({
  variant = "primary",
  size = "md",
  icon,
  iconLeading = false,
  fullWidth,
  className,
  children,
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(base, variants[variant], sizes[size], fullWidth && "w-full", className)}
      {...rest}
    >
      {content(children, icon, iconLeading, variant)}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  icon,
  iconLeading = false,
  fullWidth,
  className,
  children,
  href,
  external,
  ...rest
}: LinkButtonProps) {
  const externalProps = external
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <Link
      href={href}
      className={cn(base, variants[variant], sizes[size], fullWidth && "w-full", className)}
      {...externalProps}
      {...rest}
    >
      {content(children, icon, iconLeading, variant)}
    </Link>
  );
}
