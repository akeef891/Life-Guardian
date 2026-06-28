"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { LOCALE_LABELS, LOCALES, type Locale } from "@/lib/i18n/locales";
import { cn } from "@/lib/utils/cn";
import { useLocale } from "./LocaleProvider";

const LOCALE_UI: Record<Locale, { flag: string; dropdownLabel: string }> = {
  en: { flag: "🇺🇸", dropdownLabel: "English" },
  ta: { flag: "🇮🇳", dropdownLabel: "தமிழ்" },
  hi: { flag: "🇮🇳", dropdownLabel: "हिन्दी" },
};

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden
    >
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();
  const [open, setOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(() => LOCALES.indexOf(locale));
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);
  const listboxId = useId();

  const selectedIndex = LOCALES.indexOf(locale);

  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  const selectLocale = useCallback(
    (next: Locale) => {
      setLocale(next);
      setHighlightedIndex(LOCALES.indexOf(next));
      setOpen(false);
      triggerRef.current?.focus();
    },
    [setLocale],
  );

  useEffect(() => {
    if (!open) {
      return;
    }

    const option = listboxRef.current?.querySelector<HTMLElement>(
      `[data-locale-index="${highlightedIndex}"]`,
    );
    option?.focus();
  }, [open, highlightedIndex]);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        close();
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [open, close]);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        setHighlightedIndex((current) => (current + 1) % LOCALES.length);
        return;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        setHighlightedIndex((current) => (current - 1 + LOCALES.length) % LOCALES.length);
        return;
      }

      if (event.key === "Enter" || event.key === " ") {
        const target = event.target as HTMLElement;
        if (target.getAttribute("role") === "option") {
          event.preventDefault();
          selectLocale(LOCALES[highlightedIndex]!);
        }
      }

      if (event.key === "Tab" && listboxRef.current) {
        const options = Array.from(
          listboxRef.current.querySelectorAll<HTMLElement>('[role="option"]'),
        );
        if (options.length === 0) {
          return;
        }

        const first = options[0]!;
        const last = options[options.length - 1]!;

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, close, highlightedIndex, selectLocale]);

  function handleTriggerKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp" || event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setHighlightedIndex(selectedIndex);
      setOpen(true);
    }
  }

  return (
    <div ref={containerRef} className="relative min-w-0">
      <button
        ref={triggerRef}
        type="button"
        id={`${listboxId}-trigger`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-label="Select language"
        onClick={() => {
          setHighlightedIndex(selectedIndex);
          setOpen((current) => !current);
        }}
        onKeyDown={handleTriggerKeyDown}
        className={cn(
          "inline-flex min-h-11 w-full min-w-[9.5rem] items-center justify-between gap-2 rounded-xl border px-3 py-2 text-sm font-medium shadow-sm backdrop-blur-md transition-[border-color,background-color,box-shadow] duration-200 ease-in-out",
          "border-slate-200 bg-white text-slate-900 hover:bg-slate-50",
          "dark:border-emerald-500/20 dark:bg-slate-900 dark:text-white dark:shadow-black/20 dark:hover:border-emerald-500/35 dark:hover:bg-slate-800",
          "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500/30 sm:min-w-[10.5rem]",
        )}
      >
        <span className="truncate">
          <span aria-hidden>🌐 </span>
          {LOCALE_LABELS[locale]}
        </span>
        <ChevronIcon
          className={cn(
            "h-4 w-4 shrink-0 text-slate-500 transition-transform duration-200 ease-in-out dark:text-slate-400",
            open && "rotate-180",
          )}
        />
      </button>

      <ul
        ref={listboxRef}
        id={listboxId}
        role="listbox"
        aria-labelledby={`${listboxId}-trigger`}
        aria-hidden={!open}
        className={cn(
          "absolute right-0 top-[calc(100%+0.5rem)] z-50 w-full min-w-[12rem] max-w-[min(100vw-1.5rem,16rem)] origin-top-right rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl transition-[opacity,transform] duration-[180ms] ease-out dark:border-slate-700 dark:bg-slate-900 dark:shadow-2xl dark:shadow-black/40 sm:w-auto",
          open
            ? "pointer-events-auto scale-100 opacity-100"
            : "pointer-events-none scale-95 opacity-0",
        )}
      >
        {LOCALES.map((code, index) => {
          const isSelected = locale === code;
          const ui = LOCALE_UI[code];

          return (
            <li key={code} role="presentation">
              <button
                type="button"
                role="option"
                data-locale-index={index}
                aria-selected={isSelected}
                tabIndex={open ? (highlightedIndex === index ? 0 : -1) : -1}
                onMouseEnter={() => setHighlightedIndex(index)}
                onClick={() => selectLocale(code)}
                className={cn(
                  "flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm transition-colors duration-200 ease-in-out",
                  isSelected
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400"
                    : "text-slate-900 hover:bg-slate-50 dark:text-slate-100 dark:hover:bg-emerald-500/10",
                  !isSelected &&
                    highlightedIndex === index &&
                    "bg-slate-50 dark:bg-emerald-500/10",
                )}
              >
                <span className="min-w-0 flex-1 truncate">
                  <span aria-hidden>{ui.flag} </span>
                  {ui.dropdownLabel}
                </span>
                {isSelected ? (
                  <span className="shrink-0 text-emerald-700 dark:text-emerald-400" aria-hidden>
                    ✓
                  </span>
                ) : (
                  <span className="w-4 shrink-0" aria-hidden />
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
