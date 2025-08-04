'use client';

import { useState, useEffect } from 'react';

/**
 * Custom hook for responsive design using media queries
 * @param query CSS media query string (e.g., '(max-width: 768px)')
 * @returns Boolean indicating if the media query matches
 */
export function useMediaQuery(query: string): boolean {
  // Default to false on the server or during initial client render
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Check if window is available (client-side only)
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia(query);
      
      // Set the initial value
      setMatches(mediaQuery.matches);

      // Define a callback function to handle changes
      const handleChange = (event: MediaQueryListEvent) => {
        setMatches(event.matches);
      };

      // Add the callback as a listener for changes to the media query
      mediaQuery.addEventListener('change', handleChange);

      // Clean up function to remove the listener when the component unmounts
      return () => {
        mediaQuery.removeEventListener('change', handleChange);
      };
    }
  }, [query]); // Re-run effect if the query changes

  return matches;
}

/**
 * Convenience hook to detect mobile devices
 * @returns Boolean indicating if the current viewport is mobile-sized
 */
export function useIsMobile(): boolean {
  return useMediaQuery('(max-width: 768px)');
}
