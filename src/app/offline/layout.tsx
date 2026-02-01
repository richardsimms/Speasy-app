import type { Metadata, Viewport } from 'next';
import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';
import '@/styles/global.css';

export const metadata: Metadata = {
  title: 'Offline - Speasy',
  description: 'You are currently offline. Your cached content is still available.',
  robots: {
    index: false,
    follow: false,
  },
};

export const viewport: Viewport = {
  themeColor: '#100e12',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function OfflineLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} ${GeistSans.className}`}
      style={{ backgroundColor: '#100e12' }}
    >
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
