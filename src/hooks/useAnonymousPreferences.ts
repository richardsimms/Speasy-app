'use client';

import { useCallback, useEffect, useState } from 'react';

const COOKIE_NAME = 'speasy_pending_prefs';
const COOKIE_MAX_AGE = 3600; // 1 hour in seconds

// Simple cookie utility functions
function setCookie(name: string, value: string, maxAge: number) {
  if (typeof document === 'undefined') {
    return;
  }
  document.cookie = `${name}=${encodeURIComponent(value)}; max-age=${maxAge}; path=/; SameSite=Lax${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`;
}

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') {
    return null;
  }
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return decodeURIComponent(parts.pop()!.split(';').shift()!);
  }
  return null;
}

function removeCookie(name: string) {
  if (typeof document === 'undefined') {
    return;
  }
  document.cookie = `${name}=; max-age=0; path=/`;
}

export type PendingPreferences = {
  anonymousId: string;
  categoryIds: string[];
};

/**
 * Hook for managing anonymous user preferences before signup.
 * Stores preferences in a cookie with 1 hour expiry and optionally syncs to database.
 * Part of Phase 3.3 of the Category Preferences Signup Conversion Plan.
 */
export function useAnonymousPreferences() {
  const [preferences, setPreferences] = useState<PendingPreferences | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);

  // Generate or retrieve anonymous ID
  const getAnonymousId = useCallback((): string => {
    const stored = localStorage.getItem('speasy_anonymous_id');
    if (stored) {
      return stored;
    }

    // Generate a new anonymous ID
    const newId = `anon_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    localStorage.setItem('speasy_anonymous_id', newId);
    return newId;
  }, []);

  // Load preferences from cookie on mount
  useEffect(() => {
    try {
      const cookieValue = getCookie(COOKIE_NAME);
      if (cookieValue) {
        const parsed = JSON.parse(cookieValue) as PendingPreferences;
        setPreferences(parsed);
      }
    } catch (error) {
      // Invalid cookie, ignore
      console.warn('Failed to parse preferences cookie', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save preferences to cookie
  const savePreferences = useCallback(
    async (categoryIds: string[]) => {
      const anonymousId = getAnonymousId();
      const prefs: PendingPreferences = {
        anonymousId,
        categoryIds,
      };

      // Save to cookie
      setCookie(COOKIE_NAME, JSON.stringify(prefs), COOKIE_MAX_AGE);

      setPreferences(prefs);

      // Optionally save to database (server-side backup)
      try {
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 1);

        await fetch('/api/pending-preferences', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            anonymousId,
            categoryIds,
            expiresAt: expiresAt.toISOString(),
          }),
        });
      } catch (error) {
        // Non-critical - cookie is the primary storage
        console.warn('Failed to save preferences to database', error);
      }
    },
    [getAnonymousId],
  );

  // Clear preferences
  const clearPreferences = useCallback(() => {
    removeCookie(COOKIE_NAME);
    setPreferences(null);
  }, []);

  // Get preferences
  const getPreferences = useCallback((): PendingPreferences | null => {
    return preferences;
  }, [preferences]);

  return {
    preferences,
    isLoading,
    savePreferences,
    clearPreferences,
    getPreferences,
    getAnonymousId,
  };
}
