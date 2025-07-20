import { screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Movie } from '@/types/tmdb';
import { renderWithClient } from '@/test/utils';
import i18n from 'i18next';
import { MovieCard } from '../MovieCard';

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
  genre_ids: [1, 2],
};

vi.mock('next/image', () => ({
  default: ({ src, alt }: { src: string; alt: string }) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} />;
  },
}));

vi.mock('next/navigation', () => ({
  useParams: () => ({ lng: 'en' }),
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

describe('MovieCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    i18n.changeLanguage('en');
  });

  it('renders movie information correctly', () => {
    renderWithClient(<MovieCard movie={mockMovie} />);

    expect(screen.getByText('Test Movie')).toBeDefined();

    expect(screen.getByText('2023')).toBeDefined();

    expect(screen.getByText('8.5')).toBeDefined();

    const image = screen.getByAltText('Test Movie');
    expect(image.getAttribute('src')).toBe(
      'https://image.tmdb.org/t/p/w500/test-poster.jpg'
    );

    const link = screen.getByRole('link');
    expect(link.getAttribute('href')).toBe('/en/movie/1');
  });

  it('handles missing release date', () => {
    const movieWithoutDate = {
      ...mockMovie,
      release_date: '',
    };

    renderWithClient(<MovieCard movie={movieWithoutDate} />);

    expect(screen.queryByText('2023')).toBeNull();
  });
});
