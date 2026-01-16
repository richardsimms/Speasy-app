'use client';

import { motion, useScroll } from 'framer-motion';

/**
 * Scroll progress indicator component
 * Uses Framer Motion's useScroll for frame-synced, performant scroll tracking
 * Displays a horizontal progress bar at top of page showing scroll position
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();

  return (
    <div className="bg-secondary fixed top-0 left-0 z-50 h-1 w-full">
      <motion.div
        className="bg-primary h-full"
        style={{
          scaleX: scrollYProgress,
          transformOrigin: '0%',
        }}
      />
    </div>
  );
}
