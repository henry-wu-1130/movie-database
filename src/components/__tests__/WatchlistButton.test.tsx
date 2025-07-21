import { screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { WatchlistButton } from '../WatchlistButton';
import { renderWithClient } from '@/test/utils';
import * as watchlistStoreModule from '@/stores/watchlistStore';

vi.mock('@/stores/watchlistStore');

describe('WatchlistButton', () => {
  it('renders add to watchlist button when movie is not in watchlist', () => {
    vi.spyOn(watchlistStoreModule, 'useWatchlistStore').mockImplementation(
      () => ({
        movieIds: [1],
        addMovie: vi.fn(),
        removeMovie: vi.fn(),
        isInWatchlist: (id: number) => id === 1,
      })
    );
    renderWithClient(
      <WatchlistButton
        movie={{
          id: 2,
          title: 'Test Movie',
          overview: 'Test Overview',
          poster_path: 'test-poster-path',
          backdrop_path: 'test-backdrop-path',
          release_date: '2022-01-01',
          vote_average: 8.0,
          vote_count: 100,
          popularity: 10.0,
          original_language: 'en',
          adult: false,
          video: false,
        }}
      />
    );

    const addButton = screen.getByRole('button');
    expect(addButton).toBeDefined();
    expect(addButton.textContent).toContain('watchlist.add');
  });

  it('renders remove from watchlist button when movie is in watchlist', () => {
    vi.spyOn(watchlistStoreModule, 'useWatchlistStore').mockImplementation(
      () => ({
        movieIds: [1],
        addMovie: vi.fn(),
        removeMovie: vi.fn(),
        isInWatchlist: (id: number) => id === 1,
      })
    );
    renderWithClient(
      <WatchlistButton
        movie={{
          id: 1,
          title: 'Test Movie',
          overview: 'Test Overview',
          poster_path: 'test-poster-path',
          backdrop_path: 'test-backdrop-path',
          release_date: '2022-01-01',
          vote_average: 8.0,
          vote_count: 100,
          popularity: 10.0,
          original_language: 'en',
          adult: false,
          video: false,
        }}
      />
    );

    const removeButton = screen.getByRole('button');
    expect(removeButton).toBeDefined();
    expect(removeButton.textContent).toContain('watchlist.remove');
  });

  it('calls addToWatchlist when add button is clicked', () => {
    const mockAddToWatchlist = vi.fn();

    vi.spyOn(watchlistStoreModule, 'useWatchlistStore').mockImplementation(
      () => ({
        movieIds: [],
        addMovie: mockAddToWatchlist,
        removeMovie: vi.fn(),
        isInWatchlist: () => false,
      })
    );

    renderWithClient(
      <WatchlistButton
        movie={{
          id: 2,
          title: 'Test Movie',
          overview: 'Test Overview',
          poster_path: 'test-poster-path',
          backdrop_path: 'test-backdrop-path',
          release_date: '2022-01-01',
          vote_average: 8.0,
          vote_count: 100,
          popularity: 10.0,
          original_language: 'en',
          adult: false,
          video: false,
        }}
      />
    );

    const addButton = screen.getByRole('button');
    fireEvent.click(addButton);

    expect(mockAddToWatchlist).toHaveBeenCalledWith(2);
  });

  it('calls removeFromWatchlist when remove button is clicked', () => {
    const mockRemoveFromWatchlist = vi.fn();

    vi.spyOn(watchlistStoreModule, 'useWatchlistStore').mockImplementation(
      () => ({
        movieIds: [1],
        addMovie: vi.fn(),
        removeMovie: mockRemoveFromWatchlist,
        isInWatchlist: () => true,
      })
    );

    renderWithClient(
      <WatchlistButton
        movie={{
          id: 1,
          title: 'Test Movie',
          overview: 'Test Overview',
          poster_path: 'test-poster-path',
          backdrop_path: 'test-backdrop-path',
          release_date: '2022-01-01',
          vote_average: 8.0,
          vote_count: 100,
          popularity: 10.0,
          original_language: 'en',
          adult: false,
          video: false,
        }}
      />
    );

    const removeButton = screen.getByRole('button');
    fireEvent.click(removeButton);

    expect(mockRemoveFromWatchlist).toHaveBeenCalledWith(1);
  });
});
