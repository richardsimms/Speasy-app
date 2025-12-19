import type { Metadata } from 'next';

import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';
import { AppConfig } from '@/utils/AppConfig';
import '@/styles/global.css';

export const metadata: Metadata = {
  title: 'Offline | Speasy',
  description: 'Speasy is offline. Check your connection and try again.',
};

export default function OfflineLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang={AppConfig.defaultLocale}
      className={`${GeistSans.variable} ${GeistMono.variable} ${GeistSans.className}`}
    >
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
