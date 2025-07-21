import { screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderWithClient } from '@/test/utils';
import SearchPage from '../page';
import { MovieResponse } from '@/types/tmdb';

type PartialInfiniteQueryResult = {
  data?: {
    pages: Array<MovieResponse>;
  };
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  isLoading: boolean;
  error: Error | null;
};

vi.mock('next/navigation', () => ({
  useParams: () => ({ lng: 'en' }),
  useSearchParams: () => ({
    get: (param: string) => (param === 'q' ? 'test query' : null),
  }),
}));

vi.mock('@/query', () => ({
  useInfiniteSearchMoviesQuery: () => mockData.mockSearchMovies,
}));

const mockData = vi.hoisted(() => ({
  mockSearchMovies: {
    data: {
      pages: [
        {
          results: [
            {
              id: 1,
              title: 'Search Result 1',
              poster_path: '/poster1.jpg',
              release_date: '2023-01-01',
              vote_average: 8.5,
              backdrop_path: null,
              overview: '',
              vote_count: 100,
              popularity: 10.5,
              original_language: 'en',
              adult: false,
              video: false,
              genre_ids: [1, 2],
            },
            {
              id: 2,
              title: 'Search Result 2',
              poster_path: '/poster2.jpg',
              release_date: '2023-02-01',
              vote_average: 7.5,
              backdrop_path: null,
              overview: '',
              vote_count: 80,
              popularity: 9.5,
              original_language: 'en',
              adult: false,
              video: false,
              genre_ids: [1, 3],
            },
          ],
          page: 1,
          total_pages: 2,
          total_results: 2,
        },
      ],
    },
    fetchNextPage: vi.fn(),
    hasNextPage: true,
    isFetchingNextPage: false,
    isLoading: false,
    error: null,
  } as PartialInfiniteQueryResult,
}));

const mockIntersectionObserver = vi.hoisted(() => ({
  useInView: vi.fn(() => ({
    ref: vi.fn(),
    inView: true,
  })),
}));

describe('SearchPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders search results title with query', async () => {
    renderWithClient(<SearchPage />);

    expect(await screen.findByText(/search.resultsFor/)).toBeDefined();
    expect(await screen.findByText(/test query/)).toBeDefined();
  });

  it('renders search results', async () => {
    renderWithClient(<SearchPage />);

    expect(await screen.findByText('Search Result 1')).toBeDefined();
    expect(await screen.findByText('Search Result 2')).toBeDefined();
  });

  it('renders no results message when no results found', () => {
    mockData.mockSearchMovies = {
      data: {
        pages: [
          {
            results: [],
            page: 1,
            total_pages: 0,
            total_results: 0,
          },
        ],
      },
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
      isLoading: false,
      error: null,
    } as PartialInfiniteQueryResult;

    renderWithClient(<SearchPage />);

    expect(screen.findByText('No results found for')).toBeDefined();
  });

  it('renders loading skeletons when fetching next page', () => {
    mockData.mockSearchMovies = {
      data: undefined,
      fetchNextPage: vi.fn(),
      hasNextPage: true,
      isFetchingNextPage: false,
      isLoading: true,
      error: null,
    } as PartialInfiniteQueryResult;

    vi.mock('react-intersection-observer', () => mockIntersectionObserver);

    renderWithClient(<SearchPage />);

    const skeletons = document.querySelectorAll(
      '[data-testid="loading-skeleton"]'
    );
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('calls fetchNextPage when inView is true', () => {
    vi.mock('react-intersection-observer', () => mockIntersectionObserver);

    const mockFetchNextPage = vi.fn();

    mockData.mockSearchMovies = {
      ...mockData.mockSearchMovies,
      hasNextPage: true,
      isFetchingNextPage: false,
      isLoading: false,
      error: null,
      fetchNextPage: mockFetchNextPage,
    };

    renderWithClient(<SearchPage />);

    expect(mockFetchNextPage).toHaveBeenCalled();
  });
});
