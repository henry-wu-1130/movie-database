import { NextRequest, NextResponse } from 'next/server';
import acceptLanguage from 'accept-language';
import {
  fallbackLng,
  languages,
  cookieName,
  headerName,
} from '@/app/i18n/settings';

acceptLanguage.languages(languages);

export function middleware(req: NextRequest) {
  // Ignore paths with "icon" or "chrome"
  if (
    req.nextUrl.pathname.indexOf('icon') > -1 ||
    req.nextUrl.pathname.indexOf('chrome') > -1
  )
    return NextResponse.next();

  let lng;
  // Try to get language from cookie
  if (req.cookies.has(cookieName))
    lng = acceptLanguage.get(req.cookies.get(cookieName)?.value);
  // If no cookie, check the Accept-Language header
  if (!lng) lng = acceptLanguage.get(req.headers.get('Accept-Language'));
  // Default to fallback language if still undefined
  if (!lng) lng = fallbackLng;

  // Check if the language is already in the path
  const lngInPath = languages.find((loc) =>
    req.nextUrl.pathname.startsWith(`/${loc}`)
  );
  const headers = new Headers(req.headers);
  headers.set(headerName, lngInPath || lng);

  // 如果是根路徑或語言不在路徑中，重定向以包含語言前綴
  if (!lngInPath && !req.nextUrl.pathname.startsWith('/_next')) {
    // 修正根路徑的處理，確保不會出現 '//' 這樣的路徑
    const pathWithLng =
      req.nextUrl.pathname === '/'
        ? `/${lng}`
        : `/${lng}${req.nextUrl.pathname}`;

    return NextResponse.redirect(
      new URL(`${pathWithLng}${req.nextUrl.search}`, req.url)
    );
  }

  // If a referer exists, try to detect the language from there and set the cookie accordingly
  if (req.headers.has('referer')) {
    const refererUrl = new URL(req.headers.get('referer') || '');
    const lngInReferer = languages.find((l) =>
      refererUrl.pathname.startsWith(`/${l}`)
    );
    const response = NextResponse.next({ headers });
    if (lngInReferer) response.cookies.set(cookieName, lngInReferer);
    return response;
  }

  return NextResponse.next({ headers });
}

export const config = {
  // Avoid matching for static files, API routes, etc.
  // 特別注意：確保根路徑 '/' 也被匹配到
  matcher: [
    '/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js|site.webmanifest).*)',
    '/',
  ],
};
