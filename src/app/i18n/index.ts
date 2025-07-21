export * from './settings';
export { default as i18n } from './i18next';

import i18next from './i18next';
import { headerName, fallbackLng } from './settings';
import { headers } from 'next/headers';

export async function getTranslation(
  lng?: string,
  ns?: string | string[],
  options?: { keyPrefix?: string }
) {
  let language = lng;
  if (!language) {
    const headersList = await headers();
    language = headersList.get(headerName) || fallbackLng;
  }

  if (i18next.resolvedLanguage !== language) {
    await i18next.changeLanguage(language);
  }
  if (ns) {
    const namespace = Array.isArray(ns) ? ns[0] : ns;
    if (!i18next.hasLoadedNamespace(namespace)) {
      await i18next.loadNamespaces(namespace);
    }
  }

  return {
    t: i18next.getFixedT(
      language,
      Array.isArray(ns) ? ns[0] : ns || 'translation',
      options?.keyPrefix
    ),
    i18n: i18next,
  };
}
