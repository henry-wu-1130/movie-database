// TODO: 應該跟 components/ui/button 做整合
'use client';

import { useT } from '@/app/i18n/client';
import { Movie } from '@/types/tmdb';
import { useWatchlistStore } from '@/stores/watchlistStore';
import { cn } from '@/lib/utils';

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
  const { t, ready } = useT('watchlist');
  const { addMovie, removeMovie, isInWatchlist } = useWatchlistStore();
  const isInList = isInWatchlist(movie.id);

  const handleClick = () => {
    if (isInList) {
      removeMovie(movie.id);
    } else {
      addMovie(movie.id);
    }
  };

  const baseButton =
    'flex items-center gap-2 px-4 py-2 text-white liquid-glass focus:outline-none';

  const liquidGlass = cn(
    'relative',
    'bg-black/40',
    'rounded-[10px]',
    'backdrop-blur-[20px]',
    'border',
    'border-white/10',
    'overflow-hidden',
    'shadow-[0_25px_25px_rgba(0,0,0,0.1)]',

    // before 偽元素
    'before:absolute',
    'before:top-0',
    'before:left-[-100%]',
    'before:w-full',
    'before:h-full',
    'before:bg-gradient-to-r',
    'before:from-transparent',
    'before:via-white/20',
    'before:transition-left',
    'before:duration-500',
    'hover:before:left-full',

    // after 偽元素
    'after:absolute',
    'after:inset-1',
    'after:bg-gradient-to-br',
    'after:from-white/10',
    'after:to-white/5',
    'after:rounded-[8px]',

    // 避免偽元素攔截滑鼠事件
    'before:pointer-events-none',
    'after:pointer-events-none',

    baseButton,
    className
  );

  if (variant === 'icon') {
    return (
      <button
        onClick={handleClick}
        className={liquidGlass}
        data-testid="watchlist-button"
        aria-label={ready ? (isInList ? t('watchlist.remove') : t('watchlist.add')) : 'Toggle watchlist'}
        title={ready ? (isInList ? t('watchlist.remove') : t('watchlist.add')) : 'Toggle watchlist'}
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
      className={liquidGlass}
      data-testid="watchlist-button"
      aria-label={ready ? (isInList ? t('watchlist.remove') : t('watchlist.add')) : 'Toggle watchlist'}
      title={ready ? (isInList ? t('watchlist.remove') : t('watchlist.add')) : 'Toggle watchlist'}
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
      <span>
        {ready ? (isInList ? t('watchlist.remove') : t('watchlist.add')) : ''}
      </span>
    </button>
  );
}
