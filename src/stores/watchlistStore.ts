import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WatchlistStore {
  movieIds: number[];
  addMovie: (movieId: number) => void;
  removeMovie: (movieId: number) => void;
  isInWatchlist: (movieId: number) => boolean;
}

export const useWatchlistStore = create<WatchlistStore>()(
  persist(
    (set, get) => ({
      movieIds: [],
      addMovie: (movieId) => {
        const { movieIds } = get();
        if (!movieIds.includes(movieId)) {
          set({ movieIds: [...movieIds, movieId] });
        }
      },
      removeMovie: (movieId) => {
        const { movieIds } = get();
        set({ movieIds: movieIds.filter((id) => id !== movieId) });
      },
      isInWatchlist: (movieId) => {
        const { movieIds } = get();
        return movieIds.includes(movieId);
      },
    }),
    {
      name: 'watchlist-storage',
      version: 1,
    }
  )
);
