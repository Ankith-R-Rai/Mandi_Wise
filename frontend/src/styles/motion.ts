/**
 * MandiWise Motion Foundation
 * Configured using motion/react with spring dynamics and reduced-motion fallback.
 */

import type { Variants, Transition } from 'motion/react';

// Spring curve for snappy button clicks, tabs, and toggles
export const springTransition: Transition = {
  type: 'spring',
  stiffness: 400,
  damping: 30,
};

// Smooth cubic bezier easing for entrance reveals
export const smoothEase: Transition = {
  duration: 0.5,
  ease: [0.16, 1, 0.3, 1], // Custom Apple-style ease-out
};

// Stagger container for card grids and list items
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

// Fade up animation for cards and section headings
export const fadeUpVariant: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

// Modal and dialog scale-in variant
export const modalScaleVariant: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 8 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 350,
      damping: 25,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 8,
    transition: { duration: 0.15 },
  },
};

// Environmental drifting leaf particle variant for hero illustration
export const leafFloatVariants = (startX: number, deltaX: number, duration: number, delay: number): Variants => ({
  animate: {
    x: [startX, startX + deltaX, startX - deltaX / 2, startX + deltaX],
    y: [0, 60, 130, 200],
    rotate: [0, 45, 90, 180],
    opacity: [0, 0.9, 0.8, 0],
    transition: {
      duration,
      delay,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
});
