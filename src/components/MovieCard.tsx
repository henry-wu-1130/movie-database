'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Fragment } from 'react';
import { Popover, Transition } from '@headlessui/react';
import { useParams } from 'next/navigation';
import { useT } from '@/app/i18n/client';
import { Movie } from '@/types/tmdb';
import _get from 'lodash/get';
import { WatchlistButton } from './WatchlistButton';

type MovieCardProps = {
  movie: Movie;
  variant?: 'fixed' | 'fluid';
};

const CARD_STYLES = {
  wrapper: {
    base: 'relative flex flex-col rounded-lg bg-white shadow-md dark:bg-gray-800',
    fixed: 'w-[180px]',
    fluid: 'w-full',
  },
  poster:
    'relative w-full overflow-hidden bg-gray-200 dark:bg-gray-700 aspect-[2/3] rounded-t-lg',
  content: 'flex flex-1 flex-col p-3 bg-white dark:bg-gray-800 rounded-b-lg',
};

export function MovieCardSkeleton({
  variant = 'fixed',
}: {
  variant?: 'fixed' | 'fluid';
}) {
  return (
    <div
      className={`${CARD_STYLES.wrapper.base} ${CARD_STYLES.wrapper[variant]}`}
    >
      <div className={`${CARD_STYLES.poster} animate-pulse`} />
      <div className={CARD_STYLES.content}>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="h-4 mt-1 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse" />
        <div className="mt-auto pt-2 flex items-center justify-between">
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-10 animate-pulse" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-8 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export function MovieCard({ movie, variant = 'fixed' }: MovieCardProps) {
  const { t } = useT('movie');
  const params = useParams();
  const lng = params?.lng as string;
  const releaseDate = _get(movie, 'release_date');
  const year = releaseDate ? new Date(releaseDate).getFullYear() : null;

  return (
    <div
      className={`${CARD_STYLES.wrapper.base} ${CARD_STYLES.wrapper[variant]} group`}
      data-testid="movie-card"
    >
      <div className="relative w-full h-full">
        <Link href={`/${lng}/movie/${movie.id}`}>
          <div className={CARD_STYLES.poster}>
            <Image
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              fill
              className="object-center object-cover"
              sizes={
                variant === 'fixed' ? '180px' : '(max-width: 768px) 50vw, 33vw'
              }
              priority
              quality={90}
            />
          </div>
          <div className={CARD_STYLES.content}>
            <h3
              className="text-sm font-medium line-clamp-2 text-gray-900 dark:text-white min-h-[2.5rem]"
              data-testid="movie-title"
            >
              {movie.title}
            </h3>
            <div className="mt-2 flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
              {year && <span>{year}</span>}
              <div className="flex items-center gap-1">
                <span className="text-yellow-500">★</span>
                <span title={t('movie.rating')}>
                  {movie.vote_average.toFixed(1)}
                </span>
              </div>
            </div>
          </div>
        </Link>

        <Popover className="absolute top-2 right-2 z-10">
          <Popover.Button
            className="p-1 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-white/20"
            data-testid="movie-menu-button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
              />
            </svg>
          </Popover.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel className="absolute right-0 z-50 mt-2 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800 dark:ring-gray-700">
              <div className="py-1">
                <WatchlistButton
                  movie={movie}
                  variant="full"
                  className="w-full !bg-transparent !p-0 !text-gray-700 hover:!bg-gray-100 dark:!text-gray-200 dark:hover:!bg-gray-700/50"
                />
              </div>
            </Popover.Panel>
          </Transition>
        </Popover>
      </div>
    </div>
  );
}
