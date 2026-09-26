"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { cn } from "@/lib/cn";
import Reveal from "./ui/Reveal";
import SectionHeading from "./ui/SectionHeading";

export default function FAQ() {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" aria-labelledby="faq-title" className="relative bg-base-900 py-24 sm:py-32">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <SectionHeading id="faq-title" eyebrow={t.faq.eyebrow} title={t.faq.title} />

        <Reveal>
          <ul className="space-y-3">
            {t.faq.items.map((item, i) => {
              const open = openIndex === i;
              const buttonId = `faq-button-${i}`;
              const panelId = `faq-panel-${i}`;
              return (
                <li key={i} className={cn("rounded-2xl border bg-base-950 transition-colors", open ? "border-accent-gold/70" : "border-base-700")}>
                  <h3>
                    <button
                      id={buttonId}
                      type="button"
                      aria-expanded={open}
                      aria-controls={panelId}
                      onClick={() => setOpenIndex(open ? null : i)}
                      className="flex w-full items-center justify-between gap-4 rounded-2xl p-5 text-left text-lg font-semibold text-white hover:text-accent-light sm:p-6"
                    >
                      {item.q}
                      <ChevronDown
                        aria-hidden="true"
                        className={cn("size-5 shrink-0 text-accent-light transition-transform duration-300", open && "rotate-180")}
                      />
                    </button>
                  </h3>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        id={panelId}
                        role="region"
                        aria-labelledby={buttonId}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 pb-6 leading-relaxed text-base-100 sm:px-6">{item.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
