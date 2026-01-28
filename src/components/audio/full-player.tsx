'use client';

import { AnimatePresence, motion, useDragControls } from 'framer-motion';
import { ChevronDown, Pause, Play, SkipBack, SkipForward } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { MOTION } from '@/libs/motion-config';

import { cn } from '@/libs/utils';
import { usePlayback } from './playback-provider';

/**
 * Full player sheet (~90vh) with queue display and extended controls
 * Supports swipe-down gesture to close
 */
export function FullPlayer() {
  const {
    uiMode,
    activeTrack,
    isPlaying,
    currentTimeSec,
    durationSec,
    isLoading,
    queue,
    activeIndex,
    playerEnabled,
    togglePlay,
    seek,
    closePlayer,
    next,
    prev,
  } = usePlayback();
  const reducedMotion = useReducedMotion();

  const progressBarRef = useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();
  // Use lazy initializer to check if we're on the client without useEffect
  const [mounted] = useState(() => typeof window !== 'undefined');
  const isOpen = uiMode === 'player';

  // Format time from seconds to MM:SS
  const formatTime = useCallback((seconds: number): string => {
    if (!seconds || !Number.isFinite(seconds)) {
      return '0:00';
    }
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Handle close - just close player, stay on current page
  const handleClose = useCallback(() => {
    closePlayer();
  }, [closePlayer]);

  // Handle drag end - close if dragged down enough
  const handleDragEnd = useCallback(
    (_: unknown, info: { offset: { y: number }; velocity: { y: number } }) => {
      const shouldClose = info.offset.y > 100 || info.velocity.y > 500;
      if (shouldClose) {
        handleClose();
      }
    },
    [handleClose],
  );

  // Handle seek via progress bar click
  const handleSeek = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!durationSec || !progressBarRef.current) {
        return;
      }

      const rect = progressBarRef.current.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      const newTime = percent * durationSec;
      seek(newTime);
    },
    [durationSec, seek],
  );

  // Handle seek via keyboard
  const handleSeekKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'ArrowLeft') {
        seek(Math.max(0, currentTimeSec - 5));
      } else if (e.key === 'ArrowRight') {
        seek(Math.min(durationSec ?? currentTimeSec, currentTimeSec + 5));
      } else if (e.key === 'Home') {
        seek(0);
      } else if (e.key === 'End') {
        seek(durationSec ?? currentTimeSec);
      }
    },
    [seek, currentTimeSec, durationSec],
  );

  // Get upcoming tracks (next 5 in queue)
  const upcomingTracks = queue.slice(activeIndex + 1, activeIndex + 6);

  const progress = durationSec ? (currentTimeSec / durationSec) * 100 : 0;

  // Don't render if player disabled or not open
  if (!playerEnabled || !isOpen || !mounted) {
    return null;
  }

  // Safety check for document.body
  if (typeof document === 'undefined' || !document.body) {
    return null;
  }

  const content = (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          {/* Backdrop - must be rendered first for proper z-index stacking */}
          <motion.div
            key="backdrop"
            initial={reducedMotion ? undefined : { opacity: 0 }}
            animate={reducedMotion ? undefined : { opacity: 1 }}
            exit={reducedMotion ? undefined : { opacity: 0 }}
            transition={
              reducedMotion
                ? { duration: 0 }
                : {
                    duration: MOTION.duration.normal,
                    ease: MOTION.easing.default,
                  }
            }
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={handleClose}
            onKeyDown={e => e.key === 'Escape' && handleClose()}
            role="button"
            tabIndex={0}
            aria-label="Close player"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 9998,
            }}
          />

          {/* Player sheet with swipe support */}
          <motion.div
            key="player-sheet"
            initial={reducedMotion ? undefined : { y: '100%' }}
            animate={reducedMotion ? undefined : { y: 0 }}
            exit={reducedMotion ? undefined : { y: '100%' }}
            transition={
              reducedMotion
                ? { duration: 0 }
                : {
                    type: 'spring',
                    damping: 30,
                    stiffness: 300,
                    mass: 0.8,
                  }
            }
            drag="y"
            dragControls={dragControls}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.5 }}
            onDragEnd={handleDragEnd}
            className="fixed inset-x-0 bottom-0 h-[90vh] overflow-hidden rounded-t-3xl border-t border-white/10 bg-[#0A0A0A] shadow-2xl"
            style={{ zIndex: 9999 }}
            role="dialog"
            aria-modal="true"
            aria-label={`Now Playing: ${activeTrack?.title ?? 'No track selected'}`}
          >
            {/* Drag handle */}
            <div
              className="flex h-6 cursor-grab items-center justify-center active:cursor-grabbing"
              onPointerDown={e => dragControls.start(e)}
              role="button"
              tabIndex={0}
              aria-label="Swipe down to close"
              onKeyDown={e => e.key === 'Escape' && handleClose()}
            >
              <div className="h-1 w-12 rounded-full bg-white/30" />
            </div>

            <div className="flex h-full flex-col">
              {/* Header with close button */}
              <div className="flex shrink-0 items-center justify-between border-b border-white/10 px-4 py-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-white/70 transition-colors hover:bg-white/5 hover:text-white"
                  aria-label="Close player"
                >
                  <ChevronDown className="h-5 w-5" />
                  <span className="text-sm">Close</span>
                </button>

                {activeTrack && (
                  <Link
                    href={activeTrack.contentUrl}
                    className="rounded-lg px-3 py-2 text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-white"
                  >
                    View Article
                  </Link>
                )}
              </div>

              {/* Main content */}
              <div className="flex flex-1 flex-col overflow-y-auto">
                {activeTrack
                  ? (
                      <>
                        {/* Track info section */}
                        <div className="flex flex-col items-center px-6 pt-8 pb-4">
                          {/* Album art */}
                          <div className="relative mb-6 h-48 w-48 overflow-hidden rounded-2xl bg-white/10 shadow-2xl sm:h-64 sm:w-64">
                            {activeTrack.imageUrl
                              ? (
                                  <Image
                                    src={activeTrack.imageUrl}
                                    alt={activeTrack.title}
                                    fill
                                    className="object-cover"
                                    sizes="256px"
                                    priority
                                  />
                                )
                              : (
                                  <div className="flex h-full w-full items-center justify-center text-6xl font-bold text-white/30">
                                    {activeTrack.title.charAt(0).toUpperCase()}
                                  </div>
                                )}
                          </div>

                          {/* Track title and category */}
                          <div className="w-full max-w-md text-center">
                            <h2 className="mb-2 line-clamp-2 text-xl font-bold text-white sm:text-2xl">
                              {activeTrack.title}
                            </h2>
                            <p className="text-sm text-white/60">
                              {activeTrack.category}
                            </p>
                          </div>
                        </div>

                        {/* Progress bar and time */}
                        <div className="px-6">
                          <div
                            ref={progressBarRef}
                            role="slider"
                            aria-label="Audio progress"
                            aria-valuemin={0}
                            aria-valuemax={durationSec ?? 0}
                            aria-valuenow={currentTimeSec}
                            aria-valuetext={`${formatTime(currentTimeSec)} of ${formatTime(durationSec ?? 0)}`}
                            tabIndex={0}
                            className="group h-2 w-full cursor-pointer overflow-hidden rounded-full bg-white/10"
                            onClick={handleSeek}
                            onKeyDown={handleSeekKeyDown}
                          >
                            <motion.div
                              className="h-full bg-linear-to-r from-blue-500 to-purple-500"
                              initial={reducedMotion ? undefined : { width: 0 }}
                              animate={reducedMotion ? undefined : { width: `${progress}%` }}
                              transition={reducedMotion ? { duration: 0 } : { duration: 0.1 }}
                            />
                          </div>
                          <div className="mt-2 flex justify-between text-sm text-white/60">
                            <span>{formatTime(currentTimeSec)}</span>
                            <span>{formatTime(durationSec ?? 0)}</span>
                          </div>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center justify-center gap-8 px-6 py-6">
                          {/* Previous */}
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={prev}
                            disabled={activeIndex === 0}
                            className={cn(
                              'p-3 rounded-full transition-colors',
                              activeIndex > 0
                                ? 'text-white/70 hover:text-white hover:bg-white/10'
                                : 'text-white/30 cursor-not-allowed',
                            )}
                            aria-label="Previous track"
                          >
                            <SkipBack className="h-6 w-6" />
                          </motion.button>

                          {/* Play/Pause */}
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={togglePlay}
                            disabled={isLoading}
                            className={cn(
                              'flex h-16 w-16 items-center justify-center rounded-full transition-[background-color,color,box-shadow,opacity] duration-200',
                              isPlaying
                                ? 'bg-white text-black shadow-[0_0_40px_rgba(255,255,255,0.4)]'
                                : 'bg-white/10 text-white hover:bg-white hover:text-black',
                              isLoading && 'opacity-50',
                            )}
                            aria-label={isPlaying ? 'Pause' : 'Play'}
                          >
                            {isPlaying
                              ? (
                                  <Pause className="h-7 w-7 fill-current" />
                                )
                              : (
                                  <Play className="ml-1 h-7 w-7 fill-current" />
                                )}
                          </motion.button>

                          {/* Next */}
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={next}
                            disabled={activeIndex >= queue.length - 1}
                            className={cn(
                              'p-3 rounded-full transition-colors',
                              activeIndex < queue.length - 1
                                ? 'text-white/70 hover:text-white hover:bg-white/10'
                                : 'text-white/30 cursor-not-allowed',
                            )}
                            aria-label="Next track"
                          >
                            <SkipForward className="h-6 w-6" />
                          </motion.button>
                        </div>

                        {/* Up Next Queue */}
                        {upcomingTracks.length > 0 && (
                          <div className="mt-auto border-t border-white/10 px-6 py-4">
                            <h3 className="mb-3 text-sm font-medium text-white/60">
                              Up Next
                            </h3>
                            <div className="space-y-2">
                              {upcomingTracks.map((track, index) => (
                                <div
                                  key={track.id}
                                  className="flex items-center gap-3 rounded-lg bg-white/5 p-2"
                                >
                                  <span className="w-5 text-center text-xs text-white/40">
                                    {index + 1}
                                  </span>
                                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded bg-white/10">
                                    {track.imageUrl
                                      ? (
                                          <Image
                                            src={track.imageUrl}
                                            alt={track.title}
                                            fill
                                            className="object-cover"
                                            sizes="40px"
                                          />
                                        )
                                      : (
                                          <div className="flex h-full w-full items-center justify-center text-sm font-bold text-white/30">
                                            {track.title.charAt(0).toUpperCase()}
                                          </div>
                                        )}
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm text-white">
                                      {track.title}
                                    </p>
                                    <p className="text-xs text-white/50">
                                      {track.category}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    )
                  : (
                      <div className="flex flex-1 items-center justify-center text-white/50">
                        No track selected
                      </div>
                    )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  // Render in portal to ensure it's above all other content
  return createPortal(content, document.body);
}
