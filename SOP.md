# 電商上架快手 — 開發與驗證 SOP

## 規格對齊狀態（2026-11-16）

- ✅ `PRD/SPEC.md` v4.0 已依實際程式重建；`GOAL.md` 定義 M1。
- ⚠️ 本次只重建文件，尚未開發；**建議暫緩，待 Sean 決定**。
- ⚠️ `web/index.html` 目前是轉址，`npm run dev`／`npm run build` 不會載入 React 程式（M1 AC-001 修正）。
- ⚠️ 本次重建環境無法執行 node，下表「結果」欄只引用 GitHub Actions 紀錄，**未在本機執行**。

## 環境

```bash
cd web
npm ci            # 以 package-lock.json 為準（CI 也用 npm）
```

`web/` 同時有 `pnpm-lock.yaml` 與 `pnpm-workspace.yaml`（`allowBuilds` 值為未填的佔位文字），不要用 pnpm 安裝。repo 未設 `.nvmrc`；CI 用 Node 20。

## 驗證指令（依 `web/package.json` scripts 查證）

| 類型 | 指令（在 `web/` 執行） | 狀態 | 最近結果 |
|---|---|---|---|
| Install | `npm ci` | 可用 | CI 2026-09-06 成功（workflow 寫成 `npm ci --legacy-peer-deps \|\| npm install`，會吞掉 `npm ci` 失敗，M1 移除） |
| Lint | `npm run lint` | 可用（`eslint .`） | CI 2026-09-06 成功；未在本機執行 |
| Typecheck | `npm run typecheck` | 可用（`tsc --noEmit`） | CI 未單獨執行（只在 `build` 內執行）；未在本機執行 |
| Unit | `npm test` | 可用（`vitest run`） | CI 2026-09-06：3 檔、16 個測試通過；`tests/e2e.test.tsx` 被排除；未在本機執行 |
| 單一測試檔 | `npm test -- tests/<檔名>.test.ts` | 可用 | — |
| Build | `npm run build` | 可用（`tsc --noEmit && vite build`） | CI 2026-09-06 成功，但只轉換 1 個模組（入口為轉址，React 未打包）；未在本機執行 |
| Dev server | `npm run dev` | 可用（http://localhost:5180/ecom-uploader/） | 未執行；目前會轉址到不存在於建置產物的頁面 |
| Preview | — | **尚未配置** | 無 `preview` script |
| Deploy | `npm run deploy` | script 存在（`gh-pages -d dist`） | 不要手動執行；CI 的 Actions Pages 部署 2026-09-06 失敗 |
| E2E | `npm run e2e` | **尚未配置** | 無 Playwright 設定（AC-001 新增） |
| Format | — | **尚未配置** | 無 formatter |
| Secret 掃描 | `git grep -nIE "(sk-[A-Za-z0-9]{10,}\|AKIA[0-9A-Z]{12,}\|ghp_[A-Za-z0-9]{20,}\|-----BEGIN\|partner_key)" -- web/src web/tests .github` | 可用（git 指令） | 2026-11-16 以 grep 檢查下載的原始碼：無結果 |

尚未配置的指令不得當成通過。M1 完成時，下列指令須全部 exit 0：

```bash
cd web
npm run lint
npm run typecheck
npm test
npm run build
npm run e2e        # M1 新增
```

## 每個 AC 的驗證

見 `GOAL.md` 各 AC 的「驗證」欄。新增測試檔時同步更新本檔與 `GOAL.md`。

## 分支與 PR

1. 從 `main` 開分支（`feat/m1-*`、`fix/*`、`docs/*`）。
2. 本機跑完上方 M1 指令；未執行的項目在 PR 標「未執行」。
3. 開 PR 到 `main`，等 CI 全綠；不 force push，不直接 push `main`。
4. PR 描述列出對應 AC 編號與驗證結果；搬自候選 repo 的程式註明來源檔案與 commit。

## 部署

- 目標：GitHub Pages（`https://openclawsean024-create.github.io/ecom-uploader/`）。
- 現況：repo 的 Pages 來源是 `gh-pages` 分支（最後更新 2026-08-24），workflow 卻用 Actions 部署並失敗。統一方式（改 Pages 來源為 Actions，或改用 `gh-pages` 分支部署）是 repo 設定變更，需 Sean 決定後執行。

## 禁止事項

- 不呼叫任何電商平台 API、不做 RPA／爬蟲、不保存平台帳密。
- 不寫入真實個資、真實商品資料或憑證。
- 不修改候選併入 repo（`ecom-list-fast`、`shop-quick-list`、`ecom-list`）。
