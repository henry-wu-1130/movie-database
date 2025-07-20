import { screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, vitest } from 'vitest';
import { renderWithClient } from '@/test/utils';
import { QueryObserverSuccessResult } from '@tanstack/react-query';
import WatchlistPage from '../page';

// Mock zustand store
vi.mock('@/stores/watchlistStore', () => ({
  useWatchlistStore: () => mockData,
}));

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useParams: () => ({ lng: 'en' }),
  useSearchParams: () => ({
    get: (param: string) => (param === 'page' ? '1' : null),
  }),
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
  }),
  usePathname: () => '/en/watchlist',
}));

// Mock movie data
const mockMovieData = vitest.hoisted(() => [
  {
    id: 1,
    title: 'Watchlist Movie 1',
    poster_path: '/poster1.jpg',
    release_date: '2023-01-01',
    vote_average: 8.5,
    overview: 'Test overview 1',
  },
  {
    id: 2,
    title: 'Watchlist Movie 2',
    poster_path: '/poster2.jpg',
    release_date: '2023-02-01',
    vote_average: 7.5,
    overview: 'Test overview 2',
  },
]);

// Mock watchlist store data
const mockData = vitest.hoisted(() => ({
  movieIds: [1, 2],
  addMovie: vi.fn(),
  removeMovie: vi.fn(),
  isInWatchlist: vi.fn(),
}));

// Mock React Query's useQueries hook
vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual('@tanstack/react-query');
  return {
    ...actual,
    useQueries: () => {
      return mockMovieData.map(
        (movie) =>
          ({
            data: movie,
            isLoading: false,
            isError: false,
            error: null,
            status: 'success',
            isSuccess: true,
          } as QueryObserverSuccessResult<typeof movie, Error>)
      );
    },
  };
});

describe('WatchlistPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders watchlist title', async () => {
    renderWithClient(<WatchlistPage />);

    expect(await screen.findByText('watchlist.title')).toBeDefined();
  });

  it('renders watchlist movies', async () => {
    renderWithClient(<WatchlistPage />);

    expect(await screen.findByText('Watchlist Movie 1')).toBeDefined();
  });

  it('renders empty message when watchlist is empty', async () => {
    mockData.movieIds = [];

    renderWithClient(<WatchlistPage />);

    expect(await screen.findByText('watchlist.empty')).toBeDefined();
  });
});
