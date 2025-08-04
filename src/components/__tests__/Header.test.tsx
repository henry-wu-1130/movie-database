import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createWrapper } from '@/test/utils';
import { Header } from '../Header';

vi.mock('next/link', () => ({
  default: ({
    children,
    href,
    'data-testid': testId,
    className,
  }: {
    children: React.ReactNode;
    href: string;
    'data-testid'?: string;
    className?: string;
  }) => (
    <a href={href} data-testid={testId} className={className}>
      {children}
    </a>
  ),
}));

vi.mock('../LanguageSelector', () => ({
  LanguageSelector: () => <div data-testid="language-selector">Language</div>,
}));

const mockRouter = { push: vi.fn() };
const mockGet = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
  useSearchParams: () => ({
    get: () => mockGet,
  }),
  usePathname: () => '/search',
  useParams: () => ({
    lng: 'en',
  }),
}));

vi.mock('@/query', () => ({
  useSearchMoviesQuery: () => ({
    data: null,
    isLoading: false,
  }),
}));

describe('Header', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders navigation elements correctly', async () => {
    render(<Header />, { wrapper: createWrapper() });

    expect(screen.getByTestId('site-logo')).toBeInTheDocument();
    expect(screen.getByTestId('watchlist-link')).toBeInTheDocument();
    expect(screen.getByTestId('watchlist-link-mobile')).toBeInTheDocument();

    const searchInputs = screen.getAllByRole('searchbox');
    expect(searchInputs).toHaveLength(2);

    const searchInput = searchInputs[0];
    expect(searchInput).toHaveAttribute('placeholder', 'search.placeholder');

    // Verify links have correct hrefs
    expect(screen.getByTestId('site-logo')).toHaveAttribute('href', '/en');

    const watchlistLinks = screen.getAllByTestId(/watchlist-link/);
    watchlistLinks.forEach((link) => {
      expect(link).toHaveAttribute('href', '/en/watchlist');
    });
  });
});
