'use client';

import type { PreferenceModalProps } from '@/components/preference-modal';
import * as React from 'react';
import { PreferenceModal } from '@/components/preference-modal';

const DISMISS_KEY = 'speasy_preference_sidebar_dismissed';
const DISMISS_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export type PreferenceSidebarProps = Omit<PreferenceModalProps, 'showCloseButton'> & {
  className?: string;
};

/**
 * Desktop sticky sidebar for preference selection
 * Fixed position on the right side, follows user as they scroll
 * Part of Phase 3.1 of the Category Preferences Signup Conversion Plan
 */
export function PreferenceSidebar({
  categories,
  className,
  ...props
}: PreferenceSidebarProps) {
  const [isDismissed, setIsDismissed] = React.useState(false);
  const [isVisible, setIsVisible] = React.useState(false);

  // Check if sidebar was dismissed
  React.useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const dismissed = localStorage.getItem(DISMISS_KEY);
    if (dismissed) {
      const dismissedTime = Number.parseInt(dismissed, 10);
      const now = Date.now();

      // Re-show after 24 hours
      if (now - dismissedTime < DISMISS_DURATION) {
        setIsDismissed(true);
        return;
      } else {
        // Expired, clear it
        localStorage.removeItem(DISMISS_KEY);
      }
    }

    // Show sidebar after a short delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    setIsVisible(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem(DISMISS_KEY, Date.now().toString());
    }
  };

  if (isDismissed || !isVisible) {
    return null;
  }

  return (
    <div className="relative h-fit w-full max-w-sm">
      <PreferenceModal
        categories={categories}
        onClose={handleDismiss}
        showCloseButton={true}
        className="shadow-lg"
        {...props}
      />
    </div>
  );
}
