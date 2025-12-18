'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import Image from 'next/image';
import { usePlayback } from '@/components/playback/playback-provider';
import { cn } from '@/libs/utils';

export function FullPlayer() {
  const {
    activeTrack,
    state,
    closePlayer,
    togglePlay,
    next,
    prev,
    seek,
  } = usePlayback();

  const isOpen = state.uiMode === 'player' && !!activeTrack;
  const hasPrev = state.queueEnabled && state.activeIndex > 0;
  const hasNext = state.queueEnabled
    && state.activeIndex + 1 < state.queue.length;

  const formatTime = (seconds: number | null | undefined) => {
    if (!seconds || !Number.isFinite(seconds)) {
      return '0:00';
    }
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = state.durationSec
    ? Math.min(100, (state.currentTimeSec / state.durationSec) * 100)
    : 0;

  return (
    <AnimatePresence>
      {isOpen && activeTrack && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 180, damping: 22 }}
            className="relative z-10 h-[80vh] w-full max-w-4xl overflow-hidden rounded-t-3xl border border-white/10 bg-[#0B0B0B] shadow-2xl shadow-black/40"
          >
            <div className="flex h-full flex-col p-6">
              <div className="mb-4 flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-xs tracking-[0.2em] text-white/60 uppercase">
                    Now Playing
                  </p>
                  <h2 className="text-2xl font-semibold text-white">
                    {activeTrack.title}
                  </h2>
                  {activeTrack.author && (
                    <p className="text-white/60">{activeTrack.author}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={closePlayer}
                  aria-label="Close player"
                  className="rounded-full border border-white/10 p-2 text-white/80 transition-colors hover:border-white/30 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="grid gap-6 md:grid-cols-[1.5fr_1fr]">
                <div className="flex flex-col gap-4">
                  <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                    {activeTrack.artworkUrl
                      ? (
                          <Image
                            src={activeTrack.artworkUrl}
                            alt={activeTrack.title}
                            fill
                            className="object-cover"
                            sizes="600px"
                          />
                        )
                      : (
                          <div className="flex h-full items-center justify-center text-5xl text-white/20">
                            ♫
                          </div>
                        )}
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-white/60">
                      <span>{formatTime(state.currentTimeSec)}</span>
                      <span>{formatTime(state.durationSec)}</span>
                    </div>
                    <input
                      type="range"
                      aria-label="Seek"
                      min={0}
                      max={state.durationSec ?? 0}
                      value={Math.min(
                        state.currentTimeSec,
                        state.durationSec ?? state.currentTimeSec,
                      )}
                      onChange={e => seek(Number(e.target.value))}
                      className="h-2 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-white"
                    />
                    <div className="relative h-1 w-full overflow-hidden rounded-full bg-white/10">
                      <div
                        className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={prev}
                      disabled={!hasPrev}
                      aria-label="Previous track"
                      className={cn(
                        'h-12 w-12 rounded-full border border-white/10 text-white transition-colors hover:border-white/30 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50',
                      )}
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      onClick={() => void togglePlay()}
                      aria-label={state.isPlaying ? 'Pause' : 'Play'}
                      className={cn(
                        'flex h-14 w-14 items-center justify-center rounded-full text-white transition-all duration-200',
                        state.isPlaying
                          ? 'bg-white text-black shadow-[0_0_32px_rgba(255,255,255,0.4)]'
                          : 'bg-white/10 hover:bg-white hover:text-black',
                      )}
                    >
                      {state.isPlaying
                        ? (
                            '❚❚'
                          )
                        : (
                            '►'
                          )}
                    </button>
                    <button
                      type="button"
                      onClick={next}
                      disabled={!hasNext}
                      aria-label="Next track"
                      className={cn(
                        'h-12 w-12 rounded-full border border-white/10 text-white transition-colors hover:border-white/30 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50',
                      )}
                    >
                      ›
                    </button>
                  </div>
                </div>

                <div className="flex h-full flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <h3 className="text-sm font-semibold text-white">Up next</h3>
                  <div className="flex-1 space-y-3 overflow-y-auto pr-2">
                    {state.queue.slice(state.activeIndex + 1).length === 0 && (
                      <p className="text-sm text-white/60">
                        Queue is empty after this track.
                      </p>
                    )}
                    {state.queue.slice(state.activeIndex + 1).map(track => (
                      <div
                        key={track.id}
                        className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/5 p-3 text-sm text-white/80"
                      >
                        {track.artworkUrl
                          ? (
                              <div className="relative h-10 w-10 overflow-hidden rounded-lg border border-white/10">
                                <Image
                                  src={track.artworkUrl}
                                  alt={track.title}
                                  fill
                                  sizes="40px"
                                  className="object-cover"
                                />
                              </div>
                            )
                          : (
                              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-xs text-white/60">
                                ♫
                              </div>
                            )}
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium text-white">
                            {track.title}
                          </p>
                          {track.author && (
                            <p className="truncate text-xs text-white/60">
                              {track.author}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
