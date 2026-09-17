"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { ProductCard } from "./ProductCard";
import { t, type Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n/config";
import type { Product, ProductCategory } from "@/lib/data/types";
import { cn } from "@/lib/utils";

type SortKey = "featured" | "capacityAsc" | "capacityDesc" | "energy" | "nameAsc";
type GroupKey = "type" | "capacity" | "doors" | "energyClass" | "refrigerant";
type Filters = Record<GroupKey, string[]>;

const emptyFilters: Filters = { type: [], capacity: [], doors: [], energyClass: [], refrigerant: [] };

const capacityBands = [
  { id: "0-250", label: "≤ 250", test: (c: number) => c <= 250 },
  { id: "251-500", label: "251–500", test: (c: number) => c > 250 && c <= 500 },
  { id: "501-1000", label: "501–1000", test: (c: number) => c > 500 && c <= 1000 },
  { id: "1001+", label: "> 1000", test: (c: number) => c > 1000 },
];

const desktopQuery = "(min-width: 1024px)";
const subscribeDesktop = (onChange: () => void) => {
  const media = window.matchMedia(desktopQuery);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
};
const getDesktop = () => window.matchMedia(desktopQuery).matches;

/** Subcategory slugs repeat across ranges (countertop, double door), so a type is keyed by both. */
const typeKey = (product: Pick<Product, "categorySlug" | "subcategory">) =>
  `${product.categorySlug}:${product.subcategory}`;

interface Option {
  value: string;
  label: React.ReactNode;
  /** Plain-text label for the active-filter pill. */
  text: string;
  count: number;
}

/**
 * Filterable model grid with a collapsible side panel. Every group folds on its
 * own and the whole panel can be hidden to give the grid full width. On small
 * screens the filters live in a slide-in drawer, opened from the toolbar or from
 * a floating button that appears once the toolbar scrolls away. Active filters
 * stay visible as removable pills above the grid, and the result count is
 * announced in a live region.
 */
export function ProductExplorer({
  products,
  categories,
  locale,
  dictionary: d,
  initialType,
}: {
  products: Product[];
  /** Categories whose formats appear in the Type group. */
  categories: ProductCategory[];
  locale: Locale;
  dictionary: Dictionary;
  /** Pre-selected subcategory slug, e.g. from `?type=single-door`. */
  initialType?: string;
}) {
  const [filters, setFilters] = useState<Filters>(() => ({
    ...emptyFilters,
    type: initialType
      ? [...new Set(products.filter((p) => p.subcategory === initialType).map(typeKey))]
      : [],
  }));
  const [sort, setSort] = useState<SortKey>("featured");
  /* Until the user toggles, the panel follows the breakpoint. On the server the
     breakpoint is unknown (null), and CSS alone shows the panel on desktop and
     hides it on mobile, so neither layout flashes before hydration. */
  const [override, setOverride] = useState<boolean | null>(null);
  const isDesktop = useSyncExternalStore(subscribeDesktop, getDesktop, () => null);
  const open = override ?? isDesktop;
  const setOpen = (update: (current: boolean | null) => boolean) => setOverride(update(open));

  /* Mobile: a drawer, plus a floating trigger shown while the grid is on screen
     but the toolbar is not. */
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [floating, setFloating] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const toolbar = toolbarRef.current;
    if (!root || !toolbar) return;
    let rootVisible = false;
    let toolbarVisible = true;
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === root) rootVisible = entry.isIntersecting;
        if (entry.target === toolbar) toolbarVisible = entry.isIntersecting;
      }
      setFloating(rootVisible && !toolbarVisible);
    });
    observer.observe(root);
    observer.observe(toolbar);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!drawerOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDrawerOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [drawerOpen]);

  /* The drawer is a phone/tablet pattern: drop it if the viewport grows to desktop. */
  if (isDesktop && drawerOpen) setDrawerOpen(false);

  const toggleFilters = () => {
    if (isDesktop) setOpen((current) => !current);
    else setDrawerOpen(true);
  };

  /* Mirror the type selection in the URL so a filtered range can be shared. */
  useEffect(() => {
    const url = new URL(window.location.href);
    const slugs = [...new Set(filters.type.map((key) => key.split(":")[1]))];
    if (slugs.length === 1) url.searchParams.set("type", slugs[0]);
    else url.searchParams.delete("type");
    window.history.replaceState(window.history.state, "", url);
  }, [filters.type]);

  const typeGroups = useMemo(
    () =>
      categories
        .map((category) => ({
          category,
          options: category.subcategories
            .map<Option>((sub) => {
              const value = `${category.slug}:${sub.slug}`;
              return {
                value,
                label: sub.name[locale],
                text: categories.length > 1 ? `${category.name[locale]} · ${sub.name[locale]}` : sub.name[locale],
                count: products.filter((p) => typeKey(p) === value).length,
              };
            })
            .filter((option) => option.count > 0),
        }))
        .filter((group) => group.options.length > 0),
    [categories, products, locale],
  );

  const groups = useMemo(() => {
    const countWhere = (test: (p: Product) => boolean) => products.filter(test).length;
    const unique = <T,>(values: T[]) => [...new Set(values)];
    const doors = unique(products.map((p) => p.specs.doors)).sort((a, b) => a - b);
    const energy = unique(products.map((p) => p.specs.energyClass)).sort();
    const refrigerants = unique(products.map((p) => p.specs.refrigerant)).sort();

    const result: { key: Exclude<GroupKey, "type">; label: string; options: Option[] }[] = [
      {
        key: "capacity",
        label: d.products.filters.capacity,
        options: capacityBands.map((band) => ({
          value: band.id,
          label: <span className="ltr-inline tabular">{band.label} {d.units.litres}</span>,
          text: `${band.label} ${d.units.litres}`,
          count: countWhere((p) => band.test(p.specs.capacity)),
        })),
      },
      {
        key: "doors",
        label: d.products.filters.doors,
        options: doors.map((n) => {
          const text = n === 0 ? d.products.filters.open : `${n} ${n === 1 ? d.units.doors : d.units.doorsPlural}`;
          return { value: String(n), label: text, text, count: countWhere((p) => p.specs.doors === n) };
        }),
      },
      {
        key: "energyClass",
        label: d.products.filters.energyClass,
        options: energy.map((value) => ({
          value,
          label: <span className="ltr-inline">{value}</span>,
          text: `${d.common.energyClass} ${value}`,
          count: countWhere((p) => p.specs.energyClass === value),
        })),
      },
      {
        key: "refrigerant",
        label: d.products.filters.refrigerant,
        options: refrigerants.map((value) => ({
          value,
          label: <span className="ltr-inline">{value}</span>,
          text: value,
          count: countWhere((p) => p.specs.refrigerant === value),
        })),
      },
    ];

    return result.filter((group) => group.options.filter((o) => o.count > 0).length > 1);
  }, [products, d]);

  const visible = useMemo(() => {
    const match = (values: string[], test: (value: string) => boolean) =>
      values.length === 0 || values.some(test);

    const filtered = products.filter(
      (p) =>
        match(filters.type, (v) => typeKey(p) === v) &&
        match(filters.capacity, (v) => capacityBands.find((b) => b.id === v)!.test(p.specs.capacity)) &&
        match(filters.doors, (v) => String(p.specs.doors) === v) &&
        match(filters.energyClass, (v) => p.specs.energyClass === v) &&
        match(filters.refrigerant, (v) => p.specs.refrigerant === v),
    );

    const sorters: Record<SortKey, (a: Product, b: Product) => number> = {
      featured: (a, b) => Number(b.featured) - Number(a.featured) || a.specs.capacity - b.specs.capacity,
      capacityAsc: (a, b) => a.specs.capacity - b.specs.capacity,
      capacityDesc: (a, b) => b.specs.capacity - a.specs.capacity,
      energy: (a, b) =>
        a.specs.annualConsumption / a.specs.capacity - b.specs.annualConsumption / b.specs.capacity,
      nameAsc: (a, b) => a.name.localeCompare(b.name),
    };

    return [...filtered].sort(sorters[sort]);
  }, [products, filters, sort]);

  const toggle = (key: GroupKey, value: string) =>
    setFilters((current) => ({
      ...current,
      [key]: current[key].includes(value)
        ? current[key].filter((v) => v !== value)
        : [...current[key], value],
    }));

  const clear = () => setFilters(emptyFilters);

  /* Flat list of active selections, for the removable pills. */
  const active = [
    ...typeGroups.flatMap((g) => g.options).filter((o) => filters.type.includes(o.value)).map((o) => ({ key: "type" as const, ...o })),
    ...groups.flatMap((g) => g.options.filter((o) => filters[g.key].includes(o.value)).map((o) => ({ key: g.key, ...o }))),
  ];

  const panel = (
    <div className="flex flex-col divide-y divide-hairline">
      {typeGroups.length > 0 ? (
        <FilterGroup label={d.products.filters.type} count={filters.type.length} defaultOpen>
          <div className="flex flex-col gap-4">
            {typeGroups.map(({ category, options }) => (
              <div key={category.slug}>
                {typeGroups.length > 1 ? (
                  <p className="mb-2 text-2xs font-semibold uppercase tracking-[0.14em] text-ink-muted">
                    {category.name[locale]}
                  </p>
                ) : null}
                <OptionList
                  options={options}
                  selected={filters.type}
                  onToggle={(value) => toggle("type", value)}
                />
              </div>
            ))}
          </div>
        </FilterGroup>
      ) : null}

      {groups.map((group, index) => (
        <FilterGroup
          key={group.key}
          label={group.label}
          count={filters[group.key].length}
          defaultOpen={index === 0}
        >
          <OptionList
            options={group.options}
            selected={filters[group.key]}
            onToggle={(value) => toggle(group.key, value)}
          />
        </FilterGroup>
      ))}
    </div>
  );

  return (
    <div ref={rootRef}>
      {/* Toolbar */}
      <div ref={toolbarRef} className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleFilters}
            aria-expanded={(isDesktop ? open : drawerOpen) ?? undefined}
            aria-controls={isDesktop ? "product-filter-panel" : "product-filter-drawer"}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-hairline-strong bg-white px-4 text-sm font-medium text-ink-strong transition-colors hover:border-glacier-400"
          >
            <Icon name="filter" size={16} className="text-glacier-600" />
            <span className="hidden lg:inline">
              {open === false ? d.products.filters.show : d.products.filters.hide}
            </span>
            <span className="lg:hidden">{d.common.filters}</span>
            {active.length > 0 ? (
              <span className="tabular grid h-5 min-w-5 place-items-center rounded-full bg-glacier-400 px-1.5 text-2xs font-bold text-navy-800">
                {active.length}
              </span>
            ) : null}
          </button>

          <p aria-live="polite" className="text-sm text-ink-muted">
            {t(d.common.showing, { shown: visible.length, total: products.length })}
          </p>
        </div>

        <label className="flex items-center gap-2 text-sm text-ink-muted">
          <span className="hidden sm:inline">{d.common.sortBy}</span>
          <span className="relative">
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as SortKey)}
              className="min-h-11 appearance-none rounded-full border border-hairline-strong bg-white pe-10 ps-4 text-sm font-medium text-ink-strong"
            >
              {(Object.keys(d.products.sort) as SortKey[]).map((key) => (
                <option key={key} value={key}>
                  {d.products.sort[key]}
                </option>
              ))}
            </select>
            <Icon
              name="chevronDown"
              size={16}
              className="pointer-events-none absolute end-3.5 top-1/2 -translate-y-1/2 text-ink-muted"
            />
          </span>
        </label>
      </div>

      {active.length > 0 ? (
        <ul className="mt-4 flex flex-wrap items-center gap-2">
          {active.map((item) => (
            <li key={`${item.key}-${item.value}`}>
              <button
                type="button"
                onClick={() => toggle(item.key, item.value)}
                className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-navy-700 py-1 pe-2 ps-3.5 text-xs font-medium text-white transition-colors hover:bg-navy-600"
              >
                {item.text}
                <Icon name="close" size={16} className="text-glacier-300" />
                <span className="sr-only">{d.products.filters.remove}</span>
              </button>
            </li>
          ))}
          <li>
            <button
              type="button"
              onClick={clear}
              className="inline-flex min-h-9 items-center px-2 text-xs font-semibold text-glacier-600 underline-offset-4 hover:underline"
            >
              {d.common.clearFilters}
            </button>
          </li>
        </ul>
      ) : null}

      <div
        className={cn(
          "mt-6 grid gap-8",
          open === false ? "lg:grid-cols-1" : "lg:grid-cols-[17rem_minmax(0,1fr)]",
        )}
      >
        {/* Panel — collapsible on every breakpoint */}
        <aside
          id="product-filter-panel"
          aria-label={d.common.filters}
          className={cn(
            "anim-rise",
            /* The inline panel is desktop-only; phones and tablets use the drawer. */
            open === false ? "hidden" : "hidden lg:block",
          )}
        >
          <div className="rounded-2xl border border-hairline bg-white px-5 shadow-xs lg:sticky lg:top-28">
            {panel}
          </div>
        </aside>

        <div className="min-w-0">
          {visible.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-hairline-strong bg-white p-12 text-center">
              <p className="font-display text-lg font-semibold text-ink-strong">{d.common.noMatches}</p>
              <p className="mt-2 text-ink-muted">{d.common.noMatchesHint}</p>
              <Button variant="ghost" className="mt-6" onClick={clear}>
                {d.common.clearFilters}
              </Button>
            </div>
          ) : (
            <ul
              className={cn(
                "grid grid-cols-1 gap-6 sm:grid-cols-2",
                open === false ? "lg:grid-cols-3" : "2xl:grid-cols-3",
              )}
            >
              {visible.map((product) => (
                <li key={product.slug} className="h-full">
                  <ProductCard product={product} locale={locale} dictionary={d} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Floating trigger — phones and tablets, pinned to the start edge */}
      <button
        type="button"
        onClick={() => setDrawerOpen(true)}
        aria-expanded={drawerOpen}
        aria-controls="product-filter-drawer"
        tabIndex={floating ? 0 : -1}
        aria-hidden={!floating}
        className={cn(
          "fixed bottom-24 start-4 inline-flex min-h-12 items-center gap-2 rounded-full bg-navy-700 pe-5 ps-4 text-sm font-semibold text-white shadow-xl ring-4 ring-white/70 lg:hidden",
          "transition-[opacity,transform] duration-300 ease-[var(--ease-out-soft)]",
          floating && !drawerOpen
            ? "translate-x-0 opacity-100"
            : "pointer-events-none opacity-0 ltr:-translate-x-6 rtl:translate-x-6",
        )}
        style={{ zIndex: "var(--z-sticky)" }}
      >
        <Icon name="filter" size={20} className="text-glacier-300" />
        {d.common.filters}
        {active.length > 0 ? (
          <span className="tabular grid h-5 min-w-5 place-items-center rounded-full bg-glacier-400 px-1.5 text-2xs font-bold text-navy-800">
            {active.length}
          </span>
        ) : null}
      </button>

      {/* Drawer — phones and tablets */}
      <div className="lg:hidden">
        <div
          aria-hidden="true"
          onClick={() => setDrawerOpen(false)}
          className={cn(
            "fixed inset-0 bg-navy-950/50 backdrop-blur-sm transition-opacity duration-300",
            drawerOpen ? "opacity-100" : "pointer-events-none opacity-0",
          )}
          style={{ zIndex: "var(--z-modal)" }}
        />
        <div
          id="product-filter-drawer"
          role="dialog"
          aria-modal="true"
          aria-label={d.common.filters}
          inert={!drawerOpen ? true : undefined}
          className={cn(
            "fixed inset-y-0 start-0 flex w-[min(22rem,88vw)] flex-col bg-white shadow-2xl transition-transform duration-300 ease-[var(--ease-out-soft)]",
            drawerOpen ? "translate-x-0" : "ltr:-translate-x-full rtl:translate-x-full",
          )}
          style={{ zIndex: "var(--z-modal)" }}
        >
          <div className="flex items-center justify-between border-b border-hairline px-5 py-4">
            <p className="inline-flex items-center gap-2 font-display text-lg font-semibold text-ink-strong">
              <Icon name="filter" size={20} className="text-glacier-600" />
              {d.common.filters}
              {active.length > 0 ? (
                <span className="tabular grid h-5 min-w-5 place-items-center rounded-full bg-glacier-400 px-1.5 text-2xs font-bold text-navy-800">
                  {active.length}
                </span>
              ) : null}
            </p>
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              aria-label={d.a11y.closeDialog}
              className="grid h-10 w-10 place-items-center rounded-full text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink-strong"
            >
              <Icon name="close" size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-5">{panel}</div>

          <div className="flex items-center gap-3 border-t border-hairline p-4">
            <Button variant="ghost" onClick={clear} disabled={active.length === 0}>
              {d.common.clearFilters}
            </Button>
            <Button className="flex-1" onClick={() => setDrawerOpen(false)}>
              {d.common.applyFilters} ({visible.length})
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterGroup({
  label,
  count,
  defaultOpen,
  children,
}: {
  label: string;
  count: number;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(Boolean(defaultOpen) || count > 0);

  return (
    <div className="py-1">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="flex min-h-12 w-full items-center justify-between gap-3 text-start text-sm font-semibold text-ink-strong"
      >
        <span className="inline-flex items-center gap-2">
          {label}
          {count > 0 ? (
            <span className="tabular grid h-5 min-w-5 place-items-center rounded-full bg-glacier-100 px-1.5 text-2xs font-bold text-glacier-800">
              {count}
            </span>
          ) : null}
        </span>
        <Icon
          name="chevronDown"
          size={16}
          className={cn("text-ink-muted transition-transform duration-300", open && "rotate-180")}
        />
      </button>
      {/* Grid-rows animation folds the group without measuring its height. */}
      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-300 ease-[var(--ease-out-soft)]",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
        inert={!open ? true : undefined}
      >
        <div className="overflow-hidden">
          <div className="pb-4">{children}</div>
        </div>
      </div>
    </div>
  );
}

function OptionList({
  options,
  selected,
  onToggle,
}: {
  options: Option[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <ul className="flex flex-col gap-0.5">
      {options.map((option) => {
        const checked = selected.includes(option.value);
        const disabled = option.count === 0 && !checked;
        return (
          <li key={option.value}>
            <label
              className={cn(
                "group flex min-h-10 cursor-pointer items-center gap-3 rounded-lg px-2 text-sm transition-colors",
                checked ? "bg-glacier-50 text-ink-strong" : "text-ink hover:bg-surface-muted",
                disabled && "cursor-not-allowed opacity-45",
              )}
            >
              <input
                type="checkbox"
                checked={checked}
                disabled={disabled}
                onChange={() => onToggle(option.value)}
                className="peer sr-only"
              />
              <span
                aria-hidden="true"
                className={cn(
                  "grid h-5 w-5 shrink-0 place-items-center rounded-md border transition-colors peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-glacier-500",
                  checked ? "border-glacier-500 bg-glacier-400 text-navy-800" : "border-hairline-strong bg-white",
                )}
              >
                {checked ? <Icon name="check" size={16} /> : null}
              </span>
              <span className="flex-1">{option.label}</span>
              <span className="tabular text-xs text-ink-muted">{option.count}</span>
            </label>
          </li>
        );
      })}
    </ul>
  );
}
