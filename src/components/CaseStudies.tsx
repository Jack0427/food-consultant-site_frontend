"use client";

import { useLanguage } from "@/i18n/LanguageContext";
import Reveal from "./ui/Reveal";
import SectionHeading from "./ui/SectionHeading";

export default function CaseStudies() {
  const { t } = useLanguage();
  const { labels } = t.cases;

  return (
    <section id="cases" aria-labelledby="cases-title" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading id="cases-title" eyebrow={t.cases.eyebrow} title={t.cases.title} intro={t.cases.intro} />

        <ul className="grid gap-5 lg:grid-cols-3">
          {t.cases.items.map((item, i) => (
            <li key={item.client}>
              <Reveal delay={i * 0.1} className="h-full">
                <article className="flex h-full flex-col rounded-3xl border border-base-700 bg-gradient-to-b from-base-900 to-base-950 p-6 sm:p-8">
                  <p className="mb-2 text-sm font-semibold text-accent-light">{item.category}</p>
                  <h3 className="mb-6 text-xl font-bold text-white">{item.client}</h3>
                  <dl className="space-y-4">
                    <div>
                      <dt className="text-sm font-semibold uppercase tracking-wider text-muted">{labels.problem}</dt>
                      <dd className="mt-1 leading-relaxed text-base-100">{item.problem}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-semibold uppercase tracking-wider text-muted">{labels.approach}</dt>
                      <dd className="mt-1 leading-relaxed text-base-100">{item.approach}</dd>
                    </div>
                    <div className="rounded-2xl bg-base-800 p-4">
                      <dt className="text-sm font-semibold uppercase tracking-wider text-accent-light">{labels.outcome}</dt>
                      <dd className="mt-1 font-medium leading-relaxed text-white">{item.outcome}</dd>
                    </div>
                  </dl>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
