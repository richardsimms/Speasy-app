import { useCallback, useEffect, useState } from 'react';

type PushPermission = 'default' | 'denied' | 'granted';

type PushNotificationState = {
  isSupported: boolean;
  permission: PushPermission;
  subscription: PushSubscription | null;
  isSubscribing: boolean;
  error: Error | null;
};

/**
 * Convert a base64 string to Uint8Array for VAPID key
 */
function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const buffer = new ArrayBuffer(rawData.length);
  const outputArray = new Uint8Array(buffer);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

/**
 * Get initial state for push notifications
 */
function getInitialState(): PushNotificationState {
  if (typeof window === 'undefined') {
    return {
      isSupported: false,
      permission: 'default',
      subscription: null,
      isSubscribing: false,
      error: null,
    };
  }

  const isSupported
    = 'serviceWorker' in navigator
    && 'PushManager' in window
    && 'Notification' in window;

  return {
    isSupported,
    permission: isSupported ? (Notification.permission as PushPermission) : 'denied',
    subscription: null,
    isSubscribing: false,
    error: null,
  };
}

/**
 * Hook for managing web push notifications
 */
export function usePushNotifications(vapidPublicKey?: string) {
  const [state, setState] = useState<PushNotificationState>(getInitialState);

  // Get existing subscription on mount
  useEffect(() => {
    if (!state.isSupported) {
      return;
    }

    let cancelled = false;

    navigator.serviceWorker.ready
      .then(registration => registration.pushManager.getSubscription())
      .then((subscription) => {
        if (!cancelled) {
          setState(prev => ({ ...prev, subscription }));
        }
      })
      .catch(() => {
        // Ignore errors getting subscription
      });

    return () => {
      cancelled = true;
    };
  }, [state.isSupported]);

  /**
   * Request permission for push notifications
   */
  const requestPermission = useCallback(async (): Promise<PushPermission> => {
    if (!state.isSupported) {
      return 'denied';
    }

    try {
      const permission = await Notification.requestPermission();
      setState(prev => ({ ...prev, permission: permission as PushPermission }));
      return permission as PushPermission;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error : new Error('Failed to request permission'),
      }));
      return 'denied';
    }
  }, [state.isSupported]);

  /**
   * Subscribe to push notifications
   */
  const subscribe = useCallback(async (): Promise<PushSubscription | null> => {
    if (!state.isSupported || !vapidPublicKey) {
      return null;
    }

    setState(prev => ({ ...prev, isSubscribing: true, error: null }));

    try {
      // Request permission first if needed
      if (Notification.permission !== 'granted') {
        const permission = await requestPermission();
        if (permission !== 'granted') {
          setState(prev => ({
            ...prev,
            isSubscribing: false,
            error: new Error('Push notification permission denied'),
          }));
          return null;
        }
      }

      // Get service worker registration
      const registration = await navigator.serviceWorker.ready;

      // Subscribe to push notifications
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
      });

      setState(prev => ({
        ...prev,
        subscription,
        isSubscribing: false,
      }));

      // Send subscription to server
      await sendSubscriptionToServer(subscription);

      return subscription;
    } catch (error) {
      setState(prev => ({
        ...prev,
        isSubscribing: false,
        error: error instanceof Error ? error : new Error('Failed to subscribe'),
      }));
      return null;
    }
  }, [state.isSupported, vapidPublicKey, requestPermission]);

  /**
   * Unsubscribe from push notifications
   */
  const unsubscribe = useCallback(async (): Promise<boolean> => {
    if (!state.subscription) {
      return true;
    }

    try {
      await state.subscription.unsubscribe();

      // Remove subscription from server
      await removeSubscriptionFromServer(state.subscription);

      setState(prev => ({ ...prev, subscription: null }));
      return true;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error : new Error('Failed to unsubscribe'),
      }));
      return false;
    }
  }, [state.subscription]);

  return {
    ...state,
    requestPermission,
    subscribe,
    unsubscribe,
  };
}

/**
 * Send push subscription to server for storage
 */
async function sendSubscriptionToServer(subscription: PushSubscription): Promise<void> {
  try {
    await fetch('/api/push/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subscription: subscription.toJSON(),
      }),
    });
  } catch {
    // Ignore server errors - subscription still works locally
  }
}

/**
 * Remove push subscription from server
 */
async function removeSubscriptionFromServer(subscription: PushSubscription): Promise<void> {
  try {
    await fetch('/api/push/unsubscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        endpoint: subscription.endpoint,
      }),
    });
  } catch {
    // Ignore server errors
  }
}
