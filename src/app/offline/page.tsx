'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Get initial online status
 */
function getInitialOnlineStatus(): boolean {
  if (typeof window === 'undefined') {
    return true;
  }
  return navigator.onLine;
}

/**
 * Offline page shown when user is offline and tries to access uncached content
 */
export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(getInitialOnlineStatus);
  const reloadTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Auto-reload when back online
      reloadTimerRef.current = setTimeout(() => window.location.reload(), 1000);
    };

    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (reloadTimerRef.current) {
        clearTimeout(reloadTimerRef.current);
      }
    };
  }, []);

  const handleRetry = useCallback(() => {
    window.location.reload();
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#100e12] px-6 text-center">
      <div className="max-w-md">
        {/* Logo */}
        <div className="mb-8">
          <Image
            src="/android-chrome-192x192.png"
            alt="Speasy"
            width={80}
            height={80}
            className="mx-auto rounded-2xl"
          />
        </div>

        {/* Status indicator */}
        <div className="mb-6">
          <div
            className={`mx-auto flex size-16 items-center justify-center rounded-full ${
              isOnline ? 'bg-green-900/50' : 'bg-gray-800'
            }`}
          >
            {isOnline
              ? (
                  <svg
                    className="size-8 text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.14 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"
                    />
                  </svg>
                )
              : (
                  <svg
                    className="size-8 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414"
                    />
                  </svg>
                )}
          </div>
        </div>

        {/* Title and description */}
        <h1 className="mb-3 text-2xl font-semibold text-white">
          {isOnline ? 'Back Online!' : 'You\'re Offline'}
        </h1>
        <p className="mb-8 text-gray-400">
          {isOnline
            ? 'Connection restored. Reloading...'
            : 'It looks like you\'ve lost your internet connection. Don\'t worry—your downloaded episodes are still available.'}
        </p>

        {/* Actions */}
        {!isOnline && (
          <div className="space-y-3">
            <Link
              href="/dashboard"
              className="inline-flex w-full items-center justify-center rounded-lg bg-purple-600 px-6 py-3 font-medium text-white transition hover:bg-purple-500"
            >
              Go to Dashboard
            </Link>
            <button
              type="button"
              onClick={handleRetry}
              className="inline-flex w-full items-center justify-center rounded-lg bg-gray-800 px-6 py-3 font-medium text-gray-300 transition hover:bg-gray-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Cached content info */}
        {!isOnline && (
          <div className="mt-8 rounded-lg border border-gray-800 bg-gray-900/50 p-4">
            <h2 className="mb-2 text-sm font-medium text-gray-300">
              Offline Mode
            </h2>
            <p className="text-sm text-gray-500">
              Your cached podcasts and recent content are still available.
              Navigate to your dashboard to access them.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
