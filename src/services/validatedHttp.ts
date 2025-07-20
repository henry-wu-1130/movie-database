import { z } from 'zod';
import http from './http';
import { validateData } from '@/utils/validation';

/**
 * 帶有 Zod 驗證的 HTTP 客戶端
 * 擴展原有的 HTTP 客戶端，添加數據驗證功能
 */
const validatedHttp = {
  /**
   * 發送 GET 請求並驗證響應數據
   * @param url 請求 URL
   * @param schema 用於驗證響應數據的 Zod schema
   * @returns 驗證後的響應數據
   */
  async get<T>(url: string, schema: z.ZodType<T>) {
    const response = await http.get(url);
    return validateData(schema, response.data);
  },

  /**
   * 發送 POST 請求並驗證響應數據
   * @param url 請求 URL
   * @param data 請求數據
   * @param schema 用於驗證響應數據的 Zod schema
   * @returns 驗證後的響應數據
   */
  async post<T>(url: string, data: unknown, schema: z.ZodType<T>) {
    const response = await http.post(url, data);
    return validateData(schema, response.data);
  },

  /**
   * 發送 PUT 請求並驗證響應數據
   * @param url 請求 URL
   * @param data 請求數據
   * @param schema 用於驗證響應數據的 Zod schema
   * @returns 驗證後的響應數據
   */
  async put<T>(url: string, data: unknown, schema: z.ZodType<T>) {
    const response = await http.put(url, data);
    return validateData(schema, response.data);
  },

  /**
   * 發送 DELETE 請求並驗證響應數據
   * @param url 請求 URL
   * @param schema 用於驗證響應數據的 Zod schema
   * @returns 驗證後的響應數據
   */
  async delete<T>(url: string, schema: z.ZodType<T>) {
    const response = await http.delete(url);
    return validateData(schema, response.data);
  },
};

export default validatedHttp;
