'use client';

import { Sparkles } from 'lucide-react';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/libs/utils';

export type PreferenceFABProps = {
  onClick: () => void;
  className?: string;
};

/**
 * Mobile floating action button for preference selection
 * Small button in bottom-right corner with subtle pulse animation
 * Part of Phase 3.1 of the Category Preferences Signup Conversion Plan
 */
export function PreferenceFAB({ onClick, className }: PreferenceFABProps) {
  const [isVisible, setIsVisible] = React.useState(true);
  const scrollTimeoutRef = React.useRef<NodeJS.Timeout | undefined>(undefined);

  // Hide FAB when user is actively scrolling, re-appear on scroll stop
  React.useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          // Hide while scrolling
          setIsVisible(false);

          // Clear existing timeout
          if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current);
          }

          // Show again after scroll stops
          scrollTimeoutRef.current = setTimeout(() => {
            setIsVisible(true);
          }, 500) as unknown as NodeJS.Timeout;

          ticking = false;
        });

        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <Button
      type="button"
      onClick={onClick}
      size="icon"
      className={cn(
        'fixed bottom-6 right-6 z-50',
        'size-14 rounded-full shadow-lg',
        'lg:hidden', // Only show on mobile (<1024px)
        'animate-pulse',
        className,
      )}
      aria-label="Personalize your feed"
    >
      <Sparkles className="size-6" />
    </Button>
  );
}
