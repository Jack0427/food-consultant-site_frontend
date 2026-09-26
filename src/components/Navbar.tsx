"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FlaskConical, Menu, X } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { cn } from "@/lib/cn";
import { scrollToSection } from "@/lib/scrollToSection";
import LanguageSwitch from "./LanguageSwitch";

const SECTION_IDS = ["about", "clients", "services", "process", "contact"] as const;

export default function Navbar() {
  const { t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // 捲動時標示目前所在的區塊（aria-current）
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  // 行動選單：Esc 關閉並把焦點還給選單按鈕；開啟時焦點移到第一個連結
  useEffect(() => {
    if (!menuOpen) return;
    menuRef.current?.querySelector<HTMLElement>("a, button")?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    const onResize = () => {
      if (window.matchMedia("(min-width: 1024px)").matches) setMenuOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
    };
  }, [menuOpen]);

  // 收合動畫進行中捲動會被中斷，所以先記下目標，等 onExitComplete 再捲動
  const pendingTargetRef = useRef<string | null>(null);
  const navigateFromMenu = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    pendingTargetRef.current = id;
    setMenuOpen(false);
  };
  const onMenuExitComplete = () => {
    if (!pendingTargetRef.current) return;
    scrollToSection(pendingTargetRef.current);
    pendingTargetRef.current = null;
  };

  const links = SECTION_IDS.map((id) => ({ id, label: t.nav.links[id] }));

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,box-shadow] duration-300",
        scrolled || menuOpen
          ? "border-base-700 bg-base-950/95 shadow-xl backdrop-blur-md"
          : "border-transparent bg-base-950/40 backdrop-blur-sm",
      )}
    >
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <a href="#top" className="flex items-center gap-3 rounded-lg">
          <span
            aria-hidden="true"
            className="grid size-10 place-items-center rounded-xl border border-accent-gold/60 bg-base-800 text-accent-light"
          >
            <FlaskConical className="size-5" />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="font-bold text-white">{t.nav.brand}</span>
            <span className="text-xs text-muted">{t.nav.brandSub}</span>
          </span>
        </a>

        <nav aria-label={t.nav.label} className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {links.map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  aria-current={activeId === link.id ? "location" : undefined}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                    activeId === link.id ? "bg-base-800 text-accent-light" : "text-base-200 hover:text-white",
                  )}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageSwitch />
          <a
            href="#contact"
            className="hidden rounded-full bg-accent-gold px-5 py-2.5 text-sm font-bold text-base-950 transition-colors hover:bg-accent-light lg:inline-block"
          >
            {t.nav.cta}
          </a>
          <button
            ref={menuButtonRef}
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? t.nav.closeMenu : t.nav.openMenu}
            onClick={() => setMenuOpen((open) => !open)}
            className="grid size-11 place-items-center rounded-xl border border-base-600 text-white lg:hidden"
          >
            {menuOpen ? <X aria-hidden="true" className="size-5" /> : <Menu aria-hidden="true" className="size-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence onExitComplete={onMenuExitComplete}>
        {menuOpen && (
          <motion.div
            ref={menuRef}
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-base-700 lg:hidden"
          >
            <nav aria-label={t.nav.label} className="px-4 pb-6 pt-2 sm:px-6">
              <ul className="flex flex-col">
                {links.map((link) => (
                  <li key={link.id}>
                    <a
                      href={`#${link.id}`}
                      aria-current={activeId === link.id ? "location" : undefined}
                      onClick={(e) => navigateFromMenu(e, link.id)}
                      className="block rounded-lg px-3 py-3 text-lg font-medium text-base-100 hover:bg-base-800"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
              <a
                href="#contact"
                onClick={(e) => navigateFromMenu(e, "contact")}
                className="mt-4 block rounded-full bg-accent-gold px-5 py-3 text-center font-bold text-base-950"
              >
                {t.nav.cta}
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
