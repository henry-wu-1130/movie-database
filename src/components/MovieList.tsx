'use client';

import { Movie } from '@/types/tmdb';
import { useVirtualizer } from '@tanstack/react-virtual';
import { MovieCard } from './MovieCard';
import { MovieListSkeleton } from './MovieListSkeleton';
import React from 'react';
import { useT } from '@/app/i18n/client';

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

type VirtualListProps = {
  data: MovieResponse | undefined;
  renderItem: (movie: Movie) => React.ReactNode;
};

const isTestEnvironment = process.env.NODE_ENV === 'test';
const itemWidth = 180;
const itemHeight = 320;

function VirtualList({ data, renderItem }: VirtualListProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: data?.results?.length || 0,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => itemWidth + 16, // 卡片寬度 + gap
    horizontal: true,
    overscan: 3, // 預渲染額外的項目
  });

  return (
    <div
      ref={scrollRef}
      className="overflow-x-auto pb-6 px-4 sm:px-6 lg:px-8 custom-scrollbar"
      style={{ position: 'relative' }}
    >
      <div
        style={{
          width: `${rowVirtualizer.getTotalSize()}px`,
          height: `${itemHeight}px`,
          position: 'relative',
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualItem) => {
          const movie = data!.results[virtualItem.index];
          return (
            <div
              key={movie.id}
              className="absolute top-0"
              style={{
                left: `${virtualItem.start}px`,
                width: `${virtualItem.size}px`,
                paddingRight: '16px',
                height: `${itemHeight}px`,
              }}
            >
              {renderItem(movie)}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function MovieList({ query }: MovieListProps) {
  const { data, error, isLoading } = query;
  const { t } = useT();

  if (isLoading) {
    return <MovieListSkeleton />;
  }

  if (error || !data) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-500">
          {t('common.error')}: {t('common.errorLoading')}
        </p>
      </div>
    );
  }

  if (data.results.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-500">{t('common.noResults')}</p>
      </div>
    );
  }

  if (isTestEnvironment) {
    return (
      <div className="relative" data-testid="movie-list">
        <div className="flex flex-wrap gap-4 px-4 sm:px-6 lg:px-8">
          {data.results.map((movie) => (
            <div key={movie.id} style={{ width: itemWidth }}>
              <MovieCard movie={movie} variant="fluid" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative" data-testid="movie-list">
      <VirtualList
        data={data}
        renderItem={(movie) => <MovieCard movie={movie} variant="fluid" />}
      />
    </div>
  );
}
