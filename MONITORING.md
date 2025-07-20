# 專案監控設置

這個專案使用 Sentry 來追蹤錯誤和監控效能。所有服務都使用 Docker Compose 進行管理，確保開發環境的一致性。

## 快速開始

### 1. 首次設置

首次使用時，需要初始化 Sentry：
```bash
# 啟動資料庫服務
npm run monitor:up

# 初始化 Sentry
docker-compose run --rm sentry sentry upgrade
```

### 2. 日常使用

啟動服務：
```bash
npm run monitor:up
```

檢查服務狀態：
```bash
npm run monitor:ps
```

停止服務：
```bash
npm run monitor:down
```

## 服務訪問

- Sentry 監控面板: http://localhost:9000
  - 預設管理員帳號: admin@example.com
  - 預設密碼: admin

## 專案整合

### 1. 安裝 Sentry SDK
```bash
npm install --save @sentry/nextjs
```

### 2. 設置環境變數
在 `.env.local` 文件中添加：
```env
NEXT_PUBLIC_SENTRY_DSN=your-dsn-from-sentry
```

## 注意事項

1. 請在首次登入後立即修改預設密碼
2. 定期備份監控數據
3. 在提交代碼時，確保不要將 Sentry DSN 等敏感信息提交到版本控制系統

## 注意事項

1. 首次啟動時需要初始化 Sentry：
```bash
docker-compose run --rm sentry sentry upgrade
```

2. 請記得修改預設密碼

3. 在程式中使用 Sentry 時，需要將 DSN 加入到環境變數中：
```env
NEXT_PUBLIC_SENTRY_DSN=your-dsn-from-sentry
```
