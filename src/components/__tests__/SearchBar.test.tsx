import { screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SearchBar } from '@/components/SearchBar';
import { renderWithClient } from '@/test/utils';

const mockPush = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  useSearchParams: () => ({ get: () => null }),
  useParams: () => ({ lng: 'en' }),
  usePathname: () => '/en',
}));

describe('SearchBar', () => {
  it('renders search input', async () => {
    renderWithClient(<SearchBar />);

    const searchInput = await screen.findByPlaceholderText(
      'search.placeholder'
    );

    expect(searchInput).toBeDefined();
  });

  it('updates input value when typing', async () => {
    renderWithClient(<SearchBar />);

    const searchInput = (await screen.findByPlaceholderText(
      'search.placeholder'
    )) as HTMLInputElement;
    fireEvent.change(searchInput, { target: { value: 'avatar' } });

    expect(searchInput.value).toBe('avatar');
  });

  it('calls router.push when form is submitted', async () => {
    mockPush.mockClear();

    renderWithClient(<SearchBar />);

    const searchInput = await screen.findByPlaceholderText(
      'search.placeholder'
    );

    const form = searchInput.closest('form');

    fireEvent.change(searchInput, { target: { value: 'avatar' } });

    expect(form).not.toBeNull();
    fireEvent.submit(form!);

    expect(mockPush).toHaveBeenCalledWith('/en/search?q=avatar');
  });
});
