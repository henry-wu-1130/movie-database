import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Providers } from '@/components/Providers';
import { Header } from '@/components/Header';
import { languages } from '@/app/i18n/settings';
import { getTranslation } from '@/app/i18n';
import '@/styles/globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

// export const metadata: Metadata = {
//   title: 'Movie Database',
//   description: 'A movie database powered by TMDB API',
// };

// 生成靜態參數，為每種支持的語言生成路由
export function generateStaticParams() {
  return languages.map((lng) => ({ lng }));
}

// 根據當前語言生成元數據
export async function generateMetadata({
  params,
}: {
  params: { lng: string };
}): Promise<Metadata> {
  const { t } = await getTranslation(params.lng);
  return {
    title: t('common.siteTitle'),
    description: t('common.siteTitle'),
  };
}

export default async function RootLayout({
  children,
  params: { lng },
}: Readonly<{
  children: React.ReactNode;
  params: { lng: string };
}>) {
  // 取得翻譯函數但不在這裡使用
  // 只是為了確保語言資源已經載入
  await getTranslation(lng);

  return (
    <html lang={lng}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gray-50 dark:bg-gray-900`}
      >
        <Providers lng={lng}>
          <Header />
          <main className="mx-auto py-0">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
