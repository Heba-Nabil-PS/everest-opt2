"use client";

import { useId, useState } from "react";
import Image from "next/image";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Modal } from "@/components/ui/Modal";
import { ZoomStage } from "@/components/ui/ZoomStage";
import { cn } from "@/lib/utils";

export interface StructureItem {
  readonly title: string;
  readonly body: string;
  readonly points: readonly string[];
}

export interface StructureLabels {
  readonly zoomIn: string;
  readonly zoomOut: string;
  readonly resetZoom: string;
  readonly zoomHint: string;
  readonly closeDialog: string;
}

/**
 * The core structures as an explorer rather than a stack: a sticky index on
 * one side, the selected structure on the other. Eight commitments — one of
 * them carrying nine separate undertakings — stay inside a single screen, and
 * the certificate that evidences a structure sits with the structure itself.
 */
export function StructureExplorer({
  items,
  icons,
  certificates,
  viewLabel,
  labels,
  className,
}: {
  items: readonly StructureItem[];
  icons: readonly IconName[];
  /** Certificate image per item index; entries may be absent. */
  certificates: Record<number, string>;
  viewLabel: string;
  labels: StructureLabels;
  className?: string;
}) {
  const [active, setActive] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  const baseId = useId();
  const current = items[active];
  const certificate = certificates[active];

  /* Choosing a different structure closes a certificate left open on the
     previous one, so the dialog never outlives the panel that opened it. */
  const select = (index: number) => {
    setActive(index);
    setZoomOpen(false);
  };

  return (
    <div className={cn("grid gap-6 lg:grid-cols-[minmax(0,21rem)_1fr] lg:gap-8", className)}>
      {/* Index. Vertical and sticky on desktop; a scrolling rail of chips on
          narrow screens, where a sticky column would eat the viewport. */}
      <div
        role="tablist"
        aria-orientation="vertical"
        aria-label={current ? undefined : "structures"}
        className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 lg:mx-0 lg:sticky lg:top-28 lg:flex-col lg:self-start lg:overflow-visible lg:px-0 lg:pb-0"
      >
        {items.map((item, index) => {
          const isActive = index === active;
          return (
            <button
              key={item.title}
              type="button"
              role="tab"
              id={`${baseId}-tab-${index}`}
              aria-selected={isActive}
              aria-controls={`${baseId}-panel`}
              onClick={() => select(index)}
              className={cn(
                "group flex shrink-0 items-center gap-3 rounded-xl border p-3 text-start transition-colors duration-300 lg:w-full lg:shrink",
                isActive
                  ? "border-glacier-400/60 bg-glacier-400/10"
                  : "border-hairline hover:border-hairline-strong hover:bg-surface-sunken/60",
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "grid h-10 w-10 shrink-0 place-items-center rounded-lg transition-colors duration-300",
                  isActive
                    ? "bg-gradient-to-br from-glacier-400 to-steel text-white"
                    : "bg-surface-sunken text-glacier-600",
                )}
              >
                <Icon name={icons[index % icons.length]} size={20} />
              </span>

              <span className="min-w-0 flex-1">
                <span className="tabular block text-2xs font-semibold tracking-[0.16em] text-ink-muted">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span
                  className={cn(
                    "mt-0.5 block whitespace-nowrap font-display text-sm font-semibold leading-snug lg:whitespace-normal",
                    isActive ? "text-ink-strong" : "text-ink",
                  )}
                >
                  {item.title}
                </span>
              </span>

              <Icon
                name="chevronRight"
                size={16}
                aria-hidden="true"
                className={cn(
                  "hidden shrink-0 transition-opacity duration-300 lg:block rtl:-scale-x-100",
                  isActive ? "text-glacier-400 opacity-100" : "opacity-0",
                )}
              />
            </button>
          );
        })}
      </div>

      {/* Panel. A floor height keeps the section from jumping as the selected
          structure changes length. */}
      <div
        role="tabpanel"
        id={`${baseId}-panel`}
        aria-labelledby={`${baseId}-tab-${active}`}
        className="rounded-3xl border border-hairline bg-surface p-6 lg:min-h-[30rem] lg:p-9"
      >
        {current ? (
          /* Keyed on the title so the panel re-mounts and re-runs its
             entrance when a different structure is chosen. */
          <div key={current.title} className="anim-fade-in">
            <h3 className="text-2xl lg:text-3xl">{current.title}</h3>

            {/* Under the title the panel splits in half: the undertakings on
                one side, the certificate that evidences them on the other.
                Without a certificate the text takes the full width rather
                than sitting in a half-empty column. */}
            <div
              className={cn(
                "mt-6 grid gap-8",
                certificate && "lg:grid-cols-2 lg:items-stretch",
              )}
            >
              <div>
                <p className="max-w-[70ch] text-ink-muted">{current.body}</p>

                <ul
                  className={cn(
                    "mt-6 grid gap-3",
                    current.points.length > 4 && !certificate && "sm:grid-cols-2",
                  )}
                >
                  {current.points.map((point) => (
                    <li key={point} className="flex items-start gap-2.5 text-sm">
                      <Icon name="check" size={16} className="mt-0.5 shrink-0 text-energy" />
                      <span className="text-ink">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {certificate ? (
                <button
                  type="button"
                  onClick={() => setZoomOpen(true)}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-hairline bg-surface-sunken text-start transition-colors hover:border-glacier-400/60"
                >
                  {/* The document grows with the column, shown whole on a
                      light mount — it is a certificate, not a picture. */}
                  <span className="stage-light relative block min-h-80 flex-1 bg-white p-3">
                    <Image
                      src={certificate}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 34vw, 90vw"
                      className="object-contain p-3 transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                  </span>
                  <span className="flex items-center justify-between gap-2 px-4 py-3 text-sm font-semibold text-ink-strong group-hover:text-glacier-600">
                    {viewLabel}
                    <Icon name="search" size={16} className="text-glacier-500" />
                  </span>
                </button>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>

      {/* The certificate opens in place, at a size worth reading, rather than
          handing the visitor off to a raw image in another tab. */}
      {certificate && current ? (
        <Modal
          open={zoomOpen}
          onClose={() => setZoomOpen(false)}
          title={current.title}
          closeLabel={labels.closeDialog}
          size="xl"
        >
          <ZoomStage
            className="stage-light h-[68vh] w-full rounded-xl bg-white"
            hint={labels.zoomHint}
            labels={{
              zoomIn: labels.zoomIn,
              zoomOut: labels.zoomOut,
              reset: labels.resetZoom,
              close: labels.closeDialog,
            }}
            onClose={() => setZoomOpen(false)}
            initialScale={1}
            showClose={false}
          >
            <span className="relative block h-full w-full">
              <Image
                src={certificate}
                alt={current.title}
                fill
                sizes="90vw"
                className="object-contain p-4"
              />
            </span>
          </ZoomStage>
        </Modal>
      ) : null}
    </div>
  );
}
