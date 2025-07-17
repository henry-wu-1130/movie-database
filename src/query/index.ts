import {
  MovieResponse,
  MovieDetail,
  MovieCredits,
  MovieVideos,
  MovieReviews,
} from '@/types/tmdb';
import * as tmdbApi from '@/services/tmdb';
import {
  useQuery,
  useInfiniteQuery,
  type UseQueryOptions,
  type UseInfiniteQueryOptions,
} from '@tanstack/react-query';

export type TMDBOptions = {
  language?: string;
  region?: string;
};

type MovieQueryOptions<TData> = Omit<
  UseQueryOptions<TData, Error, TData, readonly unknown[]>,
  'queryKey' | 'queryFn'
>;

const INITIAL_PAGE_PARAM = 1;

type MovieInfiniteQueryOptions = Partial<
  Omit<UseInfiniteQueryOptions<MovieResponse, Error>, 'queryKey' | 'queryFn'>
>;

// Popular Movies
export function usePopularMoviesQuery(
  page = 1,
  language: string,
  queryOptions?: MovieQueryOptions<MovieResponse>
) {
  return useQuery<MovieResponse, Error>({
    queryKey: ['tmdb', 'movies', 'popular', page, language],
    queryFn: () =>
      tmdbApi.getPopularMovies(page, language).then((res) => res.data),
    ...queryOptions,
  });
}

// Movie Details
export function useMovieDetailsQuery(
  id: number,
  language: string,
  queryOptions?: MovieQueryOptions<MovieDetail>
) {
  return useQuery<MovieDetail, Error>({
    queryKey: ['tmdb', 'movies', 'detail', id, language],
    queryFn: () =>
      tmdbApi.getMovieDetails(id, language).then((res) => res.data),
    ...queryOptions,
  });
}

// Movie Credits
export function useMovieCreditsQuery(
  id: number,
  language: string,
  queryOptions?: MovieQueryOptions<MovieCredits>
) {
  return useQuery<MovieCredits, Error>({
    queryKey: ['tmdb', 'movies', 'credits', id, language],
    queryFn: () =>
      tmdbApi.getMovieCredits(id, language).then((res) => res.data),
    ...queryOptions,
  });
}

// Movie Videos
export function useMovieVideosQuery(
  id: number,
  language: string,
  queryOptions?: MovieQueryOptions<MovieVideos>
) {
  return useQuery<MovieVideos, Error>({
    queryKey: ['tmdb', 'movies', 'videos', id, language],
    queryFn: () => tmdbApi.getMovieVideos(id, language).then((res) => res.data),
    ...queryOptions,
  });
}

// Movie Reviews
export function useMovieReviewsQuery(
  id: number,
  page: number,
  language: string,
  queryOptions?: MovieQueryOptions<MovieReviews>
) {
  return useQuery<MovieReviews, Error>({
    queryKey: ['tmdb', 'movies', 'reviews', id, page, language],
    queryFn: () =>
      tmdbApi.getMovieReviews(id, page, language).then((res) => res.data),
    ...queryOptions,
  });
}

// Search Movies
export function useSearchMoviesQuery(
  query: string,
  page = 1,
  language: string,
  queryOptions?: MovieQueryOptions<MovieResponse>
) {
  return useQuery<MovieResponse, Error>({
    queryKey: ['tmdb', 'movies', 'search', query, page, language],
    queryFn: () =>
      tmdbApi.searchMovies(query, page, language).then((res) => res.data),
    enabled: !!query,
    ...queryOptions,
  });
}

// Infinite Search Movies
export function useInfiniteSearchMoviesQuery(
  query: string,
  language: string,
  queryOptions?: MovieInfiniteQueryOptions
) {
  return useInfiniteQuery<MovieResponse, Error, MovieResponse>({
    queryKey: ['tmdb', 'movies', 'search', 'infinite', query, language],
    queryFn: async ({ pageParam }) => {
      const page =
        typeof pageParam === 'number' ? pageParam : INITIAL_PAGE_PARAM;
      const response = await tmdbApi.searchMovies(query, page, language);
      return response.data;
    },
    initialPageParam: INITIAL_PAGE_PARAM,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
    enabled: !!query,
    ...queryOptions,
  });
}

// Now Playing Movies
export function useNowPlayingMoviesQuery(
  page = 1,
  language: string,
  queryOptions?: MovieQueryOptions<MovieResponse>
) {
  return useQuery<MovieResponse, Error>({
    queryKey: ['tmdb', 'movies', 'now_playing', page, language],
    queryFn: () =>
      tmdbApi.getNowPlaying(page, language).then((res) => res.data),
    ...queryOptions,
  });
}

// Upcoming Movies
export function useUpcomingMoviesQuery(
  page = 1,
  language: string,
  queryOptions?: MovieQueryOptions<MovieResponse>
) {
  return useQuery<MovieResponse, Error>({
    queryKey: ['tmdb', 'movies', 'upcoming', page, language],
    queryFn: () => tmdbApi.getUpcoming(page, language).then((res) => res.data),
    ...queryOptions,
  });
}

// Helper function for image URLs
export const getImageUrl = tmdbApi.getImageUrl;
