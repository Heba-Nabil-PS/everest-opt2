"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon, type IconName } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

const icons: IconName[] = ["shield", "calendar", "wrench", "users"];
/* One real photograph per panel, so every service line — not only the
   first — carries a background image the way the featured card does. */
const images = ["/images/services-technician.jpg", "/images/gallery-warehouse.jpg", "/images/rnd-engineers.jpg", "/images/gallery-retail.jpg"];

/**
 * The four service lines as expanding glass panels. On desktop the panels sit
 * side by side; the one under the pointer (or keyboard focus) widens to show
 * its detail while the others narrow to a numbered spine (`flex-grow` on one
 * row of four). Every panel carries its own photograph, and the open one
 * brightens it to near its natural exposure while the closed ones sit back. On
 * phones every panel is simply open.
 */
export function ServicesPanels({
  items,
}: {
  items: { title: string; body: string; href: string }[];
}) {
  const [active, setActive] = useState(0);

  return (
    <ul className="flex flex-col gap-4 lg:h-[30rem] lg:flex-row">
      {items.map((item, index) => {
        const open = index === active;
        return (
          <li
            key={item.title}
            onMouseEnter={() => setActive(index)}
            onFocus={() => setActive(index)}
            className={cn(
              "relative min-w-0 transition-[flex-grow] duration-700 ease-[var(--ease-smooth)] lg:basis-0",
              open ? "lg:grow-[3.2]" : "lg:grow",
            )}
          >
            <Link
              href={item.href}
              data-cursor="view"
              className="glass-panel glass-spot group relative isolate flex h-full flex-col justify-between gap-8 overflow-hidden rounded-[1.75rem] p-6 no-underline lg:p-8"
            >
              <Image
                src={images[index]}
                alt=""
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className={cn(
                  "-z-10 object-cover transition-[opacity,transform] duration-700 ease-[var(--ease-smooth)]",
                  open ? "scale-105 opacity-85" : "opacity-50",
                )}
              />
              {/* Reading scrim: darker at the edges so text stays legible over any photo. */}
              <span aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-navy-950/92 via-navy-950/35 to-navy-950/25" />

              <div className="flex items-start justify-between gap-4">
                <span
                  className={cn(
                    "grid h-12 w-12 shrink-0 place-items-center rounded-2xl transition-colors duration-500",
                    open ? "bg-gradient-to-br from-glacier-400 to-[#7c5cff] text-navy-950" : "glass-chip text-glacier-300",
                  )}
                >
                  <Icon name={icons[index]} size={24} />
                </span>
                <span aria-hidden="true" className="tabular font-display text-sm font-bold text-white/40">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <div className="min-w-0">
                <h3 className={cn("text-xl text-white lg:text-2xl", !open && "lg:line-clamp-3 lg:text-xl")}>
                  {item.title}
                </h3>
                <p
                  className={cn(
                    "mt-3 max-w-[40ch] text-white/70 transition-[opacity,transform] duration-500 ease-[var(--ease-smooth)]",
                    open ? "lg:translate-y-0 lg:opacity-100" : "lg:pointer-events-none lg:absolute lg:translate-y-4 lg:opacity-0",
                  )}
                >
                  {item.body}
                </p>
                <span
                  aria-hidden="true"
                  className={cn(
                    "mt-6 inline-grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition-[background-color,color,transform] duration-500 group-hover:bg-glacier-400 group-hover:text-navy-950",
                    !open && "lg:hidden",
                  )}
                >
                  <Icon name="arrowRight" size={20} className="rtl:-scale-x-100" />
                </span>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
