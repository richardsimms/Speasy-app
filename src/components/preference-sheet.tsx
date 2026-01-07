'use client';

import type { PreferenceModalProps } from '@/components/preference-modal';
import { X } from 'lucide-react';
import * as React from 'react';
import { PreferenceModal } from '@/components/preference-modal';
import { cn } from '@/libs/utils';

export type PreferenceSheetProps = PreferenceModalProps & {
  isOpen: boolean;
  onClose: () => void;
};

/**
 * Mobile bottom sheet modal for preference selection
 * Slides up from bottom, can be dismissed by swiping down or tapping backdrop
 * Part of Phase 3.1 of the Category Preferences Signup Conversion Plan
 */
export function PreferenceSheet({
  isOpen,
  onClose,
  categories,
  ...props
}: PreferenceSheetProps) {
  const [isAnimating, setIsAnimating] = React.useState(false);
  const sheetRef = React.useRef<HTMLDivElement>(null);
  const startYRef = React.useRef<number | null>(null);

  // Handle open/close animations
  React.useEffect(() => {
    if (isOpen) {
      // Prevent body scroll when sheet is open
      document.body.style.overflow = 'hidden';
      setIsAnimating(true);
    } else {
      document.body.style.overflow = '';
      // Delay to allow close animation
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 300);
      return () => {
        clearTimeout(timer);
      };
    }
    return undefined;
  }, [isOpen]);

  // Handle swipe down to dismiss
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (touch) {
      startYRef.current = touch.clientY;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!startYRef.current || !sheetRef.current || e.touches.length === 0) {
      return;
    }

    const touch = e.touches[0];
    if (!touch) {
      return;
    }

    const currentY = touch.clientY;
    const deltaY = currentY - startYRef.current;

    // Only allow downward swipes
    if (deltaY > 0) {
      sheetRef.current.style.transform = `translateY(${deltaY}px)`;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!startYRef.current || !sheetRef.current || e.changedTouches.length === 0) {
      return;
    }

    const currentY = e.changedTouches[0]!.clientY;
    const deltaY = currentY - startYRef.current;
    const threshold = 100; // Minimum swipe distance to dismiss

    if (deltaY > threshold) {
      onClose();
    }

    // Reset transform
    if (sheetRef.current) {
      sheetRef.current.style.transform = '';
    }
    startYRef.current = null;
  };

  if (!isOpen && !isAnimating) {
    return null;
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/50 transition-opacity',
          'lg:hidden', // Only show on mobile
          isOpen ? 'opacity-100' : 'opacity-0',
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet */}
      <div
        ref={sheetRef}
        className={cn(
          'fixed inset-x-0 bottom-0 z-50',
          'lg:hidden', // Only show on mobile
          'max-h-[90vh] overflow-y-auto',
          'bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-t-xl shadow-lg border-t border-l border-r border-gray-200 dark:border-gray-800',
          'transition-transform duration-300 ease-out',
          isOpen ? 'translate-y-0' : 'translate-y-full',
        )}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        role="dialog"
        aria-modal="true"
        aria-labelledby="preference-sheet-title"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white/95 px-4 py-3 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/95">
          <h2
            id="preference-sheet-title"
            className="text-lg font-semibold text-gray-900 dark:text-gray-100"
          >
            Make it yours
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-sm text-gray-900 opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:outline-none dark:text-gray-100 dark:focus:ring-gray-600"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="bg-white p-4 dark:bg-gray-900">
          <PreferenceModal
            categories={categories}
            onClose={onClose}
            showCloseButton={false}
            className="border-0 bg-transparent shadow-none"
            {...props}
          />
        </div>
      </div>
    </>
  );
}
