import {
  MovieDetail,
  MovieResponse,
  MovieCredits,
  MovieVideos,
  MovieReviews,
} from '@/types/tmdb';
import http from './http';
import { getUserLanguage, getUserRegion } from '@/utils/language';

const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

type TMDBOptions = {
  language?: string;
  region?: string;
};

const createQueryString = (params: Record<string, string | number>) => {
  return Object.entries(params)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&');
};

const getRequestParams = (options?: TMDBOptions) => {
  const params: Record<string, string> = {
    language: options?.language || getUserLanguage(),
    region: options?.region || getUserRegion(),
  };

  return params;
};

/**
 * Get popular movies
 */
export const getPopularMovies = (page = 1, language?: string) => {
  const params = {
    page,
    ...getRequestParams({ language }),
  };
  return http.get<MovieResponse>(`/movie/popular?${createQueryString(params)}`);
};

/**
 * Get movie details
 */
export const getMovieDetails = (movieId: number, language?: string) => {
  const params = getRequestParams({ language });
  return http.get<MovieDetail>(
    `/movie/${movieId}?append_to_response=credits,videos,reviews&${createQueryString(
      params
    )}`
  );
};

/**
 * Get movie credits (cast and crew)
 */
export const getMovieCredits = (movieId: number, language?: string) => {
  const params = getRequestParams({ language });
  return http.get<MovieCredits>(
    `/movie/${movieId}/credits?${createQueryString(params)}`
  );
};

/**
 * Get movie videos (trailers, teasers, etc.)
 */
export const getMovieVideos = (movieId: number, language?: string) => {
  const params = getRequestParams({ language });
  return http.get<MovieVideos>(
    `/movie/${movieId}/videos?${createQueryString(params)}`
  );
};

/**
 * Get movie reviews
 */
export const getMovieReviews = (
  movieId: number,
  page = 1,
  language?: string
) => {
  const params = {
    page,
    ...getRequestParams({ language }),
  };
  return http.get<MovieReviews>(
    `/movie/${movieId}/reviews?${createQueryString(params)}`
  );
};

/**
 * Search movies
 */
export const searchMovies = (query: string, page = 1, language?: string) => {
  const params = {
    query,
    page,
    ...getRequestParams({ language }),
  };
  return http.get<MovieResponse>(`/search/movie?${createQueryString(params)}`);
};

/**
 * Get now playing movies
 */
export const getNowPlaying = (page = 1, language?: string) => {
  const params = {
    page,
    ...getRequestParams({ language }),
  };
  return http.get<MovieResponse>(
    `/movie/now_playing?${createQueryString(params)}`
  );
};

/**
 * Get upcoming movies
 */
export const getUpcoming = (page = 1, language?: string) => {
  const params = {
    page,
    ...getRequestParams({ language }),
  };
  return http.get<MovieResponse>(
    `/movie/upcoming?${createQueryString(params)}`
  );
};

/**
 * Get image URL
 */
export const getImageUrl = (
  path: string | null,
  size: 'w500' | 'original' = 'w500'
) => {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
};
