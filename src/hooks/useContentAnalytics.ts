'use client';

import { usePostHog } from 'posthog-js/react';
import { useCallback } from 'react';

type Surface = 'home' | 'dashboard';

type ContentEventProperties = {
  user_id?: string;
  content_name: string;
  content_category: string;
  content_id: string;
  surface: Surface;
  experiment_variant?: string;
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

  return {
    trackContentViewed,
    trackContentPlayStarted,
    trackContentPlayCompleted,
  };
};
