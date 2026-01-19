'use client';

import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Calendar,
  Clock,
  ExternalLink,
  Pause,
  Play,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useContentAnalytics } from '@/hooks/useContentAnalytics';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { MOTION } from '@/libs/motion-config';
import { cn } from '@/libs/utils';

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
  surface?: 'home' | 'dashboard';
  userId?: string;
  experimentVariant?: string;
};

export function ContentDetailView({
  content,
  locale,
  surface = 'home',
  userId,
  experimentVariant,
}: ContentDetailViewProps) {
  const reducedMotion = useReducedMotion();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(content.duration || 0);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const hasTrackedPlayStart = useRef(false);
  const { trackContentPlayStarted, trackContentPlayCompleted }
    = useContentAnalytics();

  // Format time from seconds to MM:SS
  const formatTime = (seconds: number): string => {
    if (!seconds || !Number.isFinite(seconds)) {
      return '0:00';
    }
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);

      // Track play completion
      trackContentPlayCompleted({
        user_id: userId,
        content_name: content.title,
        content_category: content.category,
        content_id: content.id,
        surface,
        experiment_variant: experimentVariant,
      });

      // Reset play start tracking for next playthrough
      hasTrackedPlayStart.current = false;
    };

    const handleLoadStart = () => {
      setIsLoading(true);
    };

    const handleCanPlay = () => {
      setIsLoading(false);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
    };
  }, [
    trackContentPlayCompleted,
    userId,
    content.id,
    content.title,
    content.category,
    surface,
    experimentVariant,
  ]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      try {
        await audio.play();
        setIsPlaying(true);

        // Track play start (only once per session)
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
      } catch {
        setIsPlaying(false);
      }
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration) {
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const skipTime = (seconds: number) => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    audio.currentTime = Math.max(
      0,
      Math.min(duration, audio.currentTime + seconds),
    );
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="min-h-screen ">
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
          initial={reducedMotion ? undefined : { opacity: 0, y: 20 }}
          animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
          transition={
            reducedMotion
              ? { duration: 0 }
              : { duration: MOTION.duration.slow, ease: MOTION.easing.default }
          }
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
                {content.sourceLink
                  ? (
                      <a
                        href={content.sourceLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${content.sourceName} (opens in new tab)`}
                        className="flex items-center gap-1 hover:text-white"
                      >
                        {content.sourceName}
                        <ExternalLink className="h-3 w-3" aria-hidden="true" />
                      </a>
                    )
                  : (
                      <span>{content.sourceName}</span>
                    )}
              </div>
            )}
          </div>
        </motion.div>

        {/* Image */}
        {content.imageUrl && (
          <motion.div
            initial={reducedMotion ? undefined : { opacity: 0, scale: 0.95 }}
            animate={reducedMotion ? undefined : { opacity: 1, scale: 1 }}
            transition={
              reducedMotion
                ? { duration: 0 }
                : { duration: MOTION.duration.slow, delay: 0.1, ease: MOTION.easing.default }
            }
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
            initial={reducedMotion ? undefined : { opacity: 0, y: 20 }}
            animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={
              reducedMotion
                ? { duration: 0 }
                : { duration: MOTION.duration.slow, delay: 0.2, ease: MOTION.easing.default }
            }
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
            initial={reducedMotion ? undefined : { opacity: 0, y: 20 }}
            animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={
              reducedMotion
                ? { duration: 0 }
                : { duration: MOTION.duration.slow, delay: 0.3, ease: MOTION.easing.default }
            }
            className="overflow-hidden"
          >
            <div
              className="content-body leading-relaxed [overflow-wrap:anywhere] break-words text-white/90"
              // eslint-disable-next-line react-dom/no-dangerously-set-innerhtml -- Content is from trusted database
              dangerouslySetInnerHTML={{ __html: content.content }}
            />
          </motion.div>
        )}

        {/* Transcript for audio accessibility */}
        {content.audioUrl && content.content && (
          <motion.details
            initial={reducedMotion ? undefined : { opacity: 0, y: 20 }}
            animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={
              reducedMotion
                ? { duration: 0 }
                : { duration: MOTION.duration.slow, delay: 0.35, ease: MOTION.easing.default }
            }
            className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6"
          >
            <summary className="cursor-pointer text-lg font-medium text-white hover:text-white/80">
              Audio Transcript
            </summary>
            <div
              className="content-body mt-4 leading-relaxed [overflow-wrap:anywhere] break-words text-white/70"
              // eslint-disable-next-line react-dom/no-dangerously-set-innerhtml -- Content is from trusted database
              dangerouslySetInnerHTML={{ __html: content.content }}
            />
          </motion.details>
        )}

        {/* Source link */}
        {content.sourceUrl && (
          <motion.div
            initial={reducedMotion ? undefined : { opacity: 0, y: 20 }}
            animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={
              reducedMotion
                ? { duration: 0 }
                : { duration: MOTION.duration.slow, delay: 0.4, ease: MOTION.easing.default }
            }
            className="mt-8"
          >
            <a
              href={content.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View original article (opens in new tab)"
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 transition-colors hover:border-white/20 hover:text-white"
            >
              <span>View original article</span>
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
          </motion.div>
        )}
      </div>

      {/* Fixed audio player at bottom */}
      {content.audioUrl && (
        <motion.div
          initial={reducedMotion ? undefined : { opacity: 0, y: 100 }}
          animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
          transition={
            reducedMotion
              ? { duration: 0 }
              : { duration: MOTION.duration.slow, delay: 0.5, ease: MOTION.easing.default }
          }
          className="fixed right-0 bottom-0 left-0 z-50 border-t border-white/10 bg-[#0A0A0A]/95 backdrop-blur-xl md:pl-64"
        >
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <audio ref={audioRef} src={content.audioUrl} preload="metadata" />

          <div className="mx-auto max-w-4xl px-4 py-4">

            {/* Controls */}
            <div className="flex items-center justify-between gap-4 align-middle">
              {/* Time */}
              <div className="flex items-center gap-2 font-mono text-sm text-white/70">
                <span>{formatTime(currentTime)}</span>
                <span>/</span>
                <span>{formatTime(duration)}</span>
              </div>
              {/* Progress bar */}
              <div
                role="slider"
                aria-label="Audio progress"
                aria-valuemin={0}
                aria-valuemax={duration}
                aria-valuenow={currentTime}
                aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}`}
                tabIndex={0}
                className="h-1 w-full cursor-pointer overflow-hidden rounded-full bg-white/10 align-middle"
                onClick={handleSeek}
                onKeyDown={(e) => {
                  const audio = audioRef.current;
                  if (!audio) {
                    return;
                  }

                  if (e.key === 'ArrowLeft') {
                    skipTime(-5);
                  } else if (e.key === 'ArrowRight') {
                    skipTime(5);
                  } else if (e.key === 'Home') {
                    audio.currentTime = 0;
                    setCurrentTime(0);
                  } else if (e.key === 'End') {
                    audio.currentTime = duration;
                    setCurrentTime(duration);
                  }
                }}
              >
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                  initial={reducedMotion ? undefined : { width: 0 }}
                  animate={reducedMotion ? undefined : { width: `${progress}%` }}
                  transition={reducedMotion ? { duration: 0 } : { duration: 0.1 }}
                />
              </div>
              {/* Playback controls */}
              <div className="flex items-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={togglePlay}
                  disabled={isLoading}
                  className={cn(
                    'flex h-11 w-11 items-center justify-center rounded-full transition-[background-color,color,box-shadow,opacity] duration-200',
                    isPlaying
                      ? 'bg-white text-black shadow-[0_0_30px_rgba(255,255,255,0.3)]'
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
                        <Play className="ml-1 h-4 w-4 fill-current" />
                      )}
                </motion.button>

              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
