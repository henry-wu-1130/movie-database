/**
 * Get user's preferred language in ISO 639-1 format
 * Fallback to 'en' if detection fails
 */
export function getUserLanguage(): string {
  if (typeof window === 'undefined') {
    return 'en';
  }

  try {
    const browserLang = navigator.language;
    const primaryLang = browserLang.split('-')[0].toLowerCase();

    const supportedLanguages = [
      'ar',
      'az',
      'be',
      'bg',
      'bn',
      'bs',
      'ca',
      'cs',
      'da',
      'de',
      'el',
      'en',
      'eo',
      'es',
      'et',
      'eu',
      'fa',
      'fi',
      'fr',
      'ga',
      'gl',
      'he',
      'hi',
      'hr',
      'hu',
      'id',
      'it',
      'ja',
      'ka',
      'kk',
      'kn',
      'ko',
      'ky',
      'lt',
      'lv',
      'mk',
      'ml',
      'mn',
      'ms',
      'nb',
      'nl',
      'no',
      'pa',
      'pl',
      'pt',
      'ro',
      'ru',
      'si',
      'sk',
      'sl',
      'sq',
      'sr',
      'sv',
      'ta',
      'te',
      'th',
      'tl',
      'tr',
      'uk',
      'ur',
      'uz',
      'vi',
      'zh',
    ];

    return supportedLanguages.includes(primaryLang) ? primaryLang : 'en';
  } catch (error) {
    console.warn('Failed to detect user language:', error);
    return 'en';
  }
}

/**
 * Get user's preferred region
 * Fallback to 'US' if detection fails
 */
export function getUserRegion(): string {
  if (typeof window === 'undefined') {
    return 'US';
  }

  try {
    const browserLang = navigator.language;
    const region = browserLang.split('-')[1]?.toUpperCase();
    return region || 'US';
  } catch (error) {
    console.warn('Failed to detect user region:', error);
    return 'US';
  }
}
