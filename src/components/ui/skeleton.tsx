'use client';

import type { HTMLAttributes } from 'react';

import { motion } from 'framer-motion';

import { useReducedMotion } from '@/hooks/useReducedMotion';

import { MOTION } from '@/libs/motion-config';
import { cn } from '@/libs/utils';

type SkeletonProps = {
  /**
   * Width of the skeleton (CSS value or className)
   */
  width?: string;
  /**
   * Height of the skeleton (CSS value or className)
   */
  height?: string;
  /**
   * Variant for different skeleton styles
   */
  variant?: 'default' | 'card' | 'text' | 'circle' | 'button';
} & HTMLAttributes<HTMLDivElement>;

/**
 * Skeleton loader component for loading states
 * Provides animated placeholder with pulse effect
 * Respects user's reduced motion preference
 *
 * @example
 * // Card skeleton
 * <Skeleton variant="card" className="h-48" />
 *
 * @example
 * // Text line skeleton
 * <Skeleton variant="text" className="w-32" />
 *
 * @example
 * // Avatar skeleton
 * <Skeleton variant="circle" className="size-12" />
 */
export function Skeleton({
  className,
  width,
  height,
  variant = 'default',
  ...props
}: SkeletonProps) {
  const reducedMotion = useReducedMotion();

  const variantStyles = {
    default: 'rounded-md',
    card: 'rounded-2xl',
    text: 'rounded h-4',
    circle: 'rounded-full',
    button: 'rounded-lg h-10',
  };

  return (
    <motion.div
      initial={reducedMotion ? undefined : { opacity: 0 }}
      animate={
        reducedMotion
          ? { opacity: 0.2 }
          : {
              opacity: [0.2, 0.4, 0.2],
            }
      }
      transition={
        reducedMotion
          ? { duration: 0 }
          : {
              duration: MOTION.duration.slower * 3, // 1.8s total
              repeat: Number.POSITIVE_INFINITY,
              ease: MOTION.easing.easeInOut,
            }
      }
      className={cn('bg-white/5', variantStyles[variant], className)}
      style={{
        width,
        height,
      }}
      role="status"
      aria-label="Loading..."
      {...(props as any)}
    />
  );
}

/**
 * Content card skeleton with image and text areas
 * Mimics the ContentGridCard component structure
 */
export function ContentCardSkeleton({ index = 0 }: { index?: number }) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0, y: 20 }}
      animate={reducedMotion ? false : { opacity: 1, y: 0 }}
      transition={
        reducedMotion
          ? { duration: 0 }
          : {
              duration: MOTION.duration.slow,
              delay: index * 0.05,
              ease: MOTION.easing.default,
            }
      }
      className="group relative overflow-hidden rounded-2xl"
    >
      {/* Image skeleton */}
      <Skeleton variant="card" className="aspect-video w-full" />

      {/* Content area */}
      <div className="space-y-3 p-6">
        {/* Badge skeleton */}
        <Skeleton variant="button" className="h-6 w-20" />

        {/* Title skeleton */}
        <Skeleton variant="text" className="h-6 w-3/4" />
        <Skeleton variant="text" className="h-6 w-1/2" />

        {/* Description skeleton */}
        <div className="space-y-2 pt-2">
          <Skeleton variant="text" className="w-full" />
          <Skeleton variant="text" className="w-5/6" />
          <Skeleton variant="text" className="w-4/6" />
        </div>

        {/* Meta info skeleton */}
        <div className="flex items-center gap-3 pt-4">
          <Skeleton variant="circle" className="size-8" />
          <Skeleton variant="text" className="h-4 w-24" />
        </div>
      </div>
    </motion.div>
  );
}

/**
 * Audio player skeleton for mini-player loading state
 */
export function AudioPlayerSkeleton() {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0, scale: 0.95 }}
      animate={reducedMotion ? false : { opacity: 1, scale: 1 }}
      transition={
        reducedMotion
          ? { duration: 0 }
          : {
              duration: MOTION.duration.normal,
              ease: MOTION.easing.default,
            }
      }
      className="bg-card flex items-center gap-3 rounded-xl border p-3"
    >
      {/* Waveform skeleton */}
      <Skeleton variant="default" className="h-12 w-24" />

      {/* Content area */}
      <div className="flex-1 space-y-2">
        <Skeleton variant="text" className="h-4 w-32" />
        <Skeleton variant="text" className="h-3 w-24" />
      </div>

      {/* Play button skeleton */}
      <Skeleton variant="circle" className="size-10" />
    </motion.div>
  );
}

/**
 * List item skeleton for loading lists
 */
export function ListItemSkeleton({ index = 0 }: { index?: number }) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0, x: -20 }}
      animate={reducedMotion ? false : { opacity: 1, x: 0 }}
      transition={
        reducedMotion
          ? { duration: 0 }
          : {
              duration: MOTION.duration.normal,
              delay: index * 0.05,
              ease: MOTION.easing.default,
            }
      }
      className="flex items-center gap-4 p-4"
    >
      <Skeleton variant="circle" className="size-12" />
      <div className="flex-1 space-y-2">
        <Skeleton variant="text" className="h-5 w-48" />
        <Skeleton variant="text" className="h-4 w-32" />
      </div>
    </motion.div>
  );
}
