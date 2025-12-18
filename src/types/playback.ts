'use client';

export type Track = {
  id: string;
  title: string;
  audioUrl: string;
  author?: string;
  artworkUrl?: string;
  sourceUrl?: string;
  durationSec?: number;
  /**
   * Content route for this track, used when closing the player to return
   * to the active item's page.
   */
  contentUrl?: string;
};

export type UiMode = 'inline' | 'player';

export type PlayerState = {
  uiMode: UiMode;
  queueEnabled: boolean;
  queue: Track[];
  activeIndex: number;
  isPlaying: boolean;
  currentTimeSec: number;
  durationSec: number | null;
};
