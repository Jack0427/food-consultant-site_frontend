import { test as base, expect, type Page } from "@playwright/test";
import { en } from "../src/i18n/locales/en";
import { zhTW } from "../src/i18n/locales/zh-TW";

export const dict = { en, "zh-TW": zhTW };

/**
 * 每個測試都會自動檢查：console.error 與未捕捉的例外一律視為失敗。
 * hydration 不一致、React key 警告、執行期錯誤都會在這裡被抓到。
 */
export const test = base.extend<{ consoleErrors: string[] }>({
  consoleErrors: [
    async ({ page }, use) => {
      const errors: string[] = [];
      page.on("console", (msg) => {
        if (msg.type() === "error") errors.push(msg.text());
      });
      page.on("pageerror", (err) => errors.push(err.message));
      await use(errors);
      expect(errors, "頁面出現 console error 或未捕捉的例外").toEqual([]);
    },
    { auto: true },
  ],
});

export { expect };

/** 開啟首頁並等待 JS 啟動完成（hydration 後互動才有效） */
export async function gotoHome(page: Page) {
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await page.evaluate(() => document.fonts.ready);
  await waitForAnimations(page);
}

/**
 * 等進場淡入等動畫播完。「減少動態」只停用位移，opacity 動畫仍會播放；
 * 動畫途中做對比度檢查或截圖，會得到半透明的顏色而誤判。
 */
export async function waitForAnimations(page: Page) {
  await page.waitForFunction(() => document.getAnimations().every((a) => a.playState !== "running"));
}

/**
 * 由上往下捲過整頁，觸發所有「捲到才播放」的進場效果（Reveal、Process 步驟），再回到頁首。
 * 截圖前呼叫，畫面才會是使用者實際看到的最終狀態。
 */
export async function scrollThroughPage(page: Page) {
  await page.evaluate(async () => {
    const step = window.innerHeight / 2;
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    }
    window.scrollTo(0, 0);
  });
  await waitForAnimations(page);
}

export async function switchLanguage(page: Page, target: "en" | "zh-TW") {
  const label = target === "en" ? "English" : "繁體中文";
  const toggle = page.getByRole("button", { name: /^(Language|語言)/ });
  await toggle.click();
  await page.getByRole("button", { name: label, exact: true }).click();
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await waitForAnimations(page);
}

/** 手機與平板的導覽列收在選單按鈕內 */
export function isCollapsedNav(page: Page) {
  return (page.viewportSize()?.width ?? 0) < 1024;
}
