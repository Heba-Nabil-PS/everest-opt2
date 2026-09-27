import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion/Reveal";
import { TextReveal } from "@/components/motion/TextReveal";

type Ground = "surface" | "muted" | "frost" | "deep" | "ice";

const grounds: Record<Ground, string> = {
  surface: "bg-surface",
  muted: "bg-surface-muted",
  ice: "bg-ice",
  frost: "bg-frost",
  deep: "bg-deep text-white",
};

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  ground?: Ground;
  tight?: boolean;
  children: React.ReactNode;
}

export function Section({
  ground = "surface",
  tight,
  className,
  children,
  ...rest
}: SectionProps) {
  return (
    <section
      className={cn(
        "relative isolate",
        tight ? "section-tight" : "section",
        grounds[ground],
        className,
      )}
      {...rest}
    >
      {children}
    </section>
  );
}

export function Shell({
  wide,
  className,
  children,
}: {
  wide?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={cn(wide ? "shell-wide" : "shell", className)}>{children}</div>;
}

export function Eyebrow({
  children,
  inverse,
  className,
}: {
  children: React.ReactNode;
  inverse?: boolean;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "inline-flex items-center gap-2 text-2xs font-semibold uppercase tracking-[0.18em]",
        inverse ? "text-glacier-300" : "text-glacier-600",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "inline-block h-px w-6",
          inverse ? "bg-glacier-300/60" : "bg-glacier-400",
        )}
      />
      {children}
    </p>
  );
}

interface SectionHeadingProps {
  eyebrow?: string;
  /** Rendered heading level — headings are structure, never a size shortcut. */
  as?: "h1" | "h2" | "h3";
  title: React.ReactNode;
  intro?: React.ReactNode;
  inverse?: boolean;
  align?: "start" | "center";
  /** Display scale for section-opening statements. */
  size?: "default" | "display";
  /** Set false where the heading sits above the fold or inside an animated parent. */
  animate?: boolean;
  className?: string;
  /** Per-section tweaks to the title or intro, merged over the defaults. */
  titleClassName?: string;
  introClassName?: string;
  id?: string;
}

/**
 * The one section-heading pattern, and the site's typographic entrance: the
 * title's lines rise out of their masks as it scrolls in, and the eyebrow and
 * intro follow a beat later. Every section uses it, so the whole site shares
 * one reading rhythm.
 */
export function SectionHeading({
  eyebrow,
  as: Tag = "h2",
  title,
  intro,
  inverse,
  align = "start",
  size = "default",
  animate = true,
  className,
  titleClassName,
  introClassName,
  id,
}: SectionHeadingProps) {
  const titleClass = cn(
    size === "display"
      ? "max-w-[18ch] text-4xl leading-[1.05] tracking-[-0.015em] md:text-5xl lg:text-6xl"
      : "max-w-[22ch] text-3xl md:text-4xl",
    align === "center" && "max-w-[26ch]",
    inverse && "text-white",
    titleClassName,
  );

  const introNode = intro ? (
    <p
      className={cn(
        "max-w-[62ch] text-lg",
        inverse ? "text-ink-inverse-muted" : "text-ink-muted",
        introClassName,
      )}
    >
      {intro}
    </p>
  ) : null;

  return (
    <header
      className={cn(
        "flex flex-col gap-4",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      {eyebrow ? (
        animate ? (
          <Reveal animation="fade">
            <Eyebrow inverse={inverse}>{eyebrow}</Eyebrow>
          </Reveal>
        ) : (
          <Eyebrow inverse={inverse}>{eyebrow}</Eyebrow>
        )
      ) : null}

      {animate ? (
        <TextReveal as={Tag} id={id} className={titleClass}>
          {title}
        </TextReveal>
      ) : (
        <Tag id={id} className={titleClass}>
          {title}
        </Tag>
      )}

      {introNode ? (
        animate ? (
          <Reveal delay={0.15}>{introNode}</Reveal>
        ) : (
          introNode
        )
      ) : null}
    </header>
  );
}
