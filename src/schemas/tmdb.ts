import { z } from 'zod';

// 基本電影 Schema
export const movieSchema = z.object({
  id: z.number(),
  title: z.string(),
  overview: z.string(),
  poster_path: z.string().nullable(),
  backdrop_path: z.string().nullable(),
  release_date: z.string(),
  vote_average: z.number(),
  vote_count: z.number(),
  popularity: z.number(),
  original_language: z.string(),
  genre_ids: z.array(z.number()),
  adult: z.boolean(),
  video: z.boolean(),
});

// 電影列表響應 Schema
export const movieResponseSchema = z.object({
  page: z.number(),
  results: z.array(movieSchema),
  total_pages: z.number(),
  total_results: z.number(),
});

// 演員 Schema
export const castSchema = z.object({
  id: z.number(),
  name: z.string(),
  character: z.string(),
  profile_path: z.string().nullable(),
  order: z.number(),
});

// 劇組 Schema
export const crewSchema = z.object({
  id: z.number(),
  name: z.string(),
  job: z.string(),
  department: z.string(),
  profile_path: z.string().nullable(),
});

// 電影演職員表 Schema
export const movieCreditsSchema = z.object({
  id: z.number(),
  cast: z.array(castSchema),
  crew: z.array(crewSchema),
});

// 電影視頻 Schema
export const movieVideoSchema = z.object({
  id: z.string(),
  key: z.string(),
  name: z.string(),
  site: z.string(),
  size: z.number(),
  type: z.string(),
  official: z.boolean(),
  published_at: z.string(),
});

// 電影視頻列表 Schema
export const movieVideosSchema = z.object({
  id: z.number(),
  results: z.array(movieVideoSchema),
});

// 電影評論作者詳情 Schema
export const authorDetailsSchema = z.object({
  name: z.string(),
  username: z.string(),
  avatar_path: z.string().nullable(),
  rating: z.number().nullable(),
});

// 電影評論 Schema
export const movieReviewSchema = z.object({
  id: z.string(),
  author: z.string(),
  content: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  url: z.string(),
  author_details: authorDetailsSchema,
});

// 電影評論列表 Schema
export const movieReviewsSchema = z.object({
  id: z.number(),
  page: z.number(),
  results: z.array(movieReviewSchema),
  total_pages: z.number(),
  total_results: z.number(),
});

// 電影詳情中的集合 Schema
export const collectionSchema = z.object({
  id: z.number(),
  name: z.string(),
  poster_path: z.string().nullable(),
  backdrop_path: z.string().nullable(),
}).nullable();

// 電影類型 Schema
export const genreSchema = z.object({
  id: z.number(),
  name: z.string(),
});

// 製作公司 Schema
export const productionCompanySchema = z.object({
  id: z.number(),
  logo_path: z.string().nullable(),
  name: z.string(),
  origin_country: z.string(),
});

// 製作國家 Schema
export const productionCountrySchema = z.object({
  iso_3166_1: z.string(),
  name: z.string(),
});

// 語言 Schema
export const spokenLanguageSchema = z.object({
  english_name: z.string(),
  iso_639_1: z.string(),
  name: z.string(),
});

// 電影詳情 Schema
export const movieDetailSchema = movieSchema.extend({
  belongs_to_collection: collectionSchema,
  budget: z.number(),
  genres: z.array(genreSchema),
  homepage: z.string().nullable(),
  imdb_id: z.string().nullable(),
  production_companies: z.array(productionCompanySchema),
  production_countries: z.array(productionCountrySchema),
  revenue: z.number(),
  runtime: z.number().nullable(),
  spoken_languages: z.array(spokenLanguageSchema),
  status: z.string(),
  tagline: z.string().nullable(),
}).omit({ genre_ids: true });  // 在電影詳情中不要求 genre_ids 字段

// 導出類型
export type Movie = z.infer<typeof movieSchema>;
export type MovieResponse = z.infer<typeof movieResponseSchema>;
export type MovieDetail = z.infer<typeof movieDetailSchema>;
export type MovieCredits = z.infer<typeof movieCreditsSchema>;
export type MovieVideos = z.infer<typeof movieVideosSchema>;
export type MovieReviews = z.infer<typeof movieReviewsSchema>;
