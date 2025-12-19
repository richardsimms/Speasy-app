import { useCallback, useEffect, useRef, useState } from 'react';

type ServiceWorkerState = {
  isSupported: boolean;
  isRegistered: boolean;
  isReady: boolean;
  registration: ServiceWorkerRegistration | null;
  updateAvailable: boolean;
  error: Error | null;
};

/**
 * Get initial service worker state
 */
function getInitialState(): ServiceWorkerState {
  const isSupported = typeof window !== 'undefined' && 'serviceWorker' in navigator;

  return {
    isSupported,
    isRegistered: false,
    isReady: false,
    registration: null,
    updateAvailable: false,
    error: null,
  };
}

/**
 * Hook for managing service worker registration and lifecycle
 */
export function useServiceWorker() {
  const [state, setState] = useState<ServiceWorkerState>(getInitialState);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !state.isSupported) {
      return;
    }

    let cancelled = false;

    const registerSW = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
          updateViaCache: 'none',
        });

        if (cancelled) return;

        setState(prev => ({
          ...prev,
          isRegistered: true,
          registration,
          isReady: registration.active !== null,
        }));

        // Handle updates using a named function for proper cleanup
        const handleUpdateFound = () => {
          const newWorker = registration.installing;
          if (newWorker) {
            const handleStateChange = () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setState(prev => ({ ...prev, updateAvailable: true }));
              }
            };
            newWorker.addEventListener('statechange', handleStateChange);
          }
        };

        registration.addEventListener('updatefound', handleUpdateFound);

        // Check for updates periodically (every hour)
        intervalRef.current = setInterval(() => {
          registration.update().catch(() => {
            // Ignore update check errors
          });
        }, 60 * 60 * 1000);
      } catch (error) {
        if (cancelled) return;

        setState(prev => ({
          ...prev,
          error: error instanceof Error ? error : new Error('Failed to register service worker'),
        }));
      }
    };

    // Register after page load to avoid blocking
    if (document.readyState === 'complete') {
      registerSW();
    } else {
      const handleLoad = () => {
        registerSW();
      };
      window.addEventListener('load', handleLoad);
      return () => {
        cancelled = true;
        window.removeEventListener('load', handleLoad);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }

    return () => {
      cancelled = true;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [state.isSupported]);

  /**
   * Manually trigger a service worker update
   */
  const update = useCallback(async () => {
    if (state.registration) {
      try {
        await state.registration.update();
      } catch {
        // Ignore update errors
      }
    }
  }, [state.registration]);

  /**
   * Skip waiting and activate new service worker
   */
  const skipWaiting = useCallback(() => {
    if (state.registration?.waiting) {
      state.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
  }, [state.registration]);

  /**
   * Request audio to be cached for offline playback
   */
  const cacheAudio = useCallback((url: string) => {
    if (state.registration?.active) {
      state.registration.active.postMessage({
        type: 'CACHE_AUDIO',
        payload: { url },
      });
    }
  }, [state.registration]);

  /**
   * Clear the audio cache
   */
  const clearAudioCache = useCallback(() => {
    if (state.registration?.active) {
      state.registration.active.postMessage({ type: 'CLEAR_AUDIO_CACHE' });
    }
  }, [state.registration]);

  return {
    ...state,
    update,
    skipWaiting,
    cacheAudio,
    clearAudioCache,
  };
}
