'use client';

import { Movie } from '@/types/tmdb';
import { MovieCard } from './MovieCard';
import { MovieListSkeleton } from './MovieListSkeleton';

type MovieResponse = {
  results: Movie[];
  page: number;
  total_pages: number;
  total_results: number;
};

type QueryState<T> = {
  data?: T;
  error?: unknown;
  isLoading?: boolean;
  isError?: boolean;
};

type MovieListProps = {
  query: QueryState<MovieResponse>;
};

export function MovieList({ query }: MovieListProps) {
  const { data, error, isLoading } = query;

  if (isLoading) {
    return <MovieListSkeleton />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">
          {error instanceof Error ? error.message : 'Error loading movies'}
        </p>
      </div>
    );
  }

  if (!data?.results?.length) {
    return (
      <div className="flex justify-center py-4">
        <p className="text-gray-500">No movies found</p>
      </div>
    );
  }

  return (
    <div className="relative" data-testid="movie-list">
      <div className="flex overflow-x-auto pb-6 px-4 sm:px-6 lg:px-8 gap-4 snap-x snap-mandatory custom-scrollbar">
        {data?.results.map((movie) => (
          <div key={movie.id} className="flex-none snap-start">
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>
    </div>
  );
}
