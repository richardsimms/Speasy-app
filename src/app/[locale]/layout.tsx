import type { Metadata, Viewport } from 'next';

import { SpeedInsights } from '@vercel/speed-insights/next';
import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { PostHogProvider } from '@/components/analytics/PostHogProvider';
import { IOSInstallPrompt, PWAProvider, PWAUpdateToast } from '@/components/pwa';
import { routing } from '@/libs/I18nRouting';
import '@/styles/global.css';

export const metadata: Metadata = {
  applicationName: 'Speasy',
  title: {
    default: 'Speasy - Turn Articles Into Podcasts',
    template: '%s | Speasy',
  },
  description: 'Transform newsletters and saved articles into personal podcast-style audio you can listen to anytime.',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Speasy',
    startupImage: [
      {
        url: '/apple-touch-icon.png',
        media: '(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)',
      },
    ],
  },
  formatDetection: {
    telephone: false,
  },
  icons: [
    {
      rel: 'apple-touch-icon',
      url: '/apple-touch-icon.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      url: '/favicon-32x32.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
      url: '/favicon-16x16.png',
    },
    {
      rel: 'icon',
      url: '/favicon.ico',
    },
  ],
  manifest: '/manifest.json',
  other: {
    'mobile-web-app-capable': 'yes',
  },
};

export const viewport: Viewport = {
  themeColor: '#100e12',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }));
}

export default async function RootLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  return (
    <html
      lang={locale}
      className={`${GeistSans.variable} ${GeistMono.variable} ${GeistSans.className}`}
      style={{ backgroundColor: '#100e12' }}
    >
      <body className="font-sans antialiased">
        <NextIntlClientProvider>
          <PostHogProvider>
            <PWAProvider>
              <SpeedInsights />
              <div>{props.children}</div>
              <PWAUpdateToast />
              <IOSInstallPrompt />
            </PWAProvider>
          </PostHogProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
