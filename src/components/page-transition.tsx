'use client';

import type { ReactNode } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

import { useReducedMotion } from '@/hooks/useReducedMotion';
import { MOTION } from '@/libs/motion-config';

type PageTransitionProps = {
  children: ReactNode;
  /**
   * Animation variant
   * - fade: Simple fade in/out
   * - slide: Slide up on enter, slide down on exit
   * - scale: Scale and fade
   */
  variant?: 'fade' | 'slide' | 'scale';
};

/**
 * Page transition wrapper component
 * Adds smooth animations between route changes in Next.js App Router
 * Uses AnimatePresence to animate page exits
 * Respects user's reduced motion preference
 *
 * @example
 * // In layout.tsx
 * export default function Layout({ children }) {
 *   return (
 *     <PageTransition variant="slide">
 *       {children}
 *     </PageTransition>
 *   );
 * }
 */
export function PageTransition({
  children,
  variant = 'slide',
}: PageTransitionProps) {
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();

  const variants = {
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    },
    slide: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
    },
    scale: {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.95 },
    },
  };

  const selectedVariant = variants[variant];

  if (reducedMotion) {
    return <div>{children}</div>;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={selectedVariant.initial}
        animate={selectedVariant.animate}
        exit={selectedVariant.exit}
        transition={{
          duration: MOTION.duration.normal,
          ease: MOTION.easing.default,
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
