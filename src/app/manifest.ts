import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Speasy - Turn Articles Into Podcasts',
    short_name: 'Speasy',
    description: 'Transform newsletters and saved articles into personal podcast-style audio you can listen to anytime.',
    start_url: '/',
    display: 'standalone',
    background_color: '#100e12',
    theme_color: '#0a090c',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        src: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    categories: ['productivity', 'news', 'entertainment'],
    shortcuts: [
      {
        name: 'Dashboard',
        short_name: 'Dashboard',
        description: 'Go to your dashboard',
        url: '/dashboard',
        icons: [{ src: '/android-chrome-192x192.png', sizes: '192x192' }],
      },
    ],
    related_applications: [],
    prefer_related_applications: false,
  };
}
