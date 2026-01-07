'use client';

import type { Category } from '@/components/category-picker';
import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { CategoryPicker } from '@/components/category-picker';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAnonymousPreferences } from '@/hooks/useAnonymousPreferences';
import { cn } from '@/libs/utils';

export type PreferenceModalProps = {
  categories: Category[];
  onClose?: () => void;
  showCloseButton?: boolean;
  className?: string;
  redirectToSignup?: boolean;
  locale?: string;
};

/**
 * Shared preference modal component
 * Displays CategoryPicker with "Make it yours" messaging
 * Part of Phase 3.2 of the Category Preferences Signup Conversion Plan
 */
export function PreferenceModal({
  categories,
  onClose,
  showCloseButton = true,
  className,
  redirectToSignup = true,
  locale = 'en',
}: PreferenceModalProps) {
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [isSaving, setIsSaving] = React.useState(false);
  const { savePreferences, preferences } = useAnonymousPreferences();
  const router = useRouter();

  // Load existing preferences on mount
  React.useEffect(() => {
    if (preferences?.categoryIds) {
      setSelectedIds(preferences.categoryIds);
    }
  }, [preferences]);

  const handleContinue = async () => {
    if (selectedIds.length === 0) {
      return;
    }

    setIsSaving(true);
    try {
      await savePreferences(selectedIds);

      if (redirectToSignup) {
        // Redirect to signup page (with locale if not default)
        const signUpPath = locale && locale !== 'en' ? `/${locale}/sign-up` : '/sign-up';
        router.push(signUpPath);
      } else if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error('Failed to save preferences', error);
    } finally {
      setIsSaving(false);
    }
  };

  const isSelectionValid = selectedIds.length >= 1;

  return (
    <Card className={cn('w-full max-w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-800', className)}>
      <CardHeader className="px-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="hidden text-2xl text-gray-900 lg:block dark:text-gray-100">Make it yours</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Select topics and interests to customize your Discover experience
            </CardDescription>
          </div>
          {showCloseButton && onClose && (
            <button
              type="button"
              onClick={onClose}
              className="rounded-sm text-gray-900 opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:outline-none disabled:pointer-events-none dark:text-gray-100 dark:focus:ring-gray-600"
              aria-label="Close"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <CategoryPicker
          categories={categories}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          minSelections={1}
        />
        <div className="flex justify-end">
          <Button
            onClick={handleContinue}
            disabled={!isSelectionValid || isSaving}
            size="lg"
            className="bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:text-gray-300 dark:bg-blue-500 dark:hover:bg-blue-600 dark:disabled:bg-gray-600 dark:disabled:text-gray-400"
          >
            {isSaving ? 'Saving...' : 'Continue'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
