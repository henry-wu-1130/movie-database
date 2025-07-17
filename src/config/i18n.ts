export type Language = {
  code: string;
  name: string;
  region?: string;
};

export type SupportedLanguage = 'zh-TW' | 'en-US' | 'ja-JP' | 'ko-KR';

export const SUPPORTED_LANGUAGES: Record<SupportedLanguage, Language> = {
  'zh-TW': {
    code: 'zh',
    name: '繁體中文',
    region: 'TW'
  },
  'en-US': {
    code: 'en',
    name: 'English',
    region: 'US'
  },
  'ja-JP': {
    code: 'ja',
    name: '日本語',
    region: 'JP'
  },
  'ko-KR': {
    code: 'ko',
    name: '한국어',
    region: 'KR'
  }
};

export const DEFAULT_LANGUAGE: SupportedLanguage = 'zh-TW';
