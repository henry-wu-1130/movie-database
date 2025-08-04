import { render, screen } from '@testing-library/react';
import { BottomNavigation } from '../BottomNavigation';
import * as mediaQueryHooks from '@/hooks/useMediaQuery';
import { vi, describe, it, beforeEach, expect } from 'vitest';

// Mock the Next.js router and navigation hooks
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
  usePathname: () => '/en',
}));

describe('BottomNavigation', () => {
  // Helper function to mock the useIsMobile hook
  const mockUseIsMobile = (isMobile: boolean) => {
    vi.spyOn(mediaQueryHooks, 'useIsMobile').mockReturnValue(isMobile);
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders on mobile devices', () => {
    // Mock that we're on a mobile device
    mockUseIsMobile(true);
    
    render(<BottomNavigation />);
    
    // Check if the navigation is rendered
    expect(screen.getByTestId('bottom-navigation')).toBeInTheDocument();
    expect(screen.getByTestId('bottom-nav-home')).toBeInTheDocument();
    expect(screen.getByTestId('bottom-nav-watchlist')).toBeInTheDocument();
  });

  it('does not render on non-mobile devices', () => {
    // Mock that we're on a desktop device
    mockUseIsMobile(false);
    
    render(<BottomNavigation />);
    
    // Check that the navigation is not rendered
    expect(screen.queryByTestId('bottom-navigation')).not.toBeInTheDocument();
    expect(screen.queryByTestId('bottom-nav-home')).not.toBeInTheDocument();
    expect(screen.queryByTestId('bottom-nav-watchlist')).not.toBeInTheDocument();
  });
});
