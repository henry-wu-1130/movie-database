import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { createWrapper } from '@/test/utils';
import i18n from 'i18next';
import Home from '../page';

// Mock the query hooks
vi.mock('@/query', () => ({
  usePopularMoviesQuery: () => ({ data: null, isLoading: false }),
  useNowPlayingMoviesQuery: () => ({ data: null, isLoading: false }),
  useUpcomingMoviesQuery: () => ({ data: null, isLoading: false }),
}));

describe('Home Page', () => {
  it('renders main section headings', async () => {
    render(<Home />, { wrapper: createWrapper() });

    // Test Traditional Chinese (default)
    expect(i18n.language).toBe('zh-TW');
    expect(screen.getByText('熱門電影')).toBeInTheDocument();
    expect(screen.getByText('現正熱映')).toBeInTheDocument();
    expect(screen.getByText('即將上映')).toBeInTheDocument();
  });
});
