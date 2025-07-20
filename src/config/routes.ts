// 路由路徑
// 加入語言參數的函數
export const getHomeRoute = (lng: string) => `/${lng}`;
export const getWatchlistRoute = (lng: string) => `/${lng}/watchlist`;
export const getMovieRoute = (lng: string, movieId?: string | number) =>
  movieId ? `/${lng}/movie/${movieId}` : `/${lng}/movie`;

// 向後兼容的靜態路徑
// 警告：這些路徑沒有語言前綴，只在無法取得語言參數時使用
export const HOME = '/';
export const WATCHLIST = '/watchlist';
export const MOVIE = '/movie';
