@AGENTS.md

# 食品研究顧問網站

獨立食品研究顧問（示範人物：林雨辰博士）的單頁式形象網站。目標是讓三種客戶（個人、中小企業、大型企業外包）看懂服務內容與透明的合作流程，並透過「分類 → 信件模板 → 表單」送出諮詢。只做顧問服務，不含實驗室檢驗或代工。

## 指令

```bash
pnpm dev      # 開發伺服器 http://localhost:3000
pnpm build    # 正式建置（含 TypeScript 檢查）
pnpm lint     # ESLint
npx tsc --noEmit
pnpm test:e2e          # Playwright：互動、跑版、axe、截圖比對（會沿用或自動啟動 3000 port 的 dev server）
pnpm test:e2e:update   # 確認畫面改變符合預期後，更新截圖基準
pnpm test:e2e:ui       # 互動式執行與除錯
pnpm test:e2e:report   # 開啟上次的 HTML 報告
```

技術：Next.js 16（App Router、Turbopack）、React 19、Tailwind CSS v4、framer-motion、lucide-react、pnpm。

## 部署（GitHub Pages）

- 網址：https://jack0427.github.io/food-consultant-site_frontend/（repo：`Jack0427/food-consultant-site_frontend`，公開）
- `next.config.ts` 設定 `output: "export"`，`pnpm build` 會輸出純靜態檔案到 `out/`。
- **不能使用需要伺服器的功能**：Server Actions、Route Handlers、cookies、rewrites／redirects／headers、`next/image` 預設 loader 等。
- `basePath` 由環境變數 `PAGES_BASE_PATH` 帶入（Actions 會設成 `/<repo 名稱>`）；本機開發與測試維持根路徑。引用 `public/` 內的檔案時要加上 basePath。
- push 到 `main` 後，`.github/workflows/deploy.yml` 會自動執行 lint、build 並部署。
- 在本機預覽正式版：`PAGES_BASE_PATH=/food-consultant-site_frontend pnpm build`，把 `out/` 放到子資料夾 `food-consultant-site_frontend/` 後，用任一靜態伺服器開啟。

## 架構

- `src/app/page.tsx`：Server Component，依序組合各區塊：Hero → About → ClientTypes → Services → Process → CaseStudies → Scope → Contact → FAQ。
- `src/components/Providers.tsx`：包住 `MotionConfig reducedMotion="user"`、`LanguageProvider`、`InquiryProvider`。
- `src/components/InquiryContext.tsx`：跨區塊共用「目前分類」與「客戶類型」。`goToInquiry()` 會預選後捲動到表單，並把焦點移到 `#contact-start`。
- `src/components/Contact.tsx`：步驟 1 分類（radio）→ 步驟 2 模板（`TemplatePanel`：帶入／複製／mailto）→ 步驟 3 聯絡資料。使用 `useActionState` 呼叫 `submitInquiry`。
- `src/lib/submitInquiry.ts`：表單驗證與 honeypot，在瀏覽器端執行（靜態部署沒有伺服器）。**尚未實作寄信**（見待辦）。
- `src/lib/inquiry.ts`：分類、客戶類型、時程的 ID 常數與表單型別（client 與 server 共用）。
- `src/i18n/`：自製 Context。預設語言為 `en`，可切換成 `zh-TW`，並同步 `<html lang>`（`zh-Hant-TW`）。
  - `locales/en.ts` 是型別來源（`Dictionary`），`zh-TW.ts` 必須符合同一型別。
- 動畫元件：`ParticleField`（canvas 粒子，會回應游標、觸控與捲動）、`Hero`（捲動視差、游標 3D 傾斜）、`ScrollProgress`、`ui/Reveal`（進場動畫）、`Process`（時間軸線條隨捲動填滿）。

## 開發慣例

- **文案一律放在 locale 檔**。新增文字時 `en.ts` 與 `zh-TW.ts` 都要加；型別會強制兩邊結構一致。
- **無障礙（目標 WCAG 2.2 AA）**
  - 每個區塊用 `aria-labelledby` 對應自己的 h2。
  - 裝飾性圖示加 `aria-hidden`。
  - 按鈕名稱若需補充情境，用 `aria-label`，不要用 `sr-only` span，否則會多出空格。
  - 顏色只用 `globals.css` 的 `@theme` 權杖。淺色背景上的強調色用 `accent-deep`，深色背景上的次要文字用 `muted`。
- **動畫**
  - `Reveal` 只做位移，**不可用 `opacity: 0` 當初始狀態**。否則未捲到的區塊、截圖或 JS 未啟動時，畫面會是空白。
  - 需要尊重 `prefers-reduced-motion`。
  - **捲動效能**（曾因此造成明顯卡頓，已實測修正）：
    - 捲動觸發的進場動畫**不要用 `scale`**。縮放每一幀都要以新比例重新點陣化整塊內容；位移只需移動圖層。
    - framer-motion 的位移動畫要搭配 `useLayerWhileAnimating()`（`src/lib/`）：播放期間加 `will-change`，播完移除。不要常駐 `will-change`。
    - 避免在捲動中的固定元素上使用 `backdrop-filter`。
    - `ParticleField` 每幀都會把整張畫布上傳到 GPU：解析度上限 `MAX_DPR`，連線依透明度分組批次 `stroke()`。調整粒子數或解析度前，先量測。
- 會隨語言改變的文字，不要拿來當 React `key`。否則切換語言時元素會重新掛載並重播進場動畫，看起來像沒有反應。
- SSR 與瀏覽器各自計算的浮點數（例如 SVG 座標）要先四捨五入，避免 hydration 不一致。

## 驗證（改完前端必做，流程見全域 skill `frontend-verify`）

- 測試在 `e2e/`，分 desktop（1440）、tablet（820）、mobile（Pixel 7）三個 project，一律開啟「減少動態」。
  - `fixtures.ts`：自動收集 console error，出現就失敗（hydration 不一致會在這裡被抓到）。另有 `gotoHome`、`switchLanguage`、`scrollThroughPage`、`waitForAnimations`。
  - `interactions.spec.ts`：導覽、行動選單、語言切換、聯絡表單流程。
  - `layout.spec.ts`：中英文各檢查水平溢出與 axe（WCAG 2.2 AA）。
  - `visual.spec.ts`：各區塊截圖，基準圖在 `e2e/__screenshots__/`。**新增區塊時要加進 `SECTIONS`。**
- 截圖專用樣式在 `e2e/screenshot.css`。隨捲動變化的元素加 `data-screenshot-hide`。
- 測試文案直接引用 `src/i18n/locales/*.ts`，改文案不必改測試。
- 截圖有差異時，先看 `test-results/**/*-diff.png`；確認是預期的變化，才執行 `pnpm test:e2e:update`。

## 已知陷阱

- **用 IP 開 dev server 時所有互動失效**：Next 16 預設只允許 `localhost` 載入 dev 資源。`next.config.ts` 的 `allowedDevOrigins` 已加入 `127.0.0.1`、`192.168.*.*`、`10.*.*.*`；若改用其他主機名稱（例如 tunnel），也要加進去。
- **剪貼簿**：`navigator.clipboard` 只在 HTTPS 或 localhost 可用，`Contact.tsx` 的 `copyText()` 已有 `execCommand` 備援。
- **行動選單導覽**：選單收合動畫會中斷原生錨點捲動，所以改成在 `AnimatePresence onExitComplete` 之後才呼叫 `scrollToSection()`。
- **`AnimatePresence mode="wait"` 內的新元素**：要等舊元素退場後才會掛載，焦點管理要寫在新元素自己的 mount effect 裡（例如 `SuccessPanel`）。
- 表單欄位對齊靠 CSS subgrid（`Field` 佔 3 列：標籤／輸入框／錯誤訊息）。
- **依「減少動態」決定 render 內容時，用 `@/lib/usePrefersReducedMotion`，不要用 framer 的 `useReducedMotion`**。後者在瀏覽器第一次 render 就讀取設定，與伺服器輸出不同，會造成 hydration 不一致。
- **進場前有水平位移的元素**（例如 `Process` 步驟卡片的 `x: 32`），外層要加 `overflow-x-clip`，否則還沒捲到時會撐出水平捲軸，手機版整頁會被縮小。

## 目前進度（2026-09-26）

已完成：
- 依客戶角度重新設計全部內容，並提供中英雙語。
- 首頁動畫：滑鼠、觸控、滾輪都能觸發，並支援 RWD。
- 各服務分類的信件模板：可帶入表單、複製，或用 mailto 寄出。
- 語系下拉選單。
- 表單驗證、錯誤摘要與焦點管理。
- 行動版選單。
- 無障礙改善：以 axe 檢測（WCAG 2.2 AA），桌面／手機、中英文皆為 0 個違規。

待辦：
- [ ] **串接寄信**：在 `src/lib/submitInquiry.ts` 的 TODO 處接上表單服務（例如 Formspree）或後端 API。目前驗證通過就直接顯示成功，**資料不會送出**。
- [ ] **替換示範資料**：姓名、學經歷、數據、案例、價格、信箱 `hello@example.com` 都是假資料，集中在 `src/i18n/locales/*.ts`（檔案開頭有 TODO 標記）。
- [ ] 以真實照片取代 `About.tsx` 的「YC」佔位頭像（使用 `next/image` 並提供替代文字）。
- [ ] 設計品牌 favicon 與 Open Graph 圖片，並依語系提供 metadata。
