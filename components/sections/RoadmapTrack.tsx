"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { Icon, type IconName } from "@/components/ui/Icon";
import { gsap, prefersReducedMotion, registerGsap } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface RoadmapItem {
  year: string;
  title: string;
  body: string;
  state: string;
}

const nodeIcons: IconName[] = ["check", "leaf", "globe"];

/**
 * Sustainability roadmap as an animated progress track. On scroll-in the track
 * draws from the first milestone, each node pops as the line reaches it, and
 * its card rises in. The finished layout is the server-rendered default, so it
 * reads correctly without JavaScript and for reduced motion.
 */
export function RoadmapTrack({
  items,
  doneLabel,
  targetLabel,
}: {
  items: readonly RoadmapItem[];
  doneLabel: string;
  targetLabel: string;
}) {
  const root = useRef<HTMLOListElement>(null);

  useGSAP(
    () => {
      registerGsap();
      const node = root.current;
      if (!node || prefersReducedMotion()) return;

      const q = gsap.utils.selector(node);
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: { trigger: node, start: "top 80%", once: true },
      });

      tl.fromTo(q('[data-track-fill="x"]'), { scaleX: 0 }, { scaleX: 1, duration: 1.6, ease: "power2.inOut" }, 0);
      tl.fromTo(q('[data-track-fill="y"]'), { scaleY: 0 }, { scaleY: 1, duration: 1.6, ease: "power2.inOut" }, 0);
      q("[data-step]").forEach((step, index) => {
        const at = 0.15 + index * 0.5;
        tl.fromTo(
          step.querySelector("[data-node]"),
          { scale: 0.3, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(2.2)" },
          at,
        );
        tl.fromTo(step.querySelector("[data-card]"), { y: 36, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, at + 0.15);
      });
    },
    { scope: root },
  );

  return (
    <ol ref={root} className="relative mt-16 grid gap-8 md:grid-cols-3 md:gap-6">
      {/* Track — vertical on phones, horizontal from md. Base rail + animated fill. */}
      <span aria-hidden="true" className="absolute bottom-10 start-8 top-8 w-1 -translate-x-1/2 rounded-full bg-hairline rtl:translate-x-1/2 md:hidden" />
      <span
        aria-hidden="true"
        data-track-fill="y"
        className="absolute bottom-10 start-8 top-8 w-1 origin-top -translate-x-1/2 rounded-full bg-gradient-to-b from-energy via-glacier-400 to-navy-500 rtl:translate-x-1/2 md:hidden"
      />
      <span aria-hidden="true" className="absolute inset-x-[16%] top-8 hidden h-1 -translate-y-1/2 rounded-full bg-hairline md:block" />
      <span
        aria-hidden="true"
        data-track-fill="x"
        className="absolute inset-x-[16%] top-8 hidden h-1 -translate-y-1/2 origin-left rounded-full bg-gradient-to-r from-energy via-glacier-400 to-navy-500 rtl:origin-right rtl:bg-gradient-to-l md:block"
      />

      {items.map((item, index) => {
        const done = item.state === "done";
        const final = index === items.length - 1;

        return (
          <li
            key={item.year}
            data-step
            className="group relative grid grid-cols-[4rem_1fr] items-start gap-5 md:grid-cols-1 md:justify-items-center md:gap-8"
          >
            {/* Node */}
            <span data-node aria-hidden="true" className="relative grid h-16 w-16 place-items-center">
              {done ? <span className="absolute inset-0 animate-ping rounded-full bg-energy/25" /> : null}
              <span
                className={cn(
                  "relative grid h-full w-full place-items-center rounded-full text-white ring-8 ring-surface transition-transform duration-500 ease-[var(--ease-spring)] group-hover:scale-110",
                  done
                    ? "bg-gradient-to-br from-[#34c77b] to-energy shadow-[0_12px_28px_-8px_rgb(30_142_79/0.6)]"
                    : final
                      ? "bg-gradient-to-br from-navy-500 to-navy-800 shadow-[0_12px_28px_-8px_rgb(35_34_91/0.6)]"
                      : "bg-gradient-to-br from-glacier-400 to-glacier-600 shadow-[0_12px_28px_-8px_rgb(44_186_226/0.6)]",
                )}
              >
                <Icon name={nodeIcons[index % nodeIcons.length]} size={24} />
              </span>
            </span>

            {/* Card */}
            <article
              data-card
              className={cn(
                "relative w-full overflow-hidden rounded-3xl border p-7 shadow-md transition-[transform,box-shadow] duration-300 ease-[var(--ease-out-soft)] group-hover:-translate-y-1 group-hover:shadow-xl",
                final ? "bg-deep border-white/10 text-white" : "border-hairline bg-surface",
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "absolute inset-x-0 top-0 h-1",
                  done ? "bg-energy" : final ? "bg-gradient-to-r from-glacier-400 to-steel" : "bg-glacier-400",
                )}
              />
              {final ? (
                <div aria-hidden="true" className="absolute -end-16 -top-16 h-48 w-48 rounded-full bg-glacier-400/20 blur-3xl" />
              ) : null}

              <span
                className={cn(
                  "relative inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-2xs font-semibold uppercase tracking-[0.14em]",
                  done
                    ? "bg-energy-soft text-energy"
                    : final
                      ? "bg-white/10 text-glacier-300"
                      : "bg-glacier-100 text-glacier-700",
                )}
              >
                <span className={cn("h-1.5 w-1.5 rounded-full", done ? "bg-energy" : "animate-pulse bg-current")} />
                {done ? doneLabel : targetLabel}
              </span>

              <p
                className={cn(
                  "tabular relative mt-4 font-display text-5xl font-bold leading-none",
                  final
                    ? "text-white"
                    : "bg-gradient-to-br from-navy-700 to-glacier-500 bg-clip-text text-transparent",
                )}
              >
                {item.year}
              </p>
              <h3 className={cn("relative mt-3 text-xl", final && "text-white")}>{item.title}</h3>
              <p className={cn("relative mt-2 text-sm", final ? "text-ink-inverse-muted" : "text-ink-muted")}>
                {item.body}
              </p>
            </article>
          </li>
        );
      })}
    </ol>
  );
}
