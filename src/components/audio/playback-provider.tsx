'use client';

import type {
  PlaybackContextValue,
  PlayerUIMode,
  Track,
  VisibleQueueContext,
} from '@/types/audio';

import {
  createContext,
  use,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { useContentAnalytics } from '@/hooks/useContentAnalytics';
import { PLAYBACK_STORAGE_KEYS } from '@/types/audio';

const PlaybackContext = createContext<PlaybackContextValue | null>(null);

/**
 * Hook to access the global playback context
 * @throws Error if used outside of PlaybackProvider
 */
export function usePlayback(): PlaybackContextValue {
  const context = use(PlaybackContext);
  if (!context) {
    throw new Error('usePlayback must be used within a PlaybackProvider');
  }
  return context;
}

/**
 * Optional hook that returns null if outside provider (for conditional usage)
 */
export function usePlaybackOptional(): PlaybackContextValue | null {
  return use(PlaybackContext);
}

type PlaybackProviderProps = {
  children: React.ReactNode;
};

/**
 * Global playback provider that manages a single Audio instance
 * and provides playback state/actions to the entire app
 */
export function PlaybackProvider({ children }: PlaybackProviderProps) {
  // Analytics
  const {
    trackContentPlayStarted,
    trackAudioNextAuto,
    trackAudioNextManual,
    trackAudioPrevManual,
    trackAudioComplete,
    trackSeek,
    trackPlayerOpen,
    trackPlayerClose,
  } = useContentAnalytics();

  // Single Audio instance
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const restoreRef = useRef<{ trackId?: string; timeSec?: number }>({});
  const pendingSeekRef = useRef<number | undefined>(undefined);
  const hasTrackedPlayStartRef = useRef<{ [trackId: string]: boolean }>({});
  const previousSeekTimeRef = useRef<number>(0);

  // State
  const [uiMode, setUIMode] = useState<PlayerUIMode>('inline');
  // Use lazy initializer to restore from localStorage without useEffect
  const [playerEnabled, setPlayerEnabled] = useState(() => {
    if (typeof window === 'undefined') {
      return true; // Default to ON
    }
    try {
      const saved = localStorage.getItem(PLAYBACK_STORAGE_KEYS.playerEnabled);
      return saved !== null ? saved === 'true' : true;
    } catch {
      return true;
    }
  });
  const [queue, setQueue] = useState<Track[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTimeSec, setCurrentTimeSec] = useState(0);
  const [durationSec, setDurationSec] = useState<number | null>(null);
  const [visibleQueueContext, setVisibleQueueContext] = useState<
    VisibleQueueContext | undefined
  >();
  // Use lazy initializer to restore from localStorage without useEffect
  const [selectedCategoryId, setSelectedCategoryIdState] = useState<
    string | undefined
  >(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }
    try {
      return localStorage.getItem(PLAYBACK_STORAGE_KEYS.selectedCategoryId) ?? undefined;
    } catch {
      return undefined;
    }
  });
  const [isLoading, setIsLoading] = useState(false);

  // Derived active track
  const activeTrack = useMemo(() => {
    if (activeIndex >= 0 && activeIndex < queue.length) {
      return queue[activeIndex] ?? null;
    }
    return null;
  }, [queue, activeIndex]);

  // Initialize audio element on mount (client-side only)
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    // Snapshot persisted resume state without triggering a render
    try {
      const savedTrackId = localStorage.getItem(PLAYBACK_STORAGE_KEYS.activeTrackId);
      const savedTimeSecRaw = localStorage.getItem(PLAYBACK_STORAGE_KEYS.currentTimeSec);
      const savedTimeSec = savedTimeSecRaw ? Number(savedTimeSecRaw) : undefined;

      restoreRef.current = {
        trackId: savedTrackId ?? undefined,
        timeSec: Number.isFinite(savedTimeSec) ? savedTimeSec : undefined,
      };
    } catch {
      // Ignore localStorage errors
    }

    // Create single audio element
    const audio = new Audio();
    audio.preload = 'metadata';
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = '';
      audioRef.current = null;
    };
  }, []);

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    const handleTimeUpdate = () => {
      previousSeekTimeRef.current = audio.currentTime;
      setCurrentTimeSec(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDurationSec(audio.duration);
      setIsLoading(false);

      if (pendingSeekRef.current !== undefined) {
        const seekTo = pendingSeekRef.current;
        pendingSeekRef.current = undefined;
        audio.currentTime = Math.max(0, Math.min(seekTo, audio.duration || seekTo));
        setCurrentTimeSec(audio.currentTime);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTimeSec(0);

      // Track audio completion
      if (activeTrack && visibleQueueContext) {
        trackAudioComplete({
          content_id: activeTrack.id,
          source: visibleQueueContext.source,
          category_id: visibleQueueContext.categoryId,
          queue_enabled: true,
          position_in_queue: activeIndex,
          queue_length: queue.length,
        });
      }

      // Reset play start tracking for completed track
      if (activeTrack) {
        hasTrackedPlayStartRef.current[activeTrack.id] = false;
      }

      // Auto-advance to next track if available (works even when player is closed)
      if (activeIndex < queue.length - 1) {
        // Play next track
        const nextIndex = activeIndex + 1;
        setActiveIndex(nextIndex);
        const nextTrack = queue[nextIndex];
        if (nextTrack && audio) {
          // Track auto-advance to next track
          if (visibleQueueContext) {
            trackAudioNextAuto({
              content_id: nextTrack.id,
              source: visibleQueueContext.source,
              category_id: visibleQueueContext.categoryId,
              queue_enabled: true,
              position_in_queue: nextIndex,
              queue_length: queue.length,
            });

            // Track play start for auto-advanced track if not already tracked
            if (!hasTrackedPlayStartRef.current[nextTrack.id]) {
              trackContentPlayStarted({
                content_name: nextTrack.title,
                content_category: nextTrack.category,
                content_id: nextTrack.id,
                surface: 'dashboard',
              });
              hasTrackedPlayStartRef.current[nextTrack.id] = true;
            }
          }
          audio.src = nextTrack.audioUrl;
          audio.play().catch(() => {
            setIsPlaying(false);
          });
          setIsPlaying(true);
        }
      }
    };

    const handleLoadStart = () => {
      setIsLoading(true);
    };

    const handleCanPlay = () => {
      setIsLoading(false);
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleError = () => {
      setIsLoading(false);
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('error', handleError);
    };
  }, [activeIndex, queue, activeTrack, visibleQueueContext, trackAudioComplete, trackAudioNextAuto, trackContentPlayStarted]);

  // Persist currentTimeSec and activeTrackId
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      if (activeTrack) {
        localStorage.setItem(
          PLAYBACK_STORAGE_KEYS.activeTrackId,
          activeTrack.id,
        );
        localStorage.setItem(
          PLAYBACK_STORAGE_KEYS.currentTimeSec,
          String(currentTimeSec),
        );
      }
    } catch {
      // Ignore localStorage errors
    }
  }, [activeTrack, currentTimeSec]);

  // Persist selectedCategoryId
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      if (selectedCategoryId) {
        localStorage.setItem(
          PLAYBACK_STORAGE_KEYS.selectedCategoryId,
          selectedCategoryId,
        );
      } else {
        localStorage.removeItem(PLAYBACK_STORAGE_KEYS.selectedCategoryId);
      }
    } catch {
      // Ignore localStorage errors
    }
  }, [selectedCategoryId]);

  // Actions
  const playTrack = useCallback(
    (trackId: string, queueContext?: VisibleQueueContext, tracks?: Track[]) => {
      const audio = audioRef.current;
      if (!audio) {
        return;
      }

      // If new tracks provided, update queue
      if (tracks && tracks.length > 0) {
        setQueue(tracks);
        if (queueContext) {
          setVisibleQueueContext(queueContext);
        }

        // Find track index in new tracks
        const trackIndex = tracks.findIndex(t => t.id === trackId);
        if (trackIndex >= 0) {
          setActiveIndex(trackIndex);
          const track = tracks[trackIndex];
          if (track) {
            // Track play start (only once per session)
            if (!hasTrackedPlayStartRef.current[track.id]) {
              trackContentPlayStarted({
                content_name: track.title,
                content_category: track.category,
                content_id: track.id,
                surface: 'dashboard',
              });
              hasTrackedPlayStartRef.current[track.id] = true;
            }
            // Change audio source
            audio.src = track.audioUrl;
            audio.play().catch(() => {
              setIsPlaying(false);
            });
            setIsPlaying(true);
          }
        }
      } else {
        // Find track in existing queue
        const trackIndex = queue.findIndex(t => t.id === trackId);
        if (trackIndex >= 0) {
          const track = queue[trackIndex];
          if (track) {
            // If same track, just play/resume
            if (activeIndex === trackIndex) {
              // Ensure source is set correctly
              if (!audio.src || !audio.src.includes(track.audioUrl)) {
                audio.src = track.audioUrl;
              }
              // Track play start if not already tracked for this track
              if (!hasTrackedPlayStartRef.current[track.id]) {
                trackContentPlayStarted({
                  content_name: track.title,
                  content_category: track.category,
                  content_id: track.id,
                  surface: 'dashboard',
                });
                hasTrackedPlayStartRef.current[track.id] = true;
              }
              audio.play().catch(() => {
                setIsPlaying(false);
              });
              setIsPlaying(true);
            } else {
              // Different track, change source
              setActiveIndex(trackIndex);
              // Track play start for new track
              if (!hasTrackedPlayStartRef.current[track.id]) {
                trackContentPlayStarted({
                  content_name: track.title,
                  content_category: track.category,
                  content_id: track.id,
                  surface: 'dashboard',
                });
                hasTrackedPlayStartRef.current[track.id] = true;
              }
              audio.src = track.audioUrl;
              audio.play().catch(() => {
                setIsPlaying(false);
              });
              setIsPlaying(true);
            }
          }
        }
      }
    },
    [queue, activeIndex, trackContentPlayStarted],
  );

  const pause = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      setIsPlaying(false);
    }
  }, []);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !activeTrack) {
      return;
    }

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      // Track play start if not already tracked for this track
      if (!hasTrackedPlayStartRef.current[activeTrack.id]) {
        trackContentPlayStarted({
          content_name: activeTrack.title,
          content_category: activeTrack.category,
          content_id: activeTrack.id,
          surface: 'dashboard',
        });
        hasTrackedPlayStartRef.current[activeTrack.id] = true;
      }
      // Ensure audio source is set before playing
      if (!audio.src || !audio.src.includes(activeTrack.audioUrl)) {
        audio.src = activeTrack.audioUrl;
      }
      audio.play().catch(() => {
        setIsPlaying(false);
      });
      setIsPlaying(true);
    }
  }, [isPlaying, activeTrack, trackContentPlayStarted]);

  const seek = useCallback(
    (timeSec: number) => {
      const audio = audioRef.current;
      if (audio && durationSec && activeTrack && visibleQueueContext) {
        const clampedTime = Math.max(0, Math.min(timeSec, durationSec));
        const seekFrom = previousSeekTimeRef.current;
        audio.currentTime = clampedTime;
        setCurrentTimeSec(clampedTime);
        previousSeekTimeRef.current = clampedTime;

        // Track seek events (only if seek is significant, > 2 seconds)
        if (Math.abs(clampedTime - seekFrom) > 2) {
          trackSeek({
            content_id: activeTrack.id,
            source: visibleQueueContext.source,
            category_id: visibleQueueContext.categoryId,
            queue_enabled: true,
            position_in_queue: activeIndex,
            queue_length: queue.length,
            seek_to_sec: clampedTime,
            seek_from_sec: seekFrom,
          });
        }
      } else if (audio && durationSec) {
        const clampedTime = Math.max(0, Math.min(timeSec, durationSec));
        audio.currentTime = clampedTime;
        setCurrentTimeSec(clampedTime);
        previousSeekTimeRef.current = clampedTime;
      }
    },
    [durationSec, activeTrack, visibleQueueContext, activeIndex, queue.length, trackSeek],
  );

  const openPlayer = useCallback(() => {
    setUIMode('player');

    // Track player open
    if (activeTrack && visibleQueueContext) {
      trackPlayerOpen({
        content_id: activeTrack.id,
        source: visibleQueueContext.source,
        category_id: visibleQueueContext.categoryId,
        queue_enabled: true,
        position_in_queue: activeIndex,
        queue_length: queue.length,
      });
    }
  }, [activeTrack, visibleQueueContext, activeIndex, queue.length, trackPlayerOpen]);

  const closePlayer = useCallback(() => {
    setUIMode('inline');
    // Audio continues playing, just UI changes

    // Track player close
    if (activeTrack && visibleQueueContext) {
      trackPlayerClose({
        content_id: activeTrack.id,
        source: visibleQueueContext.source,
        category_id: visibleQueueContext.categoryId,
        queue_enabled: true,
        position_in_queue: activeIndex,
        queue_length: queue.length,
      });
    }
  }, [activeTrack, visibleQueueContext, activeIndex, queue.length, trackPlayerClose]);

  const next = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    if (activeIndex < queue.length - 1) {
      const nextIndex = activeIndex + 1;
      setActiveIndex(nextIndex);
      const nextTrack = queue[nextIndex];
      if (nextTrack && visibleQueueContext) {
        // Track manual next action
        trackAudioNextManual({
          content_id: nextTrack.id,
          source: visibleQueueContext.source,
          category_id: visibleQueueContext.categoryId,
          queue_enabled: true,
          position_in_queue: nextIndex,
          queue_length: queue.length,
        });

        // Track play start for new track if not already tracked
        if (!hasTrackedPlayStartRef.current[nextTrack.id]) {
          trackContentPlayStarted({
            content_name: nextTrack.title,
            content_category: nextTrack.category,
            content_id: nextTrack.id,
            surface: 'dashboard',
          });
          hasTrackedPlayStartRef.current[nextTrack.id] = true;
        }

        const wasPlaying = isPlaying;
        audio.src = nextTrack.audioUrl;
        if (wasPlaying) {
          audio.play().catch(() => {
            setIsPlaying(false);
          });
          setIsPlaying(true);
        }
      }
    }
  }, [activeIndex, queue, isPlaying, visibleQueueContext, trackAudioNextManual, trackContentPlayStarted]);

  const prev = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    // If more than 3 seconds into track, restart current track
    if (currentTimeSec > 3) {
      audio.currentTime = 0;
      setCurrentTimeSec(0);
      previousSeekTimeRef.current = 0;
      return;
    }

    // Otherwise go to previous track
    if (activeIndex > 0) {
      const prevIndex = activeIndex - 1;
      setActiveIndex(prevIndex);
      const prevTrack = queue[prevIndex];
      if (prevTrack && visibleQueueContext) {
        // Track manual prev action
        trackAudioPrevManual({
          content_id: prevTrack.id,
          source: visibleQueueContext.source,
          category_id: visibleQueueContext.categoryId,
          queue_enabled: true,
          position_in_queue: prevIndex,
          queue_length: queue.length,
        });

        // Track play start for previous track if not already tracked
        if (!hasTrackedPlayStartRef.current[prevTrack.id]) {
          trackContentPlayStarted({
            content_name: prevTrack.title,
            content_category: prevTrack.category,
            content_id: prevTrack.id,
            surface: 'dashboard',
          });
          hasTrackedPlayStartRef.current[prevTrack.id] = true;
        }

        const wasPlaying = isPlaying;
        audio.src = prevTrack.audioUrl;
        if (wasPlaying) {
          audio.play().catch(() => {
            setIsPlaying(false);
          });
          setIsPlaying(true);
        }
      }
    } else {
      // At first track, just restart
      audio.currentTime = 0;
      setCurrentTimeSec(0);
      previousSeekTimeRef.current = 0;
    }
  }, [activeIndex, queue, isPlaying, currentTimeSec, visibleQueueContext, trackAudioPrevManual, trackContentPlayStarted]);

  const setQueueContext = useCallback(
    (context: VisibleQueueContext, tracks: Track[]) => {
      const audio = audioRef.current;
      const wasPlaying = isPlaying;
      const previousQueueContext = visibleQueueContext;

      setVisibleQueueContext(context);
      setQueue(tracks);

      // If switching to a new category/context, switch to first track
      const isNewContext
        = !previousQueueContext
          || previousQueueContext.categoryId !== context.categoryId
          || previousQueueContext.source !== context.source;

      if (!audio || tracks.length === 0) {
        return;
      }

      // If switching category/context, jump to the first track and (if playing) keep playing.
      if (isNewContext) {
        const firstTrack = tracks[0];
        if (!firstTrack) {
          return;
        }

        setActiveIndex(0);
        audio.src = firstTrack.audioUrl;
        pendingSeekRef.current = undefined;

        if (wasPlaying) {
          audio.play().catch(() => {
            setIsPlaying(false);
          });
          setIsPlaying(true);
        } else {
          audio.load();
        }
        return;
      }

      // Initial load / refresh: try to restore last active track + time if it exists in this queue.
      const restore = restoreRef.current;
      const restoreIndex = restore.trackId
        ? tracks.findIndex(t => t.id === restore.trackId)
        : -1;

      if (activeIndex < 0) {
        const nextIndex = restoreIndex >= 0 ? restoreIndex : 0;
        const nextTrack = tracks[nextIndex];
        if (!nextTrack) {
          return;
        }

        setActiveIndex(nextIndex);
        audio.src = nextTrack.audioUrl;

        if (restoreIndex >= 0 && restore.timeSec !== undefined) {
          pendingSeekRef.current = restore.timeSec;
        } else {
          pendingSeekRef.current = undefined;
        }

        audio.load();
      }
    },
    [activeIndex, isPlaying, visibleQueueContext],
  );

  const setSelectedCategoryId = useCallback(
    (categoryId: string | undefined) => {
      setSelectedCategoryIdState(categoryId);
    },
    [],
  );

  const togglePlayerEnabled = useCallback(() => {
    setPlayerEnabled((prev) => {
      const newValue = !prev;
      // Persist to localStorage
      try {
        localStorage.setItem(
          PLAYBACK_STORAGE_KEYS.playerEnabled,
          String(newValue),
        );
      } catch {
        // Ignore localStorage errors
      }
      // If turning off, pause playback
      if (!newValue && audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
      return newValue;
    });
  }, []);

  const contextValue = useMemo<PlaybackContextValue>(
    () => ({
      // State
      uiMode,
      playerEnabled,
      queue,
      activeIndex,
      activeTrack,
      isPlaying,
      currentTimeSec,
      durationSec,
      visibleQueueContext,
      selectedCategoryId,
      isLoading,
      // Actions
      playTrack,
      pause,
      togglePlay,
      seek,
      openPlayer,
      closePlayer,
      next,
      prev,
      setQueueContext,
      setSelectedCategoryId,
      togglePlayerEnabled,
    }),
    [
      uiMode,
      playerEnabled,
      queue,
      activeIndex,
      activeTrack,
      isPlaying,
      currentTimeSec,
      durationSec,
      visibleQueueContext,
      selectedCategoryId,
      isLoading,
      playTrack,
      pause,
      togglePlay,
      seek,
      openPlayer,
      closePlayer,
      next,
      prev,
      setQueueContext,
      setSelectedCategoryId,
      togglePlayerEnabled,
    ],
  );

  return (
    <PlaybackContext value={contextValue}>
      {children}
    </PlaybackContext>
  );
}
