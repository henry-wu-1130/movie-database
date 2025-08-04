import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type SortField =
  | 'popularity'
  | 'vote_average'
  | 'release_date'
  | 'original_title';
export type SortDirection = 'asc' | 'desc';
export type SortOption = `${SortField}.${SortDirection}`;

type SortStore = {
  watchlistSort: SortOption;
  setWatchlistSort: (sort: SortOption) => void;

  searchSort: SortOption;
  setSearchSort: (sort: SortOption) => void;
};

export const useSortStore = create(
  persist<SortStore>(
    (set) => ({
      watchlistSort: 'release_date.desc',
      setWatchlistSort: (sort: SortOption) => {
        set({ watchlistSort: sort });
      },

      searchSort: 'popularity.desc',
      setSearchSort: (sort: SortOption) => {
        set({ searchSort: sort });
      },
    }),
    {
      name: 'sort-storage',
      partialize: (state: SortStore) =>
        ({
          watchlistSort: state.watchlistSort,
          searchSort: state.searchSort,
        } as SortStore),
    }
  )
);
