'use client';

import { useCallback, useState } from 'react';
import { usePWA } from './PWAProvider';

/**
 * Toast component that shows when a service worker update is available
 */
export function PWAUpdateToast() {
  const { swUpdateAvailable, skipWaiting } = usePWA();
  const [isDismissed, setIsDismissed] = useState(false);

  const handleUpdate = useCallback(() => {
    skipWaiting();
    // Reload to activate new service worker
    window.location.reload();
  }, [skipWaiting]);

  const handleDismiss = useCallback(() => {
    setIsDismissed(true);
  }, []);

  // Show toast if update is available and not dismissed
  const isVisible = swUpdateAvailable && !isDismissed;

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed right-4 bottom-4 left-4 z-50 md:right-4 md:left-auto md:w-80">
      <div className="rounded-lg border border-gray-700 bg-gray-900 p-4 shadow-lg">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <svg
              className="size-5 text-purple-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-white">Update Available</p>
            <p className="mt-1 text-sm text-gray-400">
              A new version of Speasy is ready.
            </p>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={handleUpdate}
                className="rounded bg-purple-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-purple-500"
              >
                Update Now
              </button>
              <button
                type="button"
                onClick={handleDismiss}
                className="rounded px-3 py-1.5 text-sm font-medium text-gray-400 hover:text-white"
              >
                Later
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
