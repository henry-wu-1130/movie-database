'use client';

import {
  useRouter,
  useSearchParams,
  usePathname,
  useParams,
} from 'next/navigation';
import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';
import { useT } from '@/app/i18n/client';
import { useSearchMoviesQuery } from '@/query';
import { useLanguageStore } from '@/stores/languageStore';

export function SearchBar() {
  const { t } = useT('search');
  const params = useParams();
  const lng = params?.lng as string;

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const defaultQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(defaultQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(defaultQuery);
  const { movieLanguage } = useLanguageStore();
  const { data } = useSearchMoviesQuery(debouncedQuery, 1, movieLanguage);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    setQuery(defaultQuery);
    setDebouncedQuery(defaultQuery);
  }, [defaultQuery]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (debouncedQuery.trim() && pathname.includes('/search')) {
      router.push(
        `/${lng}/search?q=${encodeURIComponent(debouncedQuery.trim())}`
      );
    }
  }, [debouncedQuery, router, pathname, lng]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (query.trim()) {
        router.push(`/${lng}/search?q=${encodeURIComponent(query.trim())}`);
      }
    },
    [query, router, lng]
  );

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <div className="relative flex items-center" data-testid="search-bar">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
        </span>
        <input
          type="text"
          role="searchbox"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          placeholder={t('search.placeholder')}
          className="w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
      </div>

      {showSuggestions &&
        data?.results &&
        pathname !== '/search' &&
        query.trim() && (
          <div className="absolute left-0 right-0 z-10 mt-2 overflow-hidden rounded-lg bg-white shadow-lg dark:bg-gray-800">
            <div className="max-h-96 overflow-auto">
              {data.results.slice(0, 5).map((movie) => (
                <button
                  key={movie.id}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700"
                  onClick={() => {
                    setShowSuggestions(false);
                    router.push(`/movie/${movie.id}`);
                  }}
                >
                  {movie.poster_path ? (
                    <Image
                      src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                      alt={movie.title}
                      width={32}
                      height={48}
                      className="object-cover"
                    />
                  ) : (
                    <div className="h-12 w-8 bg-gray-200 dark:bg-gray-700" />
                  )}
                  <div className="flex-1 overflow-hidden">
                    <h3 className="truncate text-sm font-medium text-gray-900 dark:text-white">
                      {movie.title}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {movie.release_date?.split('-')[0]}
                    </p>
                  </div>
                </button>
              ))}
            </div>
            {data.results.length > 5 && (
              <div className="border-t border-gray-100 p-3 text-center dark:border-gray-700">
                <button
                  onClick={() => {
                    setShowSuggestions(false);
                    router.push(
                      `/${lng}/search?q=${encodeURIComponent(query.trim())}`
                    );
                  }}
                  className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  View all {data.total_results} results
                </button>
              </div>
            )}
          </div>
        )}
    </form>
  );
}
