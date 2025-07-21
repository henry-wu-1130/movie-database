'use client';

import i18next from './client-i18next';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { useTranslation as useTranslationOriginal } from 'react-i18next';
import { useLanguageStore } from '@/stores/languageStore';

export function useT(ns?: string | string[], options?: { keyPrefix?: string }) {
  const params = useParams();
  const lng = params?.lng as string;

  const { systemLanguage, setSystemLanguage } = useLanguageStore();

  const { t, i18n } = useTranslationOriginal(ns, options);

  useEffect(() => {
    if (lng && i18next.resolvedLanguage !== lng) {
      i18next.changeLanguage(lng);
      setSystemLanguage(lng);
    } else if (
      systemLanguage !== i18next.resolvedLanguage &&
      i18next.resolvedLanguage
    ) {
      setSystemLanguage(i18next.resolvedLanguage);
    }
  }, [lng, systemLanguage, setSystemLanguage, i18n]);

  return { t, i18n };
}
