import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 部署到 GitHub Pages：輸出純靜態檔案到 out/（不支援 Server Actions 等需要伺服器的功能）
  output: "export",
  // 專案頁網址是 https://<帳號>.github.io/<repo>/，由 GitHub Actions 帶入 /<repo>；本機開發與測試維持根路徑
  basePath: process.env.PAGES_BASE_PATH || "",
  // 開發模式預設只允許 localhost 載入 dev 資源；用 127.0.0.1 或區網 IP（例如手機測試）開啟時，
  // 若未列在這裡，頁面雖會顯示但 JavaScript 不會啟動，所有互動都會失效。
  allowedDevOrigins: ["127.0.0.1", "192.168.*.*", "10.*.*.*"],
};

export default nextConfig;
