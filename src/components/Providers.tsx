'use client';

import { MSWProvider } from '@/providers/MSWProvider';
import { QueryProvider } from '@/providers/QueryProvider';
import { I18nProvider } from '@/providers/I18nProvider';
import { type ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <>
      {process.env.NEXT_PUBLIC_API_MOCKING === 'enabled' && <MSWProvider />}
      <QueryProvider>
        <I18nProvider>{children}</I18nProvider>
      </QueryProvider>
    </>
  );
}
