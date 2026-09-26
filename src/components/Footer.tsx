"use client";

import { ArrowUp, FlaskConical, Mail } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const LINK_IDS = ["about", "clients", "services", "process", "contact"] as const;

export default function Footer() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-base-700 bg-base-950 py-12">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 md:grid-cols-[1.5fr_1fr] lg:px-8">
        <div>
          <p className="flex items-center gap-3 font-bold text-white">
            <FlaskConical aria-hidden="true" className="size-5 text-accent-light" />
            {t.nav.brand}
          </p>
          <p className="mt-3 max-w-md leading-relaxed text-muted">{t.footer.tagline}</p>
          <a
            href={`mailto:${t.contact.email}`}
            className="mt-4 inline-flex items-center gap-2 font-semibold text-accent-light underline underline-offset-4 hover:text-white"
          >
            <Mail aria-hidden="true" className="size-4" />
            {t.contact.email}
          </a>
        </div>

        <nav aria-label={t.footer.navLabel}>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-3">
            {LINK_IDS.map((id) => (
              <li key={id}>
                <a href={`#${id}`} className="text-base-200 hover:text-accent-light">
                  {t.nav.links[id]}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex flex-col-reverse items-start justify-between gap-4 border-t border-base-800 pt-6 text-sm text-muted sm:flex-row sm:items-center md:col-span-2">
          <p>
            © {year} {t.nav.brand}. {t.footer.rights}
          </p>
          <a href="#top" className="inline-flex items-center gap-2 font-semibold text-accent-light hover:text-white">
            <ArrowUp aria-hidden="true" className="size-4" />
            {t.footer.backToTop}
          </a>
        </div>
      </div>
    </footer>
  );
}
