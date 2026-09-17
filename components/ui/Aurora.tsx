import { cn } from "@/lib/utils";

/**
 * The Aurora glass theme is applied site-wide: `app/[locale]/layout.tsx` puts
 * the `theme-aurora` class on `<body>` (which remaps every design token to
 * the dark glass palette, see globals.css) and renders one `<AuroraOrbs />`
 * behind all pages. There is no per-page wrapper to add — a new page is
 * themed automatically.
 */

/** Localised glow behind one element, for emphasis inside a section. */
export function Glow({ className, tone = "cyan" }: { className?: string; tone?: "cyan" | "violet" | "steel" }) {
  const colour = {
    cyan: "bg-[rgb(44_186_226/0.35)]",
    violet: "bg-[rgb(124_92_255/0.3)]",
    steel: "bg-[rgb(74_111_165/0.4)]",
  }[tone];
  return <span aria-hidden="true" className={cn("pointer-events-none absolute -z-10 rounded-full blur-3xl", colour, className)} />;
}
