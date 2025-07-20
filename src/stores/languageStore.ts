import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type LanguageStore = {
  systemLanguage: string;
  movieLanguage: string;
  setSystemLanguage: (language: string) => void;
  setMovieLanguage: (language: string) => void;
};

export const useLanguageStore = create(
  persist<LanguageStore>(
    (set) => ({
      systemLanguage: 'en',
      movieLanguage: 'en',
      setSystemLanguage: (language: string) => {
        set({ systemLanguage: language });
        
        // 發送自定義事件通知其他分頁
        const event = new CustomEvent('system-language-changed', {
          detail: { language },
        });
        
        if (typeof window !== 'undefined') {
          window.dispatchEvent(event);
        }
      },
      setMovieLanguage: (language: string) => {
        set({ movieLanguage: language });
        // 發送自定義事件通知其他分頁
        const event = new CustomEvent('movie-language-changed', {
          detail: { language },
        });
        if (typeof window !== 'undefined') {
          window.dispatchEvent(event);
        }
      },
    }),
    {
      name: 'language-storage',
      // 只保存語言設定，不保存方法
      partialize: (state: LanguageStore) => ({
        systemLanguage: state.systemLanguage,
        movieLanguage: state.movieLanguage,
      }) as LanguageStore,
    }
  )
);
