'use client';

import { usePostHog } from 'posthog-js/react';
import { useCallback } from 'react';

type Surface = 'home' | 'dashboard' | 'detail';
type Source = 'category' | 'latest' | 'detail';

type ContentEventProperties = {
  user_id?: string;
  content_name: string;
  content_category: string;
  content_id: string;
  surface: Surface;
  experiment_variant?: string;
};

/**
 * Extended properties for player events
 */
type PlayerEventProperties = {
  content_id: string;
  source: Source;
  category_id?: string;
  queue_enabled: boolean;
  position_in_queue: number;
  queue_length: number;
};

export const useContentAnalytics = () => {
  const posthog = usePostHog();

  const trackContentViewed = useCallback(
    (properties: ContentEventProperties) => {
      if (!posthog) {
        return;
      }

      posthog.capture('content_viewed', {
        user_id: properties.user_id || posthog.get_distinct_id(),
        content_name: properties.content_name,
        content_category: properties.content_category,
        content_id: properties.content_id,
        surface: properties.surface,
        experiment_variant: properties.experiment_variant,
      });
    },
    [posthog],
  );

  const trackContentPlayStarted = useCallback(
    (properties: ContentEventProperties) => {
      if (!posthog) {
        return;
      }

      posthog.capture('content_play_started', {
        user_id: properties.user_id || posthog.get_distinct_id(),
        content_name: properties.content_name,
        content_category: properties.content_category,
        content_id: properties.content_id,
        surface: properties.surface,
        experiment_variant: properties.experiment_variant,
      });
    },
    [posthog],
  );

  const trackContentPlayCompleted = useCallback(
    (properties: ContentEventProperties) => {
      if (!posthog) {
        return;
      }

      posthog.capture('content_play_completed', {
        user_id: properties.user_id || posthog.get_distinct_id(),
        content_name: properties.content_name,
        content_category: properties.content_category,
        content_id: properties.content_id,
        surface: properties.surface,
        experiment_variant: properties.experiment_variant,
      });
    },
    [posthog],
  );

  /**
   * Track when the full player is opened
   */
  const trackPlayerOpen = useCallback(
    (properties: PlayerEventProperties) => {
      if (!posthog) {
        return;
      }

      posthog.capture('player_open', {
        content_id: properties.content_id,
        source: properties.source,
        category_id: properties.category_id,
        queue_enabled: properties.queue_enabled,
        position_in_queue: properties.position_in_queue,
        queue_length: properties.queue_length,
      });
    },
    [posthog],
  );

  /**
   * Track when the full player is closed
   */
  const trackPlayerClose = useCallback(
    (properties: PlayerEventProperties) => {
      if (!posthog) {
        return;
      }

      posthog.capture('player_close', {
        content_id: properties.content_id,
        source: properties.source,
        category_id: properties.category_id,
        queue_enabled: properties.queue_enabled,
        position_in_queue: properties.position_in_queue,
        queue_length: properties.queue_length,
      });
    },
    [posthog],
  );

  /**
   * Track when audio auto-advances to next track
   */
  const trackAudioNextAuto = useCallback(
    (properties: PlayerEventProperties) => {
      if (!posthog) {
        return;
      }

      posthog.capture('audio_next_auto', {
        content_id: properties.content_id,
        source: properties.source,
        category_id: properties.category_id,
        queue_enabled: properties.queue_enabled,
        position_in_queue: properties.position_in_queue,
        queue_length: properties.queue_length,
      });
    },
    [posthog],
  );

  /**
   * Track when user manually skips to next track
   */
  const trackAudioNextManual = useCallback(
    (properties: PlayerEventProperties) => {
      if (!posthog) {
        return;
      }

      posthog.capture('audio_next_manual', {
        content_id: properties.content_id,
        source: properties.source,
        category_id: properties.category_id,
        queue_enabled: properties.queue_enabled,
        position_in_queue: properties.position_in_queue,
        queue_length: properties.queue_length,
      });
    },
    [posthog],
  );

  /**
   * Track when user manually goes to previous track
   */
  const trackAudioPrevManual = useCallback(
    (properties: PlayerEventProperties) => {
      if (!posthog) {
        return;
      }

      posthog.capture('audio_prev_manual', {
        content_id: properties.content_id,
        source: properties.source,
        category_id: properties.category_id,
        queue_enabled: properties.queue_enabled,
        position_in_queue: properties.position_in_queue,
        queue_length: properties.queue_length,
      });
    },
    [posthog],
  );

  /**
   * Track when audio completes playing
   */
  const trackAudioComplete = useCallback(
    (properties: PlayerEventProperties) => {
      if (!posthog) {
        return;
      }

      posthog.capture('audio_complete', {
        content_id: properties.content_id,
        source: properties.source,
        category_id: properties.category_id,
        queue_enabled: properties.queue_enabled,
        position_in_queue: properties.position_in_queue,
        queue_length: properties.queue_length,
      });
    },
    [posthog],
  );

  /**
   * Track seek events
   */
  const trackSeek = useCallback(
    (
      properties: PlayerEventProperties & {
        seek_to_sec: number;
        seek_from_sec: number;
      },
    ) => {
      if (!posthog) {
        return;
      }

      posthog.capture('seek', {
        content_id: properties.content_id,
        source: properties.source,
        category_id: properties.category_id,
        queue_enabled: properties.queue_enabled,
        position_in_queue: properties.position_in_queue,
        queue_length: properties.queue_length,
        seek_to_sec: properties.seek_to_sec,
        seek_from_sec: properties.seek_from_sec,
      });
    },
    [posthog],
  );

  return {
    trackContentViewed,
    trackContentPlayStarted,
    trackContentPlayCompleted,
    // New player events
    trackPlayerOpen,
    trackPlayerClose,
    trackAudioNextAuto,
    trackAudioNextManual,
    trackAudioPrevManual,
    trackAudioComplete,
    trackSeek,
  };
};
