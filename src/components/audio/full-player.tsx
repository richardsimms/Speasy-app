"use client";

import { motion } from "framer-motion";
import { ChevronDown, Pause, Play, SkipBack, SkipForward } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";

import { cn } from "@/libs/utils";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";
import { usePlayback } from "./playback-provider";

/**
 * Full player sheet (~90vh) with queue display and extended controls
 */
export function FullPlayer() {
  const router = useRouter();
  const {
    uiMode,
    activeTrack,
    isPlaying,
    currentTimeSec,
    durationSec,
    isLoading,
    queue,
    activeIndex,
    queueEnabled,
    selectedCategoryId,
    togglePlay,
    seek,
    closePlayer,
    next,
    prev,
  } = usePlayback();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const isOpen = uiMode === "player";

  // Format time from seconds to MM:SS
  const formatTime = useCallback((seconds: number): string => {
    if (!seconds || !Number.isFinite(seconds)) {
      return "0:00";
    }
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }, []);

  // Handle close - navigate home with category persistence
  const handleClose = useCallback(() => {
    closePlayer();
    // Navigate home with selected category
    const categoryParam = selectedCategoryId
      ? `?category=${selectedCategoryId}`
      : "";
    router.push(`/${categoryParam}`);
  }, [closePlayer, router, selectedCategoryId]);

  // Audio visualization effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isOpen) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const bars = 60;
      const width = canvas.width / bars;
      const gap = 2;
      const progress = durationSec ? (currentTimeSec / durationSec) * 100 : 0;

      for (let i = 0; i < bars; i++) {
        // Dynamic height based on playing state
        let height = 6;
        if (isPlaying) {
          height = Math.random() * 40 + 8;
        }

        // Color based on progress
        const barPercent = (i / bars) * 100;
        ctx.fillStyle =
          barPercent <= progress
            ? "rgba(255, 255, 255, 0.9)"
            : "rgba(255, 255, 255, 0.2)";

        const x = i * (width + gap);
        const y = (canvas.height - height) / 2;

        ctx.beginPath();
        ctx.roundRect(x, y, width, height, 3);
        ctx.fill();
      }

      animationFrameRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, currentTimeSec, durationSec, isOpen]);

  // Handle seek via progress bar click
  const handleSeek = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!durationSec || !progressBarRef.current) return;

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
      if (e.key === "ArrowLeft") {
        seek(Math.max(0, currentTimeSec - 5));
      } else if (e.key === "ArrowRight") {
        seek(Math.min(durationSec ?? currentTimeSec, currentTimeSec + 5));
      }
    },
    [seek, currentTimeSec, durationSec],
  );

  // Get upcoming tracks (next 5 in queue)
  const upcomingTracks = queue.slice(activeIndex + 1, activeIndex + 6);

  const progress = durationSec ? (currentTimeSec / durationSec) * 100 : 0;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <SheetContent
        side="bottom"
        className="h-[90vh] overflow-hidden p-0"
        hideCloseButton
      >
        {/* Visually hidden title for accessibility */}
        <SheetTitle className="sr-only">
          Now Playing: {activeTrack?.title ?? "No track selected"}
        </SheetTitle>
        <SheetDescription className="sr-only">
          Full audio player with playback controls and queue
        </SheetDescription>

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
            {activeTrack ? (
              <>
                {/* Track info section */}
                <div className="flex flex-col items-center px-6 pt-8 pb-4">
                  {/* Album art */}
                  <div className="relative mb-6 h-48 w-48 overflow-hidden rounded-2xl bg-white/10 shadow-2xl sm:h-64 sm:w-64">
                    {activeTrack.imageUrl ? (
                      <Image
                        src={activeTrack.imageUrl}
                        alt={activeTrack.title}
                        fill
                        className="object-cover"
                        sizes="256px"
                        priority
                      />
                    ) : (
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

                {/* Waveform visualization */}
                <div className="px-6 py-4">
                  <canvas
                    ref={canvasRef}
                    width={600}
                    height={60}
                    className="h-12 w-full opacity-80"
                  />
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
                    tabIndex={0}
                    className="group h-2 w-full cursor-pointer overflow-hidden rounded-full bg-white/10"
                    onClick={handleSeek}
                    onKeyDown={handleSeekKeyDown}
                  >
                    <motion.div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.1 }}
                    />
                  </div>
                  <div className="mt-2 flex justify-between text-xs text-white/60">
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
                    disabled={!queueEnabled || activeIndex === 0}
                    className={cn(
                      "p-3 rounded-full transition-colors",
                      queueEnabled && activeIndex > 0
                        ? "text-white/70 hover:text-white hover:bg-white/10"
                        : "text-white/30 cursor-not-allowed",
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
                      "flex h-16 w-16 items-center justify-center rounded-full transition-all",
                      isPlaying
                        ? "bg-white text-black shadow-[0_0_40px_rgba(255,255,255,0.4)]"
                        : "bg-white/10 text-white hover:bg-white hover:text-black",
                      isLoading && "opacity-50",
                    )}
                    aria-label={isPlaying ? "Pause" : "Play"}
                  >
                    {isPlaying ? (
                      <Pause className="h-7 w-7 fill-current" />
                    ) : (
                      <Play className="ml-1 h-7 w-7 fill-current" />
                    )}
                  </motion.button>

                  {/* Next */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={next}
                    disabled={!queueEnabled || activeIndex >= queue.length - 1}
                    className={cn(
                      "p-3 rounded-full transition-colors",
                      queueEnabled && activeIndex < queue.length - 1
                        ? "text-white/70 hover:text-white hover:bg-white/10"
                        : "text-white/30 cursor-not-allowed",
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
                            {track.imageUrl ? (
                              <Image
                                src={track.imageUrl}
                                alt={track.title}
                                fill
                                className="object-cover"
                                sizes="40px"
                              />
                            ) : (
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
            ) : (
              <div className="flex flex-1 items-center justify-center text-white/50">
                No track selected
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
