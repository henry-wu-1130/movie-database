import { PropsWithChildren } from 'react';
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import i18n from 'i18next';
import { initReactI18next, I18nextProvider } from 'react-i18next';
import { DEFAULT_LANGUAGE } from '@/config/i18n';

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
i18n
  .use(initReactI18next)
  .init({
    lng: DEFAULT_LANGUAGE,
    fallbackLng: 'en-US',
    resources: {
      'zh-TW': {
        translation: {
          'home.popularMovies': '熱門電影',
          'home.nowPlaying': '現正熱映',
          'home.upcomingMovies': '即將上映',
          'search.placeholder': '搜尋電影...'
        }
      },
      'en-US': {
        translation: {
          'home.popularMovies': 'Popular Movies',
          'home.nowPlaying': 'Now Playing',
          'home.upcomingMovies': 'Upcoming Movies',
          'search.placeholder': 'Search movies...'
        }
      }
    },
    interpolation: {
      escapeValue: false
    }
  });

// 測試用的 wrapper with both QueryClient and i18n
export function createWrapper() {
  const testQueryClient = createTestQueryClient();
  const Wrapper = ({ children }: PropsWithChildren) => (
    <QueryClientProvider client={testQueryClient}>
      <I18nextProvider i18n={i18n}>
        {children}
      </I18nextProvider>
    </QueryClientProvider>
  );
  Wrapper.displayName = 'TestWrapper';
  return Wrapper;
}

// 自定義的 render 函數，包含所需的 providers
export function renderWithClient(ui: React.ReactElement) {
  const testQueryClient = createTestQueryClient();
  const { rerender, ...result } = render(
    <QueryClientProvider client={testQueryClient}>{ui}</QueryClientProvider>
  );
  return {
    ...result,
    rerender: (rerenderUi: React.ReactElement) =>
      rerender(
        <QueryClientProvider client={testQueryClient}>
          {rerenderUi}
        </QueryClientProvider>
      ),
  };
}
