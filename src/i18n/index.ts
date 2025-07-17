import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from '@/locales/en.json';
import zhTW from '@/locales/zh-TW.json';
import ja from '@/locales/ja.json';
import { useLanguageStore } from '@/stores/languageStore';

// 不要在服務器端初始化
if (typeof window !== 'undefined') {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
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
  i18n.changeLanguage(systemLanguage);

  i18n.on('languageChanged', (lng) => {
    setSystemLanguage(lng);
  });

  useLanguageStore.subscribe((state) => {
    if (state.systemLanguage !== i18n.language) {
      i18n.changeLanguage(state.systemLanguage);
    }
  });
}

export default i18n;
