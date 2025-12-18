"use client";

import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Clock,
  ExternalLink,
  Pause,
  Play,
  SkipBack,
  SkipForward,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef } from "react";
import { usePlaybackOptional } from "@/components/audio/playback-provider";
import { useContentAnalytics } from "@/hooks/useContentAnalytics";
import { cn } from "@/libs/utils";

import type { Track } from "@/types/audio";

type ContentDetailViewProps = {
  content: {
    id: string;
    title: string;
    summary: string | null;
    content: string | null;
    imageUrl: string | null;
    category: string;
    audioUrl: string | null;
    duration: number | null;
    sourceUrl: string | null;
    sourceName: string | null;
    sourceLink: string | null;
    createdAt: string;
  };
  locale: string;
  surface?: "home" | "dashboard";
  userId?: string;
  experimentVariant?: string;
};

export function ContentDetailView({
  content,
  locale,
  surface = "home",
  userId,
  experimentVariant,
}: ContentDetailViewProps) {
  const playback = usePlaybackOptional();
  const { trackContentPlayStarted, trackContentPlayCompleted } =
    useContentAnalytics();
  const hasTrackedPlayStart = useRef(false);

  // Check if this content is currently playing
  const isCurrentTrack = playback?.activeTrack?.id === content.id;
  const isPlaying = isCurrentTrack && playback?.isPlaying;
  const isLoading = isCurrentTrack && playback?.isLoading;
  const currentTime = isCurrentTrack ? (playback?.currentTimeSec ?? 0) : 0;
  const duration = isCurrentTrack
    ? (playback?.durationSec ?? content.duration ?? 0)
    : (content.duration ?? 0);

  // Format time from seconds to MM:SS
  const formatTime = (seconds: number): string => {
    if (!seconds || !Number.isFinite(seconds)) {
      return "0:00";
    }
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Create track object for this content
  const createTrack = useCallback(
    (): Track => ({
      id: content.id,
      title: content.title,
      audioUrl: content.audioUrl!,
      imageUrl: content.imageUrl ?? undefined,
      category: content.category,
      duration: content.duration ?? undefined,
      publishedAt: content.createdAt,
      contentUrl: `/${locale}/content/${content.id}`,
    }),
    [content, locale],
  );

  // Toggle play/pause
  const togglePlay = useCallback(() => {
    if (!playback || !content.audioUrl) return;

    if (isCurrentTrack) {
      // Toggle play/pause for current track
      playback.togglePlay();
    } else {
      // Start playing this track (single track, no queue context)
      const track = createTrack();
      playback.playTrack(content.id, undefined, [track]);

      // Track analytics
      if (!hasTrackedPlayStart.current) {
        trackContentPlayStarted({
          user_id: userId,
          content_name: content.title,
          content_category: content.category,
          content_id: content.id,
          surface,
          experiment_variant: experimentVariant,
        });
        hasTrackedPlayStart.current = true;
      }
    }
  }, [
    playback,
    content,
    isCurrentTrack,
    createTrack,
    trackContentPlayStarted,
    userId,
    surface,
    experimentVariant,
  ]);

  // Handle seek
  const handleSeek = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!playback || !isCurrentTrack || !duration) return;

      const rect = e.currentTarget.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      const newTime = percent * duration;
      playback.seek(newTime);
    },
    [playback, isCurrentTrack, duration],
  );

  // Skip time
  const skipTime = useCallback(
    (seconds: number) => {
      if (!playback || !isCurrentTrack) return;
      const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
      playback.seek(newTime);
    },
    [playback, isCurrentTrack, currentTime, duration],
  );

  // Track completion (reset tracking on component mount)
  useEffect(() => {
    hasTrackedPlayStart.current = false;
  }, [content.id]);

  // Track completion when track ends
  useEffect(() => {
    if (
      isCurrentTrack &&
      !isPlaying &&
      currentTime === 0 &&
      hasTrackedPlayStart.current
    ) {
      trackContentPlayCompleted({
        user_id: userId,
        content_name: content.title,
        content_category: content.category,
        content_id: content.id,
        surface,
        experiment_variant: experimentVariant,
      });
      hasTrackedPlayStart.current = false;
    }
  }, [
    isCurrentTrack,
    isPlaying,
    currentTime,
    trackContentPlayCompleted,
    userId,
    content,
    surface,
    experimentVariant,
  ]);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Back button */}
      <div className="mx-auto max-w-4xl px-4 py-6">
        <Link
          href={`/${locale}`}
          className="inline-flex items-center gap-2 text-white/70 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Discover</span>
        </Link>
      </div>

      {/* Main content */}
      <div className="mx-auto max-w-4xl px-4 pb-32">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          {/* Title */}
          <h1 className="mb-4 font-serif text-2xl leading-tight text-white md:text-4xl">
            {content.title}
          </h1>

          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-white/60">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(content.createdAt)}</span>
            </div>
            {content.duration && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{formatTime(content.duration)}</span>
              </div>
            )}
            {content.sourceName && (
              <div className="flex items-center gap-2">
                <span>•</span>
                {content.sourceLink ? (
                  <a
                    href={content.sourceLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:text-white"
                  >
                    {content.sourceName}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                ) : (
                  <span>{content.sourceName}</span>
                )}
              </div>
            )}
          </div>
        </motion.div>

        {/* Image */}
        {content.imageUrl && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8 overflow-hidden rounded-2xl"
          >
            <div className="relative aspect-[16/9] w-full">
              <Image
                src={content.imageUrl}
                alt={content.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 896px"
              />
            </div>
          </motion.div>
        )}

        {/* Summary */}
        {content.summary && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-6"
          >
            <p className="text-lg leading-relaxed text-white/80">
              {content.summary}
            </p>
          </motion.div>
        )}

        {/* Content */}
        {content.content && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="prose prose-invert prose-lg max-w-none"
          >
            <div
              className="leading-relaxed text-white/90"
              // eslint-disable-next-line react-dom/no-dangerously-set-innerhtml -- Content is from trusted database
              dangerouslySetInnerHTML={{ __html: content.content }}
            />
          </motion.div>
        )}

        {/* Source link */}
        {content.sourceUrl && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-8"
          >
            <a
              href={content.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 transition-colors hover:border-white/20 hover:text-white"
            >
              <span>View original article</span>
              <ExternalLink className="h-4 w-4" />
            </a>
          </motion.div>
        )}
      </div>

      {/* Fixed audio player at bottom - only show if on this track OR if there's no global player showing */}
      {content.audioUrl && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className={cn(
            "fixed right-0 bottom-0 left-0 border-t border-white/10 bg-[#0A0A0A]/95 backdrop-blur-xl md:ml-64",
            // Hide if mini player is showing a different track
            playback?.activeTrack &&
              !isCurrentTrack &&
              playback.uiMode === "inline" &&
              "hidden",
          )}
        >
          <div className="mx-auto max-w-4xl px-4 py-4">
            {/* Progress bar */}
            <div
              role="slider"
              aria-label="Audio progress"
              aria-valuemin={0}
              aria-valuemax={duration}
              aria-valuenow={currentTime}
              tabIndex={0}
              className="mb-4 h-1 w-full cursor-pointer overflow-hidden rounded-full bg-white/10"
              onClick={handleSeek}
              onKeyDown={(e) => {
                if (e.key === "ArrowLeft") {
                  skipTime(-5);
                } else if (e.key === "ArrowRight") {
                  skipTime(5);
                }
              }}
            >
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between gap-4">
              {/* Time */}
              <div className="flex items-center gap-2 font-mono text-sm text-white/70">
                <span>{formatTime(currentTime)}</span>
                <span>/</span>
                <span>{formatTime(duration)}</span>
              </div>

              {/* Playback controls */}
              <div className="flex items-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => skipTime(-10)}
                  className="text-white/70 transition-colors hover:text-white"
                  aria-label="Skip back 10 seconds"
                >
                  <SkipBack className="h-5 w-5" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={togglePlay}
                  disabled={isLoading}
                  className={cn(
                    "flex h-14 w-14 items-center justify-center rounded-full transition-all",
                    isPlaying
                      ? "bg-white text-black shadow-[0_0_30px_rgba(255,255,255,0.3)]"
                      : "bg-white/10 text-white hover:bg-white hover:text-black",
                    isLoading && "opacity-50",
                  )}
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? (
                    <Pause className="h-6 w-6 fill-current" />
                  ) : (
                    <Play className="ml-1 h-6 w-6 fill-current" />
                  )}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => skipTime(10)}
                  className="text-white/70 transition-colors hover:text-white"
                  aria-label="Skip forward 10 seconds"
                >
                  <SkipForward className="h-5 w-5" />
                </motion.button>
              </div>

              {/* Spacer for layout balance */}
              <div className="w-8 md:block md:w-24" aria-hidden="true"></div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
