/**
 * Centralized motion design configuration
 * Provides consistent animation durations, easing curves, and viewport settings
 * across the entire application
 */

export const MOTION = {
  /**
   * Standard duration values in seconds
   * Use these instead of magic numbers for consistency
   */
  duration: {
    instant: 0.1,
    fast: 0.2,
    normal: 0.3,
    moderate: 0.4,
    slow: 0.5,
    slower: 0.6,
    slowest: 0.7,
  },

  /**
   * Easing curves (cubic-bezier values)
   * Default curve matches Apple's smooth spring-like motion
   */
  easing: {
    // Primary easing - smooth, organic feel (used throughout app)
    default: [0.16, 1, 0.3, 1] as const,
    // Alternative easings for specific use cases
    spring: [0.25, 0.46, 0.45, 0.94] as const,
    bounce: [0.68, -0.55, 0.265, 1.55] as const,
    easeInOut: [0.4, 0, 0.2, 1] as const,
    easeOut: [0, 0, 0.2, 1] as const,
  },

  /**
   * Standard viewport intersection settings for scroll animations
   * Use these with whileInView for consistent behavior
   */
  viewport: {
    once: true, // Animate only once when element comes into view
    margin: '-50px', // Trigger 50px before element enters viewport
  },

  /**
   * Common animation presets
   * Use these for consistent entry/exit animations
   */
  preset: {
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
    },
    slideUp: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
    },
    slideDown: {
      initial: { opacity: 0, y: -20 },
      animate: { opacity: 1, y: 0 },
    },
    scaleUp: {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
    },
  },

  /**
   * Interactive gesture scaling
   */
  gesture: {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
    tapSubtle: { scale: 0.98 },
  },
} as const;

/**
 * Helper to get animation props based on reduced motion preference
 * Returns empty object if user prefers reduced motion, otherwise returns normal props
 *
 * @param reducedMotion - Whether user prefers reduced motion
 * @param normalProps - Animation props to use when motion is enabled
 * @param reducedProps - Optional props to use when motion is reduced (defaults to {})
 * @returns Animation props object
 *
 * @example
 * const reducedMotion = useReducedMotion();
 * <motion.div
 *   {...getAnimationProps(reducedMotion, {
 *     initial: { opacity: 0, y: 20 },
 *     animate: { opacity: 1, y: 0 },
 *   })}
 * />
 */
export function getAnimationProps<T extends Record<string, any>>(
  reducedMotion: boolean,
  normalProps: T,
  reducedProps: Partial<T> = {},
): T | Partial<T> {
  return reducedMotion ? reducedProps : normalProps;
}

/**
 * Helper to create staggered animation delays
 * Useful for list/grid items entering in sequence
 *
 * @param index - Item index in list
 * @param baseDelay - Base delay increment between items (in seconds)
 * @returns Delay value in seconds
 *
 * @example
 * items.map((item, index) => (
 *   <motion.div
 *     key={item.id}
 *     transition={{ delay: getStaggerDelay(index, 0.05) }}
 *   />
 * ))
 */
export function getStaggerDelay(index: number, baseDelay = 0.05): number {
  return index * baseDelay;
}
