import Image from "next/image";
import { Parallax } from "@/components/motion/Parallax";
import { cn } from "@/lib/utils";

const overlays = {
  /* Strong navy wash for long copy and forms on top of the photo. */
  deep: "bg-gradient-to-br from-navy-950/92 via-navy-900/82 to-navy-800/70",
  /* Lighter wash with a darker reading edge — for heroes with a short headline. */
  hero: "bg-gradient-to-r from-navy-950/90 via-navy-900/70 to-navy-900/30 rtl:bg-gradient-to-l",
  /* Bottom-weighted fade for cards whose text sits at the foot. */
  card: "bg-gradient-to-t from-navy-950/95 via-navy-950/65 to-navy-950/10",
} as const;

/**
 * Photograph used as a section ground. Decorative by definition — the section
 * copy carries the meaning — so the image is always hidden from assistive tech.
 * Place inside a `relative isolate` parent. Parallax is on by default: the
 * photo drifts slower than the page as the section scrolls past, settling
 * from a slight zoom (disabled automatically for reduced motion). Pass
 * `parallax={false}` where the backdrop is not on the scrolling page, such as
 * inside the mega menu.
 */
export function PhotoBackdrop({
  src,
  tone = "deep",
  priority,
  parallax = true,
  position = "center",
  className,
  imageClassName,
}: {
  src: string;
  tone?: keyof typeof overlays;
  priority?: boolean;
  parallax?: boolean;
  position?: string;
  className?: string;
  imageClassName?: string;
}) {
  const image = (
    <Image
      src={src}
      alt=""
      fill
      priority={priority}
      sizes="100vw"
      className={cn("object-cover", imageClassName)}
      style={{ objectPosition: position }}
    />
  );

  return (
    <div aria-hidden="true" className={cn("absolute inset-0 -z-10 overflow-hidden", className)}>
      {parallax ? (
        <Parallax amount={-14} scale={1.08} className="absolute inset-x-0 -top-[10%] h-[130%]">
          {image}
        </Parallax>
      ) : (
        image
      )}
      <div className={cn("absolute inset-0", overlays[tone])} />
    </div>
  );
}
