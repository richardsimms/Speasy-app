'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Pause, Play } from 'lucide-react';
import Image from 'next/image';
import { usePlayback } from '@/components/playback/playback-provider';
import { cn } from '@/libs/utils';

export function MiniPlayer() {
  const { activeTrack, state, togglePlay, openPlayer } = usePlayback();

  if (!activeTrack) {
    return null;
  }

  const isPlaying = state.isPlaying;
  const progressWidth
    = state.durationSec && state.durationSec > 0
      ? `${Math.min(100, (state.currentTimeSec / state.durationSec) * 100)}%`
      : '0%';

  return (
    <AnimatePresence>
      <motion.div
        key={activeTrack.id}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-4 left-1/2 z-40 w-[calc(100%-2rem)] max-w-4xl -translate-x-1/2 cursor-pointer"
        onClick={openPlayer}
      >
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#0B0B0B]/90 p-3 shadow-lg shadow-black/40 backdrop-blur-lg">
          {activeTrack.artworkUrl
            ? (
                <div className="relative h-12 w-12 overflow-hidden rounded-xl border border-white/10">
                  <Image
                    src={activeTrack.artworkUrl}
                    alt={activeTrack.title}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
              )
            : (
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-sm text-white/60">
                  ♫
                </div>
              )}

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">
              {activeTrack.title}
            </p>
            {activeTrack.author && (
              <p className="truncate text-xs text-white/60">
                {activeTrack.author}
              </p>
            )}
            <div className="relative mt-2 h-1 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-white"
                style={{ width: progressWidth }}
              />
            </div>
          </div>

          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              void togglePlay();
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
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
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
