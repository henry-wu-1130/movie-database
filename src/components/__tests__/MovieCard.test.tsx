import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MovieCard } from '../MovieCard';
import { Movie } from '@/types/tmdb';

// Mock next/image
vi.mock('next/image', () => ({
  default: ({ src, alt }: { src: string; alt: string }) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} />;
  },
}));

describe('MovieCard', () => {
  const mockMovie: Movie = {
    id: 1,
    title: 'Test Movie',
    poster_path: '/test-poster.jpg',
    release_date: '2023-01-01',
    overview: 'Test overview',
    vote_average: 8.5,
    backdrop_path: '/test-backdrop.jpg',
    vote_count: 100,
    popularity: 10.5,
    original_language: 'en',
    adult: false,
    video: false,
    genre_ids: [1, 2]
  };

  it('renders movie information correctly', () => {
    render(<MovieCard movie={mockMovie} />);

    // Check if the movie title is displayed
    expect(screen.getByText('Test Movie')).toBeDefined();

    // Check if the year is displayed
    expect(screen.getByText('2023')).toBeDefined();

    // Check if the rating is displayed
    expect(screen.getByText('8.5')).toBeDefined();

    // Check if the movie poster is present with correct src
    const image = screen.getByAltText('Test Movie');
    expect(image.getAttribute('src')).toBe('https://image.tmdb.org/t/p/w500/test-poster.jpg');

    // Check if the link has the correct href
    const link = screen.getByRole('link');
    expect(link.getAttribute('href')).toBe('/movie/1');
  });

  it('handles missing release date', () => {
    const movieWithoutDate = {
      ...mockMovie,
      release_date: '',
    };

    render(<MovieCard movie={movieWithoutDate} />);
    
    // Check if the movie renders without the year
    expect(screen.queryByText('2023')).toBeNull();
  });
});
