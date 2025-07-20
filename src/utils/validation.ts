import { z } from 'zod';

/**
 * 使用 Zod schema 驗證數據
 * @param schema Zod schema
 * @param data 要驗證的數據
 * @returns 驗證後的數據（類型安全）
 * @throws 如果驗證失敗，拋出錯誤
 */
export function validateData<T>(schema: z.ZodType<T>, data: unknown): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Data validation error:', error.format());
      throw new Error(`API 數據驗證失敗: ${error.message}`);
    }
    throw error;
  }
}

/**
 * 使用 Zod schema 驗證數據（安全版本）
 * 如果驗證失敗，返回 null 而不是拋出錯誤
 * @param schema Zod schema
 * @param data 要驗證的數據
 * @returns 驗證後的數據或 null
 */
export function safeValidateData<T>(schema: z.ZodType<T>, data: unknown): T | null {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Data validation error:', error.format());
    }
    return null;
  }
}
