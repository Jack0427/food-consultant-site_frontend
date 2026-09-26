"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useSpring } from "framer-motion";
import { Clock, Info } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { cn } from "@/lib/cn";
import { useLayerWhileAnimating } from "@/lib/useLayerWhileAnimating";
import Reveal from "./ui/Reveal";
import SectionHeading from "./ui/SectionHeading";

export default function Process() {
  const { t } = useLanguage();
  const listRef = useRef<HTMLOListElement>(null);

  // 捲動驅動：時間軸線條隨閱讀進度填滿
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 75%", "end 55%"] });
  const lineScale = useSpring(scrollYProgress, { stiffness: 90, damping: 25 });

  // overflow-x-clip：步驟卡片進場前向右偏移 32px，未捲到時不可撐出水平捲軸
  return (
    <section id="process" aria-labelledby="process-title" className="relative overflow-x-clip bg-base-900 py-24 sm:py-32">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <SectionHeading id="process-title" eyebrow={t.process.eyebrow} title={t.process.title} intro={t.process.intro} />

        <div className="relative">
          <div aria-hidden="true" className="absolute bottom-6 left-6 top-6 w-0.5 bg-base-700 sm:left-8">
            <motion.div style={{ scaleY: lineScale }} className="size-full origin-top bg-gradient-to-b from-accent-light to-accent-gold" />
          </div>
          <ol ref={listRef} className="relative space-y-6">
            {t.process.steps.map((step, i) => (
              <Step key={step.title} index={i} {...step} />
            ))}
          </ol>
        </div>

        <Reveal>
          <p className="mt-10 flex items-start gap-3 rounded-2xl border border-accent-gold/50 bg-base-950 p-5 text-base-100">
            <Info aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-accent-light" />
            <span>{t.process.note}</span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function Step({ index, title, text, duration }: { index: number; title: string; text: string; duration: string }) {
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -35% 0px" });
  const layer = useLayerWhileAnimating<HTMLDivElement>();

  return (
    <li ref={ref} className="relative flex gap-5 sm:gap-8">
      <span
        aria-hidden="true"
        className={cn(
          "relative z-10 grid size-12 shrink-0 place-items-center rounded-full border-2 text-lg font-bold transition-colors duration-500 sm:size-16 sm:text-xl",
          inView ? "border-accent-light bg-accent-gold text-base-950" : "border-base-600 bg-base-900 text-base-200",
        )}
      >
        {index + 1}
      </span>
      <motion.div
        {...layer}
        initial={{ x: 32 }}
        animate={inView ? { x: 0 } : undefined}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="flex-1 rounded-3xl border border-base-700 bg-base-950/70 p-5 sm:p-6"
      >
        <h3 className="text-xl font-bold text-white">
          {title}
        </h3>
        <p className="mt-2 leading-relaxed text-base-100">{text}</p>
        <p className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-accent-light">
          <Clock aria-hidden="true" className="size-4" />
          {duration}
        </p>
      </motion.div>
    </li>
  );
}
