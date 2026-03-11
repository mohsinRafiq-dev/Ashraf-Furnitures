import { useState, useEffect } from 'react';

/**
 * Hook to detect if animations should be disabled
 * Returns true on mobile devices or when user prefers reduced motion
 * Optimized for performance on low-end devices
 */
export function useReducedMotion(): boolean {
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);

  useEffect(() => {
    // Check if user prefers reduced motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    // Check if device is mobile (width <= 768px)
    const isMobile = window.innerWidth <= 768;
    
    // Disable animations on mobile or if user prefers reduced motion
    setShouldReduceMotion(isMobile || mediaQuery.matches);

    // Listen for changes in user preference
    const handleChange = () => {
      const isMobileNow = window.innerWidth <= 768;
      setShouldReduceMotion(isMobileNow || mediaQuery.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    window.addEventListener('resize', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
      window.removeEventListener('resize', handleChange);
    };
  }, []);

  return shouldReduceMotion;
}

/**
 * Hook to detect mobile device
 * Optimized for performance
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
}

/**
 * Get animation variant based on reduced motion preference
 * Returns static variant if animations should be disabled
 */
export function getAnimationVariant<T>(
  shouldReduceMotion: boolean,
  animatedVariant: T,
  staticVariant: T
): T {
  return shouldReduceMotion ? staticVariant : animatedVariant;
}
