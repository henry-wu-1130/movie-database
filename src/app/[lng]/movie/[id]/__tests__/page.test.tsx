import { screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderWithClient } from '@/test/utils';
import {
  MovieDetail,
  MovieCredits,
  MovieVideos,
  MovieReviews,
} from '@/schemas/tmdb';
import MovieDetailPage from '../page';

// 定義部分 React Query 結果類型，只包含我們在測試中使用的屬性
type PartialQueryResult<TData> = {
  data: TData | undefined;
  isLoading: boolean;
  error: Error | null;
  status: 'idle' | 'loading' | 'error' | 'success' | 'pending';
  isSuccess: boolean;
  isError: boolean;
};

interface MockData {
  mockMovieDetail: PartialQueryResult<MovieDetail>;
  mockMovieCredits: PartialQueryResult<MovieCredits>;
  mockMovieVideos: PartialQueryResult<MovieVideos>;
  mockMovieReviews: PartialQueryResult<MovieReviews>;
}
const mockData = vi.hoisted<MockData>(() => ({
  mockMovieDetail: {
    data: {
      id: 123,
      title: 'Test Movie',
      overview: 'This is a test movie description',
      poster_path: '/poster.jpg',
      backdrop_path: '/backdrop.jpg',
      release_date: '2023-01-01',
      vote_average: 8.5,
      vote_count: 1000,
      popularity: 10.5,
      original_language: 'en',
      adult: false,
      video: false,
      belongs_to_collection: null,
      budget: 1000000,
      genres: [
        { id: 1, name: 'Action' },
        { id: 2, name: 'Drama' },
      ],
      homepage: null,
      imdb_id: null,
      production_companies: [],
      production_countries: [],
      revenue: 1000000,
      runtime: 120,
      spoken_languages: [],
      status: 'Released',
      tagline: null,
    },
    isLoading: false,
    error: null,
    status: 'success',
    isSuccess: true,
    isError: false,
  },
  mockMovieCredits: {
    data: {
      id: 123,
      cast: [
        {
          id: 456,
          name: 'Actor 1',
          character: 'Character 1',
          profile_path: '/actor1.jpg',
          order: 1,
        },
        {
          id: 789,
          name: 'Actor 2',
          character: 'Character 2',
          profile_path: '/actor2.jpg',
          order: 2,
        },
      ],
      crew: [],
    },
    isLoading: false,
    error: null,
    status: 'success',
    isSuccess: true,
    isError: false,
  },
  mockMovieVideos: {
    data: {
      id: 123,
      results: [
        {
          id: 'video1',
          key: 'test-video-key',
          name: 'Trailer',
          site: 'YouTube',
          type: 'Trailer',
          official: true,
          published_at: '2023-01-01',
          size: 1080,
        },
      ],
    },
    isLoading: false,
    error: null,
    status: 'success',
    isSuccess: true,
    isError: false,
  },
  mockMovieReviews: {
    data: {
      id: 123,
      page: 1,
      results: [
        {
          id: '456',
          author: 'Similar Movie 1',
          content: 'This is a test review',
          created_at: '2023-01-01',
          updated_at: '2023-01-01',
          url: 'https://example.com',
          author_details: {
            name: 'Similar Movie 1',
            username: 'Similar Movie 1',
            avatar_path: null,
            rating: 10,
          },
        },
      ],
      total_pages: 1,
      total_results: 1,
    },
    isLoading: false,
    error: null,
    status: 'success',
    isSuccess: true,
    isError: false,
  },
}));

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useParams: () => ({ lng: 'en', id: '123' }),
}));

describe('MovieDetailPage', () => {
  beforeEach(() => {
    // 清除之前的模擬
    vi.clearAllMocks();
  });

  // TODO: 檢查是否欄位遺漏
  it('renders movie details', async () => {
    renderWithClient(<MovieDetailPage />);

    expect(await screen.findByText('Test Movie')).toBeDefined();
    expect(await screen.findByText(/movie.overview/)).toBeDefined();
    expect(
      await screen.findByText('This is a test movie description')
    ).toBeDefined();
    expect(await screen.findByText(/movie.releaseDate/)).toBeDefined();
    expect(await screen.findByText(/1\/1\/2023/)).toBeDefined();
    expect(await screen.findByText(/movie.votes/)).toBeDefined();
    expect(await screen.findByText(/8.5 \/ 10/)).toBeDefined();
    expect(await screen.findByText(/movie.cast/)).toBeDefined();
  });

  it('renders video player when videos are available', async () => {
    vi.mock('@/query', () => ({
      useMovieVideosQuery: () => mockData.mockMovieVideos,
      useMovieReviewsQuery: () => mockData.mockMovieReviews,
      useMovieCreditsQuery: () => mockData.mockMovieCredits,
      useMovieDetailsQuery: () => mockData.mockMovieDetail,
    }));

    renderWithClient(<MovieDetailPage />);

    const iframe = await screen.findAllByTestId('youtube-iframe');

    expect(iframe).toHaveLength(1);
    expect(iframe[0]).toHaveAttribute(
      'src',
      'https://www.youtube.com/embed/test-video-key'
    );

    expect(iframe[0]).toHaveAttribute('allowfullscreen'); // NOTE: HTML uses "allowfullscreen" (lowercase)
  });

  it('renders cast section', async () => {
    renderWithClient(<MovieDetailPage />);

    // 檢查演員部分是否顯示
    expect(await screen.findByText('movie.cast')).toBeDefined();
    expect(await screen.findByText('Actor 1')).toBeDefined();
    expect(await screen.findByText('Actor 2')).toBeDefined();
  });

  it('renders loading state when data is loading', () => {
    // 模擬加載狀態
    mockData.mockMovieDetail = {
      data: undefined,
      isLoading: true,
      error: null,
      status: 'pending',
      isSuccess: false,
      isError: false,
    };

    renderWithClient(<MovieDetailPage />);

    // 檢查是否顯示骨架屏
    const skeletons = document.querySelectorAll(
      '[data-testid="movie-skeleton"]'
    );

    expect(skeletons.length).toBeGreaterThan(0);
  });
});
