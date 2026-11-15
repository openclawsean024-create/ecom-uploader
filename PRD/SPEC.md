# 電商上架快手（暫定）— 產品需求規格 v4.0

> 版本：v4.0（評估＋PRD 重建）｜更新日期：2026-11-16｜狀態：文件重建，尚未依本版開發
> 主 repo：`openclawsean024-create/ecom-uploader`（預設分支 `main`，重建基準 commit `91aa1ad`）
> 候選併入 repo（只讀）：
> - `openclawsean024-create/ecom-list-fast`（`main` @ `eb42550`，Vite + React 18 SPA）
> - `openclawsean024-create/shop-quick-list`（`main` @ `71bdba0`，靜態 HTML）
> - `openclawsean024-create/ecom-list`（`main` @ `b68ea9d`，只有 PRD 與通用 dashboard.html）
> 取代：本 repo 的 v3.0.2 SPEC（2026-09-06）。舊版仍可由 git 歷史查閱。
>
> 本文件中「已實作／部分／未實作」皆以 2026-11-16 實際閱讀程式碼與 GitHub Actions 最近執行紀錄為準。**本機無法執行 node，所有 lint／test／build 結果均「未在本機執行」**，只引用 CI 紀錄。README 與程式不一致之處列於 §14。

---

## §0 評估結論

### 0.1 一句話結論

**建議：暫緩。** 台灣主要電商平台中，經本次查證確定有官方商品上架 API 的只有蝦皮（Shopee Open Platform，需申請 partner）與 Shopify；momo、PChome、Yahoo 是否開放第三方上架 API 皆**待確認**，一般認知是以供應商後台提報為主。在沒有 API 的平台，產品只能做「上架資料整理與匯出」，而這塊與平台自己的批次上架工具、91APP／SHOPLINE／CYBERBIZ 的多通路方案重疊，付費意願未驗證。建議 Sean 先決定目標平台，並完成 5 位賣家訪談與 2 個平台的匯出範本取得，再決定是否開發。

### 0.2 評估摘要

| 項目 | 結論 |
|---|---|
| 現況完成度 | **20／100**（依程式實況，見 0.3） |
| 獲利潛力 | **低～中**（理由見 0.4） |
| 目標客群 | 台灣 1–3 人、SKU 少於 50、同時在 2 個以上平台販售的小賣家（規模與付費意願待訪談確認） |
| 獲利模式 | **免費增值**（單一平台匯出免費；多平台範本、批次匯出、AI 文案付費）；備案為**模板販售**（各平台上架欄位範本＋檢核表） |
| 主要風險 | 平台條款（不得以 RPA／爬蟲代登後台）、平台 API 申請資格、匯出範本隨平台改版失效、競品已覆蓋多通路、商品描述 HTML 安全 |
| 建議 | **暫緩**（需 Sean 決定目標平台與定位後才開發 M1） |
| 主 repo 選擇 | `ecom-uploader`（理由見 0.5） |
| 與其他專案重疊 | `ecom-list-fast`、`shop-quick-list`、`ecom-list` 三個 repo 是同一產品的重複嘗試（見 §12 合併清單）。與第一批 10 個產品的重疊：brief 未提供清單，本次未比對，**待確認**。帳號內 `hermes-publisher`（把 SKILL.md 上架到 Capafy）名稱相近但領域不同，不重疊 |

### 0.3 完成度依據（20／100）

主 repo `ecom-uploader` 的實況：

- 有：React 19 + React Router 7 的 5 個頁面（總覽、4 步驟精靈、我的商品、平台統計、多帳號）、localStorage CRUD、規則式「AI」文案（3 段固定模板）與標籤（關鍵字對照）、ESLint、Vitest 3 個測試檔 16 個測試（CI 2026-09-06 通過）。
- **入口壞掉**：`web/index.html` 在 commit `c0bf9d7`（2026-09-05「apply 家服 dashboard design」）被換成 `<meta refresh>` 轉址到 `./public/dashboard.html`，React 程式不再被載入；CI build 紀錄只轉換 1 個模組，證實 SPA 沒被打包。`public/dashboard.html` 是與本產品無關的通用後台範本（「今日訂單」「本月行程」等）。
- 沒有：圖片上傳、草稿自動儲存、商品編輯頁（`/products/:id` 路由不存在）、各平台欄位對應與必填檢核、任何匯出、任何真實或模擬的同步失敗、帳號與商品的關聯（`listProducts(accountId)` 忽略參數）。
- 「完成上架」只是把狀態設為 `published`，沒有任何平台動作，畫面卻寫「完成上架」，有誤導風險。

### 0.4 獲利潛力：低～中

1. **API 可用性決定天花板**：只有蝦皮與 Shopify 有已查證的上架 API；其他平台只能匯出，價值降為「整理資料＋套範本」。
2. **免費替代品多**：各平台賣家後台通常有批次上架（Excel 範本）功能（各平台範本格式**待確認**），Google Sheets 也能做。
3. **競品已在**：91APP、SHOPLINE、CYBERBIZ 皆有多通路或通路串接產品（`ecom-list-fast/PRD/UI-SPEC.md` 有記錄；功能範圍與價格本次未重新查證，**待確認**）。
4. **客群預算低**：舊 SPEC 推估微型賣家工具預算 NT$0–499／月，屬內部假設，**待確認**。
5. 可能的切入點：「一次寫好，產出各平台可貼上／可匯入的版本＋必填檢核」，以低價或免費引流，搭配範本販售。是否成立需訪談驗證。

### 0.5 主 repo 選擇：ecom-uploader（而非 ecom-list-fast）

| 面向 | ecom-uploader | ecom-list-fast |
|---|---|---|
| 頁面與路由 | 5 個 React Router 路由 | 單一畫面；側欄／導覽只跳 toast |
| 資料保存 | localStorage CRUD（`lib/db.ts`） | 只在記憶體，重新整理即消失 |
| 新增商品 | 4 步驟精靈，含各平台售價／成本／運費 | Modal 只有名稱、SKU、幣別、庫存 |
| 平台 | momo／PChome／蝦皮／Yahoo（符合台灣主流） | 蝦皮／露天／Yahoo／Shopify |
| 品質檢查 | `lint`、`typecheck`、`test`、`build` script 都有；CI 在 `web/` 執行，lint／test／build 通過 | 無 lint script；CI 在 repo 根目錄 `npm ci`，3 個 job 全部失敗（找不到 lockfile） |
| 測試 | 3 檔 16 個（另有 1 個 e2e 檔被排除） | 1 檔 3 個（只測格式化函式） |
| 弱點 | 入口 `index.html` 被換成轉址（M1 首要修正）；UI 粗糙 | UI 與無障礙（focus trap、表單驗證、Intl 格式化）較精緻 |

結論：`ecom-uploader` 的資料流與流程較完整，`ecom-list-fast` 的 UI 細節可挑部分搬入（§12）。

### 0.6 平台上架 API 可行性（本產品可行性的關鍵）

| 平台 | 官方商品上架 API | 本次查證證據 | 本產品可做的事 |
|---|---|---|---|
| 蝦皮 Shopee | **有**：Shopee Open Platform v2，含 `product/add_item` | `open.shopee.com` 回應 200；`partner.shopeemobile.com/api/v2/product/add_item` 回 `There is no partner_id in query`，證實端點存在且需 partner 身分。申請資格（是否需公司登記、ISV 審核時程、費用）**待確認** | M1：匯出資料；M3：申請 partner 後經賣家 OAuth 授權串接 |
| Shopify | **有**：Admin GraphQL `productCreate`，需 `write_products` 權限 | shopify.dev 官方文件（2026-11-16 讀取） | M3 可串（是否納入平台清單待 Sean 決定） |
| momo 購物網 | **待確認**。一般認知是供應商模式，以 momo 供應商系統（SCM）提報商品；未找到公開開發者 API | `scm.momoshop.com.tw` 回應 200，內容未能讀取 | 只做資料整理與匯出（依 momo 提供給廠商的範本，需取得） |
| PChome 24h | **待確認**。一般認知是供應商模式；未找到公開開發者 API | 未查到官方文件 | 只做資料整理與匯出 |
| Yahoo 購物中心／超級商城 | **待確認** | 未查到官方文件 | 只做資料整理與匯出 |
| 露天拍賣 | **待確認** | 未查到官方文件 | 只做資料整理與匯出 |
| 酷澎 Coupang | **待確認**（`developers.coupang.com` 存在但回 403；台灣是否開放未查證） | — | 暫不列入 |

**原則**：

- 有官方 API 的平台，只透過官方 API 並經賣家授權操作。
- 沒有 API 的平台，只產出檔案或可複製文字，由賣家自己上傳或貼上。
- **不做** RPA、瀏覽器自動化代登賣家後台、爬取平台頁面，也不保存賣家的平台帳號密碼（可能違反平台條款，且有帳號被停權風險）。

---

## §1 問題

台灣小賣家同時在 2 個以上平台販售時：

1. **重複填寫**：同一商品的標題、描述、規格、價格要在每個後台各填一次。
2. **欄位規則不同**：標題字數、分類、必填欄位、圖片規格各平台不同（具體規則**待確認**，需取得各平台官方說明或範本），漏填就被退件或下架。
3. **價格與成本分散**：各平台抽成與運費不同，賣家難以一眼看出各平台毛利。
4. **沒有 API 可用**：多數台灣平台沒有開放給小賣家的上架 API（§0.6），自動同步不可行。

## §2 目標客群

| 類型 | 描述 | 備註 |
|---|---|---|
| Primary | 1–3 人小賣家，SKU 少於 50，同時經營蝦皮加上另一個平台 | 規模、平台組合、付費意願待訪談 |
| Secondary | 代營運小團隊，替多個品牌上架 | 對應現有「多帳號」頁；需求待確認 |
| 不服務（M1–M2） | 品牌廠商、需 ERP／WMS 整合的中大型賣家 | 91APP 等企業方案的範圍 |

## §3 獲利模式

- **免費增值**（主案，價格皆為假設、**待確認**）：

| 方案（草案） | 內容（草案） |
|---|---|
| 免費 | 單一平台匯出、商品數上限 |
| 付費（月費待確認） | 多平台匯出、批次匯出、必填檢核、AI 文案（M2 起才接真實 LLM） |

- **模板販售**（備案）：各平台上架欄位對照表、檢核表、文案範本。
- 不採 SaaS 高價訂閱、專案建置：與 91APP 等正面衝突，且小賣家預算低（待確認）。

## §4 競品與差異

競品名單取自 `ecom-list-fast/PRD/UI-SPEC.md` 與 `ecom-list/PRD/SPEC.md` 的既有記錄；功能、市佔、價格**本次未重新查證，全部標「待確認」**。舊 SPEC 中的月費數字（例如 NT$2,388、NT$2,688、NT$30,000）不得當作事實引用。

| 競品／替代方案 | 類型（待確認） | 本產品差異假設 |
|---|---|---|
| 各平台後台批次上架（Excel 範本） | 平台內建、免費 | 一次填寫，產出多平台版本；跨平台必填檢核 |
| 91APP（IMS） | 品牌全通路 | 不做 ERP／訂單／庫存，只做上架前的資料準備 |
| SHOPLINE（多通路） | 官網＋通路串接 | 同上；更輕、更便宜（待驗證） |
| CYBERBIZ（Channel Bridge） | 官網＋蝦皮串接 | 同上 |
| Google Sheets＋人工 | 現況替代 | 內建平台規則與檢核，不必自己維護範本 |

## §5 功能需求

狀態以 2026-11-16 程式為準。「所在 repo」指目前實作所在位置。

| FR | 需求 | 優先 | 狀態 | 所在 repo |
|---|---|---|---|---|
| FR-001 | 商品主檔：標題、分類、品牌、型號、條碼、描述、標籤、圖片 | P0 | 部分（無圖片、無編輯頁） | ecom-uploader |
| FR-002 | 4 步驟建立精靈（基本→內容→平台→確認） | P0 | 部分（可走完；欄位無驗證） | ecom-uploader |
| FR-003 | 商品編輯（`/products/:id`） | P0 | 未實作（連結存在、路由不存在） | — |
| FR-004 | 草稿自動儲存與「另存草稿」 | P0 | 未實作（精靈中途離開即遺失；舊 GOAL/SPEC 寫已完成） | — |
| FR-005 | 各平台價格、成本、運費與毛利試算 | P0 | 部分（可輸入；無毛利計算、無平台抽成設定） | ecom-uploader |
| FR-006 | 平台欄位對應與必填檢核（每個平台一份 schema，列出缺漏欄位） | P0 | 未實作（`ecom-list-fast` 有 `missingFields` 顯示概念，無規則） | — |
| FR-007 | 匯出：每個平台產出 CSV（M1）；正式範本格式待取得官方檔案後再對齊 | P0 | 未實作 | — |
| FR-008 | 商品狀態：草稿／資料齊全／已匯出／需補欄位（取代誤導性的「已上架」） | P0 | 部分（目前為 draft／published／failed） | ecom-uploader；lane 概念在 ecom-list-fast |
| FR-009 | 文案輔助：依分類產生 3 段候選文案、5–10 個標籤 | P1 | 已實作（規則式 mock，非 AI） | ecom-uploader |
| FR-010 | 多帳號（賣家／店舖）切換，商品歸屬帳號 | P1 | 部分（可新增與切換；商品未歸屬帳號） | ecom-uploader |
| FR-011 | 總覽統計（全部／草稿／已匯出） | P1 | 部分（統計 draft／published） | ecom-uploader |
| FR-012 | 平台統計頁（各平台啟用商品數） | P2 | 已實作 | ecom-uploader |
| FR-013 | 圖片管理：本機選取、預覽、封面＋細節圖，檢查尺寸 | P1 | 未實作 | — |
| FR-014 | 描述 HTML 安全：輸入時清理，預覽不直接 `dangerouslySetInnerHTML` 未清理內容 | P0 | 未實作（`WizardPage.tsx` 直接插入） | — |
| FR-015 | 本機資料匯出／清除（備份與刪除） | P1 | 未實作 | — |
| FR-016 | 數字與幣別格式化（Intl） | P2 | 未實作（`ecom-list-fast/web/src/utils/format.ts` 有） | ecom-list-fast |
| FR-017 | 蝦皮 Open Platform 串接（OAuth 授權、建立商品） | P2 | 未實作 | — |
| FR-018 | Shopify Admin API 串接 | P2 | 未實作（是否納入待決定） | — |
| FR-019 | 真實 AI 文案（LLM） | P2 | 未實作 | — |
| FR-020 | 計費（免費增值） | P2 | 未實作 | — |
| FR-021 | 安全庫存緩衝、低庫存提醒 | P2 | 未實作（`ecom-list-fast` 只有靜態展示） | ecom-list-fast |

## §6 非功能需求

| 面向 | 需求 |
|---|---|
| 可用性 | 商品從建立到匯出 1 個平台檔案，目標 5 分鐘內（待用戶測試驗證） |
| 正確性 | 匯出檔欄位順序、編碼（UTF-8 含 BOM，供 Excel 開啟）固定，有快照測試 |
| 安全 | 描述 HTML 經白名單清理；不保存平台密碼；M1 不存任何 token |
| 隱私 | M1 只存在使用者瀏覽器 localStorage；提供清除 |
| 無障礙 | 表單有 label；Modal／抽屜有 focus trap 與 Escape（參考 ecom-list-fast） |
| 部署 | GitHub Pages 子路徑 `/ecom-uploader/` 下路由可用（Router 需設定 basename 或改用 HashRouter） |
| 品質閘門 | lint、typecheck、test、build、e2e 全部擋得住失敗，CI 不得 `continue-on-error` |

## §7 資料與個資處理

- M1 資料：商品資料、賣家顯示名稱、店名，全部存在使用者瀏覽器 localStorage，無後端。
- 個資：商品資料一般不含個資；帳號名稱屬賣家自填。seed 與測試只用明顯假資料（例：「示範賣家 A」、電話 `0900-000-001`、Email `@example.com`）。現有 seed `王小明 個人賣家` 改為明顯假名。
- M3 若串蝦皮／Shopify：access token 只能存在後端並加密，不得放在 localStorage（`ecom-list/PRD/SPEC.md` §16.3 的「BYOK 存 localStorage」設計**不採用**）。
- 匯出檔由使用者下載，本產品不代傳到任何平台（M1–M2）。

## §8 法規與風險

| 風險 | 說明 | 對策 |
|---|---|---|
| 平台條款 | 以自動化工具代登賣家後台或爬取平台頁面，可能違反平台使用條款（各平台條文**待確認**） | 不做 RPA／爬蟲；只用官方 API 或匯出檔 |
| API 資格 | 蝦皮 partner 申請可能需公司登記與審核（**待確認**） | M3 前由 Sean 確認資格與時程 |
| 範本失效 | 平台改版使匯出格式失效 | 每個平台 schema 有版本號與「最後確認日期」；匯出前提醒 |
| 商標與品牌 | 使用平台名稱與 Logo | 只用文字名稱說明相容性，聲明「與各平台無合作關係」；不使用平台 Logo |
| 廣告內容 | 文案模板含「品質保證」「台灣現貨 24h 出貨」等承諾，賣家照抄可能不實 | 模板改為中性描述，加提示「請依實際情況修改」 |
| XSS | 描述 HTML 未清理直接渲染；匯出後貼到平台也可能帶入不當標籤 | FR-014 |
| 競品 | 91APP、SHOPLINE、CYBERBIZ 已有多通路產品 | 定位上架前資料準備，不做訂單與庫存 |
| 市場數字 | 舊 SPEC 中「蝦皮台灣活躍賣家約 60 萬」等數字無出處 | 本版不引用，**待確認** |

## §9 里程碑

| 里程碑 | 範圍 | 進入條件 |
|---|---|---|
| **M1：本機上架資料整理與匯出** | 修復入口；商品 CRUD 與編輯；草稿自動儲存；2 個平台的欄位 schema 與必填檢核；CSV 匯出；HTML 清理；狀態改名；品質閘門；搬入 ecom-list-fast 的格式化與表單驗證 | Sean 決定「開發」並選定 M1 的 2 個平台 |
| M2：驗證與正式範本 | 取得各平台官方批次上架範本並對齊；5 位賣家試用；圖片管理；LLM 文案（測試金鑰、有額度上限）；落地頁（可參考 shop-quick-list 舊版） | M1 Exit gate 通過；試用賣家名單 |
| M3：官方 API 串接與計費 | 後端＋加密 token；蝦皮 Open Platform（sandbox 先行）；Shopify（若納入）；免費增值計費（測試模式） | partner 資格確認；M2 付費意願證據 |

## §10 成功指標

| 指標 | M1 | M2 |
|---|---|---|
| 建立 1 個商品並匯出 2 個平台檔案 | e2e 測試通過 | 試用者實測中位數 5 分鐘內（待驗證） |
| 匯出檔被平台接受 | — | 試用者回報匯入成功率（目標待定） |
| 付費意願 | — | 5 位受訪者中至少 2 位願意付費（門檻待 Sean 確認） |
| 品質 | lint／typecheck／test／build／e2e 全綠 | 同左 |

## §11 技術現況（主 repo）

- `web/`：Vite 6、React 19、React Router 7、Tailwind CSS v4、TypeScript strict、ESLint 9、Vitest 2（jsdom）。
- `web/src/lib/`：`db.ts`（localStorage）、`ai.ts`（規則式文案／標籤）、`types.ts`（Product、Account、4 個平台、8 個分類）、`bootstrap.ts`（載入時寫入 demo 資料）。
- `web/src/pages/`：Dashboard、WizardPage、ProductsPage、PlatformsPage、AccountsPage。
- `web/tests/`：`ai`、`db`、`types` 三檔被執行；`e2e.test.tsx` 被 `vitest.config.ts` 排除，且 `setupFiles` 為空，`tests/setup.ts`（jest-dom）沒被載入。
- CI（`.github/workflows/ci.yml`）：lint、test、build、deploy。2026-09-06 執行：lint／test／build 成功，deploy 失敗。Pages 設定實際來源是 `gh-pages` 分支（legacy，最後更新 2026-08-24），與 workflow 的 Actions 部署方式不一致。
- 部署路徑：`vite.config.ts` 設 `base: '/ecom-uploader/'`，但 `BrowserRouter` 沒設 `basename`，在 Pages 子路徑下路由推論會對不上（未在瀏覽器驗證）。

## §12 合併清單

### 12.1 ecom-list-fast → ecom-uploader

| 項目 | 決定 | 原因 |
|---|---|---|
| `web/src/utils/format.ts` 與 `format.test.ts`（Intl 金額／數字格式） | **搬**（FR-016） | 小而獨立、有測試；只保留 TWD 用法 |
| `useLaunchboard.ts` 的 `validateDraft`（名稱至少 2 字、SKU 至少 3 字、庫存非負） | **搬**，改寫為純函式並併入精靈驗證（FR-002） | 主 repo 精靈完全沒驗證 |
| SKU 欄位、庫存欄位 | **搬**到 Product 型別 | 主 repo 只有條碼，匯出需要 SKU |
| 各平台結果（`channelStatuses`：每平台標題／價格／狀態） | **搬概念**，改為每平台覆寫標題與匯出狀態（FR-006、FR-008） | 對應「一個主檔、多平台版本」 |
| `missingFields`／`contentCoverage` | **搬概念**，由平台 schema 計算，不寫死（FR-006） | 原為 mock 數字 |
| Draft／Ready／Live／Needs attention 四欄看板 | **搬概念**，改名為草稿／資料齊全／已匯出／需補欄位（FR-008） | 沒有 API 時不能稱 Live |
| `CreateProductModal`、`ProductDrawer` 的 focus trap 與 Escape | **搬做法**（NFR 無障礙） | 主 repo 無 Modal 無障礙處理 |
| Launchboard 外框（Rail、Sidebar、TopBar、MobileNav） | **不搬** | 導覽只跳 toast，沒有實際頁面 |
| `mockData.ts`（通路「Connected · 42 live」、活動紀錄 actor「Mavis」） | **不搬** | 暗示已真實連線，會誤導 |
| 多語系／多時區／多幣別切換 | **不搬**（M1–M2） | 目標客群為台灣，僅 TWD |
| 露天、Shopify 通路 key | **暫不搬**，待 Sean 決定平台清單 | 與主 repo 的 momo／PChome 清單不同 |
| `InventoryRules`、`ActivityStream`、`GoLiveChecklist` | **不搬**（M1） | 靜態展示，無邏輯 |
| `styles/launchboard.css`（1,164 行） | **不搬** | 主 repo 用 Tailwind，避免兩套樣式 |
| `public/*.html` 原型 | **不搬** | 設計參考，留在原 repo |
| React 18／React Router 6 相依 | **不搬** | 主 repo 已是 React 19／Router 7 |

### 12.2 shop-quick-list → ecom-uploader

| 項目 | 決定 | 原因 |
|---|---|---|
| 目前 `main` 的 `index.html`（轉址）與 `dashboard.html`（通用後台範本） | **不搬** | 與本產品無關 |
| 舊版落地頁（commit `8dc04f9` 的 `index.html`，1,266 行：Hero＋上架工作台 mockup） | **不搬入 app**；M2 做落地頁時可參考 | 行銷頁，不屬於 M1 |
| 「重新生成文案」3 組候選的互動 | **不搬**（主 repo 已有同等 3 段候選） | 重複 |
| `assets/lucide.min.js`、`tailwind.min.css` | **不搬** | 主 repo 用 Tailwind v4 建置 |

### 12.3 ecom-list → ecom-uploader

| 項目 | 決定 | 原因 |
|---|---|---|
| Persona 假設（SKU 少、月營業額低的小賣家）、30／60／90 天驗證節奏 | **參考**（寫入 §2、§9，標待確認） | 未經驗證 |
| sweet spot／商業化分數（6.8／77.6）、市場數字、競品月費 | **不採用** | 內部打分與無出處數字 |
| 平台 API key「BYOK 存 localStorage」設計 | **不採用** | 安全風險（§7） |
| 平台清單「蝦皮／Momo／PChome／Yahoo／Shopee」 | **不採用** | 蝦皮與 Shopee 是同一平台，重複列出 |
| `dashboard.html` | **不搬** | 通用後台範本 |

### 12.4 主 repo 內要移除或修正的

| 項目 | 處理 |
|---|---|
| `web/index.html` 的 meta refresh 轉址 | 還原為載入 `/src/main.tsx` 的 SPA 入口（M1 AC-001） |
| `web/public/dashboard.html` | 刪除（與產品無關，且用 Tailwind CDN） |
| `web/pnpm-lock.yaml`、`web/pnpm-workspace.yaml`（`allowBuilds` 值是未填的佔位文字） | 只保留 npm lockfile（CI 用 npm） |

## §13 待 Sean 決定

1. 建議「暫緩」：是否同意？或直接以「匯出工具」範圍開發 M1？
2. M1 先支援哪 2 個平台的匯出（建議：蝦皮＋momo，或蝦皮＋Yahoo）？
3. 平台清單是否納入露天、Shopify、酷澎？
4. 三個重複 repo（`ecom-list-fast`、`shop-quick-list`、`ecom-list`）在合併完成後是否封存（本次不動）？
5. 是否以個人或公司名義申請 Shopee Open Platform partner（M3 前置）？
6. 第一批 10 個產品清單是否有與本產品重疊者（本次 brief 未提供，未比對）？

## §14 README 與程式不符清單

| 文件說法 | 程式實況 |
|---|---|
| `README.md` 只有標題「M1 SaaS MVP」 | 無啟動、測試、部署說明 |
| 舊 `GOAL.md`／SPEC FR-008：「localStorage 草稿自動儲存」已完成 | 精靈狀態只在 React state，中途離開即遺失 |
| 舊 SPEC FR-002／FR-010：多圖上傳、`URL.createObjectURL` 已 shipped | 程式沒有任何圖片上傳 |
| 舊 SPEC FR-006：「同步狀態（成功／失敗 mock）」 | 只把狀態設為 `published`，沒有失敗情境 |
| 舊 SPEC §4：「無 XSS 風險（受控 HTML）」 | `WizardPage.tsx` 以 `dangerouslySetInnerHTML` 直接插入使用者輸入 |
| 舊 SPEC §5.3：「localStorage 不可用時顯示警告」 | 只有空 catch，沒有警告 |
| 舊 SPEC §6 DoD：GHA 4 jobs 全綠 | 2026-09-06 執行 deploy job 失敗 |
| 舊 SPEC §6：E2E 存在 | `e2e.test.tsx` 被排除，從未在 CI 執行 |
| 舊 GOAL：「真實 momo／Shopee API 都沒有公開 API」 | 蝦皮有 Shopee Open Platform（§0.6）；momo 待確認 |
| 舊 GOAL：「5+ 個 E2E 全綠」 | 0 個 E2E 被執行 |
| `ProductsPage` 有「編輯」連結到 `/products/:id` | 路由不存在 |
| `listProducts(accountId)` | 參數被忽略，所有帳號看到同一批商品 |
| `web/index.html` 應為 SPA 入口 | 被換成轉址到 `./public/dashboard.html`（build 後該路徑也不存在） |
| 候選 repo `shop-quick-list` README／AGENTS：「index.html 854 行含 APP mockup」「不得用 Tailwind CDN」 | 目前 `index.html` 只有轉址，`dashboard.html` 使用 Tailwind CDN |
| 候選 repo `ecom-list-fast` README「npm run dev」可用；CI 4 jobs | CI 在根目錄執行 `npm ci`，3 個 job 全部失敗；無 `lint` script |
