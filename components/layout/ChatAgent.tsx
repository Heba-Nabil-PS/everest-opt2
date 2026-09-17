"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useQuoteModal } from "@/components/forms/QuoteModal";
import { Icon, type IconName } from "@/components/ui/Icon";
import { site } from "@/lib/data/site";
import { localePath, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const topicIcons: IconName[] = ["document", "box", "wrench", "globe"];

/**
 * "Chat with an Agent": a persistent launcher that opens a small panel with
 * quick topics. Each topic starts a WhatsApp conversation with the sales desk,
 * pre-filled so the agent knows what the visitor needs before replying —
 * WhatsApp being the dominant B2B channel in the GCC. Call, email and the quote
 * form sit underneath for visitors who prefer them.
 */
export function ChatAgent({ locale, dictionary: d }: { locale: Locale; dictionary: Dictionary }) {
  const c = d.chat;
  const openQuote = useQuoteModal();
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const launcherRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    panelRef.current?.querySelector<HTMLElement>("a, button")?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        launcherRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const whatsapp = (text: string) => `${site.whatsappHref}?text=${encodeURIComponent(text)}`;

  return (
    <>
      <div
        ref={panelRef}
        id={panelId}
        role="dialog"
        aria-modal="false"
        aria-labelledby={`${panelId}-title`}
        hidden={!open}
        className="anim-rise fixed bottom-42 end-5 w-[min(22rem,calc(100vw-2.5rem))] overflow-hidden rounded-2xl bg-surface shadow-2xl ring-1 ring-hairline sm:bottom-24"
        style={{ zIndex: "var(--z-overlay)" }}
      >
        <div className="relative bg-deep px-5 pb-5 pt-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="relative grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-glacier-400 to-steel font-display text-lg font-bold text-navy-900">
                E
                <span className="absolute -bottom-0.5 -end-0.5 h-3.5 w-3.5 rounded-full border-2 border-navy-900 bg-[#25d366]" />
              </span>
              <div>
                <p id={`${panelId}-title`} className="font-display font-semibold">
                  {c.title}
                </p>
                <p className="text-xs text-white/70">{c.status}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                launcherRef.current?.focus();
              }}
              aria-label={d.a11y.closeDialog}
              className="grid h-9 w-9 place-items-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white"
            >
              <Icon name="close" size={20} />
            </button>
          </div>
          <p className="mt-4 rounded-2xl rounded-ss-sm bg-white/10 px-4 py-3 text-sm">{c.greeting}</p>
        </div>

        <div className="p-4">
          <p className="px-1 text-2xs font-semibold uppercase tracking-[0.14em] text-ink-muted">{c.topicsLabel}</p>
          <ul className="mt-2 flex flex-col gap-1.5">
            {c.topics.map((topic, index) => (
              <li key={topic.label}>
                <a
                  href={whatsapp(topic.message)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 rounded-xl border border-hairline px-3 py-2.5 text-sm font-medium text-ink-strong no-underline transition-colors hover:border-glacier-400 hover:bg-glacier-50"
                >
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-ice text-glacier-600">
                    <Icon name={topicIcons[index % topicIcons.length]} size={16} />
                  </span>
                  <span className="flex-1">{topic.label}</span>
                  <Icon
                    name="arrowRight"
                    size={16}
                    className="text-ink-muted transition-transform group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5"
                  />
                </a>
              </li>
            ))}
          </ul>

          <div className="mt-4 grid grid-cols-3 gap-2 border-t border-hairline pt-4 text-xs">
            <a
              href={`tel:${site.phoneHref}`}
              className="flex flex-col items-center gap-1 rounded-lg py-2 text-ink no-underline hover:bg-surface-muted"
            >
              <Icon name="phone" size={20} className="text-glacier-600" />
              {c.call}
            </a>
            <a
              href={`mailto:${site.email}`}
              className="flex flex-col items-center gap-1 rounded-lg py-2 text-ink no-underline hover:bg-surface-muted"
            >
              <Icon name="mail" size={20} className="text-glacier-600" />
              {c.email}
            </a>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                openQuote();
              }}
              className="flex flex-col items-center gap-1 rounded-lg py-2 text-ink hover:bg-surface-muted"
            >
              <Icon name="document" size={20} className="text-glacier-600" />
              {c.quote}
            </button>
          </div>
        </div>
      </div>

      <button
        ref={launcherRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className={cn(
          /* Lifted above the mobile quote bar on phones. */
          "group fixed bottom-24 end-5 inline-flex items-center gap-2.5 rounded-full shadow-lg sm:bottom-5",
          /* Brand navy, not a glacier shade: the Aurora theme remaps the deep
             cyans to light ones, which would leave this white label and the
             green presence dot sitting on a pale fill. Navy is dark in both. */
          "bg-navy-700 text-white ring-1 ring-glacier-400/40",
          "h-14 w-14 justify-center sm:h-auto sm:min-h-14 sm:w-auto sm:justify-start sm:pe-5 sm:ps-4",
          "transition-[background-color,box-shadow,transform] duration-300 ease-[var(--ease-out-soft)] hover:-translate-y-0.5 hover:bg-navy-800 hover:ring-glacier-400/70",
          "focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-glacier-500",
        )}
        style={{ zIndex: "var(--z-sticky)" }}
      >
        <span className="relative">
          <Icon name={open ? "close" : "whatsapp"} size={24} />
          {!open ? (
            <span className="absolute -end-1 -top-1 h-2.5 w-2.5 rounded-full bg-[#25d366] ring-2 ring-navy-700" />
          ) : null}
        </span>
        <span className="hidden text-sm font-semibold sm:inline">{c.launcher}</span>
        <span className="sr-only sm:hidden">{c.launcher}</span>
      </button>
    </>
  );
}
