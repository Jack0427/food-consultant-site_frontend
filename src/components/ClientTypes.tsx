"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Briefcase, Building2, Check, User } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { CLIENT_TYPE_IDS, type ClientTypeId } from "@/lib/inquiry";
import { cn } from "@/lib/cn";
import { useInquiry } from "./InquiryContext";
import SectionHeading from "./ui/SectionHeading";

const ICONS: Record<ClientTypeId, typeof User> = {
  individual: User,
  sme: Building2,
  enterprise: Briefcase,
};

/** 依 WAI-ARIA Tabs 模式實作：方向鍵、Home、End 切換分頁 */
export default function ClientTypes() {
  const { t } = useLanguage();
  const { goToInquiry } = useInquiry();
  const [selected, setSelected] = useState<ClientTypeId>("individual");
  const tabRefs = useRef<Record<ClientTypeId, HTMLButtonElement | null>>({ individual: null, sme: null, enterprise: null });

  const onKeyDown = (e: React.KeyboardEvent, index: number) => {
    const last = CLIENT_TYPE_IDS.length - 1;
    let next: number | null = null;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = index === last ? 0 : index + 1;
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = index === 0 ? last : index - 1;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = last;
    if (next === null) return;
    e.preventDefault();
    const id = CLIENT_TYPE_IDS[next];
    setSelected(id);
    tabRefs.current[id]?.focus();
  };

  const type = t.clients.types[selected];
  const labels = t.clients.labels;

  return (
    <section id="clients" aria-labelledby="clients-title" className="relative bg-base-900 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading id="clients-title" eyebrow={t.clients.eyebrow} title={t.clients.title} intro={t.clients.intro} />

        <div>
          <div role="tablist" aria-label={t.clients.tabsLabel} className="grid gap-3 sm:grid-cols-3">
            {CLIENT_TYPE_IDS.map((id, index) => {
              const Icon = ICONS[id];
              const active = selected === id;
              return (
                <button
                  key={id}
                  ref={(el) => {
                    tabRefs.current[id] = el;
                  }}
                  id={`client-tab-${id}`}
                  role="tab"
                  type="button"
                  aria-selected={active}
                  aria-controls="client-panel"
                  tabIndex={active ? 0 : -1}
                  onClick={() => setSelected(id)}
                  onKeyDown={(e) => onKeyDown(e, index)}
                  className={cn(
                    "relative flex items-center gap-4 rounded-2xl border p-4 text-left transition-colors sm:p-5",
                    active
                      ? "border-accent-gold bg-base-800 text-white"
                      : "border-base-700 bg-base-950/60 text-base-200 hover:border-base-600 hover:text-white",
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "grid size-12 shrink-0 place-items-center rounded-xl",
                      active ? "bg-accent-gold text-base-950" : "bg-base-800 text-accent-light",
                    )}
                  >
                    <Icon className="size-6" />
                  </span>
                  <span>
                    <span className="block text-lg font-semibold">{t.clients.types[id].name}</span>
                    <span className="block text-sm text-muted">{t.clients.types[id].tagline}</span>
                  </span>
                  {active && (
                    <motion.span
                      layoutId="client-tab-indicator"
                      aria-hidden="true"
                      className="absolute inset-x-6 -bottom-px h-0.5 rounded-full bg-accent-light"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div
          id="client-panel"
          role="tabpanel"
          tabIndex={0}
          aria-labelledby={`client-tab-${selected}`}
          className="mt-8 rounded-3xl border border-base-700 bg-base-950 p-6 sm:p-10"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={selected}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="grid gap-8 lg:grid-cols-3"
            >
              <InfoList title={labels.fit} items={type.fit} />
              <InfoList title={labels.help} items={type.help} />
              <InfoList title={labels.deliverables} items={type.deliverables} />

              <div className="grid gap-6 border-t border-base-700 pt-8 sm:grid-cols-2 lg:col-span-3">
                <div>
                  <h3 className="mb-2 font-semibold text-accent-light">{labels.format}</h3>
                  <p className="leading-relaxed text-base-100">{type.format}</p>
                </div>
                <div>
                  <h3 className="mb-2 font-semibold text-accent-light">{labels.pricing}</h3>
                  <p className="leading-relaxed text-base-100">{type.pricing}</p>
                </div>
              </div>

              <div className="lg:col-span-3">
                <button
                  type="button"
                  onClick={() => goToInquiry({ clientType: selected })}
                  aria-label={`${t.clients.cta}: ${type.name}`}
                  className="group inline-flex items-center gap-2 rounded-full bg-accent-gold px-6 py-3 font-bold text-base-950 transition-colors hover:bg-accent-light"
                >
                  {t.clients.cta}
                  <ArrowRight aria-hidden="true" className="size-5 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function InfoList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="mb-4 font-semibold text-accent-light">{title}</h3>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 leading-relaxed text-base-100">
            <Check aria-hidden="true" className="mt-1 size-4 shrink-0 text-accent-gold" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
