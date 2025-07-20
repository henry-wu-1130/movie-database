import { expect, vi } from 'vitest';
import * as matchers from '@testing-library/jest-dom';

// 設置測試環境變數
process.env.NEXT_PUBLIC_TMDB_API_READ_ACCESS_TOKEN = 'test-token';

// 加入 jest-dom 的 matchers
expect.extend(matchers);

// Mock IntersectionObserver
class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | null = null;
  readonly rootMargin: string = '';
  readonly thresholds: ReadonlyArray<number> = [];
  observe = vi.fn();
  disconnect = vi.fn();
  unobserve = vi.fn();
  takeRecords = vi.fn();
}

global.IntersectionObserver = MockIntersectionObserver;

// Mock ResizeObserver for Headless UI components
class MockResizeObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

global.ResizeObserver = MockResizeObserver;

// 測試環境設置完成
