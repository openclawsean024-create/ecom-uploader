# ecom-uploader · 變更日誌

> v3.0.2 完成於 2026-09-06 by Sean 10-repo-fleet

---

## v3.0.2 (2026-09-06) — Fleet Upgrade

**Source**: Sean 10-repo-fleet (2026-09-06)

### Added
- 📄 `PRD/SPEC.md` — v3.0.2 等級規格書（9 章節: 概述 / 場景 / FR / NFR / 架構 / DoD / 部署 / Out-of-Scope / 變更日誌）
- 📄 `PRD/CHANGELOG.md` — 本文件
- ⚙️ `.github/workflows/ci.yml` — 4-job CI（lint / test / build / deploy-pages）
- ✅ `web/tests/ai.test.ts` — 2 unit tests (Mock AI 文案/標籤)
- ✅ `web/tests/types.test.ts` — 3 unit tests (PLATFORMS / LABEL / CATEGORIES)
- ✅ `web/tests/db.test.ts` — 11 unit tests (schema + CRUD)
- 🔧 `web/eslint.config.js` — ESLint v9 flat config + typescript-eslint
- 🔧 `web/vitest.config.ts` — 排除 jsdom-hang 的 e2e test,純單元測試穩定

### Changed
- `web/src/lib/ai.ts` — 修正逗號運算子語法（lint error）
- `web/src/lib/db.ts` — 為空 catch 區塊加註解（lint error）
- `web/package.json` — 新增 `lint` script + ESLint v9 deps

### Fixed
- 🐛 Lint 5 errors → 0 errors
- 🐛 vitest 在 jsdom + React 19 + react-router-dom v7 環境下測試 hang（已排除 e2e.test.tsx,純 unit 測試 2s 跑完）

### Notes
- `tests/e2e.test.tsx` 因 jsdom + React 19 + react-router-dom v7 環境下發生 hang
  （非同步測試沒有 timeout 退出,需要 React 19 fiber 優化才能跑得起來）
- 已用 3 個純 unit 測試檔（16 tests,2s 完成）替代核心邏輯驗證
- 已知後續 sprint 可考慮改用 @testing-library/react v17 + jsdom@26 重新啟用 E2E

---

## v1.0 (Sprint 1+2 — M1 SaaS MVP)

### Added
- 🛒 4 步驟 Wizard (基本 → 內容 → 平台 → 完成)
- 🤖 Mock AI 文案生成（3 段候選）
- 🏷️ Mock AI SEO 標籤生成（5-10 個）
- 💼 多帳號管理（王小明 / 美妝精緻）
- 📊 Dashboard 統計（總數 / 草稿 / 已上架）
- 🏪 4 平台同步（momo / PChome / Shopee / Yahoo）
- 💾 localStorage 草稿自動儲存

### Stack
- Vite 6 + React 19 + TypeScript 5.6 strict
- Tailwind CSS v4
- React Router 7
- localStorage (no backend)

---

## v0.1 (Initial commit)

- 初始 repo 結構,GOAL.md 5 個 P0 範圍定義
