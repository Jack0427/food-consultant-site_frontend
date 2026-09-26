"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import ParticleField from "./ParticleField";

const EASE = [0.22, 1, 0.36, 1] as const;

// 伺服器與瀏覽器的三角函數末位小數可能不同，四捨五入避免 hydration 不一致
const round = (n: number) => Math.round(n * 100) / 100;

// 環繞在鏡頭周圍的量測標籤（純裝飾）
const READINGS = [
  { label: "pH 4.2", x: "6%", y: "18%", depth: 26 },
  { label: "aw 0.86", x: "74%", y: "10%", depth: 40 },
  { label: "CCP-2", x: "82%", y: "62%", depth: 18 },
  { label: "Q10 = 2.1", x: "2%", y: "70%", depth: 34 },
  { label: "D₇₀ 0.3 min", x: "46%", y: "88%", depth: 22 },
];

export default function Hero() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = usePrefersReducedMotion();

  // 捲動驅動：標題往下淡出、鏡頭旋轉縮放
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const textY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const lensRotate = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const lensScale = useTransform(scrollYProgress, [0, 1], [1, 1.25]);

  // 游標驅動：鏡頭依滑鼠位置 3D 傾斜
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, { stiffness: 80, damping: 18 });
  const smoothY = useSpring(pointerY, { stiffness: 80, damping: 18 });
  const tiltX = useTransform(smoothY, [-1, 1], [12, -12]);
  const tiltY = useTransform(smoothX, [-1, 1], [-14, 14]);

  useEffect(() => {
    if (reduceMotion) return;
    const onMove = (e: PointerEvent) => {
      pointerX.set((e.clientX / window.innerWidth) * 2 - 1);
      pointerY.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [pointerX, pointerY, reduceMotion]);

  return (
    <section
      id="top"
      ref={sectionRef}
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-svh items-center overflow-hidden pb-16 pt-28 sm:pt-32"
    >
      {/* 背景層：光暈與粒子網絡 */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="absolute -left-40 top-10 size-[36rem] rounded-full bg-base-700/40 blur-3xl" />
        <div className="absolute -right-32 bottom-0 size-[30rem] rounded-full bg-accent-gold/10 blur-3xl" />
        <ParticleField className="absolute inset-0 size-full" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-base-950" />
      </div>

      <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.4fr_1fr] lg:px-8">
        <motion.div style={reduceMotion ? undefined : { y: textY, opacity: textOpacity }}>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent-gold/50 bg-base-900/80 px-4 py-2 text-sm font-medium text-accent-light"
          >
            <span aria-hidden="true" className="size-2 rounded-full bg-accent-light" />
            {t.hero.eyebrow}
          </motion.p>

          <h1 id="hero-title" className="text-4xl font-bold leading-[1.1] tracking-tight text-balance sm:text-5xl xl:text-6xl">
            {t.hero.titleLines.map((line, i) => (
              <motion.span
                key={i}
                className={i === 1 ? "block bg-gradient-to-r from-accent-light to-accent-gold bg-clip-text text-transparent" : "block"}
                initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.9, delay: 0.15 + i * 0.18, ease: EASE }}
              >
                {line}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.55, ease: EASE }}
            className="mt-6 max-w-2xl text-lg leading-relaxed text-muted text-pretty"
          >
            {t.hero.intro}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7, ease: EASE }}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <a
              href="#contact"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-accent-gold px-7 py-4 font-bold text-base-950 transition-colors hover:bg-accent-light"
            >
              {t.hero.primaryCta}
              <ArrowRight aria-hidden="true" className="size-5 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#process"
              className="inline-flex items-center justify-center rounded-full border border-base-200/40 px-7 py-4 font-semibold text-white transition-colors hover:border-accent-light hover:text-accent-light"
            >
              {t.hero.secondaryCta}
            </a>
          </motion.div>

          <h2 className="sr-only">{t.hero.statsLabel}</h2>
          <motion.dl
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="mt-12 grid grid-cols-3 gap-4 border-t border-base-700 pt-8"
          >
            {t.hero.stats.map((stat) => (
              <div key={stat.label} className="flex flex-col gap-1">
                <dt className="text-sm leading-snug text-muted">{stat.label}</dt>
                <dd className="order-first text-2xl font-bold text-accent-light sm:text-3xl">{stat.value}</dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>

        <Lens rotate={lensRotate} scale={lensScale} tiltX={tiltX} tiltY={tiltY} pointerX={smoothX} pointerY={smoothY} />
      </div>

      <a
        href="#about"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1 rounded-lg px-3 py-1 text-sm text-muted hover:text-white xl:flex"
      >
        {t.hero.scrollHint}
        <ChevronDown aria-hidden="true" className="animate-float-hint size-5" />
      </a>
    </section>
  );
}

interface LensProps {
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  tiltX: MotionValue<number>;
  tiltY: MotionValue<number>;
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
}

/** 右側的「顯微鏡鏡頭」主視覺，純裝飾 */
function Lens({ rotate, scale, tiltX, tiltY, pointerX, pointerY }: LensProps) {
  const reduceMotion = usePrefersReducedMotion();
  const counterRotate = useTransform(rotate, (v) => -v * 1.6);

  return (
    <motion.div
      aria-hidden="true"
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, delay: 0.3, ease: EASE }}
      className="relative mx-auto aspect-square w-full max-w-[22rem] [perspective:1000px] sm:max-w-md lg:max-w-none"
    >
      <motion.div
        className="relative size-full"
        style={reduceMotion ? undefined : { rotateX: tiltX, rotateY: tiltY, scale, transformStyle: "preserve-3d" }}
      >
        <motion.svg viewBox="0 0 400 400" className="absolute inset-0 size-full" style={reduceMotion ? undefined : { rotate }}>
          <defs>
            <radialGradient id="lens-core" cx="50%" cy="45%" r="55%">
              <stop offset="0%" stopColor="#296853" stopOpacity="0.9" />
              <stop offset="70%" stopColor="#0e2b21" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#081a14" />
            </radialGradient>
          </defs>
          <circle cx="200" cy="200" r="190" fill="none" stroke="#d99b26" strokeOpacity="0.5" strokeWidth="1.5" />
          {Array.from({ length: 72 }, (_, i) => {
            const angle = (i * 5 * Math.PI) / 180;
            const inner = i % 6 === 0 ? 170 : 178;
            return (
              <line
                key={i}
                x1={round(200 + Math.cos(angle) * inner)}
                y1={round(200 + Math.sin(angle) * inner)}
                x2={round(200 + Math.cos(angle) * 188)}
                y2={round(200 + Math.sin(angle) * 188)}
                stroke="#f7c873"
                strokeOpacity={i % 6 === 0 ? 0.8 : 0.35}
                strokeWidth="1.5"
              />
            );
          })}
          <circle cx="200" cy="200" r="150" fill="url(#lens-core)" stroke="#d99b26" strokeOpacity="0.35" />
        </motion.svg>

        {/* 內圈反向旋轉：模擬樣品中的菌落與分子 */}
        <motion.svg viewBox="0 0 400 400" className="absolute inset-0 size-full" style={reduceMotion ? undefined : { rotate: counterRotate }}>
          <circle cx="200" cy="200" r="118" fill="none" stroke="#f7c873" strokeOpacity="0.25" strokeDasharray="4 10" />
          {[
            [150, 160, 22], [240, 150, 14], [230, 245, 26], [160, 250, 12], [200, 200, 8], [270, 205, 9], [130, 210, 7],
          ].map(([cx, cy, r], i) => (
            <g key={i}>
              <circle cx={cx} cy={cy} r={r} fill="#d99b26" fillOpacity="0.12" stroke="#f7c873" strokeOpacity="0.6" />
              <circle cx={cx} cy={cy} r={r / 3} fill="#f7c873" fillOpacity="0.7" />
            </g>
          ))}
          <path d="M150 160 L240 150 L230 245 L160 250 Z M200 200 L270 205 M130 210 L150 160" fill="none" stroke="#f7c873" strokeOpacity="0.3" />
        </motion.svg>

        {READINGS.map((reading, i) => (
          <Reading key={reading.label} {...reading} index={i} pointerX={pointerX} pointerY={pointerY} />
        ))}
      </motion.div>
    </motion.div>
  );
}

function Reading({
  label,
  x,
  y,
  depth,
  index,
  pointerX,
  pointerY,
}: (typeof READINGS)[number] & { index: number; pointerX: MotionValue<number>; pointerY: MotionValue<number> }) {
  const reduceMotion = usePrefersReducedMotion();
  // 不同深度的標籤依游標產生視差位移
  const dx = useTransform(pointerX, [-1, 1], [-depth, depth]);
  const dy = useTransform(pointerY, [-1, 1], [-depth, depth]);

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.8 + index * 0.12, duration: 0.5, ease: EASE }}
      style={{ left: x, top: y, ...(reduceMotion ? {} : { x: dx, y: dy }) }}
      className="absolute whitespace-nowrap rounded-full border border-accent-gold/50 bg-base-900/90 px-3 py-1.5 font-mono text-xs text-accent-light shadow-lg backdrop-blur sm:text-sm"
    >
      {label}
    </motion.span>
  );
}
