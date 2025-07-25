import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Providers } from '@/components/Providers';
import { Header } from '@/components/Header';
import { BottomNavigation } from '@/components/BottomNavigation';
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

export function generateStaticParams() {
  return languages.map((lng) => ({ lng }));
}

export async function generateMetadata({
  params,
}: {
  params: { lng: string };
}): Promise<Metadata> {
  const { t } = await getTranslation(params.lng);
  return {
    title: t('common.siteTitle'),
    description: t('common.siteTitle'),
    themeColor: '#000000',
    viewport: {
      width: 'device-width',
      initialScale: 1,
      viewportFit: 'cover',
    },
    appleWebApp: {
      capable: true,
      statusBarStyle: 'black-translucent',
    },
    manifest: '/manifest.json',
  };
}

export default async function RootLayout({
  children,
  params: { lng },
}: Readonly<{
  children: React.ReactNode;
  params: { lng: string };
}>) {
  await getTranslation(lng);

  return (
    <html lang={lng}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gray-50 dark:bg-gray-900`}
      >
        <Providers lng={lng}>
          <Header />
          <main className="mx-auto py-0 pb-16">{children}</main>
          <BottomNavigation />
        </Providers>
      </body>
    </html>
  );
}
