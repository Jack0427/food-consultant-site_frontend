"use client";

import { motion } from "framer-motion";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

/**
 * 捲動進入畫面時上移並放大到定位。
 * 刻意不使用 opacity 0 作為初始狀態：內容在任何時候（尚未捲到、截圖、JS 未載入）都可見。
 * 使用者開啟「減少動態」時由 MotionConfig 自動停用位移。
 */
export default function Reveal({ children, className, delay = 0 }: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ y: 24, scale: 0.98 }}
      whileInView={{ y: 0, scale: 1 }}
      viewport={{ once: true, margin: "0px 0px -80px 0px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
