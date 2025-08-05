import {
  useQuery,
  useInfiniteQuery,
  type UseQueryOptions,
  type UseInfiniteQueryOptions,
} from '@tanstack/react-query';
import * as API from '@/services/validatedApi';
import { z } from 'zod';
import {
  movieResponseSchema,
  movieDetailSchema,
  movieCreditsSchema,
  movieVideosSchema,
  movieReviewsSchema,
} from '@/schemas/tmdb';

export type TMDBOptions = {
  language?: string;
  region?: string;
};

type MovieQueryOptions<TData> = Omit<
  UseQueryOptions<TData, Error, TData, readonly unknown[]>,
  'queryKey' | 'queryFn'
>;

const INITIAL_PAGE_PARAM = 1;

// 使用 Zod 類型推斷獲取類型
type MovieResponse = z.infer<typeof movieResponseSchema>;
type MovieDetail = z.infer<typeof movieDetailSchema>;
type MovieCredits = z.infer<typeof movieCreditsSchema>;
type MovieVideos = z.infer<typeof movieVideosSchema>;
type MovieReviews = z.infer<typeof movieReviewsSchema>;

// 熱門電影查詢
export function usePopularMoviesQuery(
  page = 1,
  language: string,
  queryOptions?: MovieQueryOptions<MovieResponse>
) {
  return useQuery<MovieResponse, Error>({
    queryKey: ['tmdb', 'movies', 'popular', page, language],
    queryFn: () => API.getPopularMovies(page, language),
    ...queryOptions,
  });
}

// 電影詳情查詢
export function useMovieDetailsQuery(
  id: number,
  language: string,
  queryOptions?: MovieQueryOptions<MovieDetail>
) {
  return useQuery<MovieDetail, Error>({
    queryKey: ['tmdb', 'movies', 'detail', id, language],
    queryFn: () => API.getMovieDetails(id, language),
    ...queryOptions,
  });
}

// 電影演職員表查詢
export function useMovieCreditsQuery(
  id: number,
  language: string,
  queryOptions?: MovieQueryOptions<MovieCredits>
) {
  return useQuery<MovieCredits, Error>({
    queryKey: ['tmdb', 'movies', 'credits', id, language],
    queryFn: () => API.getMovieCredits(id, language),
    ...queryOptions,
  });
}

// 電影視頻查詢
export function useMovieVideosQuery(
  id: number,
  language: string,
  queryOptions?: MovieQueryOptions<MovieVideos>
) {
  return useQuery<MovieVideos, Error>({
    queryKey: ['tmdb', 'movies', 'videos', id, language],
    queryFn: () => API.getMovieVideos(id, language),
    ...queryOptions,
  });
}

// 電影評論查詢
export function useMovieReviewsQuery(
  id: number,
  page: number,
  language: string,
  queryOptions?: MovieQueryOptions<MovieReviews>
) {
  return useQuery<MovieReviews, Error>({
    queryKey: ['tmdb', 'movies', 'reviews', id, page, language],
    queryFn: () => API.getMovieReviews(id, page, language),
    ...queryOptions,
  });
}

// 電影搜索查詢
export function useSearchMoviesQuery(
  query: string,
  page = 1,
  language: string,
  queryOptions?: MovieQueryOptions<MovieResponse>
) {
  return useQuery<MovieResponse, Error>({
    queryKey: ['tmdb', 'search', 'movie', query, page, language],
    queryFn: () => API.searchMovies(query, page, language),
    ...queryOptions,
    enabled: !!query && query.length > 0,
  });
}

// 無限滾動電影搜索查詢
export function useInfiniteSearchMoviesQuery(
  query: string,
  language: string,
  queryOptions?: Omit<
    UseInfiniteQueryOptions<MovieResponse, Error, number>,
    'queryKey' | 'queryFn'
  >
) {
  return useInfiniteQuery<MovieResponse, Error, number>({
    queryKey: ['tmdb', 'search', 'movie', 'infinite', query, language],
    queryFn: ({ pageParam = INITIAL_PAGE_PARAM }) =>
      API.searchMovies(query, pageParam as number, language),
    initialPageParam: INITIAL_PAGE_PARAM,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
    ...queryOptions,
    enabled: !!query && query.length > 0,
  });
}

// 正在上映電影查詢
export function useNowPlayingMoviesQuery(
  page = 1,
  language: string,
  queryOptions?: MovieQueryOptions<MovieResponse>
) {
  return useQuery<MovieResponse, Error>({
    queryKey: ['tmdb', 'movies', 'now_playing', page, language],
    queryFn: () => API.getNowPlaying(page, language),
    ...queryOptions,
  });
}

// 即將上映電影查詢
export function useUpcomingMoviesQuery(
  page = 1,
  language: string,
  queryOptions?: MovieQueryOptions<MovieResponse>
) {
  return useQuery<MovieResponse, Error>({
    queryKey: ['tmdb', 'movies', 'upcoming', page, language],
    queryFn: () => API.getUpcoming(page, language),
    ...queryOptions,
  });
}

// 圖片 URL 輔助函數
export const getImageUrl = API.getImageUrl;
