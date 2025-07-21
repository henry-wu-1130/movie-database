import i18next from 'i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { fallbackLng, languages, defaultNS } from './settings';

const i18nextInstance = i18next.use(
  resourcesToBackend(
    (language: string) => import(`../../locales/${language}.json`)
  )
);

i18nextInstance.init({
  supportedLngs: languages,
  fallbackLng,
  lng: undefined,
  fallbackNS: defaultNS,
  defaultNS,
  preload: languages,
});

export default i18nextInstance;
