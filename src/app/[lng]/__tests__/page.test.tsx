import { screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderWithClient } from '@/test/utils';
import { UseQueryResult } from '@tanstack/react-query';
import { MovieResponse } from '@/types/tmdb';
import HomePage from '../page';

interface MockMovies {
  popularMovies: UseQueryResult<MovieResponse, Error>;
  nowPlayingMovies: UseQueryResult<MovieResponse, Error>;
  upcomingMovies: UseQueryResult<MovieResponse, Error>;
}

vi.mock('next/navigation', () => ({
  useParams: () => ({ lng: 'en' }),
}));

vi.mock('@/query', () => ({
  usePopularMoviesQuery: () => mockMovies.popularMovies,
  useNowPlayingMoviesQuery: () => mockMovies.nowPlayingMovies,
  useUpcomingMoviesQuery: () => mockMovies.upcomingMovies,
}));

const mockMovies = vi.hoisted(() => ({
  popularMovies: {
    data: {
      results: [
        {
          id: 1,
          title: 'Popular Movie 1',
          poster_path: '/poster1.jpg',
          release_date: '2023-01-01',
          vote_average: 8.5,
        },
        {
          id: 2,
          title: 'Popular Movie 2',
          poster_path: '/poster2.jpg',
          release_date: '2023-02-01',
          vote_average: 7.5,
        },
      ],
    },
    isLoading: false,
    error: null,
    status: 'success',
    isSuccess: true,
    isError: false,
  },
  nowPlayingMovies: {
    data: {
      results: [
        {
          id: 3,
          title: 'Now Playing Movie 1',
          poster_path: '/poster3.jpg',
          release_date: '2023-03-01',
          vote_average: 8.0,
        },
        {
          id: 4,
          title: 'Now Playing Movie 2',
          poster_path: '/poster4.jpg',
          release_date: '2023-04-01',
          vote_average: 7.0,
        },
      ],
    },
    isLoading: false,
    error: null,
    status: 'success',
    isSuccess: true,
    isError: false,
  },
  upcomingMovies: {
    data: {
      results: [
        {
          id: 5,
          title: 'Upcoming Movie 1',
          poster_path: '/poster5.jpg',
          release_date: '2023-05-01',
          vote_average: 0,
        },
        {
          id: 6,
          title: 'Upcoming Movie 2',
          poster_path: '/poster6.jpg',
          release_date: '2023-06-01',
          vote_average: 0,
        },
      ],
    },
    isLoading: false,
    error: null,
    status: 'success',
    isSuccess: true,
    isError: false,
  },
})) as MockMovies;

describe('HomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders section headings', async () => {
    renderWithClient(<HomePage />);

    expect(await screen.findByText('home.popularMovies')).toBeDefined();
    expect(await screen.findByText('home.nowPlaying')).toBeDefined();
    expect(await screen.findByText('home.upcomingMovies')).toBeDefined();
  });

  // it('renders movie lists', () => {
  //   renderWithClient(<HomePage />);

  //   expect(screen.findByText('Popular Movie 1')).toBeDefined();
  //   expect(screen.findByText('Popular Movie 2')).toBeDefined();
  //   expect(screen.findByText('Now Playing Movie 1')).toBeDefined();
  //   expect(screen.findByText('Now Playing Movie 2')).toBeDefined();
  //   expect(screen.findByText('Upcoming Movie 1')).toBeDefined();
  //   expect(screen.findByText('Upcoming Movie 2')).toBeDefined();
  // });

  // it('renders loading skeletons when data is loading', () => {
  //   mockMovies.popularMovies = {
  //     data: undefined,
  //     isLoading: true,
  //     error: null,
  //     status: 'pending',
  //     isSuccess: false,
  //     isError: false,
  //   } as UseQueryResult<MovieResponse, Error>;
  //   mockMovies.nowPlayingMovies = {
  //     data: undefined,
  //     isLoading: true,
  //     error: null,
  //     status: 'pending',
  //     isSuccess: false,
  //     isError: false,
  //   } as UseQueryResult<MovieResponse, Error>;
  //   mockMovies.upcomingMovies = {
  //     data: undefined,
  //     isLoading: true,
  //     error: null,
  //     status: 'pending',
  //     isSuccess: false,
  //     isError: false,
  //   } as UseQueryResult<MovieResponse, Error>;

  //   renderWithClient(<HomePage />);

  //   const skeletons = document.querySelectorAll(
  //     '[data-testid="movie-skeleton"]'
  //   );

  //   expect(skeletons.length).toBeGreaterThan(0);
  // });
});
