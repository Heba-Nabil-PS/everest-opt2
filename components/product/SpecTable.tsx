import { EnergyBadge } from "@/components/ui/Badge";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/utils";
import type { Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n/config";
import type { Product } from "@/lib/data/types";

interface Row {
  label: string;
  value: React.ReactNode;
}

/**
 * The full specification, still an HTML table per brief §8 — but four short
 * tables instead of one long one.
 *
 * Seventeen rows stacked in a single column is a wall: a buyer checking the
 * refrigerant has to read past the shelving to find it. Grouping by the
 * question being asked (how big, how much power, how does it cool, what comes
 * with it) and laying the groups out two-up roughly halves the height and
 * makes the answer findable by heading rather than by scanning.
 *
 * Each group keeps its own `<table>` and caption, so the semantics a
 * screen reader and a crawler need survive the layout.
 *
 * Values that are numbers stay LTR inside Arabic so a buyer can compare two
 * models across languages without re-reading the digits.
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
  const months = locale === "ar" ? "شهراً" : "months";

  const groups: { title: string; icon: IconName; rows: Row[] }[] = [
    {
      title: d.specs.groups.size,
      icon: "box",
      rows: [
        { label: d.specs.capacity, value: <Value>{`${s.capacity} ${d.units.litres}`}</Value> },
        { label: d.specs.netCapacity, value: <Value>{`${s.netCapacity} ${d.units.litres}`}</Value> },
        {
          label: d.specs.dimensions,
          value: (
            <Value>{`${s.dimensions.width} × ${s.dimensions.depth} × ${s.dimensions.height} ${d.units.mm}`}</Value>
          ),
        },
        { label: d.specs.netWeight, value: <Value>{`${s.netWeight} ${d.units.kg}`}</Value> },
        {
          label: d.specs.doors,
          value: <Value>{`${s.doors} ${s.doors === 1 ? d.units.doors : d.units.doorsPlural}`}</Value>,
        },
        { label: d.specs.shelves, value: s.shelves[locale] },
      ],
    },
    {
      title: d.specs.groups.energy,
      icon: "bolt",
      rows: [
        {
          label: d.specs.energyClass,
          value: <EnergyBadge value={s.energyClass} label={d.common.energyClass} />,
        },
        {
          label: d.specs.annualConsumption,
          value: <Value>{`${s.annualConsumption} ${d.units.kwh}`}</Value>,
        },
        { label: d.specs.lighting, value: s.lighting[locale] },
      ],
    },
    {
      title: d.specs.groups.cooling,
      icon: "snow",
      rows: [
        { label: d.specs.refrigerant, value: <Value>{s.refrigerant}</Value> },
        {
          label: d.specs.temperatureRange,
          value: (
            <Value>{`${s.temperatureRange.min} … ${s.temperatureRange.max} ${d.units.celsius}`}</Value>
          ),
        },
        { label: d.specs.climateClass, value: <Value>{s.climateClass}</Value> },
        { label: d.specs.defrost, value: s.defrost[locale] },
        { label: d.specs.controller, value: s.controller[locale] },
      ],
    },
    {
      title: d.specs.groups.support,
      icon: "shield",
      rows: [
        { label: d.specs.power, value: <Value>{s.power}</Value> },
        { label: d.specs.noiseLevel, value: <Value>{`${s.noiseLevel} ${d.units.db}`}</Value> },
        {
          label: d.specs.warranty,
          value: <Value>{`${s.warranty.unit} / ${s.warranty.compressor} ${months}`}</Value>,
        },
      ],
    },
  ];

  return (
    <Reveal as="div" stagger className={cn("grid gap-4 sm:grid-cols-2", className)}>
      {groups.map((group) => (
        <section
          key={group.title}
          className="glass-panel glass-hover flex h-full flex-col rounded-2xl p-5 lg:p-6"
        >
          <h3 className="flex items-center gap-2.5 text-2xs font-semibold uppercase tracking-[0.16em] text-glacier-300">
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-white/10">
              <Icon name={group.icon} size={16} />
            </span>
            {group.title}
          </h3>

          <table className="mt-4 w-full border-collapse text-start">
            <caption className="sr-only">{`${caption} — ${group.title}`}</caption>
            <tbody>
              {group.rows.map((row) => (
                <tr key={row.label} className="border-t border-white/8 align-baseline first:border-t-0">
                  <th
                    scope="row"
                    className="py-2.5 pe-4 text-start text-sm font-normal text-ink-muted"
                  >
                    {row.label}
                  </th>
                  <td className="py-2.5 text-end text-sm font-semibold text-ink-strong">
                    {row.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ))}
    </Reveal>
  );
}

/** Numerals and units keep Latin digits and LTR order in both languages. */
function Value({ children }: { children: React.ReactNode }) {
  return <span className="ltr-inline tabular">{children}</span>;
}
