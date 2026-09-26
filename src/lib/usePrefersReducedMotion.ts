import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const media = window.matchMedia(QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

/**
 * 取代 framer-motion 的 useReducedMotion，用在「依設定決定 render 內容」的地方。
 * framer 的版本在瀏覽器第一次 render 就讀 matchMedia，與伺服器輸出不同會造成 hydration 不一致；
 * 這裡在 hydration 期間先沿用伺服器的值（false），完成後才換成實際設定。
 */
export function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}
