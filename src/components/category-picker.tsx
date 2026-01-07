'use client';

import { Check } from 'lucide-react';
import * as React from 'react';
import { cn } from '@/libs/utils';

export type Category = {
  id: string;
  name: string;
  slug?: string;
  description?: string | null;
  image_url?: string | null;
  icon?: string;
};

export type CategoryPickerProps = {
  categories: Category[];
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  minSelections?: number; // Default: 1
  maxSelections?: number;
  showCustomInput?: boolean;
  className?: string;
};

/**
 * CategoryPicker Component
 * Displays available categories as pill-style buttons with multi-select functionality.
 * Part of Phase 2.1 of the Category Preferences Signup Conversion Plan.
 *
 * Features:
 * - Multi-select with visual feedback (checkmark icon, color change)
 * - Minimum 1 category required (configurable)
 * - Responsive grid layout
 * - Accessible (keyboard navigation, ARIA labels)
 */
export function CategoryPicker({
  categories,
  selectedIds,
  onSelectionChange,
  minSelections = 1,
  maxSelections,
  showCustomInput = false,
  className,
}: CategoryPickerProps) {
  const [customInterest, setCustomInterest] = React.useState('');

  const handleCategoryToggle = (categoryId: string) => {
    const isSelected = selectedIds.includes(categoryId);

    if (isSelected) {
      // Deselect - but ensure we don't go below minSelections
      if (selectedIds.length > minSelections) {
        onSelectionChange(selectedIds.filter(id => id !== categoryId));
      }
    } else {
      // Select - but ensure we don't exceed maxSelections
      if (!maxSelections || selectedIds.length < maxSelections) {
        onSelectionChange([...selectedIds, categoryId]);
      }
    }
  };

  const isSelectionValid = selectedIds.length >= minSelections;
  const canSelectMore = !maxSelections || selectedIds.length < maxSelections;

  return (
    <div className={cn('space-y-4', className)}>
      {/* Category Grid */}
      <div
        className="grid grid-cols-2 gap-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2"
        role="group"
        aria-label="Category selection"
      >
        {categories.map((category) => {
          const isSelected = selectedIds.includes(category.id);
          const isDisabled = !isSelected && !canSelectMore;

          return (
            <button
              key={category.id}
              type="button"
              onClick={() => handleCategoryToggle(category.id)}
              disabled={isDisabled}
              className={cn(
                'group relative flex min-w-0 items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium transition-all',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
                'disabled:cursor-not-allowed disabled:opacity-50',
                isSelected
                  ? 'border-blue-600 bg-blue-600 text-white shadow-sm dark:border-blue-500 dark:bg-blue-500'
                  : 'border-gray-300 bg-white text-gray-900 hover:border-blue-500 hover:bg-blue-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:hover:border-blue-500 dark:hover:bg-gray-700',
              )}
              aria-pressed={isSelected}
              aria-label={`${isSelected ? 'Deselect' : 'Select'} category ${category.name}`}
            >
              {isSelected && (
                <Check
                  className="size-4 shrink-0"
                  aria-hidden="true"
                />
              )}
              <span className="text-center break-words">{category.name}</span>
            </button>
          );
        })}
      </div>

      {/* Validation Message */}
      {!isSelectionValid && (
        <p
          className="text-sm text-gray-600 dark:text-gray-400"
          role="status"
          aria-live="polite"
        >
          Select at least
          {' '}
          {minSelections}
          {' '}
          topic
          {minSelections > 1 ? 's' : ''}
          {' '}
          to
          continue
        </p>
      )}

      {/* Selection Count Hint */}
      {maxSelections && (
        <p className="text-xs text-gray-600 dark:text-gray-400">
          {selectedIds.length}
          {' '}
          /
          {maxSelections}
          {' '}
          selected
        </p>
      )}

      {/* Custom Interest Input (Optional) */}
      {showCustomInput && (
        <div className="space-y-2">
          <label
            htmlFor="custom-interest"
            className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            I&apos;m curious about...
          </label>
          <input
            id="custom-interest"
            type="text"
            value={customInterest}
            onChange={e => setCustomInterest(e.target.value)}
            placeholder="Enter a topic or interest"
            className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
      )}
    </div>
  );
}

/**
 * Helper component to display selection status
 * Can be used alongside CategoryPicker to show validation state
 */
export function CategoryPickerStatus({
  selectedCount,
  minSelections = 1,
  maxSelections,
}: {
  selectedCount: number;
  minSelections?: number;
  maxSelections?: number;
}) {
  const isValid = selectedCount >= minSelections;
  const isAtMax = maxSelections && selectedCount >= maxSelections;

  return (
    <div className="flex items-center gap-2 text-sm">
      <span
        className={cn(
          'size-2 rounded-full',
          isValid ? 'bg-green-500' : 'bg-yellow-500',
        )}
        aria-hidden="true"
      />
      <span className={cn(isValid ? 'text-foreground' : 'text-muted-foreground')}>
        {selectedCount}
        {' '}
        selected
        {maxSelections && ` (max ${maxSelections})`}
        {isAtMax && ' - Maximum reached'}
      </span>
    </div>
  );
}
