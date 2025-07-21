'use client';

import { Fragment } from 'react';
import { useRouter, usePathname, useParams } from 'next/navigation';
import { Popover, Transition } from '@headlessui/react';
import { useLanguageStore } from '@/stores/languageStore';
import { useT } from '@/app/i18n/client';
import { languages } from '@/app/i18n/settings';

const LANGUAGE_CODES = {
  en: 'EN',
  'zh-TW': 'ZH',
  ja: 'JA',
  ko: 'KO',
  es: 'ES',
  fr: 'FR',
  de: 'DE',
} as const;

const SYSTEM_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'zh-TW', name: '繁體中文' },
  { code: 'ja', name: '日本語' },
] as const;

const MOVIE_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'zh-TW', name: '繁體中文' },
  { code: 'ja', name: '日本語' },
  { code: 'ko', name: '한국어' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
] as const;

export function LanguageSelector() {
  const { t } = useT('common');
  const { systemLanguage, movieLanguage, setSystemLanguage, setMovieLanguage } =
    useLanguageStore();

  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const currentLng = params?.lng as string;

  const currentSystemLanguage =
    LANGUAGE_CODES[systemLanguage as keyof typeof LANGUAGE_CODES] ||
    systemLanguage.toUpperCase();

  return (
    <Popover className="relative">
      <Popover.Button className="flex h-10 w-10 items-center justify-center bg-gray-800 text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
        <span>{currentSystemLanguage}</span>
      </Popover.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <Popover.Panel
          static
          className="absolute right-0 z-20 mt-2 w-64 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800 dark:ring-gray-700"
        >
          <Popover.Overlay className="fixed inset-0 z-10" />
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            <div className="p-4">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                {t('common.systemLanguage')}
              </h3>
              <div className="mt-3 space-y-2">
                {SYSTEM_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setSystemLanguage(lang.code);
                      // 如果語言在支持的語言列表中，則更新 URL 路徑
                      if (
                        languages.includes(lang.code) &&
                        lang.code !== currentLng
                      ) {
                        const newPathname = pathname.replace(
                          `/${currentLng}`,
                          `/${lang.code}`
                        );
                        router.push(newPathname);
                      }
                    }}
                    className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-sm ${
                      systemLanguage === lang.code
                        ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400'
                        : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700/50'
                    }`}
                  >
                    {lang.name}
                    {systemLanguage === lang.code && (
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4.5 12.75l6 6 9-13.5"
                        />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                {t('common.movieLanguage')}
              </h3>
              <div className="mt-3 space-y-2">
                {MOVIE_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setMovieLanguage(lang.code)}
                    className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-sm ${
                      movieLanguage === lang.code
                        ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400'
                        : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700/50'
                    }`}
                  >
                    {lang.name}
                    {movieLanguage === lang.code && (
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4.5 12.75l6 6 9-13.5"
                        />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
}
