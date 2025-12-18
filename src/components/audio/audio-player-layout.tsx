"use client";

import { FullPlayer } from "./full-player";
import { MiniPlayer } from "./mini-player";
import { PlaybackProvider } from "./playback-provider";

type AudioPlayerLayoutProps = {
  children: React.ReactNode;
};

/**
 * Client-side wrapper that provides global audio playback
 * Includes PlaybackProvider, MiniPlayer, and FullPlayer
 */
export function AudioPlayerLayout({ children }: AudioPlayerLayoutProps) {
  return (
    <PlaybackProvider>
      {children}
      <MiniPlayer />
      <FullPlayer />
    </PlaybackProvider>
  );
}
