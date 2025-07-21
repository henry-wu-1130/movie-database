// TODO: 應該跟 components/ui/button 做整合
'use client';

import { useT } from '@/app/i18n/client';
import { Movie } from '@/types/tmdb';
import { useWatchlistStore } from '@/stores/watchlistStore';
import '@/styles/liquid-glass.css';

type WatchlistButtonProps = {
  movie: Movie;
  variant?: 'icon' | 'full';
  className?: string;
};

export function WatchlistButton({
  movie,
  variant = 'full',
  className = '',
}: WatchlistButtonProps) {
  const { t } = useT('watchlist');
  const { addMovie, removeMovie, isInWatchlist } = useWatchlistStore();
  const isInList = isInWatchlist(movie.id);

  const handleClick = () => {
    if (isInList) {
      removeMovie(movie.id);
    } else {
      addMovie(movie.id);
    }
  };

  if (variant === 'icon') {
    return (
      <button
        onClick={handleClick}
        className={`p-2 text-white liquid-glass focus:outline-none ${className}`}
        data-testid="watchlist-button"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill={isInList ? 'currentColor' : 'none'}
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
          />
        </svg>
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={`flex items-center gap-2 px-4 py-2 text-white liquid-glass focus:outline-none ${className}`}
      data-testid="watchlist-button"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill={isInList ? 'currentColor' : 'none'}
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
        />
      </svg>
      <span>{isInList ? t('watchlist.remove') : t('watchlist.add')}</span>
    </button>
  );
}
