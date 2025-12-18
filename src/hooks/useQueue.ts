"use client";

import { useCallback, useMemo } from "react";

import type { Track, VisibleQueueContext } from "@/types/audio";

type ContentItem = {
  id: string;
  title: string;
  summary: string | null;
  imageUrl: string | null;
  category: string;
  duration: number | null;
  audioUrl?: string;
  created_at?: string;
};

type UseQueueOptions = {
  source: "category" | "latest";
  locale: string;
  categoryId?: string;
};

/**
 * Hook to build a queue context and tracks from displayed content items
 */
export function useQueue(items: ContentItem[], options: UseQueueOptions) {
  const { source, locale, categoryId } = options;

  // Convert content items to Track objects
  const tracks = useMemo<Track[]>(() => {
    return items
      .filter((item) => item.audioUrl) // Only items with audio
      .map((item) => ({
        id: item.id,
        title: item.title,
        audioUrl: item.audioUrl!,
        imageUrl: item.imageUrl ?? undefined,
        category: item.category,
        duration: item.duration ?? undefined,
        publishedAt: item.created_at,
        contentUrl: `/${locale}/content/${item.id}`,
      }));
  }, [items, locale]);

  // Build visible queue context
  const queueContext = useMemo<VisibleQueueContext>(
    () => ({
      source,
      locale,
      categoryId,
      visibleTrackIds: tracks.map((t) => t.id),
    }),
    [source, locale, categoryId, tracks],
  );

  // Helper to find a track by ID
  const getTrackById = useCallback(
    (trackId: string): Track | undefined => {
      return tracks.find((t) => t.id === trackId);
    },
    [tracks],
  );

  // Helper to get track index
  const getTrackIndex = useCallback(
    (trackId: string): number => {
      return tracks.findIndex((t) => t.id === trackId);
    },
    [tracks],
  );

  return {
    tracks,
    queueContext,
    getTrackById,
    getTrackIndex,
  };
}

/**
 * Map a content item to a Track object
 * Use this when you have a single item and need to convert it
 */
export function mapContentToTrack(
  item: {
    id: string;
    title: string;
    audioUrl?: string | null;
    imageUrl?: string | null;
    category: string;
    duration?: number | null;
    createdAt?: string;
  },
  locale: string,
): Track | null {
  if (!item.audioUrl) return null;

  return {
    id: item.id,
    title: item.title,
    audioUrl: item.audioUrl,
    imageUrl: item.imageUrl ?? undefined,
    category: item.category,
    duration: item.duration ?? undefined,
    publishedAt: item.createdAt,
    contentUrl: `/${locale}/content/${item.id}`,
  };
}
