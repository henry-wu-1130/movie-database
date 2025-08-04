import { screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SearchBar } from '@/components/SearchBar';
import { renderWithClient } from '@/test/utils';

const mockPush = vi.fn();
const mockGet = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  useSearchParams: () => ({ get: mockGet }),
  useParams: () => ({ lng: 'en' }),
  usePathname: () => '/en',
}));

describe('SearchBar', () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockGet.mockReturnValue('');
  });

  it('renders search input', () => {
    renderWithClient(<SearchBar />);
    expect(screen.getByRole('searchbox')).toBeInTheDocument();
  });

  it('updates input value when typing', () => {
    mockGet.mockReturnValue('avatar');
    renderWithClient(<SearchBar />);

    const input = screen.getByRole('searchbox');

    expect(input).toHaveValue('avatar');
  });

  it('calls router.push when form is submitted', async () => {
    mockGet.mockReturnValue('avatar');

    renderWithClient(<SearchBar />);

    const input = screen.getByRole('searchbox');
    const form = input.closest('form');

    expect(form).not.toBeNull();

    fireEvent.change(input, { target: { value: 'avatar' } });
    fireEvent.submit(form!);

    expect(mockPush).toHaveBeenCalledWith('/en/search?q=avatar');
  });

  it('initializes with query from URL search params', () => {
    mockGet.mockReturnValue('star wars');

    renderWithClient(<SearchBar />);

    const input = screen.getByRole('searchbox');
    expect(input).toHaveAttribute('placeholder', 'search.placeholder');
  });
});
