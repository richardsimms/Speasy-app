'use client';

import type { Category } from '@/components/category-picker';
import { useAuth } from '@clerk/nextjs';
import * as React from 'react';
import { PreferenceSheet } from '@/components/preference-sheet';
import { PreferenceSidebar } from '@/components/preference-sidebar';

type PreferenceIntegrationProps = {
  categories: Category[];
  locale: string;
};

/**
 * Integrates preference components (sidebar, FAB, sheet) into marketing pages
 * Only shows for unauthenticated users
 * Part of Phase 3 of the Category Preferences Signup Conversion Plan
 */
export function PreferenceIntegration({
  categories,
  locale,
}: PreferenceIntegrationProps) {
  const { isSignedIn, isLoaded } = useAuth();
  // Open sheet by default on mobile (no FAB needed)
  const [isSheetOpen, setIsSheetOpen] = React.useState(true);

  // Wait for Clerk to load before checking auth state
  if (!isLoaded) {
    return null;
  }

  // Don't show preference components for authenticated users
  // They should use settings page instead
  // Note: For testing, you can temporarily comment out this check
  if (isSignedIn) {
    return null;
  }

  // Don't show if no categories available
  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <>
      {/* Desktop: Sticky Sidebar - positioned relative to viewport */}
      <div className="pointer-events-none fixed inset-y-0 right-0 z-40 hidden lg:flex lg:items-start lg:justify-end">
        <div className="pointer-events-auto sticky top-6 mr-6 w-80">
          <PreferenceSidebar
            categories={categories}
            redirectToSignup={true}
            locale={locale}
          />
        </div>
      </div>

      {/* Mobile: Bottom Sheet - opens automatically on mobile */}
      <PreferenceSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        categories={categories}
        redirectToSignup={true}
        locale={locale}
      />
    </>
  );
}
