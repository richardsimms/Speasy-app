/**
 * Content Cleanup Utilities
 *
 * Provides functions to filter out archived content from database queries
 * and ensure consistent content filtering across the application.
 */

// ─── Query Filters ─────────────────────────────────────────────────────

/**
 * Get the base filter condition to exclude archived content
 * This should be used in all content_items queries to filter out archived items
 */
export function getActiveContentFilter() {
  return 'status.not.eq.archived';
}

/**
 * Get the base filter conditions for content queries
 * Excludes both archived content and content that hasn't been processed yet
 */
export function getVisibleContentFilter() {
  return {
    statusFilter: 'status.eq.done', // Only show processed content
    notArchivedFilter: 'status.not.eq.archived', // Exclude archived content
  };
}

// ─── Content Status Helpers ───────────────────────────────────────────

/**
 * Check if a content item is archived
 */
export function isContentArchived(contentItem: { status?: string }): boolean {
  return contentItem?.status === 'archived';
}

/**
 * Check if a content item is visible to users (processed and not archived)
 */
export function isContentVisible(contentItem: { status?: string }): boolean {
  return contentItem?.status === 'done' || contentItem?.status === 'processing';
}

/**
 * Filter an array of content items to exclude archived content
 */
export function filterActiveContent<T extends { status?: string }>(
  contentItems: T[],
): T[] {
  if (!contentItems || !Array.isArray(contentItems)) {
    return [];
  }
  return contentItems.filter(
    item => item && item.status && !isContentArchived(item),
  );
}

/**
 * Filter an array of content items to only include visible content
 */
export function filterVisibleContent<T extends { status?: string }>(
  contentItems: T[],
): T[] {
  if (!contentItems || !Array.isArray(contentItems)) {
    return [];
  }
  return contentItems.filter(
    item => item && item.status && isContentVisible(item),
  );
}

// ─── Database Query Helpers ────────────────────────────────────────────

/**
 * Standard content selection fields for user-facing queries
 * Includes all necessary fields for displaying content with user interactions
 */
export const CONTENT_SELECT_FIELDS = `
  id,
  title,
  url,
  status,
  created_at,
  updated_at,
  published_at,
  summary,
  transcript,
  key_insights,
  file_url,
  user_id,
  source:content_sources(name, category_id),
  audio:audio_files(id, file_url, duration, type),
  user_content_items!left(is_read, is_favorite)
`;

/**
 * Content selection fields for RSS feed generation
 * Optimized for feed display without user-specific data
 */
export const RSS_CONTENT_SELECT_FIELDS = `
  id,
  title,
  url,
  status,
  created_at,
  content,
  summary,
  transcript,
  file_url,
  published_at,
  source:content_sources(name, category_id),
  audio:audio_files(id, file_url, duration, type)
`;

// ─── Migration Helpers ─────────────────────────────────────────────────

/**
 * Content retention policy constants
 */
export const CONTENT_RETENTION = {
  RETENTION_DAYS: 14,
  BATCH_SIZE: 100,
  MAX_RETRIES: 3,
} as const;

export const CONTENT_RETENTION_DAYS = CONTENT_RETENTION.RETENTION_DAYS;

/**
 * Get the cutoff date for content cleanup
 */
export function getContentCutoffDate(
  retentionDays: number = CONTENT_RETENTION.RETENTION_DAYS,
): Date {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - retentionDays);
  return cutoffDate;
}

/**
 * Alias for getContentCutoffDate for backward compatibility
 */
export const getContentRetentionCutoff = getContentCutoffDate;

/**
 * Get ISO string for content cleanup queries
 */
export function getContentCutoffISO(
  retentionDays: number = CONTENT_RETENTION.RETENTION_DAYS,
): string {
  return getContentCutoffDate(retentionDays).toISOString();
}
