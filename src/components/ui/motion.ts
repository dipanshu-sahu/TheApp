import {
  FadeIn,
  FadeInDown,
  FadeOut,
  LinearTransition,
} from 'react-native-reanimated';
import { durations, easings } from '../../themes/motion';

/**
 * Preconfigured entering/exiting/layout animations.
 *
 * Motion philosophy: intentional and restrained. Entrances are a gentle fade
 * combined with a small upward drift, driven by fixed-duration timing with a
 * decelerate curve - never a springy/bouncy overshoot. Layout reflows use an
 * over-damped spring so they settle smoothly.
 */

export const fadeIn = FadeIn.duration(durations.base).easing(easings.standard);
export const fadeOut = FadeOut.duration(durations.fast).easing(easings.accelerate);

/** Fade + subtle rise. Pass a stagger index for sequenced list/section entrances. */
export const enterUp = (index = 0, step = 45) =>
  FadeInDown.duration(durations.base)
    .delay(index * step)
    .easing(easings.decelerate);

/** Alias kept for API compatibility - same restrained fade/drift, no bounce. */
export const enterDown = (index = 0, step = 45) =>
  FadeInDown.duration(durations.base)
    .delay(index * step)
    .easing(easings.decelerate);

/** Plain fade for content that should not translate (e.g. hero art). */
export const enterFade = (index = 0, step = 45) =>
  FadeIn.duration(durations.slow)
    .delay(index * step)
    .easing(easings.standard);

/** Smooth, non-bouncing layout transition for reflowing lists/cards. */
export const layoutSpring = LinearTransition.duration(durations.base).easing(easings.standard);
