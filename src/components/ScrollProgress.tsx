"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/** 頁面頂端的閱讀進度條（純裝飾） */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  return (
    <motion.div
      aria-hidden="true"
      data-screenshot-hide
      className="fixed inset-x-0 top-0 z-[60] h-1 origin-left bg-gradient-to-r from-accent-gold via-accent-light to-accent-amber"
      style={{ scaleX }}
    />
  );
}
