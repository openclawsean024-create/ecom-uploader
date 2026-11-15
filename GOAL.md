# Goal — 電商上架快手 M1

> **建議暫緩，需 Sean 決定後才開發。** 理由見 `PRD/SPEC.md` §0：多數台灣平台的上架 API 未確認開放，產品價值取決於「上架資料整理與匯出」是否有人願意付費。Sean 若決定開發，需先選定 M1 的 2 個匯出平台（下文以 `<平台A>`、`<平台B>` 表示，建議蝦皮＋momo）。

## Objective

在只使用假資料、不呼叫任何電商平台 API、不代登任何賣家後台的前提下，把 `ecom-uploader` 修成可用的本機工具：賣家建立一個商品主檔，系統依 2 個平台的欄位規則檢查缺漏，並各產出一份可下載的 CSV。同時併入 `ecom-list-fast` 選定的驗證與格式化邏輯，並讓品質閘門真正擋得住失敗。

規格依據：`PRD/SPEC.md` v4.0（§5 FR、§9 M1、§12 合併清單）。

## Acceptance criteria

每條 AC 的「驗證」指令必須 exit 0。測試檔名為 M1 需新增的檔案，名稱可在實作 PR 調整，但須同步更新本檔與 `SOP.md`。所有指令在 `web/` 目錄執行。

- **AC-001：品質閘門擋得住失敗，入口恢復為 SPA**
  - `web/index.html` 還原為載入 `/src/main.tsx` 的 SPA 入口；刪除 `web/public/dashboard.html`。
  - Router 在 GitHub Pages 子路徑 `/ecom-uploader/` 下可用（`BrowserRouter` 設 `basename={import.meta.env.BASE_URL}`，或改用 HashRouter，擇一並記錄）。
  - `vitest.config.ts` 的 `setupFiles` 載入 `tests/setup.ts`；不再排除 E2E 類測試；新增 `e2e` script（Playwright，固定 `Asia/Taipei`、每個測試清空 localStorage）。
  - 只保留 npm lockfile，刪除 `pnpm-lock.yaml`、`pnpm-workspace.yaml`。
  - CI 新增 typecheck 與 e2e job，deploy 需等全部 job 通過；workflow 不含 `continue-on-error` 或 `|| npm install`、`|| echo` 之類的吞錯寫法。
  - 驗證：`npm run lint && npm run typecheck && npm test && npm run build && npm run e2e` 全部 exit 0；`grep -nE "continue-on-error|\|\| (echo|npm install|true)" ../.github/workflows/ci.yml` 無結果；`grep -c "main.tsx" index.html` 為 1；`npm run build` 後 `dist/assets/` 內有 JS bundle（`ls dist/assets/*.js`）；PR 上 GitHub Actions 全綠。

- **AC-002：商品主檔模型與驗證（併入 ecom-list-fast）**（FR-001、FR-002、§12.1）
  - `Product` 新增 `sku`、`stock`、每平台覆寫標題；狀態改為 `draft`／`ready`／`exported`／`needs_fix`，舊資料讀取時自動遷移（`published` → `exported` 或 `draft`，規則寫在測試中）。
  - 從 `ecom-list-fast/web/src/hooks/useLaunchboard.ts` 的 `validateDraft` 改寫純函式 `validateProduct`（名稱至少 2 字、SKU 至少 3 字、庫存為非負整數、售價大於 0）；精靈每一步驟依此擋下一步並顯示錯誤。
  - 搬入 `ecom-list-fast/web/src/utils/format.ts` 與其測試，只保留 TWD 相關用法。
  - 驗證：`npm test -- tests/product-model.test.ts tests/validate-product.test.ts tests/format.test.ts`；`npm run e2e -- tests/e2e/wizard-validation.spec.ts`（空白標題無法進下一步，並顯示錯誤）。

- **AC-003：商品編輯與草稿自動儲存**（FR-003、FR-004、FR-010）
  - 新增 `/products/:id` 編輯頁，沿用精靈步驟；「我的商品」的編輯連結可用。
  - 精靈每次欄位變更後寫入 localStorage 草稿；重新整理或離開後回來可續填；可明確「捨棄草稿」。
  - 商品歸屬目前帳號；`listProducts(accountId)` 真正依帳號篩選。
  - 驗證：`npm test -- tests/db.test.ts tests/draft-autosave.test.ts`；`npm run e2e -- tests/e2e/edit-and-resume.spec.ts`（填一半 → reload → 資料仍在 → 完成 → 編輯 → 修改後儲存）。

- **AC-004：兩個平台的欄位 schema 與必填檢核**（FR-006、FR-008）
  - `src/lib/platforms/<平台A>.ts`、`<平台B>.ts` 各定義欄位清單、必填、字數上限、版本號與「最後確認日期」；規則來源若尚未取得官方範本，檔頭註明「草案，待以官方範本確認」。
  - 純函式 `checkListing(product, platform)` 回傳缺漏與超限欄位；商品卡與看板顯示「需補欄位：N」，數字由計算得出，不寫死。
  - 驗證：`npm test -- tests/platform-schema.test.ts`（各平台：完整商品通過；缺必填、標題超長各回傳正確欄位代碼）。

- **AC-005：CSV 匯出**（FR-007）
  - 每個平台可下載一份 CSV：UTF-8 含 BOM、欄位順序依 schema、含 schema 版本；有缺漏時禁止匯出並列出缺漏欄位。
  - 匯出成功後狀態變為 `exported`，記錄匯出時間與 schema 版本。
  - 匯出頁標示「本工具只產生檔案，請自行到平台後台上傳；與各平台無合作關係」。
  - 驗證：`npm test -- tests/export-csv.test.ts`（快照比對兩個平台的輸出、BOM、逗號與換行跳脫）；`npm run e2e -- tests/e2e/export.spec.ts`（下載事件觸發、檔名含平台與日期）。

- **AC-006：不呼叫平台、不誤導、HTML 安全**（FR-014、§8）
  - M1 程式不含任何電商平台網域或 API 呼叫；UI 不出現「完成上架」「已同步」「Live」等暗示已上架的字樣，改為「已匯出」。
  - 描述 HTML 以白名單清理（允許 `p`、`strong`、`ul`、`li`、`h3`、`br`）後才預覽與匯出；`<script>`、事件屬性、`javascript:` 連結被移除。
  - 文案模板移除「品質保證」「台灣現貨 24h 出貨」等未經查證的承諾，改為中性句並提示「請依實際情況修改」。
  - 驗證：`npm test -- tests/sanitize.test.ts tests/ai.test.ts`；`grep -rnE "shopee\.|momoshop|pchome\.com|yahoo\.com|ruten|myshopify|fetch\(" src` 無結果；`grep -rnE "完成上架|已同步|Live" src` 無結果。

- **AC-007：只用明顯假資料、無憑證**（§7）
  - seed、測試、fixture 改用明顯假資料：賣家名「示範賣家 A」，電話若有則用 `0900-000-xxx`，Email 用 `@example.com`；移除 `王小明 個人賣家`。
  - 提供「匯出本機資料（JSON）」與「清除本機全部資料」。
  - 驗證：`npm test -- tests/fixtures-safety.test.ts tests/local-data.test.ts`；`git grep -nIE "(sk-[A-Za-z0-9]{10,}|AKIA[0-9A-Z]{12,}|ghp_[A-Za-z0-9]{20,}|-----BEGIN|partner_key)" -- src tests ../.github` 無結果。

- **AC-008：文件與實況一致**
  - `README.md` 寫明定位（上架資料整理與匯出，非自動上架）、啟動、測試、部署指令與 Pages 網址；測試數量與實際一致。
  - `STATUS.md` 記錄 AC-001～AC-007 指令與結果；`PRD/SPEC.md` §5 FR 狀態更新。
  - 驗證：人工覆審；`grep -n "npm run e2e" README.md` 有結果。

## Out of scope

- 任何電商平台 API 呼叫（蝦皮 Open Platform、Shopify Admin API 等）、OAuth、token 保存；partner 申請。
- RPA、瀏覽器自動化代登賣家後台、爬取平台頁面、保存平台帳號密碼（永久不做）。
- 真實 LLM 呼叫（`ai.ts` 維持規則式 mock）；付費 API 金鑰。
- 計費、金流、發票；後端、資料庫、雲端同步、真實登入。
- 圖片上傳與雲端圖床（FR-013 排 M2）；官方批次上架 Excel 範本的完整對齊（M2）。
- 落地頁、行銷頁；真實賣家資料、真實商品資料。
- 封存、刪除或改名 `ecom-list-fast`、`shop-quick-list`、`ecom-list`（由 Sean 決定）。

## Exit gate

- Sean 已在 `PRD/SPEC.md` §13 決定「開發」並選定 `<平台A>`、`<平台B>`；否則本 GOAL 不啟動。
- AC-001～AC-008 的驗證指令全部 exit 0，指令與結果記錄於 `STATUS.md`。
- 實作 PR 的 GitHub Actions 全綠（lint、typecheck、test、build、e2e）。
- `PRD/SPEC.md` §12 合併清單中每個「搬」項目都有對應模組與測試。
- Sean 覆審後才可進入 M2（官方範本對齊、試用賣家、圖片、LLM 測試金鑰）。
