import { EnergyBadge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import type { Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n/config";
import type { Product } from "@/lib/data/types";

/**
 * The full specification as an HTML table — never an image (brief §8). Values
 * that are numbers stay LTR inside Arabic so a buyer can compare two models
 * across languages without re-reading the digits.
 */
export function SpecTable({
  product,
  locale,
  dictionary: d,
  caption,
  className,
}: {
  product: Product;
  locale: Locale;
  dictionary: Dictionary;
  caption: string;
  className?: string;
}) {
  const s = product.specs;

  const rows: { label: string; value: React.ReactNode }[] = [
    { label: d.specs.capacity, value: <Value>{`${s.capacity} ${d.units.litres}`}</Value> },
    { label: d.specs.netCapacity, value: <Value>{`${s.netCapacity} ${d.units.litres}`}</Value> },
    {
      label: d.specs.doors,
      value: <Value>{`${s.doors} ${s.doors === 1 ? d.units.doors : d.units.doorsPlural}`}</Value>,
    },
    {
      label: d.specs.dimensions,
      value: (
        <Value>{`${s.dimensions.width} × ${s.dimensions.depth} × ${s.dimensions.height} ${d.units.mm}`}</Value>
      ),
    },
    { label: d.specs.netWeight, value: <Value>{`${s.netWeight} ${d.units.kg}`}</Value> },
    {
      label: d.specs.energyClass,
      value: <EnergyBadge value={s.energyClass} label={d.common.energyClass} />,
    },
    {
      label: d.specs.annualConsumption,
      value: <Value>{`${s.annualConsumption} ${d.units.kwh}`}</Value>,
    },
    { label: d.specs.refrigerant, value: <Value>{s.refrigerant}</Value> },
    {
      label: d.specs.temperatureRange,
      value: <Value>{`${s.temperatureRange.min} … ${s.temperatureRange.max} ${d.units.celsius}`}</Value>,
    },
    { label: d.specs.power, value: <Value>{s.power}</Value> },
    { label: d.specs.lighting, value: s.lighting[locale] },
    { label: d.specs.shelves, value: s.shelves[locale] },
    { label: d.specs.defrost, value: s.defrost[locale] },
    { label: d.specs.climateClass, value: <Value>{s.climateClass}</Value> },
    { label: d.specs.controller, value: s.controller[locale] },
    { label: d.specs.noiseLevel, value: <Value>{`${s.noiseLevel} ${d.units.db}`}</Value> },
    {
      label: d.specs.warranty,
      value: (
        <Value>{`${s.warranty.unit} / ${s.warranty.compressor} ${locale === "ar" ? "شهراً" : "months"}`}</Value>
      ),
    },
  ];

  return (
    <div className={cn("scroll-slim overflow-x-auto", className)}>
      <table className="w-full min-w-[30rem] border-collapse text-start">
        <caption className="sr-only">{caption}</caption>
        <tbody>
          {rows.map((row, index) => (
            <tr
              key={row.label}
              className={cn(
                "border-b border-hairline align-top",
                index % 2 === 1 && "bg-surface-muted",
              )}
            >
              <th
                scope="row"
                className="w-2/5 py-3.5 pe-6 ps-4 text-start text-sm font-medium text-ink-muted"
              >
                {row.label}
              </th>
              <td className="py-3.5 pe-4 text-sm font-medium text-ink-strong">{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Numerals and units keep Latin digits and LTR order in both languages. */
function Value({ children }: { children: React.ReactNode }) {
  return <span className="ltr-inline tabular">{children}</span>;
}
