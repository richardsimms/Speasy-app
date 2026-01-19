'use client';

import { motion, useScroll } from 'framer-motion';

/**
 * Scroll progress indicator using Framer Motion's useScroll hook
 * Provides frame-synced scroll tracking without manual event listeners
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();

  return (
    <div className="bg-secondary fixed top-0 left-0 z-50 h-1 w-full">
      <motion.div
        className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
        style={{
          scaleX: scrollYProgress,
          transformOrigin: '0%',
        }}
      />
    </div>
  );
}
