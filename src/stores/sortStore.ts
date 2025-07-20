import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type SortField = 'popularity' | 'vote_average' | 'release_date' | 'original_title';
export type SortDirection = 'asc' | 'desc';
export type SortOption = `${SortField}.${SortDirection}`;

type SortStore = {
  // 待看清單排序選項
  watchlistSort: SortOption;
  setWatchlistSort: (sort: SortOption) => void;
  
  // 搜尋頁排序選項 (保留以向後兼容)
  searchSort: SortOption;
  setSearchSort: (sort: SortOption) => void;
};

export const useSortStore = create(
  persist<SortStore>(
    (set) => ({
      // 待看清單默認排序：按添加時間降序
      watchlistSort: 'release_date.desc',
      setWatchlistSort: (sort: SortOption) => {
        set({ watchlistSort: sort });
        // 分發自定義事件以通知其他標籤頁
        const event = new CustomEvent('watchlist-sort-changed', {
          detail: { sort },
        });
        if (typeof window !== 'undefined') {
          window.dispatchEvent(event);
        }
      },
      
      // 保留搜尋頁排序功能以向後兼容
      searchSort: 'popularity.desc',
      setSearchSort: (sort: SortOption) => {
        set({ searchSort: sort });
        // 分發自定義事件以通知其他標籤頁
        const event = new CustomEvent('search-sort-changed', {
          detail: { sort },
        });
        if (typeof window !== 'undefined') {
          window.dispatchEvent(event);
        }
      },
    }),
    {
      name: 'sort-storage',
      partialize: (state: SortStore) => ({
        watchlistSort: state.watchlistSort,
        searchSort: state.searchSort,
      }) as SortStore,
    }
  )
);
