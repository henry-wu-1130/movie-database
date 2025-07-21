'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useInView } from 'react-intersection-observer';
import { useInfiniteSearchMoviesQuery } from '@/query';
import { MovieCard } from '@/components/MovieCard';
import { MovieCardSkeleton } from '@/components/MovieCardSkeleton';
import { Movie, MovieResponse } from '@/types/tmdb';
import _map from 'lodash/map';
import _flatMap from 'lodash/flatMap';
import { useLanguageStore } from '@/stores/languageStore';
import { InfiniteData } from '@tanstack/react-query';
import { useT } from '@/app/i18n/client';

function SearchPageComponent() {
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0.5,
    triggerOnce: false,
  });
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const { movieLanguage } = useLanguageStore();
  const { t } = useT('search');

  const {
    data,
    error,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteSearchMoviesQuery(query, movieLanguage);

  const infiniteData = data as InfiniteData<MovieResponse> | undefined;
  const movies = infiniteData
    ? _flatMap(infiniteData.pages, (page: MovieResponse, pageIndex: number) =>
        _map(page.results || [], (movie: Movie) => ({
          ...movie,
          key: `${pageIndex}-${movie.id}`,
        }))
      )
    : [];

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage, isFetchingNextPage]);

  if (isLoading) {
    return (
      <div className="space-y-8 p-6" data-testid="loading-skeleton">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 animate-pulse"></div>
          <div className="w-full md:w-[200px] h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>

        <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(180px,1fr))]">
          {Array(12)
            .fill(0)
            .map((_, index) => (
              <MovieCardSkeleton key={index} variant="fluid" />
            ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center py-8">
        <p className="text-red-500">{t('error')}</p>
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="flex flex-col items-center py-8 space-y-4">
        <p className="text-gray-500">
          {t('search.noResults')} &quot;{query}&quot;
        </p>
        <p className="text-sm text-gray-400">{t('search.tryAgain')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t('search.resultsFor')} &quot;{query}&quot;
        </h1>
      </div>

      <div
        className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(180px,1fr))]"
        data-testid="movie-list"
      >
        {_map(movies, (movie: Movie & { key?: string }) => (
          <MovieCard
            key={movie.key || movie.id}
            movie={movie}
            variant="fluid"
          />
        ))}
      </div>

      <div ref={loadMoreRef} className="py-4">
        {isFetchingNextPage ? (
          <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(180px,1fr))]">
            {Array(4)
              .fill(0)
              .map((_, index) => (
                <MovieCardSkeleton key={`loading-${index}`} variant="fluid" />
              ))}
          </div>
        ) : hasNextPage ? (
          <div className="flex justify-center">
            <p className="text-sm text-gray-500">{t('search.loadingMore')}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={'...'}>
      <SearchPageComponent />
    </Suspense>
  );
}
