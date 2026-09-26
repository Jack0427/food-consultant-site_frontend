import { dict, expect, gotoHome, scrollThroughPage, switchLanguage, test } from "./fixtures";

/**
 * 視覺回歸測試：逐區塊與 e2e/__screenshots__ 裡的基準圖比對（區塊相連，合起來即整頁）。
 * 改版後確認畫面正確，再用 `pnpm test:e2e:update` 更新基準圖。
 */

const SECTIONS = ["top", "about", "clients", "services", "process", "cases", "scope", "contact", "faq"] as const;

for (const lang of ["en", "zh-TW"] as const) {
  test.describe(`分區截圖（${lang}）`, () => {
    test.beforeEach(async ({ page }) => {
      await gotoHome(page);
      if (lang !== "en") await switchLanguage(page, lang);
      // 確保 hydration 後的文案已套用
      await expect(page.getByRole("heading", { level: 2, name: dict[lang].contact.title })).toBeAttached();
      await scrollThroughPage(page);
    });

    for (const id of SECTIONS) {
      test(`區塊 #${id}`, async ({ page }) => {
        const section = page.locator(`#${id}`);
        test.skip((await section.count()) === 0, `找不到 #${id}`);
        await section.scrollIntoViewIfNeeded();
        await expect(section).toHaveScreenshot(`${id}-${lang}.png`);
      });
    }
  });
}

test("表單錯誤狀態", async ({ page }) => {
  await gotoHome(page);
  await scrollThroughPage(page);
  await page.getByRole("button", { name: dict.en.contact.form.submit }).click();
  await expect(page.getByRole("alert").filter({ hasText: dict.en.contact.form.errorSummary })).toBeVisible();
  await expect(page.locator("#contact")).toHaveScreenshot("contact-errors-en.png");
});
