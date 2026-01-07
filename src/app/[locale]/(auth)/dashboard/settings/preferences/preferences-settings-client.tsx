'use client';

import type { Category } from '@/components/category-picker';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { CategoryPicker } from '@/components/category-picker';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type PreferencesSettingsClientProps = {
  categories: Category[];
  currentCategoryIds: string[];
  locale: string;
};

/**
 * Client component for preferences settings page
 * Part of Phase 5.1 of the Category Preferences Signup Conversion Plan
 */
export function PreferencesSettingsClient({
  categories,
  currentCategoryIds,
  locale: _locale,
}: PreferencesSettingsClientProps) {
  const [selectedIds, setSelectedIds] = React.useState<string[]>(
    currentCategoryIds,
  );
  const [isSaving, setIsSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);
  const router = useRouter();
  const hasChanges = React.useMemo(
    () =>
      selectedIds.length !== currentCategoryIds.length
      || !selectedIds.every(id => currentCategoryIds.includes(id)),
    [selectedIds, currentCategoryIds],
  );

  const handleSave = async () => {
    if (selectedIds.length === 0) {
      setError('Please select at least one category');
      return;
    }

    setIsSaving(true);
    setError(null);
    setSuccess(false);

    try {
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

      setSuccess(true);
      // Refresh the page to show updated preferences
      setTimeout(() => {
        router.refresh();
      }, 1000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to save preferences',
      );
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset to original values
    setSelectedIds(currentCategoryIds);
    setError(null);
    setSuccess(false);
  };

  const isSelectionValid = selectedIds.length >= 1;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Content Preferences</CardTitle>
          <CardDescription>
            Select the topics and interests you want to see in your personalized
            feed
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

          {success && (
            <div className="rounded-md bg-green-500/10 p-3 text-sm text-green-600 dark:text-green-400">
              Preferences saved successfully!
            </div>
          )}

          <div className="flex items-center justify-end gap-3">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isSaving || !hasChanges}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!isSelectionValid || isSaving || !hasChanges}
              size="lg"
            >
              {isSaving ? 'Saving...' : 'Save Preferences'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
