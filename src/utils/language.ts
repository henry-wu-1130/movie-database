/**
 * Get user's preferred language in ISO 639-1 format
 * Fallback to 'en' if detection fails
 */
export function getUserLanguage(): string {
  if (typeof window === 'undefined') {
    return 'en'; // 伺服器端渲染時的預設值
  }

  try {
    // 從瀏覽器獲取語言設定
    const browserLang = navigator.language;
    
    // 轉換為 ISO 639-1 格式 (例如 'zh-TW' -> 'zh')
    const primaryLang = browserLang.split('-')[0].toLowerCase();
    
    // TMDB 支援的語言列表
    const supportedLanguages = [
      'ar', 'az', 'be', 'bg', 'bn', 'bs', 'ca', 'cs', 'da', 'de', 'el', 'en',
      'eo', 'es', 'et', 'eu', 'fa', 'fi', 'fr', 'ga', 'gl', 'he', 'hi', 'hr',
      'hu', 'id', 'it', 'ja', 'ka', 'kk', 'kn', 'ko', 'ky', 'lt', 'lv', 'mk',
      'ml', 'mn', 'ms', 'nb', 'nl', 'no', 'pa', 'pl', 'pt', 'ro', 'ru', 'si',
      'sk', 'sl', 'sq', 'sr', 'sv', 'ta', 'te', 'th', 'tl', 'tr', 'uk', 'ur',
      'uz', 'vi', 'zh'
    ];

    // 如果是支援的語言就使用，否則使用英文
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
    return 'US'; // 伺服器端渲染時的預設值
  }

  try {
    // 從瀏覽器語言設定中獲取地區
    const browserLang = navigator.language;
    const region = browserLang.split('-')[1]?.toUpperCase();
    
    // 如果成功獲取地區代碼就使用，否則使用美國
    return region || 'US';
  } catch (error) {
    console.warn('Failed to detect user region:', error);
    return 'US';
  }
}
