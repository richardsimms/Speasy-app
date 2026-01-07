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
// eslint-disable-next-line react-refresh/only-export-components
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
// eslint-disable-next-line react-refresh/only-export-components
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
  // Single Audio instance
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const restoreRef = useRef<{ trackId?: string; timeSec?: number }>({});
  const pendingSeekRef = useRef<number | undefined>(undefined);
  const hasTrackedPlayStartRef = useRef<string | null>(null);

  // Analytics
  const {
    trackContentPlayStarted,
    trackContentPlayCompleted,
    trackAudioNextAuto,
    trackAudioNextManual,
    trackAudioPrevManual,
    trackAudioComplete,
    trackSeek,
  } = useContentAnalytics();

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

      // Track play completion
      if (activeTrack) {
        trackContentPlayCompleted({
          content_name: activeTrack.title,
          content_category: activeTrack.category,
          content_id: activeTrack.id,
          surface: 'dashboard',
        });

        trackAudioComplete({
          content_id: activeTrack.id,
          source: visibleQueueContext?.source || 'latest',
          category_id: visibleQueueContext?.categoryId,
          queue_enabled: playerEnabled,
          position_in_queue: activeIndex + 1,
          queue_length: queue.length,
        });

        // Reset play start tracking for next playthrough
        hasTrackedPlayStartRef.current = null;
      }

      // Auto-advance to next track if available (works even when player is closed)
      if (activeIndex < queue.length - 1) {
        // Track auto-advance
        if (activeTrack) {
          trackAudioNextAuto({
            content_id: activeTrack.id,
            source: visibleQueueContext?.source || 'latest',
            category_id: visibleQueueContext?.categoryId,
            queue_enabled: playerEnabled,
            position_in_queue: activeIndex + 1,
            queue_length: queue.length,
          });
        }

        // Play next track
        const nextIndex = activeIndex + 1;
        // Reset play start tracking for new track
        hasTrackedPlayStartRef.current = null;
        setActiveIndex(nextIndex);
        const nextTrack = queue[nextIndex];
        if (nextTrack && audio) {
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

      // Track play start (only once per track session)
      if (
        activeTrack
        && hasTrackedPlayStartRef.current !== activeTrack.id
      ) {
        trackContentPlayStarted({
          content_name: activeTrack.title,
          content_category: activeTrack.category,
          content_id: activeTrack.id,
          surface: 'dashboard',
        });
        hasTrackedPlayStartRef.current = activeTrack.id;
      }
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
  }, [
    activeIndex,
    queue,
    activeTrack,
    visibleQueueContext,
    playerEnabled,
    trackContentPlayCompleted,
    trackContentPlayStarted,
    trackAudioNextAuto,
    trackAudioComplete,
  ]);

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
            // Reset play start tracking for new track
            hasTrackedPlayStartRef.current = null;

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
              audio.play().catch(() => {
                setIsPlaying(false);
              });
              setIsPlaying(true);
            } else {
              // Different track, change source
              // Reset play start tracking for new track
              hasTrackedPlayStartRef.current = null;

              setActiveIndex(trackIndex);
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
    [queue, activeIndex],
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
      // Ensure audio source is set before playing
      if (!audio.src || !audio.src.includes(activeTrack.audioUrl)) {
        audio.src = activeTrack.audioUrl;
      }
      audio.play().catch(() => {
        setIsPlaying(false);
      });
      setIsPlaying(true);
    }
  }, [isPlaying, activeTrack]);

  const seek = useCallback(
    (timeSec: number) => {
      const audio = audioRef.current;
      if (audio && durationSec && activeTrack) {
        const seekFrom = currentTimeSec;
        const clampedTime = Math.max(0, Math.min(timeSec, durationSec));

        // Only track if seeking more than 2 seconds (to avoid tracking every small adjustment)
        if (Math.abs(clampedTime - seekFrom) > 2) {
          trackSeek({
            content_id: activeTrack.id,
            source: visibleQueueContext?.source || 'latest',
            category_id: visibleQueueContext?.categoryId,
            queue_enabled: playerEnabled,
            position_in_queue: activeIndex + 1,
            queue_length: queue.length,
            seek_to_sec: clampedTime,
            seek_from_sec: seekFrom,
          });
        }

        audio.currentTime = clampedTime;
        setCurrentTimeSec(clampedTime);
      }
    },
    [durationSec, activeTrack, currentTimeSec, visibleQueueContext, playerEnabled, activeIndex, queue.length, trackSeek],
  );

  const openPlayer = useCallback(() => {
    setUIMode('player');
  }, []);

  const closePlayer = useCallback(() => {
    setUIMode('inline');
    // Audio continues playing, just UI changes
  }, []);

  const next = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    if (activeIndex < queue.length - 1) {
      // Track manual next
      if (activeTrack) {
        trackAudioNextManual({
          content_id: activeTrack.id,
          source: visibleQueueContext?.source || 'latest',
          category_id: visibleQueueContext?.categoryId,
          queue_enabled: playerEnabled,
          position_in_queue: activeIndex + 1,
          queue_length: queue.length,
        });
      }

      const nextIndex = activeIndex + 1;
      // Reset play start tracking for new track
      hasTrackedPlayStartRef.current = null;

      setActiveIndex(nextIndex);
      const nextTrack = queue[nextIndex];
      if (nextTrack) {
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
  }, [activeIndex, queue, isPlaying, activeTrack, visibleQueueContext, playerEnabled, trackAudioNextManual]);

  const prev = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    // If more than 3 seconds into track, restart current track
    if (currentTimeSec > 3) {
      // Track as seek to start
      if (activeTrack && durationSec) {
        trackSeek({
          content_id: activeTrack.id,
          source: visibleQueueContext?.source || 'latest',
          category_id: visibleQueueContext?.categoryId,
          queue_enabled: playerEnabled,
          position_in_queue: activeIndex + 1,
          queue_length: queue.length,
          seek_to_sec: 0,
          seek_from_sec: currentTimeSec,
        });
      }
      audio.currentTime = 0;
      setCurrentTimeSec(0);
      return;
    }

    // Otherwise go to previous track
    if (activeIndex > 0) {
      // Track manual previous
      if (activeTrack) {
        trackAudioPrevManual({
          content_id: activeTrack.id,
          source: visibleQueueContext?.source || 'latest',
          category_id: visibleQueueContext?.categoryId,
          queue_enabled: playerEnabled,
          position_in_queue: activeIndex + 1,
          queue_length: queue.length,
        });
      }

      const prevIndex = activeIndex - 1;
      // Reset play start tracking for new track
      hasTrackedPlayStartRef.current = null;

      setActiveIndex(prevIndex);
      const prevTrack = queue[prevIndex];
      if (prevTrack) {
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
      if (activeTrack && durationSec) {
        trackSeek({
          content_id: activeTrack.id,
          source: visibleQueueContext?.source || 'latest',
          category_id: visibleQueueContext?.categoryId,
          queue_enabled: playerEnabled,
          position_in_queue: activeIndex + 1,
          queue_length: queue.length,
          seek_to_sec: 0,
          seek_from_sec: currentTimeSec,
        });
      }
      audio.currentTime = 0;
      setCurrentTimeSec(0);
    }
  }, [activeIndex, queue, isPlaying, currentTimeSec, activeTrack, visibleQueueContext, playerEnabled, durationSec, trackAudioPrevManual, trackSeek]);

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

        // Reset play start tracking for new context
        hasTrackedPlayStartRef.current = null;
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

        // Reset play start tracking for initial load
        hasTrackedPlayStartRef.current = null;
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
