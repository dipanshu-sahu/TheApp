import { Easing } from 'react-native-reanimated';

/**
 * Motion tokens - intentional and professional.
 *
 * Design language: subtle fades, smooth opacity/translation shifts, and crisp
 * micro-interactions on active states. NO bouncing / overshoot anywhere.
 * All springs below are critically- or over-damped (damping ratio >= 1), so
 * they settle smoothly without oscillation.
 */
export const durations = {
  instant: 110,
  fast: 170,
  base: 240,
  slow: 320,
  slower: 460,
} as const;

export const easings = {
  /** Material "standard" - the default for most transitions. */
  standard: Easing.bezier(0.4, 0, 0.2, 1),
  /** Enters: quick start, gentle settle. */
  decelerate: Easing.bezier(0.05, 0.7, 0.1, 1),
  /** Exits: gentle start, quick finish. */
  accelerate: Easing.bezier(0.3, 0, 0.8, 0.15),
  /** Emphasized easing for hero/primary transitions. */
  emphasized: Easing.bezier(0.2, 0, 0, 1),
} as const;

/**
 * Spring presets - all NON-bouncing (over-damped). Use for touch feedback and
 * layout reflows where a spring feels more natural than fixed-duration timing.
 */
export const springs = {
  /** Smooth settle for layout transitions. crit damping ~23.7 @ stiffness 140. */
  gentle: { damping: 26, stiffness: 140, mass: 1 },
  /** Slightly quicker settle for card/section reflows. */
  smooth: { damping: 30, stiffness: 200, mass: 1 },
  /** Crisp, immediate press feedback with zero overshoot. */
  press: { damping: 34, stiffness: 320, mass: 1 },
} as const;

/** Standard pressed-state scale for interactive surfaces. */
export const PRESS_SCALE = 0.97;
export const PRESS_SCALE_SUBTLE = 0.985;
