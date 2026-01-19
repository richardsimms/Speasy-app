'use client';

import { useEffect, useState } from 'react';

/**
 * Custom hook to detect user's motion preferences
 * Respects the `prefers-reduced-motion` media query for accessibility
 *
 * @returns boolean - true if user prefers reduced motion
 *
 * @example
 * ```tsx
 * const reducedMotion = useReducedMotion();
 *
 * <motion.div
 *   initial={reducedMotion ? false : { opacity: 0, y: 20 }}
 *   animate={reducedMotion ? false : { opacity: 1, y: 0 }}
 * />
 * ```
 */
export function useReducedMotion(): boolean {
  // Use lazy initializer to check preference on mount without useEffect
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    // Safe check for window object (SSR compatibility)
    if (typeof window === 'undefined') {
      return false;
    }
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    // Listen for changes to user's motion preferences
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    // Modern browsers
    mediaQuery.addEventListener('change', handleChange);

    // Cleanup
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return prefersReducedMotion;
}

/**
 * Helper function to get animation props based on reduced motion preference
 * Simplifies conditional animation prop logic
 *
 * @param reducedMotion - boolean from useReducedMotion hook
 * @param normalProps - animation props for normal motion
 * @param reducedProps - animation props for reduced motion (defaults to false)
 * @returns animation props object
 *
 * @example
 * ```tsx
 * const reducedMotion = useReducedMotion();
 *
 * <motion.div
 *   {...getAnimationProps(
 *     reducedMotion,
 *     { initial: { opacity: 0 }, animate: { opacity: 1 } },
 *     { initial: false, animate: false }
 *   )}
 * />
 * ```
 */
export function getAnimationProps<T extends Record<string, unknown>>(
  reducedMotion: boolean,
  normalProps: T,
  reducedProps: Partial<T> = {},
): T | Partial<T> {
  if (reducedMotion) {
    // Return reduced motion props or false to disable animations
    return Object.keys(normalProps).length > 0
      ? (reducedProps as Partial<T>)
      : ({} as T);
  }
  return normalProps;
}

/**
 * Helper function to conditionally disable Framer Motion animations
 * Returns false for all animation props if reduced motion is preferred
 *
 * @param reducedMotion - boolean from useReducedMotion hook
 * @param props - animation props object
 * @returns animation props or false if reduced motion is preferred
 *
 * @example
 * ```tsx
 * const reducedMotion = useReducedMotion();
 *
 * <motion.div
 *   initial={disableAnimation(reducedMotion, { opacity: 0, y: 20 })}
 *   animate={disableAnimation(reducedMotion, { opacity: 1, y: 0 })}
 * />
 * ```
 */
export function disableAnimation<T>(
  reducedMotion: boolean,
  props: T,
): T | false {
  return reducedMotion ? false : props;
}
