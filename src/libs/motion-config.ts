/**
 * Centralized motion configuration for consistent animations across the app
 * Uses values derived from existing animation patterns in the codebase
 */

/**
 * Standard animation durations in seconds
 */
export const DURATION = {
  instant: 0.1,
  fast: 0.2,
  normal: 0.3,
  moderate: 0.4,
  slow: 0.5,
  slower: 0.6,
  slowest: 0.7,
} as const;

/**
 * Easing curves for different animation types
 */
export const EASING = {
  /** Default easing - smooth, organic feel (Apple-style) */
  default: [0.16, 1, 0.3, 1] as const,
  /** Spring easing - bouncy, energetic */
  spring: [0.25, 0.46, 0.45, 0.94] as const,
  /** Bounce easing - playful, exaggerated */
  bounce: [0.68, -0.55, 0.265, 1.55] as const,
  /** Linear - constant speed */
  linear: [0, 0, 1, 1] as const,
  /** Ease in out - smooth acceleration and deceleration */
  easeInOut: [0.45, 0, 0.55, 1] as const,
} as const;

/**
 * Viewport configuration for scroll-triggered animations
 */
export const VIEWPORT = {
  /** Animation triggers once, doesn't repeat */
  once: true,
  /** Margin before element enters viewport to trigger animation */
  margin: '-50px',
} as const;

/**
 * Common animation variants
 */
export const VARIANTS = {
  /** Fade in from transparent to opaque */
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  /** Slide up with fade */
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
  /** Slide down with fade */
  slideDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  },
  /** Scale in */
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  },
  /** Slide from left */
  slideLeft: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  },
  /** Slide from right */
  slideRight: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  },
} as const;

/**
 * Interactive animation props
 */
export const INTERACTIONS = {
  /** Hover scale up */
  hoverScale: {
    whileHover: { scale: 1.05 },
    transition: { duration: DURATION.fast },
  },
  /** Tap scale down */
  tapScale: {
    whileTap: { scale: 0.95 },
    transition: { duration: DURATION.instant },
  },
  /** Combined hover and tap */
  interactive: {
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.95 },
  },
  /** Subtle tap for buttons */
  buttonTap: {
    whileTap: { scale: 0.98 },
    transition: { duration: DURATION.instant },
  },
} as const;

/**
 * Stagger animation configuration
 */
export const STAGGER = {
  /** Fast stagger for cards */
  cards: 0.05,
  /** Medium stagger for list items */
  list: 0.1,
  /** Slow stagger for sections */
  sections: 0.08,
} as const;

/**
 * Helper function to create a standard transition
 */
export function createTransition({
  duration = DURATION.normal,
  ease = EASING.default,
  delay = 0,
}: {
  duration?: number;
  ease?: readonly number[];
  delay?: number;
} = {}) {
  return {
    duration,
    ease,
    delay,
  };
}

/**
 * Helper function to create a staggered animation based on index
 */
export function createStaggeredAnimation(
  index: number,
  staggerAmount = STAGGER.cards,
) {
  return {
    ...VARIANTS.slideUp,
    transition: createTransition({
      duration: DURATION.slow,
      ease: EASING.default,
      delay: index * staggerAmount,
    }),
  };
}

/**
 * Motion configuration object combining all settings
 */
export const MOTION = {
  duration: DURATION,
  easing: EASING,
  viewport: VIEWPORT,
  variants: VARIANTS,
  interactions: INTERACTIONS,
  stagger: STAGGER,
  createTransition,
  createStaggeredAnimation,
} as const;
