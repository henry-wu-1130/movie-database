import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * 合併 Tailwind CSS 類名，避免衝突
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
