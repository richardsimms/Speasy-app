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
  // Single Audio instance
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // State
  const [uiMode, setUIMode] = useState<PlayerUIMode>('inline');
  const [queueEnabled, setQueueEnabled] = useState(false);
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
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTimeSec(0);

      // Auto-advance to next track if available (works even when player is closed)
      if (activeIndex < queue.length - 1) {
        // Play next track
        const nextIndex = activeIndex + 1;
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
  }, [queueEnabled, activeIndex, queue]);

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
      if (audio && durationSec) {
        const clampedTime = Math.max(0, Math.min(timeSec, durationSec));
        audio.currentTime = clampedTime;
        setCurrentTimeSec(clampedTime);
      }
    },
    [durationSec],
  );

  const openPlayer = useCallback(() => {
    setUIMode('player');
    setQueueEnabled(true);
  }, []);

  const closePlayer = useCallback(() => {
    setUIMode('inline');
    setQueueEnabled(false);
    // Audio continues playing, just UI changes
  }, []);

  const next = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    if (activeIndex < queue.length - 1) {
      const nextIndex = activeIndex + 1;
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
  }, [activeIndex, queue, isPlaying]);

  const prev = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    // If more than 3 seconds into track, restart current track
    if (currentTimeSec > 3) {
      audio.currentTime = 0;
      setCurrentTimeSec(0);
      return;
    }

    // Otherwise go to previous track
    if (activeIndex > 0) {
      const prevIndex = activeIndex - 1;
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
      audio.currentTime = 0;
      setCurrentTimeSec(0);
    }
  }, [activeIndex, queue, isPlaying, currentTimeSec]);

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

      if (tracks.length > 0 && isNewContext) {
        const firstTrack = tracks[0];
        if (firstTrack && audio) {
          setActiveIndex(0);
          audio.src = firstTrack.audioUrl;

          // If audio was playing, continue playing the new track
          if (wasPlaying) {
            audio.play().catch(() => {
              setIsPlaying(false);
            });
            setIsPlaying(true);
          } else {
            // Pre-load the audio without playing
            audio.load();
          }
        }
      } else if (tracks.length > 0 && activeIndex < 0) {
        // No active track yet, pre-load first track
        const firstTrack = tracks[0];
        if (firstTrack && audio) {
          setActiveIndex(0);
          audio.src = firstTrack.audioUrl;
          audio.load();
        }
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
      queueEnabled,
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
      queueEnabled,
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
