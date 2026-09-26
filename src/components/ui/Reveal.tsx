"use client";

import { motion } from "framer-motion";
import { useLayerWhileAnimating } from "@/lib/useLayerWhileAnimating";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

/**
 * 捲動進入畫面時上移到定位。
 * 刻意不使用 opacity 0 作為初始狀態：內容在任何時候（尚未捲到、截圖、JS 未載入）都可見。
 * 刻意不做縮放：scale 動畫每一幀都要以新比例重新點陣化整塊內容，全頁數十個區塊連續觸發會造成捲動卡頓；
 * 位移只需移動已繪製好的圖層（播放期間以 will-change 提升為獨立圖層）。
 * 使用者開啟「減少動態」時由 MotionConfig 自動停用位移。
 */
export default function Reveal({ children, className, delay = 0 }: RevealProps) {
  const layer = useLayerWhileAnimating<HTMLDivElement>();
  return (
    <motion.div
      {...layer}
      className={className}
      initial={{ y: 24 }}
      whileInView={{ y: 0 }}
      viewport={{ once: true, margin: "0px 0px -80px 0px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
