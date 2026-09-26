"use client";

import { CircleCheck, CircleX, FlaskConical } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import Reveal from "./ui/Reveal";
import SectionHeading from "./ui/SectionHeading";

export default function Scope() {
  const { t } = useLanguage();

  return (
    <section id="scope" aria-labelledby="scope-title" className="relative bg-base-50 py-24 text-base-950 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading id="scope-title" tone="light" eyebrow={t.scope.eyebrow} title={t.scope.title} intro={t.scope.intro} />

        <div className="grid gap-6 md:grid-cols-2">
          <Reveal className="h-full">
            <div className="h-full rounded-3xl border-2 border-base-600 bg-white p-6 sm:p-8">
              <h3 className="mb-6 flex items-center gap-3 text-2xl font-bold text-base-800">
                <CircleCheck aria-hidden="true" className="size-7 text-base-600" />
                {t.scope.doTitle}
              </h3>
              <ul className="space-y-4">
                {t.scope.doItems.map((item) => (
                  <li key={item} className="flex gap-3 text-lg text-base-900">
                    <CircleCheck aria-hidden="true" className="mt-1 size-5 shrink-0 text-base-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="h-full">
            <div className="h-full rounded-3xl border-2 border-dashed border-accent-deep/60 bg-base-100 p-6 sm:p-8">
              <h3 className="mb-6 flex items-center gap-3 text-2xl font-bold text-accent-deep">
                <CircleX aria-hidden="true" className="size-7" />
                {t.scope.dontTitle}
              </h3>
              <ul className="space-y-4">
                {t.scope.dontItems.map((item) => (
                  <li key={item} className="flex gap-3 text-lg text-base-900">
                    <CircleX aria-hidden="true" className="mt-1 size-5 shrink-0 text-accent-deep" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        <Reveal>
          <p className="mt-8 flex items-start gap-3 rounded-2xl bg-base-900 p-5 text-base-100 sm:p-6">
            <FlaskConical aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-accent-light" />
            <span>{t.scope.note}</span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
