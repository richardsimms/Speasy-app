'use client';

import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { PlaybackProvider } from './playback-provider';

type AudioPlayerLayoutProps = {
  children: React.ReactNode;
};

/**
 * Check if we're on a discover page where the audio player should appear.
 * Matches: /, /en, /latest, /en/latest, /category/*, /en/category/*
 */
function isDiscoverPage(pathname: string): boolean {
  const segments = pathname.split('/').filter(Boolean);

  // Root: /
  if (segments.length === 0) {
    return true;
  }

  const first = segments[0] ?? '';
  const isLocale = /^[a-z]{2}(?:-[a-z]{2})?$/i.test(first);

  // Strip optional locale prefix for matching
  const rest = isLocale ? segments.slice(1) : segments;

  // Just locale root: /en
  if (rest.length === 0) {
    return true;
  }

  // /latest or /en/latest
  if (rest.length === 1 && rest[0] === 'latest') {
    return true;
  }

  // /category/<slug> or /en/category/<slug>
  if (rest.length === 2 && rest[0] === 'category') {
    return true;
  }

  return false;
}

/**
 * Client-side wrapper that provides global audio playback
 * Includes PlaybackProvider, MiniPlayer, and FullPlayer
 * Note: MiniPlayer and FullPlayer only render on discover pages (home, /latest, /category/*)
 */
const MiniPlayer = dynamic(
  () => import('./mini-player').then(mod => mod.MiniPlayer),
  { ssr: false },
);

const FullPlayer = dynamic(
  () => import('./full-player').then(mod => mod.FullPlayer),
  { ssr: false },
);

export function AudioPlayerLayout({ children }: AudioPlayerLayoutProps) {
  const pathname = usePathname();
  const showPlayer = isDiscoverPage(pathname);

  if (!showPlayer) {
    return <>{children}</>;
  }

  return (
    <PlaybackProvider>
      {children}
      <MiniPlayer />
      <FullPlayer />
    </PlaybackProvider>
  );
}
