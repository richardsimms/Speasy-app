'use client';

import type { Track } from '@/types/playback';
import { motion } from 'framer-motion';
import { LayoutList, Pause, Play, Radio } from 'lucide-react';
import { usePlayback } from '@/components/playback/playback-provider';
import { cn } from '@/libs/utils';

type InlineAudioControlsProps = {
  track: Track;
  queue?: Track[];
  className?: string;
  layout?: 'compact' | 'wide';
  showProgress?: boolean;
};

export function InlineAudioControls({
  track,
  queue,
  className,
  layout = 'wide',
  showProgress = true,
}: InlineAudioControlsProps) {
  const { activeTrack, state, playTrack, togglePlay, openPlayer } = usePlayback();

  const isActive = activeTrack?.id === track.id;
  const isPlaying = isActive && state.isPlaying;
  const duration = isActive ? state.durationSec : track.durationSec ?? null;
  const progress
    = isActive && duration
      ? Math.min(100, (state.currentTimeSec / duration) * 100)
      : 0;

  const handleToggle = async () => {
    if (!isActive) {
      await playTrack(track, queue);
      return;
    }
    await togglePlay();
  };

  const handleOpenPlayer = async () => {
    if (!isActive) {
      await playTrack(track, queue);
    }
    openPlayer();
  };

  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur',
        className,
      )}
    >
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleToggle}
        aria-label={isPlaying ? 'Pause' : 'Play'}
        className={cn(
          'flex h-12 w-12 items-center justify-center rounded-full text-white transition-all duration-200',
          isPlaying
            ? 'bg-white text-black shadow-[0_0_24px_rgba(255,255,255,0.35)]'
            : 'bg-white/10 hover:bg-white hover:text-black',
        )}
      >
        {isPlaying
          ? (
              <Pause className="h-5 w-5" />
            )
          : (
              <Play className="ml-0.5 h-5 w-5" />
            )}
      </motion.button>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-sm font-medium text-white">
            {track.title}
          </span>
          {track.author && (
            <span className="truncate text-xs text-white/60">
              •
              {' '}
              {track.author}
            </span>
          )}
        </div>
        {showProgress && (
          <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
        {!showProgress && layout === 'compact' && (
          <span className="text-xs text-white/60">
            {isActive
              ? isPlaying
                ? 'Playing'
                : 'Paused'
              : 'Tap to play'}
          </span>
        )}
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleOpenPlayer}
        aria-label="Open player"
        className="hidden h-11 w-11 items-center justify-center rounded-full border border-white/10 text-white transition-colors hover:border-white/30 hover:bg-white/10 lg:flex"
      >
        {layout === 'wide'
          ? (
              <LayoutList className="h-5 w-5" />
            )
          : (
              <Radio className="h-5 w-5" />
            )}
      </motion.button>
    </div>
  );
}
