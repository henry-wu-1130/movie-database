'use client';

import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import resourcesToBackend from 'i18next-resources-to-backend';
import { initReactI18next } from 'react-i18next';
import { fallbackLng, languages, defaultNS } from './settings';

const i18nextClient = i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(
    resourcesToBackend(
      (language: string) => import(`../../locales/${language}.json`)
    )
  );

i18nextClient.init({
  supportedLngs: languages,
  fallbackLng,
  lng: undefined,
  fallbackNS: defaultNS,
  defaultNS,
  detection: {
    order: ['path', 'htmlTag', 'cookie', 'navigator'],
    caches: ['cookie'],
  },
  react: {
    useSuspense: false,
  },
});

export default i18nextClient;
