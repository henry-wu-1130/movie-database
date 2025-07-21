export const getHomeRoute = (lng: string) => `/${lng}`;
export const getWatchlistRoute = (lng: string) => `/${lng}/watchlist`;
export const getMovieRoute = (lng: string, movieId?: string | number) =>
  movieId ? `/${lng}/movie/${movieId}` : `/${lng}/movie`;

export const HOME = '/';
export const WATCHLIST = '/watchlist';
export const MOVIE = '/movie';
