'use client';

import { MovieList } from '@/components/MovieList';
import { useT } from '@/app/i18n/client';
import {
  usePopularMoviesQuery,
  useNowPlayingMoviesQuery,
  useUpcomingMoviesQuery,
} from '@/query';
import { useLanguageStore } from '@/stores/languageStore';

export default function Home() {
  const { t } = useT('home');

  const { movieLanguage } = useLanguageStore();

  const popularMoviesQuery = usePopularMoviesQuery(1, movieLanguage);
  const nowPlayingMoviesQuery = useNowPlayingMoviesQuery(1, movieLanguage);
  const upcomingMoviesQuery = useUpcomingMoviesQuery(1, movieLanguage);

  return (
    <div className="py-0">
      <section id="popular" className="bg-primary-600 py-10">
        <h2 className="mb-8 px-8 text-2xl font-bold text-accent-50">
          {t('home.popularMovies')}
        </h2>
        <MovieList query={popularMoviesQuery} />
      </section>
      <section id="now-playing" className="bg-secondary-800 py-10">
        <h2 className="mb-8 px-8 text-2xl font-bold text-primary-500">
          {t('home.nowPlaying')}
        </h2>
        <MovieList query={nowPlayingMoviesQuery} />
      </section>
      <section id="upcoming" className="bg-secondary-700 py-10">
        <h2 className="mb-8 px-8 text-2xl font-bold text-accent-100">
          {t('home.upcomingMovies')}
        </h2>
        <MovieList query={upcomingMoviesQuery} />
      </section>
    </div>
  );
}
