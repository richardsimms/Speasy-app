'use client';

import { motion } from 'framer-motion';
import { Clock, Pause, Play, SkipBack, SkipForward } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { cn } from '@/libs/utils';

type ContentAudioCardProps = {
  id: string;
  title: string;
  summary?: string | null;
  audioUrl: string;
  imageUrl?: string | null;
  category: string;
  duration?: number | null;
  accentColor?: string;
  index?: number;
  isPlaying: boolean;
  onPlay: (id: string) => void;
  onPause: (id: string) => void;
  progress: number;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  isHovered?: boolean;
  onAudioRef?: (id: string, element: HTMLAudioElement | null) => void;
};

export function ContentAudioCard({
  id,
  title,
  summary,
  audioUrl,
  imageUrl,
  category,
  duration,
  accentColor = 'bg-blue-500',
  index = 0,
  isPlaying,
  onPlay,
  onPause,
  progress,
  onMouseEnter,
  onMouseLeave,
  isHovered = false,
  onAudioRef,
}: ContentAudioCardProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);

  // Format duration from seconds to MM:SS
  const formatDuration = (seconds: number | null | undefined): string => {
    if (!seconds) {
      return '0:00';
    }
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Audio visualization effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    const draw = () => {
      if (!ctx || !canvas) {
        return;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const bars = 40;
      const width = canvas.width / bars;
      const gap = 2;

      for (let i = 0; i < bars; i++) {
        // Dynamic height based on playing state and random noise
        let height = 4;
        if (isPlaying) {
          height = Math.random() * 24 + 4;
        } else if (isHovered) {
          height = Math.sin(Date.now() / 200 + i * 0.5) * 8 + 12;
        }

        // Color based on progress
        const progressPercent = progress || 0;
        const barPercent = (i / bars) * 100;

        ctx.fillStyle
          = barPercent <= progressPercent
            ? 'rgba(255, 255, 255, 0.9)'
            : 'rgba(255, 255, 255, 0.2)';

        const x = i * (width + gap);
        const y = (canvas.height - height) / 2;

        // Rounded rect manually
        ctx.beginPath();
        ctx.roundRect(x, y, width, height, 2);
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
  }, [isPlaying, isHovered, progress]);

  const togglePlay = () => {
    if (isPlaying) {
      onPause(id);
    } else {
      onPlay(id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0A0A0A] transition-all duration-500 hover:border-white/20"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* eslint-disable jsx-a11y/media-has-caption */}
      <audio
        ref={(el) => {
          audioRef.current = el;
          onAudioRef?.(id, el);
        }}
        src={audioUrl}
        preload="metadata"
      />
      {/* eslint-enable jsx-a11y/media-has-caption */}

      {/* Glowing accent line */}
      <div
        className={cn(
          'absolute top-0 left-0 w-full h-[1px] transition-opacity duration-500',
          accentColor,
          isPlaying
            ? 'opacity-100 shadow-[0_0_20px_rgba(255,255,255,0.5)]'
            : 'opacity-0 group-hover:opacity-50',
        )}
      />

      {/* Image if available */}
      {imageUrl && (
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/50 to-transparent" />
        </div>
      )}

      <div className="flex h-full flex-col p-8">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-2">
              <span className={cn('w-2 h-2 rounded-full', accentColor)} />
              <span className="text-muted-foreground font-mono text-xs tracking-wider uppercase">
                {category}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-white transition-all group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-white/70 group-hover:bg-clip-text group-hover:text-transparent">
              {title}
            </h3>
            {summary && (
              <p className="text-muted-foreground mt-2 line-clamp-2 text-sm">
                {summary}
              </p>
            )}
          </div>
          {duration && (
            <div className="text-muted-foreground ml-4 flex items-center gap-1 rounded bg-white/5 px-2 py-1 font-mono text-xs">
              <Clock className="h-3 w-3" />
              {formatDuration(duration)}
            </div>
          )}
        </div>

        {/* Visualization */}
        <div className="relative mb-8 h-12 w-full">
          <canvas
            ref={canvasRef}
            width={300}
            height={48}
            className="h-full w-full opacity-50 transition-opacity duration-500 group-hover:opacity-100"
          />
        </div>

        {/* Controls */}
        <div className="mt-auto space-y-6">
          <div className="flex items-center justify-between gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={togglePlay}
              className={cn(
                'w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300',
                isPlaying
                  ? 'bg-white text-black scale-110 shadow-[0_0_30px_rgba(255,255,255,0.3)]'
                  : 'bg-white/10 text-white hover:bg-white hover:text-black',
              )}
            >
              {isPlaying
                ? (
                    <Pause className="h-5 w-5 fill-current" />
                  )
                : (
                    <Play className="ml-0.5 h-5 w-5 fill-current" />
                  )}
            </motion.button>

            <div className="relative h-[1px] flex-1 overflow-hidden bg-white/10">
              <motion.div
                className="absolute inset-0 bg-white"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>

            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="text-muted-foreground p-2 transition-colors hover:text-white"
                onClick={() => {
                  if (audioRef.current) {
                    audioRef.current.currentTime = Math.max(
                      0,
                      audioRef.current.currentTime - 10,
                    );
                  }
                }}
              >
                <SkipBack className="h-4 w-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="text-muted-foreground p-2 transition-colors hover:text-white"
                onClick={() => {
                  if (audioRef.current) {
                    audioRef.current.currentTime = Math.min(
                      audioRef.current.duration,
                      audioRef.current.currentTime + 10,
                    );
                  }
                }}
              >
                <SkipForward className="h-4 w-4" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
