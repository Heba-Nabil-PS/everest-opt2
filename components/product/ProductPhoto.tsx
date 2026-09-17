import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * A model photograph on a white studio ground. The shots are cut-outs of
 * different proportions, so the image is contained and padded rather than
 * cropped — a tall single door and a wide chest freezer both sit whole.
 */
export function ProductPhoto({
  src,
  alt,
  sizes,
  priority,
  className,
  imageClassName,
}: {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
  imageClassName?: string;
}) {
  return (
    /* `stage-light`: stays white inside the dark theme (the shots are on white). */
    <div className={cn("stage-light relative h-full w-full bg-white", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={cn("object-contain p-[6%]", imageClassName)}
      />
    </div>
  );
}
