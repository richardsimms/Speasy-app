'use client';

import type { Category } from '@/components/category-picker';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { CategoryPicker } from '@/components/category-picker';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAnonymousPreferences } from '@/hooks/useAnonymousPreferences';

type OnboardingClientProps = {
  categories: Category[];
  userId: string;
  locale: string;
};

/**
 * Client component for onboarding page
 * Handles category selection and saves preferences
 */
export function OnboardingClient({
  categories,
  userId: _userId,
  locale,
}: OnboardingClientProps) {
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [isSaving, setIsSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const router = useRouter();
  const { preferences, clearPreferences } = useAnonymousPreferences();

  // Load preferences from anonymous session on mount
  React.useEffect(() => {
    if (preferences?.categoryIds) {
      setSelectedIds(preferences.categoryIds);
    }
  }, [preferences]);

  const handleContinue = async () => {
    if (selectedIds.length === 0) {
      setError('Please select at least one category');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      // Save preferences to user account
      const response = await fetch('/api/user/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          categoryIds: selectedIds,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save preferences');
      }

      // Clear anonymous preferences
      clearPreferences();

      // Redirect to dashboard
      router.push(`/${locale}/dashboard`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to save preferences',
      );
      setIsSaving(false);
    }
  };

  const isSelectionValid = selectedIds.length >= 1;

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <Card className="bg-background/50 w-full max-w-2xl backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Make it yours</CardTitle>
          <CardDescription>
            Select topics and interests to customize your Discover experience
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <CategoryPicker
            categories={categories}
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
            minSelections={1}
          />

          {error && (
            <div className="bg-destructive/10 text-destructive rounded-md p-3 text-sm">
              {error}
            </div>
          )}

          <div className="flex justify-end">
            <Button
              onClick={handleContinue}
              disabled={!isSelectionValid || isSaving}
              size="lg"
            >
              {isSaving ? 'Saving...' : 'Continue to Dashboard'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
