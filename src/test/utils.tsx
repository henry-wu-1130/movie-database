import { PropsWithChildren } from 'react';
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import i18n from 'i18next';
import { initReactI18next, I18nextProvider } from 'react-i18next';
import { languages, fallbackLng } from '@/app/i18n/settings';
import en from '@/locales/en.json';
import zhTW from '@/locales/zh-TW.json';
import ja from '@/locales/ja.json';
import { vi } from 'vitest';

// Mock language store
vi.mock('@/stores/languageStore', () => ({
  useLanguageStore: () => ({
    systemLanguage: 'en',
    movieLanguage: 'en',
    setSystemLanguage: vi.fn(),
    setMovieLanguage: vi.fn(),
  }),
}));

// 為每個測試創建一個新的 QueryClient
export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // 測試時禁用重試
        gcTime: Infinity,
      },
    },
  });
}

// Initialize i18n for testing
i18n.use(initReactI18next).init({
  lng: languages[0],
  fallbackLng,
  resources: {
    en,
    zhTW,
    ja,
  },
  interpolation: {
    escapeValue: false,
  },
});

// 測試用的 wrapper with both QueryClient and i18n
export function createWrapper() {
  const testQueryClient = createTestQueryClient();
  const Wrapper = ({ children }: PropsWithChildren) => (
    <QueryClientProvider client={testQueryClient}>
      <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
    </QueryClientProvider>
  );
  Wrapper.displayName = 'TestWrapper';
  return Wrapper;
}

// 自定義的 render 函數，包含所需的 providers
export function renderWithClient(ui: React.ReactElement) {
  // 設置 React 18 測試環境的 act() 警告處理
  // 這可以防止 "act" 警告，特別是對於異步操作
  const originalError = console.error;
  console.error = (...args: unknown[]) => {
    if (
      typeof args[0] === 'string' &&
      /Warning.*not wrapped in act/.test(args[0])
    ) {
      return;
    }
    originalError(...args);
  };

  const testQueryClient = createTestQueryClient();
  const { rerender, ...result } = render(
    <QueryClientProvider client={testQueryClient}>
      <I18nextProvider i18n={i18n}>{ui}</I18nextProvider>
    </QueryClientProvider>
  );

  // 恢復原始的 console.error
  console.error = originalError;

  return {
    ...result,
    rerender: (rerenderUi: React.ReactElement) =>
      rerender(
        <QueryClientProvider client={testQueryClient}>
          <I18nextProvider i18n={i18n}>{rerenderUi}</I18nextProvider>
        </QueryClientProvider>
      ),
  };
}
