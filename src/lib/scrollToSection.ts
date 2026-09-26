/**
 * 平滑捲動到指定區塊，並把焦點移過去（鍵盤與螢幕閱讀器使用者才能接續閱讀）。
 * 用於行動選單：選單收合動畫會中斷瀏覽器原生的錨點平滑捲動。
 */
export function scrollToSection(id: string) {
  const target = document.getElementById(id);
  if (!target) return;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  history.pushState(null, "", `#${id}`);
  if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
  target.focus({ preventScroll: true });
}
