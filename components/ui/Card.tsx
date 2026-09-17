import { cn } from "@/lib/utils";

/**
 * One card surface for the whole site. Cards in a grid must align on a single
 * baseline (brief §8), so every card is a full-height flex column and the
 * action row is pushed to the bottom with `mt-auto` rather than by padding.
 */
export function Card({
  as: Tag = "article",
  glass,
  interactive,
  inverse,
  cursor,
  className,
  children,
}: {
  as?: "article" | "div" | "li";
  glass?: boolean;
  interactive?: boolean;
  inverse?: boolean;
  /** Custom cursor state while over the card (see motion/Cursor). */
  cursor?: "view" | "drag";
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Tag
      data-cursor={cursor}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-xl",
        glass
          ? inverse
            ? "glass-dark"
            : "glass"
          : inverse
            ? "border border-white/12 bg-white/[0.04]"
            : "border border-hairline bg-surface shadow-xs",
        interactive &&
          "transition-[transform,box-shadow,border-color] duration-500 ease-[var(--ease-smooth)] " +
            "hover:-translate-y-1 hover:border-glacier-300 hover:shadow-lg " +
            "focus-within:-translate-y-1 focus-within:shadow-lg",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

export function CardBody({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("flex flex-1 flex-col gap-4 p-6", className)}>{children}</div>
  );
}

export function CardFooter({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("mt-auto flex flex-wrap items-center gap-3 pt-2", className)}>
      {children}
    </div>
  );
}

/**
 * Makes the whole card clickable while keeping one real link in the markup:
 * the anchor stays the accessible name and the pseudo-element covers the card.
 */
export const cardLinkOverlay =
  "after:absolute after:inset-0 after:z-10 after:content-['']";
