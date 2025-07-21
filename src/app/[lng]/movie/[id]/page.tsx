'use client';

import { useParams } from 'next/navigation';
import {
  useMovieDetailsQuery,
  useMovieCreditsQuery,
  useMovieVideosQuery,
  useMovieReviewsQuery,
} from '@/query';
import Image from 'next/image';
import { useLanguageStore } from '@/stores/languageStore';
import { VideoPlayer } from '@/components/VideoPlayer';
import { WatchlistButton } from '@/components/WatchlistButton';
import { useT } from '@/app/i18n/client';

export default function MoviePage() {
  const { t } = useT('movie', {});
  const params = useParams();
  const { movieLanguage } = useLanguageStore();
  const movieId = Number(params.id);
  const {
    data: movie,
    isLoading: isLoadingMovie,
    error: movieError,
  } = useMovieDetailsQuery(movieId, movieLanguage);

  const { data: credits, isLoading: isLoadingCredits } = useMovieCreditsQuery(
    movieId,
    movieLanguage
  );

  const { data: videos, isLoading: isLoadingVideos } = useMovieVideosQuery(
    movieId,
    movieLanguage
  );

  const { data: reviews, isLoading: isLoadingReviews } = useMovieReviewsQuery(
    movieId,
    1,
    movieLanguage
  );

  if (
    isLoadingMovie ||
    isLoadingCredits ||
    isLoadingVideos ||
    isLoadingReviews
  ) {
    return (
      <div className="container mx-auto px-4 py-8" data-testid="movie-skeleton">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster Skeleton */}
          <div className="w-full md:w-1/3">
            <div className="aspect-[2/3] w-full bg-gray-200 animate-pulse rounded-lg" />
          </div>

          {/* Details Skeleton */}
          <div className="flex-1">
            <div className="h-10 bg-gray-200 animate-pulse rounded-lg mb-4 w-3/4" />
            <div className="h-6 bg-gray-200 animate-pulse rounded-lg mb-4 w-1/3" />
            <div className="flex items-center gap-4 mb-4">
              <div className="h-8 bg-gray-200 animate-pulse rounded-lg w-32" />
              <div className="h-8 bg-gray-200 animate-pulse rounded-lg w-32" />
            </div>

            {/* Overview Skeleton */}
            <div className="mb-6">
              <div className="h-8 bg-gray-200 animate-pulse rounded-lg mb-2 w-1/4" />
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 animate-pulse rounded-lg w-full" />
                <div className="h-4 bg-gray-200 animate-pulse rounded-lg w-full" />
                <div className="h-4 bg-gray-200 animate-pulse rounded-lg w-3/4" />
              </div>
            </div>

            {/* Cast Skeleton */}
            <div className="mb-6">
              <div className="h-8 bg-gray-200 animate-pulse rounded-lg mb-4 w-1/4" />
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {[...Array(10)].map((_, index) => (
                  <div key={index} className="text-center">
                    <div className="aspect-[2/3] w-full mb-2 bg-gray-200 animate-pulse rounded-lg" />
                    <div className="h-4 bg-gray-200 animate-pulse rounded-lg w-3/4 mx-auto" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (movieError || !movie) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="flex justify-center py-8">
          <p className="text-red-500">{t('movie.error')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {movie.backdrop_path && (
        <div className="fixed inset-0">
          <Image
            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            alt=""
            fill
            className="object-cover opacity-30"
            priority
          />
        </div>
      )}
      <div className="container mx-auto px-4 py-8 relative">
        <div className="flex flex-col md:flex-row gap-8 text-white">
          {/* Poster */}
          <div className="w-full md:w-1/3">
            {movie.poster_path ? (
              <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg">
                <Image
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  priority
                />
              </div>
            ) : (
              <div className="aspect-[2/3] w-full bg-gray-200 rounded-lg" />
            )}
          </div>

          {/* Details */}
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-4" data-testid="movie-title">
              {movie.title}
            </h1>

            {movie.release_date && (
              <p className="text-gray-300 mb-4">
                {t('movie.releaseDate')}:{' '}
                {new Date(movie.release_date).toLocaleDateString()}
              </p>
            )}

            <div className="flex items-center gap-4 mb-4">
              {movie.vote_average > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-yellow-500">★</span>
                  <span>{movie.vote_average.toFixed(1)} / 10</span>
                  <span className="text-gray-400">
                    ({movie.vote_count} {t('movie.votes')})
                  </span>
                </div>
              )}
              <WatchlistButton movie={movie} variant="full" />
            </div>

            {movie.overview && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">
                  {t('movie.overview')}
                </h2>
                <p
                  className="text-gray-300 leading-relaxed"
                  data-testid="movie-overview"
                >
                  {movie.overview}
                </p>
              </div>
            )}

            {/* Director */}
            {credits?.crew &&
              credits.crew.length > 0 &&
              (() => {
                const directors = credits.crew.filter(
                  (member) => member.job === 'Director'
                );
                if (directors.length === 0) return null;
                return (
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">
                      {t('movie.director', 'Director')}
                    </h2>
                    <div className="flex flex-wrap gap-4 items-center">
                      {directors.map((director) => (
                        <div
                          key={director.id}
                          className="flex items-center gap-2"
                        >
                          {director.profile_path ? (
                            <div className="w-12 h-12 rounded-full overflow-hidden">
                              <Image
                                src={`https://image.tmdb.org/t/p/w92${director.profile_path}`}
                                alt={director.name}
                                width={48}
                                height={48}
                                className="rounded-full object-cover bg-gray-200"
                              />
                            </div>
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-gray-500 flex items-center justify-center text-xs text-white">
                              {t('common.noImage', '—')}
                            </div>
                          )}
                          <span className="font-medium text-gray-100">
                            {director.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

            {/* Cast */}
            {credits?.cast && credits.cast.length > 0 && (
              <div className="mb-6" data-testid="cast-section">
                <h2 className="text-xl font-semibold mb-4">
                  {t('movie.cast')}
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {credits.cast.slice(0, 10).map((actor) => (
                    <div key={actor.id} className="text-center">
                      <div className="relative aspect-[2/3] w-full mb-2 overflow-hidden rounded-lg bg-gray-200">
                        {actor.profile_path ? (
                          <Image
                            src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                            alt={actor.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 50vw, 20vw"
                          />
                        ) : (
                          <div className="h-full flex items-center justify-center text-gray-400">
                            {t('common.noImage')}
                          </div>
                        )}
                      </div>
                      <p
                        className="font-medium truncate"
                        data-testid="cast-member"
                      >
                        {actor.name}
                      </p>
                      <p className="text-sm text-gray-400 truncate">
                        {actor.character}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Videos */}
            {videos?.results && videos.results.length > 0 && (
              <div className="mb-6" data-testid="videos-section">
                <h2 className="text-xl font-semibold mb-4">
                  {t('movie.videos')}
                </h2>
                <div className="space-y-8 max-w-[1440px] mx-auto">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {videos.results
                      .filter((video) => video.site === 'YouTube')
                      .slice(0, 4)
                      .map((video, index) => (
                        <div
                          key={video.id}
                          className={`w-full ${
                            index === 0 && videos.results.length === 1
                              ? 'lg:col-span-2'
                              : ''
                          }`}
                        >
                          <div className="relative">
                            <VideoPlayer
                              videoId={video.key}
                              title={video.name}
                            />
                            <div className="mt-3 flex items-center justify-between">
                              <p className="text-base font-medium text-gray-100 line-clamp-1">
                                {video.name}
                              </p>
                              <span className="px-3 py-1 text-sm rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 whitespace-nowrap ml-2">
                                {video.type}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>

                  {videos.results.length > 4 && (
                    <div className="mt-8">
                      <h3 className="text-lg font-medium mb-4">
                        {t('movie.moreVideos')}
                      </h3>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {videos.results
                          .filter((video) => video.site === 'YouTube')
                          .slice(4, 6)
                          .map((video) => (
                            <div key={video.id} className="w-full">
                              <div className="relative">
                                <VideoPlayer
                                  videoId={video.key}
                                  title={video.name}
                                />
                                <div className="mt-3 flex items-center justify-between">
                                  <p className="text-base text-gray-900 dark:text-gray-100 line-clamp-1">
                                    {video.name}
                                  </p>
                                  <span className="px-3 py-1 text-sm rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 whitespace-nowrap ml-2">
                                    {video.type}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Reviews */}
            {reviews?.results && reviews.results.length > 0 && (
              <div className="mb-6" data-testid="reviews-section">
                <h2 className="text-xl font-semibold mb-4">
                  {t('movie.reviews')}
                </h2>
                <div className="space-y-6">
                  {reviews.results.slice(0, 3).map((review) => (
                    <div
                      key={review.id}
                      className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-lg border border-gray-700"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className="font-medium">{review.author}</div>
                        {review.author_details.rating && (
                          <div className="text-yellow-500">
                            ★ {review.author_details.rating.toFixed(1)}
                          </div>
                        )}
                      </div>
                      <p className="text-gray-300 line-clamp-3">
                        {review.content}
                      </p>
                      <a
                        href={review.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 text-sm mt-2 inline-block hover:underline"
                      >
                        {t('movie.readFullReview')}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
