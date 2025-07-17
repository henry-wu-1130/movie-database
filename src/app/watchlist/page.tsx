'use client'

import { useTranslation } from 'react-i18next'
import { MovieCard } from '@/components/MovieCard'
import { useWatchlistStore } from '@/stores/watchlistStore'

export default function WatchlistPage() {
  const { t } = useTranslation()
  const { movies } = useWatchlistStore()

  return (
    <main className="flex-1 py-8">
      <div className="mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          {t('watchlist.title', '待看清單')}
        </h1>
        
        {movies.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              {t('watchlist.empty', '目前沒有待看的電影')}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(180px,1fr))]">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} variant="fluid" />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
