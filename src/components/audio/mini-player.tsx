'use client';

import { motion } from 'framer-motion';
import { Pause, Play } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSidebarOptional } from '@/components/sidebar-context';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { MOTION } from '@/libs/motion-config';
import { cn } from '@/libs/utils';
import { usePlayback } from './playback-provider';

/**
 * Mini player bar that appears at the bottom when a track is active
 * Clicking anywhere opens the full player
 */
export function MiniPlayer() {
  const {
    activeTrack,
    isPlaying,
    currentTimeSec,
    durationSec,
    isLoading,
    uiMode,
    playerEnabled,
    togglePlay,
    openPlayer,
  } = usePlayback();
  const reducedMotion = useReducedMotion();
  const sidebar = useSidebarOptional();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);

  // Format time from seconds to MM:SS
  const formatTime = useCallback((seconds: number): string => {
    if (!seconds || !Number.isFinite(seconds)) {
      return '0:00';
    }
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Audio visualization effect (only animates while playing)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    const drawFrame = () => {
      if (!ctx || !canvas) {
        return;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const bars = 30;
      const width = canvas.width / bars;
      const gap = 2;
      const progress = durationSec ? (currentTimeSec / durationSec) * 100 : 0;

      for (let i = 0; i < bars; i++) {
        const height = isPlaying ? Math.random() * 16 + 4 : 6;

        // Color based on progress
        const barPercent = (i / bars) * 100;
        ctx.fillStyle = barPercent <= progress
          ? 'rgba(255, 255, 255, 0.9)'
          : 'rgba(255, 255, 255, 0.2)';

        const x = i * (width + gap);
        const y = (canvas.height - height) / 2;

        ctx.beginPath();
        ctx.roundRect(x, y, width, height, 2);
        ctx.fill();
      }

      if (isPlaying) {
        animationFrameRef.current = requestAnimationFrame(drawFrame);
      }
    };

    drawFrame();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, currentTimeSec, durationSec]);

  const handlePlayButtonClick = useCallback(() => {
    togglePlay();
  }, [togglePlay]);

  const handleOpenPlayer = useCallback(() => {
    openPlayer();
  }, [openPlayer]);

  // Track if we're on desktop (md breakpoint = 768px)
  // Initialize with a function to avoid SSR mismatch, then sync via effect
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }
    return window.matchMedia('(min-width: 768px)').matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 768px)');
    // Only subscribe to changes, don't set initial value (already done in useState)
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Don't render if player disabled, no active track, or if full player is open
  if (!playerEnabled || !activeTrack || uiMode === 'player') {
    return null;
  }

  const progress = durationSec ? (currentTimeSec / durationSec) * 100 : 0;

  // Desktop left offset based on sidebar state: 78px closed, 190px open
  const isDesktopOpen = sidebar?.isDesktopOpen ?? false;
  const leftOffset = isDesktop ? (isDesktopOpen ? 190 : 78) : 0;

  return (
    <motion.div
      initial={reducedMotion ? undefined : { opacity: 0, y: 100 }}
      animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
      exit={reducedMotion ? undefined : { opacity: 0, y: 100 }}
      transition={
        reducedMotion
          ? { duration: 0 }
          : {
              duration: MOTION.duration.fast,
              ease: MOTION.easing.default,
            }
      }
      className="fixed right-0 bottom-0 z-40 border-t border-white/10 bg-[#0A0A0A]/95 backdrop-blur-xl transition-[left] duration-200 ease-out"
      style={{ left: leftOffset }}
    >
      {/* Progress bar at top */}
      <div
        className="absolute top-0 right-0 left-0 h-[1px] bg-white/10"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
        aria-label="Playback progress"
      >
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
          initial={reducedMotion ? undefined : { width: 0 }}
          animate={reducedMotion ? undefined : { width: `${progress}%` }}
          transition={reducedMotion ? { duration: 0 } : { duration: 0.1 }}
        />
      </div>

      <div className="flex w-full items-center gap-4 p-3">
        {/* Clickable area to open player */}
        <button
          type="button"
          onClick={handleOpenPlayer}
          className="flex min-w-0 flex-1 items-center gap-4 text-left hover:bg-white/5"
          aria-label="Open full player"
        >
          {/* Album art / Track image */}
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-white/10">
            {activeTrack.imageUrl
              ? (
                  <Image
                    src={activeTrack.imageUrl}
                    alt={activeTrack.title}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                )
              : (
                  <div className="flex h-full w-full items-center justify-center text-xl font-bold text-white/30">
                    {activeTrack.title.charAt(0).toUpperCase()}
                  </div>
                )}
          </div>

          {/* Track info */}
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-sm font-medium text-white">
              {activeTrack.title}
            </h3>
            <div className="flex items-center gap-2 text-xs text-white/60">
              <span className="truncate">{activeTrack.category}</span>
              <span>•</span>
              <span>
                {formatTime(currentTimeSec)}
                {' '}
                /
                {formatTime(durationSec ?? 0)}
              </span>
            </div>
          </div>
        </button>

        {/* Play/Pause button */}
        <motion.button
          type="button"
          whileHover={reducedMotion ? undefined : { scale: 1.05 }}
          whileTap={reducedMotion ? undefined : { scale: 0.95 }}
          onClick={handlePlayButtonClick}
          className={cn(
            'flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-[background-color,color,box-shadow,opacity] duration-200',
            isPlaying
              ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)]'
              : 'bg-white/10 text-white hover:bg-white hover:text-black',
            isLoading && 'opacity-50',
          )}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying
            ? (
                <Pause className="h-4 w-4 fill-current" />
              )
            : (
                <Play className="ml-0.5 h-4 w-4 fill-current" />
              )}
        </motion.button>
      </div>
    </motion.div>
  );
}
