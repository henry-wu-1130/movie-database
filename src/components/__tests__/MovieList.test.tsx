import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Movie, MovieResponse } from '@/types/tmdb';
import type { UseQueryResult } from '@tanstack/react-query';
import { MovieList } from '../MovieList';

const mockMovie: Movie = {
  id: 1,
  title: 'Test Movie 1',
  poster_path: '/test1.jpg',
  backdrop_path: '/test-backdrop.jpg',
  release_date: '2023-01-01',
  overview: 'Test overview 1',
  vote_average: 8.5,
  vote_count: 100,
  popularity: 10.5,
  original_language: 'en',
  adult: false,
  video: false,
  genre_ids: [1, 2],
};

const mockMovies: MovieResponse = {
  results: [
    mockMovie,
    {
      ...mockMovie,
      id: 2,
      title: 'Test Movie 2',
    },
  ],
  page: 1,
  total_pages: 1,
  total_results: 2,
};

vi.mock('../MovieCard', () => ({
  MovieCard: ({ movie }: { movie: Movie }) => (
    <div data-testid="movie-card">{movie.title}</div>
  ),
  MovieCardSkeleton: () => <div data-testid="movie-card-skeleton" />,
}));

describe('MovieList', () => {
  it('renders loading state', () => {
    render(
      <MovieList
        query={{
          isLoading: true,
        }}
      />
    );

    expect(screen.getByRole('status')).toBeDefined();
  });

  it('renders error state', () => {
    render(
      <MovieList
        query={
          {
            data: undefined,
            error: new Error('Test error'),
            isLoading: false,
            isError: true,
            status: 'error',
            fetchStatus: 'idle',
          } as Partial<UseQueryResult<MovieResponse, Error>>
        }
      />
    );

    expect(screen.getByText(/error/i)).toBeDefined();
  });

  it('renders movies list', () => {
    render(
      <MovieList
        query={
          {
            data: mockMovies,
            error: null,
            isLoading: false,
            isError: false,
            status: 'success',
            fetchStatus: 'idle',
          } as Partial<UseQueryResult<MovieResponse, Error>>
        }
      />
    );

    expect(screen.getByText('Test Movie 1')).toBeDefined();
    expect(screen.getByText('Test Movie 2')).toBeDefined();
    expect(screen.getAllByTestId('movie-card').length).toBe(2);
  });

  it('renders empty state when no results', () => {
    const emptyMovies: MovieResponse = {
      ...mockMovies,
      results: [],
    };

    render(
      <MovieList
        query={
          {
            data: emptyMovies,
            error: null,
            isLoading: false,
            isError: false,
            status: 'success',
            fetchStatus: 'idle',
          } as Partial<UseQueryResult<MovieResponse, Error>>
        }
      />
    );

    expect(screen.getByText(/no movies found/i)).toBeDefined();
  });
});
