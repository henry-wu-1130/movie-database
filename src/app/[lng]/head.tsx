import { TMDB_API_DOMAIN } from '@/constants/api';

export default function Head() {
  return (
    <>
      <link rel="preconnect" href={TMDB_API_DOMAIN} crossOrigin="" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
    </>
  );
}
