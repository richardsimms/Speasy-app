import posthog from 'posthog-js';
import { useCallback, useEffect, useRef, useState } from 'react';

type PWAInstallState = {
  isInstallable: boolean;
  isInstalled: boolean;
  isIOS: boolean;
  isStandalone: boolean;
  deferredPrompt: BeforeInstallPromptEvent | null;
};

/**
 * BeforeInstallPromptEvent interface for TypeScript
 */
type BeforeInstallPromptEvent = {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt: () => Promise<void>;
} & Event;

/**
 * Extended Navigator interface for iOS standalone detection
 */
type NavigatorWithStandalone = {
  standalone?: boolean;
} & Navigator;

/**
 * Get initial PWA state (runs once on mount)
 */
function getInitialState(): PWAInstallState {
  if (typeof window === 'undefined') {
    return {
      isInstallable: false,
      isInstalled: false,
      isIOS: false,
      isStandalone: false,
      deferredPrompt: null,
    };
  }

  const isStandalone
    = window.matchMedia('(display-mode: standalone)').matches
    || (window.navigator as NavigatorWithStandalone).standalone === true;

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  return {
    isInstallable: false,
    isInstalled: isStandalone,
    isIOS,
    isStandalone,
    deferredPrompt: null,
  };
}

/**
 * Hook for managing PWA installation
 */
export function usePWAInstall() {
  const [state, setState] = useState<PWAInstallState>(getInitialState);
  const hasTrackedLaunch = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    // Track PWA launch mode (only once)
    if (state.isStandalone && !hasTrackedLaunch.current) {
      hasTrackedLaunch.current = true;
      posthog.capture('pwa_launched', {
        source: state.isIOS ? 'ios_homescreen' : 'installed_app',
      });
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();

      const promptEvent = e as BeforeInstallPromptEvent;

      setState(prev => ({
        ...prev,
        isInstallable: true,
        deferredPrompt: promptEvent,
      }));

      // Track that install prompt was available
      posthog.capture('pwa_install_prompt_available', {
        platforms: promptEvent.platforms,
      });
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      setState(prev => ({
        ...prev,
        isInstalled: true,
        isInstallable: false,
        deferredPrompt: null,
      }));

      // Track successful installation
      posthog.capture('pwa_installed', {
        method: 'browser_prompt',
      });
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [state.isIOS, state.isStandalone]);

  /**
   * Trigger the install prompt
   */
  const promptInstall = useCallback(async (): Promise<boolean> => {
    if (!state.deferredPrompt) {
      // For iOS, we can't programmatically prompt, but track the attempt
      if (state.isIOS) {
        posthog.capture('pwa_install_prompt_ios_fallback');
      }
      return false;
    }

    try {
      // Show the install prompt
      await state.deferredPrompt.prompt();

      // Wait for the user to respond to the prompt
      const choiceResult = await state.deferredPrompt.userChoice;

      // Track the user's choice
      posthog.capture('pwa_install_prompt_response', {
        outcome: choiceResult.outcome,
        platform: choiceResult.platform,
      });

      if (choiceResult.outcome === 'accepted') {
        setState(prev => ({
          ...prev,
          deferredPrompt: null,
          isInstallable: false,
        }));
        return true;
      }

      return false;
    } catch (error) {
      posthog.capture('pwa_install_prompt_error', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      return false;
    }
  }, [state.deferredPrompt, state.isIOS]);

  /**
   * Get iOS installation instructions
   */
  const getIOSInstructions = useCallback(() => {
    return {
      steps: [
        'Tap the Share button in Safari (the square with arrow)',
        'Scroll down and tap "Add to Home Screen"',
        'Tap "Add" to install Speasy',
      ],
      supported: state.isIOS && !state.isStandalone,
    };
  }, [state.isIOS, state.isStandalone]);

  return {
    ...state,
    promptInstall,
    getIOSInstructions,
  };
}
