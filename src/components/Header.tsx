'use client';

import Link from 'next/link';
import { SearchBar } from './SearchBar';
import { LanguageSelector } from './LanguageSelector';
import { useState } from 'react';
import * as routes from '@/config/routes';
import { useT } from '@/app/i18n/client';
import { useParams } from 'next/navigation';

export function Header() {
  const { t } = useT('common');
  const [isOpen, setIsOpen] = useState(false);
  // 取得目前語言參數
  const params = useParams();
  const lng = params?.lng as string;
  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur supports-[backdrop-filter]:bg-secondary-900/90 border-b border-primary-400/20">
      <nav className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link
              href={routes.getHomeRoute(lng)}
              className="text-xl font-bold text-white transition-all"
              data-testid="site-logo"
            >
              <span suppressHydrationWarning>{t('common.siteTitle')}</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-end gap-4">
            <Link
              href={routes.getWatchlistRoute(lng)}
              className="flex items-center gap-2 text-sm text-gray-100 hover:text-white transition-colors"
              data-testid="watchlist-link"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
              {t('common.watchlist')}
            </Link>
            <div className="w-72">
              <SearchBar />
            </div>
            <LanguageSelector />
          </div>

          {/* Mobile Navigation Button */}
          <div className="flex md:hidden items-center gap-4">
            <div className="w-48">
              <SearchBar />
            </div>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-100 hover:text-white hover:bg-secondary-700 focus:outline-none focus:ring-2 focus:ring-primary-400"
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`${
            isOpen ? 'block' : 'hidden'
          } md:hidden bg-secondary-900/95 backdrop-blur-sm border-t border-primary-400/20 absolute left-0 right-0`}
        >
          <div className="pt-4 pb-3 border-t border-gray-700">
            <Link
              href={routes.getWatchlistRoute(lng)}
              className="block px-4 py-2 text-base font-medium text-gray-100 hover:text-white hover:bg-secondary-700 transition-colors"
              onClick={() => setIsOpen(false)}
              data-testid="watchlist-link-mobile"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
              {t('common.watchlist', '待看清單')}
            </Link>
            <div className="px-3 py-2">
              <LanguageSelector />
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
