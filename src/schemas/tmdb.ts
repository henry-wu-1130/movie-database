import { z } from 'zod';

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

export const movieResponseSchema = z.object({
  page: z.number(),
  results: z.array(movieSchema),
  total_pages: z.number(),
  total_results: z.number(),
});

export const castSchema = z.object({
  id: z.number(),
  name: z.string(),
  character: z.string(),
  profile_path: z.string().nullable(),
  order: z.number(),
});

export const crewSchema = z.object({
  id: z.number(),
  name: z.string(),
  job: z.string(),
  department: z.string(),
  profile_path: z.string().nullable(),
});

export const movieCreditsSchema = z.object({
  id: z.number(),
  cast: z.array(castSchema),
  crew: z.array(crewSchema),
});

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

export const movieVideosSchema = z.object({
  id: z.number(),
  results: z.array(movieVideoSchema),
});
export const authorDetailsSchema = z.object({
  name: z.string(),
  username: z.string(),
  avatar_path: z.string().nullable(),
  rating: z.number().nullable(),
});

export const movieReviewSchema = z.object({
  id: z.string(),
  author: z.string(),
  content: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  url: z.string(),
  author_details: authorDetailsSchema,
});

export const movieReviewsSchema = z.object({
  id: z.number(),
  page: z.number(),
  results: z.array(movieReviewSchema),
  total_pages: z.number(),
  total_results: z.number(),
});

export const collectionSchema = z
  .object({
    id: z.number(),
    name: z.string(),
    poster_path: z.string().nullable(),
    backdrop_path: z.string().nullable(),
  })
  .nullable();

export const genreSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export const productionCompanySchema = z.object({
  id: z.number(),
  logo_path: z.string().nullable(),
  name: z.string(),
  origin_country: z.string(),
});

export const productionCountrySchema = z.object({
  iso_3166_1: z.string(),
  name: z.string(),
});

export const spokenLanguageSchema = z.object({
  english_name: z.string(),
  iso_639_1: z.string(),
  name: z.string(),
});

export const movieDetailSchema = movieSchema
  .extend({
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
  })
  .omit({ genre_ids: true });

export type Movie = z.infer<typeof movieSchema>;
export type MovieResponse = z.infer<typeof movieResponseSchema>;
export type MovieDetail = z.infer<typeof movieDetailSchema>;
export type MovieCredits = z.infer<typeof movieCreditsSchema>;
export type MovieVideos = z.infer<typeof movieVideosSchema>;
export type MovieReviews = z.infer<typeof movieReviewsSchema>;
