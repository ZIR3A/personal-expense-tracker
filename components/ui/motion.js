'use client';

import { useEffect, useState } from 'react';

export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (event) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
}

export const motionConfig = {
  transition: {
    type: 'spring',
    stiffness: 260,
    damping: 20,
  },
};

export function getMotionVariants(intense = false) {
  return {
    initial: { opacity: 0, y: intense ? 30 : 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: intense ? -20 : -10 },
  };
}

export function getPageTransition(isReducedMotion) {
  if (isReducedMotion) {
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    };
  }
  return {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };
}

export function getStaggerDelay(index, baseDelay = 0.05) {
  return {
    delay: index * baseDelay,
    ease: 'easeOut',
    duration: 0.4,
  };
}