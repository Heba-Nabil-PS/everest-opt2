"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";
import { searchIndex, type SearchEntry, type SearchGroup } from "@/lib/search";
import { t, type Dictionary } from "@/lib/i18n";

interface SearchDialogProps {
  open: boolean;
  onClose: () => void;
  dictionary: Dictionary;
  entries: SearchEntry[];
}

const groupOrder: SearchGroup[] = ["products", "categories", "pages", "documents"];

/**
 * Site-wide search covering products, model codes, spec sheets and services.
 * Results are keyboard-navigable with a combobox/listbox pairing, so arrow keys
 * move the active option without moving focus out of the input.
 */
export function SearchDialog({ open, onClose, dictionary: d, entries }: SearchDialogProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const results = useMemo(() => searchIndex(entries, query), [entries, query]);
  /* Top-level categories double as quick links before the user types. */
  const suggestions = useMemo(
    () => entries.filter((entry) => entry.id.startsWith("category-")),
    [entries],
  );

  useEffect(() => {
    if (!open) return;
    setQuery("");
    setActiveIndex(0);
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    /* Defer so the input exists before focus moves. */
    const id = window.setTimeout(() => inputRef.current?.focus(), 20);
    return () => {
      document.body.style.overflow = overflow;
      window.clearTimeout(id);
    };
  }, [open]);

  useEffect(() => setActiveIndex(0), [query]);

  if (!open || typeof document === "undefined") return null;

  const grouped = groupOrder
    .map((group) => ({ group, items: results.filter((entry) => entry.group === group) }))
    .filter((section) => section.items.length > 0);

  function go(entry: SearchEntry) {
    onClose();
    if (entry.href.startsWith("/api/")) window.open(entry.href, "_blank", "noopener");
    else router.push(entry.href);
  }

  function onKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % Math.max(results.length, 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => (index - 1 + results.length) % Math.max(results.length, 1));
    } else if (event.key === "Enter" && results[activeIndex]) {
      event.preventDefault();
      go(results[activeIndex]);
    }
  }

  return createPortal(
    <div
      className="fixed inset-0 flex items-start justify-center bg-navy-950/60 p-4 backdrop-blur-md sm:p-8"
      style={{ zIndex: "var(--z-modal)" }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={d.search.label}
        className="mt-[6vh] w-full max-w-2xl overflow-hidden rounded-[1.75rem] border border-hairline bg-surface shadow-xl"
        onKeyDown={onKeyDown}
      >
        {/* The search field is a full pill inside the panel. */}
        <div className="p-3">
        <div className="flex items-center gap-3 rounded-full border border-hairline-strong bg-surface-muted px-5 transition-colors focus-within:border-glacier-400">
          <Icon name="search" size={24} className="text-glacier-600" />
          <input
            ref={inputRef}
            type="search"
            role="combobox"
            aria-expanded={results.length > 0}
            aria-controls="search-results"
            aria-activedescendant={results[activeIndex] ? `search-option-${results[activeIndex].id}` : undefined}
            aria-autocomplete="list"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={d.search.placeholder}
            aria-label={d.search.label}
            /* Placeholder stays on one line and ellipsises on narrow screens. */
            className="h-14 min-w-0 flex-1 truncate bg-transparent text-lg text-ink-strong outline-none placeholder:truncate placeholder:text-ink-muted/80 [&::-webkit-search-cancel-button]:hidden"
          />
          <kbd
            aria-hidden="true"
            className="hidden shrink-0 rounded-full border border-hairline bg-surface px-2.5 py-0.5 font-sans text-2xs font-medium text-ink-muted sm:inline-block"
          >
            Esc
          </kbd>
          <button
            type="button"
            onClick={onClose}
            aria-label={d.a11y.closeSearch}
            className="-me-3 grid h-11 w-11 shrink-0 place-items-center rounded-full text-ink-muted hover:bg-surface hover:text-ink-strong"
          >
            <Icon name="close" size={20} />
          </button>
        </div>
        </div>

        <div id="search-results" role="listbox" aria-label={d.search.label} className="scroll-slim max-h-[60vh] overflow-y-auto p-2">
          {query.trim().length < 2 ? (
            <div className="px-3 py-5">
              <p className="px-1 text-2xs font-semibold uppercase tracking-[0.16em] text-ink-muted">
                {d.search.groups.categories}
              </p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {suggestions.map((entry) => (
                  <li key={entry.id}>
                    <button
                      type="button"
                      onClick={() => go(entry)}
                      className="inline-flex min-h-10 items-center gap-2 rounded-full border border-hairline bg-surface px-4 text-sm font-medium text-ink-strong transition-colors hover:border-glacier-400 hover:bg-glacier-50 hover:text-glacier-700"
                    >
                      <Icon name="snow" size={16} className="text-glacier-500" />
                      {entry.title}
                    </button>
                  </li>
                ))}
              </ul>
              <p className="mt-5 px-1 text-sm text-ink-muted">{d.search.noResultsHint}</p>
            </div>
          ) : results.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <p className="font-medium text-ink-strong">{d.search.noResults}</p>
              <p className="mt-2 text-sm text-ink-muted">{d.search.noResultsHint}</p>
            </div>
          ) : (
            <>
              <p className="px-4 py-2 text-xs text-ink-muted" aria-live="polite">
                {results.length === 1
                  ? d.search.countOne
                  : t(d.search.countMany, { n: results.length })}
              </p>
              {grouped.map((section) => (
                <div key={section.group} className="py-1">
                  <p className="px-4 py-1.5 text-2xs font-semibold uppercase tracking-[0.16em] text-ink-muted">
                    {d.search.groups[section.group]}
                  </p>
                  <ul>
                    {section.items.map((entry) => {
                      const index = results.indexOf(entry);
                      const active = index === activeIndex;
                      return (
                        <li key={entry.id}>
                          <button
                            type="button"
                            id={`search-option-${entry.id}`}
                            role="option"
                            aria-selected={active}
                            onMouseEnter={() => setActiveIndex(index)}
                            onClick={() => go(entry)}
                            className={cn(
                              "flex w-full items-center justify-between gap-4 rounded-lg px-4 py-3 text-start",
                              active ? "bg-navy-50" : "hover:bg-surface-muted",
                            )}
                          >
                            <span className="min-w-0">
                              <span className="block truncate font-medium text-ink-strong">
                                {entry.title}
                              </span>
                              <span className="block truncate text-sm text-ink-muted">
                                {entry.detail}
                              </span>
                            </span>
                            <Icon
                              name={entry.href.startsWith("/api/") ? "download" : "arrowRight"}
                              size={20}
                              className="shrink-0 text-ink-muted rtl:-scale-x-100"
                            />
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
