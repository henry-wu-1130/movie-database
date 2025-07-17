import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Movie } from '@/types/tmdb'

interface WatchlistStore {
  movies: Movie[]
  addMovie: (movie: Movie) => void
  removeMovie: (movieId: number) => void
  isInWatchlist: (movieId: number) => boolean
}

export const useWatchlistStore = create<WatchlistStore>()(
  persist(
    (set, get) => ({
      movies: [],
      addMovie: (movie) => {
        const { movies } = get()
        if (!movies.some((m) => m.id === movie.id)) {
          set({ movies: [...movies, movie] })
        }
      },
      removeMovie: (movieId) => {
        const { movies } = get()
        set({ movies: movies.filter((m) => m.id !== movieId) })
      },
      isInWatchlist: (movieId) => {
        const { movies } = get()
        return movies.some((m) => m.id === movieId)
      },
    }),
    {
      name: 'watchlist-storage'
    }
  )
)
