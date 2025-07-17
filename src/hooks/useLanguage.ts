import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useLanguageStore } from '@/stores/languageStore';

export function useLanguage() {
  const queryClient = useQueryClient();
  const { systemLanguage, movieLanguage, setSystemLanguage, setMovieLanguage } =
    useLanguageStore();

  useEffect(() => {
    // 監聽其他分頁的語言變更
    const handleLanguageChange = (e: CustomEvent<string>) => {
      if (e.detail !== systemLanguage) {
        setSystemLanguage(e.detail);
        queryClient.invalidateQueries({ queryKey: ['tmdb'] });
      }
    };

    window.addEventListener(
      'language-change',
      handleLanguageChange as EventListener
    );
    return () => {
      window.removeEventListener(
        'language-change',
        handleLanguageChange as EventListener
      );
    };
  }, [queryClient, systemLanguage, setSystemLanguage]);

  const handleLanguageChange = (newLanguage: string) => {
    if (newLanguage === systemLanguage) return;
    setSystemLanguage(newLanguage);
    queryClient.invalidateQueries({ queryKey: ['tmdb'] });
  };

  return {
    systemLanguage,
    movieLanguage,
    setSystemLanguage: handleLanguageChange,
    setMovieLanguage,
  };
}
