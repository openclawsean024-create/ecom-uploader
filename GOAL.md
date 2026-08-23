# 電商上架快手 Sprint 1 — 多平台上架工具

## 5 個 P0 範圍

### P0-1 商品基本資訊
- 商品標題、分類、品牌、型號、條碼
- 4 步驟 wizard(基本 → 內容 → 平台 → 完成)

### P0-2 商品內容(描述 + 圖片)
- 描述(支援 HTML)
- 多圖上傳(封面 + 細節 5 張)
- AI 文案 mock(按分類生成 3 段文案可選)

### P0-3 平台同步(多帳號)
- 4 個假平台:momo / PChome / Shopee / Yahoo
- 多帳號管理(切換賣家)
- 各平台定價、成本、運費獨立設定

### P0-4 AI 標籤(SEO 自動生成)
- 按品名 + 分類生成 5-10 個 SEO 標籤
- 標籤編輯 + 刪除

### P0-5 草稿儲存 + 完成確認
- 自動儲存草稿(localStorage)
- 發布後看到同步狀態(成功 / 失敗 mock)

## 技術棧
沿用 SOP:Vite + React 19 + TS strict + Tailwind v4 + localStorage mock

## 不引入
- 真實 momo / Shopee API(都沒有公開 API)
- 圖片上傳到雲端(只 URL.createObjectURL)
- SEO 真實爬蟲

## 驗收
- 4 步驟 wizard 完成
- AI 文案 3 段可選
- 4 平台同步 mock 顯示成功
- 標籤自動生成可編輯
- TypeScript strict 0 errors
- 5+ 個 E2E 全綠
