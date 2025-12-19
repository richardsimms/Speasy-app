'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { usePWA } from './PWAProvider';

/**
 * Get initial dismissed state from localStorage
 */
function getInitialDismissedState(): boolean {
  if (typeof window === 'undefined') {
    return true;
  }
  return localStorage.getItem('speasy-ios-prompt-dismissed') === 'true';
}

/**
 * iOS-specific install prompt component
 * Shows instructions for adding to home screen on iOS Safari
 */
export function IOSInstallPrompt() {
  const { isIOS, isInstalled, getIOSInstructions } = usePWA();
  const [isDismissed, setIsDismissed] = useState(getInitialDismissedState);
  const hasShownRef = useRef(false);

  const instructions = getIOSInstructions();

  // Show prompt after delay for iOS users who haven't dismissed
  useEffect(() => {
    // Skip if already dismissed or not on iOS
    if (isDismissed || !isIOS || isInstalled || !instructions.supported || hasShownRef.current) {
      return;
    }

    const timer = setTimeout(() => {
      hasShownRef.current = true;
      setIsDismissed(false);
    }, 5000); // Show after 5 seconds

    return () => clearTimeout(timer);
  }, [isIOS, isInstalled, instructions.supported, isDismissed]);

  const handleDismiss = useCallback(() => {
    setIsDismissed(true);
    localStorage.setItem('speasy-ios-prompt-dismissed', 'true');
  }, []);

  if (isDismissed || !isIOS || isInstalled || !instructions.supported) {
    return null;
  }

  return (
    <div className="pb-safe fixed inset-x-0 bottom-0 z-50 p-4">
      <div className="rounded-xl border border-gray-700 bg-gray-900 p-4 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div className="flex gap-3">
            <div className="flex size-10 flex-shrink-0 items-center justify-center rounded-lg bg-purple-600">
              <svg
                className="size-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-base font-semibold text-white">
                Install Speasy
              </h3>
              <p className="mt-1 text-sm text-gray-400">
                Add Speasy to your home screen for the best experience
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleDismiss}
            className="flex-shrink-0 text-gray-500 hover:text-gray-300"
            aria-label="Dismiss"
          >
            <svg className="size-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        <div className="mt-4 space-y-2">
          {instructions.steps.map((step, index) => (
            <div key={`step-${step.slice(0, 10)}`} className="flex items-center gap-3 text-sm">
              <span className="flex size-6 flex-shrink-0 items-center justify-center rounded-full bg-gray-800 text-xs font-medium text-gray-300">
                {index + 1}
              </span>
              <span className="text-gray-300">{step}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-gray-800 p-3">
          <svg
            className="size-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
            />
          </svg>
          <span className="text-sm text-gray-400">
            Look for the Share button
          </span>
        </div>
      </div>
    </div>
  );
}
