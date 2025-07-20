import i18next from 'i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { fallbackLng, languages, defaultNS } from './settings';

// 創建 i18next 實例
const i18nextInstance = i18next
  .use(
    resourcesToBackend(
      (language: string) => import(`../../locales/${language}.json`)
    )
  );

// 初始化 i18next
i18nextInstance.init({
  supportedLngs: languages,
  fallbackLng,
  lng: undefined,
  fallbackNS: defaultNS,
  defaultNS,
  preload: languages,
});

export default i18nextInstance;
