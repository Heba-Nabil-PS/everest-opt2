"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/utils";
import { Icon } from "./Icon";

export interface AccordionItem {
  question: string;
  answer: string;
}

/**
 * Native disclosure semantics with an explicit expanded state, so the control
 * announces correctly and keyboard users get the same affordance as pointers.
 */
export function Accordion({ items, className }: { items: AccordionItem[]; className?: string }) {
  const [open, setOpen] = useState<number | null>(0);
  const baseId = useId();

  return (
    <div className={cn("divide-y divide-hairline border-y border-hairline", className)}>
      {items.map((item, index) => {
        const isOpen = open === index;
        const panelId = `${baseId}-panel-${index}`;
        const buttonId = `${baseId}-button-${index}`;

        return (
          <div key={item.question}>
            <h3>
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : index)}
                className="flex w-full items-start justify-between gap-6 py-5 text-start"
              >
                <span className="font-display text-lg font-semibold text-ink-strong">
                  {item.question}
                </span>
                <span
                  aria-hidden="true"
                  className={cn(
                    "mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full border border-hairline-strong",
                    "transition-[transform,background-color,border-color] duration-200 ease-[var(--ease-out-soft)]",
                    isOpen && "rotate-180 border-glacier-400 bg-glacier-400 text-navy-700",
                  )}
                >
                  <Icon name="chevronDown" size={16} />
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!isOpen}
              className="pb-6 pe-12"
            >
              <p className="max-w-[68ch] text-ink-muted">{item.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
