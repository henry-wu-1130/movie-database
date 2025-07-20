// 導出 i18n 設置和實例
export * from './settings';
export { default as i18n } from './i18next';

// 為伺服器端組件提供翻譯功能
import i18next from './i18next';
import { headerName, fallbackLng } from './settings';
import { headers } from 'next/headers';

/**
 * 獲取伺服器端翻譯函數
 * @param lng 語言代碼，如果未提供則從請求頭獲取
 * @param ns 命名空間
 * @param options 選項
 */
export async function getTranslation(
  lng?: string,
  ns?: string | string[], 
  options?: { keyPrefix?: string }
) {
  // 如果沒有提供語言，則從請求頭獲取
  let language = lng;
  if (!language) {
    const headersList = await headers();
    language = headersList.get(headerName) || fallbackLng;
  }
  
  // 切換語言
  if (i18next.resolvedLanguage !== language) {
    await i18next.changeLanguage(language);
  }
  
  // 加載命名空間
  if (ns) {
    const namespace = Array.isArray(ns) ? ns[0] : ns;
    if (!i18next.hasLoadedNamespace(namespace)) {
      await i18next.loadNamespaces(namespace);
    }
  }
  
  // 返回翻譯函數
  return {
    t: i18next.getFixedT(language, Array.isArray(ns) ? ns[0] : ns || 'translation', options?.keyPrefix),
    i18n: i18next
  };
}
