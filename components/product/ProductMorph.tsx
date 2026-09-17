import { ViewTransition } from "react";

/**
 * Names a product photograph for the route transition, so the photo on a card
 * morphs into the hero photo on the product page instead of cutting.
 *
 * A name may appear only once per page: pass `enabled={false}` wherever the
 * same model could be listed twice (related models next to the "next model"
 * link, for instance). Without View Transitions support it renders as-is.
 */
export function ProductMorph({
  slug,
  enabled = true,
  className,
  children,
}: {
  slug: string;
  enabled?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const frame = <div className={className}>{children}</div>;
  if (!enabled) return frame;

  return (
    <ViewTransition name={`product-${slug}`} share="morph" default="none">
      {frame}
    </ViewTransition>
  );
}
