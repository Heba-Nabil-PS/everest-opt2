"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";
import { DOT_STEP, DOT_TOP_LAT, landRows } from "@/lib/data/world-dots";
import type { Locale } from "@/lib/i18n/config";
import type { FactoryStatus, Market } from "@/lib/data/types";

type Status = Market["status"];

const W = 360 / DOT_STEP;
const H = landRows.length;

/** Equirectangular lon/lat → map units (one unit per dot). */
const toXY = (lon: number, lat: number) => ({ x: (lon + 180) / DOT_STEP, y: (DOT_TOP_LAT - lat) / DOT_STEP });

/** `market.position` is stored as a percentage of a 360×180 box. */
const marketXY = (m: Market) => toXY(m.position.x * 3.6 - 180, 90 - m.position.y * 1.8);

const views = {
  world: { cx: W / 2, cy: H / 2, scale: 1 },
  region: (() => {
    const a = toXY(18, 42);
    const b = toXY(92, 2);
    return {
      cx: (a.x + b.x) / 2,
      cy: (a.y + b.y) / 2,
      scale: Math.min(W / (b.x - a.x), H / (b.y - a.y)),
    };
  })(),
};

const statusStyle: Record<Status, { dot: string; ring: string; pill: string }> = {
  established: { dot: "#2cbae2", ring: "#2cbae2", pill: "bg-glacier-400 text-navy-900" },
  growth: { dot: "#b0e8fa", ring: "#74d7f2", pill: "bg-glacier-200 text-navy-900" },
  future: { dot: "transparent", ring: "#a9b4cc", pill: "border border-white/40 text-white" },
};

/**
 * Interactive market map: a dotted Natural Earth landmass, arcs drawn from
 * the Sharjah head office to every market, and markers that reveal the local
 * contact on hover, focus or tap. A world / region toggle zooms into the
 * cluster of Gulf and South Asian markets. The chip list under the map is the
 * keyboard- and screen-reader-friendly equivalent of the markers.
 */
export function WorldMap({
  markets,
  locale,
  statusLabels,
  factoryLabels,
  tiers = true,
  className,
  labelledBy,
  label,
  regionLabel = locale === "ar" ? "الشرق الأوسط وآسيا" : "Middle East & Asia",
  worldLabel = locale === "ar" ? "العالم" : "World",
}: {
  markets: Market[];
  locale: Locale;
  statusLabels: Record<Status, string>;
  /** When given, markets with a plant show it in the card and get a factory ring on the map. */
  factoryLabels?: Record<FactoryStatus, string>;
  /** False shows every current market alike, with no established / growth tag;
      markets not yet entered keep their "next horizon" styling and tag. */
  tiers?: boolean;
  className?: string;
  labelledBy?: string;
  label?: string;
  regionLabel?: string;
  worldLabel?: string;
}) {
  const [view, setView] = useState<keyof typeof views>("world");
  const [active, setActive] = useState<string>(markets.find((m) => m.contact)?.country ?? markets[0].country);
  const [drawn, setDrawn] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  /* Draw the arcs the first time the map scrolls into view. */
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setDrawn(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const dots = useMemo(
    () =>
      landRows.flatMap((row, y) =>
        row ? row.split(",").map((col) => ({ x: Number(col) + 0.5, y: y + 0.5 })) : [],
      ),
    [],
  );

  const tierOf = (m: Market): Status => (tiers || m.status === "future" ? m.status : "established");
  const tagOf = (m: Market) => (tiers || m.status === "future" ? statusLabels[m.status] : null);

  const hub = markets.find((m) => m.country === "AE") ?? markets[0];
  const hubXY = marketXY(hub);
  const { cx, cy, scale } = views[view];
  const transform = `translate(${W / 2 - cx * scale} ${H / 2 - cy * scale}) scale(${scale})`;
  const k = 1 / Math.sqrt(scale); // keep markers readable when zoomed

  const current = markets.find((m) => m.country === active)!;
  const currentXY = marketXY(current);
  /* Tooltip position in % of the rendered map, after the zoom transform. */
  const tipLeft = ((W / 2 - cx * scale + currentXY.x * scale) / W) * 100;
  const tipTop = ((H / 2 - cy * scale + currentXY.y * scale) / H) * 100;
  const tipVisible = tipLeft > 0 && tipLeft < 100 && tipTop > 0 && tipTop < 100;
  /* Markers in the upper half show their card below, so it never leaves the map. */
  const tipBelow = tipTop < 50;

  return (
    <div ref={ref} className={cn("relative", className)}>
      {/* View toggle */}
      <div className="mb-3 flex justify-end">
      <div className="flex rounded-full border border-white/15 bg-navy-950/60 p-1 text-xs backdrop-blur-md">
        {(["world", "region"] as const).map((key) => (
          <button
            key={key}
            type="button"
            aria-pressed={view === key}
            onClick={() => setView(key)}
            className={cn(
              "inline-flex min-h-8 items-center gap-1.5 rounded-full px-3 font-medium transition-colors",
              view === key ? "bg-glacier-400 text-navy-900" : "text-white/75 hover:text-white",
            )}
          >
            <Icon name={key === "world" ? "globe" : "pin"} size={16} />
            {key === "world" ? worldLabel : regionLabel}
          </button>
        ))}
      </div>
      </div>

      <div dir="ltr" className="relative rounded-xl">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="h-auto w-full"
          role="img"
          aria-labelledby={labelledBy}
          aria-label={labelledBy ? undefined : label}
        >
          <defs>
            <radialGradient id="wm-glow" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0%" stopColor="#2cbae2" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#2cbae2" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="wm-arc" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#2cbae2" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#74d7f2" stopOpacity="1" />
            </linearGradient>
          </defs>

          <g
            transform={transform}
            style={{ transition: "transform 900ms cubic-bezier(0.22, 1, 0.36, 1)" }}
          >
            {dots.map((dot) => (
              <circle key={`${dot.x}-${dot.y}`} cx={dot.x} cy={dot.y} r={0.36} fill="#6d8dbc" fillOpacity={0.42} />
            ))}

            {/* Arcs from the head office */}
            {markets
              .filter((m) => m.country !== hub.country)
              .map((m, index) => {
                const p = marketXY(m);
                const mx = (hubXY.x + p.x) / 2;
                const my = Math.min(hubXY.y, p.y) - Math.hypot(p.x - hubXY.x, p.y - hubXY.y) * 0.35;
                const length = Math.hypot(p.x - hubXY.x, p.y - hubXY.y) * 1.4 + 4;
                const highlighted = m.country === active;
                return (
                  <path
                    key={m.country}
                    d={`M${hubXY.x} ${hubXY.y} Q${mx} ${my} ${p.x} ${p.y}`}
                    fill="none"
                    stroke="#74d7f2"
                    strokeWidth={(highlighted ? 0.6 : 0.4) * k}
                    strokeOpacity={highlighted ? 1 : 0.8}
                    strokeDasharray={m.status === "future" ? `${1 * k} ${0.8 * k}` : length}
                    strokeDashoffset={m.status === "future" ? 0 : drawn ? 0 : length}
                    style={{
                      transition: `stroke-dashoffset 1400ms ${200 + index * 160}ms cubic-bezier(0.22, 1, 0.36, 1), stroke-width 300ms`,
                      opacity: drawn || m.status !== "future" ? 1 : 0,
                    }}
                  />
                );
              })}

            {/* Markers */}
            {markets.map((m) => {
              const p = marketXY(m);
              const style = statusStyle[tierOf(m)];
              const isActive = m.country === active;
              return (
                <g
                  key={m.country}
                  role="button"
                  tabIndex={0}
                  aria-label={tagOf(m) ? `${m.name[locale]} — ${tagOf(m)}` : m.name[locale]}
                  aria-pressed={isActive}
                  onMouseEnter={() => setActive(m.country)}
                  onFocus={() => setActive(m.country)}
                  onClick={() => setActive(m.country)}
                  className="cursor-pointer outline-none"
                >
                  {/* Generous invisible hit area */}
                  <circle cx={p.x} cy={p.y} r={3 * k} fill="transparent" />
                  {m.status !== "future" ? (
                    <circle cx={p.x} cy={p.y} r={4 * k} fill="url(#wm-glow)" className="wm-pulse" style={{ transformOrigin: `${p.x}px ${p.y}px` }} />
                  ) : null}
                  {m.factory && factoryLabels ? (
                    <rect
                      x={p.x - 2.1 * k}
                      y={p.y - 2.1 * k}
                      width={4.2 * k}
                      height={4.2 * k}
                      rx={0.8 * k}
                      fill="none"
                      stroke="#ffffff"
                      strokeOpacity={isActive ? 0.9 : 0.45}
                      strokeWidth={0.25 * k}
                      strokeDasharray={m.factory.status === "planned" ? `${0.6 * k} ${0.5 * k}` : undefined}
                    />
                  ) : null}
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={(isActive ? 1.5 : 1.1) * k}
                    fill={style.dot}
                    stroke={isActive ? "#ffffff" : style.ring}
                    strokeWidth={0.35 * k}
                    strokeDasharray={m.status === "future" ? `${0.5 * k} ${0.4 * k}` : undefined}
                    style={{ transition: "r 250ms" }}
                  />
                </g>
              );
            })}
          </g>
        </svg>

        {/* Tooltip */}
        {tipVisible ? (
          <div
            className={cn(
              "pointer-events-none absolute z-10 w-60 -translate-x-1/2 transition-[left,top] duration-500 ease-[var(--ease-out-soft)]",
              tipBelow ? "pt-3" : "-translate-y-full pb-3",
            )}
            style={{ left: `${Math.min(Math.max(tipLeft, 18), 82)}%`, top: `${tipTop}%` }}
            dir={locale === "ar" ? "rtl" : "ltr"}
          >
            <div key={active} className="anim-rise rounded-xl border border-white/15 bg-navy-950/90 p-3.5 text-start shadow-xl backdrop-blur-md">
              <div className="flex items-center justify-between gap-2">
                <p className="font-display text-sm font-semibold text-white">{current.name[locale]}</p>
                {tagOf(current) ? (
                  <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-2xs font-semibold", statusStyle[current.status].pill)}>
                    {tagOf(current)}
                  </span>
                ) : null}
              </div>
              {current.factory && factoryLabels ? (
                <div className="mt-2 rounded-lg bg-white/[0.06] p-2 text-xs">
                  <p className="flex items-center gap-1.5 font-medium text-white">
                    <Icon name="factory" size={16} className="text-glacier-300" />
                    {current.factory.role[locale]}
                  </p>
                  <p className="mt-0.5 text-white/60">{factoryLabels[current.factory.status]}</p>
                </div>
              ) : null}
              {current.contact ? (
                <div className="mt-2 space-y-1 text-xs text-white/75">
                  <p className="flex items-center gap-1.5">
                    <Icon name="building" size={16} className="text-glacier-300" />
                    {current.contact.label[locale]}
                  </p>
                  {current.contact.email ? (
                    <p className="ltr-inline flex items-center gap-1.5">
                      <Icon name="mail" size={16} className="text-glacier-300" />
                      {current.contact.email}
                    </p>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>

      {/* Accessible, clickable list of the same markers */}
      <ul className="mt-4 flex flex-wrap gap-2">
        {markets.map((m) => (
          <li key={m.country}>
            <button
              type="button"
              aria-pressed={m.country === active}
              onClick={() => {
                setActive(m.country);
                if (m.status === "future") setView("world");
              }}
              onMouseEnter={() => setActive(m.country)}
              className={cn(
                "inline-flex min-h-9 items-center gap-2 rounded-full border px-3 text-xs font-medium transition-colors",
                m.country === active
                  ? "border-glacier-400 bg-glacier-400/15 text-white"
                  : "border-white/15 text-white/70 hover:border-white/40 hover:text-white",
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "h-2 w-2 rounded-full",
                  tierOf(m) === "established" && "bg-glacier-400",
                  tierOf(m) === "growth" && "bg-glacier-200",
                  m.status === "future" && "border border-dashed border-white/60",
                )}
              />
              {m.name[locale]}
              {m.factory && factoryLabels ? <Icon name="factory" size={16} className="text-glacier-300" /> : null}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
