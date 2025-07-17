'use client';

import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { useLanguageStore } from '@/stores/languageStore';

import en from '@/locales/en.json';
import zhTW from '@/locales/zh-TW.json';
import ja from '@/locales/ja.json';

i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources: {
      en: { translation: en },
      'zh-TW': { translation: zhTW },
      ja: { translation: ja },
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

// 與 Zustand store 同步
const { systemLanguage, setSystemLanguage } = useLanguageStore.getState();
i18next.changeLanguage(systemLanguage);

i18next.on('languageChanged', (lng) => {
  setSystemLanguage(lng);
});

useLanguageStore.subscribe((state) => {
  if (state.systemLanguage !== i18next.language) {
    i18next.changeLanguage(state.systemLanguage);
  }
});

export default i18next;
