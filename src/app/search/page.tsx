'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useInView } from 'react-intersection-observer';
import { useInfiniteSearchMoviesQuery } from '@/query';
import { MovieCard } from '@/components/MovieCard';
import { Movie } from '@/types/tmdb';
import _get from 'lodash/get';
import _map from 'lodash/map';
import _flatMap from 'lodash/flatMap';
import { useLanguageStore } from '@/stores/languageStore';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const { movieLanguage } = useLanguageStore();
  const { ref, inView } = useInView();

  const {
    data,
    error,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteSearchMoviesQuery(query, movieLanguage);

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <div role="status" className="flex justify-center py-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center py-8">
        <p className="text-red-500">Error loading search results</p>
      </div>
    );
  }

  if (!_get(data, 'pages[0].results.length')) {
    return (
      <div className="flex flex-col items-center py-8 space-y-4">
        <p className="text-gray-500">
          No results found for &quot;{query}&quot;
        </p>
        <p className="text-sm text-gray-400">
          Try searching for something else
        </p>
      </div>
    );
  }

  const movies = _flatMap(_get(data, 'pages', []), (page, pageIndex) =>
    _map(_get(page, 'results', []), (movie: Movie) => ({
      ...movie,
      key: `${pageIndex}-${movie.id}`,
    }))
  );

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Search results for &quot;{query}&quot;
      </h1>

      <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(180px,1fr))] px-4">
        {_map(movies, (movie) => (
          <MovieCard key={movie.key} movie={movie} variant="fluid" />
        ))}
      </div>

      {hasNextPage && (
        <div ref={ref} className="flex justify-center py-4">
          {isFetchingNextPage ? (
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
          ) : (
            <p className="text-sm text-gray-500">Loading more...</p>
          )}
        </div>
      )}
    </div>
  );
}
