'use client';

import { QueryProvider } from '@/providers/QueryProvider';
import { type ReactNode, useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18next from '@/app/i18n/client-i18next';
import { useLanguageStore } from '@/stores/languageStore';

export function Providers({ children, lng }: { children: ReactNode; lng: string }) {
  // 在客戶端同步語言
  const { setSystemLanguage } = useLanguageStore();
  
  useEffect(() => {
    if (i18next.resolvedLanguage !== lng) {
      i18next.changeLanguage(lng);
    }
    setSystemLanguage(lng);
  }, [lng, setSystemLanguage]);
  
  return (
    <>
      <I18nextProvider i18n={i18next}>
        <QueryProvider>{children}</QueryProvider>
      </I18nextProvider>
    </>
  );
}
