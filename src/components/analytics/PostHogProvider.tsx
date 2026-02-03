'use client';

import type { ReactElement } from 'react';
import { useEffect, useState } from 'react';
import { Env } from '@/libs/Env';
import { SuspendedPostHogPageView } from './PostHogPageView';

type PostHogClient = {
  init: (key: string, options?: Record<string, unknown>) => void;
};

type PostHogProviderComponent = (props: {
  children: React.ReactNode;
  client: PostHogClient;
}) => ReactElement;

export const PostHogProvider = (props: { children: React.ReactNode }) => {
  const [posthogClient, setPosthogClient] = useState<PostHogClient | null>(
    null,
  );
  const [Provider, setProvider] = useState<PostHogProviderComponent | null>(
    null,
  );

  useEffect(() => {
    const key = Env.NEXT_PUBLIC_POSTHOG_KEY;
    if (!key) {
      return;
    }

    const load = async () => {
      const [{ default: posthog }, { PostHogProvider: PHProvider }]
        = await Promise.all([
          import('posthog-js'),
          import('posthog-js/react'),
        ]);

      posthog.init(key, {
        api_host: Env.NEXT_PUBLIC_POSTHOG_HOST,
        capture_pageview: false, // Disable automatic pageview capture, as we capture manually
        capture_pageleave: true, // Enable pageleave capture
      });

      setPosthogClient(posthog);
      setProvider(() => PHProvider as PostHogProviderComponent);
    };

    const win = globalThis as unknown as Window;
    let timeoutId: ReturnType<typeof globalThis.setTimeout> | undefined;
    let idleId: number | undefined;

    if ('requestIdleCallback' in win) {
      idleId = win.requestIdleCallback(() => {
        void load();
      });
    } else {
      timeoutId = globalThis.setTimeout(() => {
        void load();
      }, 0);
    }

    return () => {
      if (idleId && 'cancelIdleCallback' in win) {
        win.cancelIdleCallback(idleId);
      }
      if (timeoutId) {
        globalThis.clearTimeout(timeoutId);
      }
    };
  }, []);

  if (!Env.NEXT_PUBLIC_POSTHOG_KEY) {
    return props.children;
  }

  if (!posthogClient || !Provider) {
    return props.children;
  }

  return (
    <Provider client={posthogClient}>
      <SuspendedPostHogPageView />
      {props.children}
    </Provider>
  );
};
