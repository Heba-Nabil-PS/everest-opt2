import Image from "next/image";
import { cn } from "@/lib/utils";
import logo from "@/public/brand/everest-logo.png";

/* Rendered heights. The wordmark is illustrated lettering, so it needs real
   height to stay legible. Widths follow from the fixed aspect ratio below. */
const sizes = {
  sm: { className: "h-12", srcSizes: "90px" },
  md: { className: "h-14", srcSizes: "100px" },
  lg: { className: "h-20", srcSizes: "140px" },
} as const;

/**
 * The official Everest lockup, taken from the brand guidelines deck and trimmed
 * of its transparent padding (the untouched file is everest-logo-source.png).
 *
 * The image is locked to its intrinsic aspect ratio and opted out of the global
 * `img { max-width: 100% }` rule. Without that, a crowded flex row could squeeze
 * the width while the height stayed fixed — which is what distorted it.
 *
 * On dark grounds `inverse` drops it straight onto the ground (no plate) with
 * a faint light halo, so the black outline and navy dome keep their edge.
 */
export function Logo({
  inverse,
  priority,
  size = "md",
  className,
  label = "Everest Industrial",
}: {
  inverse?: boolean;
  /** Set on the header instance: it is above the fold on every page. */
  priority?: boolean;
  size?: keyof typeof sizes;
  className?: string;
  label?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center self-start",
        inverse && "[filter:drop-shadow(0_0_1px_rgb(255_255_255/0.55))_drop-shadow(0_0_10px_rgb(116_215_242/0.18))]",
        className,
      )}
    >
      <Image
        src={logo}
        alt={label}
        priority={priority}
        quality={75}
        sizes={sizes[size].srcSizes}
        style={{ aspectRatio: `${logo.width} / ${logo.height}` }}
        className={cn("w-auto max-w-none shrink-0 object-contain", sizes[size].className)}
      />
    </span>
  );
}
