'use client';

import { usePathname } from 'next/navigation';
import { FullPlayer } from './full-player';
import { MiniPlayer } from './mini-player';
import { PlaybackProvider } from './playback-provider';

type AudioPlayerLayoutProps = {
  children: React.ReactNode;
};

/**
 * Check if we're on the home page (discover page)
 * The new player should only be available on the home screen
 */
function isHomePage(pathname: string): boolean {
  // Match home page patterns: /, /en, /en/, etc.
  // Don't match /content/, /about/, /blog/, etc.
  const segments = pathname.split('/').filter(Boolean);

  // Root or just locale
  if (segments.length === 0) {
    return true;
  }

  // Just locale like /en or /en/
  if (
    segments.length === 1
    && /^[a-z]{2}(?:-[a-z]{2})?$/i.test(segments[0] ?? '')
  ) {
    return true;
  }

  return false;
}

/**
 * Client-side wrapper that provides global audio playback
 * Includes PlaybackProvider, MiniPlayer, and FullPlayer
 * Note: MiniPlayer and FullPlayer only render on home page
 */
export function AudioPlayerLayout({ children }: AudioPlayerLayoutProps) {
  const pathname = usePathname();
  const showPlayer = isHomePage(pathname);

  return (
    <PlaybackProvider>
      {children}
      {showPlayer && <MiniPlayer />}
      {showPlayer && <FullPlayer />}
    </PlaybackProvider>
  );
}
