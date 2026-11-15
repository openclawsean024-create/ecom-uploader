# Status — ecom-uploader（電商上架快手，暫定）

- 產品：電商上架快手（多平台商品上架資料整理與匯出）
- 主 repo：`openclawsean024-create/ecom-uploader`（`main` @ `91aa1ad`）
- 候選併入（只讀）：`ecom-list-fast`（`eb42550`）、`shop-quick-list`（`71bdba0`）、`ecom-list`（`b68ea9d`）
- 規格：`PRD/SPEC.md` v4.0；目標：`GOAL.md`（M1）
- 狀態：🟡 **文件重建完成，尚未開發；建議暫緩，待 Sean 決定**（2026-11-16）

## 評估摘要

| 項目 | 結論 |
|---|---|
| 現況完成度 | 20／100 |
| 獲利潛力 | 低～中 |
| 獲利模式 | 免費增值（備案：模板販售） |
| 建議 | 暫緩 |
| 關鍵理由 | 已查證有官方上架 API 的只有蝦皮（需 partner 申請）與 Shopify；momo、PChome、Yahoo 待確認。沒有 API 的平台只能做資料整理與匯出，付費意願未驗證 |

## 目前狀態摘要

- 純前端 React 19 SPA，資料存 localStorage，4 步驟精靈、規則式文案／標籤、多帳號、平台統計。
- **入口壞掉**：`web/index.html` 被換成轉址到 `public/dashboard.html`（無關的通用後台範本），React 程式不會被載入或打包。
- 線上 Pages 仍是 2026-08-24 `gh-pages` 分支的舊建置；2026-09-06 CI deploy 失敗。
- 無圖片、無編輯頁、無草稿自動儲存、無欄位檢核、無匯出；「完成上架」只改狀態。
- 描述 HTML 未清理即渲染。

## FR 對照（以 `main` 程式為準）

| FR | 需求 | 優先 | 狀態 | 所在 repo |
|---|---|---|---|---|
| FR-001 | 商品主檔 | P0 | 部分 | ecom-uploader |
| FR-002 | 4 步驟精靈 | P0 | 部分（無驗證） | ecom-uploader |
| FR-003 | 商品編輯頁 | P0 | 未實作 | — |
| FR-004 | 草稿自動儲存 | P0 | 未實作 | — |
| FR-005 | 各平台價格與毛利 | P0 | 部分 | ecom-uploader |
| FR-006 | 平台欄位 schema 與必填檢核 | P0 | 未實作 | 概念在 ecom-list-fast |
| FR-007 | CSV 匯出 | P0 | 未實作 | — |
| FR-008 | 狀態：草稿／資料齊全／已匯出／需補欄位 | P0 | 部分 | ecom-uploader；看板概念在 ecom-list-fast |
| FR-009 | 文案與標籤輔助（規則式） | P1 | 已實作 | ecom-uploader |
| FR-010 | 多帳號與商品歸屬 | P1 | 部分 | ecom-uploader |
| FR-011 | 總覽統計 | P1 | 部分 | ecom-uploader |
| FR-012 | 平台統計頁 | P2 | 已實作 | ecom-uploader |
| FR-013 | 圖片管理 | P1 | 未實作 | — |
| FR-014 | 描述 HTML 清理 | P0 | 未實作 | — |
| FR-015 | 本機資料匯出／清除 | P1 | 未實作 | — |
| FR-016 | Intl 格式化 | P2 | 未實作 | ecom-list-fast 有 |
| FR-017 | 蝦皮 Open Platform 串接 | P2 | 未實作 | — |
| FR-018 | Shopify 串接 | P2 | 未實作 | — |
| FR-019 | 真實 LLM 文案 | P2 | 未實作 | — |
| FR-020 | 計費 | P2 | 未實作 | — |
| FR-021 | 安全庫存與低庫存提醒 | P2 | 未實作 | ecom-list-fast 只有靜態展示 |

## M1 AC 進度

| AC | 標題 | 狀態 |
|---|---|---|
| AC-001 | 品質閘門擋得住失敗，入口恢復為 SPA | 未開始 |
| AC-002 | 商品主檔模型與驗證（併入 ecom-list-fast） | 未開始 |
| AC-003 | 商品編輯與草稿自動儲存 | 未開始 |
| AC-004 | 兩個平台的欄位 schema 與必填檢核 | 未開始 |
| AC-005 | CSV 匯出 | 未開始 |
| AC-006 | 不呼叫平台、不誤導、HTML 安全 | 未開始 |
| AC-007 | 只用明顯假資料、無憑證 | 未開始 |
| AC-008 | 文件與實況一致 | 未開始 |

## 驗證紀錄

| 日期 | 指令 | 結果 |
|---|---|---|
| 2026-09-06 | CI：lint／test／build | 成功（test：3 檔 16 個通過）；build 只轉換 1 個模組 |
| 2026-09-06 | CI：deploy | 失敗 |
| 2026-11-16 | 本機 lint／typecheck／test／build | **未在本機執行**（環境無 node） |
| 2026-11-16 | 原始碼 secret／手機號／Email 掃描（grep） | 無憑證；無真實手機號或 Email |

## 本次為文件重建

- 只新增或改寫 `PRD/SPEC.md`、`GOAL.md`、`AGENTS.md`、`SOP.md`、`STATUS.md`；未動任何程式、設定、測試。
- 舊 `GOAL.md`（Sprint 1）與舊 SPEC v3.0.2 已被取代，可由 git 歷史查閱。

## 待決事項（Sean）

1. 是否同意「暫緩」？若開發，M1 選哪 2 個平台匯出（建議蝦皮＋momo）。
2. 平台清單是否納入露天、Shopify、酷澎。
3. 三個重複 repo 合併後是否封存（本次不動）。
4. Pages 部署方式統一（Actions 或 `gh-pages` 分支），屬 repo 設定變更。
5. 是否申請 Shopee Open Platform partner（M3 前置；資格待確認）。
6. 與第一批 10 個產品的重疊比對（brief 未提供清單）。

## 風險備忘

- 平台條款：不做 RPA／爬蟲／代登後台。
- `ecom-list-fast` 示範工作區名稱「小日子選物店」可能與既有品牌名稱相近，若搬 UI 時改為中性假名。
- 舊 SPEC 的市場數字與競品價格無出處，已不再引用。
