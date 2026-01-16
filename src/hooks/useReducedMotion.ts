'use client';

import { useEffect, useState } from 'react';

/**
 * Hook to detect if user prefers reduced motion (WCAG 2.1 compliance)
 * Listens to prefers-reduced-motion media query and returns boolean
 *
 * @returns {boolean} True if user prefers reduced motion
 *
 * @example
 * const reducedMotion = useReducedMotion();
 * <motion.div
 *   initial={reducedMotion ? false : { opacity: 0, y: 20 }}
 *   animate={reducedMotion ? false : { opacity: 1, y: 0 }}
 * />
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    // Initialize with media query value on mount
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const listener = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', listener);
    return () => {
      mediaQuery.removeEventListener('change', listener);
    };
  }, []);

  return prefersReducedMotion;
}
