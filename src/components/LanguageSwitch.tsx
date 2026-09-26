"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, Globe } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { htmlLang, type Language } from "@/i18n/translations";
import { cn } from "@/lib/cn";

const OPTIONS: { value: Language; label: string; short: string }[] = [
  { value: "en", label: "English", short: "EN" },
  { value: "zh-TW", label: "繁體中文", short: "中文" },
];

/** 語系下拉選單（Disclosure 模式）：Enter/Space 開關、上下鍵移動、Esc 關閉並把焦點還給按鈕 */
export default function LanguageSwitch({ className }: { className?: string }) {
  const { lang, setLang, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const listId = useId();
  const current = OPTIONS.find((o) => o.value === lang) ?? OPTIONS[0];

  useEffect(() => {
    if (!open) return;
    // 開啟時把焦點放在目前語系
    optionRefs.current[OPTIONS.findIndex((o) => o.value === lang)]?.focus();
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, lang]);

  const choose = (value: Language) => {
    setLang(value);
    setOpen(false);
    buttonRef.current?.focus();
  };

  const onOptionKeyDown = (e: React.KeyboardEvent, index: number) => {
    const last = OPTIONS.length - 1;
    let next: number | null = null;
    if (e.key === "ArrowDown") next = index === last ? 0 : index + 1;
    if (e.key === "ArrowUp") next = index === 0 ? last : index - 1;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = last;
    if (e.key === "Tab") setOpen(false);
    if (next === null) return;
    e.preventDefault();
    optionRefs.current[next]?.focus();
  };

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={`${t.nav.language}: ${current.label}`}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "inline-flex min-h-11 items-center gap-2 rounded-full border px-3.5 text-sm font-semibold text-white transition-colors",
          open ? "border-accent-light bg-base-800" : "border-base-600 hover:border-accent-gold hover:bg-base-800",
        )}
      >
        <Globe aria-hidden="true" className="size-4 text-accent-light" />
        <span lang={htmlLang[current.value]}>{current.short}</span>
        <ChevronDown aria-hidden="true" className={cn("size-4 text-accent-light transition-transform", open && "rotate-180")} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            id={listId}
            aria-label={t.nav.language}
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 z-[70] mt-2 w-44 origin-top-right overflow-hidden rounded-2xl border border-base-600 bg-base-900 p-1.5 shadow-2xl"
          >
            {OPTIONS.map((option, index) => {
              const selected = option.value === lang;
              return (
                <li key={option.value}>
                  <button
                    ref={(el) => {
                      optionRefs.current[index] = el;
                    }}
                    type="button"
                    lang={htmlLang[option.value]}
                    aria-current={selected ? "true" : undefined}
                    onClick={() => choose(option.value)}
                    onKeyDown={(e) => onOptionKeyDown(e, index)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors",
                      selected ? "bg-base-800 text-accent-light" : "text-base-100 hover:bg-base-800 hover:text-white",
                    )}
                  >
                    {option.label}
                    {selected && <Check aria-hidden="true" className="size-4" />}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
