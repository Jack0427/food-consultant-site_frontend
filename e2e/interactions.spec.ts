import { dict, expect, gotoHome, isCollapsedNav, switchLanguage, test } from "./fixtures";

const t = dict.en;
const f = t.contact.form;

test.beforeEach(async ({ page }) => {
  await gotoHome(page);
});

test.describe("導覽", () => {
  test("點選導覽連結會捲到對應區塊", async ({ page }) => {
    if (isCollapsedNav(page)) {
      await page.getByRole("button", { name: t.nav.openMenu }).click();
      await page.locator("#mobile-menu").getByRole("link", { name: t.nav.links.services }).click();
    } else {
      await page.getByRole("navigation", { name: t.nav.label }).getByRole("link", { name: t.nav.links.services }).click();
    }
    await expect(page.locator("#services")).toBeInViewport();
  });

  test("行動選單：開啟、Esc 關閉並把焦點還給按鈕", async ({ page }) => {
    test.skip(!isCollapsedNav(page), "桌面版沒有行動選單");
    const toggle = page.getByRole("button", { name: t.nav.openMenu });
    await toggle.click();
    await expect(page.locator("#mobile-menu")).toBeVisible();
    await expect(page.getByRole("button", { name: t.nav.closeMenu })).toHaveAttribute("aria-expanded", "true");

    await page.keyboard.press("Escape");
    await expect(page.locator("#mobile-menu")).toBeHidden();
    await expect(page.getByRole("button", { name: t.nav.openMenu })).toBeFocused();
  });
});

test.describe("語言切換", () => {
  test("切換成中文後文案與 <html lang> 都會改變，再切回英文", async ({ page }) => {
    await switchLanguage(page, "zh-TW");
    await expect(page.locator("html")).toHaveAttribute("lang", "zh-Hant-TW");
    await expect(page.getByRole("heading", { level: 2, name: dict["zh-TW"].contact.title })).toBeAttached();

    await switchLanguage(page, "en");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.getByRole("heading", { level: 2, name: t.contact.title })).toBeAttached();
  });
});

test.describe("聯絡表單", () => {
  test("服務卡片的「使用模板」會預選分類並聚焦到表單", async ({ page }) => {
    const title = t.services.items.shelfLife.title;
    await page.getByRole("button", { name: `${t.services.useTemplate}: ${title}` }).click();

    await expect(page.getByRole("radio", { name: title })).toBeChecked();
    await expect(page.locator("#contact-start")).toBeFocused();
    await expect(page.getByLabel(f.subject, { exact: true })).toHaveValue(t.contact.templates.shelfLife.subject);
  });

  test("切換分類後，模板預覽與預設主旨一起更新", async ({ page }) => {
    const contact = page.locator("#contact");
    await contact.getByRole("radio", { name: t.services.items.safety.title }).check();
    await expect(contact.getByText(`${t.contact.currentTemplate}: ${t.services.items.safety.title}`)).toBeVisible();
    await expect(contact.getByLabel(f.subject, { exact: true })).toHaveValue(t.contact.templates.safety.subject);
  });

  test("「帶入表單」在已有自訂內容時會先確認，取消則保留原內容", async ({ page }) => {
    const subject = page.getByLabel(f.subject, { exact: true });
    await subject.fill("My own subject");

    page.once("dialog", (dialog) => {
      expect(dialog.message()).toBe(t.contact.replaceConfirm);
      return dialog.dismiss();
    });
    await page.getByRole("button", { name: t.contact.insert }).click();
    await expect(subject).toHaveValue("My own subject");

    page.once("dialog", (dialog) => dialog.accept());
    await page.getByRole("button", { name: t.contact.insert }).click();
    await expect(subject).toHaveValue(t.contact.templates.regulatory.subject);
    await expect(page.getByRole("status").filter({ hasText: t.contact.inserted })).toBeVisible();
  });

  test("空白送出：顯示錯誤摘要、聚焦摘要，欄位標示 aria-invalid", async ({ page }) => {
    await page.getByRole("button", { name: f.submit }).click();

    const summary = page.getByRole("alert").filter({ hasText: f.errorSummary });
    await expect(summary).toBeVisible();
    await expect(summary).toBeFocused();
    for (const label of [f.name, f.email]) {
      await expect(page.getByLabel(label, { exact: true })).toHaveAttribute("aria-invalid", "true");
    }
    await expect(page.getByLabel(f.consent)).toHaveAttribute("aria-invalid", "true");

    // 點錯誤摘要的連結會跳到該欄位
    await summary.getByRole("link", { name: `${f.name}: ${f.errors.required}` }).click();
    await expect(page).toHaveURL(/#inquiry-name$/);
  });

  test("Email 格式錯誤會顯示對應訊息", async ({ page }) => {
    await page.getByLabel(f.email, { exact: true }).fill("not-an-email");
    await page.getByRole("button", { name: f.submit }).click();
    await expect(page.locator("#inquiry-email-error")).toHaveText(f.errors.email);
  });

  test("填妥必填欄位可成功送出，並可再送一筆", async ({ page }) => {
    await page.getByLabel(f.name, { exact: true }).fill("Alex Wang");
    await page.getByLabel(f.email, { exact: true }).fill("alex@example.com");
    await page.getByLabel(f.clientType).selectOption("sme");
    await page.getByLabel(f.consent).check();
    await page.getByRole("button", { name: f.submit }).click();

    const heading = page.getByRole("heading", { name: f.successTitle });
    await expect(heading).toBeVisible();
    await expect(heading).toBeFocused();

    await page.getByRole("button", { name: f.newInquiry }).click();
    await expect(page.getByLabel(f.name, { exact: true })).toHaveValue("");
  });
});
