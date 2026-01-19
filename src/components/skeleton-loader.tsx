'use client';

import { motion } from 'framer-motion';

/**
 * Skeleton loader for content cards
 * Provides visual feedback during loading states
 */
export function SkeletonCard() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="overflow-hidden rounded-2xl border border-white/10 bg-[#0A0A0A]"
    >
      {/* Image skeleton */}
      <motion.div
        className="aspect-video w-full bg-white/5"
        animate={{
          backgroundColor: [
            'rgba(255,255,255,0.05)',
            'rgba(255,255,255,0.1)',
            'rgba(255,255,255,0.05)',
          ],
        }}
        transition={{
          duration: 1.5,
          repeat: Number.POSITIVE_INFINITY,
          ease: 'easeInOut',
        }}
      />

      {/* Content skeleton */}
      <div className="space-y-3 p-6">
        {/* Category badge skeleton */}
        <motion.div
          className="h-6 w-24 rounded-full bg-white/5"
          animate={{
            backgroundColor: [
              'rgba(255,255,255,0.05)',
              'rgba(255,255,255,0.1)',
              'rgba(255,255,255,0.05)',
            ],
          }}
          transition={{
            duration: 1.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: 'easeInOut',
            delay: 0.1,
          }}
        />

        {/* Title skeleton */}
        <motion.div
          className="h-8 w-full rounded bg-white/5"
          animate={{
            backgroundColor: [
              'rgba(255,255,255,0.05)',
              'rgba(255,255,255,0.1)',
              'rgba(255,255,255,0.05)',
            ],
          }}
          transition={{
            duration: 1.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: 'easeInOut',
            delay: 0.2,
          }}
        />
        <motion.div
          className="h-8 w-3/4 rounded bg-white/5"
          animate={{
            backgroundColor: [
              'rgba(255,255,255,0.05)',
              'rgba(255,255,255,0.1)',
              'rgba(255,255,255,0.05)',
            ],
          }}
          transition={{
            duration: 1.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: 'easeInOut',
            delay: 0.25,
          }}
        />

        {/* Summary skeleton */}
        <div className="space-y-2 pt-2">
          <motion.div
            className="h-4 w-full rounded bg-white/5"
            animate={{
              backgroundColor: [
                'rgba(255,255,255,0.05)',
                'rgba(255,255,255,0.1)',
                'rgba(255,255,255,0.05)',
              ],
            }}
            transition={{
              duration: 1.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
              delay: 0.3,
            }}
          />
          <motion.div
            className="h-4 w-5/6 rounded bg-white/5"
            animate={{
              backgroundColor: [
                'rgba(255,255,255,0.05)',
                'rgba(255,255,255,0.1)',
                'rgba(255,255,255,0.05)',
              ],
            }}
            transition={{
              duration: 1.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
              delay: 0.35,
            }}
          />
          <motion.div
            className="h-4 w-4/5 rounded bg-white/5"
            animate={{
              backgroundColor: [
                'rgba(255,255,255,0.05)',
                'rgba(255,255,255,0.1)',
                'rgba(255,255,255,0.05)',
              ],
            }}
            transition={{
              duration: 1.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
              delay: 0.4,
            }}
          />
        </div>
      </div>
    </motion.div>
  );
}

/**
 * Skeleton loader for list items
 */
export function SkeletonListItem() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex items-center gap-4 rounded-lg bg-white/5 p-4"
    >
      {/* Avatar skeleton */}
      <motion.div
        className="h-12 w-12 shrink-0 rounded-full bg-white/5"
        animate={{
          backgroundColor: [
            'rgba(255,255,255,0.05)',
            'rgba(255,255,255,0.1)',
            'rgba(255,255,255,0.05)',
          ],
        }}
        transition={{
          duration: 1.5,
          repeat: Number.POSITIVE_INFINITY,
          ease: 'easeInOut',
        }}
      />

      {/* Content skeleton */}
      <div className="flex-1 space-y-2">
        <motion.div
          className="h-4 w-3/4 rounded bg-white/5"
          animate={{
            backgroundColor: [
              'rgba(255,255,255,0.05)',
              'rgba(255,255,255,0.1)',
              'rgba(255,255,255,0.05)',
            ],
          }}
          transition={{
            duration: 1.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: 'easeInOut',
            delay: 0.1,
          }}
        />
        <motion.div
          className="h-3 w-1/2 rounded bg-white/5"
          animate={{
            backgroundColor: [
              'rgba(255,255,255,0.05)',
              'rgba(255,255,255,0.1)',
              'rgba(255,255,255,0.05)',
            ],
          }}
          transition={{
            duration: 1.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: 'easeInOut',
            delay: 0.2,
          }}
        />
      </div>
    </motion.div>
  );
}

/**
 * Grid of skeleton cards for loading states
 */
export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={`skeleton-${i}`} />
      ))}
    </div>
  );
}
