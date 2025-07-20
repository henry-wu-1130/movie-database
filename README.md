- [i18n]多語系設定
- [i18n]系統偵測使用者語言
- [i18n]系統語言與電影翻譯語言分開
- [i18n]系統切換語言的優化手段（React Query 的 invalidateQueries）
- [測試]完整測試（單元測試、e2e 測試）
- [抽象化]不過度抽象化
- [效能]React Query cache 的優化手段
- [效能]影片播放器最佳比例（aspect ratio）16/9
- [效能]Zustand 結合 persist 儲存 watchlist, language
- [效能]Sentry 監控

- [效能]lightouse CI 及 pr comment 報告
- [效能]埋 web-vitals 程式碼
- [SEO]SEO / meta tags
- [CI/CD]CI/CD
- [設計]統一的元件設計（按鈕、電影卡、電影播放器）區分為 ui / components
- [TypeScript]Zod TypeScript type check
- [UI]movie card 下方標題以及年份的最小高度再縮小一點，且標題過長應該以 ... 結尾，hover 時再 tooltip 顯示完整標題
- [測試]snapshot testing
- [效能]vi.mock 有沒有一個最佳實踐？目前會不會一堆不必要的 mock？

msw mock server

- npx msw init ./src --
