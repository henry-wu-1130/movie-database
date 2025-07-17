import { expect, afterEach, afterAll, beforeAll, vi } from 'vitest';
import * as matchers from '@testing-library/jest-dom';
import { server } from '../mocks/node';

// 設置測試環境變數
process.env.NEXT_PUBLIC_TMDB_API_READ_ACCESS_TOKEN = 'test-token';
process.env.NEXT_PUBLIC_API_MOCKING = 'enabled';

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

beforeAll(() => {
  // Enable the mocking in tests.
  server.listen();
});

afterEach(() => {
  // Reset any runtime handlers tests may use.
  server.resetHandlers();
});

afterAll(() => {
  // Clean up once the tests are done.
  server.close();
});
