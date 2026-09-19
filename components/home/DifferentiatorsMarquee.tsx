import { Icon, type IconName } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";
import type { Dictionary } from "@/lib/i18n";

const icons: IconName[] = ["wrench", "shield", "clock", "layers", "gauge", "calendar", "sparkle", "globe"];

/**
 * The eight differentiators as two glass ribbons drifting in opposite
 * directions — the site's one playful beat between chapters. The ribbons are
 * decorative duplicates (hidden from assistive tech); the real list is
 * rendered once for screen readers. They pause on hover and stop for
 * reduced motion.
 */
export function DifferentiatorsMarquee({ dictionary: d }: { dictionary: Dictionary }) {
  const items = d.home.differentiators.items;
  const rows = [items.slice(0, 4), items.slice(4)];

  return (
    <section aria-labelledby="differentiators-heading" className="relative overflow-hidden py-6 lg:py-10">
      <h2 id="differentiators-heading" className="sr-only">
        {d.home.differentiators.heading}
      </h2>
      <ul className="sr-only">
        {items.map((item) => (
          <li key={item.title}>
            {item.title}: {item.body}
          </li>
        ))}
      </ul>

      <div aria-hidden="true" className="flex -rotate-2 flex-col gap-4 [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="group flex overflow-hidden" dir="ltr">
            <div
              className={cn(
                "animate-marquee flex shrink-0 gap-4 pe-4 group-hover:[animation-play-state:paused]",
                rowIndex === 1 && "[animation-direction:reverse]",
              )}
              style={{ animationDuration: rowIndex === 0 ? "46s" : "54s" }}
            >
              {[...row, ...row, ...row, ...row].map((item, index) => {
                const iconIndex = items.indexOf(item);
                return (
                  <span
                    key={`${item.title}-${index}`}
                    /* Translucent fill, no backdrop blur: blurring dozens of
                       pills on one wide moving layer is costly and Chromium
                       stops painting part of it. */
                    className="inline-flex shrink-0 items-center gap-3 rounded-full border border-white/12 bg-white/[0.07] py-3 pe-7 ps-3 shadow-[inset_0_1px_0_rgb(255_255_255/0.12)]"
                  >
                    <span
                      className={cn(
                        "grid h-10 w-10 place-items-center rounded-full",
                        index % 2 ? "bg-white/10 text-glacier-300" : "bg-gradient-to-br from-glacier-400 to-steel-light text-navy-950",
                      )}
                    >
                      <Icon name={icons[iconIndex]} size={20} />
                    </span>
                    <span className="whitespace-nowrap font-display text-xl font-bold text-white lg:text-2xl">{item.title}</span>
                  </span>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
