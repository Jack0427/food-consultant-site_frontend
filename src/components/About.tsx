"use client";

import { BadgeCheck, BookOpen, Lock, MessageSquareText, Scale } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import Reveal from "./ui/Reveal";
import SectionHeading from "./ui/SectionHeading";

const PRINCIPLE_ICONS = [BookOpen, MessageSquareText, Lock, Scale];

export default function About() {
  const { t } = useLanguage();

  return (
    <section id="about" aria-labelledby="about-title" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading id="about-title" eyebrow={t.about.eyebrow} title={t.about.title} align="left" />

        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <Reveal className="space-y-6">
            <div className="flex items-center gap-5">
              {/* 佔位頭像：之後可替換為 next/image 的真實照片，並提供替代文字 */}
              <div
                aria-hidden="true"
                className="grid size-24 shrink-0 place-items-center rounded-3xl border border-accent-gold/60 bg-gradient-to-br from-base-700 to-base-900 text-3xl font-bold text-accent-light"
              >
                YC
              </div>
              <div>
                <p className="text-xl font-bold text-white">{t.nav.brand}</p>
                <p className="text-muted">{t.hero.eyebrow}</p>
              </div>
            </div>
            {t.about.paragraphs.map((paragraph) => (
              <p key={paragraph} className="text-lg leading-relaxed text-base-100 text-pretty">
                {paragraph}
              </p>
            ))}

            <div className="rounded-3xl border border-base-700 bg-base-900 p-6 sm:p-8">
              <h3 className="mb-4 text-lg font-semibold text-accent-light">{t.about.credentialsTitle}</h3>
              <ul className="space-y-3">
                {t.about.credentials.map((item) => (
                  <li key={item} className="flex gap-3 text-base-100">
                    <BadgeCheck aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-accent-gold" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <div>
            <Reveal>
              <h3 className="mb-6 text-2xl font-bold text-white">{t.about.principlesTitle}</h3>
            </Reveal>
            <ul className="grid gap-4 sm:grid-cols-2">
              {t.about.principles.map((principle, i) => {
                const Icon = PRINCIPLE_ICONS[i];
                return (
                  <li key={principle.title}>
                    <Reveal delay={i * 0.08} className="h-full">
                      <div className="h-full rounded-3xl border border-base-700 bg-base-900/70 p-6 transition-colors hover:border-accent-gold/60">
                        <Icon aria-hidden="true" className="mb-4 size-8 text-accent-gold" />
                        <h4 className="mb-2 text-lg font-semibold text-white">{principle.title}</h4>
                        <p className="leading-relaxed text-muted">{principle.text}</p>
                      </div>
                    </Reveal>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
