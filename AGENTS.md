# AGENTS.md — 電商上架快手（ecom-uploader）

## 1. 權威文件與範圍

- 規格：[`PRD/SPEC.md`](./PRD/SPEC.md) v4.0（§0 評估結論、FR 狀態、合併清單、里程碑）。
- 目前目標：[`GOAL.md`](./GOAL.md)（只含 M1；**建議暫緩，Sean 決定後才開發**）。
- 驗證指令：[`SOP.md`](./SOP.md)；目前狀態：[`STATUS.md`](./STATUS.md)。
- 變更紀錄：`PRD/CHANGELOG.md`（舊版，v4.0 文件重建未改動）。
- 候選併入 repo 一律**只讀**：`ecom-list-fast`、`shop-quick-list`、`ecom-list`。搬什麼、不搬什麼以 SPEC §12 為準。

## 2. 產品定位（寫程式前必讀）

- 本產品是「**上架資料整理與匯出**」工具，不是自動上架工具。M1 不呼叫任何電商平台 API。
- 永久不做：RPA／瀏覽器自動化代登賣家後台、爬取平台頁面、保存平台帳號密碼。
- UI 不得出現暗示已真實上架或同步的字樣（「完成上架」「已同步」「Live」），改用「已匯出」。

## 3. 專案結構

```
web/
├── index.html              # ⚠️ 目前被換成轉址到 public/dashboard.html，SPA 沒被載入（M1 AC-001 修正）
├── public/dashboard.html   # 與本產品無關的通用後台範本（M1 刪除）
├── src/
│   ├── main.tsx、App.tsx   # BrowserRouter（未設 basename）+ 5 個路由
│   ├── components/Layout.tsx
│   ├── pages/              # Dashboard、WizardPage、ProductsPage、PlatformsPage、AccountsPage
│   └── lib/                # db.ts（localStorage）、ai.ts（規則式文案／標籤）、types.ts、bootstrap.ts（載入時寫 demo 資料）
├── tests/                  # ai、db、types 會執行；e2e.test.tsx 被排除；setup.ts 未被載入
├── vite.config.ts          # base: '/ecom-uploader/'，dev port 5180
├── vitest.config.ts        # jsdom；setupFiles 為空
├── eslint.config.js        # ESLint 9 flat + typescript-eslint + react-hooks
├── package-lock.json       # 以 npm 為準
└── pnpm-lock.yaml、pnpm-workspace.yaml   # 多餘（allowBuilds 值是未填的佔位文字），M1 刪除
PRD/                        # SPEC.md、CHANGELOG.md
.github/workflows/ci.yml    # lint / test / build / deploy（Pages）
```

## 4. 技術棧

| 項目 | 版本／說明 |
|---|---|
| 建置 | Vite 6（`^6.0.0`） |
| UI | React 19、React Router 7、Tailwind CSS v4（`@tailwindcss/vite`） |
| 語言 | TypeScript 5.6 strict（`noUnusedLocals`、`verbatimModuleSyntax`） |
| 測試 | Vitest 2（jsdom）、Testing Library（已安裝，E2E 檔目前未執行） |
| Lint | ESLint 9 |
| 資料 | 只有瀏覽器 localStorage（key：`ecom-uploader:db`、`ecom-uploader:currentAccount`） |
| Node | CI 用 20；repo 未設 `.nvmrc`／`engines` |
| 部署 | GitHub Pages：workflow 用 Actions 部署，但 repo Pages 設定來源是 `gh-pages` 分支（legacy），兩者不一致 |

## 5. 開發規則

1. 先讀 `GOAL.md`；未經 Sean 決定「開發」不得開始 M1 實作。
2. 每個 AC 對應的測試要先寫或同時寫；未執行的檢查在 PR 與 `STATUS.md` 標「未執行」，不得當成通過。
3. 不新增電商平台網域、API client、OAuth 或 token 相關程式（M3 前）。
4. 描述 HTML 必須經白名單清理後才渲染或匯出；不得對未清理內容使用 `dangerouslySetInnerHTML`。
5. seed、測試、fixture 只用明顯假資料（「示範賣家 A」、電話 `0900-000-xxx`、`@example.com`）；不得寫入真實賣家、商品或憑證。
6. 平台欄位規則若非取自官方範本，檔頭須標「草案，待確認」與最後確認日期。
7. 不修改候選併入 repo；搬程式時在 PR 註明來源檔案與 commit。
8. 只用 npm；不新增第二套樣式系統（不搬 `launchboard.css`）。
9. 不 push 到 `main`、不使用 force push；PR 需 CI 全綠。

## 6. 完成定義

- `SOP.md` 列出的 M1 指令全部 exit 0，CI 全綠。
- `STATUS.md` 更新 FR 對照與 AC 結果；`README.md` 與實況一致。
