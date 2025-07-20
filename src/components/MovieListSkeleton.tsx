'use client';

import { MovieCardSkeleton } from './MovieCard';

export function MovieListSkeleton() {
  return (
    <div className="relative" role="status" data-testid="movie-skeleton">
      <div className="flex overflow-x-auto pb-6 px-4 sm:px-6 lg:px-8 gap-4 snap-x snap-mandatory custom-scrollbar">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="flex-none snap-start">
            <MovieCardSkeleton />
          </div>
        ))}
      </div>
      <div className="absolute left-0 top-0 bottom-6 w-8 bg-gradient-to-r from-gray-50 dark:from-gray-900" />
      <div className="absolute right-0 top-0 bottom-6 w-8 bg-gradient-to-l from-gray-50 dark:from-gray-900" />
    </div>
  );
}
