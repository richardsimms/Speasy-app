'use client';

import type { ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { MOTION } from '@/libs/motion-config';

type PageTransitionProps = {
  children: ReactNode;
  /** Optional className to apply to the wrapper */
  className?: string;
};

/**
 * Page transition wrapper using AnimatePresence
 * Provides smooth transitions between route changes
 */
export function PageTransition({ children, className }: PageTransitionProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{
          duration: MOTION.duration.normal,
          ease: MOTION.easing.default,
        }}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

/**
 * Fade-only page transition (lighter alternative)
 */
export function PageTransitionFade({ children, className }: PageTransitionProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{
          duration: MOTION.duration.fast,
          ease: MOTION.easing.easeInOut,
        }}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

/**
 * Scale transition for modal-like pages
 */
export function PageTransitionScale({ children, className }: PageTransitionProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{
          duration: MOTION.duration.normal,
          ease: MOTION.easing.default,
        }}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
