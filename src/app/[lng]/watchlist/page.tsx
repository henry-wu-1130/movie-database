'use client';

import { useMemo, useState, Suspense } from 'react';
import { useT } from '@/app/i18n/client';
import { MovieCard } from '@/components/MovieCard';
import { useWatchlistStore } from '@/stores/watchlistStore';
import SortSelect from '@/components/SortSelect';
import { useLanguageStore } from '@/stores/languageStore';
import { useQueries } from '@tanstack/react-query';
import * as tmdbValidated from '@/services/tmdbValidated';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import {
  useSortStore,
  type SortField,
  type SortDirection,
} from '@/stores/sortStore';

export default function WatchlistPage() {
  const { t } = useT('watchlist', {});
  const watchlistStore = useWatchlistStore();
  const { movieIds } = watchlistStore;
  const { watchlistSort } = useSortStore();
  const { movieLanguage } = useLanguageStore();

  // 分頁設置
  const PAGE_SIZE = 20; // 每頁顯示 20 部電影
  const [currentPage, setCurrentPage] = useState(1);

  // 計算總頁數
  const totalPages = Math.ceil(movieIds.length / PAGE_SIZE);

  // 獲取當前頁的電影 ID
  const currentPageMovieIds = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return movieIds.slice(startIndex, startIndex + PAGE_SIZE);
  }, [movieIds, currentPage]);

  // 使用 React Query 只加載當前頁的電影詳情
  const movieQueries = useQueries({
    queries: currentPageMovieIds.map((id) => ({
      queryKey: ['movie', 'detail', id, movieLanguage],
      queryFn: () => tmdbValidated.getMovieDetails(id, movieLanguage),
      staleTime: 1000 * 60 * 5, // 5 分鐘內不重新獲取
    })),
  });

  // 提取電影數據並過濾掉加載中或錯誤的查詢
  const watchlistMovies = useMemo(() => {
    // 確保我們可以過濾和映射 Proxy 對象
    const validQueries = [];

    // 手動過濾和映射查詢結果
    for (let i = 0; i < movieQueries.length; i++) {
      const query = movieQueries[i];
      if (query && query.isSuccess && query.data) {
        validQueries.push(query.data);
      }
    }

    return validQueries;
  }, [movieQueries]);

  // 檢查是否有任何查詢正在加載
  const isLoading = useMemo(() => {
    for (let i = 0; i < movieQueries.length; i++) {
      if (movieQueries[i]?.isLoading) {
        return true;
      }
    }
    return false;
  }, [movieQueries]);

  // 頁面切換處理函數
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // 解析排序選項
  const [sortField, sortDirection] = watchlistSort.split('.') as [
    SortField,
    SortDirection
  ];

  // 使用 useMemo 來記憶化排序結果，避免不必要的重新排序
  const sortedMovies = useMemo(() => {
    if (watchlistMovies.length === 0) return [];

    return [...watchlistMovies].sort((a, b) => {
      let comparison = 0;

      // 根據不同的排序字段進行比較
      switch (sortField) {
        case 'popularity':
          comparison = (a.popularity || 0) - (b.popularity || 0);
          break;
        case 'vote_average':
          comparison = (a.vote_average || 0) - (b.vote_average || 0);
          break;
        case 'release_date':
          comparison =
            new Date(a.release_date || '').getTime() -
            new Date(b.release_date || '').getTime();
          break;
        case 'original_title':
          comparison = (a.title || '').localeCompare(b.title || '');
          break;
        default:
          comparison = 0;
      }

      // 根據排序方向調整比較結果
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [watchlistMovies, sortField, sortDirection]);

  return (
    <main className="flex-1 py-8">
      <div className="mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('watchlist.title')}
            {movieIds.length > 0 && (
              <span className="text-sm font-normal ml-2 text-gray-500">
                ({currentPage}/{totalPages} {t('watchlist.page')})
              </span>
            )}
          </h1>
          {movieIds.length > 0 && !isLoading && (
            <Suspense
              fallback={
                <SortSelect className="w-full md:w-auto" mode="watchlist" />
              }
            >
              <SortSelect className="w-full md:w-auto" mode="watchlist" />
            </Suspense>
          )}
        </div>

        {movieIds.length === 0 ? (
          <div className="text-center py-12" data-testid="empty-watchlist">
            <p className="text-gray-500 dark:text-gray-400">
              {t('watchlist.empty')}
            </p>
          </div>
        ) : isLoading ? (
          <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(180px,1fr))]">
            {currentPageMovieIds.map((id) => (
              <div key={id} className="flex flex-col gap-2">
                <Skeleton className="aspect-[2/3] w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(180px,1fr))]">
              {sortedMovies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} variant="fluid" />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  {t('watchlist.previous')}
                </Button>

                <span className="text-sm mx-2">
                  {currentPage} / {totalPages}
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  {t('watchlist.next')}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
