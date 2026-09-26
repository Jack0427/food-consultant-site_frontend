"use client";

import { useLanguage } from "@/i18n/LanguageContext";

export default function SkipLink() {
  const { t } = useLanguage();
  return (
    <a
      href="#main"
      className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-lg bg-accent-light px-4 py-3 font-semibold text-base-950 shadow-lg transition-transform focus:translate-y-0"
    >
      {t.skipLink}
    </a>
  );
}
