import {
  movieResponseSchema,
  movieDetailSchema,
  movieCreditsSchema,
  movieVideosSchema,
  movieReviewsSchema,
} from '@/schemas/tmdb';
import validatedHttp from './validatedHttp';
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
 * 獲取熱門電影
 */
export const getPopularMovies = async (page = 1, language?: string) => {
  const params = {
    page,
    ...getRequestParams({ language }),
  };
  return validatedHttp.get(
    `/movie/popular?${createQueryString(params)}`,
    movieResponseSchema
  );
};

/**
 * 獲取電影詳情
 */
export const getMovieDetails = async (movieId: number, language?: string) => {
  const params = getRequestParams({ language });
  return validatedHttp.get(
    `/movie/${movieId}?${createQueryString(params)}`,
    movieDetailSchema
  );
};

/**
 * 獲取電影演職員表
 */
export const getMovieCredits = async (movieId: number, language?: string) => {
  const params = getRequestParams({ language });
  return validatedHttp.get(
    `/movie/${movieId}/credits?${createQueryString(params)}`,
    movieCreditsSchema
  );
};

/**
 * 獲取電影影片
 */
export const getMovieVideos = async (movieId: number, language?: string) => {
  const params = getRequestParams({ language });
  return validatedHttp.get(
    `/movie/${movieId}/videos?${createQueryString(params)}`,
    movieVideosSchema
  );
};

/**
 * 獲取電影評論
 */
export const getMovieReviews = async (
  movieId: number,
  page = 1,
  language?: string
) => {
  const params = {
    page,
    ...getRequestParams({ language }),
  };
  return validatedHttp.get(
    `/movie/${movieId}/reviews?${createQueryString(params)}`,
    movieReviewsSchema
  );
};

/**
 * 搜索電影
 */
export const searchMovies = async (
  query: string,
  page = 1,
  language?: string
) => {
  const params = {
    query,
    page,
    ...getRequestParams({ language }),
  };
  return validatedHttp.get(
    `/search/movie?${createQueryString(params)}`,
    movieResponseSchema
  );
};

/**
 * 獲取正在上映的電影
 */
export const getNowPlaying = async (page = 1, language?: string) => {
  const params = {
    page,
    ...getRequestParams({ language }),
  };
  return validatedHttp.get(
    `/movie/now_playing?${createQueryString(params)}`,
    movieResponseSchema
  );
};

/**
 * 獲取即將上映的電影
 */
export const getUpcoming = async (page = 1, language?: string) => {
  const params = {
    page,
    ...getRequestParams({ language }),
  };
  return validatedHttp.get(
    `/movie/upcoming?${createQueryString(params)}`,
    movieResponseSchema
  );
};

/**
 * 獲取圖片 URL
 * @deprecated
 */
export const getImageUrl = (
  path: string | null,
  size: 'w500' | 'original' = 'w500'
) => {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
};
