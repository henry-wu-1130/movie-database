'use client';

import { useTranslation as useTranslationOriginal } from 'react-i18next';

export function useT(ns?: string | string[], options?: { keyPrefix?: string }) {
  // Simplified: language synchronization is now handled only in Providers.tsx
  const { t, i18n } = useTranslationOriginal(ns, options);

  return { t, i18n };
}
