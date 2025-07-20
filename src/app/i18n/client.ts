'use client';

import i18next from './client-i18next';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { useTranslation as useTranslationOriginal } from 'react-i18next';
import { useLanguageStore } from '@/stores/languageStore';

/**
 * 客戶端翻譯 hook，用於客戶端組件
 * 自動從 URL 參數獲取語言，並與 Zustand store 同步
 * @param ns 命名空間
 * @param options 選項
 */
export function useT(ns?: string | string[], options?: { keyPrefix?: string }) {
  // 從 URL 參數獲取語言
  const params = useParams();
  const lng = params?.lng as string;

  // 從 Zustand store 獲取語言狀態
  const { systemLanguage, setSystemLanguage } = useLanguageStore();

  // 獲取 react-i18next 的翻譯 hook
  const { t, i18n } = useTranslationOriginal(ns, options);

  // 同步語言狀態
  useEffect(() => {
    // 如果 URL 中有語言參數，則更新 i18next 和 Zustand store
    if (lng && i18next.resolvedLanguage !== lng) {
      i18next.changeLanguage(lng);
      setSystemLanguage(lng);
    }
    // 如果 Zustand store 中的語言與 i18next 不同，則更新 Zustand store
    else if (
      systemLanguage !== i18next.resolvedLanguage &&
      i18next.resolvedLanguage
    ) {
      setSystemLanguage(i18next.resolvedLanguage);
    }
  }, [lng, systemLanguage, setSystemLanguage, i18n]);

  return { t, i18n };
}
