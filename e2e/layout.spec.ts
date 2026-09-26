import AxeBuilder from "@axe-core/playwright";
import { expect, gotoHome, switchLanguage, test } from "./fixtures";

const LANGUAGES = ["en", "zh-TW"] as const;

for (const lang of LANGUAGES) {
  test.describe(`版面（${lang}）`, () => {
    test.beforeEach(async ({ page }) => {
      await gotoHome(page);
      if (lang !== "en") await switchLanguage(page, lang);
    });

    test("沒有水平捲軸，也沒有元素超出視窗寬度", async ({ page }) => {
      const overflow = await page.evaluate(() => {
        const width = document.documentElement.clientWidth;
        const offenders: string[] = [];
        for (const el of document.querySelectorAll<HTMLElement>("body *")) {
          // 刻意移出畫面的元素（honeypot、skip link）與被裁切的內容不算跑版
          if (el.closest("[aria-hidden='true'], .sr-only")) continue;
          const rect = el.getBoundingClientRect();
          if (rect.width === 0 || rect.right <= width + 1) continue;
          let clipped = false;
          for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
            const { overflowX } = getComputedStyle(p);
            if (overflowX !== "visible" && p.getBoundingClientRect().right <= width + 1) {
              clipped = true;
              break;
            }
          }
          if (!clipped) {
            const id = el.id ? `#${el.id}` : "";
            const cls = typeof el.className === "string" ? `.${el.className.split(" ").slice(0, 3).join(".")}` : "";
            offenders.push(`${el.tagName.toLowerCase()}${id}${cls} right=${Math.round(rect.right)}`);
          }
        }
        return { scrollWidth: document.documentElement.scrollWidth, width, offenders: offenders.slice(0, 10) };
      });

      expect(overflow.offenders, "超出視窗寬度的元素").toEqual([]);
      expect(overflow.scrollWidth, "頁面出現水平捲軸").toBeLessThanOrEqual(overflow.width);
    });

    test("無障礙檢查（WCAG 2.2 AA）沒有違規", async ({ page }) => {
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
        .analyze();
      const summary = results.violations.map(
        (v) => `${v.id}：${v.help}\n${v.nodes.map((n) => `  - ${n.target.join(" ")}\n    ${n.failureSummary?.split("\n").slice(1).join(" ")}`).join("\n")}`,
      );
      expect(summary).toEqual([]);
    });
  });
}
