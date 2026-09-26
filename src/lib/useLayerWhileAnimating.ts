import { useRef } from "react";

/**
 * 動畫播放期間才加上 will-change: transform，讓元素提升成獨立圖層，由合成器直接移動，
 * 不必每一幀重新繪製整塊內容；播完就移除，避免全頁數十個常駐圖層佔用 GPU 記憶體。
 * 直接改 DOM style，不觸發 React 重新 render。
 */
export function useLayerWhileAnimating<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  return {
    ref,
    onAnimationStart: () => {
      if (ref.current) ref.current.style.willChange = "transform";
    },
    onAnimationComplete: () => {
      if (ref.current) ref.current.style.willChange = "";
    },
  };
}
