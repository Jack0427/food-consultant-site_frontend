"use client";

import { ArrowRight, Factory, FileText, FlaskConical, SearchCheck, Tags, Timer } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { CATEGORY_IDS, type CategoryId } from "@/lib/inquiry";
import { useInquiry } from "./InquiryContext";
import Reveal from "./ui/Reveal";
import SectionHeading from "./ui/SectionHeading";

export const CATEGORY_ICONS: Record<CategoryId, typeof Tags> = {
  regulatory: Tags,
  product: FlaskConical,
  shelfLife: Timer,
  safety: Factory,
  quality: SearchCheck,
  research: FileText,
};

export default function Services() {
  const { t } = useLanguage();
  const { goToInquiry } = useInquiry();

  // 將游標位置寫入 CSS 變數，驅動 .spotlight 光暈
  const onPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--x", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--y", `${e.clientY - rect.top}px`);
  };

  return (
    <section id="services" aria-labelledby="services-title" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading id="services-title" eyebrow={t.services.eyebrow} title={t.services.title} intro={t.services.intro} />

        <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {CATEGORY_IDS.map((id, i) => {
            const item = t.services.items[id];
            const Icon = CATEGORY_ICONS[id];
            return (
              <li key={id}>
                <Reveal delay={(i % 3) * 0.08} className="h-full">
                  <article
                    aria-labelledby={`service-${id}`}
                    onPointerMove={onPointerMove}
                    className="spotlight flex h-full flex-col rounded-3xl border border-base-700 bg-base-900/80 p-6 transition-[border-color,transform] duration-300 hover:-translate-y-1 hover:border-accent-gold/70 sm:p-8"
                  >
                    <div className="mb-5 flex items-center gap-4">
                      <span
                        aria-hidden="true"
                        className="grid size-12 shrink-0 place-items-center rounded-2xl bg-base-800 text-accent-light"
                      >
                        <Icon className="size-6" />
                      </span>
                      <h3 id={`service-${id}`} className="text-xl font-bold text-white">
                        {item.title}
                      </h3>
                    </div>
                    <p className="mb-6 leading-relaxed text-base-100">{item.summary}</p>

                    <h4 className="mb-2 text-sm font-semibold uppercase tracking-wider text-accent-light">
                      {t.services.questionsLabel}
                    </h4>
                    <ul className="mb-6 space-y-2">
                      {item.questions.map((q) => (
                        <li key={q} className="border-l-2 border-base-600 pl-3 text-muted">
                          {q}
                        </li>
                      ))}
                    </ul>

                    <h4 className="mb-2 text-sm font-semibold uppercase tracking-wider text-accent-light">
                      {t.services.deliverablesLabel}
                    </h4>
                    <ul className="mb-8 flex flex-wrap gap-2">
                      {item.deliverables.map((d) => (
                        <li key={d} className="rounded-full bg-base-800 px-3 py-1 text-sm text-base-100">
                          {d}
                        </li>
                      ))}
                    </ul>

                    <button
                      type="button"
                      onClick={() => goToInquiry({ category: id })}
                      aria-label={`${t.services.useTemplate}: ${item.title}`}
                      className="group mt-auto inline-flex items-center gap-2 self-start rounded-full border border-accent-gold/70 px-5 py-2.5 font-semibold text-accent-light transition-colors hover:bg-accent-gold hover:text-base-950"
                    >
                      {t.services.useTemplate}
                      <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-1" />
                    </button>
                  </article>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
