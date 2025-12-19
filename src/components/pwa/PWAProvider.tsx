'use client';

import type { ReactNode } from 'react';
import { createContext, use, useEffect, useMemo } from 'react';
import { usePWAInstall } from '@/hooks/usePWAInstall';
import { useServiceWorker } from '@/hooks/useServiceWorker';

type PWAContextValue = {
  // Service Worker
  isSwSupported: boolean;
  isSwReady: boolean;
  swUpdateAvailable: boolean;
  skipWaiting: () => void;
  cacheAudio: (url: string) => void;
  clearAudioCache: () => void;
  // Installation
  isInstallable: boolean;
  isInstalled: boolean;
  isIOS: boolean;
  isStandalone: boolean;
  promptInstall: () => Promise<boolean>;
  getIOSInstructions: () => { steps: string[]; supported: boolean };
};

const PWAContext = createContext<PWAContextValue | null>(null);

type PWAProviderProps = {
  children: ReactNode;
};

/**
 * Provider component for PWA features
 * Handles service worker registration and PWA installation state
 */
export function PWAProvider({ children }: PWAProviderProps) {
  const sw = useServiceWorker();
  const install = usePWAInstall();

  // Listen for service worker messages
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return;
    }

    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'FEEDS_SYNC_COMPLETE') {
        // Refresh feeds when sync completes
        window.dispatchEvent(new CustomEvent('speasy:feeds-synced'));
      }
    };

    navigator.serviceWorker.addEventListener('message', handleMessage);
    return () => {
      navigator.serviceWorker.removeEventListener('message', handleMessage);
    };
  }, []);

  const value = useMemo<PWAContextValue>(
    () => ({
      // Service Worker
      isSwSupported: sw.isSupported,
      isSwReady: sw.isReady,
      swUpdateAvailable: sw.updateAvailable,
      skipWaiting: sw.skipWaiting,
      cacheAudio: sw.cacheAudio,
      clearAudioCache: sw.clearAudioCache,
      // Installation
      isInstallable: install.isInstallable,
      isInstalled: install.isInstalled,
      isIOS: install.isIOS,
      isStandalone: install.isStandalone,
      promptInstall: install.promptInstall,
      getIOSInstructions: install.getIOSInstructions,
    }),
    [
      sw.isSupported,
      sw.isReady,
      sw.updateAvailable,
      sw.skipWaiting,
      sw.cacheAudio,
      sw.clearAudioCache,
      install.isInstallable,
      install.isInstalled,
      install.isIOS,
      install.isStandalone,
      install.promptInstall,
      install.getIOSInstructions,
    ],
  );

  return <PWAContext value={value}>{children}</PWAContext>;
}

/**
 * Hook to access PWA context
 */
export function usePWA(): PWAContextValue {
  const context = use(PWAContext);
  if (!context) {
    throw new Error('usePWA must be used within a PWAProvider');
  }
  return context;
}
